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
$state=$_GET["state"];
$id=$_GET["id"];
// $sql = "DELETE FROM list WHERE id='$id'";
$sql = "UPDATE list SET state = '$state' WHERE id = '$id'";
if ($conn->query($sql) === TRUE) {
    echo "数据修改成功";
    echo $id;
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
 
$conn->close();
?>