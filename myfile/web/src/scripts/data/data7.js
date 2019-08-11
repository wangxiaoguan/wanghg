
import React,{Component} from "react";
import './data.scss'
import {Button} from 'antd'
export default class Data7 extends Component{
    constructor(props){
        super(props);
        this.state={
           isFlag:false
        }
    }
    componentDidMount(){
        color();
		function color(){
			var oWrap=document.getElementById('warp');
			var max=225;  /*存储封值*/
			var min=0;	  /*存储谷值*/
			var color=[max,min,min]; /*根据初始值红色来初始化数组*/
			var timer=null;
			var length=color.length;
			var colorL,colorR
			timer=setInterval(change,5);
			/*不容许在机组运行中直接修改代码*/
			function change(){
				/*在定时器中每过20毫秒 执行一次代码*/
				/*检测一次数组*/
				for(var i=0;i<length;i++){
					i%=length;
				   var arrX=(i+1)%length;
				   var arrY=(i+2)%length;
					if(color[i]==max&&color[arrX]==min){
						color[arrY]++;
					}
					if(color[i]== min&&color[arrX]==max){
						color[arrY]--;
					}
				 colorL='#'+convert(color[0])+''+convert(color[1])+''+convert(color[2])+'';
				colorR='#'+convert(color[2])+''+convert(color[0])+''+convert(color[1])+'';
						
					}
					gColor(colorL,colorR);
				}
			
			function convert(sRgb){ /*rgb转换成HEX*/
				var sRgb=sRgb;
				var sHex=sRgb.toString(16);
				sHex=sHex.length<2?'0'+sHex:sHex 
				/* 三目判断  判断条件 ？ 符合条件 ：不符合条件*/
				return sHex;
			}
			function gColor(colorL,colorR){
				if(navigator.userAgent.match(/Trident/i)&&navigator.userAgent.match(/MSIE [7|8|9].0/i)){
					//通过正则检测浏览器信息是否是ie 并且 ie版本是不是 7或者8或者9 之一
					oWrap.style.filter = "progid:DXImageTransform.Microsoft.gradient( startColorstr=" + colorL + ", endColorstr=" + colorR + ",GradientType=0 )";
				}else{
					oWrap.style.background='-webkit-linear-gradient(left,'+colorL+','+colorR+')' //谷歌
					oWrap.style.background='-ms-linear-gradient(left,'+colorL+','+colorR+')'  //ie 10 11
				}
			 
			
			}
		}
    }
    render(){
        return(
            <div id='data7'> 
                <div id='warp'></div>
                <div>
                    <Button onClick={()=>this.setState({isFlag:!this.state.isFlag})}>查看代码</Button>
                </div>
<pre  style={{display:this.state.isFlag?'block':'none'}}>{`
function color(){
	var oWrap=document.getElementById('warp');
	var max=225;  /*存储封值*/
	var min=0;	  /*存储谷值*/
	var color=[max,min,min]; /*根据初始值红色来初始化数组*/
	var timer=null;
	var length=color.length;
	var colorL,colorR
	timer=setInterval(change,5);
	/*不容许在机组运行中直接修改代码*/
	function change(){
		/*在定时器中每过20毫秒 执行一次代码*/
		/*检测一次数组*/
		for(var i=0;i<length;i++){
			i%=length;
			var arrX=(i+1)%length;
			var arrY=(i+2)%length;
			if(color[i]==max&&color[arrX]==min){
				color[arrY]++;
			}
			if(color[i]== min&&color[arrX]==max){
				color[arrY]--;
			}
			colorL='#'+convert(color[0])+''+convert(color[1])+''+convert(color[2])+'';
			colorR='#'+convert(color[2])+''+convert(color[0])+''+convert(color[1])+'';
				
			}
			gColor(colorL,colorR);
		}
		
		function convert(sRgb){ /*rgb转换成HEX*/
			var sRgb=sRgb;
			var sHex=sRgb.toString(16);
			sHex=sHex.length<2?'0'+sHex:sHex 
			/* 三目判断  判断条件 ？ 符合条件 ：不符合条件*/
			return sHex;
		}
		function gColor(colorL,colorR){
			if(navigator.userAgent.match(/Trident/i)&&navigator.userAgent.match(/MSIE [7|8|9].0/i)){
				//通过正则检测浏览器信息是否是ie 并且 ie版本是不是 7或者8或者9 之一
				oWrap.style.filter = "progid:DXImageTransform.Microsoft.gradient( startColorstr=" + colorL + ", endColorstr=" + colorR + ",GradientType=0 )";
			}else{
				oWrap.style.background='-webkit-linear-gradient(left,'+colorL+','+colorR+')' //谷歌
				oWrap.style.background='-ms-linear-gradient(left,'+colorL+','+colorR+')'  //ie 10 11
			}
			
		
		}
	}
}
`}</pre>
            </div>
    
        )
    }
}


