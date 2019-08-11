<?php
    header("content-type:text/html;charset=UTF-8"); 
    header("Access-Control-Allow-Origin:*");
    if (isset($_FILES['userfile'])) {
        $uploaddir = 'upload/';
        $filename = $uploaddir . basename($_FILES['userfile']['name']);
        $filename =iconv("UTF-8","gb2312",$filename);
        echo '<pre>';
        if (move_uploaded_file($_FILES['userfile']['tmp_name'], $filename)) {
            echo '上传文件成功';
        } else {
            echo '上传文件失败';
        }
    }
?>