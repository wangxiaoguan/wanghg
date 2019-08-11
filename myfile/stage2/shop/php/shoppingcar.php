<?php
require_once("config.php");

$key=$_GET["key"];
$order=$_GET["order"];
$desc=$_GET["desc"];
$pagenum=$_GET["pagenum"];
$datanum=$_GET["datanum"];
$allpagenum=$pagenum*$datanum;

//$sql = "select * from userinfo where username like '%$key%' order by $order $desc"; //从数据库中选取数据语句
$sql = "select *  from  goodsinfo where goodsname like '%$key%'  order by $order $desc limit $allpagenum,$datanum ";
$result = mysql_query($sql);//发送指令,返回数据
$list = array(); //作为集合用
while($item = mysql_fetch_array($result)){
    $temp = array();
    $temp["goodsid"]= $item["goodsid"];
    $temp["goodsname"]= $item["goodsname"];
    $temp["goodsprice"]= $item["goodsprice"];
    $temp["goodsnum"]= $item["goodsnum"];
    $temp["goodsimg"]= $item["goodsimg"];
    $list[] = $temp;
}
    echo json_encode($list);    
?>
