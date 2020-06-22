<?php
/*
* 调用示例
* 本演示仅供参考
*/
	include_once("TieTuKu.class.php");
	
	$sdk=new TTKClient('你的accesskey','你的secretkey');
	
	$filename='file';//你的图片控件的name 
	//单图片上传
	$result=$sdk->uploadFile('你的相册ID',$_FILES[$filename]['tmp_name'],$_FILES[$filename]['name']);
	var_dump($result);
	
	//多图片上传
	//$result=$sdk->curlUpFile('你的相册ID',$filename);
	//var_dump($result);
	
	//网络图片上传
	//$fileurl='https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_ca79a146.png';
	//$result=$sdk->uploadFromWeb('你的相册ID',$fileurl);
	//var_dump($result);
?>