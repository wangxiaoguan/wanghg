<?php
@header("content-type:text/html;charset=utf8");
@header("Access-Control-Allow-Origin:*");


$connect = mysql_connect("localhost:3306","root","root"); //链接到mysql数据库

mysql_select_db("1803");


 $username=$_GET["username"];
 $userpwd=$_GET["userpwd"];

$sql="select * from userinfo where  username='$username'";

$result = mysql_query($sql);
$obj=array();

$item = mysql_fetch_array($result);
if($item){
   $obj["code"]=1;
   $obj["msg"]="该用户已存在";
}else{
   
$sql="insert into userinfo(username,userpwd) values('$username','$userpwd')";

mysql_query($sql);

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