<?php
@header("Access-Control-Allow-Origin:*");
@header("content-type:text/html;charset=utf8");
//cros解决跨域
//链接数据库 需要 地址  用户名  密码
$connect = mysql_connect("localhost:3308","root","root");
mysql_select_db("dalei_1803");
//到数据库里面找到具体的数据库
$username = $_GET["username"];
$userpwd = $_GET["pwd"];
$sql  = "select  userpwd from  userinfo where username = '$username'";
$result = mysql_query($sql); //执行sql语句
$item = mysql_fetch_array($result); //一个对象
$pwd = $item["userpwd"];
$obj = array();
if($pwd){
    if($pwd == $userpwd){
        // echo "登陆成功";
        $obj["code"]= 1;
        $obj["msg"]= "登陆成功";
    }else {
    
        $obj["code"]= 2;
        $obj["msg"]= "用户名和密码不匹配";
    }
}else{     
    $obj["code"]= 2;
    $obj["msg"]= "该用户名不能存在";
}
echo  json_encode($obj);

?>