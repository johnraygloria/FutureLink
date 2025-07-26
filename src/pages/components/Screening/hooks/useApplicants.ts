import { useState } from "react";
import type { User, ApplicationStatus, ScreeningStatus } from "../../../../api/applicant";
import { initialFormState } from '../InputApplicantModal';

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyQ96zMGVDFv1SfRQ4r5ooun4iOGZTNJHOuP_KWI39zBp14GmUmdyfy4K0g4IRf2J6A/exec";

export function useApplicants() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserClick = (user: User) => setSelectedUser(user);
  const handleCloseSidebar = () => setSelectedUser(null);

  const handleStatusChange = (userId: number, newStatus: ApplicationStatus) => {
    setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, status: newStatus } : user));
  };

  const handleScreeningUpdate = (userId: number, key: keyof User, status: ScreeningStatus) => {
    setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, [key]: status } : user));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, [key]: status } : null);
    }
  };

  const handleAddApplicant = async (data: typeof initialFormState) => {
    const payload: Record<string, string> = {
      NO: data.no || '',
      REFFERED_BY: data.referredBy || '',
      LAST_NAME: data.lastName || '',
      FIRST_NAME: data.firstName || '',
      EXT: data.ext || '',
      MIDDLE: data.middle || '',
      GENDER: data.gender || '',
      SIZE: data.size || '',
      DATE_OF_BIRTH: data.dateOfBirth || '',
      DATE_APPLIED: data.dateApplied || '',
      FB_NAME: data.name || '',
      AGE: data.age || '',
      LOCATION: data.location || '',
      CONTACT_NUMBER: data.contactNumber || '',
      POSITION_APPLIED_FOR: data.positionApplied || '',
      EXPERIENCE: data.experience || '',
      DATIAN: data.datian || '',
      HOKEI: data.hokei || '',
      POBC: data.pobc || '',
      JINBOWAY: data.jinboway || '',
      SURPRISE: data.surprise || '',
      THALESTE: data.thaleste || '',
      AOLLY: data.aolly || '',
      ENJOY: data.enjoy || '',
      STATUS: data.status || '',
      REQUIREMENTS_STATUS: data.requirementsStatus || '',
      FINAL_INTERVIEW_STATUS: data.finalInterviewStatus || '',
      MEDICAL_STATUS: data.medicalStatus || '',
      STATUS_REMARKS: data.statusRemarks || '',
      APPLICANT_REMARKS: data.applicantRemarks || '',
    };
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(payload).toString(),
      });
      const newApplicant: User = {
        id: Date.now(),
        name: data.name || `${data.firstName} ${data.lastName}`,
        position: data.positionApplied || '',
        status: data.status || 'Document Screening',
        contactNumber: data.contactNumber || '',
        experience: data.experience || '',
        email: '',
        applicationDate: data.dateApplied || new Date().toISOString(),
        referredBy: data.referredBy,
        lastName: data.lastName,
        firstName: data.firstName,
        ext: data.ext,
        middle: data.middle,
        gender: data.gender,
        size: data.size,
        dateOfBirth: data.dateOfBirth,
        dateApplied: data.dateApplied,
        age: data.age,
        location: data.location,
        no: data.no,
        datian: data.datian || '',
        hokei: data.hokei || '',
        pobc: data.pobc || '',
        jinboway: data.jinboway || '',
        surprise: data.surprise || '',
        thaleste: data.thaleste || '',
        aolly: data.aolly || '',
        enjoy: data.enjoy || '',
        requirementsStatus: data.requirementsStatus || '',
        finalInterviewStatus: data.finalInterviewStatus || '',
        medicalStatus: data.medicalStatus || '',
        statusRemarks: data.statusRemarks || '',
        applicantRemarks: data.applicantRemarks || '',
      };
      setUsers(prev => [...prev, newApplicant]);
    } catch (error) {
      alert("Failed to add applicant to Google Sheet.");
    }
  };

  const handleStatusChangeAndSync = async (userId: number, newStatus: ApplicationStatus) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const payload: Record<string, string> = {
      NO: user.no || '',
      REFFERED_BY: user.referredBy || '',
      LAST_NAME: user.lastName || '',
      FIRST_NAME: user.firstName || '',
      EXT: user.ext || '',
      MIDDLE: user.middle || '',
      GENDER: user.gender || '',
      SIZE: user.size || '',
      DATE_OF_BIRTH: user.dateOfBirth || '',
      DATE_APPLIED: user.dateApplied || '',
      FB_NAME: user.name || '',
      AGE: user.age || '',
      LOCATION: user.location || '',
      CONTACT_NUMBER: user.contactNumber || '',
      POSITION_APPLIED_FOR: user.positionApplied || '',
      EXPERIENCE: user.experience || '',
      DATIAN: user.datian || '',
      HOKEI: user.hokei || '',
      POBC: user.pobc || '',
      JINBOWAY: user.jinboway || '',
      SURPRISE: user.surprise || '',
      THALESTE: user.thaleste || '',
      AOLLY: user.aolly || '',
      ENJOY: user.enjoy || '',
      STATUS: newStatus || '',
      REQUIREMENTS_STATUS: user.requirementsStatus || '',
      FINAL_INTERVIEW_STATUS: user.finalInterviewStatus || '',
      MEDICAL_STATUS: user.medicalStatus || '',
      STATUS_REMARKS: user.statusRemarks || '',
      APPLICANT_REMARKS: user.applicantRemarks || '',
    };
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(payload).toString(),
    });
  };

  const checkApplicantExists = async (no: string, lastName: string, firstName: string) => {
    const url = `/api/applicants?NO=${encodeURIComponent(no)}&LAST_NAME=${encodeURIComponent(lastName)}&FIRST_NAME=${encodeURIComponent(firstName)}`;
    const response = await fetch(url);
    if (!response.ok) return false;
    const data = await response.json();
    return data !== null;
  };

  const filteredUsers = users.filter((user) =>
    (user.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (user.position?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return {
    selectedUser,
    setSelectedUser,
    search,
    setSearch,
    users,
    setUsers,
    isModalOpen,
    setIsModalOpen,
    handleUserClick,
    handleCloseSidebar,
    handleStatusChange,
    handleScreeningUpdate,
    handleAddApplicant,
    handleStatusChangeAndSync,
    checkApplicantExists,
    filteredUsers,
  };
} 