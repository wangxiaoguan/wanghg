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

$user = $DataArray['user'];
$password = $DataArray['password'];


$sql="SELECT userpwd FROM userinfo WHERE username='$user' OR usertell = '$user'";
$result = $conn->query($sql);
$list=array();
if ($result->num_rows > 0) {
    
    while($item = $result->fetch_assoc()){
        $temp = array();
        if($password==$item["userpwd"]){
            $list["code"]=1;
            $list["msg"]="登录成功";
        }else{
            $list["code"]=2;
            $list["msg"]="密码错误";
        }

    }
    echo json_encode($list);  

} else {
    $list["code"]=3;
    $list["msg"]="用户不存在";
    echo json_encode($list);
}

$conn->close();

?>