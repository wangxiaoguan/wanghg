<?php
@header("content-type:text/html;charset=utf8");
$name="每天10分钟\n给梦想\t一个机会";
echo $name;
echo "<br/>";

$name1='每天10分钟\n给梦想\t一个机会';
echo $name1;
echo "<br/>";


$name2="每天10分钟\"给梦想一个机会";
echo $name2;
echo "<br/>";

$name3='每天10分钟\'给梦想一个机会';
echo $name3;
echo "<br/>";

//变量中插入变量
$string="10分钟";
$name4="每天'$string'给梦想一个机会";
echo $name4;
echo "<br/>";

//字符串拼接(.)点
$a="我";
$b="正在";
$c="学习";
$d="PHP";
echo $a.$b.$c.$d;
echo "<br>";
echo $a."正在学习PHP";


//常量
define("我正在学习","php");
echo "我正在学习".'php';






?>