
import React,{Component} from "react";
import './home.scss'
export default class Home6 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='home6'> 
<pre>{`
    enctype 属性规定在发送到服务器之前应该如何对表单数据进行编码
    MAX_FILE_SIZE限制文件上传的大小，单位:字节

    <form enctype="multipart/form-data" action="upload.php" name="form" method="post">
        <input type="hidden" name="MAX_FILE_SIZE" value="30000"/>
        <input type="file" name="userfile"/>
        <input type="submit" name="button" value="提交"/>
    </form>
`}</pre>        
<pre>{`
    <?php
        header("content-type:text/html;charset=UTF-8"); //编码转换
        header("Access-Control-Allow-Origin:*");        //允许跨域
        if (isset($_FILES['userfile'])) {
            $uploaddir = 'upload/';                     //文件存放路径
            $filename = $uploaddir.basename($_FILES['userfile']['name']);
            $filename = iconv("UTF-8","gb2312",$filename);//防止文件中文名编码或乱码
            if(move_uploaded_file($_FILES['userfile']['tmp_name'],$filename)) {
                echo '上传文件成功'.'<br>';
            }else {
                echo '上传文件失败'.'<br>';
            }
        }
    ?>
`}</pre>
            </div>
    
        )
    }
}


