
import React,{Component} from "react";
import './home.scss'
import  {Button,Icon,Input,message}  from 'antd'
import $ from 'jquery'
import axios from 'axios'
const { TextArea } = Input;
export default class Home5 extends Component{
    constructor(props){
        super(props);
        this.state={
           txt:'',
           data:'',
        }
    }
    InputTxt=(e)=>{
        console.log(e.target.value)
        this.setState({txt:e.target.value})
    }
    //输入数据
    send=()=>{
        const {txt}=this.state
        if(!txt.length){
            message.warn('请填写数据')
            return;
        }
        let that=this
        $.ajax({
            type : "POST",  //提交方式
            url : "http://wanghg.top/php/writeData.php",//路径,www根目录下
            data : {
                "data" : txt
            },//数据，这里使用的是Json格式进行传输
            success : function(result) {//返回数据根据结果进行相应的处理
                message.success('数据成功写入TXT文档')
                console.log(result);
                that.setState({txt:''})
            }
        });
    }
    //删除数据
    delete=()=>{
        let me = this;
        axios.get('http://wanghg.top/php/deleteData.php')
        .then(function (res) {
            console.log(res)
            message.success('删除数据成功')
            me.setState({data:''})
        }).catch(function (error) {
            console.log(error);
            message.error('删除数据成功')
        });
    }
    //获取数据
    getData=()=>{
        let me=this
        axios.get('http://wanghg.top/php/getData.php')
        .then(function (res) {
            console.log(res)
            message.success('获取数据成功')
            me.setState({data:res.data})
        }).catch(function (error) {
            console.log(error);
            message.error('获取数据失败')
        });
    }
    render(){
        const { txt,data } = this.state
        return(
            <div id='home5'> 
                <TextArea value={txt} onChange={this.InputTxt} rows={10} /><br/>
                <Button type='ghost' onClick={this.send}>sendData</Button>　
                <Button type='primary' onClick={this.delete}>deleteData</Button>　
                <Button type='danger' onClick={this.getData}>getData</Button>
                <p><span>{data}</span></p>
                <p><a href="http://wanghg.top/data/data.zip" download="data">下载</a></p>
                    
                <div>
                    <h2>传送数据HTML文件</h2>
                <pre>{`
    var data={
        name:'wang',
        age:'15年',
        sex:'man'
    };
    $.ajax({
        type:"POST",
        url:"http://wanghg.top/php/writeData.php",
        data:{"data":data},
        success : function(result) {
            console.log(result);
        }
    });
`}</pre>
        <h2>写入数据PHP文件</h2>
<pre>{`
    <?php
        header("Content-type: text/html; charset=utf-8");
        header("Access-Control-Allow-Origin:*");

        $data = $_POST['data'];         //post请求传过来的数据
        $file = 'read.txt';             //如果文件不存在，自动创建一个

        file_put_contents;              //把字符串写入文件
        $content = "中华";
        if($f = file_put_contents($file, $content,FILE_APPEND)){
            echo "写入成功";
        }
        file_put_contents($file,'');    //清空文件内容 
        
        file_get_contents               //读取文件的内容
        if($data = file_get_contents($file)){; 
            echo $data;
        }
        echo json_encode($data,JSON_UNESCAPED_UNICODE);
    ?>
`}</pre>
                </div>
            </div>
    
        )
    }
}


