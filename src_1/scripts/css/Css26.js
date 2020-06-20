
import React,{Component} from "react";
import {Button,Icon,Input,Select} from 'antd'
const Option = Select.Option;
import './css.scss'
export default class Css26 extends Component{
    constructor(props){
        super(props);
        this.canvas = React.createRef();

        this.state={

        }
    }
    componentDidMount(){
      
    const canvas = this.canvas.current;
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        console.log(ctx);
        console.log(Object.getPrototypeOf(ctx));
        (function () {
            Object.getPrototypeOf(ctx).Triangle = function (x, y, r) {
                this.save();
                this.translate(x, y);
                this.rotate(r);
                this.beginPath();
                this.moveTo(0, 0);
                this.lineTo(10, 0);
                this.lineTo(0, 10);
                this.lineTo(-10, 0);
                this.closePath();
                this.fill();
                this.restore();
            }
            Object.getPrototypeOf(ctx).line = function (x, y, x1, y1) {
                this.save();
                this.beginPath();
                this.moveTo(x, y);
                this.lineTo(x1, y1);
                this.lineWidth = 10;
                this.strokeStyle = "yellow";
                this.stroke();
                this.restore();
            }
        })();
        ctx.strokeStyle = "#7C8B8C";
        ctx.line(9, 9, 600, 9);
        ctx.line(600, 9, 600, 600);
        ctx.line(600, 600, 9, 600);
        ctx.line(9, 600, 9, 9);
        ctx.Triangle(320, 210, -Math.PI * .4);

    }

    }
    
    render(){
        
        return(
            <div id='css26'> 
                <canvas ref={this.canvas} width="780" height="660" style={{border:'1px solid #000'}}>
                    您的浏览器不支持canvas，请更换浏览器.
                </canvas>
            </div>
    
        )
    }
}


