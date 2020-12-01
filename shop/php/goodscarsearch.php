<?php
require_once("config.php");

// $key=$_GET["key"];
$order=$_GET["order"];
$desc=$_GET["desc"];
$pagenum=$_GET["pagenum"];
$datanum=$_GET["datanum"];
$userid=$_GET["userid"];
$allpagenum=$pagenum*$datanum;


$sql="select  * from shopcar where userid=$userid order by $order $desc limit $allpagenum,$datanum";
$result = mysql_query($sql);
// select goodsname like '%a8%'  from  shopcar  where userid=96
//$sql = "select * from userinfo where username like '%$key%' order by $order $desc"; //从数据库中选取数据语句
// $list = "select $userid  from $sql ";
// where goodsname like '%$key%'  order by $order $desc limit $allpagenum,$datanum ";

$list = array(); //作为集合用
while($item = mysql_fetch_array($result)){
    $temp = array();
    $temp["id"]= $item["id"];
    $temp["userid"]= $item["userid"];
    $temp["goodsid"]= $item["goodsid"];
    $temp["goodsname"]= $item["goodsname"];
    $temp["newprice"]= $item["newprice"];
    $temp["goodsnum"]= $item["goodsnum"];
    $temp["goodsimg"]= $item["goodsimg"];
    $list[] = $temp;
}
    echo json_encode($list);    
?>
