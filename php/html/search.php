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
$title=$_GET["title"];
$type=$_GET["type"];
// $startTime=$_POST["startTime"];
// $endTime=$_POST["endTime"];
$sql = "SELECT * FROM list WHERE  title like '%".$title."%' and type like '%".$type."%'"; //从数据库中选取数据语句
// $sql = "SELECT * FROM list WHERE time >= '$startTime' AND time < '$endTime'"; //从数据库中选取数据语句
// $sql = "SELECT * FROM list WHERE time between '$startTime' and '$endTime'"; //从数据库中选取数据语句
$conn->query("set names utf-8");
$result = $conn->query($sql);

$list = array(); //作为集合用
if ($result->num_rows > 0) {
    // 输出每行数据
    while($item = $result->fetch_assoc()){
        $temp = array();
        $temp["id"]= $item["id"];
        $temp["title"]= $item["title"];
        $temp["type"]= $item["type"];
        $temp["content"]= $item["content"];
        $temp["time"]= $item["time"];
        $list[] = $temp;
    }
        echo json_encode($list);  
} else {
    echo json_encode($list);
}
// if ($conn->query($sql) === TRUE) {
//     $result = query($sql);//发送指令,返回数据
//     $list = array(); //作为集合用
//     while($item = mysql_fetch_array($result)){
//         $temp = array();
//         $temp["id"]= $item["id"];
//         $temp["title"]= $item["title"];
//         $temp["content"]= $item["content"];
//         $list[] = $temp;
//     }
//     echo json_encode($list); 
//     echo "新记录插入成功";

// } else {
//     echo "Error: " . $sql . "<br>" . $conn->error;
// }
 
$conn->close();
   
?>