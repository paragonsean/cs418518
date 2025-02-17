-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 17, 2025 at 05:04 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `course_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `u_id` int(255) NOT NULL,
  `u_first_name` varchar(20) NOT NULL,
  `u_last_name` varchar(20) NOT NULL,
  `u_email` varchar(35) NOT NULL,
  `u_password` varchar(200) NOT NULL,
  `is_approved` tinyint(1) NOT NULL,
  `is_admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`u_id`, `u_first_name`, `u_last_name`, `u_email`, `u_password`, `is_approved`, `is_admin`) VALUES
(1, 'Admin', '', '', '$2b$10$xLMFe8hBE4vxQ6r/kzorxefS0MhL3g1BO7dYsO/pb.QQSJhE3k6n6', 1, 1),
(4, 'test', 'test', 'test@test.com', '$2b$10$fihH187/r4aU/HpD6YwFUOaw6rCjrhSyssQiE0IIqIf75S9xiTRzW', 1, 0),
(19, 'james', 'baxter', 'test@gmail.com', '$2b$10$o78ryBTXGbRKy9lqe2TwveB8ndGGtOqI6ep.mGv1XSwzi95aaS/y6', 1, 0),
(64, 'brad', 'wey', 'bradway@email.com', '$2b$10$xLMFe8hBE4vxQ6r/kzorxefS0MhL3g1BO7dYsO/pb.QQSJhE3k6n6', 1, 0),
(79, 'SEAn', 'B', 'sbake021@odu.edu', '$2b$10$xLMFe8hBE4vxQ6r/kzorxefS0MhL3g1BO7dYsO/pb.QQSJhE3k6n6', 1, 0),
(81, 'sean', 'baker', 'seancameronbaker@gmail.com', '$2b$10$xLMFe8hBE4vxQ6r/kzorxefS0MhL3g1BO7dYsO/pb.QQSJhE3k6n6', 1, 1);

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `u_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
