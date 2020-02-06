<?php
@header("content-type:text/html;charset=utf8");
@header("Access-Control-Allow-Origin:*");
mysql_content("localhost:3306","root","root");
mysql_select_db("1803");
mysql_query("$sql");
mysql_fetch_array($result);
?>