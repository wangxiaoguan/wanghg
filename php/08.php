<?php
@header("content-type:text/html;charset=utf8");
$num=null;
var_dump($num);
var_dump($num1);//Notice: Undefined variable: num1 in D:\WWW\1803\null.php on line 5
echo "<br>";

$a="学习php";
unset($a);//unset()销毁一个变量
var_dump($a);//Notice: Undefined variable: num1 in D:\WWW\1803\null.php on line 5
echo "<br>";

$b=null;//$b=false;
//empty()括号里面为null或false时;返回为true;
if (empty($b)) {
    echo "真的";
} else {
    echo "假的";
}
echo "<br>";


$num1=0;
$num2=false;
$num3=10;
$num4=null;
var_dump(isset($num1,$num2,$num3,$num4));//bool(false) 
var_dump(isset($num1,$num3));//bool(true) 
echo "<br>";






?>