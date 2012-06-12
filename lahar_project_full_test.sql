-- phpMyAdmin SQL Dump
-- version 3.3.9.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 12, 2012 at 06:31 PM
-- Server version: 5.5.16
-- PHP Version: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `lahar_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE IF NOT EXISTS `feedback` (
  `f_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(45) DEFAULT NULL,
  `feedback_description` text,
  `feedback_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`f_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `feedback`
--


-- --------------------------------------------------------

--
-- Table structure for table `recover_password`
--

CREATE TABLE IF NOT EXISTS `recover_password` (
  `token` varchar(33) NOT NULL DEFAULT '',
  `email` varchar(45) DEFAULT NULL,
  `token_used` tinyint(1) DEFAULT NULL,
  `token_requested` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `recover_password`
--


-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE IF NOT EXISTS `student` (
  `student_id` int(11) NOT NULL AUTO_INCREMENT,
  `key_used` varchar(45) DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `accout_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=17 ;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `key_used`, `teacher_id`, `first_name`, `last_name`, `email`, `password`, `accout_created`) VALUES
(1, 'declankey1', 1, 'Mladen', 'Dordevic', 'm@odu.edu', '12345', '2012-06-12 12:14:13'),
(2, 'declankey1', 1, 'Steven', 'Wild', 's@odu.edu', '12345', '2012-06-12 12:14:59'),
(4, 'declankey1', 1, 'Liza', 'Sherrard', 'l@odu.edu', '12345', '2012-06-12 12:16:15'),
(5, 'declankey1', 1, 'Kelly ', 'Proto', 'k@odu.edu', '12345', '2012-06-12 12:19:09'),
(6, 'declankey1', 1, 'Ted ', 'Rumore', 't@odu.edu', '12345', '2012-06-12 12:19:41'),
(7, 'declankey1', 1, 'Carlene ', 'Piedra', 'c@odu.edu', '12345', '2012-06-12 12:20:20'),
(8, 'stevenkey1', 2, 'Jamie ', 'Christofferse', 'j@jmu.edu', '12345', '2012-06-12 12:22:01'),
(9, 'stevenkey1', 2, 'Darryl ', 'Grisson', 'd@jmu.edu', '12345', '2012-06-12 12:22:39'),
(10, 'stevenkey1', 2, 'Cody ', 'Adelson', 'a@jmu.edu', '12345', '2012-06-12 12:23:15'),
(11, 'stevenkey1', 2, 'Kurt ', 'Belford', 'k@jmu.edu', '12345', '2012-06-12 12:23:41'),
(12, 'stevenkey1', 2, 'Noreen', 'Stoval', 'n@jmu.edu', '12345', '2012-06-12 12:24:05'),
(13, 'testteacher1key1', 3, 'Carmella ', 'Schimmel', 'c@www', '12345', '2012-06-12 12:25:29'),
(14, 'testteacher1key1', 3, 'Carmella ', 'Vaugh', 'c@www', '12345', '2012-06-12 12:25:56'),
(15, 'testteacher1key1', 3, 'Neil ', 'Velardi', 'n@www', '12345', '2012-06-12 12:26:26'),
(16, 'testteacher1key1', 3, 'Javier ', 'Fiorenza', 'j@www', '12345', '2012-06-12 12:27:02');

-- --------------------------------------------------------

--
-- Table structure for table `student_keys`
--

CREATE TABLE IF NOT EXISTS `student_keys` (
  `key_str` varchar(45) NOT NULL DEFAULT '',
  `group_name` varchar(45) DEFAULT NULL,
  `requested_by` int(11) DEFAULT NULL,
  `requested` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `alowed_students` int(11) DEFAULT NULL,
  `students_left` int(11) DEFAULT NULL,
  `group_description` text,
  PRIMARY KEY (`key_str`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `student_keys`
--

INSERT INTO `student_keys` (`key_str`, `group_name`, `requested_by`, `requested`, `alowed_students`, `students_left`, `group_description`) VALUES
('declankey1', 'Decaln''s group', 1, '2012-06-12 12:29:40', 50, 45, 'Test group for Declan '),
('stevenkey1', 'Steve''s group', 2, '2012-06-12 12:30:53', 50, 45, 'Steves test group'),
('testteacher1key1', 'Testers', 3, '2012-06-12 12:30:16', 50, 45, 'Testers group description ');

-- --------------------------------------------------------

--
-- Table structure for table `teacher`
--

CREATE TABLE IF NOT EXISTS `teacher` (
  `teacher_id` int(11) NOT NULL AUTO_INCREMENT,
  `key_used` varchar(45) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `institution_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `accout_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`teacher_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `teacher`
--

INSERT INTO `teacher` (`teacher_id`, `key_used`, `first_name`, `last_name`, `institution_name`, `email`, `password`, `accout_created`) VALUES
(1, 'declankey1', 'Declan', 'De Paor', 'Old Dominion University', 'ddepaor@odu.edu', '12345', '2012-06-12 12:03:12'),
(2, 'stevenkey1', 'Steven', 'Whitmeyer', 'James Madison University', 'whitmesj@jmu.edu', '12345', '2012-06-12 12:07:17'),
(3, 'testteacher1key1', 'John', 'Doe', 'World University', 'john@www.org', '12345', '2012-06-12 12:10:50');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_keys`
--

CREATE TABLE IF NOT EXISTS `teacher_keys` (
  `key_str` varchar(45) NOT NULL DEFAULT '',
  `key_requested` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `key_send_to` varchar(45) DEFAULT NULL,
  `key_used` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`key_str`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teacher_keys`
--

INSERT INTO `teacher_keys` (`key_str`, `key_requested`, `key_send_to`, `key_used`) VALUES
('declankey1', '2012-06-12 12:02:12', 'ddepaor@odu.edu', 1),
('stevenkey1', '2012-06-12 12:05:26', 'whitmesj@jmu.edu', 1),
('testteacher1key1', '2012-06-12 12:10:42', 'john@www.org', 1);
