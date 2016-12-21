/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : classroom

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2016-12-22 06:54:41
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for classes
-- ----------------------------
DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `teacher_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of classes
-- ----------------------------
INSERT INTO `classes` VALUES ('1', 'Javascript', '6');
INSERT INTO `classes` VALUES ('2', 'React', '6');
INSERT INTO `classes` VALUES ('3', 'PHP', null);

-- ----------------------------
-- Table structure for class_details
-- ----------------------------
DROP TABLE IF EXISTS `class_details`;
CREATE TABLE `class_details` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `class_id` int(10) unsigned DEFAULT NULL,
  `student_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of class_details
-- ----------------------------

-- ----------------------------
-- Table structure for content_blocks
-- ----------------------------
DROP TABLE IF EXISTS `content_blocks`;
CREATE TABLE `content_blocks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `content` text,
  `type` enum('lesson','test') DEFAULT 'lesson',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of content_blocks
-- ----------------------------
INSERT INTO `content_blocks` VALUES ('1', 'What is javascript', '<p>Javascript is a dynamic computer programming language. It is lightweight and\r\n    most commonly used as a part of web pages, whose implementations allow\r\n    client-side script to interact with the user and make dynamic pages. It is an\r\n    interpreted programming language with object-oriented capabilities.\r\n</p>\r\n<p>\r\n    JavaScript was first known as LiveScript, but Netscape changed its name to\r\n    JavaScript, possibly because of the excitement being generated by Java.\r\n    JavaScript made its first appearance in Netscape 2.0 in 1995 with the\r\n    name LiveScript. The general-purpose core of the language has been\r\n    embedded in Netscape, Internet Explorer, and other web browsers.\r\n    The ECMA-262 Specification defined a standard version of the core JavaScript</p>', 'lesson');
INSERT INTO `content_blocks` VALUES ('2', 'Client-side Javascript', '<p>Client-side JavaScript is the most common form of the language. The script\r\n    should be included in or referenced by an HTML document for the code to be\r\n    interpreted by the browser.</p>\r\n<p>\r\n    It means that a web page need not be a static HTML, but can include programs\r\n    that interact with the user, control the browser, and dynamically create HTML\r\n    content.\r\n</p>\r\n<p>\r\n    The JavaScript client-side mechanism provides many advantages over traditional\r\n    CGI server-side scripts. For example, you might use JavaScript to check if the\r\n    user has entered a valid e-mail address in a form field.\r\n</p>\r\n<p>\r\n    The JavaScript code is executed when the user submits the form, and only if all\r\n    the entries are valid, they would be submitted to the Web Server.\r\n</p>\r\n<p>\r\n    JavaScript can be used to trap user-initiated events such as button clicks, link\r\n    navigation, and other actions that the user initiates explicitly or implicitly.\r\n</p>', 'lesson');
INSERT INTO `content_blocks` VALUES ('3', 'Where is JavaScript Today?', '<p>\r\n    The ECMAScript Edition 5 standard will be the first update to be released in over\r\n    four years. JavaScript 2.0 conforms to Edition 5 of the ECMAScript standard, and\r\n    the difference between the two is extremely minor.</p>\r\n<p>\r\n    The specification for JavaScript 2.0 can be found on the following site:\r\n    http://www.ecmascript.org/</p>\r\n<p>\r\n    Today, Netscape\'s JavaScript and Microsoft\'s JScript conform to the ECMAScript\r\n    standard, although both the languages still support the features that are not a\r\n    part of the standard.</p>', 'lesson');
INSERT INTO `content_blocks` VALUES ('4', 'Sample quiz', '[\n    {\n        \"title\":\"When did the programming language C++ came out?\",\n        \"choices\":[\n            1997,\n            1995,\n            2000,\n            1998\n        ],\n        \"correctAnswer\":3\n    },\n    {\n        \"title\":\"When Node.js came out?\",\n        \"choices\":[\n            2010,\n            2011,\n            2009,\n            2006\n        ],\n        \"correctAnswer\":2\n    },\n    {\n        \"title\":\"What brand of laptop do I have?\",\n        \"choices\":[\n            \"HP\",\n            \"Acer\",\n            \"Dell\",\n            \"Lenovo\"\n        ],\n        \"correctAnswer\":0\n    },\n    {\n        \"title\":\"How old am I?\",\n        \"choices\":[\n            12,\n            20,\n            9,\n            16\n        ],\n        \"correctAnswer\":3\n    },\n    {\n        \"title\":\"How old is Google?\",\n        \"choices\":[\n            12,\n            20,\n            18,\n            16\n        ],\n        \"correctAnswer\":2\n    }\n]', 'test');

-- ----------------------------
-- Table structure for lessions
-- ----------------------------
DROP TABLE IF EXISTS `lessions`;
CREATE TABLE `lessions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of lessions
-- ----------------------------

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sessions
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `type` enum('teacher','student','admin') DEFAULT 'student',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'student1@mail.com', 'John Doe', 'e10adc3949ba59abbe56e057f20f883e', 'student');
INSERT INTO `users` VALUES ('2', 'student2@mail.com', 'Black Smith', 'e10adc3949ba59abbe56e057f20f883e', 'student');
INSERT INTO `users` VALUES ('3', 'student3@mail.com', 'Celine Dole', 'e10adc3949ba59abbe56e057f20f883e', 'student');
INSERT INTO `users` VALUES ('4', 'student4@mail.com', 'Mary Jane', 'e10adc3949ba59abbe56e057f20f883e', 'student');
INSERT INTO `users` VALUES ('5', 'student5@mail.com', 'Tom Baker', 'e10adc3949ba59abbe56e057f20f883e', 'student');
INSERT INTO `users` VALUES ('6', 'teacher@mail.com', 'Barrak Obama', 'e10adc3949ba59abbe56e057f20f883e', 'teacher');
