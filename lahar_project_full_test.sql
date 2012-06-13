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
(1, 'teacher1', 1, 'Mladen', 'Dordevic', 'm', 'm', '2012-06-12 11:31:22'),

(2, 'teacher1', 1, 'Patricia', 'Campbell', 'patricia.campbell@sru.edu', 'GEOL 101', '2012-06-12 11:31:22'),
(3, 'teacher1', 1, 'Michele', 'Cooke', 'cooke@geo.umass.edu', 'GEOL 101', '2012-06-12 11:31:22'),
(4, 'teacher1', 1, 'Declan', 'De Paor', 'ddepaor@odu.edu', 'GEOL 101', '2012-06-12 11:31:22'),
(5, 'teacher1', 1, 'Elisa', 'Fitz-Diaz', 'fitzdiaz@umich.edu', 'GEOL 101', '2012-06-12 11:31:22'),

(6, 'teacher2', 2, 'Chung', 'Huang', 'chung.huang@uconn.edu', 'STR 202', '2012-06-12 11:31:22'),
(7, 'teacher2', 2, 'Steve', 'Hurst', 'shurst@illinois.edu', 'STR 202', '2012-06-12 11:31:22'),
(8, 'teacher2', 2, 'Keith', 'Klepeis', 'kklepeis@uvm.edu', 'STR 202', '2012-06-12 11:31:22'),
(9, 'teacher2', 2, 'Michelle', 'Markley', 'mmarkley@mtholyoke.edu', 'STR 202', '2012-06-12 11:31:22'),

(10, 'teacher3', 3, 'Gautam', 'Mitra', 'gautam.mitra@rochester.edu', 'TEC 303', '2012-06-12 11:31:22'),
(11, 'teacher3', 3, 'Matty', 'Mookerjee', 'matty.mookerjee@sonoma.edu', 'TEC 303', '2012-06-12 11:31:22'),
(12, 'teacher3', 3, 'Terry', 'Pavlis', 'tlpavlis@utep.edu', 'TEC 303', '2012-06-12 11:31:22'),
(13, 'teacher3', 3, 'Phil', 'Resor', 'presor@wesleyan.edu', 'TEC 303', '2012-06-12 11:31:22'),

(14, 'teacher4', 4, 'Carol', 'Simpson', 'csimpson@odu.edu', 'PHYS 404', '2012-06-12 11:31:22'),
(15, 'teacher4', 4, 'John', 'Singleton', 'jsingleton@mail.utexas.edu', 'PHYS 404', '2012-06-12 11:31:22'),
(16, 'teacher4', 4, 'Sandra', 'Valle', 'zanvalleh@gmail.com', 'PHYS 404', '2012-06-12 11:31:22'),
(17, 'teacher4', 4, 'Steph', 'Maes', 'maess@mail.strose.edu', 'PHYS 404', '2012-06-12 11:31:22');



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
('teacher1', 'Richard''s group', 1, '2012-06-12 12:29:40', 50, 45, 'Test group for Richard '),
('teacher2', 'Tekla''s group', 2, '2012-06-12 12:30:53', 50, 45, 'Test group for Tekla'),
('teacher3', 'Matthew''s group', 3, '2012-06-12 12:30:53', 50, 45, 'Test group for Matthew'),
('teacher4', 'Sarah''s group', 4, '2012-06-12 11:28:55', 50, 45, 'Test group for Sarah');

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
(1, 'teacher1', 'Richard', 'Becker', 'UW-Madison', 'rabecker2@wisc.edu', 'teacher 101', '2012-06-12 12:03:12'),
(2, 'teacher2', 'Tekla', 'Harms', 'Amherst College', 'taharms@amherst.edu', 'teacher 202', '2012-06-12 12:07:17'),
(3, 'teacher3', 'Matthew', 'Massey ', 'U Kentucky', 'matthew.massey@uky.edu', 'teacher 303', '2012-06-12 11:36:47'),
(4, 'teacher4', 'Sarah', 'Roeske ', 'U California Davis', 'smroeske@ucdavis.edu', 'teacher 404', '2012-06-12 11:36:47');
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
('teacher1', '2012-06-12 12:02:12', 'rabecker2@wisc.edu', 1),
('teacher2', '2012-06-12 12:05:26', 'taharms@amherst.edu', 1),
('teacher3', '2012-06-12 11:36:22', 'matthew.massey@uky.edu', 1),
('teacher4', '2012-06-12 11:36:22', 'smroeske@ucdavis.edu', 1);