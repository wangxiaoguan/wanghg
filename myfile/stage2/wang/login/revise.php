<?php
//编码的设置
@header("content-type:text/html;charset=utf8");
@header("Access-Control-Allow-Origin:*");

$connect = mysql_connect("localhost:3306","root","root"); //链接到mysql数据库
mysql_select_db("1803");
$id=$_GET["id"];
$username=$_GET["username"];
$userpwd=$_GET["userpwd"];
$userage=$_GET["userage"];
$usersex=$_GET["usersex"];
$usertell=$_GET["usertell"];

$sql = "update userinfo  set username='$username',userpwd='$userpwd',userage='$userage',usersex='$usersex',usertell='$usertell'   where id='$id'"; 

$result = mysql_query($sql);
mysql_query("set character set 'utf8'");
  
?>
