<?php
require_once("config.php");
$userid=$_GET["userid"];
$sql="select sum(goodsnum) total from shopcar where userid='$userid'";
$item=mysql_query($sql);
$result=mysql_fetch_array($item);
$count=Array();
$count["count"]=$result["total"];
echo json_encode($count);

?>