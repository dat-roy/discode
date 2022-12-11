-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th12 11, 2022 lúc 12:08 PM
-- Phiên bản máy phục vụ: 8.0.31
-- Phiên bản PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `discode`
--

DELIMITER $$
--
-- Thủ tục
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_notifiable_user_channel` (IN `p_user_id` INT UNSIGNED, IN `p_channel_id` INT UNSIGNED, OUT `@user_channel_id` INT)   begin 
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
-- Cấu trúc bảng cho bảng `channels`
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
-- Đang đổ dữ liệu cho bảng `channels`
--

INSERT INTO `channels` (`id`, `admin_id`, `title`, `description`, `avatar_url`, `background_url`, `created_at`) VALUES
(5, 2, 'Fullstack-overflow', 'A gathering place for codeholics.', 'https://fullstack.edu.vn/static/media/f8-icon.18cd71cfcfa33566a22b.png', 'https://kinhnghiemlaptrinh.com/wp-content/uploads/2019/09/image1-2-768x432.jpg', '2022-11-11 17:59:52'),
(11, 2, 'Deno', 'A modern runtime for JS and TS.', 'upload\\channel\\1669563463396.jpg', 'upload\\channel\\1669563463397.png', '2022-11-27 22:37:43'),
(12, 4, 'Neko', 'meow! meow! meow! meow! meow! meow! meow! meow! meow! meow! meow! meow! meow! meow! meow! meow! meow! meow! meow! meow! meow! meow! meow! meow! meow! ', 'upload\\channel\\1670424713093.jpg', 'upload\\channel\\1670424713093.png', '2022-12-07 21:51:53'),
(13, 20, 'Hello ', 'HelloWorld', 'upload\\channel\\1670599388777.png', 'upload\\channel\\1670599388788.png', '2022-12-09 22:23:08');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `channel_requests`
--

CREATE TABLE `channel_requests` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `channel_id` int UNSIGNED NOT NULL,
  `notifiable_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Đang đổ dữ liệu cho bảng `channel_requests`
--

