<?php
require_once("config.php");

$id=$_GET["id"];
$username=$_GET["username"];
$userpwd=$_GET["userpwd"];
$userage=$_GET["userage"];
$usersex=$_GET["usersex"];
$usertell=$_GET["usertell"];

$sql = "insert into userinfo  values('$id','$username','$userpwd','$userage','$usersex','$usertell');";

mysql_query($sql);
  
?>