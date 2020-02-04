
import React,{Component} from "react";
import './home.scss'
export default class Home14 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='home14'> 
<pre>{`
// webpack  配置文件 
// entry 入口文件
// output 出口文件  __dirname 根目录 
// module 需要打包的模块  js/png/css
// rules 打包的规则 
module.exports = {
    entry:"./entry.js",
    output:{
        path:__dirname,
        filename:"bundle.js"
    },
    module:{
        rules:[
            { test: /\.css$/,loader:"style-loader!css-loader"},
            { test: /\.scss$/,use:["style-loader","css-loader",'sass-loader']},
            { test: /\.less$/,use:["style-loader","css-loader",'less-loader']},
            { test:/\.js$/,exclude:/node_modules/,loader:"babel-loader"}  
        ]
    },
    devtool:"source-map"

}
`}</pre>
            </div>
    
        )
    }
}


