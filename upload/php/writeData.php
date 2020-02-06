<?php
    header("content-type:text/html;charset=UTF-8"); 
    header("Access-Control-Allow-Origin:*");
    $data = $_POST['data'];   
    // echo json_encode($data);
    $file  = 'data.txt';//要写入文件的文件名（可以是任意文件名），如果文件不存在，将会创建一个
    $content = $data ;
    file_put_contents($file, $content,FILE_APPEND);// 这个函数支持版本(PHP 5) 
    $result = file_get_contents($file);// 这个函数支持版本(PHP 4 >= 4.3.0, PHP 5) 
    // echo json_encode($data,JSON_UNESCAPED_UNICODE);
    echo $result;

?>