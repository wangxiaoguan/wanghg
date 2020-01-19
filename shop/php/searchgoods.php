<?php
require_once("config.php");

$goodsid=$_GET["goodsid"];


$sql = "select * from  goodsinfo where  goodsid='$goodsid'";

$result = mysql_query($sql);

$item = mysql_fetch_array($result);

$temp=Array();

    $temp["goodsid"]= $item["goodsid"];
    $temp["goodsname"]=$item["goodsname"];
    $temp["newprice"]= $item["newprice"];
    $temp["oldprice"]= $item["oldprice"];
    $temp["goodsnum"]= $item["goodsnum"];
    $temp["goodsimg"]= $item["goodsimg"];
    $temp["goodsmsg"]= $item["goodsmsg"];
    echo json_encode($temp);

   
?>