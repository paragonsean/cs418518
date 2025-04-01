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

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_level`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
