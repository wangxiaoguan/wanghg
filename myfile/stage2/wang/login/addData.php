<?php

@header("content-type:text/html;charset=utf8");
@header("Access-Control-Allow-Origin:*");

$connect = mysql_connect("localhost:3306","root","root");
mysql_select_db("1803");

$id=$_GET["id"];
$username=$_GET["username"];
$userpwd=$_GET["userpwd"];
$userage=$_GET["userage"];
$usersex=$_GET["usersex"];
$usertell=$_GET["usertell"];


$sql = "insert into userinfo  values('$id','$username','$userpwd','$userage','$usersex','$usertell');";

mysql_query($sql);
  
?>