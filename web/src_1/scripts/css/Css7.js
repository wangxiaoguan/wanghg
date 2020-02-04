
import React,{Component} from "react";
import './css.scss'

export default class Css7 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='css7'>
                <iframe srcDoc={require('../../assets/html/keyframes.html')}></iframe>
<pre>{`
animation:move 10s infinite;
@keyframes move
{
    0%   {left: 0px;background: #f9fc5c}
    20%  {left: 0px;background: #f9fc5c}

    27.5%  {left: 500px;background: #f9fc5c}
    42.5%  {left: 500px;background: #06ff06}

    50%  {left: 0px;background: #06ff06}
    70%  {left: 0px;background: #06ff06}

    77.5%  {left: 500px;background: #06ff06}
    92.5%  {left: 500px;background: #f9fc5c}
    100% {left: 0px;background: #f9fc5c}
}

animation:rote 10s infinite;
@keyframes rote
{
    0%   {transform: scale(1);}
    20%  {transform: scale(1);}

    27.5%  {transform: scale(0);}
    42.5%  {transform: scale(0);}

    50%  {transform: scale(1);}
    70%  {transform: scale(1);}

    77.5%  {transform: scale(0);}
    92.5%  {transform: scale(0);}
    100% {transform: scale(1);}
}
`}</pre>
            </div>
    
        )
    }
}


