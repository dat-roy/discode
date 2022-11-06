-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 06, 2022 at 09:18 AM
-- Server version: 10.4.24-MariaDB
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

-- --------------------------------------------------------

--
-- Table structure for table `channels`
--

CREATE TABLE `channels` (
  `id` int(10) UNSIGNED NOT NULL,
  `admin_id` int(8) UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `channels`
--

INSERT INTO `channels` (`id`, `admin_id`, `title`, `description`, `avatar_url`, `created_at`) VALUES
(2, 2, 'React Channel', 'Let\'s join with us!', NULL, '2022-11-06 01:56:28'),
(3, 4, 'React Channel', 'Let\'s join with us!', NULL, '2022-11-06 01:56:38'),
(4, 2, 'React group ', NULL, NULL, '2022-11-06 08:10:14');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(10) UNSIGNED NOT NULL,
  `sender_id` int(10) UNSIGNED NOT NULL,
  `content` varchar(255) NOT NULL,
  `message_type` enum('text','image','video','audio') NOT NULL,
  `parent_message_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `message_attachments`
--

CREATE TABLE `message_attachments` (
  `id` int(10) UNSIGNED NOT NULL,
  `message_id` int(10) UNSIGNED NOT NULL,
  `attachment_content` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `message_recipients`
--

CREATE TABLE `message_recipients` (
  `id` int(10) UNSIGNED NOT NULL,
  `recipient_id` int(10) UNSIGNED NOT NULL,
  `recipient_room_id` int(10) UNSIGNED DEFAULT NULL,
  `message_id` int(10) UNSIGNED NOT NULL,
  `is_read` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(10) UNSIGNED NOT NULL,
  `author_id` int(10) UNSIGNED NOT NULL,
  `content` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `last_updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `post_comments`
--

CREATE TABLE `post_comments` (
  `id` int(10) UNSIGNED NOT NULL,
  `post_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `content` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `id` int(10) UNSIGNED NOT NULL,
  `channel_id` int(10) UNSIGNED DEFAULT NULL,
  `type` enum('single','group') NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `removable` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`id`, `channel_id`, `type`, `title`, `created_at`, `removable`) VALUES
(1, NULL, 'single', NULL, '2022-11-05 20:52:57', 1),
(2, 4, 'group', 'room 1', '2022-11-06 08:10:45', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `birthday` date DEFAULT NULL,
  `password` char(64) NOT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `joined_date` datetime NOT NULL,
  `nation` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `birthday`, `password`, `gender`, `avatar_url`, `joined_date`, `nation`) VALUES
(2, 'lvdat.roy@gmail.com', 'lvdat', NULL, '$2b$10$C3HqjsVkxY3D5hq6Gqh6TeO8yhkeMd/yOi4wo7Z68s/fBg6oywiG2', 'other', 'https://lh3.googleusercontent.com/a/ALm5wu0Xth15183xVSO5P4a5sFKF613ZG088jW2KL2hE=s96-c', '0000-00-00 00:00:00', NULL),
(4, 'dat.roy.2003@gmail.com', 'aaa', NULL, '$2b$10$fNK.tEsPwzfNHl44OEXSF.Vsu5at3mRZmb0fVL5RspjCtSSCezzSG', 'other', 'https://lh3.googleusercontent.com/a/ALm5wu3cKEstY_5YSSQTHEfunU7ojzrWGV9uI7_ceZsn=s96-c', '2022-11-05 17:51:30', NULL),
(5, 'a4k29.hh4@gmail.com', 'a4', NULL, '$2b$10$Gb8Eb6nH7sX8eVxtX8IeVOc1yBkl2KO3gKsr4k90BO1ZmlQGoMgzS', 'other', 'https://lh3.googleusercontent.com/a/ALm5wu26jPBJf1GAYUU3k2X1caWzx1qBIQRS0Ukmr3xm=s96-c', '2022-11-05 18:19:58', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_channel`
--

CREATE TABLE `user_channel` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(8) UNSIGNED NOT NULL,
  `channel_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_room`
--

CREATE TABLE `user_room` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `room_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_room`
--

INSERT INTO `user_room` (`id`, `user_id`, `room_id`) VALUES
(1, 5, 1),
(2, 5, 2),
(3, 2, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `channels`
--
ALTER TABLE `channels`
  ADD PRIMARY KEY (`id`),
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
  ADD KEY `post_comments_post_id_foreign` (`post_id`),
  ADD KEY `post_comments_user_id_foreign` (`user_id`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_channel_id_foreign` (`channel_id`);

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
  ADD KEY `user_channel_ibfk_1` (`user_id`),
  ADD KEY `user_channel_ibfk_2` (`channel_id`);

--
-- Indexes for table `user_room`
--
ALTER TABLE `user_room`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_room_conversation_id_foreign` (`room_id`),
  ADD KEY `user_room_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `channels`
--
ALTER TABLE `channels`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message_attachments`
--
ALTER TABLE `message_attachments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message_recipients`
--
ALTER TABLE `message_recipients`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `post_comments`
--
ALTER TABLE `post_comments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_room`
--
ALTER TABLE `user_room`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD CONSTRAINT `post_comments_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `post_comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `room_channel_id_foreign` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `user_channel`
--
ALTER TABLE `user_channel`
  ADD CONSTRAINT `user_channel_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_channel_ibfk_2` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`);

--
-- Constraints for table `user_room`
--
ALTER TABLE `user_room`
  ADD CONSTRAINT `user_room_conversation_id_foreign` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `user_room_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
