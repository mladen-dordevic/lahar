-- phpMyAdmin SQL Dump
-- version 3.3.9.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 23, 2012 at 05:35 PM
-- Server version: 5.5.16
-- PHP Version: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `lahart_project`
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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `key_used`, `teacher_id`, `first_name`, `last_name`, `email`, `password`, `accout_created`) VALUES
(1, 'declankey1', 1, 'Mladen', 'Dordevic', 'm', 'm', '2012-05-22 16:28:31'),
(2, 'declankey1', 1, 'Stewen', 'Wild', 's', 's', '2012-05-22 16:28:58'),
(3, 'declankey2', 1, 'Whitney', 'Broks', 'w', 'w', '2012-05-22 16:29:27');

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
('declankey1', 'softmores', 1, '2012-05-22 16:26:38', 50, 44, 'This is the group of the softmore kids ....'),
('declankey2', 'seniors', 1, '2012-05-22 16:27:21', 15, 5, 'Group of older geologis willing to to some exporing');

-- --------------------------------------------------------

--
-- Table structure for table `teacher`
--

CREATE TABLE IF NOT EXISTS `teacher` (
  `teacher_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `institution_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `accout_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `key_used` varchar(45) NOT NULL,
  PRIMARY KEY (`teacher_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `teacher`
--

INSERT INTO `teacher` (`teacher_id`, `first_name`, `last_name`, `institution_name`, `email`, `password`, `accout_created`, `key_used`) VALUES
(1, 'Declan', 'De Paor', 'Old Dominion University', 'd', 'd', '2012-05-22 16:50:42', 'declankey1');

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
('declankey1', '2012-05-22 16:50:26', 'd', 1);
