
import React,{Component} from "react";
import './array.scss'
export default class Array11 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='array3'>
<pre>{`
var mysql=require("mysql");
var content=mysql.createConnection({
    host:"localhost",
    post:3306,
    user:"root",
    password:"root",
    database:"1803"
});
content.connect((err)=>{
    if(err)throw err;
    console.log("连接数据库成功")
})
`}</pre>
<pre>{`
<?php
    @header("content-type:text/html;charset=utf8");
    @header("Access-Control-Allow-Origin:*");

    mysql_connect("localhost:3306","root","root");
    mysql_select_db("1803");

    mysql_query("set character set 'utf8'");

    $sql="select *from userinfo";
    $result=mysql_query("$sql");
    mysql_fetch_array($result);
    echo json_encode($list);    
?>
`}</pre>
<pre>{`
 Mysql数据库命令操作
 select *from userinfo                                   查找userinfo所有信息
 select userpwd from userinfo                            查找userinfo表中所有密码
 select userpwd from userinfo  where username='lili'     查找name为lili的密码
 select username  from  userinfo   where usersex='1'     查找sex为1的所有用户名字
 select userage from userinfo  where username="lili"     查找name为lili的年龄
 select *from userinfo  where id="1"                     查找id为1的所有信息
 select *from userinfo order by userage                  年龄排序
 select *from userinfo order by id desc                  倒序
 alter table userinfo add usertext  int4                 增加宇段
 alter table userinfo drop usertext                      删除宇段
 update userinfo  set age=30 where id=2                  数据库修改(更新)表中数据
 delete from userinfo where  id=5                        删除数据表中的di为5的一行数据
 insert into userinfo values(leilei,1234,...);           插入批量数据
`}</pre>
            </div>
        )
    }
}


