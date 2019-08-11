<?php
require_once("config.php");

$usertell=$_GET["phone"];
$username=$_GET["username"];
$userage=$_GET["userage"];
$usersex=$_GET["usersex"];


$sql = "update userinfo  set username='$username',userage=$userage,usersex=$usersex   where usertell='$usertell'"; 

$result = mysql_query($sql);

$id="select id from userinfo where usertell=$usertell";
$item = mysql_query($id);

$userid = mysql_fetch_array($item);
$count=mysql_affected_rows();

$obj=Array();
if($count>0){
    $obj["code"]=1;
    $obj["msg"]="添加成功";
    $obj["id"]=$userid[0];
}else{
    $obj["code"]=2;
    $obj["msg"]="添加失败";
}


echo  json_encode($obj);
  
?>