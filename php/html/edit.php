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
 
$tmpData = strval(file_get_contents("php://input"));
$DataArray = json_decode($tmpData, true);

$id = $DataArray['id'];
$title = $DataArray['title'];
$type = $DataArray['type'];
$content = $DataArray['content'];
$time = date('Y-m-d H:i:s');

// $sql = "INSERT INTO html (id,title,content) VALUES ('6','想法','内容2020')";
// $sql = "INSERT INTO html (id,title,content) VALUES ('$id','$title','$content')";
// $sql="update users set username= '"."$username' where id = $id";
$sql = "UPDATE list SET title='"."$title',content='"."$content',type='"."$type',time='"."$time' WHERE id='$id'";

 
if ($conn->query($sql) === TRUE) {
    echo "修改成功";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
 
$conn->close();
?>