INSERT INTO `channel_requests` (`id`, `user_id`, `channel_id`, `notifiable_id`) VALUES
(8, 2, 13, 97),
(9, 20, 5, 98);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `messages`
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
-- Đang đổ dữ liệu cho bảng `messages`
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
(439, 2, 'kk', 'text', NULL, '2022-12-01 09:07:00', NULL),
(440, 4, 'a', 'text', NULL, '2022-12-05 08:58:13', NULL),
(441, 4, 'a', 'text', NULL, '2022-12-05 09:02:09', NULL),
(442, 4, 'a', 'text', NULL, '2022-12-05 09:04:26', NULL),
(443, 4, 'a', 'text', NULL, '2022-12-05 09:05:07', NULL),
(444, 4, 'a', 'text', NULL, '2022-12-05 09:06:07', NULL),
(445, 4, 'a', 'text', NULL, '2022-12-05 09:08:08', NULL),
(446, 4, 'a', 'text', NULL, '2022-12-05 09:09:15', NULL),
(447, 4, 'a', 'text', NULL, '2022-12-05 09:09:32', NULL),
(448, 4, 'a', 'text', NULL, '2022-12-05 09:11:58', NULL),
(449, 4, 'as', 'text', NULL, '2022-12-05 09:12:02', NULL),
(450, 4, 'a', 'text', NULL, '2022-12-05 09:14:01', NULL),
(451, 2, 'a', 'text', NULL, '2022-12-05 09:19:49', NULL),
(452, 2, 'aaa', 'text', NULL, '2022-12-05 09:19:56', NULL),
(453, 4, 'kk', 'text', NULL, '2022-12-05 09:23:29', NULL),
(454, 4, 'hihi', 'text', NULL, '2022-12-05 09:23:38', NULL),
(455, 4, 'hehe', 'text', NULL, '2022-12-05 09:23:42', NULL),
(456, 4, 'kk', 'text', NULL, '2022-12-05 09:23:51', NULL),
(457, 4, 'jj', 'text', NULL, '2022-12-05 09:23:55', NULL),
(458, 4, '\nasdasd', 'text', NULL, '2022-12-05 09:23:59', NULL),
(459, 4, 'kk', 'text', NULL, '2022-12-05 09:24:48', NULL),
(460, 4, 'kads', 'text', NULL, '2022-12-05 09:24:51', NULL),
(461, 4, 'hehh', 'text', NULL, '2022-12-05 09:24:54', NULL),
(462, 4, 'hahds', 'text', NULL, '2022-12-05 09:25:00', NULL),
(463, 4, 'hehe', 'text', NULL, '2022-12-05 10:07:02', NULL),
(464, 4, 'a', 'text', NULL, '2022-12-05 10:08:38', NULL),
(465, 4, 'hh', 'text', NULL, '2022-12-05 10:09:16', NULL),
(466, 4, 'ahh', 'text', NULL, '2022-12-05 10:09:23', NULL),
(467, 4, 'hah', 'text', NULL, '2022-12-05 10:12:22', NULL),
(468, 4, 'a', 'text', NULL, '2022-12-05 10:15:41', NULL),
(469, 4, 'a', 'text', NULL, '2022-12-05 10:16:23', NULL),
(470, 4, 'r', 'text', NULL, '2022-12-05 10:16:29', NULL),
(471, 4, 'hh', 'text', NULL, '2022-12-05 10:16:37', NULL),
(472, 4, 'kk', 'text', NULL, '2022-12-05 10:16:43', NULL),
(473, 4, 'jj', 'text', NULL, '2022-12-05 10:16:49', NULL),
(474, 4, 'kk', 'text', NULL, '2022-12-05 10:16:52', NULL),
(475, 4, 'jk', 'text', NULL, '2022-12-05 10:16:55', NULL),
(476, 4, 'adas', 'text', NULL, '2022-12-05 10:17:01', NULL),
(477, 4, 'jhsdhasd', 'text', NULL, '2022-12-05 10:17:04', NULL),
(478, 4, 'hah', 'text', NULL, '2022-12-05 10:18:34', NULL),
(479, 4, 'haha', 'text', NULL, '2022-12-05 10:18:46', NULL),
(480, 4, 'haha', 'text', NULL, '2022-12-05 10:18:50', NULL),
(481, 4, 'huhu', 'text', NULL, '2022-12-05 10:18:54', NULL),
(482, 4, 'a', 'text', NULL, '2022-12-05 10:25:53', NULL),
(483, 4, 'hello', 'text', NULL, '2022-12-05 10:25:57', NULL),
(484, 4, 'hh', 'text', NULL, '2022-12-05 10:26:04', NULL),
(485, 4, 'hehe', 'text', NULL, '2022-12-05 10:26:08', NULL),
(486, 4, 'working', 'text', NULL, '2022-12-05 10:26:11', NULL),
(487, 4, 'hehe', 'text', NULL, '2022-12-05 10:26:15', NULL),
(488, 4, 'hehe', 'text', NULL, '2022-12-05 10:26:19', NULL),
(489, 4, 'huuhu', 'text', NULL, '2022-12-05 10:26:24', NULL),
(490, 4, 'hehe', 'text', NULL, '2022-12-05 10:26:32', NULL),
(491, 4, 'huu', 'text', NULL, '2022-12-05 10:26:40', NULL),
(492, 4, 'hehe', 'text', NULL, '2022-12-05 10:26:44', NULL),
(493, 4, 'home', 'text', NULL, '2022-12-05 10:26:46', NULL),
(494, 2, '???', 'text', NULL, '2022-12-05 10:26:57', NULL),
(495, 2, '???', 'text', NULL, '2022-12-05 10:27:14', NULL),
(496, 2, '???', 'text', NULL, '2022-12-05 10:27:24', NULL),
(497, 2, 'hahah', 'text', NULL, '2022-12-05 10:27:27', NULL),
(498, 2, 'hhaha', 'text', NULL, '2022-12-05 10:27:31', NULL),
(499, 4, 'haha', 'text', NULL, '2022-12-05 10:28:26', NULL),
(500, 4, 'haha', 'text', NULL, '2022-12-05 10:28:41', NULL),
(501, 4, 'haia', 'text', NULL, '2022-12-05 10:29:38', NULL),
(502, 4, 'haizz', 'text', NULL, '2022-12-05 10:29:43', NULL),
(503, 4, 'hiad', 'text', NULL, '2022-12-05 10:29:46', NULL),
(504, 4, 'hhhhe', 'text', NULL, '2022-12-05 10:29:49', NULL),
(505, 4, 'hieie', 'text', NULL, '2022-12-05 10:29:58', NULL),
(506, 4, 'hehrher', 'text', NULL, '2022-12-05 10:30:01', NULL),
(507, 4, 'jhejrer', 'text', NULL, '2022-12-05 10:30:05', NULL),
(508, 2, 'hehe', 'text', NULL, '2022-12-05 10:30:14', NULL),
(509, 4, 'kk', 'text', NULL, '2022-12-05 10:33:09', NULL),
(510, 4, 'kk', 'text', NULL, '2022-12-05 10:33:17', NULL),
(511, 4, 'kk', 'text', NULL, '2022-12-05 10:33:27', NULL),
(512, 4, 'heheh', 'text', NULL, '2022-12-05 10:33:31', NULL),
(513, 4, 'hehe', 'text', NULL, '2022-12-05 10:33:50', NULL),
(514, 4, 'heheh', 'text', NULL, '2022-12-05 10:33:54', NULL),
(515, 4, 'ikekrker', 'text', NULL, '2022-12-05 10:33:59', NULL),
(516, 4, 'hehe', 'text', NULL, '2022-12-05 10:34:06', NULL),
(517, 4, 'eherhe', 'text', NULL, '2022-12-05 10:34:13', NULL),
(518, 4, 'jajdjahsd', 'text', NULL, '2022-12-05 10:34:16', NULL),
(519, 4, 'hehe', 'text', NULL, '2022-12-05 10:36:49', NULL),
(520, 2, 'hehe', 'text', NULL, '2022-12-05 10:38:29', NULL),
(521, 4, 'hehe', 'text', NULL, '2022-12-05 10:38:34', NULL),
(522, 4, 'heheh', 'text', NULL, '2022-12-05 10:38:37', NULL),
(523, 2, 'heher', 'text', NULL, '2022-12-05 10:38:42', NULL),
(524, 2, 'jherjher', 'text', NULL, '2022-12-05 10:38:46', NULL),
(525, 2, 'jhasdajsd', 'text', NULL, '2022-12-05 10:38:52', NULL),
(526, 4, 'hehe', 'text', NULL, '2022-12-05 14:20:41', NULL),
(527, 4, 'haha', 'text', NULL, '2022-12-05 14:20:51', NULL),
(528, 4, 'hehe', 'text', NULL, '2022-12-05 14:21:14', NULL),
(529, 4, 'hehe', 'text', NULL, '2022-12-05 14:21:22', NULL),
(530, 4, 'kk', 'text', NULL, '2022-12-05 14:33:42', NULL),
(531, 4, 'hhe', 'text', NULL, '2022-12-05 14:33:56', NULL),
(532, 4, 'hh', 'text', NULL, '2022-12-05 14:34:06', NULL),
(533, 4, 'hajdads', 'text', NULL, '2022-12-05 14:43:31', NULL),
(534, 4, 'adsashasd', 'text', NULL, '2022-12-05 14:43:39', NULL),
(535, 4, 'hhas', 'text', NULL, '2022-12-05 14:43:46', NULL),
(536, 4, 'hee', 'text', NULL, '2022-12-05 14:44:03', NULL),
(537, 4, 'haha', 'text', NULL, '2022-12-05 14:45:24', NULL),
(538, 4, 'haha', 'text', NULL, '2022-12-05 14:45:30', NULL),
(539, 4, 'hahah', 'text', NULL, '2022-12-05 14:45:36', NULL),
(540, 4, 'hahaha', 'text', NULL, '2022-12-05 14:45:46', NULL),
(541, 4, 'hahah', 'text', NULL, '2022-12-05 14:45:53', NULL),
(542, 4, 'heheh', 'text', NULL, '2022-12-05 14:45:59', NULL),
(543, 2, 'HELLO HELLO', 'text', NULL, '2022-12-05 15:04:16', NULL),
(544, 4, 'a', 'text', NULL, '2022-12-05 15:36:39', NULL),
(545, 4, 'heheheheheheh', 'text', NULL, '2022-12-05 15:36:54', NULL),
(546, 4, 'hmm', 'text', NULL, '2022-12-05 15:40:07', NULL),
(547, 4, 'aa', 'text', NULL, '2022-12-08 20:45:42', NULL),
(548, 2, '', 'image', NULL, '2022-12-09 22:18:04', NULL),
(549, 2, 'hello', 'text', NULL, '2022-12-10 02:05:58', NULL),
(550, 2, 'Hello 👋', 'text', NULL, '2022-12-11 15:07:09', NULL),
(551, 20, 'haha', 'text', NULL, '2022-12-11 15:07:32', NULL),
(552, 20, 'haha', 'text', NULL, '2022-12-11 15:07:42', NULL),
(553, 20, 'hihi', 'text', NULL, '2022-12-11 15:07:51', NULL),
(554, 20, 'hehe', 'text', NULL, '2022-12-11 15:07:55', NULL),
(555, 20, 'kk', 'text', NULL, '2022-12-11 15:07:59', NULL),
(556, 20, 'huhu', 'text', NULL, '2022-12-11 15:08:02', NULL),
(557, 20, 'kk', 'text', NULL, '2022-12-11 15:08:23', NULL),
(558, 20, 'kkkk', 'text', NULL, '2022-12-11 15:08:30', NULL),
(559, 20, 'aa', 'text', NULL, '2022-12-11 15:08:40', NULL),
(560, 2, 'dasdasd', 'text', NULL, '2022-12-11 15:10:41', NULL),
(561, 2, 'madsas', 'text', NULL, '2022-12-11 15:10:45', NULL),
(562, 2, 'adasdasd', 'text', NULL, '2022-12-11 15:10:48', NULL),
(563, 2, 'adasas', 'text', NULL, '2022-12-11 15:10:51', NULL),
(564, 2, 'adsasdas', 'text', NULL, '2022-12-11 15:10:59', NULL),
(565, 20, 'adas', 'text', NULL, '2022-12-11 15:11:18', NULL),
(566, 20, 'hhh', 'text', NULL, '2022-12-11 15:11:37', NULL),
(567, 20, 'hehieer', 'text', NULL, '2022-12-11 15:11:48', NULL),
(568, 20, 'erer', 'text', NULL, '2022-12-11 15:11:51', NULL),
(569, 20, 'eer', 'text', NULL, '2022-12-11 15:11:55', NULL),
(570, 20, 'asd', 'text', NULL, '2022-12-11 15:12:19', NULL),
(571, 20, 'ehhere', 'text', NULL, '2022-12-11 15:12:23', NULL),
(572, 20, 'adasdas', 'text', NULL, '2022-12-11 15:12:57', NULL),
(573, 20, 'as', 'text', NULL, '2022-12-11 15:13:29', NULL),
(574, 20, 'asdasd', 'text', NULL, '2022-12-11 15:13:33', NULL),
(575, 20, 'asdas', 'text', NULL, '2022-12-11 15:13:39', NULL),
(576, 20, 'aa', 'text', NULL, '2022-12-11 15:25:38', NULL),
(577, 20, 'asas', 'text', NULL, '2022-12-11 15:25:45', NULL),
(578, 20, 'a', 'text', NULL, '2022-12-11 15:27:34', NULL),
(579, 20, 'asd', 'text', NULL, '2022-12-11 15:27:43', NULL),
(580, 20, 'asd', 'text', NULL, '2022-12-11 15:28:12', NULL),
(581, 20, 'asdas', 'text', NULL, '2022-12-11 15:28:15', NULL),
(582, 20, 'adas', 'text', NULL, '2022-12-11 15:28:21', NULL),
(583, 20, 'adsas', 'text', NULL, '2022-12-11 15:28:27', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `message_attachments`
--

CREATE TABLE `message_attachments` (
  `id` int UNSIGNED NOT NULL,
  `message_id` int UNSIGNED NOT NULL,
  `attachment_content` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `message_attachments`
--

INSERT INTO `message_attachments` (`id`, `message_id`, `attachment_content`) VALUES
(9, 165, 'upload\\msg\\1668480891177.jpeg'),
(10, 166, 'upload\\msg\\1668482909462.png'),
(11, 215, 'upload\\msg\\1669198164375.png'),
(14, 225, 'upload\\msg\\1669248958346.png'),
(15, 228, 'upload\\msg\\1669371793390.png'),
(16, 548, 'upload\\msg\\1670599084945.gif');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `message_recipients`
--

CREATE TABLE `message_recipients` (
  `id` int UNSIGNED NOT NULL,
  `recipient_id` int UNSIGNED NOT NULL,
  `recipient_room_id` int UNSIGNED DEFAULT NULL,
  `message_id` int UNSIGNED NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `message_recipients`
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
(341, 2, 30, 178, 1),
(343, 2, 30, 179, 1),
(345, 2, 30, 180, 1),
(347, 2, 30, 181, 1),
(349, 2, 30, 182, 1),
(351, 2, 30, 183, 1),
(353, 2, 30, 184, 1),
(355, 2, 43, 185, 1),
(357, 5, 28, 186, 1),
(358, 2, 29, 186, 1),
(359, 2, 30, 187, 1),
(361, 2, 30, 188, 1),
(363, 2, 30, 189, 1),
(365, 2, 30, 190, 1),
(367, 2, 30, 191, 1),
(369, 2, 30, 192, 1),
(371, 2, 30, 193, 1),
(373, 2, 30, 194, 1),
(375, 2, 30, 195, 1),
(377, 2, 30, 196, 1),
(379, 2, 30, 197, 1),
(381, 2, 30, 198, 1),
(383, 2, 30, 199, 1),
(385, 2, 30, 200, 1),
(387, 2, 30, 201, 1),
(389, 2, 30, 202, 1),
(391, 2, 30, 203, 1),
(393, 2, 43, 204, 0),
(395, 2, 43, 205, 0),
(397, 7, 53, 205, 0),
(398, 2, 43, 206, 0),
(400, 7, 53, 206, 1),
(401, 2, 43, 207, 0),
(403, 7, 53, 207, 0),
(404, 2, 30, 208, 1),
(406, 2, 30, 209, 1),
(408, 2, 30, 210, 1),
(410, 2, 34, 211, 1),
(411, 7, 35, 211, 1),
(412, 7, 57, 212, 1),
(414, 7, 57, 213, 1),
(416, 2, 36, 214, 1),
(417, 10, 37, 214, 0),
(418, 5, 28, 215, 1),
(419, 2, 29, 215, 1),
(420, 2, 43, 216, 1),
(422, 7, 53, 216, 0),
(423, 2, 34, 217, 1),
(424, 7, 35, 217, 1),
(425, 2, 44, 218, 1),
(427, 7, 54, 218, 0),
(428, 2, 44, 219, 1),
(430, 7, 54, 219, 0),
(431, 2, 44, 220, 1),
(433, 7, 54, 220, 0),
(440, 2, 44, 223, 0),
(442, 7, 54, 223, 0),
(443, 2, 44, 224, 0),
(445, 7, 54, 224, 0),
(446, 2, 40, 225, 1),
(447, 12, 41, 225, 0),
(448, 2, 44, 226, 0),
(450, 7, 54, 226, 1),
(451, 2, 44, 227, 0),
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
(700, 7, 57, 351, 1),
(702, 2, 43, 352, 0),
(704, 7, 53, 352, 1),
(705, 7, 57, 353, 1),
(707, 7, 57, 354, 1),
(709, 2, 44, 355, 0),
(711, 7, 54, 355, 0),
(712, 2, 43, 356, 0),
(714, 7, 53, 356, 0),
(715, 2, 43, 357, 0),
(717, 7, 53, 357, 0),
(718, 2, 44, 358, 0),
(720, 7, 54, 358, 0),
(721, 2, 44, 359, 0),
(723, 7, 54, 359, 0),
(724, 2, 43, 360, 0),
(726, 7, 53, 360, 0),
(727, 2, 45, 361, 0),
(729, 7, 55, 361, 0),
(730, 2, 45, 362, 0),
(732, 7, 55, 362, 1),
(733, 2, 45, 363, 0),
(735, 7, 55, 363, 1),
(736, 2, 45, 364, 0),
(738, 7, 55, 364, 1),
(739, 2, 44, 365, 0),
(741, 7, 54, 365, 0),
(742, 2, 44, 366, 0),
(744, 7, 54, 366, 1),
(745, 2, 43, 367, 0),
(747, 7, 53, 367, 1),
(748, 2, 43, 368, 0),
(750, 7, 53, 368, 0),
(751, 2, 44, 369, 0),
(753, 7, 54, 369, 0),
(754, 2, 46, 370, 0),
(756, 7, 56, 370, 1),
(757, 2, 45, 371, 0),
(759, 7, 55, 371, 0),
(760, 2, 46, 372, 0),
(762, 7, 56, 372, 0),
(763, 2, 45, 373, 0),
(765, 7, 55, 373, 0),
(766, 2, 44, 374, 0),
(768, 7, 54, 374, 1),
(769, 2, 44, 375, 0),
(771, 7, 54, 375, 0),
(772, 2, 44, 376, 0),
(774, 7, 54, 376, 1),
(775, 2, 44, 377, 0),
(777, 7, 54, 377, 1),
(778, 7, 57, 378, 1),
(780, 7, 57, 379, 1),
(782, 7, 57, 380, 1),
(784, 7, 57, 381, 1),
(786, 7, 57, 382, 1),
(788, 7, 57, 383, 1),
(790, 7, 57, 384, 1),
(792, 7, 57, 385, 1),
(794, 7, 57, 386, 1),
(796, 7, 57, 387, 1),
(798, 7, 57, 388, 1),
(800, 7, 57, 389, 1),
(802, 7, 57, 390, 1),
(804, 7, 57, 391, 1),
(806, 7, 57, 392, 1),
(808, 7, 57, 393, 1),
(810, 2, 30, 394, 1),
(812, 7, 57, 395, 1),
(814, 7, 57, 396, 1),
(816, 2, 30, 397, 1),
(818, 2, 30, 398, 1),
(820, 2, 30, 399, 1),
(822, 2, 30, 400, 1),
(824, 2, 30, 401, 1),
(826, 2, 30, 402, 1),
(828, 2, 30, 403, 1),
(830, 2, 30, 404, 1),
(832, 2, 30, 405, 1),
(834, 2, 30, 406, 1),
(836, 2, 30, 407, 1),
(838, 2, 30, 408, 1),
(840, 2, 30, 409, 1),
(842, 2, 30, 410, 1),
(844, 2, 30, 411, 1),
(846, 2, 30, 412, 1),
(848, 2, 30, 413, 1),
(850, 2, 30, 414, 1),
(852, 2, 30, 415, 1),
(854, 2, 30, 416, 1),
(856, 2, 30, 417, 1),
(858, 2, 30, 418, 1),
(860, 2, 30, 419, 1),
(862, 2, 30, 420, 1),
(864, 2, 30, 421, 1),
(866, 2, 30, 422, 1),
(868, 2, 30, 423, 1),
(870, 2, 30, 424, 1),
(872, 2, 30, 425, 1),
(874, 2, 30, 426, 1),
(876, 2, 40, 427, 1),
(877, 12, 41, 427, 0),
(878, 2, 40, 428, 1),
(879, 12, 41, 428, 0),
(880, 2, 30, 429, 1),
(882, 2, 30, 430, 1),
(884, 2, 30, 431, 1),
(886, 2, 30, 432, 1),
(888, 2, 30, 433, 1),
(890, 2, 30, 434, 1),
(892, 2, 36, 435, 1),
(893, 10, 37, 435, 0),
(894, 2, 36, 436, 1),
(895, 10, 37, 436, 0),
(896, 2, 40, 437, 1),
(897, 12, 41, 437, 0),
(898, 5, 28, 438, 0),
(899, 2, 29, 438, 1),
(900, 2, 32, 439, 1),
(901, 8, 33, 439, 0),
(902, 2, 30, 440, 1),
(904, 2, 30, 441, 1),
(906, 2, 30, 442, 1),
(908, 2, 30, 443, 1),
(910, 2, 30, 444, 1),
(912, 2, 30, 445, 1),
(914, 2, 30, 446, 1),
(916, 2, 30, 447, 1),
(918, 2, 30, 448, 1),
(920, 2, 30, 449, 1),
(922, 2, 30, 450, 1),
(924, 2, 30, 451, 1),
(926, 2, 32, 452, 1),
(927, 8, 33, 452, 0),
(928, 2, 30, 453, 1),
(930, 2, 30, 454, 1),
(932, 2, 30, 455, 1),
(934, 2, 30, 456, 1),
(936, 2, 30, 457, 1),
(938, 2, 30, 458, 1),
(940, 2, 30, 459, 1),
(942, 2, 30, 460, 1),
(944, 2, 30, 461, 1),
(946, 2, 30, 462, 1),
(948, 2, 30, 463, 1),
(950, 2, 30, 464, 1),
(952, 2, 30, 465, 1),
(954, 2, 30, 466, 1),
(956, 2, 30, 467, 1),
(958, 2, 30, 468, 1),
(960, 2, 30, 469, 1),
(962, 2, 30, 470, 1),
(964, 2, 30, 471, 1),
(966, 2, 30, 472, 1),
(968, 2, 30, 473, 1),
(970, 2, 30, 474, 1),
(972, 2, 30, 475, 1),
(974, 2, 30, 476, 1),
(976, 2, 30, 477, 1),
(978, 2, 30, 478, 1),
(980, 2, 30, 479, 1),
(982, 2, 30, 480, 1),
(984, 2, 30, 481, 1),
(986, 2, 30, 482, 1),
(988, 2, 30, 483, 1),
(990, 2, 30, 484, 1),
(992, 2, 30, 485, 1),
(994, 2, 30, 486, 1),
(996, 2, 30, 487, 1),
(998, 2, 30, 488, 1),
(1000, 2, 30, 489, 1),
(1002, 2, 30, 490, 1),
(1004, 2, 30, 491, 1),
(1006, 2, 30, 492, 1),
(1008, 2, 30, 493, 1),
(1010, 2, 30, 494, 1),
(1012, 2, 30, 495, 1),
(1014, 2, 30, 496, 1),
(1016, 2, 30, 497, 1),
(1018, 2, 32, 498, 1),
(1019, 8, 33, 498, 0),
(1020, 7, 57, 499, 0),
(1022, 7, 57, 500, 0),
(1024, 2, 30, 501, 1),
(1026, 2, 30, 502, 1),
(1028, 2, 30, 503, 1),
(1030, 2, 30, 504, 1),
(1032, 2, 30, 505, 1),
(1034, 2, 30, 506, 1),
(1036, 2, 30, 507, 1),
(1038, 2, 30, 508, 1),
(1040, 2, 30, 509, 1),
(1042, 2, 30, 510, 1),
(1044, 7, 57, 511, 0),
(1046, 7, 57, 512, 0),
(1048, 2, 30, 513, 1),
(1050, 2, 30, 514, 1),
(1052, 2, 30, 515, 1),
(1054, 2, 30, 516, 1),
(1056, 2, 30, 517, 1),
(1058, 2, 30, 518, 1),
(1060, 2, 30, 519, 1),
(1062, 2, 32, 520, 1),
(1063, 8, 33, 520, 0),
(1064, 2, 30, 521, 1),
(1066, 2, 30, 522, 1),
(1068, 5, 28, 523, 0),
(1069, 2, 29, 523, 1),
(1070, 2, 40, 524, 1),
(1071, 12, 41, 524, 0),
(1072, 2, 34, 525, 1),
(1073, 7, 35, 525, 0),
(1074, 2, 30, 526, 1),
(1076, 2, 30, 527, 1),
(1078, 2, 30, 528, 1),
(1080, 2, 30, 529, 1),
(1082, 2, 30, 530, 1),
(1084, 2, 30, 531, 1),
(1086, 2, 30, 532, 1),
(1088, 7, 57, 533, 0),
(1090, 2, 30, 534, 1),
(1092, 2, 30, 535, 1),
(1094, 2, 30, 536, 1),
(1096, 7, 57, 537, 0),
(1098, 2, 30, 538, 1),
(1100, 2, 30, 539, 1),
(1102, 2, 30, 540, 1),
(1104, 2, 30, 541, 1),
(1106, 2, 30, 542, 1),
(1108, 2, 60, 543, 1),
(1109, 13, 61, 543, 0),
(1110, 2, 30, 544, 1),
(1112, 2, 30, 545, 1),
(1114, 2, 30, 546, 1),
(1116, 2, 30, 547, 1),
(1118, 2, 40, 548, 1),
(1119, 12, 41, 548, 0),
(1120, 2, 64, 549, 1),
(1121, 2, 65, 550, 1),
(1122, 20, 66, 550, 1),
(1123, 2, 65, 551, 1),
(1124, 20, 66, 551, 1),
(1125, 2, 65, 552, 1),
(1126, 20, 66, 552, 1),
(1127, 2, 65, 553, 1),
(1128, 20, 66, 553, 1),
(1129, 2, 65, 554, 1),
(1130, 20, 66, 554, 1),
(1131, 2, 65, 555, 1),
(1132, 20, 66, 555, 1),
(1133, 2, 65, 556, 1),
(1134, 20, 66, 556, 1),
(1135, 2, 65, 557, 1),
(1136, 20, 66, 557, 1),
(1137, 2, 65, 558, 1),
(1138, 20, 66, 558, 1),
(1139, 2, 65, 559, 1),
(1140, 20, 66, 559, 1),
(1141, 2, 65, 560, 1),
(1142, 20, 66, 560, 1),
(1143, 2, 65, 561, 1),
(1144, 20, 66, 561, 1),
(1145, 2, 65, 562, 1),
(1146, 20, 66, 562, 1),
(1147, 2, 65, 563, 1),
(1148, 20, 66, 563, 1),
(1149, 2, 65, 564, 1),
(1150, 20, 66, 564, 1),
(1151, 2, 65, 565, 1),
(1152, 20, 66, 565, 1),
(1153, 2, 65, 566, 1),
(1154, 20, 66, 566, 1),
(1155, 2, 65, 567, 1),
(1156, 20, 66, 567, 1),
(1157, 2, 65, 568, 1),
(1158, 20, 66, 568, 1),
(1159, 2, 65, 569, 1),
(1160, 20, 66, 569, 1),
(1161, 2, 65, 570, 1),
(1162, 20, 66, 570, 1),
(1163, 2, 65, 571, 1),
(1164, 20, 66, 571, 1),
(1165, 2, 65, 572, 1),
(1166, 20, 66, 572, 1),
(1167, 2, 65, 573, 1),
(1168, 20, 66, 573, 1),
(1169, 2, 65, 574, 1),
(1170, 20, 66, 574, 1),
(1171, 2, 65, 575, 1),
(1172, 20, 66, 575, 1),
(1173, 2, 65, 576, 1),
(1174, 20, 66, 576, 1),
(1175, 2, 65, 577, 1),
(1176, 20, 66, 577, 1),
(1177, 2, 65, 578, 1),
(1178, 20, 66, 578, 1),
(1179, 2, 65, 579, 1),
(1180, 20, 66, 579, 1),
(1181, 2, 65, 580, 1),
(1182, 20, 66, 580, 1),
(1183, 2, 65, 581, 1),
(1184, 20, 66, 581, 1),
(1185, 2, 65, 582, 1),
(1186, 20, 66, 582, 1),
(1187, 2, 65, 583, 1),
(1188, 20, 66, 583, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifiable`
--

CREATE TABLE `notifiable` (
  `id` int UNSIGNED NOT NULL,
  `source_type` enum('post','channel','user') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Đang đổ dữ liệu cho bảng `notifiable`
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
(86, 'post'),
(87, 'post'),
(88, 'post'),
(89, 'post'),
(90, 'channel'),
(91, 'post'),
(92, 'channel'),
(94, 'user'),
(95, 'user'),
(96, 'user'),
(97, 'user'),
(98, 'user'),
(99, 'channel'),
(100, 'channel'),
(101, 'channel');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int UNSIGNED NOT NULL,
  `notifiable_id` int UNSIGNED NOT NULL,
  `type` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`id`, `notifiable_id`, `type`) VALUES
(23, 42, 1),
(25, 42, 2),
(45, 43, 1),
(57, 79, 1),
(17, 79, 2),
(18, 80, 2),
(19, 81, 2),
(20, 82, 2),
(21, 83, 2),
(22, 84, 2),
(44, 89, 2),
(58, 91, 1),
(64, 91, 2),
(60, 92, 1),
(65, 96, 2),
(66, 97, 2),
(67, 98, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notification_receivers`
--

CREATE TABLE `notification_receivers` (
  `id` int UNSIGNED NOT NULL,
  `notification_id` int UNSIGNED NOT NULL,
  `receiver_id` int UNSIGNED NOT NULL,
  `status` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Đang đổ dữ liệu cho bảng `notification_receivers`
--

INSERT INTO `notification_receivers` (`id`, `notification_id`, `receiver_id`, `status`, `created_at`) VALUES
(9, 17, 2, 0, '2022-12-12 10:01:53'),
(10, 17, 7, 0, '2022-12-06 00:00:00'),
(12, 25, 4, 0, '2022-12-03 08:55:54'),
(13, 23, 8, 0, '0000-00-00 00:00:00'),
(14, 23, 5, 1, '0000-00-00 00:00:00'),
(15, 23, 11, 0, '0000-00-00 00:00:00'),
(16, 23, 13, 0, '0000-00-00 00:00:00'),
(17, 44, 2, 0, '2022-12-06 20:34:35'),
(18, 45, 2, 0, '2022-12-07 21:54:00'),
(21, 45, 5, 0, '2022-12-07 22:14:21'),
(22, 23, 14, 0, '2022-12-08 23:02:50'),
(26, 25, 20, 0, '2022-12-09 23:03:06'),
(30, 65, 20, 0, '2022-12-10 01:43:09'),
(31, 66, 20, 0, '2022-12-10 01:52:26'),
(32, 67, 2, 1, '2022-12-10 02:49:24');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `id` int UNSIGNED NOT NULL,
  `author_id` int UNSIGNED NOT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `background_url` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `last_updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `posts`
--

INSERT INTO `posts` (`id`, `author_id`, `title`, `content`, `background_url`, `created_at`, `last_updated_at`) VALUES
(13, 5, 'Hello', '<p><img src=\"data:image/jpeg;base64,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\" width=\"605\" style=\"display: block; margin: auto;\"></p><p><br></p>', NULL, '2022-11-11 03:16:42', NULL);
INSERT INTO `posts` (`id`, `author_id`, `title`, `content`, `background_url`, `created_at`, `last_updated_at`) VALUES
(15, 2, 'Understanding Node.js Event-Driven Architecture', '<p>Most of Node’s objects — like HTTP requests, responses, and streams — implement the&nbsp;EventEmitter&nbsp;module so they can provide a way to emit and listen to events.</p><p><br></p><p><img src=\"https://cdn-media-1.freecodecamp.org/images/1*74K5OhiYt7WTR0WuVGeNLQ.png\" width=\"342\" style=\"display: block; margin: auto; cursor: nwse-resize;\"></p><p><br></p><p>The simplest form of the event-driven nature is the callback style of some of the popular Node.js functions — for example,&nbsp;fs.readFile. In this analogy, the event will be fired once (when Node is ready to call the callback) and the callback acts as the event handler.</p><p>Let’s explore this basic form first.</p><p><br></p><h4>Call me when you’re ready, Node!</h4><p>The original way Node handled asynchronous events was with callback. This was a long time ago, before JavaScript had native promises support and the async/await feature.</p><p>Callbacks are basically just functions that you pass to other functions. This is possible in JavaScript because functions are first class objects.</p><p><br></p><p>It’s important to understand that callbacks do not indicate an asynchronous call in the code. A function can call the callback both synchronously and asynchronously.</p><p>For example, here’s a host function&nbsp;fileSize&nbsp;that accepts a callback function&nbsp;cb&nbsp;and can invoke that callback function both synchronously and asynchronously based on a condition:</p><pre class=\"ql-syntax\" spellcheck=\"false\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title function_\">fileSize</span> (fileName, cb) {\n  <span class=\"hljs-keyword\">if</span> (<span class=\"hljs-keyword\">typeof</span> fileName !== <span class=\"hljs-string\">\'string\'</span>) {\n    <span class=\"hljs-keyword\">return</span> <span class=\"hljs-title function_\">cb</span>(<span class=\"hljs-keyword\">new</span> <span class=\"hljs-title class_\">TypeError</span>(<span class=\"hljs-string\">\'argument should be string\'</span>)); <span class=\"hljs-comment\">// Sync</span>\n  }\n  fs.<span class=\"hljs-title function_\">stat</span>(fileName, <span class=\"hljs-function\">(<span class=\"hljs-params\">err, stats</span>) =&gt;</span> {\n    <span class=\"hljs-keyword\">if</span> (err) { <span class=\"hljs-keyword\">return</span> <span class=\"hljs-title function_\">cb</span>(err); } <span class=\"hljs-comment\">// Asynccb(null, stats.size); // Async</span>\n  });\n}\n</pre><p><br></p><p>Note that this is a bad practice that leads to unexpected errors. Design host functions to consume callback either always synchronously or always asynchronously.</p><p>Let’s explore a simple example of a typical asynchronous Node function that’s written with a callback style:</p><pre class=\"ql-syntax\" spellcheck=\"false\"><span class=\"hljs-keyword\">const</span> readFileAsArray = <span class=\"hljs-keyword\">function</span>(<span class=\"hljs-params\">file, cb</span>) {\n  fs.<span class=\"hljs-title function_\">readFile</span>(file, <span class=\"hljs-keyword\">function</span>(<span class=\"hljs-params\">err, data</span>) {\n    <span class=\"hljs-keyword\">if</span> (err) {\n      <span class=\"hljs-keyword\">return</span> <span class=\"hljs-title function_\">cb</span>(err);\n    }\n    <span class=\"hljs-keyword\">const</span> lines = data.<span class=\"hljs-title function_\">toString</span>().<span class=\"hljs-title function_\">trim</span>().<span class=\"hljs-title function_\">split</span>(<span class=\"hljs-string\">\'\\n\'</span>);\n    <span class=\"hljs-title function_\">cb</span>(<span class=\"hljs-literal\">null</span>, lines);\n  });\n};\n</pre><p><br></p><p>readFileAsArray&nbsp;takes a file path and a callback function. It reads the file content, splits it into an array of lines, and calls the callback function with that array.</p><p>Here’s an example use for it. Assuming that we have the file&nbsp;numbers.txt&nbsp;in the same directory with content like this:</p><pre class=\"ql-syntax\" spellcheck=\"false\">10\n11\n12\n13\n14\n15\n</pre><p><br></p><p>If we have a task to count the odd numbers in that file, we can use&nbsp;readFileAsArray&nbsp;to simplify the code:</p><pre class=\"ql-syntax\" spellcheck=\"false\"><span class=\"hljs-title function_\">readFileAsArray</span>(<span class=\"hljs-string\">\'./numbers.txt\'</span>, <span class=\"hljs-function\">(<span class=\"hljs-params\">err, lines</span>) =&gt;</span> {\n  <span class=\"hljs-keyword\">if</span> (err) <span class=\"hljs-keyword\">throw</span> err;\n  <span class=\"hljs-keyword\">const</span> numbers = lines.<span class=\"hljs-title function_\">map</span>(<span class=\"hljs-title class_\">Number</span>);\n  <span class=\"hljs-keyword\">const</span> oddNumbers = numbers.<span class=\"hljs-title function_\">filter</span>(<span class=\"hljs-function\"><span class=\"hljs-params\">n</span> =&gt;</span> n%<span class=\"hljs-number\">2</span> === <span class=\"hljs-number\">1</span>);\n  <span class=\"hljs-variable language_\">console</span>.<span class=\"hljs-title function_\">log</span>(<span class=\"hljs-string\">\'Odd numbers count:\'</span>, oddNumbers.<span class=\"hljs-property\">length</span>);\n});\n</pre><p><br></p><p>The code reads the numbers content into an array of strings, parses them as numbers, and counts the odd ones.</p><p>Node’s callback style is used purely here. The callback has an error-first argument&nbsp;err&nbsp;that’s nullable and we pass the callback as the last argument for the host function. You should always do that in your functions because users will probably assume that. Make the host function receive the callback as its last argument and make the callback expect an error object as its first argument.</p>', NULL, '2022-11-25 09:48:39', NULL),
(19, 2, 'Highlight code demo', '<pre class=\"ql-syntax\" spellcheck=\"false\">function $initHighlight(block, cls) {\n  try {\n    if (cls.search(/\\bno\\-highlight\\b/) != -1)\n      return process(block, true, 0x0F) +\n             ` class=\"${cls}\"`;\n  } catch (e) {\n    /* handle exception */\n  }\n  for (var i = 0 / 2; i &lt; classes.length; i++) {\n    if (checkCondition(classes[i]) === undefined)\n      console.log(\'undefined\');\n  }\n\n  return (\n    &lt;div&gt;\n      &lt;web-component&gt;{block}&lt;/web-component&gt;\n    &lt;/div&gt;\n  )\n}\n\nexport  $initHighlight;\n</pre><p><br></p>', NULL, '2022-11-30 21:02:03', NULL);
INSERT INTO `posts` (`id`, `author_id`, `title`, `content`, `background_url`, `created_at`, `last_updated_at`) VALUES
(21, 2, 'Demo first program in JS ', '<p><img src=\"data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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\" width=\"166\" style=\"\"></p><pre class=\"ql-syntax\" spellcheck=\"false\"><span class=\"hljs-keyword\">const</span> <span class=\"hljs-title function_\">hello</span> = () =&gt; {\n  <span class=\"hljs-variable language_\">console</span>.<span class=\"hljs-title function_\">log</span>(<span class=\"hljs-string\">\"Hello World\"</span>);  \n}\n</pre><blockquote>The above code is written in JS.</blockquote><p><br></p>', NULL, '2022-12-09 00:11:50', NULL);
INSERT INTO `posts` (`id`, `author_id`, `title`, `content`, `background_url`, `created_at`, `last_updated_at`) VALUES
(22, 7, 'Why use NextJS', '<h3><span style=\"color: rgb(255, 220, 0);\">Introduction</span></h3><p>Next.js is an open-source, lightweight and JavaScript framework, which allows you to</p><p>develop fast and user-friendly web applications and static websites using React.</p><p>It is a ReactJS framework for building server-rendered web applications. It includes a number of features out of the box, such as Automatic code splitting, filesystem-based routing, hot code reloading and universal rendering.</p><p><img src=\"https://res.cloudinary.com/practicaldev/image/fetch/s--dWbmgmcw--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0oqlfzpvx0rkns65juxt.png\" width=\"481\" style=\"display: block; margin: auto;\"></p><p>By framework, we mean Next.js handles the tooling and configuration needed for React, and provides additional structure, features, and optimizations for your application.</p><p>Next.js was created by Guillermo Rauch, a software engineer at Vercel, and is maintained by a team of developers at Vercel. It is an open-source project, and you can find the source code on GitHub.</p><p><br></p><h3><span style=\"color: rgb(255, 220, 0);\">What is Next.js used for?</span></h3><p>Next.JS is best know for building applications such as:</p><ul><li>E-commerce websites</li><li>Blogs</li><li>Portfolio websites</li><li>Documentation websites</li><li>Marketing websites, etc.</li></ul><p><br></p><h3><span style=\"color: rgb(255, 220, 0);\">Difference between Next.js and React.js</span></h3><p>Both Next.js and React are common tools to build a web application. However, there is a clear difference between them, which highly impacts the final choice. Let’s find out what this difference is and when to choose between Next.js vs React.</p><p>You will discover several benefits and disadvantages of using Next JS and React for React/JavaScript projects if you use them for your development project. These are the crucial front-end development tools, nevertheless, which provide a smooth and enjoyable online development experience. Although both are simple to learn, they have different learning curves.</p><pre class=\"ql-syntax\" spellcheck=\"false\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title function_\">HelloNextJs</span>() {\n  <span class=\"hljs-variable language_\">console</span>.<span class=\"hljs-title function_\">log</span>(<span class=\"hljs-string\">\"Hello world\"</span>);\n}\n</pre><p>Have fun coding!!! ✨</p>', NULL, '2022-12-09 08:48:31', NULL),
(23, 2, 'Why use NextJs', '<h3><span style=\"color: rgb(255, 220, 0);\">Introduction</span></h3><p>Next.js is an open-source, lightweight and JavaScript framework, which allows you to develop fast and user-friendly web applications and static websites using React.</p><p>It is a ReactJS framework for building server-rendered web applications. It includes a number of features out of the box, such as Automatic code splitting, filesystem-based routing, hot code reloading and universal rendering.</p><p><img src=\"https://res.cloudinary.com/practicaldev/image/fetch/s--dWbmgmcw--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0oqlfzpvx0rkns65juxt.png\"></p><p>By framework, we mean Next.js handles the tooling and configuration needed for React, and provides additional structure, features, and optimizations for your application.</p><p>Next.js was created by Guillermo Rauch, a software engineer at Vercel, and is maintained by a team of developers at Vercel. It is an open-source project, and you can find the source code on GitHub.</p><h3><span style=\"color: rgb(255, 220, 0);\">Fun Fact✨</span></h3><p>Are you a beginner to ReactJS or NextSJ? I recommend&nbsp;Documatic VScode Extension</p><p>This extension brings&nbsp;Documatic&nbsp;to VSCode: quickly search your large codebases using simple queries - what does it do? what dependencies does it have? And more.</p><p>Documatic search uses AI to link relations between your query and snippets of code, so you don\'t have to know the exact keywords you\'re looking for!</p><h3><span style=\"color: rgb(255, 220, 0);\">What is Next.js used for?</span></h3><p>Next.JS is best know for building applications such as:</p><ul><li>E-commerce websites</li><li>Blogs</li><li>Portfolio websites</li><li>Documentation websites</li><li>Marketing websites, etc.</li></ul><h3><span style=\"color: rgb(255, 220, 0);\">Difference between Next.js and React.js</span></h3><p>Both Next.js and React are common tools to build a web application.</p>', NULL, '2022-12-09 08:51:13', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `post_comments`
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
-- Đang đổ dữ liệu cho bảng `post_comments`
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
(69, 15, 2, 'a', 55, '2022-12-03 00:58:54', 86),
(70, 19, 5, 'he', NULL, '2022-12-06 12:43:20', 87),
(71, 15, 2, 'Hahahahaha', NULL, '2022-12-07 15:48:13', 88),
(72, 15, 5, 'hoho ', NULL, '2022-12-07 20:01:09', 89),
(73, 15, 2, 'a', NULL, '2022-12-09 00:38:09', 91);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `post_likes`
--

CREATE TABLE `post_likes` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `post_id` int UNSIGNED NOT NULL,
  `liked` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `post_likes`
--

INSERT INTO `post_likes` (`id`, `user_id`, `post_id`, `liked`) VALUES
(2, 4, 13, 1),
(4, 5, 13, 1),
(75, 2, 15, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rooms`
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
-- Đang đổ dữ liệu cho bảng `rooms`
--

INSERT INTO `rooms` (`id`, `channel_id`, `type`, `title`, `created_at`, `removable`) VALUES
(15, NULL, 'single', NULL, '2022-11-14 21:35:52', 0),
(16, NULL, 'single', NULL, '2022-11-18 22:34:12', 0),
(17, NULL, 'single', NULL, '2022-11-19 09:57:55', 0),
(18, NULL, 'single', NULL, '2022-11-19 10:02:19', 0),
(19, NULL, 'single', NULL, '2022-11-19 10:04:42', 0),
(20, NULL, 'single', NULL, '2022-11-19 10:07:27', 0),
(21, NULL, 'single', NULL, '2022-11-19 10:09:50', 0),
(23, 5, 'group', 'NodeJs', '2022-11-21 14:19:02', 1),
(24, 5, 'group', 'ReactJs', '2022-11-21 14:19:39', 1),
(25, 5, 'group', 'DevOps', '2022-11-21 14:20:05', 1),
(26, 5, 'group', 'Database', '2022-11-21 14:20:54', 1),
(27, NULL, 'single', NULL, '2022-11-23 13:57:43', 0),
(29, 5, 'group', 'Design', '2022-12-01 10:22:38', 1),
(30, NULL, 'single', NULL, '2022-12-05 15:04:16', 0),
(31, 12, 'group', 'FirstRoom', '2022-12-07 21:52:46', 1),
(32, 13, 'group', 'First room', '2022-12-09 22:23:22', 1),
(33, 5, 'group', 'Testing', '2022-12-10 02:05:53', 1),
(34, NULL, 'single', NULL, '2022-12-11 15:07:09', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tags`
--

CREATE TABLE `tags` (
  `id` int UNSIGNED NOT NULL,
  `post_id` int UNSIGNED NOT NULL,
  `tag_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tags`
--

INSERT INTO `tags` (`id`, `post_id`, `tag_name`) VALUES
(3, 15, 'Javascript'),
(4, 15, 'NodeJS'),
(6, 19, 'Javascript'),
(7, 21, 'Javascript'),
(8, 21, 'Blockchain'),
(9, 22, 'Blockchain'),
(10, 22, 'DevOps'),
(11, 22, 'Express'),
(12, 23, 'Javascript'),
(13, 23, 'ReactJS');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` enum('male','female','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(400) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `joined_date` datetime NOT NULL,
  `last_active` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password`, `gender`, `avatar_url`, `description`, `joined_date`, `last_active`) VALUES
(2, 'lvdat.roy@gmail.com', 'lvdat', '$2b$10$C3HqjsVkxY3D5hq6Gqh6TeO8yhkeMd/yOi4wo7Z68s/fBg6oywiG2', 'other', 'https://scontent.fhan14-1.fna.fbcdn.net/v/t1.15752-9/243978555_399918004863466_1703240540387963577_n.png?_nc_cat=111&ccb=1-7&_nc_sid=ae9488&_nc_ohc=dho8WpLGNJcAX8oALZI&_nc_ht=scontent.fhan14-1.fna&oh=03_AdRqImAa7DcuxULQAC0IKsnKiSgjskLzsCVMZIUV7DrUFg&oe=63AC6BB1', 'A simple person.', '0000-00-00 00:00:00', '2022-12-11 15:31:48'),
(4, 'hihi@gmail.com', 'hihi', '$2b$10$fNK.tEsPwzfNHl44OEXSF.Vsu5at3mRZmb0fVL5RspjCtSSCezzSG', 'other', 'https://lh3.googleusercontent.com/a/ALm5wu3cKEstY_5YSSQTHEfunU7ojzrWGV9uI7_ceZsn=s96-c', NULL, '2022-11-05 17:51:30', '2022-12-09 22:00:56'),
(5, 'a4k29.hh4@gmail.com', 'nekokun', '$2b$10$Gb8Eb6nH7sX8eVxtX8IeVOc1yBkl2KO3gKsr4k90BO1ZmlQGoMgzS', 'other', 'https://scontent.fhan14-1.fna.fbcdn.net/v/t1.15752-9/195974949_534419381069328_926187293498061728_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=ae9488&_nc_ohc=NOE20ofJWIkAX_vkfP3&_nc_ht=scontent.fhan14-1.fna&oh=03_AdQ-xy00IjLwQVmO3lvHsNk0oxb74Z95sZPsP3EgK5ktiw&oe=63AC6030', NULL, '2022-11-05 18:19:58', '2022-12-09 20:05:52'),
(7, '21020298@vnu.edu.vn', 'UETốt', '$2b$10$IG.KASH3/c9erpe.DayLoe0Qd8MZLyBmKWkNMbnzMa4OFhD/qWZ9C', 'other', 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.15752-9/296048571_5375031022616469_2440968245869429416_n.png?_nc_cat=110&ccb=1-7&_nc_sid=ae9488&_nc_ohc=-rQCk3GsFeMAX9oF1ya&_nc_ht=scontent.fhan2-5.fna&oh=03_AdSTHwHA-sc-brMhGvFtDN4LFStf2c6mrqmrV22cNHITGg&oe=639FD3B6', NULL, '2022-11-19 09:54:25', '1900-01-24 16:16:09'),
(8, 'meow@gmail.com', 'meow', '$2b$10$IG.KASH3/c9erpe.DayLoe0Qd8MZLyBmKWkNMbnzMa4OFhD/qWZ9C', NULL, 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.15752-9/275977893_727683845078674_6093481772108505383_n.webp?stp=dst-webp&_nc_cat=107&ccb=1-7&_nc_sid=ae9488&_nc_ohc=l9uPbnQbux8AX_2cLf5&_nc_ht=scontent.fhan2-5.fna&oh=03_AdTT0yzpwwYrpJH2ZAuD90mYKxk--wF5619a8_SxQoQn_A&oe=639FD39F', NULL, '2022-11-19 03:55:10', '2022-12-07 15:45:34'),
(10, 'bin@gmail.com', 'bin', '$2b$10$IG.KASH3/c9erpe.DayLoe0Qd8MZLyBmKWkNMbnzMa4OFhD/qWZ9C', NULL, 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.15752-9/284916187_399746062119657_6474159232839858156_n.png?_nc_cat=104&ccb=1-7&_nc_sid=ae9488&_nc_ohc=M4_b7H2QeHUAX_9Yg2M&_nc_ht=scontent.fhan2-5.fna&oh=03_AdQL9n4l00sn1DT6zz3HaLSZszD-QiaPrDt8A9bY-WMPjg&oe=639FC8F6', NULL, '2022-11-19 04:03:39', '2022-12-07 15:45:34'),
(11, 'pate@gmail.com', 'pate', '$2b$10$IG.KASH3/c9erpe.DayLoe0Qd8MZLyBmKWkNMbnzMa4OFhD/qWZ9C', NULL, 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.15752-9/300496546_1360520704473232_4132157348638922110_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=ae9488&_nc_ohc=WvjdVsTqLn8AX-0x6fx&tn=Jsb-ydERwOFU8E_N&_nc_ht=scontent.fhan2-5.fna&oh=03_AdSazLAjj3ugPb3Knn3TLXbAsEp7b1-k4C7XP7jqT5v1Ww&oe=639FB761', NULL, '2022-11-19 04:05:20', '2022-12-07 15:45:34'),
(12, 'shin@gmail.com', 'shin', '$2b$10$IG.KASH3/c9erpe.DayLoe0Qd8MZLyBmKWkNMbnzMa4OFhD/qWZ9C', NULL, 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.15752-9/291092349_469802784483235_2319594929695058300_n.png?_nc_cat=104&ccb=1-7&_nc_sid=ae9488&_nc_ohc=vtObZ3-nO7AAX90WoiF&tn=Jsb-ydERwOFU8E_N&_nc_ht=scontent.fhan2-5.fna&oh=03_AdSsVGRAhkoPVLAG3jOwL0xEI_FaPtaKULhYHtpSCe2sbw&oe=639FD028', NULL, '2022-11-19 04:08:14', '2022-12-05 16:35:17'),
(13, 'aaaa', 'aaaa', 'aaaaa', NULL, 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.15752-9/291092349_469802784483235_2319594929695058300_n.png?_nc_cat=104&ccb=1-7&_nc_sid=ae9488&_nc_ohc=vtObZ3-nO7AAX90WoiF&tn=Jsb-ydERwOFU8E_N&_nc_ht=scontent.fhan2-5.fna&oh=03_AdSsVGRAhkoPVLAG3jOwL0xEI_FaPtaKULhYHtpSCe2sbw&oe=639FD028', NULL, '2022-12-03 15:38:49', '2022-12-07 15:45:34'),
(14, 'abab', 'ababab', '', NULL, 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.15752-9/291092349_469802784483235_2319594929695058300_n.png?_nc_cat=104&ccb=1-7&_nc_sid=ae9488&_nc_ohc=vtObZ3-nO7AAX90WoiF&tn=Jsb-ydERwOFU8E_N&_nc_ht=scontent.fhan2-5.fna&oh=03_AdSsVGRAhkoPVLAG3jOwL0xEI_FaPtaKULhYHtpSCe2sbw&oe=639FD028', NULL, '2022-12-03 15:39:28', '2022-12-07 15:45:34'),
(20, 'dat.roy.2003@gmail.com', 'a', '$2b$10$wkY7dFPuCtOExEfM3KQWB..SGEinW4tn8ApAia6VYDDbKukqTaFV2', 'male', 'https://lh3.googleusercontent.com/a/AEdFTp5E1n7_GV3WlP2aOzZVre62UC5DWgKEGPD_djLO=s96-c', NULL, '2022-12-09 21:49:48', '2022-12-11 15:28:48');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_channel`
--

CREATE TABLE `user_channel` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `channel_id` int UNSIGNED NOT NULL,
  `notifiable_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user_channel`
--

INSERT INTO `user_channel` (`id`, `user_id`, `channel_id`, `notifiable_id`) VALUES
(33, 5, 11, 40),
(34, 2, 11, 41),
(35, 2, 5, 42),
(36, 4, 5, 43),
(37, 7, 5, 44),
(39, 20, 13, 92),
(42, 20, 5, 101);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_room`
--

CREATE TABLE `user_room` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `room_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user_room`
--

INSERT INTO `user_room` (`id`, `user_id`, `room_id`) VALUES
(29, 2, 15),
(30, 2, 16),
(32, 2, 17),
(34, 2, 18),
(36, 2, 19),
(38, 2, 20),
(40, 2, 21),
(43, 2, 23),
(44, 2, 24),
(45, 2, 25),
(46, 2, 26),
(59, 2, 29),
(60, 2, 30),
(64, 2, 33),
(65, 2, 34),
(31, 4, 16),
(48, 4, 23),
(49, 4, 24),
(50, 4, 25),
(51, 4, 26),
(58, 4, 27),
(62, 4, 31),
(28, 5, 15),
(35, 7, 18),
(53, 7, 23),
(54, 7, 24),
(55, 7, 25),
(56, 7, 26),
(57, 7, 27),
(33, 8, 17),
(37, 10, 19),
(39, 11, 20),
(41, 12, 21),
(61, 13, 30),
(63, 20, 32),
(66, 20, 34);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `channels`
--
ALTER TABLE `channels`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `title` (`title`),
  ADD KEY `channels_users_foreign_key` (`admin_id`);

--
-- Chỉ mục cho bảng `channel_requests`
--
ALTER TABLE `channel_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_notifiable_unique_1` (`user_id`,`channel_id`) USING BTREE,
  ADD KEY `user_notifiable_ibfk_2` (`notifiable_id`),
  ADD KEY `channel_requests_ibfk_3` (`channel_id`);

--
-- Chỉ mục cho bảng `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_parent_message_id_foreign` (`parent_message_id`),
  ADD KEY `messages_sender_id_foreign` (`sender_id`);

--
-- Chỉ mục cho bảng `message_attachments`
--
ALTER TABLE `message_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_attachments_message_id_foreign` (`message_id`);

--
-- Chỉ mục cho bảng `message_recipients`
--
ALTER TABLE `message_recipients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_recipients_message_id_foreign` (`message_id`),
  ADD KEY `message_recipients_recipient_id_foreign` (`recipient_id`),
  ADD KEY `message_recipients_recipient_room_id_foreign` (`recipient_room_id`);

--
-- Chỉ mục cho bảng `notifiable`
--
ALTER TABLE `notifiable`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `notifications_unique_1` (`notifiable_id`,`type`);

--
-- Chỉ mục cho bảng `notification_receivers`
--
ALTER TABLE `notification_receivers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `notification_receivers_unique` (`notification_id`,`receiver_id`),
  ADD KEY `notification_receivers_ibfk_2` (`receiver_id`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `posts_author_id_foreign` (`author_id`);

--
-- Chỉ mục cho bảng `post_comments`
--
ALTER TABLE `post_comments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `post_comments_unique_1` (`notifiable_id`),
  ADD KEY `post_comments_ibfk_1` (`post_id`),
  ADD KEY `post_comments_ibfk_2` (`sender_id`),
  ADD KEY `post_comments_ibfk_3` (`parent_comment_id`);

--
-- Chỉ mục cho bảng `post_likes`
--
ALTER TABLE `post_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `post_likes_unique_1` (`user_id`,`post_id`),
  ADD KEY `post_likes_ibfk_1` (`post_id`);

--
-- Chỉ mục cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_channel_id_foreign` (`channel_id`);

--
-- Chỉ mục cho bảng `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tags_ibfk_1` (`post_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_username_unique` (`username`);

--
-- Chỉ mục cho bảng `user_channel`
--
ALTER TABLE `user_channel`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_channel_unique_1` (`notifiable_id`),
  ADD UNIQUE KEY `user_channel_unique_2` (`user_id`,`channel_id`),
  ADD KEY `user_channel_ibfk_1` (`user_id`),
  ADD KEY `user_channel_ibfk_2` (`channel_id`);

--
-- Chỉ mục cho bảng `user_room`
--
ALTER TABLE `user_room`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_room_unique_1` (`user_id`,`room_id`),
  ADD KEY `user_room_conversation_id_foreign` (`room_id`),
  ADD KEY `user_room_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `channels`
--
ALTER TABLE `channels`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `channel_requests`
--
ALTER TABLE `channel_requests`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=584;

--
-- AUTO_INCREMENT cho bảng `message_attachments`
--
ALTER TABLE `message_attachments`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `message_recipients`
--
ALTER TABLE `message_recipients`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1189;

--
-- AUTO_INCREMENT cho bảng `notifiable`
--
ALTER TABLE `notifiable`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT cho bảng `notification_receivers`
--
ALTER TABLE `notification_receivers`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `post_comments`
--
ALTER TABLE `post_comments`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT cho bảng `post_likes`
--
ALTER TABLE `post_likes`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT cho bảng `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT cho bảng `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `user_channel`
--
ALTER TABLE `user_channel`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT cho bảng `user_room`
--
ALTER TABLE `user_room`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `channels`
--
ALTER TABLE `channels`
  ADD CONSTRAINT `channels_users_foreign_key` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `channel_requests`
--
ALTER TABLE `channel_requests`
  ADD CONSTRAINT `channel_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `channel_requests_ibfk_2` FOREIGN KEY (`notifiable_id`) REFERENCES `notifiable` (`id`),
  ADD CONSTRAINT `channel_requests_ibfk_3` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`);

--
-- Các ràng buộc cho bảng `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_parent_message_id_foreign` FOREIGN KEY (`parent_message_id`) REFERENCES `messages` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `message_attachments`
--
ALTER TABLE `message_attachments`
  ADD CONSTRAINT `message_attachments_message_id_foreign` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `message_recipients`
--
ALTER TABLE `message_recipients`
  ADD CONSTRAINT `message_recipients_message_id_foreign` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `message_recipients_recipient_id_foreign` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `message_recipients_recipient_room_id_foreign` FOREIGN KEY (`recipient_room_id`) REFERENCES `user_room` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`notifiable_id`) REFERENCES `notifiable` (`id`);

--
-- Các ràng buộc cho bảng `notification_receivers`
--
ALTER TABLE `notification_receivers`
  ADD CONSTRAINT `notification_receivers_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`),
  ADD CONSTRAINT `notification_receivers_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `post_comments`
--
ALTER TABLE `post_comments`
  ADD CONSTRAINT `post_comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `post_comments_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `post_comments_ibfk_3` FOREIGN KEY (`parent_comment_id`) REFERENCES `post_comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `post_comments_ibfk_4` FOREIGN KEY (`notifiable_id`) REFERENCES `notifiable` (`id`);

--
-- Các ràng buộc cho bảng `post_likes`
--
ALTER TABLE `post_likes`
  ADD CONSTRAINT `post_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `post_likes_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);

--
-- Các ràng buộc cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `room_channel_id_foreign` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `tags`
--
ALTER TABLE `tags`
  ADD CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);

--
-- Các ràng buộc cho bảng `user_channel`
--
ALTER TABLE `user_channel`
  ADD CONSTRAINT `user_channel_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_channel_ibfk_2` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`),
  ADD CONSTRAINT `user_channel_ibfk_3` FOREIGN KEY (`notifiable_id`) REFERENCES `notifiable` (`id`);

--
-- Các ràng buộc cho bảng `user_room`
--
ALTER TABLE `user_room`
  ADD CONSTRAINT `user_room_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `user_room_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
