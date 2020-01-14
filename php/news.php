<?php
require_once("config.php");

$sql = "select *  from  news";
$result = mysql_query($sql);//发送指令,返回数据
$list = array(); //作为集合用
while($item = mysql_fetch_array($result)){
    $temp = array();
    $temp["id"]= $item["id"];
    $temp["title"]= $item["title"];
    $temp["content"]= $item["content"];
    $list[] = $temp;
}
    echo json_encode($list);    
?>
