
import React,{Component} from "react";
import './data.scss'
export default class Data3 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }
    componentDidMount(){
        var svgNS = "http://www.w3.org/2000/svg";
			var svg = document.getElementById("svg");
			//创建标签元素
			var hour = document.getElementById("hour");
			var min = document.getElementById("min");
			var sec = document.getElementById("sec");
			var lin = document.getElementById("lin");
			var g1 = document.getElementById("g1");
			var g2 = document.getElementById("g2");

			function createEle(tag , attr ){
				var oEle = document.createElementNS(svgNS , tag);
			
				for(var n in attr){
					oEle.setAttribute(n , attr[n]);
				}
				
				return oEle;
			}

			var R = 200;
			var r = 190;
			var r2 = 180;
			var R2 = 200;
			var centerX = 250;
			var centerY = 250;
			var x1y1 = [{x:430,y:250}];
			var x2y2 = [{x:450,y:250}];
			var xa1ya1 = [{x:440,y:250}];
			var xa2ya2 = [{x:450,y:250}];
			for(var i=0;i<12;i++){
				var x1 = Math.cos(i*30*Math.PI/180)*r2 + centerX;
				var y1 = Math.sin(i*30*Math.PI/180)*r2 + centerY;
				xa1ya1.push({x : x1 , y : y1});
				var x2 = Math.cos(i*30*Math.PI/180)*R2 + centerX;
				var y2 = Math.sin(i*30*Math.PI/180)*R2 + centerY;
				xa2ya2.push({x : x2 , y : y2});
			}
			for(var i=0;i<=12;i++){
				var oLine = createEle("line",{
					x1 : xa1ya1[i].x,
					y1 : xa1ya1[i].y,
					x2 : xa2ya2[i].x,
					y2 : xa2ya2[i].y,
					stroke :"#ff9933",
					strokeWidth:5

				} );
				g1.appendChild(oLine);
			}
			for(var i=0;i<60;i++){
				var x1 = Math.cos(i*6*Math.PI/180)*r + centerX;
				var y1 = Math.sin(i*6*Math.PI/180)*r + centerY;
				x1y1.push({x : x1 , y : y1});
				var x2 = Math.cos(i*6*Math.PI/180)*R + centerX;
				var y2 = Math.sin(i*6*Math.PI/180)*R + centerY;
				x2y2.push({x : x2 , y : y2});
			}
			for(var i=0;i<=60;i++){
				var oLine = createEle("line",{
					x1 : x1y1[i].x,
					y1 : x1y1[i].y,
					x2 : x2y2[i].x,
					y2 : x2y2[i].y,
					stroke :"#cc0000",
					strokeWidth:3

				} );
				g2.appendChild(oLine);
			}
			 needle()
			setInterval(needle,1000);
			function needle(){
				function rotate(oEle , deg ){
					oEle.setAttribute("transform" , "rotate("+deg+" 250 250)");
				};
				var date = new Date();
				var h = date.getHours()%12;
				var m = date.getMinutes();
				var s = date.getSeconds();
				rotate(hour , 30*(h+m/60));
				rotate(min , 6*m);
				rotate(sec , 6*s);
			}
    }
    render(){
        return(
            <div id='data3'> 
            	<div className="box">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" id="svg" >
                        <circle cx="250" cy="250" r="200"></circle>
                    
                        <g id="g2" stroke="#cc0099" strokeWidth="3"></g>
                            <g id="g1" stroke="#ffff00" strokeWidth="5"></g>
                        <path d="M250 260L250 150" id="hour"></path>
                        <path d="M250 270L250 120" id="min"></path>
                        <path d="M250 280L250 80" id="sec"></path>
                        <circle cx="250" cy="250" r="10" id="cir"></circle>

                    </svg>
                </div>
            </div>
    
        )
    }
}


