<?php
@header("content-type:text/html;charset=utf8");
@header("Access-Control-Allow-Origin:*");
$servername = "b-xafvg3p14neoej.bch.rds.gz.baidubce.com:3306";
$username = "b_xafvg3p14neoej";
$password = "Q7hTI07YYEt8loSu";
$dbname = "b_xafvg3p14neoej";
// $data = $_POST['data']; 
// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);
// 检测连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
} 
// $arr = $_POST["ids"];
$id=$_GET["id"];
$sql = "DELETE FROM list WHERE id='$id'";
// $str = implode("','",$arr);//拼接字符，
// $sql = "DELETE FROM html where id in('{$str}')";
// $sql = "DELETE FROM html WHERE id IN('{$str}')";
// foreach($arr as $v)
// {
//    $sql = "DELETE FROM html WHERE id='{$v}'";
//    $db->query($sql);
// }
if ($conn->query($sql) === TRUE) {
    echo "删除数据成功";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
 
$conn->close();
?>