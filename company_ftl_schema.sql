-- Database schema for `company_ftl` (structure only, no data)
-- Generated from company_ftl.sql

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `company_ftl` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `company_ftl`;

-- --------------------------------------------------------

CREATE TABLE `applicant_principals` (
  `id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `principal_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `assessment_history` (
  `id` int(11) NOT NULL,
  `applicant_no` varchar(50) NOT NULL,
  `action` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `principals` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `engagement_history` (
  `id` int(11) NOT NULL,
  `applicant_no` varchar(50) NOT NULL,
  `action` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `recruitment_applicants` (
  `id` int(11) NOT NULL,
  `applicant_no` varchar(50) DEFAULT NULL,
  `referred_by` varchar(150) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `ext` varchar(50) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `size` varchar(20) DEFAULT NULL,
  `date_of_birth` varchar(50) DEFAULT NULL,
  `date_applied` varchar(50) DEFAULT NULL,
  `fb_name` varchar(150) DEFAULT NULL,
  `age` varchar(10) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `contact_number` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `position_applied_for` varchar(150) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `requirements_status` varchar(150) DEFAULT NULL,
  `final_interview_status` varchar(150) DEFAULT NULL,
  `medical_status` varchar(150) DEFAULT NULL,
  `status_remarks` varchar(255) DEFAULT NULL,
  `applicant_remarks` varchar(255) DEFAULT NULL,
  `recent_picture` tinyint(1) DEFAULT 0,
  `psa_birth_certificate` tinyint(1) DEFAULT 0,
  `school_credentials` tinyint(1) DEFAULT 0,
  `nbi_clearance` tinyint(1) DEFAULT 0,
  `police_clearance` tinyint(1) DEFAULT 0,
  `barangay_clearance` tinyint(1) DEFAULT 0,
  `sss` tinyint(1) DEFAULT 0,
  `pagibig` tinyint(1) DEFAULT 0,
  `cedula` tinyint(1) DEFAULT 0,
  `vaccination_status` tinyint(1) DEFAULT 0,
  `resume` tinyint(1) DEFAULT 0,
  `coe` tinyint(1) DEFAULT 0,
  `philhealth` tinyint(1) DEFAULT 0,
  `tin_number` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `screening_history` (
  `id` int(11) NOT NULL,
  `applicant_no` varchar(50) DEFAULT NULL,
  `action` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `selection_history` (
  `id` int(11) NOT NULL,
  `applicant_no` varchar(50) NOT NULL,
  `action` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `hr_department` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `role` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Indexes
-- --------------------------------------------------------

ALTER TABLE `applicant_principals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_applicant_principal` (`applicant_id`,`principal_id`),
  ADD KEY `idx_applicant_id` (`applicant_id`),
  ADD KEY `idx_principal_id` (`principal_id`);

ALTER TABLE `assessment_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_assessment_applicant_no` (`applicant_no`),
  ADD KEY `idx_assessment_status` (`status`),
  ADD KEY `idx_assessment_created_at` (`created_at`);

ALTER TABLE `principals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_name` (`name`);

ALTER TABLE `engagement_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_engagement_applicant_no` (`applicant_no`),
  ADD KEY `idx_engagement_status` (`status`),
  ADD KEY `idx_engagement_created_at` (`created_at`);

ALTER TABLE `recruitment_applicants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_applicant_no` (`applicant_no`),
  ADD KEY `idx_status` (`status`);

ALTER TABLE `screening_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_applicant_no` (`applicant_no`);

ALTER TABLE `selection_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_selection_applicant_no` (`applicant_no`),
  ADD KEY `idx_selection_status` (`status`),
  ADD KEY `idx_selection_created_at` (`created_at`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `hr_department` (`hr_department`),
  ADD KEY `idx_role` (`role`);

-- --------------------------------------------------------
-- AUTO_INCREMENT
-- --------------------------------------------------------

ALTER TABLE `applicant_principals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `assessment_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `principals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `engagement_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `recruitment_applicants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `screening_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `selection_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- --------------------------------------------------------
-- Masterlist employees (Employee Relations)
-- FLI number format: FLI-P00001 (based on auto-increment id)
-- --------------------------------------------------------

CREATE TABLE `masterlist_employees` (
  `id` int(11) NOT NULL,
  `fli_number` varchar(50) NOT NULL,
  `jbw_job_no` varchar(50) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `ext_name` varchar(50) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `principal` varchar(100) DEFAULT NULL,
  `mobile_number` varchar(50) DEFAULT NULL,
  `fb_link` varchar(255) DEFAULT NULL,
  `sbma_id_validity` varchar(50) DEFAULT NULL,
  `email_address` varchar(255) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `date_hired` varchar(50) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `remarks` varchar(255) DEFAULT NULL,
  `position` varchar(150) DEFAULT NULL,
  `shirt` varchar(20) DEFAULT NULL,
  `shoes` varchar(20) DEFAULT NULL,
  `level` varchar(50) DEFAULT NULL,
  `level_remarks` varchar(255) DEFAULT NULL,
  `record_date` varchar(50) DEFAULT NULL,
  `age` varchar(10) DEFAULT NULL,
  `place` varchar(150) DEFAULT NULL,
  `sss` varchar(50) DEFAULT NULL,
  `pagibig` varchar(50) DEFAULT NULL,
  `philhealth` varchar(50) DEFAULT NULL,
  `tin` varchar(50) DEFAULT NULL,
  `house_no` varchar(50) DEFAULT NULL,
  `street` varchar(150) DEFAULT NULL,
  `barangay` varchar(100) DEFAULT NULL,
  `municipality` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `complete_present` varchar(255) DEFAULT NULL,
  `house_no_2` varchar(50) DEFAULT NULL,
  `street_2` varchar(150) DEFAULT NULL,
  `barangay_2` varchar(100) DEFAULT NULL,
  `municipality_2` varchar(100) DEFAULT NULL,
  `province_2` varchar(100) DEFAULT NULL,
  `zip_code_2` varchar(20) DEFAULT NULL,
  `mothers_maiden_name` varchar(150) DEFAULT NULL,
  `fathers_name` varchar(150) DEFAULT NULL,
  `civil_status` varchar(50) DEFAULT NULL,
  `spouses_name` varchar(150) DEFAULT NULL,
  `num_children` varchar(10) DEFAULT NULL,
  `children_ages` varchar(100) DEFAULT NULL,
  `religion` varchar(100) DEFAULT NULL,
  `contact_person` varchar(150) DEFAULT NULL,
  `contact_number` varchar(50) DEFAULT NULL,
  `complete_address` varchar(255) DEFAULT NULL,
  `relation` varchar(100) DEFAULT NULL,
  `last_date_present` varchar(50) DEFAULT NULL,
  `other_remarks` varchar(255) DEFAULT NULL,
  `transfer_status` varchar(100) DEFAULT NULL,
  `applicant_no` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `masterlist_employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_fli_number` (`fli_number`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_applicant_no` (`applicant_no`),
  ADD KEY `idx_principal` (`principal`);

ALTER TABLE `masterlist_employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
