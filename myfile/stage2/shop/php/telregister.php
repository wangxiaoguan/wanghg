<?php
require_once("config.php");

$phone=$_GET["phone"];
$code=$_GET["code"];
$userpwd=$_GET["userpwd"];

$sql="select telecode from userinfo where  usertell='$phone'";

$result=mysql_query($sql);

$item = mysql_fetch_array($result);

$existcode = $item[0];

$obj=Array();

if($code=$existcode){

    $strsql="update userinfo set userpwd='$userpwd' where usertell='$phone'";

    mysql_query($strsql);

    $count= mysql_affected_rows();

    if($count>0){
        $obj["code"]=1;
        $obj["msg"]="注册成功";
    }else{
        $obj["code"]=2;
        $obj["msg"]="注册失败";
    }

}else{
    $obj["code"]=2;
    $obj["msg"]="验证码不匹配";
}

echo json_encode($obj);













?>