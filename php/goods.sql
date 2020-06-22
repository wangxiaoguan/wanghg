/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50540
Source Host           : localhost:3306
Source Database       : shopcar

Target Server Type    : MYSQL
Target Server Version : 50540
File Encoding         : 65001

Date: 2018-07-06 09:45:23
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `goods`
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `goodsid` int(11) NOT NULL AUTO_INCREMENT,
  `goodsname` varchar(255) DEFAULT NULL,
  `newprice` varchar(255) NOT NULL,
  `oldprice` varchar(255) NOT NULL,
  `goodsnum` varchar(255) NOT NULL,
  `goodsimg` varchar(255) NOT NULL,
  `goodsmsg` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`goodsid`)
) ENGINE=MyISAM DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of goodsinfo
-- ----------------------------
