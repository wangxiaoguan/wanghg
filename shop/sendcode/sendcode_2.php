<?php
/**
 * 验证码通知短信接口
 */
require_once("config.php");
require_once("httpUtil.php");
require_once("../php/config.php");
/**
 * url中{function}/{operation}?部分
 */
$funAndOperate = "industrySMS/sendSMS";

// 参数详述请参考http://miaodiyun.com/https-xinxichaxun.html

// 生成body
$body = createBasicAuthData();
$phone=$_GET["phone"];
$telcode=$_GET["telcode"];
$time=30;

// 在基本认证参数的基础上添加短信内容和发送目标号码的参数



$sqlname="select count(*) from userinfo where usertell='$phone'";
$result=mysql_query($sqlname);
$count=mysql_fetch_array($result);

$obj=Array();

if($count["0"]>0){
    // $body['smsContent'] = "【宏观科技】您的验证码为{$code}，请于{$time}分钟内正确输入，如非本人操作，请忽略此短信。";
    // $body['to'] =$phone;

    
    $strsql="select * from userinfo where usertell='$phone'";
    $result2=mysql_query($strsql);
    $user=mysql_fetch_array($result2);

       
    if($user["telecode"]==$telcode){
        $obj["code"]=1;
        $obj["msg"]="登录成功";
        $obj["userid"]=$user["id"];
    }else{
        $obj["code"]=2;
        $obj["msg"]="短信验证码错误";
    }
}else{
    $obj["code"]=3;
    $obj["msg"]="用户不存在";
}

echo json_encode($obj);
// echo json_encode($item["telecode"]==$telecode);
// 提交请求
$result = post($funAndOperate, $body);
// echo("<br/>result:<br/><br/>");
// var_dump($result);