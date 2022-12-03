-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 03, 2022 at 05:06 PM
-- Server version: 8.0.31
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `discode`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_notifiable_post_comments` (IN `p_post_id` INT UNSIGNED, IN `p_sender_id` INT UNSIGNED, IN `p_content` LONGTEXT CHARSET utf8mb4, IN `p_parent_comment_id` INT UNSIGNED, OUT `@post_comment_id` INT UNSIGNED, OUT `@notifiable_id` INT UNSIGNED)   begin 
	declare p_notifiable_id int unsigned;
	insert into notifiable (source_type) values ('post');
	select max(id) into p_notifiable_id from notifiable;

	insert into post_comments (post_id, sender_id, 
                               content, parent_comment_id, 
                               created_at, notifiable_id)
	values (p_post_id, p_sender_id, p_content, 
            if(p_parent_comment_id=0, null, p_parent_comment_id), 
               now(), p_notifiable_id);
	
    set @post_comment_id = (select max(id) from post_comments);
    set @notifiable_id = p_notifiable_id;
    
    select @post_comment_id, @notifiable_id;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_notifiable_user_channel` (IN `p_user_id` INT UNSIGNED, IN `p_channel_id` INT UNSIGNED, OUT `@user_channel_id` INT)  MODIFIES  DATA begin 
	declare p_notifiable_id int unsigned;
	insert into notifiable (source_type) values ('channel');
	select max(id) into p_notifiable_id from notifiable;

	insert into user_channel (user_id, channel_id, notifiable_id)
	values (p_user_id, p_channel_id, p_notifiable_id);
	
    set @user_channel_id = (select max(id) from user_channel);
    select @user_channel_id;
end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `channels`
--

