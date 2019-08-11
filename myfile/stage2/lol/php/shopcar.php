<?php
require_once("config.php");

$userid=$_GET["userid"];
$goodsid=$_GET["goodsid"];
$goodsname=$_GET["goodsname"];
$goodsprice=$_GET["goodsprice"];
$goodsimg=$_GET["goodsimg"];
$goodsnum=$_GET["goodsnum"];

$sql = "select count(*) from  shopcar where userid=$userid and goodsid=$goodsid";

$result = mysql_query($sql);

$item = mysql_fetch_array($result);

$strsql="";

if($item[0]>0){
    $strsql="update shopcar set goodsnum=goodsnum+1 where userid=$userid and goodsid=$goodsid";
}else{
    $strsql="insert into shopcar(userid,goodsid,goodsname,goodsprice,goodsnum,goodsimg) values($userid,$goodsid,'$goodsname',$goodsprice,$goodsnum,'$goodsimg')";
    
}
mysql_query($strsql);

$count=mysql_affected_rows();

$obj=Array();

if($count>0){
    $obj["code"]=1;
    $obj["msg"]="加入购物车成功";
}else{
    $obj["code"]=2;
    $obj["msg"]="加入购物车失败";
}
echo json_encode($obj);
   
?>