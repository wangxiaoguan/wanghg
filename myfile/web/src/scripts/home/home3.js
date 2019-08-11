
import React,{Component} from "react";
import './home.scss'
export default class Home3 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='home3'> 
<pre>{`
const path = require('path')
const path1 = path.join('fs.js')                //fs.js 一般路径
const path2 = path.resolve('fs.js')             //D:\wang\stage3\day02\fs.js绝对路径
const path3 = path.join(__dirname, 'fs.js')     //D:\wang\stage3\day02\fs.js绝对路径文件
const path4 = path.join(__dirname, 'app')       //D:\wang\stage3\day02\app绝对路径文件夹
`}</pre>
            </div>
    
        )
    }
}


