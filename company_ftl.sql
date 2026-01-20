-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 20, 2026 at 05:35 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `company_ftl`
--

-- --------------------------------------------------------

--
-- Table structure for table `applicant_clients`
--

CREATE TABLE `applicant_clients` (
  `id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applicant_clients`
--

INSERT INTO `applicant_clients` (`id`, `applicant_id`, `client_id`, `created_at`) VALUES
(55, 5, 8, '2026-01-20 04:32:11'),
(56, 5, 4, '2026-01-20 04:32:11'),
(57, 5, 5, '2026-01-20 04:32:11');

-- --------------------------------------------------------

--
-- Table structure for table `assessment_history`
--

CREATE TABLE `assessment_history` (
  `id` int(11) NOT NULL,
  `applicant_no` varchar(50) NOT NULL,
  `action` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assessment_history`
--

INSERT INTO `assessment_history` (`id`, `applicant_no`, `action`, `status`, `notes`, `created_at`) VALUES
(1, '2323223', 'Status Updated', 'Physical Screening', NULL, '2025-11-03 10:13:58'),
(2, '2323223', 'Status Updated', 'Initial Interview', NULL, '2025-11-03 10:14:08'),
(3, '2323223', 'Status Updated', 'Metrex', NULL, '2025-11-03 10:16:02'),
(4, '123', 'Status Updated', 'Initial Interview', NULL, '2025-11-03 10:54:17'),
(5, '2323223', 'Status Updated', 'For SBMA Gate Pass', NULL, '2025-11-03 12:06:13'),
(6, '12', 'Status Updated', 'Doc Screening', NULL, '2025-11-03 12:08:55'),
(7, '12', 'Status Updated', 'Initial Interview', NULL, '2025-11-03 12:09:18'),
(8, '2323223', 'Status Updated', 'On Boarding', NULL, '2025-11-03 12:53:23'),
(9, '123', 'Status Updated', 'For Screening', NULL, '2025-11-03 13:26:46'),
(10, '123', 'Status Updated', 'Initial Interview', NULL, '2025-11-03 13:28:14'),
(11, '12', 'Status Updated', 'Physical Screening', NULL, '2025-11-07 03:40:47'),
(12, '12', 'Status Updated', 'Initial Interview', NULL, '2025-11-07 03:54:17'),
(13, '123', 'Status Updated', 'For Deployment', NULL, '2025-11-07 03:54:47'),
(14, '123', 'Status Updated', 'Deployed', NULL, '2025-11-08 03:21:25'),
(15, '12', 'Status Updated', 'For Final Interview/For Assessment', NULL, '2026-01-20 03:10:39'),
(16, '12', 'Initial Interview Complete - Proceeded to Assessment', 'For Final Interview/For Assessment', 'Initial interview completed, proceeding to assessment', '2026-01-20 03:10:39'),
(17, '12', 'Proceeded to Selection', 'For Completion', NULL, '2026-01-20 03:18:20'),
(18, '12', 'Status Updated', 'For Completion', NULL, '2026-01-20 03:18:20'),
(19, '12', 'Status Updated', 'For Final Interview/For Assessment', NULL, '2026-01-20 03:19:03'),
(20, '12', 'Initial Interview Complete - Proceeded to Assessment', 'For Final Interview/For Assessment', 'Initial interview completed, proceeding to assessment', '2026-01-20 03:19:03'),
(21, '2323223', 'Status Updated', 'Deployed', NULL, '2026-01-20 03:23:18'),
(22, '12', 'Status Updated', 'For Final Interview/For Assessment', NULL, '2026-01-20 03:23:35'),
(23, '12', 'Initial Interview Complete - Proceeded to Assessment', 'For Final Interview/For Assessment', 'Initial interview completed, proceeding to assessment', '2026-01-20 03:23:35'),
(24, '12', 'Status Updated', 'For Final Interview/For Assessment', NULL, '2026-01-20 03:23:49'),
(25, '12', 'Initial Interview Complete - Proceeded to Assessment', 'For Final Interview/For Assessment', 'Initial interview completed, proceeding to assessment', '2026-01-20 03:23:49'),
(26, '2323223', 'Proceeded to Selection', 'For Completion', NULL, '2026-01-20 03:32:17'),
(27, '2323223', 'Status Updated', 'For Completion', NULL, '2026-01-20 03:32:17'),
(28, '2323223', 'Status Updated', 'For Medical', NULL, '2026-01-20 03:32:53'),
(29, '12', 'Proceeded to Selection', 'For Completion', NULL, '2026-01-20 03:39:33'),
(30, '12', 'Status Updated', 'For Completion', NULL, '2026-01-20 03:39:33'),
(31, '12', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:39:54'),
(32, '12', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:39:54'),
(33, '12', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:40:17'),
(34, '12', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:40:17'),
(35, '12', 'Status Updated', 'For Medical', NULL, '2026-01-20 03:40:17'),
(36, '12', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:40:22'),
(37, '12', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:40:22'),
(38, '12', 'Status Updated', 'For SBMA Gate Pass', NULL, '2026-01-20 03:40:22'),
(39, '12', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:40:24'),
(40, '12', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:40:24'),
(41, '12', 'Status Updated', 'For SBMA Gate Pass', NULL, '2026-01-20 03:40:24'),
(42, '12', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:40:24'),
(43, '12', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:40:24'),
(44, '12', 'Status Updated', 'For SBMA Gate Pass', NULL, '2026-01-20 03:40:24'),
(45, '2323223', 'Status Updated', 'For SBMA Gate Pass', NULL, '2026-01-20 03:40:31'),
(46, '1', 'Status Updated', 'For Final Interview/For Assessment', NULL, '2026-01-20 03:45:38'),
(47, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:46:05'),
(48, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:46:05'),
(49, '1', 'Proceeded to Selection', 'For Completion', NULL, '2026-01-20 03:46:17'),
(50, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:46:17'),
(51, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:46:17'),
(52, '1', 'Status Updated', 'For Completion', NULL, '2026-01-20 03:46:17'),
(53, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:46:26'),
(54, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:46:26'),
(55, '1', 'Status Updated', 'For Deployment', NULL, '2026-01-20 03:46:26'),
(56, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:46:40'),
(57, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:46:40'),
(58, '1', 'Status Updated', 'Deployed', NULL, '2026-01-20 03:46:40'),
(59, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:46:57'),
(60, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:46:57'),
(61, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:47:10'),
(62, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:52:42'),
(63, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:52:42'),
(64, '1', 'Status Updated', 'For Deployment', NULL, '2026-01-20 03:52:42'),
(65, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:52:47'),
(66, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:52:47'),
(67, '1', 'Status Updated', 'Deployed', NULL, '2026-01-20 03:52:47'),
(68, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:53:11'),
(69, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:53:11'),
(70, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:53:32'),
(71, '1', 'Proceeded to Selection', 'For Completion', NULL, '2026-01-20 03:59:59'),
(72, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:59:59'),
(73, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 03:59:59'),
(74, '1', 'Status Updated', 'For Completion', NULL, '2026-01-20 03:59:59'),
(75, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:00:04'),
(76, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:00:04'),
(77, '1', 'Status Updated', 'For Medical', NULL, '2026-01-20 04:00:04'),
(78, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:00:15'),
(79, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:00:15'),
(80, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:00:44'),
(81, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:04:20'),
(82, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:04:20'),
(83, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:04:33'),
(84, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:04:42'),
(85, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:06:17'),
(86, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:06:17'),
(87, '1', 'Status Updated', 'For Deployment', NULL, '2026-01-20 04:06:17'),
(88, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:07:34'),
(89, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:07:34'),
(90, '1', 'Status Updated', 'For Final Interview/For Assessment', NULL, '2026-01-20 04:07:34'),
(91, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:23:49'),
(92, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:24:14'),
(93, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:24:14'),
(94, '1', 'Status Updated', 'For Deployment', NULL, '2026-01-20 04:24:14'),
(95, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:24:17'),
(96, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:24:17'),
(97, '1', 'Status Updated', 'For Deployment', NULL, '2026-01-20 04:24:17'),
(98, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:32:11'),
(99, '1', 'Assessment Updated', 'Passed', NULL, '2026-01-20 04:32:11'),
(100, '1', 'Status Updated', 'Deployed', NULL, '2026-01-20 04:32:11');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'DATIAN', '2026-01-20 01:53:28', NULL),
(2, 'HOKEI', '2026-01-20 01:53:28', NULL),
(3, 'POBC', '2026-01-20 01:53:28', NULL),
(4, 'JINBOWAY', '2026-01-20 01:53:28', NULL),
(5, 'SURPRISE', '2026-01-20 01:53:28', NULL),
(6, 'THALESTE', '2026-01-20 01:53:28', NULL),
(7, 'AOLLY', '2026-01-20 01:53:28', NULL),
(8, 'ENJOY', '2026-01-20 01:53:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `engagement_history`
--

CREATE TABLE `engagement_history` (
  `id` int(11) NOT NULL,
  `applicant_no` varchar(50) NOT NULL,
  `action` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recruitment_applicants`
--

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

--
-- Dumping data for table `recruitment_applicants`
--

INSERT INTO `recruitment_applicants` (`id`, `applicant_no`, `referred_by`, `last_name`, `first_name`, `ext`, `middle_name`, `gender`, `size`, `date_of_birth`, `date_applied`, `fb_name`, `age`, `location`, `contact_number`, `position_applied_for`, `experience`, `status`, `requirements_status`, `final_interview_status`, `medical_status`, `status_remarks`, `applicant_remarks`, `recent_picture`, `psa_birth_certificate`, `school_credentials`, `nbi_clearance`, `police_clearance`, `barangay_clearance`, `sss`, `pagibig`, `cedula`, `vaccination_status`, `resume`, `coe`, `philhealth`, `tin_number`, `created_at`, `updated_at`) VALUES
(5, '1', 'facebook', 'Gloria', 'John Ray', 'M', 'Galenzoga', 'Male', '232', '2001-01-22', '2026-01-12', 'John Ray Gloria', '24', 'Olongapo CIty 42', '09391658479', '798', 'fsdfsd', 'Deployed', NULL, 'Passed', NULL, NULL, NULL, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, '2026-01-20 03:45:29', '2026-01-20 04:32:11');

-- --------------------------------------------------------

--
-- Table structure for table `screening_history`
--

CREATE TABLE `screening_history` (
  `id` int(11) NOT NULL,
  `applicant_no` varchar(50) DEFAULT NULL,
  `action` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `screening_history`
--

INSERT INTO `screening_history` (`id`, `applicant_no`, `action`, `status`, `notes`, `created_at`) VALUES
(11, '12', 'Status Updated', 'Physical Screening', NULL, '2025-11-03 07:32:32'),
(12, '123', 'Status Updated', 'Doc Screening', NULL, '2025-11-03 08:30:08'),
(13, '123', 'Status Updated', 'For Screening', NULL, '2025-11-03 08:36:56'),
(14, '123', 'Status Updated', 'Physical Screening', NULL, '2025-11-03 08:43:13'),
(15, '2323223', 'Status Updated', 'Initial Interview', NULL, '2025-11-03 09:12:16'),
(16, '2323223', 'Status Updated', 'Completion', NULL, '2025-11-03 09:15:30'),
(17, '2323223', 'Status Updated', 'Final Interview', NULL, '2025-11-03 09:20:56'),
(18, '2323223', 'Status Updated', 'Completion', NULL, '2025-11-03 09:22:15'),
(19, '2323223', 'Status Updated', 'Initial Interview', NULL, '2025-11-03 09:26:07'),
(20, '2323223', 'Status Updated', 'Completion', NULL, '2025-11-03 09:31:28'),
(21, '2323223', 'Status Updated', 'Physical Screening', NULL, '2025-11-03 09:35:44'),
(22, '12', 'Status Updated', 'Final Interview', NULL, '2025-11-03 09:36:07'),
(23, '12', 'Status Updated', 'Completion', NULL, '2025-11-03 09:37:10'),
(24, '12', 'Status Updated', 'Final Interview', NULL, '2025-11-03 09:37:59'),
(25, '2323223', 'Status Updated', 'Initial Interview', NULL, '2025-11-03 09:39:29'),
(26, '123', 'Status Updated', 'Doc Screening', NULL, '2025-11-03 09:39:34'),
(27, '2323223', 'Status Updated', 'For Screening', NULL, '2025-11-03 09:39:51'),
(28, '12', 'Status Updated', 'Completion', NULL, '2025-11-03 09:40:18'),
(29, '12', 'Status Updated', 'Initial Interview', NULL, '2025-11-03 09:41:44'),
(30, '12', 'Status Updated', 'Completion', NULL, '2025-11-03 09:43:37'),
(31, '12', 'Status Updated', 'Final Interview', NULL, '2025-11-03 09:45:12'),
(32, '12', 'Status Updated', 'Completion', NULL, '2025-11-03 09:46:27'),
(33, '12', 'Status Updated', 'Final Interview', NULL, '2025-11-03 09:48:25'),
(34, '2323223', 'Status Updated', 'Physical Screening', NULL, '2025-11-03 10:13:58'),
(35, '2323223', 'Status Updated', 'Initial Interview', NULL, '2025-11-03 10:14:08'),
(36, '2323223', 'Status Updated', 'Final Interview/Complete Requirements', NULL, '2025-11-03 10:15:05'),
(37, '2323223', 'Status Updated', 'For Medical', NULL, '2025-11-03 10:15:17'),
(38, '2323223', 'Status Updated', 'Metrex', NULL, '2025-11-03 10:16:02'),
(39, '123', 'Status Updated', 'Initial Interview', NULL, '2025-11-03 10:54:17'),
(40, '12', 'Status Updated', 'Physical Screening', NULL, '2025-11-03 12:02:48'),
(41, '123', 'Status Updated', 'Completion', NULL, '2025-11-03 12:05:06'),
(42, '123', 'Status Updated', 'For Medical', NULL, '2025-11-03 12:05:30'),
(43, '2323223', 'Status Updated', 'For SBMA Gate Pass', NULL, '2025-11-03 12:06:13'),
(44, '12', 'Status Updated', 'Doc Screening', NULL, '2025-11-03 12:08:55'),
(45, '12', 'Status Updated', 'Initial Interview', NULL, '2025-11-03 12:09:18'),
(46, '12', 'Status Updated', 'For SBMA Gate Pass', NULL, '2025-11-03 12:09:29'),
(47, '2323223', 'Status Updated', 'On Boarding', NULL, '2025-11-03 12:53:23'),
(48, '123', 'Status Updated', 'For Screening', NULL, '2025-11-03 13:26:46'),
(49, '123', 'Status Updated', 'Initial Interview', NULL, '2025-11-03 13:28:13'),
(50, '12', 'Status Updated', 'Physical Screening', NULL, '2025-11-07 03:40:47'),
(51, '12', 'Status Updated', 'Initial Interview', NULL, '2025-11-07 03:54:17'),
(52, '123', 'Status Updated', 'For Completion', NULL, '2025-11-07 03:54:33'),
(53, '123', 'Status Updated', 'For Deployment', NULL, '2025-11-07 03:54:46'),
(54, '123', 'Status Updated', 'Deployed', NULL, '2025-11-08 03:21:25'),
(55, '12', 'Status Updated', 'For Final Interview/For Assessment', NULL, '2026-01-20 03:10:39'),
(56, '12', 'Status Updated', 'For Completion', NULL, '2026-01-20 03:18:20'),
(57, '12', 'Status Updated', 'For Final Interview/For Assessment', NULL, '2026-01-20 03:19:03'),
(58, '2323223', 'Proceeded to Recruitment Database', 'Deployed', NULL, '2026-01-20 03:23:18'),
(59, '2323223', 'Status Updated', 'Deployed', NULL, '2026-01-20 03:23:18'),
(60, '2323223', 'Proceeded to Assessment', 'For Final Interview/For Assessment', NULL, '2026-01-20 03:23:23'),
(61, '12', 'Status Updated', 'For Final Interview/For Assessment', NULL, '2026-01-20 03:23:35'),
(62, '12', 'Status Updated', 'For Final Interview/For Assessment', NULL, '2026-01-20 03:23:49'),
(63, '2323223', 'Status Updated', 'For Completion', NULL, '2026-01-20 03:32:17'),
(64, '2323223', 'Status Updated', 'For Medical', NULL, '2026-01-20 03:32:53'),
(65, '2323223', 'Proceeded to Medical', 'For Medical', 'Moved to medical stage', '2026-01-20 03:32:53'),
(66, '12', 'Status Updated', 'For Completion', NULL, '2026-01-20 03:39:33'),
(67, '12', 'Status Updated', 'For Medical', NULL, '2026-01-20 03:40:17'),
(68, '12', 'Proceeded to Medical', 'For Medical', 'Moved to medical stage', '2026-01-20 03:40:17'),
(69, '12', 'Status Updated', 'For SBMA Gate Pass', NULL, '2026-01-20 03:40:22'),
(70, '12', 'Medical Complete - Proceeded to SBMA Gate Pass', 'For SBMA Gate Pass', 'Medical completed, proceeding to SBMA gate pass', '2026-01-20 03:40:22'),
(71, '12', 'Status Updated', 'For SBMA Gate Pass', NULL, '2026-01-20 03:40:24'),
(72, '12', 'Medical Complete - Proceeded to SBMA Gate Pass', 'For SBMA Gate Pass', 'Medical completed, proceeding to SBMA gate pass', '2026-01-20 03:40:24'),
(73, '12', 'Status Updated', 'For SBMA Gate Pass', NULL, '2026-01-20 03:40:24'),
(74, '12', 'Medical Complete - Proceeded to SBMA Gate Pass', 'For SBMA Gate Pass', 'Medical completed, proceeding to SBMA gate pass', '2026-01-20 03:40:24'),
(75, '2323223', 'Status Updated', 'For SBMA Gate Pass', NULL, '2026-01-20 03:40:31'),
(76, '2323223', 'Medical Complete - Proceeded to SBMA Gate Pass', 'For SBMA Gate Pass', 'Medical completed, proceeding to SBMA gate pass', '2026-01-20 03:40:31'),
(77, '1', 'Status Updated', 'For Final Interview/For Assessment', NULL, '2026-01-20 03:45:38'),
(78, '1', 'Proceeded to Assessment', 'For Final Interview/For Assessment', NULL, '2026-01-20 03:45:38'),
(79, '1', 'Status Updated', 'For Completion', NULL, '2026-01-20 03:46:17'),
(80, '1', 'Status Updated', 'For Deployment', NULL, '2026-01-20 03:46:26'),
(81, '1', 'Status Updated', 'Deployed', NULL, '2026-01-20 03:46:40'),
(82, '1', 'Proceeded to Assessment', 'For Final Interview/For Assessment', NULL, '2026-01-20 03:46:47'),
(83, '1', 'Status Updated', 'For Completion', NULL, '2026-01-20 03:47:10'),
(84, '1', 'Status Updated', 'For Deployment', NULL, '2026-01-20 03:52:42'),
(85, '1', 'Status Updated', 'Deployed', NULL, '2026-01-20 03:52:47'),
(86, '1', 'Proceeded to Assessment', 'For Final Interview/For Assessment', NULL, '2026-01-20 03:52:56'),
(87, '1', 'Status Updated', 'For Completion', NULL, '2026-01-20 03:53:32'),
(88, '1', 'Proceeded to Assessment', 'For Final Interview/For Assessment', NULL, '2026-01-20 03:54:11'),
(89, '1', 'Proceeded to Assessment', 'For Final Interview/For Assessment', NULL, '2026-01-20 03:59:43'),
(90, '1', 'Status Updated', 'For Completion', NULL, '2026-01-20 03:59:59'),
(91, '1', 'Status Updated', 'For Medical', NULL, '2026-01-20 04:00:04'),
(92, '1', 'Proceeded to Medical', 'For Medical', 'Moved to medical stage', '2026-01-20 04:00:04'),
(93, '1', 'Proceeded to Assessment', 'For Final Interview/For Assessment', NULL, '2026-01-20 04:00:09'),
(94, '1', 'Status Updated', 'Final Interview/Incomplete Requirements', NULL, '2026-01-20 04:00:44'),
(95, '1', 'Status Updated', 'Final Interview', NULL, '2026-01-20 04:04:33'),
(96, '1', 'Status Updated', 'For Completion', NULL, '2026-01-20 04:04:42'),
(97, '1', 'Status Updated', 'For Deployment', NULL, '2026-01-20 04:06:17'),
(98, '1', 'Returned to Screening', 'For Screening', NULL, '2026-01-20 04:06:52'),
(99, '1', 'Status Updated', 'For Final Interview/For Assessment', NULL, '2026-01-20 04:07:34'),
(100, '1', 'Proceeded to Assessment', 'For Final Interview/For Assessment', NULL, '2026-01-20 04:07:34'),
(101, '1', 'Status Updated', 'For Completion', NULL, '2026-01-20 04:23:49'),
(102, '1', 'Status Updated', 'For Deployment', NULL, '2026-01-20 04:24:14'),
(103, '1', 'Status Updated', 'For Deployment', NULL, '2026-01-20 04:24:17'),
(104, '1', 'Status Updated', 'Deployed', NULL, '2026-01-20 04:32:11');

-- --------------------------------------------------------

--
-- Table structure for table `selection_history`
--

CREATE TABLE `selection_history` (
  `id` int(11) NOT NULL,
  `applicant_no` varchar(50) NOT NULL,
  `action` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

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

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `hr_department`, `password_hash`, `full_name`, `role`, `created_at`, `updated_at`) VALUES
(8, NULL, 'Assessment', '$2a$10$uEROf7CoLu5PR.hzPhcPEOg4L.zL0oiHRoIdabSYE6ZNo8e4ociaa', 'Assessment HR', 2, '2026-01-20 01:28:30', '2026-01-20 04:07:24'),
(9, NULL, 'Engagement', '$2a$10$VZYR.3V35FQ8/CZBSbgfZeyy9mt/0cihF7XgxW.fDJa0IJ/Noa0sG', 'Engagement HR', 4, '2026-01-20 01:28:34', '2026-01-20 04:24:03'),
(10, NULL, 'Admin', '$2a$10$8J7hDpYwOxeYCeSVDDZLkO.VSkrJBNFIeHWdtaHViyo4/EWkN.9gi', 'Admin HR', 0, '2026-01-20 01:29:38', '2026-01-20 01:30:34'),
(11, NULL, 'Screening', '$2a$10$ldfuNSRmFk3wSQLUCAauV.z5UDWkWxc/6ixoobU0sGMm/8yfkVDyS', 'Screening HR', 1, '2026-01-20 01:30:02', NULL),
(12, NULL, 'Selection', '$2a$10$oisJbucTtinxjaAIUD2PkuhdTv5sO5ziQ0b.45Tl4re6SyoiesWKK', 'Selection HR', 3, '2026-01-20 04:12:36', NULL),
(13, NULL, 'Employee Relations', '$2a$10$npk46fBBj1puBbqGD9plFOCOnkBaIVJPJ3MomoNLhmVzBuTGLsqju', 'Employee Relations HR', 5, '2026-01-20 04:32:27', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applicant_clients`
--
ALTER TABLE `applicant_clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_applicant_client` (`applicant_id`,`client_id`),
  ADD KEY `idx_applicant_id` (`applicant_id`),
  ADD KEY `idx_client_id` (`client_id`);

--
-- Indexes for table `assessment_history`
--
ALTER TABLE `assessment_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_assessment_applicant_no` (`applicant_no`),
  ADD KEY `idx_assessment_status` (`status`),
  ADD KEY `idx_assessment_created_at` (`created_at`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_name` (`name`);

--
-- Indexes for table `engagement_history`
--
ALTER TABLE `engagement_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_engagement_applicant_no` (`applicant_no`),
  ADD KEY `idx_engagement_status` (`status`),
  ADD KEY `idx_engagement_created_at` (`created_at`);

--
-- Indexes for table `recruitment_applicants`
--
ALTER TABLE `recruitment_applicants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_applicant_no` (`applicant_no`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `screening_history`
--
ALTER TABLE `screening_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_applicant_no` (`applicant_no`);

--
-- Indexes for table `selection_history`
--
ALTER TABLE `selection_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_selection_applicant_no` (`applicant_no`),
  ADD KEY `idx_selection_status` (`status`),
  ADD KEY `idx_selection_created_at` (`created_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `hr_department` (`hr_department`),
  ADD KEY `idx_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applicant_clients`
--
ALTER TABLE `applicant_clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `assessment_history`
--
ALTER TABLE `assessment_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `engagement_history`
--
ALTER TABLE `engagement_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recruitment_applicants`
--
ALTER TABLE `recruitment_applicants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `screening_history`
--
ALTER TABLE `screening_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `selection_history`
--
ALTER TABLE `selection_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
