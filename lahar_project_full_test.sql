-- phpMyAdmin SQL Dump
-- version 3.3.9.2
-- http://odu.edu.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 12, 2012 at 11:40 AM
-- Server version: 5.0.92
-- PHP Version: 5.3.6

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
  `f_id` int(11) NOT NULL auto_increment,
  `email` varchar(45) default NULL,
  `feedback_description` text,
  `feedback_created` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`f_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `feedback`
--


-- --------------------------------------------------------

--
-- Table structure for table `recover_password`
--

CREATE TABLE IF NOT EXISTS `recover_password` (
  `token` varchar(33) NOT NULL default '',
  `email` varchar(45) default NULL,
  `token_used` tinyint(1) default NULL,
  `token_requested` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `recover_password`
--


-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE IF NOT EXISTS `student` (
  `student_id` int(11) NOT NULL auto_increment,
  `key_used` varchar(45) default NULL,
  `teacher_id` int(11) default NULL,
  `first_name` varchar(45) default NULL,
  `last_name` varchar(45) default NULL,
  `email` varchar(45) default NULL,
  `password` varchar(45) default NULL,
  `accout_created` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`student_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `key_used`, `teacher_id`, `first_name`, `last_name`, `email`, `password`, `accout_created`) VALUES
(1, 'declankey1', 1, 'Mladen', 'Dordevic', 'mladen@odu.edu', '12345', '2012-06-12 11:31:22'),
(2, 'declankey1', 1, 'Steven', 'Wild', 'steven@odu.edu', '12345', '2012-06-12 11:31:30'),
(4, 'declankey1', 1, 'Liza', 'Sherrard', 'liza@odu.edu', '12345', '2012-06-12 11:31:44'),
(5, 'declankey1', 1, 'Kelly ', 'Proto', 'kelly@odu.edu', '12345', '2012-06-12 11:31:57'),
(6, 'declankey1', 1, 'Ted ', 'Rumore', 'ted@odu.edu', '12345', '2012-06-12 11:32:12'),
(7, 'declankey1', 1, 'Carlene ', 'Piedra', 'carlene@odu.edu', '12345', '2012-06-12 11:32:24'),
(8, 'stevenkey1', 2, 'Jamie ', 'Christofferse', 'jamie@jmu.edu', '12345', '2012-06-12 11:32:38'),
(9, 'stevenkey1', 2, 'Darryl ', 'Grisson', 'darryl@jmu.edu', '12345', '2012-06-12 11:32:48'),
(10, 'stevenkey1', 2, 'Cody ', 'Adelson', 'cody@jmu.edu', '12345', '2012-06-12 11:33:07'),
(11, 'stevenkey1', 2, 'Kurt ', 'Belford', 'kurt@jmu.edu', '12345', '2012-06-12 11:33:24'),
(12, 'stevenkey1', 2, 'Noreen', 'Stoval', 'noreen@jmu.edu', '12345', '2012-06-12 11:33:37'),
(13, 'carolkey1', 3, 'Carmella ', 'Schimmel', 'carmella@odu.edu', '12345', '2012-06-12 11:33:59'),
(14, 'carolkey1', 3, 'Carmella ', 'Vaugh', 'carmellav@odu.edu', '12345', '2012-06-12 11:34:15'),
(15, 'carolkey1', 3, 'Neil ', 'Velardi', 'neil@odu.edu', '12345', '2012-06-12 11:34:32'),
(16, 'carolkey1', 3, 'Javier ', 'Fiorenza', 'javier@odu.edu', '12345', '2012-06-12 11:34:46'),
(17, 'carolkey1', 3, 'Milan', 'Panic', 'milan@odu.edu', '12345', '2012-06-12 11:35:01');

-- --------------------------------------------------------

--
-- Table structure for table `student_keys`
--

CREATE TABLE IF NOT EXISTS `student_keys` (
  `key_str` varchar(45) NOT NULL default '',
  `group_name` varchar(45) default NULL,
  `requested_by` int(11) default NULL,
  `requested` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `alowed_students` int(11) default NULL,
  `students_left` int(11) default NULL,
  `group_description` text,
  PRIMARY KEY  (`key_str`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `student_keys`
--

INSERT INTO `student_keys` (`key_str`, `group_name`, `requested_by`, `requested`, `alowed_students`, `students_left`, `group_description`) VALUES
('declankey1', 'Decaln''s group', 1, '2012-06-12 12:29:40', 50, 45, 'Test group for Declan '),
('stevenkey1', 'Steve''s group', 2, '2012-06-12 12:30:53', 50, 45, 'Test group for Steve'),
('carolkey1', 'Carol''s group', 3, '2012-06-12 11:28:55', 50, 45, 'Test group for Carol');

-- --------------------------------------------------------

--
-- Table structure for table `teacher`
--

CREATE TABLE IF NOT EXISTS `teacher` (
  `teacher_id` int(11) NOT NULL auto_increment,
  `key_used` varchar(45) default NULL,
  `first_name` varchar(45) default NULL,
  `last_name` varchar(45) default NULL,
  `institution_name` varchar(45) default NULL,
  `email` varchar(45) default NULL,
  `password` varchar(45) default NULL,
  `accout_created` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`teacher_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `teacher`
--

INSERT INTO `teacher` (`teacher_id`, `key_used`, `first_name`, `last_name`, `institution_name`, `email`, `password`, `accout_created`) VALUES
(1, 'declankey1', 'Declan', 'De Paor', 'Old Dominion University', 'ddepaor@odu.edu', '12345', '2012-06-12 12:03:12'),
(2, 'stevenkey1', 'Steven', 'Whitmeyer', 'James Madison University', 'whitmesj@jmu.edu', '12345', '2012-06-12 12:07:17'),
(3, 'carolkey1', 'Carol', 'Simpson ', 'Old Dominion University', 'csimpson@odu.edu', '12345', '2012-06-12 11:36:47');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_keys`
--

CREATE TABLE IF NOT EXISTS `teacher_keys` (
  `key_str` varchar(45) NOT NULL default '',
  `key_requested` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `key_send_to` varchar(45) default NULL,
  `key_used` tinyint(1) default NULL,
  PRIMARY KEY  (`key_str`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teacher_keys`
--

INSERT INTO `teacher_keys` (`key_str`, `key_requested`, `key_send_to`, `key_used`) VALUES
('declankey1', '2012-06-12 12:02:12', 'ddepaor@odu.edu', 1),
('stevenkey1', '2012-06-12 12:05:26', 'whitmesj@jmu.edu', 1),
('carolkey1', '2012-06-12 11:36:22', 'csimpson@odu.edu', 1);
