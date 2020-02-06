<?php
    header("content-type:text/html;charset=UTF-8"); 
    header("Access-Control-Allow-Origin:*");
    $file  = 'data.txt';//要写入文件的文件名（可以是任意文件名），如果文件不存在，将会创建一个
    file_put_contents($file,'');// 这个函数支持版本(PHP 5) 
    $result = file_get_contents($file);// 这个函数支持版本(PHP 4 >= 4.3.0, PHP 5) 
    // echo json_encode($data,JSON_UNESCAPED_UNICODE);
    if($result==''){
        echo "清空文件成功!";
    }else{
        echo "清空文件失败!";
    }

?>