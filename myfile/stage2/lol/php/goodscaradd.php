<?php
require_once("config.php");

$userid=$_GET["userid"];

$sql = "SELECT * from shopcar where userid=$userid";

$result = mysql_query($sql);//发送指令,返回数据

$list = array(); //作为集合用

while($item = mysql_fetch_array($result)){
    $temp = array();
    $temp["id"]= $item["id"];
    $temp["userid"]= $item["userid"];
    $temp["goodsid"]= $item["goodsid"];
    $temp["goodsname"]= $item["goodsname"];
    $temp["goodsprice"]= $item["goodsprice"];
    $temp["goodsnum"]= $item["goodsnum"];
    $temp["goodsimg"]= $item["goodsimg"];
    $list[] = $temp;
}
    echo json_encode($list);    
?>