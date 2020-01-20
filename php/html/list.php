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

$sql = "SELECT id, title, type, content, time, state FROM list"; //从数据库中选取数据语句
$conn->query("set names utf-8");
$result = $conn->query($sql);

$list = array(); //作为集合用
if ($result->num_rows > 0) {
    // 输出每行数据
    while($item = $result->fetch_assoc()){
        $temp = array();
        $temp["id"]= $item["id"];
        $temp["title"]= $item["title"];
        $temp["content"]= $item["content"];
        $temp["type"]= $item["type"];
        $temp["time"]= $item["time"];
        $temp["state"]= $item["state"];
        $list[] = $temp;
    }
        echo json_encode($list);  
    // while($row = $result->fetch_assoc()) {
    //     echo "<br> id: ". $row["id"]. " - Name: ". $row["title"]. " " . $row["content"];
    // }
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