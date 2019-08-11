<?php
//编码的设置
@header("content-type:text/html;charset=utf8");
@header("Access-Control-Allow-Origin:*");
mysql_connect("localhost:3306","root","root"); //链接到mysql数据库
mysql_select_db("1803");//选择指定的数据库
$sql = "select * from userinfo"; //从数据库中选取数据语句
$result = mysql_query($sql);//发送指令,返回数据
$list = array(); //作为集合用
while($item = mysql_fetch_array($result)){//如果将资源里面的内容进行解析
//    echo $item;
    $temp = array();//作为对象用
    $temp["id"]= $item[0];
    $temp["username"]= $item[1];
    $temp["userpwd"]= $item[2];
    $temp["userage"]= $item[3];
    $temp["usersex"]= $item[4];
    $temp["usertell"]= $item[5];
    $list[] = $temp;
}
// [{id:1,username:leson},{},{}]
echo json_encode($list);    
?>
