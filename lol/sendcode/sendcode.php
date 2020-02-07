<?php
/**
 * 验证码通知短信接口
 */
require_once("config.php");
require_once("httpUtil.php");
// require_once("../php/config.php");
/**
 * url中{function}/{operation}?部分
 */
$funAndOperate = "industrySMS/sendSMS";

// 参数详述请参考http://miaodiyun.com/https-xinxichaxun.html

// 生成body
$body = createBasicAuthData();
$phone=$_GET["phone"];
$time=30;
$code=rand(0000,9999);
// 在基本认证参数的基础上添加短信内容和发送目标号码的参数
$body['smsContent'] = "【宏观科技】您的验证码为{$code}，请于{$time}分钟内正确输入，如非本人操作，请忽略此短信。";
$body['to'] =$phone;


$sql="select count(*) from userinfo where usertell=$phone";
$result=mysql_query($sql);
$item=mysql_fetch_array($result);

$strsql="";


if($item[0]>0){
   $strsql="update userinfo set telecode=$code where usertell=$phone";
}else{
   $strsql="insert into userinfo(usertell,telecode)  values('$phone','$code')";
}
mysql_query($strsql);
$count = mysql_affected_rows();


$obj=Array();
if($count>0){
    $obj["code"]=1;
    $obj["msg"]="发送成功";
}else{
    $obj["code"]=2;
    $obj["msg"]="发送失败";
}
echo json_encode($obj);

// 提交请求
$result = post($funAndOperate, $body);
// echo("<br/>result:<br/><br/>");
// var_dump($result);