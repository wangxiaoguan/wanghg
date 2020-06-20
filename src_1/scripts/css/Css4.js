
import React,{Component} from "react";
import './css.scss';
import {Input} from 'antd'
export default class Css4 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }

    render(){
        return(
            <div id='css4'> 
                <h1 style={{margin:'10px auto'}}>鼠标样式</h1>
                <ul style={{fontSize:20}}>
                    <li>cursor:default</li>
                    <li>cursor:auto</li>
                    <li>cursor:crosshair</li>
                    <li>cursor:pointer</li>
                    <li>cursor:move</li>
                    <li>cursor:e-resize</li>
                    <li>cursor:ne-resize</li>
                    <li>cursor:nw-resize</li>
                    <li>cursor:n-resize</li>
                    <li>cursor:se-resize</li>
                    <li>cursor:sw-resize</li>
                    <li>cursor:s-resize</li>
                    <li>cursor:w-resize</li>
                    <li>cursor:text</li>
                    <li>cursor:wait</li>
                    <li>cursor:help</li>
                </ul>
            </div>
    
        )
    }
}


