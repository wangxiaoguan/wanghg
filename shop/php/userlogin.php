<?php
require_once("config.php");

$username=$_GET["phone"];

$pwd=$_GET["userpwd"];

$sql="select userpwd,id from userinfo where username='${username}' or usertell = '$username'";

$result = mysql_query($sql);
$item=mysql_fetch_array($result);
$userpwd=$item["userpwd"];
$obj=array();
if($userpwd){
    if($pwd==$userpwd){
        $obj["code"]=1;
        $obj["msg"]="登录成功";
        $obj["userid"]=$item["id"];
    
    }else{
        $obj["code"]=2;
        $obj["msg"]="用户名与密码不匹配";
    }
}else{
    $obj["code"]=3;
    $obj["msg"]="该用户名不存在";
}

echo json_encode($obj);










// $list = array(); //作为集合用
// while($item = mysql_fetch_array($result)){
// //    echo $item;
//     $temp = array();//作为对象用
//     $temp["id"]= $item[0];
//     $temp["username"]= $item[1];
//     $temp["userpwd"]= $item[2];
//     $temp["userage"]= $item[3];
//     $temp["usersex"]= $item[4];
//     $list[] = $temp;
// }
// // [{id:1,username:leson},{},{}]
// echo json_encode($list); 

?>