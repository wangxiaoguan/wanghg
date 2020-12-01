<?php
require_once("config.php");


 $username=$_GET["username"];
 $userpwd=$_GET["userpwd"];

$sql="select * from userinfo where  username='$username'";

$result = mysql_query($sql);
$obj=Array();

$item = mysql_fetch_array($result);
if($item){
   $obj["code"]=1;
   $obj["msg"]="该用户已存在";
}else{
   
$sql2="insert into userinfo(username,userpwd) values('$username','$userpwd')";

mysql_query($sql2);

$count=mysql_affected_rows();
if($count>0){
    $obj["code"]=2;
    $obj["msg"]="注册成功";
}else{
    $obj["code"]=1;
    $obj["msg"]="该用户已存在";
}
}

echo  json_encode($obj);
?>