<?php
require_once("config.php");

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
