<?php
//编码的设置
@header("content-type:text/html;charset=utf8");
@header("Access-Control-Allow-Origin:*");
$connect = mysql_connect("localhost:3306","root","root"); //链接到mysql数据库
mysql_select_db("1803");
$id=$_GET["id"];
$sql = "delete from userinfo where id='$id'"; 
mysql_query($sql)
  
?>
