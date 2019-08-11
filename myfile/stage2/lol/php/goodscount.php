<?php
require_once("config.php");
$key=$_GET["key"];
$sql="select count(*) from goodsinfo where goodsname like '%$key%'";
$item=mysql_query($sql);
$result=mysql_fetch_array($item);
$count=Array();
$count["count"]=$result[0];
echo json_encode($count);

?>