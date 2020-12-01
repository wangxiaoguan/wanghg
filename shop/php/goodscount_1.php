<?php
require_once("config.php");
$userid=$_GET["userid"];
$sql="select count(*) from shopcar where userid='$userid'";
$item=mysql_query($sql);
$result=mysql_fetch_array($item);
$count=Array();
$count["count"]=$result[0];
echo json_encode($count);

?>