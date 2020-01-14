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
// $sql = "INSERT INTO list (id,title,type,content,time) VALUES ('$id','$title','$type','$content','$time')";
$sql = "INSERT INTO list (id,title,type,content,time) VALUES ('$id','$title','$type','$content',NOW())";

$data = array();
if ($conn->query($sql) === TRUE) {
    $data['code'] = 1;
    $data['msg'] = '数据新增成功';
    echo json_encode($data);
} else {
    $data['code'] = 2;
    $data['msg'] = "原因：".$conn->error;
    // echo "Error: " . $sql . "<br>" . $conn->error;
    echo json_encode($data);
}
 
$conn->close();
?>