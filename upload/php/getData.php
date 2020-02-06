<?php
    header("content-type:text/html;charset=UTF-8"); 
    header("Access-Control-Allow-Origin:*");
    $file  = 'data.txt';//要写入文件的文件名（可以是任意文件名），如果文件不存在，将会创建一个
    $result = file_get_contents($file);// 这个函数支持版本(PHP 4 >= 4.3.0, PHP 5) 
    echo $result;
?>