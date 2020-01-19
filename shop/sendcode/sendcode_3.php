<?php
require_once("config.php");
require_once("httpUtil.php");
require_once("../php/config.php");

$funAndOperate = "industrySMS/sendSMS";
$body = createBasicAuthData();
$phone=$_GET["phone"];
$userpwd=$_GET["userpwd"];



$sql="select count(*) from userinfo where usertell=$phone";
$result=mysql_query($sql);
$item=mysql_fetch_array($result);


$obj=Array();
if($item["0"]==0){
    $strsql="insert into userinfo(usertell,userpwd)  values('$phone','$userpwd')";
    mysql_query($strsql);

    $obj["code"]=1;
    $obj["msg"]="注册成功";    
}else{
    $obj["code"]=2;
    $obj["msg"]="用户已存在";
}

echo json_encode($obj);
$result = post($funAndOperate, $body);
