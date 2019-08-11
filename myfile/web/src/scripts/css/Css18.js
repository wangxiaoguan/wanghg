
import React,{Component} from "react";
import './css.scss'
export default class Css4 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }
    componentDidMount(){
      
    }
   
    render(){
        
        return(
            <div id='css18'> 
                <div className='app'>
                    <div className='left1'>
                        <ul>
                            <li>天道酬勤</li>
                        </ul>
                    </div>
                    <div className='right'>
<pre>{`
ul{
    position: relative;
}
li{ position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}
`}</pre>
                    </div>
                </div>
                <div className='app'>
                    <div className='left2'>
                        <ul>
                            <li>天道酬勤</li>
                        </ul>
                    </div>
                    <div className='right'>
<pre>{`
ul{
    position: relative;
}
li{ position: absolute;
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
}
`}</pre>
                    </div>
                </div>
                <div className='app'>
                    <div className='left3'>
                        <ul>
                            <li>天道酬勤</li>
                        </ul>
                    </div>
                    <div className='right'>
<pre>{`
ul{
    display: flex;
    justify-content: center;
    align-items:center;
}

`}</pre>
                    </div>
                </div>
                <div className='app'>
                    <div className='left4'>
                        <ul>
                            <li>天道酬勤</li>
                            <li>天道酬勤</li>
                            <li>天道酬勤</li>
                        </ul>
                    </div>
                    <div className='right'>
<pre>{`
ul{
    display: table;
}
li{
    display: table-cell;
    vertical-align:middle;
}
`}</pre>        
                    </div>
                </div>
            </div>
    
        )
    }
}


