<?php
// $obj = array();
// $obj['id'] = time();
// $obj['name'] = 'hello world!';
// echo json_encode($obj);

// $arr = array('a'=>1,'b'=>2,'c'=>3,'d'=>4,'e'=>5);
// echo json_encode($arr);


$obj = new stdClass();//这个变量是没有初始化而直接使用的会报错，需要将这个变量先实例化一个空类。
$obj->body = 'another post';
$obj->id = 21;
$obj->approved = true;
$obj->favorite_count = 1;
$obj->status = NULL;
echo json_encode($obj);

?>