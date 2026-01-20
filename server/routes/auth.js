const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, findUserByHrDepartment, createUserByHrDepartment, updateUserPasswordByHrDepartment, updateUserRoleByHrDepartment } = require('../models/user');
const { ROLES } = require('../config/roles');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Helper function to map HR department name to role
function getRoleFromHrDepartment(hr_department) {
  const deptUpper = hr_department.toUpperCase();
  if (deptUpper === 'ADMIN') return ROLES.ADMIN;
  if (deptUpper.includes('SCREENING')) return ROLES.SCREENING;
  if (deptUpper.includes('ASSESSMENT')) return ROLES.ASSESSMENT;
  if (deptUpper.includes('SELECTION')) return ROLES.SELECTION;
  if (deptUpper.includes('ENGAGEMENT')) return ROLES.ENGAGEMENT;
  if (deptUpper.includes('EMPLOYEE') || deptUpper.includes('RELATIONS')) return ROLES.EMPLOYEE_RELATIONS;
  return ROLES.SCREENING; // Default
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const password_hash = await bcrypt.hash(password, 10);
    const finalRole = Number.isInteger(role) ? role : ROLES.SCREENING;
    const { id } = await createUser({ email, password_hash, full_name, role: finalRole });
    return res.status(201).json({ id, email, full_name, role: finalRole });
  } catch (e) {
    return res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    let { hr_department, password } = req.body;
    console.log('[LOGIN] Request received:', { hr_department, password: password ? '***' : 'missing' });
    
    if (!hr_department || !password) {
      return res.status(400).json({ error: 'HR Department and password are required' });
    }
    // Normalize department
    hr_department = String(hr_department).trim();
    password = String(password).trim();
    const normalized = hr_department.toLowerCase();
    if (normalized === 'screening') hr_department = 'Screening';
    else if (normalized === 'assessment') hr_department = 'Assessment';
    else if (normalized === 'selection') hr_department = 'Selection';
    else if (normalized === 'engagement') hr_department = 'Engagement';
    else if (normalized === 'employee relations' || normalized === 'employeerelations' || normalized === 'employee_relations') hr_department = 'Employee Relations';
    else if (normalized === 'admin') hr_department = 'Admin';
    
    console.log('[LOGIN] Normalized department:', hr_department);
    
    // Find user by HR department
    let user = await findUserByHrDepartment(hr_department);
    console.log('[LOGIN] User found:', user ? { id: user.id, hr_department: user.hr_department, has_hash: !!user.password_hash } : 'null');
    
    // If user doesn't exist, create one automatically with password "1"
    if (!user) {
      console.log('[LOGIN] User not found, creating new user with password "1"');
      const password_hash = await bcrypt.hash('1', 10);
      const role = getRoleFromHrDepartment(hr_department);
      const { id } = await createUserByHrDepartment({ 
        hr_department, 
        password_hash, 
        full_name: hr_department + ' HR', 
        role 
      });
      user = await findUserByHrDepartment(hr_department);
      console.log('[LOGIN] New user created:', { id: user.id });
    }
    
    // Verify password
    console.log('[LOGIN] Comparing password. Provided:', password, 'Hash exists:', !!user.password_hash);
    
    // If no password hash exists, treat as invalid
    if (!user.password_hash) {
      console.log('[LOGIN] No password hash found for user, updating...');
      if (password === '1') {
        const newHash = await bcrypt.hash('1', 10);
        await updateUserPasswordByHrDepartment({ hr_department, password_hash: newHash });
        const refreshed = await findUserByHrDepartment(hr_department);
        user = refreshed || user;
      }
    }
    
    let valid = false;
    if (user.password_hash) {
      valid = await bcrypt.compare(password, user.password_hash);
    }
    console.log('[LOGIN] Initial password check:', valid);
    
    // If password is "1" and hash doesn't match, update to correct hash for "1"
    if (!valid && password === '1') {
      console.log('[LOGIN] Password is "1" but hash doesn\'t match. Updating hash...');
      console.log('[LOGIN] Current hash:', user.password_hash?.substring(0, 30) + '...');
      const newHash = await bcrypt.hash('1', 10);
      console.log('[LOGIN] New hash generated:', newHash.substring(0, 30) + '...');
      const updateResult = await updateUserPasswordByHrDepartment({ hr_department, password_hash: newHash });
      if (updateResult && updateResult.affectedRows > 0) {
        const refreshed = await findUserByHrDepartment(hr_department);
        if (refreshed) {
          user = refreshed;
          console.log('[LOGIN] User refreshed, new hash:', user.password_hash?.substring(0, 30) + '...');
        }
      }
      valid = await bcrypt.compare(password, user.password_hash);
      console.log('[LOGIN] After hash update, password check:', valid);
      if (!valid) {
        // Test hash directly to verify it works
        const testHash = await bcrypt.hash('1', 10);
        const testCompare = await bcrypt.compare('1', testHash);
        console.log('[LOGIN] Direct hash test (should be true):', testCompare);
        console.log('[LOGIN] Comparing "1" with stored hash:', user.password_hash);
      }
    }
    // If Admin and an older hash exists for a different expected password, update to the new Admin password when correct pass is provided
    if (!valid && hr_department === 'Admin' && password === 'MaribelAbataFutureLinkAdmin') {
      const newHash = await bcrypt.hash('MaribelAbataFutureLinkAdmin', 10);
      await updateUserPasswordByHrDepartment({ hr_department: 'Admin', password_hash: newHash });
      const refreshed = await findUserByHrDepartment('Admin');
      user = refreshed || user;
      valid = await bcrypt.compare(password, user.password_hash);
    }
    
    
    if (!valid) {
      console.log('[LOGIN] Authentication failed. Password provided:', password, 'User hash:', user.password_hash?.substring(0, 20) + '...');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('[LOGIN] Authentication successful for:', hr_department);

    // Ensure Admin has correct role (0) even if previously created with default role
    const role = getRoleFromHrDepartment(hr_department);
    // if (hr_department === 'Admin' && user.role !== role) {
    //   // await updateUserRoleByHrDepartment({ hr_department: 'Admin', role });
    //   // const refreshed = await findUserByHrDepartment('Admin');
    //   if (refreshed) user = refreshed;
    // }
    
    // Ensure role in response/token matches computed role for this department
    const computedRole = getRoleFromHrDepartment(hr_department);
    user.role = computedRole;
    const token = jwt.sign({ 
      id: user.id, 
      hr_department: user.hr_department, 
      role: computedRole 
    }, JWT_SECRET, { expiresIn: '7d' });
    
    return res.json({ 
      token, 
      user: { 
        id: user.id, 
        hr_department: user.hr_department, 
        full_name: user.full_name, 
        role: computedRole 
      } 
    });
  } catch (e) {
    console.error('Login error:', e);
    return res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;


