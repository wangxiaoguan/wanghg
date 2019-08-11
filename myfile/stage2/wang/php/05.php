<?php
//编码的设置
@header("content-type:text/html;charset=utf8");
@header("Access-Control-Allow-Origin:*");

// 需要从php 链接到 mysql指定的数据库中
// 数据库在哪里?  以什么样的方式进入(地址  用户  密码)
// 选择数据库(1801)

// 准备要执行的mysql语句(该语句现在mysql里面跑一遍不报错才能使用)

// 执行该语句 获取结果

//最后将结果进行输出
$connect = mysql_connect("localhost:3306","root","root"); //链接到mysql数据库
//mysql_selectDB("1803"); //选择指定的数据库
mysql_select_db("1803");
//select语句用于从数据库中选取数据。
$sql = "select * from userinfo"; //准备查询语句
//mysql_query($sql)发送一条 MySQL 查询。
$result = mysql_query($sql);//执行该语句;  该结果是一种资源 
//?如果将资源里面的内容进行解析
$list = array(); //作为集合用
while($item = mysql_fetch_array($result)){
//    echo $item;
    $temp = array();//作为对象用
    $temp["id"]= $item[0];
    $temp["username"]= $item[1];
    $temp["userpwd"]= $item[2];
    $temp["userage"]= $item[3];
    $temp["usersex"]= $item[4];
    $list[] = $temp;
}
// [{id:1,username:leson},{},{}]
echo json_encode($list);    
?>
