-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 01, 2025 at 06:41 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `courses`
--

-- --------------------------------------------------------

--
-- Table structure for table `completed_courses`
--

CREATE TABLE `completed_courses` (
  `id` int(11) NOT NULL,
  `student_email` varchar(255) DEFAULT NULL,
  `course_name` varchar(255) DEFAULT NULL,
  `term` varchar(100) DEFAULT NULL,
  `grade` varchar(10) DEFAULT NULL
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
(10, 'cos30degrees@gmail.com', 'CS 252', '200', 'A');

-- --------------------------------------------------------

--
-- Table structure for table `courseadvising`
--

CREATE TABLE `courseadvising` (
  `id` bigint(255) NOT NULL,
  `date` varchar(100) NOT NULL,
  `current_term` varchar(100) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `last_term` varchar(100) DEFAULT NULL,
  `last_gpa` varchar(50) DEFAULT NULL,
  `prerequisites` varchar(100) DEFAULT NULL,
  `student_name` varchar(100) NOT NULL,
  `planned_courses` longtext DEFAULT NULL,
  `student_email` varchar(100) NOT NULL,
  `rejectionReason` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courseadvising`
--

INSERT INTO `courseadvising` (`id`, `date`, `current_term`, `status`, `last_term`, `last_gpa`, `prerequisites`, `student_name`, `planned_courses`, `student_email`, `rejectionReason`) VALUES
(124, '2025-04-01', 'Summer 2025', 'Pending', 'Summer 2025', '3.4', 'CS 250, CS252, CS 170', 'josh baker', '\"CS 355, CS 270\"', 'cos30degrees@gmail.com', 'N/A'),
(125, '2025-04-01', 'Summer 2024', 'Pending', 'Spring 2025', '3.7', 'CS 170, CS 252, CS 330, CS 252, CS 330', 'Sean Baker', '\"CS 270, CS 350, CS 350\"', 'cos30degrees@gmail.com', 'N/A'),
(126, '2025-04-01', 'Summer 2025', 'Pending', 'Spring 2025', '4.4', 'CS 252, CS 330, CS 330, CS 350, CS 361', 'Sean Baker', '\"CS 350, CS 410\"', 'cos30degrees@gmail.com', 'N/A'),
(127, '2025-04-01', 'Spring 2025', 'Pending', 'Summer 2025', '1.0', 'CS 250, CS252, None, CS 330, CS 361', 'Sean Baker', '\"CS 355, CS 368, CS 476\"', 'cos30degrees@gmail.com', 'N/A');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `course_name` varchar(100) NOT NULL,
  `course_level` varchar(100) NOT NULL,
  `prerequisite` varchar(100) NOT NULL,
  `course_lvlGroup` varchar(50) NOT NULL
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

CREATE TABLE `user` (
  `u_id` int(11) NOT NULL,
  `u_first_name` varchar(50) NOT NULL,
  `u_last_name` varchar(50) NOT NULL,
  `u_email` varchar(100) NOT NULL,
  `u_password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `is_approved` tinyint(1) DEFAULT 0,
  `verification_code` varchar(255) DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `verification_token` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`u_id`, `u_first_name`, `u_last_name`, `u_email`, `u_password`, `is_admin`, `is_approved`, `verification_code`, `otp_expires_at`, `created_at`, `updated_at`, `verification_token`, `is_verified`) VALUES
(2, 'sean', 'baker', 'seancameronbaker@gmail.com', '$2b$10$oluhKh1BvqhIO4As8AoNb.yW4aL23MkpIQiGxVyKwDLC3s7jfl.qe', 1, 0, NULL, NULL, '2025-03-07 16:39:39', '2025-03-30 17:30:23', NULL, 1),
(6, 'Sean', 'Baker', 'cos30degrees@gmail.com', '$2b$10$G.xsJb9UtapY7WpAD5dII.HndwTGgKd2ldbmT8NzfS4X5y1FbpwOS', 0, 0, NULL, NULL, '2025-03-07 18:10:26', '2025-03-31 23:56:33', NULL, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `completed_courses`
--
ALTER TABLE `completed_courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courseadvising`
--
ALTER TABLE `courseadvising`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_level`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`u_id`),
  ADD UNIQUE KEY `u_email` (`u_email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `completed_courses`
--
ALTER TABLE `completed_courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `courseadvising`
--
ALTER TABLE `courseadvising`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `u_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
