<?php
require_once("config.php");

$id=$_GET["id"];
$sql = "delete from userinfo where id=$id";

$result = mysql_query($sql);//发送指令,返回数据

$count=mysql_affected_rows();

$obj = array(); //作为集合用

if($count>0){
    $obj["code"]=1;
    $obj["msg"]="删除成功";
}else{
    $obj["code"]=2;
    $obj["msg"]="删除失败";
}
    echo json_encode($obj);    
?>
  
?>
