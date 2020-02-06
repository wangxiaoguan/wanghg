<?php
@header ("content-type:text/html;charset=utf8");

/*$arr=array(1,2,3);
var_dump($arr);
$a=gettype($arr);
echo $a;

$name=1234.5;
$b=is_int($name);
echo $b;*/


$arr=array();
$obj1=array();
$obj1["username"]="lili";
$obj1["userage"]="18";
$arr[]=$obj1;
$obj2=array();
$obj2["username"]="lulu";
$obj2["userage"]="19";
$arr[]=$obj2;
echo json_encode($arr);
// foreach($arr  as $key => $value){
//     echo $value["username"];
// }
?>