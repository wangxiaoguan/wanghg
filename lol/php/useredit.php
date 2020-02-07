<?php
require_once("config.php");

$id=$_GET["id"];
$sql = "select * from userinfo where id=$id"; //从数据库中选取数据语句
$result = mysql_query($sql);//发送指令,返回数据
$list = array(); //作为集合用
while($item = mysql_fetch_array($result)){
    $temp = array();
    $temp["id"]= $item["id"];
    $temp["username"]= $item["username"];
    $temp["userpwd"]= $item["userpwd"];
    $temp["userage"]= $item["userage"];
    $temp["usersex"]= $item["usersex"];
    $temp["usertell"]= $item["usertell"];
    $list[] = $temp;
}
    echo json_encode($list);    
?>