CREATE TABLE `channels` (
  `id` int UNSIGNED NOT NULL,
  `admin_id` int UNSIGNED NOT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `background_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `channels`
--

INSERT INTO `channels` (`id`, `admin_id`, `title`, `description`, `avatar_url`, `background_url`, `created_at`) VALUES
(5, 2, 'Fullstack-overflow', 'A gathering place for codeholic.', 'https://fullstack.edu.vn/static/media/f8-icon.18cd71cfcfa33566a22b.png', 'https://kinhnghiemlaptrinh.com/wp-content/uploads/2019/09/image1-2-768x432.jpg', '2022-11-11 17:59:52'),
(11, 2, 'Deno', 'A modern runtime for JS and TS.', 'upload\\channel\\1669563463396.jpg', 'upload\\channel\\1669563463397.png', '2022-11-27 22:37:43');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int UNSIGNED NOT NULL,
  `sender_id` int UNSIGNED NOT NULL,
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message_type` enum('text','image','video','audio') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_message_id` int UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `content`, `message_type`, `parent_message_id`, `created_at`, `deleted_at`) VALUES
(164, 5, 'Xin chào👋', 'text', NULL, '2022-11-14 23:50:37', NULL),
(165, 5, '💪🫠🎈', 'image', NULL, '2022-11-15 09:54:51', NULL),
(166, 5, '', 'image', NULL, '2022-11-15 10:28:29', NULL),
(167, 2, '😍 Hello', 'text', NULL, '2022-11-16 16:53:52', NULL),
(168, 2, 'HELLO HELLO', 'text', NULL, '2022-11-18 22:34:12', NULL),
(169, 2, 'HELLO HELLO', 'text', NULL, '2022-11-19 09:57:55', NULL),
(170, 2, '🐱', 'text', NULL, '2022-11-19 09:58:16', NULL),
(171, 2, 'HELLO HELLO', 'text', NULL, '2022-11-19 10:02:19', NULL),
(172, 2, 'HELLO HELLO', 'text', NULL, '2022-11-19 10:04:42', NULL),
(173, 2, 'HELLO HELLO', 'text', NULL, '2022-11-19 10:07:27', NULL),
(174, 2, 'HELLO HELLO', 'text', NULL, '2022-11-19 10:09:50', NULL),
(175, 2, '🏸🏸🏸', 'text', NULL, '2022-11-19 10:14:52', NULL),
(176, 2, 'Hihi', 'text', NULL, '2022-11-20 23:16:27', NULL),
(177, 4, 'hi', 'text', NULL, '2022-11-21 08:21:21', NULL),
(178, 4, 'huhu', 'text', NULL, '2022-11-21 08:23:43', NULL),
(179, 4, 'huhu', 'text', NULL, '2022-11-21 08:24:03', NULL),
(180, 4, ':(', 'text', NULL, '2022-11-21 08:25:23', NULL),
(181, 2, 'it\'s working now', 'text', NULL, '2022-11-21 08:30:44', NULL),
(182, 4, 'nope', 'text', NULL, '2022-11-21 08:30:51', NULL),
(183, 2, 'working already', 'text', NULL, '2022-11-21 08:31:21', NULL),
(184, 4, 'great', 'text', NULL, '2022-11-21 08:42:40', NULL),
(185, 2, 'Welcome to my channel :v', 'text', NULL, '2022-11-22 09:15:35', NULL),
(186, 2, 'good evening', 'text', NULL, '2022-11-22 20:37:38', NULL),
(187, 2, 'spam', 'text', NULL, '2022-11-22 20:37:53', NULL),
(188, 2, 'spam x2', 'text', NULL, '2022-11-22 20:37:57', NULL),
(189, 2, '😆😆😆', 'text', NULL, '2022-11-22 20:38:03', NULL),
(190, 2, 'haha', 'text', NULL, '2022-11-22 20:38:05', NULL),
(191, 2, 'haha', 'text', NULL, '2022-11-22 20:38:07', NULL),
(192, 2, 'haha', 'text', NULL, '2022-11-22 20:38:09', NULL),
(193, 4, 'hmm', 'text', NULL, '2022-11-22 20:39:26', NULL),
(194, 2, 'buggy', 'text', NULL, '2022-11-22 20:39:45', NULL),
(195, 4, 'spam', 'text', NULL, '2022-11-22 20:39:56', NULL),
(196, 4, 'test again', 'text', NULL, '2022-11-22 20:41:18', NULL),
(197, 4, 'test', 'text', NULL, '2022-11-22 20:41:32', NULL),
(198, 4, 'kk', 'text', NULL, '2022-11-22 20:42:15', NULL),
(199, 4, 'not funny', 'text', NULL, '2022-11-22 20:42:29', NULL),
(200, 2, 'it\'s horror', 'text', NULL, '2022-11-22 20:43:44', NULL),
(201, 2, '♾️', 'text', NULL, '2022-11-22 20:45:08', NULL),
(202, 2, '🚩', 'text', NULL, '2022-11-22 20:45:31', NULL),
(203, 4, '👍', 'text', NULL, '2022-11-22 20:46:14', NULL),
(204, 4, 'Hello😍', 'text', NULL, '2022-11-22 21:43:44', NULL),
(205, 4, 'good morning', 'text', NULL, '2022-11-23 08:30:06', NULL),
(206, 7, 'hi guys, i\'m a newbie 😁', 'text', NULL, '2022-11-23 08:31:29', NULL),
(207, 4, 'welcome welcome', 'text', NULL, '2022-11-23 08:37:39', NULL),
(208, 2, 'hey', 'text', NULL, '2022-11-23 13:53:48', NULL),
(209, 4, 'what\'s up', 'text', NULL, '2022-11-23 13:53:55', NULL),
(210, 2, 'i found some bugs 🙂', 'text', NULL, '2022-11-23 13:56:49', NULL),
(211, 7, 'huh?', 'text', NULL, '2022-11-23 13:57:21', NULL),
(212, 7, 'HELLO HELLO', 'text', NULL, '2022-11-23 13:57:43', NULL),
(213, 7, 'huhu', 'text', NULL, '2022-11-23 13:58:21', NULL),
(214, 2, 'hey', 'text', NULL, '2022-11-23 17:08:15', NULL),
(215, 2, '', 'image', NULL, '2022-11-23 17:09:24', NULL),
(216, 2, '😘😘😘', 'text', NULL, '2022-11-23 20:56:32', NULL),
(217, 2, 'send me your solution plz 🙏', 'text', NULL, '2022-11-23 21:22:48', NULL),
(218, 2, 'Anyone here?', 'text', NULL, '2022-11-23 21:23:31', NULL),
(219, 2, 'Test something...', 'text', NULL, '2022-11-23 21:41:09', NULL),
(220, 2, '😆', 'text', NULL, '2022-11-23 21:45:33', NULL),
(223, 4, '👍', 'text', NULL, '2022-11-23 22:02:36', NULL),
(224, 4, '😀', 'text', NULL, '2022-11-23 22:02:47', NULL),
(225, 2, '', 'image', NULL, '2022-11-24 07:15:58', NULL),
(226, 7, 'jooi', 'text', NULL, '2022-11-24 07:17:10', NULL),
(227, 4, '👍', 'text', NULL, '2022-11-24 07:18:13', NULL),
(228, 2, '', 'image', NULL, '2022-11-25 17:23:13', NULL),
(229, 2, '🥹', 'text', NULL, '2022-11-25 17:23:40', NULL),
(230, 2, 'abc\ndef', 'text', NULL, '2022-11-25 23:54:32', NULL),
(231, 2, 'this is a super super super super super super super super super super super super super super super super super super super super super super super super super super super super super super super super super long text 😘', 'text', NULL, '2022-11-25 23:57:42', NULL),
(232, 2, 'aaa\nbbb\nccc', 'text', NULL, '2022-11-25 23:59:12', NULL),
(233, 2, 'hi', 'text', NULL, '2022-11-26 14:59:52', NULL),
(234, 2, 'hola', 'text', NULL, '2022-11-26 15:00:23', NULL),
(235, 2, 'meow', 'text', NULL, '2022-11-26 15:02:07', NULL),
(236, 2, ':v', 'text', NULL, '2022-11-26 15:10:35', NULL),
(237, 2, '😆', 'text', NULL, '2022-11-26 15:10:49', NULL),
(238, 2, '♾️', 'text', NULL, '2022-11-26 15:11:11', NULL),
(239, 7, 'so tricky :(', 'text', NULL, '2022-11-28 09:07:15', NULL),
(240, 7, '🫠', 'text', NULL, '2022-11-28 09:17:47', NULL),
(241, 2, 'huhu', 'text', NULL, '2022-11-28 09:37:55', NULL),
(242, 2, 'sos', 'text', NULL, '2022-11-28 09:40:52', NULL),
(243, 2, '...', 'text', NULL, '2022-11-28 09:41:25', NULL),
(244, 7, '🙄', 'text', NULL, '2022-11-28 09:44:00', NULL),
(245, 7, '🤨', 'text', NULL, '2022-11-28 09:44:36', NULL),
(246, 7, '😮‍💨', 'text', NULL, '2022-11-28 09:44:52', NULL),
(247, 2, '🙃', 'text', NULL, '2022-11-28 09:47:01', NULL),
(248, 2, '🤨', 'text', NULL, '2022-11-28 09:47:26', NULL),
(249, 2, 'this web is so buggy', 'text', NULL, '2022-11-28 09:47:55', NULL),
(250, 2, ':(', 'text', NULL, '2022-11-28 09:48:28', NULL),
(251, 2, 'aaa', 'text', NULL, '2022-11-28 09:49:12', NULL),
(252, 2, 'what is it', 'text', NULL, '2022-11-28 09:49:21', NULL),
(253, 7, ':v', 'text', NULL, '2022-11-28 10:05:02', NULL),
(254, 2, ':(', 'text', NULL, '2022-11-28 10:06:34', NULL),
(255, 2, ':((', 'text', NULL, '2022-11-28 10:09:02', NULL),
(256, 2, ':(((', 'text', NULL, '2022-11-28 10:09:14', NULL),
(257, 2, ':((((', 'text', NULL, '2022-11-28 10:10:09', NULL),
(258, 2, ':(((((', 'text', NULL, '2022-11-28 10:12:43', NULL),
(259, 2, ':(((((((', 'text', NULL, '2022-11-28 10:14:12', NULL),
(260, 2, ':(((', 'text', NULL, '2022-11-28 10:14:28', NULL),
(261, 2, ':}}', 'text', NULL, '2022-11-28 10:20:11', NULL),
(262, 2, '.', 'text', NULL, '2022-11-28 10:21:16', NULL),
(263, 2, ':(', 'text', NULL, '2022-11-28 10:23:07', NULL),
(264, 2, ':(((', 'text', NULL, '2022-11-28 10:26:31', NULL),
(265, 2, ':(', 'text', NULL, '2022-11-28 10:26:42', NULL),
(266, 2, ':((', 'text', NULL, '2022-11-28 10:29:05', NULL),
(267, 2, ':((', 'text', NULL, '2022-11-28 10:29:17', NULL),
(268, 2, ':(', 'text', NULL, '2022-11-28 10:29:28', NULL),
(269, 2, 'kk', 'text', NULL, '2022-11-28 10:30:33', NULL),
(270, 2, 'kkk', 'text', NULL, '2022-11-28 10:31:16', NULL),
(271, 2, 'lll', 'text', NULL, '2022-11-28 10:32:38', NULL),
(272, 2, 'cllclclc', 'text', NULL, '2022-11-28 10:34:01', NULL),
(273, 2, 'kkkasdjads', 'text', NULL, '2022-11-28 10:35:07', NULL),
(274, 2, 'asdadas', 'text', NULL, '2022-11-28 10:35:15', NULL),
(275, 2, 'asdasdas', 'text', NULL, '2022-11-28 10:35:50', NULL),
(276, 2, 'asdas', 'text', NULL, '2022-11-28 10:36:02', NULL),
(277, 2, 'asas', 'text', NULL, '2022-11-28 10:36:11', NULL),
(278, 7, 'aaa', 'text', NULL, '2022-11-28 10:37:41', NULL),
(279, 2, 'hehehehe', 'text', NULL, '2022-11-28 10:37:50', NULL),
(280, 2, 'aaaaa', 'text', NULL, '2022-11-28 10:43:44', NULL),
(281, 2, 'l', 'text', NULL, '2022-11-28 10:43:54', NULL),
(282, 2, 'kk', 'text', NULL, '2022-11-28 10:44:02', NULL),
(283, 7, 'asdasdas', 'text', NULL, '2022-11-28 10:45:48', NULL),
(284, 7, 'kk', 'text', NULL, '2022-11-28 10:45:57', NULL),
(285, 7, 'loi j vay', 'text', NULL, '2022-11-28 10:46:47', NULL),
(286, 7, 'lo j v', 'text', NULL, '2022-11-28 10:47:05', NULL),
(287, 7, 'kk', 'text', NULL, '2022-11-28 10:47:23', NULL),
(288, 7, 'llllll', 'text', NULL, '2022-11-28 10:51:40', NULL),
(289, 2, 'dunno', 'text', NULL, '2022-11-28 13:38:19', NULL),
(290, 7, 'hmm', 'text', NULL, '2022-11-28 13:38:39', NULL),
(291, 2, 'hhh', 'text', NULL, '2022-11-28 13:39:29', NULL),
(292, 2, 'hmm', 'text', NULL, '2022-11-28 13:42:17', NULL),
(293, 2, 'hehe', 'text', NULL, '2022-11-28 13:45:10', NULL),
(294, 2, 'hehe', 'text', NULL, '2022-11-28 13:47:50', NULL),
(295, 2, 'hh', 'text', NULL, '2022-11-28 13:49:07', NULL),
(296, 2, 'hey', 'text', NULL, '2022-11-28 13:50:19', NULL),
(297, 2, 'heyeyeye', 'text', NULL, '2022-11-28 13:50:27', NULL),
(298, 2, 'hehe', 'text', NULL, '2022-11-28 13:50:40', NULL),
(299, 2, 'hey', 'text', NULL, '2022-11-28 13:52:03', NULL),
(300, 2, 'haha', 'text', NULL, '2022-11-28 13:52:15', NULL),
(301, 2, 'a', 'text', NULL, '2022-11-28 13:52:26', NULL),
(302, 2, 'aaksdasd', 'text', NULL, '2022-11-28 13:52:28', NULL),
(303, 2, 'jashdjashjaskhkad', 'text', NULL, '2022-11-28 13:52:52', NULL),
(304, 2, 'jadjasd', 'text', NULL, '2022-11-28 13:53:04', NULL),
(305, 7, 'ajsdas', 'text', NULL, '2022-11-28 13:53:08', NULL),
(306, 2, 'asjasd', 'text', NULL, '2022-11-28 13:53:19', NULL),
(307, 2, 'asas', 'text', NULL, '2022-11-28 13:55:16', NULL),
(308, 2, 'jjhh', 'text', NULL, '2022-11-28 13:55:27', NULL),
(309, 2, 'adas', 'text', NULL, '2022-11-28 14:01:44', NULL),
(310, 2, 'asas', 'text', NULL, '2022-11-28 14:01:48', NULL),
(311, 2, 'kkj', 'text', NULL, '2022-11-28 14:02:21', NULL),
(312, 2, 'akdjaksd', 'text', NULL, '2022-11-28 14:02:27', NULL),
(313, 2, 'maj', 'text', NULL, '2022-11-28 14:02:41', NULL),
(314, 2, 'as', 'text', NULL, '2022-11-28 14:09:47', NULL),
(315, 2, 'asas', 'text', NULL, '2022-11-28 14:09:53', NULL),
(316, 2, 'aaa', 'text', NULL, '2022-11-28 14:10:46', NULL),
(317, 2, 'aa', 'text', NULL, '2022-11-28 14:11:41', NULL),
(318, 2, 'huuh', 'text', NULL, '2022-11-28 14:12:29', NULL),
(319, 2, 'asdas', 'text', NULL, '2022-11-28 14:12:38', NULL),
(320, 2, 'asa', 'text', NULL, '2022-11-28 14:12:54', NULL),
(321, 2, 'asdasd', 'text', NULL, '2022-11-28 14:14:00', NULL),
(322, 2, 'asd', 'text', NULL, '2022-11-28 14:14:20', NULL),
(323, 2, 'asdas', 'text', NULL, '2022-11-28 14:14:22', NULL),
(324, 2, 'adas', 'text', NULL, '2022-11-28 14:14:30', NULL),
(325, 2, 'asdas', 'text', NULL, '2022-11-28 14:14:37', NULL),
(326, 2, 'adsas', 'text', NULL, '2022-11-28 14:14:38', NULL),
(327, 2, 'adasd', 'text', NULL, '2022-11-28 14:14:39', NULL),
(328, 2, 'adsasd', 'text', NULL, '2022-11-28 14:14:40', NULL),
(329, 7, 'dgdg', 'text', NULL, '2022-11-28 14:14:46', NULL),
(330, 7, 'srt', 'text', NULL, '2022-11-28 14:14:59', NULL),
(331, 7, '😃', 'text', NULL, '2022-11-28 14:15:16', NULL),
(332, 2, '☺️', 'text', NULL, '2022-11-28 14:16:48', NULL),
(333, 2, '😀🫠😉🙃😗☺️🤑', 'text', NULL, '2022-11-28 14:17:18', NULL),
(334, 2, 'asdas', 'text', NULL, '2022-11-28 14:20:01', NULL),
(335, 2, 'asdas', 'text', NULL, '2022-11-28 14:20:09', NULL),
(336, 2, 'asdasasasd', 'text', NULL, '2022-11-28 14:20:13', NULL),
(337, 2, 'adss', 'text', NULL, '2022-11-28 14:20:40', NULL),
(338, 2, 'asdas', 'text', NULL, '2022-11-28 14:20:42', NULL),
(339, 2, 'hey', 'text', NULL, '2022-11-28 14:20:47', NULL),
(340, 2, 'hu', 'text', NULL, '2022-11-28 14:21:23', NULL),
(341, 2, 'asdas', 'text', NULL, '2022-11-28 14:21:25', NULL),
(342, 2, 'asdas', 'text', NULL, '2022-11-28 14:21:30', NULL),
(343, 2, 'adas', 'text', NULL, '2022-11-28 14:21:32', NULL),
(344, 2, 'why?', 'text', NULL, '2022-11-28 14:21:37', NULL),
(345, 2, 'i don\'t know why', 'text', NULL, '2022-11-28 14:21:45', NULL),
(346, 2, 'github', 'text', NULL, '2022-11-28 14:22:02', NULL),
(347, 7, 'haha', 'text', NULL, '2022-11-28 14:35:40', NULL),
(348, 2, 'kk', 'text', NULL, '2022-11-28 14:37:01', NULL),
(349, 2, 'waaa', 'text', NULL, '2022-11-28 14:37:20', NULL),
(350, 7, 'aasd', 'text', NULL, '2022-11-28 14:37:33', NULL),
(351, 7, 'asdkasdjaksd', 'text', NULL, '2022-11-28 14:37:34', NULL),
(352, 7, 'hello', 'text', NULL, '2022-11-28 14:44:04', NULL),
(353, 4, 'hh', 'text', NULL, '2022-11-28 14:44:19', NULL),
(354, 4, 'haha', 'text', NULL, '2022-11-28 14:44:31', NULL),
(355, 4, 'haha', 'text', NULL, '2022-11-28 14:44:42', NULL),
(356, 4, 'haha', 'text', NULL, '2022-11-28 14:44:46', NULL),
(357, 4, 'hehe', 'text', NULL, '2022-11-28 14:46:04', NULL),
(358, 4, 'nothing', 'text', NULL, '2022-11-28 14:46:12', NULL),
(359, 4, 'ye', 'text', NULL, '2022-11-28 14:46:51', NULL),
(360, 4, 'not', 'text', NULL, '2022-11-28 14:46:57', NULL),
(361, 4, 'easy', 'text', NULL, '2022-11-28 14:47:08', NULL),
(362, 7, 'wow', 'text', NULL, '2022-11-28 14:47:14', NULL),
(363, 7, 'rere', 'text', NULL, '2022-11-28 14:47:19', NULL),
(364, 7, 'hahah', 'text', NULL, '2022-11-28 14:47:38', NULL),
(365, 4, 'jhasd', 'text', NULL, '2022-11-28 14:47:43', NULL),
(366, 7, 'jhasd', 'text', NULL, '2022-11-28 14:47:47', NULL),
(367, 7, 'jhadas', 'text', NULL, '2022-11-28 14:47:51', NULL),
(368, 4, '👍', 'text', NULL, '2022-11-28 14:48:49', NULL),
(369, 4, 'asd', 'text', NULL, '2022-11-28 14:48:54', NULL),
(370, 7, 'ajsd', 'text', NULL, '2022-11-28 14:49:00', NULL),
(371, 4, 'kkajds', 'text', NULL, '2022-11-28 14:49:03', NULL),
(372, 4, 'kjasd', 'text', NULL, '2022-11-28 14:49:06', NULL),
(373, 4, 'kasd', 'text', NULL, '2022-11-28 14:49:09', NULL),
(374, 7, 'jahsd', 'text', NULL, '2022-11-28 14:49:13', NULL),
(375, 4, 'jhasd', 'text', NULL, '2022-11-28 14:49:17', NULL),
(376, 7, 'jas', 'text', NULL, '2022-11-28 14:49:19', NULL),
(377, 7, 'asjdasdlasjdkjads', 'text', NULL, '2022-11-28 14:49:21', NULL),
(378, 7, 'hihi', 'text', NULL, '2022-11-28 14:53:57', NULL),
(379, 4, 'haha', 'text', NULL, '2022-11-28 15:06:04', NULL),
(380, 4, 'hh', 'text', NULL, '2022-11-28 15:07:35', NULL),
(381, 4, 'hahha', 'text', NULL, '2022-11-28 15:08:08', NULL),
(382, 4, 'haha', 'text', NULL, '2022-11-28 15:09:00', NULL),
(383, 4, 'kadaskd', 'text', NULL, '2022-11-28 15:09:02', NULL),
(384, 4, 'aiiwewue', 'text', NULL, '2022-11-28 15:09:04', NULL),
(385, 4, 'jasdjasdasd', 'text', NULL, '2022-11-28 15:09:05', NULL),
(386, 4, 'ajsdkasdkasdjasd', 'text', NULL, '2022-11-28 15:09:06', NULL),
(387, 4, 'wwww', 'text', NULL, '2022-11-28 15:09:08', NULL),
(388, 4, 'kjaskjaskasd', 'text', NULL, '2022-11-28 15:09:09', NULL),
(389, 4, 'kjkae', 'text', NULL, '2022-11-28 15:09:23', NULL),
(390, 4, 'askasd', 'text', NULL, '2022-11-28 15:09:26', NULL),
(391, 4, 'kjjk', 'text', NULL, '2022-11-28 15:09:27', NULL),
(392, 4, 'ada', 'text', NULL, '2022-11-28 15:12:53', NULL),
(393, 4, 'kajsd', 'text', NULL, '2022-11-28 15:13:20', NULL),
(394, 4, 'hahha', 'text', NULL, '2022-11-28 15:18:03', NULL),
(395, 4, 'asas', 'text', NULL, '2022-11-28 15:18:19', NULL),
(396, 4, 'kasd', 'text', NULL, '2022-11-28 16:24:00', NULL),
(397, 4, 'jad', 'text', NULL, '2022-11-28 17:06:05', NULL),
(398, 4, 'jas', 'text', NULL, '2022-11-28 17:06:16', NULL),
(399, 4, 'asdjsd', 'text', NULL, '2022-11-28 17:06:18', NULL),
(400, 4, 'asas', 'text', NULL, '2022-11-28 17:06:24', NULL),
(401, 4, 'as', 'text', NULL, '2022-11-28 17:06:33', NULL),
(402, 4, 'spam', 'text', NULL, '2022-11-28 17:07:13', NULL),
(403, 4, 'asdasd', 'text', NULL, '2022-11-28 17:07:14', NULL),
(404, 4, 'asdas', 'text', NULL, '2022-11-28 17:07:15', NULL),
(405, 4, 'as', 'text', NULL, '2022-11-28 17:10:16', NULL),
(406, 4, 'ass', 'text', NULL, '2022-11-28 17:10:18', NULL),
(407, 4, 'asss', 'text', NULL, '2022-11-28 17:10:22', NULL),
(408, 4, 'asdkjasdkadjasd', 'text', NULL, '2022-11-28 17:10:24', NULL),
(409, 4, 'ajsdkalasd', 'text', NULL, '2022-11-28 17:10:25', NULL),
(410, 4, 'jiejreor', 'text', NULL, '2022-11-28 17:10:31', NULL),
(411, 4, 'jdkfkdfkdlf;;df;d', 'text', NULL, '2022-11-28 17:10:33', NULL),
(412, 4, 'jjadad', 'text', NULL, '2022-11-28 17:10:42', NULL),
(413, 4, 'jjjjj', 'text', NULL, '2022-11-28 17:10:47', NULL),
(414, 4, 'ádas', 'text', NULL, '2022-11-28 17:11:49', NULL),
(415, 4, 'aaaa', 'text', NULL, '2022-11-28 17:11:51', NULL),
(416, 4, 'ass', 'text', NULL, '2022-11-28 17:11:54', NULL),
(417, 4, 'asasas', 'text', NULL, '2022-11-28 17:11:58', NULL),
(418, 4, 'asasas', 'text', NULL, '2022-11-28 17:12:01', NULL),
(419, 4, 'hhha', 'text', NULL, '2022-11-28 17:12:21', NULL),
(420, 4, 'aas', 'text', NULL, '2022-11-28 17:12:23', NULL),
(421, 4, 'fefeeef', 'text', NULL, '2022-11-28 17:12:26', NULL),
(422, 4, 'egegeg', 'text', NULL, '2022-11-28 17:12:27', NULL),
(423, 4, 'hah', 'text', NULL, '2022-11-28 20:57:13', NULL),
(424, 4, 'asdaasd', 'text', NULL, '2022-11-28 21:14:38', NULL),
(425, 4, 'asdasd', 'text', NULL, '2022-11-28 21:14:40', NULL),
(426, 4, 'asaas', 'text', NULL, '2022-11-28 21:14:42', NULL),
(427, 2, 'k', 'text', NULL, '2022-11-29 15:31:25', NULL),
(428, 2, 'a', 'text', NULL, '2022-11-29 15:32:10', NULL),
(429, 2, 'simple', 'text', NULL, '2022-11-30 22:39:46', NULL),
(430, 2, 'noti', 'text', NULL, '2022-11-30 22:45:56', NULL),
(431, 2, 'kk', 'text', NULL, '2022-11-30 22:49:01', NULL),
(432, 4, 'hmm', 'text', NULL, '2022-11-30 22:50:24', NULL),
(433, 4, 'kk', 'text', NULL, '2022-11-30 22:50:31', NULL),
(434, 4, 'hehe', 'text', NULL, '2022-11-30 22:50:38', NULL),
(435, 2, '\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'text', NULL, '2022-12-01 09:04:56', NULL),
(436, 2, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'text', NULL, '2022-12-01 09:05:08', NULL),
(437, 2, 'aaaaaaaaaaaaaaaaaaaaaaaaa', 'text', NULL, '2022-12-01 09:05:12', NULL),
(438, 2, 'iii', 'text', NULL, '2022-12-01 09:06:52', NULL),
(439, 2, 'kk', 'text', NULL, '2022-12-01 09:07:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `message_attachments`
--

CREATE TABLE `message_attachments` (
  `id` int UNSIGNED NOT NULL,
  `message_id` int UNSIGNED NOT NULL,
  `attachment_content` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `message_attachments`
--

INSERT INTO `message_attachments` (`id`, `message_id`, `attachment_content`) VALUES
(9, 165, 'upload\\msg\\1668480891177.jpeg'),
(10, 166, 'upload\\msg\\1668482909462.png'),
(11, 215, 'upload\\msg\\1669198164375.png'),
(14, 225, 'upload\\msg\\1669248958346.png'),
(15, 228, 'upload\\msg\\1669371793390.png');

-- --------------------------------------------------------

--
-- Table structure for table `message_recipients`
--

CREATE TABLE `message_recipients` (
  `id` int UNSIGNED NOT NULL,
  `recipient_id` int UNSIGNED NOT NULL,
  `recipient_room_id` int UNSIGNED DEFAULT NULL,
  `message_id` int UNSIGNED NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `message_recipients`
--

INSERT INTO `message_recipients` (`id`, `recipient_id`, `recipient_room_id`, `message_id`, `is_read`) VALUES
(313, 5, 28, 164, 1),
(314, 2, 29, 164, 1),
(315, 5, 28, 165, 1),
(316, 2, 29, 165, 1),
(317, 5, 28, 166, 1),
(318, 2, 29, 166, 1),
(319, 5, 28, 167, 1),
(320, 2, 29, 167, 1),
(321, 2, 30, 168, 1),
(322, 4, 31, 168, 1),
(323, 2, 32, 169, 1),
(324, 8, 33, 169, 0),
(325, 2, 32, 170, 1),
(326, 8, 33, 170, 0),
(327, 2, 34, 171, 1),
(328, 7, 35, 171, 1),
(329, 2, 36, 172, 1),
(330, 10, 37, 172, 0),
(331, 2, 38, 173, 1),
(332, 11, 39, 173, 0),
(333, 2, 40, 174, 1),
(334, 12, 41, 174, 0),
(335, 2, 34, 175, 1),
(336, 7, 35, 175, 1),
(337, 2, 40, 176, 1),
(338, 12, 41, 176, 0),
(339, 2, 30, 177, 1),
(340, 4, 31, 177, 1),
(341, 2, 30, 178, 1),
(342, 4, 31, 178, 1),
(343, 2, 30, 179, 1),
(344, 4, 31, 179, 1),
(345, 2, 30, 180, 1),
(346, 4, 31, 180, 1),
(347, 2, 30, 181, 1),
(348, 4, 31, 181, 1),
(349, 2, 30, 182, 1),
(350, 4, 31, 182, 1),
(351, 2, 30, 183, 1),
(352, 4, 31, 183, 1),
(353, 2, 30, 184, 1),
(354, 4, 31, 184, 1),
(355, 2, 43, 185, 1),
(356, 4, 48, 185, 0),
(357, 5, 28, 186, 1),
(358, 2, 29, 186, 1),
(359, 2, 30, 187, 1),
(360, 4, 31, 187, 1),
(361, 2, 30, 188, 1),
(362, 4, 31, 188, 1),
(363, 2, 30, 189, 1),
(364, 4, 31, 189, 1),
(365, 2, 30, 190, 1),
(366, 4, 31, 190, 1),
(367, 2, 30, 191, 1),
(368, 4, 31, 191, 1),
(369, 2, 30, 192, 1),
(370, 4, 31, 192, 1),
(371, 2, 30, 193, 1),
(372, 4, 31, 193, 1),
(373, 2, 30, 194, 1),
(374, 4, 31, 194, 1),
(375, 2, 30, 195, 1),
(376, 4, 31, 195, 1),
(377, 2, 30, 196, 1),
(378, 4, 31, 196, 1),
(379, 2, 30, 197, 1),
(380, 4, 31, 197, 1),
(381, 2, 30, 198, 1),
(382, 4, 31, 198, 1),
(383, 2, 30, 199, 1),
(384, 4, 31, 199, 1),
(385, 2, 30, 200, 1),
(386, 4, 31, 200, 1),
(387, 2, 30, 201, 1),
(388, 4, 31, 201, 1),
(389, 2, 30, 202, 1),
(390, 4, 31, 202, 1),
(391, 2, 30, 203, 1),
(392, 4, 31, 203, 1),
(393, 2, 43, 204, 0),
(394, 4, 48, 204, 1),
(395, 2, 43, 205, 0),
(396, 4, 48, 205, 1),
(397, 7, 53, 205, 0),
(398, 2, 43, 206, 0),
(399, 4, 48, 206, 0),
(400, 7, 53, 206, 1),
(401, 2, 43, 207, 0),
(402, 4, 48, 207, 1),
(403, 7, 53, 207, 0),
(404, 2, 30, 208, 1),
(405, 4, 31, 208, 1),
(406, 2, 30, 209, 1),
(407, 4, 31, 209, 1),
(408, 2, 30, 210, 1),
(409, 4, 31, 210, 1),
(410, 2, 34, 211, 1),
(411, 7, 35, 211, 1),
(412, 7, 57, 212, 1),
(413, 4, 58, 212, 1),
(414, 7, 57, 213, 1),
(415, 4, 58, 213, 1),
(416, 2, 36, 214, 1),
(417, 10, 37, 214, 0),
(418, 5, 28, 215, 1),
(419, 2, 29, 215, 1),
(420, 2, 43, 216, 1),
(421, 4, 48, 216, 0),
(422, 7, 53, 216, 0),
(423, 2, 34, 217, 1),
(424, 7, 35, 217, 1),
(425, 2, 44, 218, 1),
(426, 4, 49, 218, 0),
(427, 7, 54, 218, 0),
(428, 2, 44, 219, 1),
(429, 4, 49, 219, 0),
(430, 7, 54, 219, 0),
(431, 2, 44, 220, 1),
(432, 4, 49, 220, 0),
(433, 7, 54, 220, 0),
(440, 2, 44, 223, 0),
(441, 4, 49, 223, 1),
(442, 7, 54, 223, 0),
(443, 2, 44, 224, 0),
(444, 4, 49, 224, 1),
(445, 7, 54, 224, 0),
(446, 2, 40, 225, 1),
(447, 12, 41, 225, 0),
(448, 2, 44, 226, 0),
(449, 4, 49, 226, 0),
(450, 7, 54, 226, 1),
(451, 2, 44, 227, 0),
(452, 4, 49, 227, 1),
(453, 7, 54, 227, 0),
(454, 2, 34, 228, 1),
(455, 7, 35, 228, 1),
(456, 2, 34, 229, 1),
(457, 7, 35, 229, 1),
(458, 2, 36, 230, 1),
(459, 10, 37, 230, 0),
(460, 2, 36, 231, 1),
(461, 10, 37, 231, 0),
(462, 2, 36, 232, 1),
(463, 10, 37, 232, 0),
(464, 2, 32, 233, 1),
(465, 8, 33, 233, 0),
(466, 2, 38, 234, 1),
(467, 11, 39, 234, 0),
(468, 2, 32, 235, 1),
(469, 8, 33, 235, 0),
(470, 2, 36, 236, 1),
(471, 10, 37, 236, 0),
(472, 5, 28, 237, 1),
(473, 2, 29, 237, 1),
(474, 2, 40, 238, 1),
(475, 12, 41, 238, 0),
(476, 2, 34, 239, 1),
(477, 7, 35, 239, 1),
(478, 2, 34, 240, 1),
(479, 7, 35, 240, 1),
(480, 2, 34, 241, 1),
(481, 7, 35, 241, 1),
(482, 2, 34, 242, 1),
(483, 7, 35, 242, 1),
(484, 2, 34, 243, 1),
(485, 7, 35, 243, 1),
(486, 2, 34, 244, 1),
(487, 7, 35, 244, 1),
(488, 2, 34, 245, 1),
(489, 7, 35, 245, 1),
(490, 2, 34, 246, 1),
(491, 7, 35, 246, 1),
(492, 2, 34, 247, 1),
(493, 7, 35, 247, 1),
(494, 2, 34, 248, 1),
(495, 7, 35, 248, 1),
(496, 2, 34, 249, 1),
(497, 7, 35, 249, 1),
(498, 2, 34, 250, 1),
(499, 7, 35, 250, 1),
(500, 2, 34, 251, 1),
(501, 7, 35, 251, 1),
(502, 2, 34, 252, 1),
(503, 7, 35, 252, 1),
(504, 2, 34, 253, 1),
(505, 7, 35, 253, 1),
(506, 2, 34, 254, 1),
(507, 7, 35, 254, 1),
(508, 2, 34, 255, 1),
(509, 7, 35, 255, 1),
(510, 2, 34, 256, 1),
(511, 7, 35, 256, 1),
(512, 2, 34, 257, 1),
(513, 7, 35, 257, 1),
(514, 2, 34, 258, 1),
(515, 7, 35, 258, 1),
(516, 2, 34, 259, 1),
(517, 7, 35, 259, 1),
(518, 2, 34, 260, 1),
(519, 7, 35, 260, 1),
(520, 2, 34, 261, 1),
(521, 7, 35, 261, 1),
(522, 2, 34, 262, 1),
(523, 7, 35, 262, 1),
(524, 2, 34, 263, 1),
(525, 7, 35, 263, 1),
(526, 2, 34, 264, 1),
(527, 7, 35, 264, 1),
(528, 2, 34, 265, 1),
(529, 7, 35, 265, 1),
(530, 2, 34, 266, 1),
(531, 7, 35, 266, 1),
(532, 2, 34, 267, 1),
(533, 7, 35, 267, 1),
(534, 2, 34, 268, 1),
(535, 7, 35, 268, 1),
(536, 2, 34, 269, 1),
(537, 7, 35, 269, 1),
(538, 2, 34, 270, 1),
(539, 7, 35, 270, 1),
(540, 2, 34, 271, 1),
(541, 7, 35, 271, 1),
(542, 2, 34, 272, 1),
(543, 7, 35, 272, 1),
(544, 2, 34, 273, 1),
(545, 7, 35, 273, 1),
(546, 2, 34, 274, 1),
(547, 7, 35, 274, 1),
(548, 2, 34, 275, 1),
(549, 7, 35, 275, 1),
(550, 2, 34, 276, 1),
(551, 7, 35, 276, 1),
(552, 2, 34, 277, 1),
(553, 7, 35, 277, 1),
(554, 7, 57, 278, 1),
(555, 4, 58, 278, 1),
(556, 2, 34, 279, 1),
(557, 7, 35, 279, 1),
(558, 2, 34, 280, 1),
(559, 7, 35, 280, 1),
(560, 2, 34, 281, 1),
(561, 7, 35, 281, 1),
(562, 2, 34, 282, 1),
(563, 7, 35, 282, 1),
(564, 2, 34, 283, 1),
(565, 7, 35, 283, 1),
(566, 2, 34, 284, 1),
(567, 7, 35, 284, 1),
(568, 2, 34, 285, 1),
(569, 7, 35, 285, 1),
(570, 2, 34, 286, 1),
(571, 7, 35, 286, 1),
(572, 2, 34, 287, 1),
(573, 7, 35, 287, 1),
(574, 2, 34, 288, 1),
(575, 7, 35, 288, 1),
(576, 2, 34, 289, 1),
(577, 7, 35, 289, 1),
(578, 2, 34, 290, 1),
(579, 7, 35, 290, 1),
(580, 2, 34, 291, 1),
(581, 7, 35, 291, 1),
(582, 2, 34, 292, 1),
(583, 7, 35, 292, 1),
(584, 2, 34, 293, 1),
(585, 7, 35, 293, 1),
(586, 2, 34, 294, 1),
(587, 7, 35, 294, 1),
(588, 2, 34, 295, 1),
(589, 7, 35, 295, 1),
(590, 2, 34, 296, 1),
(591, 7, 35, 296, 1),
(592, 2, 34, 297, 1),
(593, 7, 35, 297, 1),
(594, 2, 34, 298, 1),
(595, 7, 35, 298, 1),
(596, 2, 34, 299, 1),
(597, 7, 35, 299, 1),
(598, 2, 34, 300, 1),
(599, 7, 35, 300, 1),
(600, 2, 34, 301, 1),
(601, 7, 35, 301, 1),
(602, 2, 34, 302, 1),
(603, 7, 35, 302, 1),
(604, 2, 34, 303, 1),
(605, 7, 35, 303, 1),
(606, 2, 34, 304, 1),
(607, 7, 35, 304, 1),
(608, 7, 57, 305, 1),
(609, 4, 58, 305, 1),
(610, 5, 28, 306, 0),
(611, 2, 29, 306, 1),
(612, 2, 34, 307, 1),
(613, 7, 35, 307, 1),
(614, 2, 34, 308, 1),
(615, 7, 35, 308, 1),
(616, 2, 34, 309, 1),
(617, 7, 35, 309, 1),
(618, 2, 34, 310, 1),
(619, 7, 35, 310, 1),
(620, 2, 34, 311, 1),
(621, 7, 35, 311, 1),
(622, 2, 34, 312, 1),
(623, 7, 35, 312, 1),
(624, 2, 34, 313, 1),
(625, 7, 35, 313, 1),
(626, 2, 34, 314, 1),
(627, 7, 35, 314, 1),
(628, 2, 34, 315, 1),
(629, 7, 35, 315, 1),
(630, 2, 34, 316, 1),
(631, 7, 35, 316, 1),
(632, 2, 34, 317, 1),
(633, 7, 35, 317, 1),
(634, 2, 34, 318, 1),
(635, 7, 35, 318, 1),
(636, 2, 34, 319, 1),
(637, 7, 35, 319, 1),
(638, 2, 34, 320, 1),
(639, 7, 35, 320, 1),
(640, 2, 34, 321, 1),
(641, 7, 35, 321, 1),
(642, 2, 34, 322, 1),
(643, 7, 35, 322, 1),
(644, 2, 34, 323, 1),
(645, 7, 35, 323, 1),
(646, 2, 34, 324, 1),
(647, 7, 35, 324, 1),
(648, 2, 34, 325, 1),
(649, 7, 35, 325, 1),
(650, 2, 34, 326, 1),
(651, 7, 35, 326, 1),
(652, 2, 34, 327, 1),
(653, 7, 35, 327, 1),
(654, 2, 34, 328, 1),
(655, 7, 35, 328, 1),
(656, 2, 34, 329, 1),
(657, 7, 35, 329, 1),
(658, 2, 34, 330, 1),
(659, 7, 35, 330, 1),
(660, 2, 34, 331, 1),
(661, 7, 35, 331, 1),
(662, 2, 34, 332, 1),
(663, 7, 35, 332, 1),
(664, 2, 34, 333, 1),
(665, 7, 35, 333, 1),
(666, 2, 34, 334, 1),
(667, 7, 35, 334, 1),
(668, 2, 34, 335, 1),
(669, 7, 35, 335, 1),
(670, 2, 34, 336, 1),
(671, 7, 35, 336, 1),
(672, 2, 34, 337, 1),
(673, 7, 35, 337, 1),
(674, 2, 34, 338, 1),
(675, 7, 35, 338, 1),
(676, 2, 34, 339, 1),
(677, 7, 35, 339, 1),
(678, 2, 34, 340, 1),
(679, 7, 35, 340, 1),
(680, 2, 34, 341, 1),
(681, 7, 35, 341, 1),
(682, 2, 34, 342, 1),
(683, 7, 35, 342, 1),
(684, 2, 34, 343, 1),
(685, 7, 35, 343, 1),
(686, 2, 34, 344, 1),
(687, 7, 35, 344, 1),
(688, 2, 34, 345, 1),
(689, 7, 35, 345, 1),
(690, 2, 34, 346, 1),
(691, 7, 35, 346, 1),
(692, 2, 34, 347, 1),
(693, 7, 35, 347, 1),
(694, 2, 34, 348, 1),
(695, 7, 35, 348, 1),
(696, 2, 34, 349, 1),
(697, 7, 35, 349, 1),
(698, 7, 57, 350, 1),
(699, 4, 58, 350, 1),
(700, 7, 57, 351, 1),
(701, 4, 58, 351, 1),
(702, 2, 43, 352, 0),
(703, 4, 48, 352, 0),
(704, 7, 53, 352, 1),
(705, 7, 57, 353, 1),
(706, 4, 58, 353, 1),
(707, 7, 57, 354, 1),
(708, 4, 58, 354, 1),
(709, 2, 44, 355, 0),
(710, 4, 49, 355, 1),
(711, 7, 54, 355, 0),
(712, 2, 43, 356, 0),
(713, 4, 48, 356, 1),
(714, 7, 53, 356, 0),
(715, 2, 43, 357, 0),
(716, 4, 48, 357, 1),
(717, 7, 53, 357, 0),
(718, 2, 44, 358, 0),
(719, 4, 49, 358, 1),
(720, 7, 54, 358, 0),
(721, 2, 44, 359, 0),
(722, 4, 49, 359, 1),
(723, 7, 54, 359, 0),
(724, 2, 43, 360, 0),
(725, 4, 48, 360, 1),
(726, 7, 53, 360, 0),
(727, 2, 45, 361, 0),
(728, 4, 50, 361, 1),
(729, 7, 55, 361, 0),
(730, 2, 45, 362, 0),
(731, 4, 50, 362, 0),
(732, 7, 55, 362, 1),
(733, 2, 45, 363, 0),
(734, 4, 50, 363, 0),
(735, 7, 55, 363, 1),
(736, 2, 45, 364, 0),
(737, 4, 50, 364, 0),
(738, 7, 55, 364, 1),
(739, 2, 44, 365, 0),
(740, 4, 49, 365, 1),
(741, 7, 54, 365, 0),
(742, 2, 44, 366, 0),
(743, 4, 49, 366, 0),
(744, 7, 54, 366, 1),
(745, 2, 43, 367, 0),
(746, 4, 48, 367, 0),
(747, 7, 53, 367, 1),
(748, 2, 43, 368, 0),
(749, 4, 48, 368, 1),
(750, 7, 53, 368, 0),
(751, 2, 44, 369, 0),
(752, 4, 49, 369, 1),
(753, 7, 54, 369, 0),
(754, 2, 46, 370, 0),
(755, 4, 51, 370, 0),
(756, 7, 56, 370, 1),
(757, 2, 45, 371, 0),
(758, 4, 50, 371, 1),
(759, 7, 55, 371, 0),
(760, 2, 46, 372, 0),
(761, 4, 51, 372, 1),
(762, 7, 56, 372, 0),
(763, 2, 45, 373, 0),
(764, 4, 50, 373, 1),
(765, 7, 55, 373, 0),
(766, 2, 44, 374, 0),
(767, 4, 49, 374, 0),
(768, 7, 54, 374, 1),
(769, 2, 44, 375, 0),
(770, 4, 49, 375, 1),
(771, 7, 54, 375, 0),
(772, 2, 44, 376, 0),
(773, 4, 49, 376, 0),
(774, 7, 54, 376, 1),
(775, 2, 44, 377, 0),
(776, 4, 49, 377, 0),
(777, 7, 54, 377, 1),
(778, 7, 57, 378, 1),
(779, 4, 58, 378, 1),
(780, 7, 57, 379, 1),
(781, 4, 58, 379, 1),
(782, 7, 57, 380, 1),
(783, 4, 58, 380, 1),
(784, 7, 57, 381, 1),
(785, 4, 58, 381, 1),
(786, 7, 57, 382, 1),
(787, 4, 58, 382, 1),
(788, 7, 57, 383, 1),
(789, 4, 58, 383, 1),
(790, 7, 57, 384, 1),
(791, 4, 58, 384, 1),
(792, 7, 57, 385, 1),
(793, 4, 58, 385, 1),
(794, 7, 57, 386, 1),
(795, 4, 58, 386, 1),
(796, 7, 57, 387, 1),
(797, 4, 58, 387, 1),
(798, 7, 57, 388, 1),
(799, 4, 58, 388, 1),
(800, 7, 57, 389, 1),
(801, 4, 58, 389, 1),
(802, 7, 57, 390, 1),
(803, 4, 58, 390, 1),
(804, 7, 57, 391, 1),
(805, 4, 58, 391, 1),
(806, 7, 57, 392, 1),
(807, 4, 58, 392, 1),
(808, 7, 57, 393, 1),
(809, 4, 58, 393, 1),
(810, 2, 30, 394, 1),
(811, 4, 31, 394, 1),
(812, 7, 57, 395, 1),
(813, 4, 58, 395, 1),
(814, 7, 57, 396, 1),
(815, 4, 58, 396, 1),
(816, 2, 30, 397, 1),
(817, 4, 31, 397, 1),
(818, 2, 30, 398, 1),
(819, 4, 31, 398, 1),
(820, 2, 30, 399, 1),
(821, 4, 31, 399, 1),
(822, 2, 30, 400, 1),
(823, 4, 31, 400, 1),
(824, 2, 30, 401, 1),
(825, 4, 31, 401, 1),
(826, 2, 30, 402, 1),
(827, 4, 31, 402, 1),
(828, 2, 30, 403, 1),
(829, 4, 31, 403, 1),
(830, 2, 30, 404, 1),
(831, 4, 31, 404, 1),
(832, 2, 30, 405, 1),
(833, 4, 31, 405, 1),
(834, 2, 30, 406, 1),
(835, 4, 31, 406, 1),
(836, 2, 30, 407, 1),
(837, 4, 31, 407, 1),
(838, 2, 30, 408, 1),
(839, 4, 31, 408, 1),
(840, 2, 30, 409, 1),
(841, 4, 31, 409, 1),
(842, 2, 30, 410, 1),
(843, 4, 31, 410, 1),
(844, 2, 30, 411, 1),
(845, 4, 31, 411, 1),
(846, 2, 30, 412, 1),
(847, 4, 31, 412, 1),
(848, 2, 30, 413, 1),
(849, 4, 31, 413, 1),
(850, 2, 30, 414, 1),
(851, 4, 31, 414, 1),
(852, 2, 30, 415, 1),
(853, 4, 31, 415, 1),
(854, 2, 30, 416, 1),
(855, 4, 31, 416, 1),
(856, 2, 30, 417, 1),
(857, 4, 31, 417, 1),
(858, 2, 30, 418, 1),
(859, 4, 31, 418, 1),
(860, 2, 30, 419, 1),
(861, 4, 31, 419, 1),
(862, 2, 30, 420, 1),
(863, 4, 31, 420, 1),
(864, 2, 30, 421, 1),
(865, 4, 31, 421, 1),
(866, 2, 30, 422, 1),
(867, 4, 31, 422, 1),
(868, 2, 30, 423, 1),
(869, 4, 31, 423, 1),
(870, 2, 30, 424, 1),
(871, 4, 31, 424, 1),
(872, 2, 30, 425, 1),
(873, 4, 31, 425, 1),
(874, 2, 30, 426, 1),
(875, 4, 31, 426, 1),
(876, 2, 40, 427, 1),
(877, 12, 41, 427, 0),
(878, 2, 40, 428, 1),
(879, 12, 41, 428, 0),
(880, 2, 30, 429, 1),
(881, 4, 31, 429, 1),
(882, 2, 30, 430, 1),
(883, 4, 31, 430, 1),
(884, 2, 30, 431, 1),
(885, 4, 31, 431, 1),
(886, 2, 30, 432, 1),
(887, 4, 31, 432, 1),
(888, 2, 30, 433, 1),
(889, 4, 31, 433, 1),
(890, 2, 30, 434, 1),
(891, 4, 31, 434, 1),
(892, 2, 36, 435, 1),
(893, 10, 37, 435, 0),
(894, 2, 36, 436, 1),
(895, 10, 37, 436, 0),
(896, 2, 40, 437, 1),
(897, 12, 41, 437, 0),
(898, 5, 28, 438, 0),
(899, 2, 29, 438, 1),
(900, 2, 32, 439, 1),
(901, 8, 33, 439, 0);

-- --------------------------------------------------------

--
-- Table structure for table `notifiable`
--

CREATE TABLE `notifiable` (
  `id` int UNSIGNED NOT NULL,
  `source_type` enum('post','channel') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `notifiable`
--

INSERT INTO `notifiable` (`id`, `source_type`) VALUES
(40, 'channel'),
(41, 'channel'),
(42, 'channel'),
(43, 'channel'),
(44, 'channel'),
(47, 'post'),
(48, 'post'),
(49, 'post'),
(50, 'post'),
(72, 'post'),
(79, 'post'),
(80, 'post'),
(81, 'post'),
(82, 'post'),
(83, 'post'),
(84, 'post'),
(85, 'post'),
(86, 'post');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int UNSIGNED NOT NULL,
  `notifiable_id` int UNSIGNED NOT NULL,
  `type` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `notifiable_id`, `type`) VALUES
(23, 42, 1),
(25, 42, 2),
(17, 79, 2),
(18, 80, 2),
(19, 81, 2),
(20, 82, 2),
(21, 83, 2),
(22, 84, 2);

-- --------------------------------------------------------

--
-- Table structure for table `notification_receivers`
--

CREATE TABLE `notification_receivers` (
  `id` int UNSIGNED NOT NULL,
  `notification_id` int UNSIGNED NOT NULL,
  `receiver_id` int UNSIGNED NOT NULL,
  `status` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `notification_receivers`
--

INSERT INTO `notification_receivers` (`id`, `notification_id`, `receiver_id`, `status`, `created_at`) VALUES
(9, 17, 2, 0, '2022-12-12 10:01:53'),
(10, 17, 7, 0, '2022-12-06 00:00:00'),
(12, 25, 4, 0, '2022-12-03 08:55:54'),
(13, 23, 8, 0, '0000-00-00 00:00:00'),
(14, 23, 5, 0, '0000-00-00 00:00:00'),
(15, 23, 11, 0, '0000-00-00 00:00:00'),
(16, 23, 13, 0, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int UNSIGNED NOT NULL,
  `author_id` int UNSIGNED NOT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `last_updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `author_id`, `title`, `content`, `created_at`, `last_updated_at`) VALUES
