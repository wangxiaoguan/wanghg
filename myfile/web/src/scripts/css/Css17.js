
import React,{Component} from "react";
import './css.scss'
export default class Css17 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    componentDidMount() {
        
    }
   
    render(){
        return(
            <div id='css17'> 
                <div className="box1">background-size:50% 50%</div>
                <div className="box2">background-size:50%</div>
                <div className="box3">background-size:50% auto </div>
                <div className="box4">background-size:auto 50% </div>
                <div className="box5">background-size:cover</div>
                <div className="box6">background-size:contain </div>
<pre style={{float:'left'}}>{`
cover盒子会铺满，宽高比不变最大化的拉伸图片直到触到内容框的左边和下边为止并且超出图片会被裁切
contain在保证图片的完整性的前提下，宽高比不变最大化的拉伸图片直到触到内容框的左边或下边为止
`}</pre>
            </div>
    
        )
    }
}


