/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50540
Source Host           : localhost:3306
Source Database       : shopcar

Target Server Type    : MYSQL
Target Server Version : 50540
File Encoding         : 65001

Date: 2018-07-06 09:49:40
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `shop`
-- ----------------------------
DROP TABLE IF EXISTS `shop`;
CREATE TABLE `shop` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `goodsid` varchar(255) DEFAULT NULL,
  `goodsname` varchar(255) DEFAULT NULL,
  `newprice` varchar(255) DEFAULT NULL,
  `oldprice` varchar(255) DEFAULT NULL,
  `goodsnum` varchar(255) DEFAULT NULL,
  `goodsimg` varchar(255) DEFAULT NULL,
  `goodsmsg` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of shopcar
-- ----------------------------