(13, 5, 'Hello', '<p><img src=\"data:image/jpeg;base64,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\" width=\"605\" style=\"display: block; margin: auto;\"></p><p><br></p>', '2022-11-11 03:16:42', NULL);
INSERT INTO `posts` (`id`, `author_id`, `title`, `content`, `created_at`, `last_updated_at`) VALUES
(15, 2, 'Understanding Node.js Event-Driven Architecture', '<p>Most of Node’s objects — like HTTP requests, responses, and streams — implement the&nbsp;EventEmitter&nbsp;module so they can provide a way to emit and listen to events.</p><p><br></p><p><img src=\"https://cdn-media-1.freecodecamp.org/images/1*74K5OhiYt7WTR0WuVGeNLQ.png\" width=\"342\" style=\"display: block; margin: auto; cursor: nwse-resize;\"></p><p><br></p><p>The simplest form of the event-driven nature is the callback style of some of the popular Node.js functions — for example,&nbsp;fs.readFile. In this analogy, the event will be fired once (when Node is ready to call the callback) and the callback acts as the event handler.</p><p>Let’s explore this basic form first.</p><p><br></p><h4>Call me when you’re ready, Node!</h4><p>The original way Node handled asynchronous events was with callback. This was a long time ago, before JavaScript had native promises support and the async/await feature.</p><p>Callbacks are basically just functions that you pass to other functions. This is possible in JavaScript because functions are first class objects.</p><p><br></p><p>It’s important to understand that callbacks do not indicate an asynchronous call in the code. A function can call the callback both synchronously and asynchronously.</p><p>For example, here’s a host function&nbsp;fileSize&nbsp;that accepts a callback function&nbsp;cb&nbsp;and can invoke that callback function both synchronously and asynchronously based on a condition:</p><pre class=\"ql-syntax\" spellcheck=\"false\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title function_\">fileSize</span> (fileName, cb) {\n  <span class=\"hljs-keyword\">if</span> (<span class=\"hljs-keyword\">typeof</span> fileName !== <span class=\"hljs-string\">\'string\'</span>) {\n    <span class=\"hljs-keyword\">return</span> <span class=\"hljs-title function_\">cb</span>(<span class=\"hljs-keyword\">new</span> <span class=\"hljs-title class_\">TypeError</span>(<span class=\"hljs-string\">\'argument should be string\'</span>)); <span class=\"hljs-comment\">// Sync</span>\n  }\n  fs.<span class=\"hljs-title function_\">stat</span>(fileName, <span class=\"hljs-function\">(<span class=\"hljs-params\">err, stats</span>) =&gt;</span> {\n    <span class=\"hljs-keyword\">if</span> (err) { <span class=\"hljs-keyword\">return</span> <span class=\"hljs-title function_\">cb</span>(err); } <span class=\"hljs-comment\">// Asynccb(null, stats.size); // Async</span>\n  });\n}\n</pre><p><br></p><p>Note that this is a bad practice that leads to unexpected errors. Design host functions to consume callback either always synchronously or always asynchronously.</p><p>Let’s explore a simple example of a typical asynchronous Node function that’s written with a callback style:</p><pre class=\"ql-syntax\" spellcheck=\"false\"><span class=\"hljs-keyword\">const</span> readFileAsArray = <span class=\"hljs-keyword\">function</span>(<span class=\"hljs-params\">file, cb</span>) {\n  fs.<span class=\"hljs-title function_\">readFile</span>(file, <span class=\"hljs-keyword\">function</span>(<span class=\"hljs-params\">err, data</span>) {\n    <span class=\"hljs-keyword\">if</span> (err) {\n      <span class=\"hljs-keyword\">return</span> <span class=\"hljs-title function_\">cb</span>(err);\n    }\n    <span class=\"hljs-keyword\">const</span> lines = data.<span class=\"hljs-title function_\">toString</span>().<span class=\"hljs-title function_\">trim</span>().<span class=\"hljs-title function_\">split</span>(<span class=\"hljs-string\">\'\\n\'</span>);\n    <span class=\"hljs-title function_\">cb</span>(<span class=\"hljs-literal\">null</span>, lines);\n  });\n};\n</pre><p><br></p><p>readFileAsArray&nbsp;takes a file path and a callback function. It reads the file content, splits it into an array of lines, and calls the callback function with that array.</p><p>Here’s an example use for it. Assuming that we have the file&nbsp;numbers.txt&nbsp;in the same directory with content like this:</p><pre class=\"ql-syntax\" spellcheck=\"false\">10\n11\n12\n13\n14\n15\n</pre><p><br></p><p>If we have a task to count the odd numbers in that file, we can use&nbsp;readFileAsArray&nbsp;to simplify the code:</p><pre class=\"ql-syntax\" spellcheck=\"false\"><span class=\"hljs-title function_\">readFileAsArray</span>(<span class=\"hljs-string\">\'./numbers.txt\'</span>, <span class=\"hljs-function\">(<span class=\"hljs-params\">err, lines</span>) =&gt;</span> {\n  <span class=\"hljs-keyword\">if</span> (err) <span class=\"hljs-keyword\">throw</span> err;\n  <span class=\"hljs-keyword\">const</span> numbers = lines.<span class=\"hljs-title function_\">map</span>(<span class=\"hljs-title class_\">Number</span>);\n  <span class=\"hljs-keyword\">const</span> oddNumbers = numbers.<span class=\"hljs-title function_\">filter</span>(<span class=\"hljs-function\"><span class=\"hljs-params\">n</span> =&gt;</span> n%<span class=\"hljs-number\">2</span> === <span class=\"hljs-number\">1</span>);\n  <span class=\"hljs-variable language_\">console</span>.<span class=\"hljs-title function_\">log</span>(<span class=\"hljs-string\">\'Odd numbers count:\'</span>, oddNumbers.<span class=\"hljs-property\">length</span>);\n});\n</pre><p><br></p><p>The code reads the numbers content into an array of strings, parses them as numbers, and counts the odd ones.</p><p>Node’s callback style is used purely here. The callback has an error-first argument&nbsp;err&nbsp;that’s nullable and we pass the callback as the last argument for the host function. You should always do that in your functions because users will probably assume that. Make the host function receive the callback as its last argument and make the callback expect an error object as its first argument.</p>', '2022-11-25 09:48:39', NULL),
(17, 2, 'Highlight code demo', '<pre class=\"ql-syntax\" spellcheck=\"false\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title function_\">$initHighlight</span>(<span class=\"hljs-params\">block, cls</span>) {\n  <span class=\"hljs-keyword\">try</span> {\n    <span class=\"hljs-keyword\">if</span> (cls.<span class=\"hljs-title function_\">search</span>(<span class=\"hljs-regexp\">/\\bno\\-highlight\\b/</span>) != -<span class=\"hljs-number\">1</span>)\n      <span class=\"hljs-keyword\">return</span> <span class=\"hljs-title function_\">process</span>(block, <span class=\"hljs-literal\">true</span>, <span class=\"hljs-number\">0x0F</span>) +\n             <span class=\"hljs-string\">` class=\"<span class=\"hljs-subst\">${cls}</span>\"`</span>;\n  } <span class=\"hljs-keyword\">catch</span> (e) {\n    <span class=\"hljs-comment\">/* handle exception */</span>\n  }\n  <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-keyword\">var</span> i = <span class=\"hljs-number\">0</span> / <span class=\"hljs-number\">2</span>; i &lt; classes.<span class=\"hljs-property\">length</span>; i++) {\n    <span class=\"hljs-keyword\">if</span> (<span class=\"hljs-title function_\">checkCondition</span>(classes[i]) === <span class=\"hljs-literal\">undefined</span>)\n      <span class=\"hljs-variable language_\">console</span>.<span class=\"hljs-title function_\">log</span>(<span class=\"hljs-string\">\'undefined\'</span>);\n  }\n\n  <span class=\"hljs-keyword\">return</span> (\n    <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">div</span>&gt;</span>\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">web-component</span>&gt;</span>{block}<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">web-component</span>&gt;</span>\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">div</span>&gt;</span>\n  )\n}\n\n<span class=\"hljs-keyword\">export</span>  $initHighlight;\n</pre>', '2022-11-30 20:57:31', NULL),
(18, 2, 'Highlight code demo', '<pre class=\"ql-syntax\" spellcheck=\"false\">function $initHighlight(block, cls) {\n  try {\n    if (cls.search(/\\bno\\-highlight\\b/) != -1)\n      return process(block, true, 0x0F) +\n             ` class=\"${cls}\"`;\n  } catch (e) {\n    /* handle exception */\n  }\n  for (var i = 0 / 2; i &lt; classes.length; i++) {\n    if (checkCondition(classes[i]) === undefined)\n      console.log(\'undefined\');\n  }\n\n  return (\n    &lt;div&gt;\n      &lt;web-component&gt;{block}&lt;/web-component&gt;\n    &lt;/div&gt;\n  )\n}\n\nexport  $initHighlight;\n</pre><p><br></p>', '2022-11-30 20:58:57', NULL),
(19, 2, 'Highlight code demo', '<pre class=\"ql-syntax\" spellcheck=\"false\">function $initHighlight(block, cls) {\n  try {\n    if (cls.search(/\\bno\\-highlight\\b/) != -1)\n      return process(block, true, 0x0F) +\n             ` class=\"${cls}\"`;\n  } catch (e) {\n    /* handle exception */\n  }\n  for (var i = 0 / 2; i &lt; classes.length; i++) {\n    if (checkCondition(classes[i]) === undefined)\n      console.log(\'undefined\');\n  }\n\n  return (\n    &lt;div&gt;\n      &lt;web-component&gt;{block}&lt;/web-component&gt;\n    &lt;/div&gt;\n  )\n}\n\nexport  $initHighlight;\n</pre><p><br></p>', '2022-11-30 21:02:03', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `post_comments`
--

CREATE TABLE `post_comments` (
  `id` int UNSIGNED NOT NULL,
  `post_id` int UNSIGNED NOT NULL,
  `sender_id` int UNSIGNED NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_comment_id` int UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `notifiable_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_comments`
--

INSERT INTO `post_comments` (`id`, `post_id`, `sender_id`, `content`, `parent_comment_id`, `created_at`, `notifiable_id`) VALUES
(30, 15, 7, '😍', NULL, '2022-12-02 23:07:48', 47),
(31, 15, 2, 'hihi', 30, '2022-12-02 23:09:37', 48),
(32, 15, 2, 'good evening', NULL, '2022-12-02 23:11:56', 49),
(33, 15, 2, 'hehe', NULL, '2022-12-02 23:13:07', 50),
(55, 15, 2, 'Hihi', NULL, '2022-12-03 00:34:13', 72),
(62, 15, 2, 'Hello', 30, '2022-12-03 00:48:14', 79),
(63, 15, 2, 'a', 30, '2022-12-03 00:50:25', 80),
(64, 15, 2, 'a', 32, '2022-12-03 00:51:33', 81),
(65, 15, 2, 'a', 33, '2022-12-03 00:52:41', 82),
(66, 15, 2, 'a', 55, '2022-12-03 00:55:06', 83),
(67, 15, 2, 'a', 55, '2022-12-03 00:55:21', 84),
(68, 15, 2, 'a', 55, '2022-12-03 00:58:47', 85),
(69, 15, 2, 'a', 55, '2022-12-03 00:58:54', 86);

-- --------------------------------------------------------

--
-- Table structure for table `post_likes`
--

CREATE TABLE `post_likes` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `post_id` int UNSIGNED NOT NULL,
  `liked` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_likes`
--

INSERT INTO `post_likes` (`id`, `user_id`, `post_id`, `liked`) VALUES
(2, 4, 13, 1),
(4, 5, 13, 1),
(75, 2, 15, 1);

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int UNSIGNED NOT NULL,
  `channel_id` int UNSIGNED DEFAULT NULL,
  `type` enum('single','group') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `removable` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `channel_id`, `type`, `title`, `created_at`, `removable`) VALUES
(15, NULL, 'single', NULL, '2022-11-14 21:35:52', 0),
(16, NULL, 'single', NULL, '2022-11-18 22:34:12', 0),
(17, NULL, 'single', NULL, '2022-11-19 09:57:55', 0),
(18, NULL, 'single', NULL, '2022-11-19 10:02:19', 0),
(19, NULL, 'single', NULL, '2022-11-19 10:04:42', 0),
(20, NULL, 'single', NULL, '2022-11-19 10:07:27', 0),
(21, NULL, 'single', NULL, '2022-11-19 10:09:50', 0),
(22, 5, 'group', 'Announcements', '2022-11-21 14:18:01', 0),
(23, 5, 'group', 'NodeJs', '2022-11-21 14:19:02', 1),
(24, 5, 'group', 'ReactJs', '2022-11-21 14:19:39', 1),
(25, 5, 'group', 'DevOps', '2022-11-21 14:20:05', 1),
(26, 5, 'group', 'Database', '2022-11-21 14:20:54', 1),
(27, NULL, 'single', NULL, '2022-11-23 13:57:43', 0),
(29, 5, 'group', 'Design', '2022-12-01 10:22:38', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int UNSIGNED NOT NULL,
  `post_id` int UNSIGNED NOT NULL,
  `tag_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `post_id`, `tag_name`) VALUES
(3, 15, 'Javascript'),
(4, 15, 'NodeJS'),
(6, 19, 'Javascript');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date DEFAULT NULL,
  `password` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` enum('male','female','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `joined_date` datetime NOT NULL,
  `nation` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `birthday`, `password`, `gender`, `avatar_url`, `joined_date`, `nation`) VALUES
(2, 'lvdat.roy@gmail.com', 'lvdat', NULL, '$2b$10$C3HqjsVkxY3D5hq6Gqh6TeO8yhkeMd/yOi4wo7Z68s/fBg6oywiG2', 'other', 'https://scontent.fhan14-1.fna.fbcdn.net/v/t1.15752-9/243978555_399918004863466_1703240540387963577_n.png?_nc_cat=111&ccb=1-7&_nc_sid=ae9488&_nc_ohc=dho8WpLGNJcAX8oALZI&_nc_ht=scontent.fhan14-1.fna&oh=03_AdRqImAa7DcuxULQAC0IKsnKiSgjskLzsCVMZIUV7DrUFg&oe=63AC6BB1', '0000-00-00 00:00:00', NULL),
(4, 'dat.roy.2003@gmail.com', 'roy', NULL, '$2b$10$fNK.tEsPwzfNHl44OEXSF.Vsu5at3mRZmb0fVL5RspjCtSSCezzSG', 'other', 'https://lh3.googleusercontent.com/a/ALm5wu3cKEstY_5YSSQTHEfunU7ojzrWGV9uI7_ceZsn=s96-c', '2022-11-05 17:51:30', NULL),
(5, 'a4k29.hh4@gmail.com', 'nekokun', NULL, '$2b$10$Gb8Eb6nH7sX8eVxtX8IeVOc1yBkl2KO3gKsr4k90BO1ZmlQGoMgzS', 'other', 'https://scontent.fhan14-1.fna.fbcdn.net/v/t1.15752-9/195974949_534419381069328_926187293498061728_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=ae9488&_nc_ohc=NOE20ofJWIkAX_vkfP3&_nc_ht=scontent.fhan14-1.fna&oh=03_AdQ-xy00IjLwQVmO3lvHsNk0oxb74Z95sZPsP3EgK5ktiw&oe=63AC6030', '2022-11-05 18:19:58', NULL),
(7, '21020298@vnu.edu.vn', 'UETốt', NULL, '$2b$10$IG.KASH3/c9erpe.DayLoe0Qd8MZLyBmKWkNMbnzMa4OFhD/qWZ9C', 'other', 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.15752-9/296048571_5375031022616469_2440968245869429416_n.png?_nc_cat=110&ccb=1-7&_nc_sid=ae9488&_nc_ohc=-rQCk3GsFeMAX9oF1ya&_nc_ht=scontent.fhan2-5.fna&oh=03_AdSTHwHA-sc-brMhGvFtDN4LFStf2c6mrqmrV22cNHITGg&oe=639FD3B6', '2022-11-19 09:54:25', NULL),
(8, 'meow@gmail.com', 'meow', NULL, '$2b$10$IG.KASH3/c9erpe.DayLoe0Qd8MZLyBmKWkNMbnzMa4OFhD/qWZ9C', NULL, 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.15752-9/275977893_727683845078674_6093481772108505383_n.webp?stp=dst-webp&_nc_cat=107&ccb=1-7&_nc_sid=ae9488&_nc_ohc=l9uPbnQbux8AX_2cLf5&_nc_ht=scontent.fhan2-5.fna&oh=03_AdTT0yzpwwYrpJH2ZAuD90mYKxk--wF5619a8_SxQoQn_A&oe=639FD39F', '2022-11-19 03:55:10', NULL),
(10, 'bin@gmail.com', 'bin', NULL, '$2b$10$IG.KASH3/c9erpe.DayLoe0Qd8MZLyBmKWkNMbnzMa4OFhD/qWZ9C', NULL, 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.15752-9/284916187_399746062119657_6474159232839858156_n.png?_nc_cat=104&ccb=1-7&_nc_sid=ae9488&_nc_ohc=M4_b7H2QeHUAX_9Yg2M&_nc_ht=scontent.fhan2-5.fna&oh=03_AdQL9n4l00sn1DT6zz3HaLSZszD-QiaPrDt8A9bY-WMPjg&oe=639FC8F6', '2022-11-19 04:03:39', NULL),
(11, 'pate@gmail.com', 'pate', NULL, '$2b$10$IG.KASH3/c9erpe.DayLoe0Qd8MZLyBmKWkNMbnzMa4OFhD/qWZ9C', NULL, 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.15752-9/300496546_1360520704473232_4132157348638922110_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=ae9488&_nc_ohc=WvjdVsTqLn8AX-0x6fx&tn=Jsb-ydERwOFU8E_N&_nc_ht=scontent.fhan2-5.fna&oh=03_AdSazLAjj3ugPb3Knn3TLXbAsEp7b1-k4C7XP7jqT5v1Ww&oe=639FB761', '2022-11-19 04:05:20', NULL),
(12, 'shin@gmail.com', 'shin', NULL, '$2b$10$IG.KASH3/c9erpe.DayLoe0Qd8MZLyBmKWkNMbnzMa4OFhD/qWZ9C', NULL, 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.15752-9/291092349_469802784483235_2319594929695058300_n.png?_nc_cat=104&ccb=1-7&_nc_sid=ae9488&_nc_ohc=vtObZ3-nO7AAX90WoiF&tn=Jsb-ydERwOFU8E_N&_nc_ht=scontent.fhan2-5.fna&oh=03_AdSsVGRAhkoPVLAG3jOwL0xEI_FaPtaKULhYHtpSCe2sbw&oe=639FD028', '2022-11-19 04:08:14', NULL),
(13, 'aaaa', 'aaaa', NULL, 'aaaaa', NULL, 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.15752-9/291092349_469802784483235_2319594929695058300_n.png?_nc_cat=104&ccb=1-7&_nc_sid=ae9488&_nc_ohc=vtObZ3-nO7AAX90WoiF&tn=Jsb-ydERwOFU8E_N&_nc_ht=scontent.fhan2-5.fna&oh=03_AdSsVGRAhkoPVLAG3jOwL0xEI_FaPtaKULhYHtpSCe2sbw&oe=639FD028', '2022-12-03 15:38:49', NULL),
(14, 'abab', 'ababab', NULL, '', NULL, 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.15752-9/291092349_469802784483235_2319594929695058300_n.png?_nc_cat=104&ccb=1-7&_nc_sid=ae9488&_nc_ohc=vtObZ3-nO7AAX90WoiF&tn=Jsb-ydERwOFU8E_N&_nc_ht=scontent.fhan2-5.fna&oh=03_AdSsVGRAhkoPVLAG3jOwL0xEI_FaPtaKULhYHtpSCe2sbw&oe=639FD028', '2022-12-03 15:39:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_channel`
--

CREATE TABLE `user_channel` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `channel_id` int UNSIGNED NOT NULL,
  `notifiable_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_channel`
--

INSERT INTO `user_channel` (`id`, `user_id`, `channel_id`, `notifiable_id`) VALUES
(33, 5, 11, 40),
(34, 2, 11, 41),
(35, 2, 5, 42),
(36, 4, 5, 43),
(37, 7, 5, 44);

-- --------------------------------------------------------

--
-- Table structure for table `user_room`
--

CREATE TABLE `user_room` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `room_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_room`
--

INSERT INTO `user_room` (`id`, `user_id`, `room_id`) VALUES
(29, 2, 15),
(30, 2, 16),
(32, 2, 17),
(34, 2, 18),
(36, 2, 19),
(38, 2, 20),
(40, 2, 21),
(42, 2, 22),
(43, 2, 23),
(44, 2, 24),
(45, 2, 25),
(46, 2, 26),
(59, 2, 29),
(31, 4, 16),
(47, 4, 22),
(48, 4, 23),
(49, 4, 24),
(50, 4, 25),
(51, 4, 26),
(58, 4, 27),
(28, 5, 15),
(35, 7, 18),
(52, 7, 22),
(53, 7, 23),
(54, 7, 24),
(55, 7, 25),
(56, 7, 26),
(57, 7, 27),
(33, 8, 17),
(37, 10, 19),
(39, 11, 20),
(41, 12, 21);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `channels`
--
ALTER TABLE `channels`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `title` (`title`),
  ADD KEY `channels_users_foreign_key` (`admin_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_parent_message_id_foreign` (`parent_message_id`),
  ADD KEY `messages_sender_id_foreign` (`sender_id`);

--
-- Indexes for table `message_attachments`
--
ALTER TABLE `message_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_attachments_message_id_foreign` (`message_id`);

--
-- Indexes for table `message_recipients`
--
ALTER TABLE `message_recipients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_recipients_message_id_foreign` (`message_id`),
  ADD KEY `message_recipients_recipient_id_foreign` (`recipient_id`),
  ADD KEY `message_recipients_recipient_room_id_foreign` (`recipient_room_id`);

--
-- Indexes for table `notifiable`
--
ALTER TABLE `notifiable`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `notifications_unique_1` (`notifiable_id`,`type`);

--
-- Indexes for table `notification_receivers`
--
ALTER TABLE `notification_receivers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notification_receivers_ibfk_1` (`notification_id`),
  ADD KEY `notification_receivers_ibfk_2` (`receiver_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `posts_author_id_foreign` (`author_id`);

--
-- Indexes for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `post_comments_unique_1` (`notifiable_id`),
  ADD KEY `post_comments_ibfk_1` (`post_id`),
  ADD KEY `post_comments_ibfk_2` (`sender_id`),
  ADD KEY `post_comments_ibfk_3` (`parent_comment_id`);

--
-- Indexes for table `post_likes`
--
ALTER TABLE `post_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `post_likes_unique_1` (`user_id`,`post_id`),
  ADD KEY `post_likes_ibfk_1` (`post_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_channel_id_foreign` (`channel_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tags_ibfk_1` (`post_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_username_unique` (`username`);

--
-- Indexes for table `user_channel`
--
ALTER TABLE `user_channel`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_channel_unique_1` (`notifiable_id`),
  ADD UNIQUE KEY `user_channel_unique_2` (`user_id`,`channel_id`),
  ADD KEY `user_channel_ibfk_1` (`user_id`),
  ADD KEY `user_channel_ibfk_2` (`channel_id`);

--
-- Indexes for table `user_room`
--
ALTER TABLE `user_room`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_room_unique_1` (`user_id`,`room_id`),
  ADD KEY `user_room_conversation_id_foreign` (`room_id`),
  ADD KEY `user_room_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `channels`
--
ALTER TABLE `channels`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=440;

--
-- AUTO_INCREMENT for table `message_attachments`
--
ALTER TABLE `message_attachments`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `message_recipients`
--
ALTER TABLE `message_recipients`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=902;

--
-- AUTO_INCREMENT for table `notifiable`
--
ALTER TABLE `notifiable`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `notification_receivers`
--
ALTER TABLE `notification_receivers`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `post_comments`
--
ALTER TABLE `post_comments`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `post_likes`
--
ALTER TABLE `post_likes`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `user_channel`
--
ALTER TABLE `user_channel`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `user_room`
--
ALTER TABLE `user_room`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `channels`
--
ALTER TABLE `channels`
  ADD CONSTRAINT `channels_users_foreign_key` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_parent_message_id_foreign` FOREIGN KEY (`parent_message_id`) REFERENCES `messages` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `message_attachments`
--
ALTER TABLE `message_attachments`
  ADD CONSTRAINT `message_attachments_message_id_foreign` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `message_recipients`
--
ALTER TABLE `message_recipients`
  ADD CONSTRAINT `message_recipients_message_id_foreign` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `message_recipients_recipient_id_foreign` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `message_recipients_recipient_room_id_foreign` FOREIGN KEY (`recipient_room_id`) REFERENCES `user_room` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`notifiable_id`) REFERENCES `notifiable` (`id`);

--
-- Constraints for table `notification_receivers`
--
ALTER TABLE `notification_receivers`
  ADD CONSTRAINT `notification_receivers_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`),
  ADD CONSTRAINT `notification_receivers_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD CONSTRAINT `post_comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `post_comments_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `post_comments_ibfk_3` FOREIGN KEY (`parent_comment_id`) REFERENCES `post_comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `post_comments_ibfk_4` FOREIGN KEY (`notifiable_id`) REFERENCES `notifiable` (`id`);

--
-- Constraints for table `post_likes`
--
ALTER TABLE `post_likes`
  ADD CONSTRAINT `post_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `post_likes_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `room_channel_id_foreign` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `tags`
--
ALTER TABLE `tags`
  ADD CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);

--
-- Constraints for table `user_channel`
--
ALTER TABLE `user_channel`
  ADD CONSTRAINT `user_channel_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_channel_ibfk_2` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`),
  ADD CONSTRAINT `user_channel_ibfk_3` FOREIGN KEY (`notifiable_id`) REFERENCES `notifiable` (`id`);

--
-- Constraints for table `user_room`
--
ALTER TABLE `user_room`
  ADD CONSTRAINT `user_room_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `user_room_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
