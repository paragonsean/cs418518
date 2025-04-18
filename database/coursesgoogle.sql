-- Google Cloud SQL Compatible Dump
-- Database: courses
-- Generation Time based on original file: Apr 18, 2025 at 06:05 PM
-- NOTE: Timestamps in user table data appear to be future dates (e.g., 2025).

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `courses` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `courses`;

-- Set character sets (using standard syntax or conditional comments)
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Start transaction for atomic import (optional, but good practice)
START TRANSACTION;

-- --------------------------------------------------------
--
-- Table structure for table `completed_courses`
--
DROP TABLE IF EXISTS `completed_courses`; -- Added for idempotency
CREATE TABLE `completed_courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_email` varchar(255) DEFAULT NULL,
  `course_name` varchar(255) DEFAULT NULL,
  `term` varchar(100) DEFAULT NULL,
  `grade` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`) -- Define PK inline
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `completed_courses`
--
INSERT INTO `completed_courses` (`id`, `student_email`, `course_name`, `term`, `grade`) VALUES
(1, 'cos30degrees@gmail.com', 'CS 115', '100', 'A'),
(2, 'cos30degrees@gmail.com', 'CS 120G', '100', 'A'),
(3, 'cos30degrees@gmail.com', 'CS 121G', '100', 'A'),
(4, 'cos30degrees@gmail.com', 'CS 126G', '100', 'A'),
(5, 'cos30degrees@gmail.com', 'CS 150', '100', 'A'),
(6, 'cos30degrees@gmail.com', 'CS 151', '100', 'A'),
(7, 'cos30degrees@gmail.com', 'CS 153', '100', 'A'),
(8, 'cos30degrees@gmail.com', 'CS 170', '100', 'A'),
(9, 'cos30degrees@gmail.com', 'CS 250', '200', 'A'),
(10, 'cos30degrees@gmail.com', 'CS 252', '200', 'A'),
(11, 'cos30degrees@gmail.com', 'CS 361', 'Unknown', 'IP'),
(12, 'cos30degrees@gmail.com', 'CS 361', 'Unknown', 'IP'), -- Note: Duplicate entry?
(13, 'cos30degrees@gmail.com', 'CS 270', 'Unknown', 'IP'),
(14, 'cos30degrees@gmail.com', 'CS 270', 'Unknown', 'IP'), -- Note: Duplicate entry?
(15, 'tan90degrees@gmail.com', 'CS 350', 'Unknown', 'IP'),
(16, 'tan90degrees@gmail.com', 'CS 441', 'Unknown', 'IP'),
(17, 'tan90degrees@gmail.com', 'CS 418', 'Unknown', 'IP'),
(18, 'tan90degrees@gmail.com', 'CS 270', 'Unknown', 'IP'),
(19, 'cos30degrees@gmail.com', 'CS 355', 'Unknown', 'IP'),
(20, 'cos30degrees@gmail.com', 'CS 361', 'Unknown', 'IP'); -- Note: Duplicate entry?

-- --------------------------------------------------------
--
-- Corrected Table structure for table `courseadvising`
-- Removed DEFAULT 'N/A' from `rejectionReason` (longtext)
--
DROP TABLE IF EXISTS `courseadvising`; -- Added for idempotency
CREATE TABLE `courseadvising` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` varchar(100) NOT NULL,
  `current_term` varchar(100) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Pending', -- DEFAULT is OK for VARCHAR
  `last_term` varchar(100) DEFAULT NULL,
  `last_gpa` varchar(50) DEFAULT NULL,
  `prerequisites` varchar(100) DEFAULT NULL,
  `student_name` varchar(100) NOT NULL,
  `planned_courses` longtext DEFAULT NULL,
  `student_email` varchar(100) NOT NULL,
  `rejectionReason` longtext NOT NULL, -- Removed DEFAULT 'N/A'
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courseadvising`
-- Note: Some dates are in YYYY-MM-DD format, others might not be. Storing dates as DATE or DATETIME is recommended.
-- Note: GPA is stored as varchar, storing as DECIMAL or FLOAT might be better for calculations.
-- Note: The duplicate INSERT block below this one has been removed.
INSERT INTO `courseadvising` (`id`, `date`, `current_term`, `status`, `last_term`, `last_gpa`, `prerequisites`, `student_name`, `planned_courses`, `student_email`, `rejectionReason`) VALUES
(128, '2025-04-05', 'Summer 2025', 'Approved', 'Summer 2024', '3.4', 'CS 170', 'Josh Turner', '\"CS 270\"', 'cos30degrees@gmail.com', 'N/A'),
(129, '2025-04-05', 'Summer 2025', 'Approved', 'Spring 2025', '4.0', 'CS 170', 'Josh Turner', '\"CS 270\"', 'cos30degrees@gmail.com', 'N/A'),
(130, '2025-04-05', 'Fall 2025', 'Rejected', 'Summer 2025', '3.3', 'CS 252, CS 330', 'Sean Baker', '\"CS 350\"', 'cos30degrees@gmail.com', 'N/A'), -- Should have a real reason if Rejected? Data shows N/A
(131, '2025-04-06', 'Summer 2024', 'Approved', 'Fall 2025', '4.0', 'CS 250, CS252, CS 250, CS 252', 'Sean Baker', '\"CS 355, CS 361\"', 'cos30degrees@gmail.com', 'N/A'),
(132, '2025-04-06', 'Fall 2025', 'Approved', 'Fall 2025', '5.9', 'CS 250, CS 252', 'Sean Baker', '\"CS 361\"', 'cos30degrees@gmail.com', 'N/A'), -- Note: GPA > 4.0?
(133, '2025-04-05', 'Summer 2025', 'Approved', 'Summer 2025', '3.6', 'CS 252, CS 330, CS 250, CS 330', 'sean baker', '\"CS 350, CS 441\"', 'tan90degrees@gmail.com', 'N/A'),
(134, '2025-04-06', 'Summer 2025', 'Approved', 'Fall 2024', '3.6', 'CS 312, CS 330, CS 170', 'sean baker', '\"CS 418, CS 270\"', 'tan90degrees@gmail.com', 'N/A'),
(135, '2025-04-06', 'Summer 2024', 'Approved', 'Spring 2025', '3.9', 'CS 312, CS 330, CS 312, CS 330', 'Sean Baker', '\"CS 418, CS 418\"', 'cos30degrees@gmail.com', 'N/A'),
(136, '2025-04-06', 'Summer 2025', 'Rejected', 'Spring 2025', '3.7', 'CS 252, CS 330, CS 170, CS 252, CS 361, CS 381', 'Sean Baker', '\"CS 350, CS 270, CS 450\"', 'cos30degrees@gmail.com', 'N/A'); -- Should have a real reason if Rejected? Data shows N/A

-- --------------------------------------------------------
--
-- Table structure for table `courses`
--
DROP TABLE IF EXISTS `courses`; -- Added for idempotency
CREATE TABLE `courses` (
  `course_name` varchar(100) NOT NULL, -- Consider making this the PK if unique? Or add a dedicated ID.
  `course_level` varchar(100) NOT NULL, -- This seems to be the intended PK based on ALTER statement below
  `prerequisite` varchar(100) NOT NULL, -- Consider TEXT if prerequisites list can be very long or complex
  `course_lvlGroup` varchar(50) NOT NULL,
  PRIMARY KEY (`course_level`) -- Define PK inline
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--
INSERT INTO `courses` (`course_name`, `course_level`, `prerequisite`, `course_lvlGroup`) VALUES
('Introduction to Computer Science with Python', 'CS 115', 'None', '100'),
('Introduction to Information Literacy and Research', 'CS 120G', 'None', '100'),
('Introduction to Information Literacy and Research for Scientists', 'CS 121G', 'None', '100'),
('Honors: Introduction to Information Literacy and Research', 'CS 126G', 'CS 120G', '100'),
('Introduction to Programming with C++', 'CS 150', 'None', '100'),
('Introduction to Programming with Java', 'CS 151', 'None', '100'),
('Introduction to Programming with Python', 'CS 153', 'None', '100'),
('Introduction to Computer Architecture I', 'CS 170', 'CS 150', '100'),
('Programming with C++', 'CS 250', 'CS 150', '200'),
('Introduction to Unix for Programmers', 'CS 252', 'CS 150', '200'),
('Introduction to Computer Architecture II', 'CS 270', 'CS 170', '200'),
('Internet Concepts', 'CS 312', 'CS 252', '300'),
('Object-Oriented Design and Programming', 'CS 330', 'CS 250, CS 252', '300'),
('Introduction to Software Engineering', 'CS 350', 'CS 252, CS 330', '300'),
('Principles of Programming Languages', 'CS 355', 'CS 250, CS252', '300'),
('Data Structures and Algorithms', 'CS 361', 'CS 250, CS 252', '300'),
('Computer Science Internship', 'CS 368', 'None', '300'),
('Introduction to Discrete Structures', 'CS 381', 'CS 150', '300'),
('Introduction to Theoretical Computer Science', 'CS 390', 'CS 250, CS 381', '300'),
('Formal Software Foundations', 'CS 402', 'CS 381', '400'),
('Professional Workforce Development I', 'CS 410', 'CS 330, CS 350, CS 361', '400'),
('Professional Workforce Development II', 'CS 411W', 'CS 330, CS 350, CS 410', '400'),
('Computational Methods and Software', 'CS 417', 'CS 250', '400'),
('Web Programming', 'CS 418', 'CS 312, CS 330', '400'),
('Introduction to Machine Learning', 'CS 422', 'CS 150', '400'),
('Web Server Design', 'CS 431', 'CS 150', '400'),
('Web Science', 'CS 432', 'CS 330, CS 361', '400'),
('App Development for Smart Devices', 'CS 441', 'CS 250, CS 330', '400'),
('Database Concepts', 'CS 450', 'CS 252, CS 361, CS 381', '400'),
('Introduction to Networks and Communications', 'CS 455', 'CS 250, CS 252, CS 270', '400'),
('Computer Graphics', 'CS 460', 'CS 361', '400'),
('Principles and Practice of Cyber Defense', 'CS 466', 'CS 250, CS 270, CS 455', '400'),
('Introduction to Reverse Software Engineering', 'CS 467', 'CS 250, CS 270', '400'),
('Data Analytics for Cybersecurity', 'CS 469', 'CS 455', '400'),
('Operating Systems', 'CS 471', 'CS 150, CS 170, CS 361', '400'),
('Network and Systems Security', 'CS 472', 'CS 361', '400'),
('Systems Programming', 'CS 476', 'CS 330, CS 361', '400'),
('Introduction to Artificial Intelligence', 'CS 480', 'CS 361', '400');

-- --------------------------------------------------------
--
-- Table structure for table `user`
--
DROP TABLE IF EXISTS `user`; -- Added for idempotency
CREATE TABLE `user` (
  `u_id` int(11) NOT NULL AUTO_INCREMENT,
  `u_first_name` varchar(50) NOT NULL,
  `u_last_name` varchar(50) NOT NULL,
  `u_email` varchar(100) NOT NULL,
  `u_password` varchar(255) NOT NULL, -- Assumes hashed passwords
  `is_admin` tinyint(1) DEFAULT 0,
  `is_approved` tinyint(1) DEFAULT 0,
  `verification_code` varchar(255) DEFAULT NULL, -- Consider length (e.g., 6 if OTP)
  `otp_expires_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `verification_token` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`u_id`), -- Define PK inline
  UNIQUE KEY `u_email` (`u_email`) -- Define Unique Key inline
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--
-- Note: Timestamps like otp_expires_at, created_at, updated_at seem to be future dates (2025).
-- This might be intentional test data or an artifact of the dump process.
INSERT INTO `user` (`u_id`, `u_first_name`, `u_last_name`, `u_email`, `u_password`, `is_admin`, `is_approved`, `verification_code`, `otp_expires_at`, `created_at`, `updated_at`, `verification_token`, `is_verified`) VALUES
(2, 'sean', 'baker', 'seancameronbaker@gmail.com', '$2b$10$oluhKh1BvqhIO4As8AoNb.yW4aL23MkpIQiGxVyKwDLC3s7jfl.qe', 1, 0, '123456', '2025-04-18 12:12:42', '2025-03-07 16:39:39', '2025-04-18 12:02:42', NULL, 1),
(6, 'Sean', 'Baker', 'cos30degrees@gmail.com', '$2b$10$XelIPFor02mHCozNxgY30.ubBQ26CA.VGimoBlUAfmJ.fSOd9nOYi', 0, 0, NULL, NULL, '2025-03-07 18:10:26', '2025-04-14 10:28:51', NULL, 1),
(8, 'sean', 'baker', 'tan90degrees@gmail.com', '$2b$10$csCULhaP9czuXEnwch92OuycIpAYuLrBKRLvE/tb.ij4/qc6OWqcy', 0, 0, NULL, NULL, '2025-04-05 19:48:27', '2025-04-05 19:49:09', NULL, 1),
(9, 'sean', 'baker', 'pvnpforlife@gmail.com', '$2b$10$VnUH.4yedxdfhFfMdzdiSOkYoIvDqgpJ68Gr.bBxQUU.8/DApOFo6', 0, 0, NULL, NULL, '2025-04-06 01:19:54', '2025-04-06 01:19:54', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InB2bnBmb3JsaWZlQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzOTE2Nzk0LCJleHAiOjE3NDQ1MjE1OTR9.0tgWYQ7L7Zc483KRE9DH33bxhawt5ZUJg773yWnatoI', 0),
(10, 'Sean', 'Baker', 'spocam12@gmail.com', '$2b$10$4evxMTJmIZK./cp/JbrfKO3YUcncrYkr/pqpwEPSk1gWuzrswFO2e', 0, 0, NULL, NULL, '2025-04-06 01:20:49', '2025-04-06 01:20:49', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNwb2NhbTEyQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzOTE2ODQ5LCJleHAiOjE3NDQ1MjE2NDl9.cQ9ZA3pN_Ou8fEHb4I0n-mPSHaA6P7UdglcttkM25zs', 0),
(11, 'Sean', 'Baker', 'pvnpforlifes@gmail.com', '$2b$10$a9DoEAEPo92Otjd0MSB28OC.Gj5RAvUXkUYs0rS7ftmcHrSi74K0e', 0, 0, NULL, NULL, '2025-04-06 01:47:24', '2025-04-06 01:47:24', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InB2bnBmb3JsaWZlc0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MzkxODQ0NCwiZXhwIjoxNzQ0NTIzMjQ0fQ.f8pXDp72siIg3FCkf2uw91Cj0R5CKgzjPEXejvUl95I', 0),
(12, 'Sean', 'Baker', 'pvnpforlifess@gmail.com', '$2b$10$gWOG3mHq.va8pEv9QsmiQec2qRPSAsvWwa1Jbzl.Z/gIMLK1/1SQG', 0, 0, NULL, NULL, '2025-04-06 01:50:35', '2025-04-06 01:50:35', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InB2bnBmb3JsaWZlc3NAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDM5MTg2MzUsImV4cCI6MTc0NDUyMzQzNX0.1XOPCYDuBLwegcsc7jjpfmFivpt2xkqtxvvQpgXGXVY', 0),
(13, 'Sean', 'Baker', 'pvnpforlifesss@gmail.com', '$2b$10$/Y5JafHZCuiRTj/KQd9XLeiwTiRy8WP.aM7bwaWzCMLL4H4vRbUuq', 0, 0, NULL, NULL, '2025-04-06 01:51:00', '2025-04-06 01:51:00', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InB2bnBmb3JsaWZlc3NzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzOTE4NjYwLCJleHAiOjE3NDQ1MjM0NjB9.Ml9rQ5YEM4gfoJVVoqmUh5nzcQlRbkCz-PqTpUFzVE4', 0),
(14, 'Sean', 'Baker', 'cos30degreess@gmail.com', '$2b$10$ZO6XumAGtPykRI1yTM/mgeNrSlpyyx6dHv2pHES0aOh5xlM/KaaFO', 0, 0, NULL, NULL, '2025-04-06 01:51:54', '2025-04-06 01:51:54', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvczMwZGVncmVlc3NAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDM5MTg3MTQsImV4cCI6MTc0NDUyMzUxNH0.ZSNdmZfyEgh2bshZe3FaM4nVLuQ88r-ofgKlhy5oFX0', 0),
(15, 'Sean', 'Baker', 'seancameronbakes@gmail.com', '$2b$10$XdXf6UUQe8fwW8jiBcFKM.2AizwLAh5WamHMCJSbPlwQzUowojP0.', 0, 0, NULL, NULL, '2025-04-06 02:29:41', '2025-04-06 02:29:41', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNlYW5jYW1lcm9uYmFrZXNAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDM5MjA5ODEsImV4cCI6MTc0NDUyNTc4MX0.-GiWoN96x0Pu145wx5yZQcUtV5NogZ31-OKmOvwDxPA', 0);

-- Commit the transaction
COMMIT;

-- Reset character sets to previous values (optional, often not needed)
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;