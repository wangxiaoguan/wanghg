<?php
require_once("config.php");

$key=$_GET["key"];
$order=$_GET["order"];
$desc=$_GET["desc"];
$pagenum=$_GET["pagenum"];
$datanum=$_GET["datanum"];
$allpagenum=$pagenum*$datanum;


$sql = "select *  from  userinfo where username like '%$key%'  order by $order $desc limit $allpagenum,$datanum ";
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
