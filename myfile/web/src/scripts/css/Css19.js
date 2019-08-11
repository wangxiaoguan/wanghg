
import React,{Component} from "react";
import {Button,Icon,Input,Select} from 'antd'
const Option = Select.Option;
import './css.scss'
export default class Css19 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }
    componentDidMount(){
      
    }
    
    render(){
        return(
            <div id='css19'> 
                <div className='app'>
                    <div className='left1'>
                        <ul className='ul1'>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                        </ul>
                        <ul className='ul2'>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                        </ul>
                        <ul className='ul3'>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                        </ul>
                        <ul className='ul4'>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                        </ul>
                    </div>
                    <div className='right right1'>
                        <ul>
                            <li>flex-direction:row</li>
                            <li>flex-direction:row-reverse</li>
                            <li>flex-direction:column</li>
                            <li>flex-direction:column-reverse</li>
                        </ul>
                    </div>
                </div>
                <div className='app'>
                    <div className='left2'>
                    <ul className='ul1'>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                        </ul>
                        <ul className='ul2'>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                        </ul>
                        <ul className='ul3'>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                        </ul>
                        <ul className='ul4'>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                        </ul>
                        <ul className='ul5'>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                        </ul>
                    </div>
                    <div className='right right2'>
                        <ul>
                            <li>justify-content:flex-start</li>
                            <li>justify-content:flex-end</li>
                            <li>justify-content:center</li>
                            <li>justify-content:space-between</li>
                            <li>justify-content: space-around</li>
                        </ul>
                    </div>
                </div>
                <div className='app'>
                    <div className='left3'>
                        <ul className='ul1'>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                        </ul>
                        <ul className='ul2'>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                        </ul>
                        <ul className='ul3'>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                        </ul>
                    </div>
                    <div className='right right3'>
                        <ul>
                            <li>align-items:flex-start</li>
                            <li>align-items:center</li>
                            <li>align-items:flex-end</li>
                            {/* <li>4,align-items:baseline</li>
                            <li>5,align-items:stretch(默认值)</li> */}
                        </ul>
                    </div>
                </div>
                <div className='app'>
                    <div className='left4'>
                        <ul className='ul1'>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                        </ul>
                        <ul className='ul2'>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                        </ul>
                        <ul className='ul3'>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                        </ul>
                    </div>
                    <div className='right right4'>
                        <ul>
                            <li>flex-wrap:nowrap(默认)</li>
                            <li>flex-wrap:wrap</li>
                            <li>flex-wrap:wrap-reverse</li>
                        </ul>
                    </div>
                </div>
            </div>
    
        )
    }
}


