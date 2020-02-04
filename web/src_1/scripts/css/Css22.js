
import React,{Component} from "react";
import {Button,Icon,Input,Select} from 'antd'
const Option = Select.Option;
import './css.scss'
export default class Css22 extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    componentDidMount(){
      
    }

    render(){
        return(
            <div id='css22'> 
<pre>{`
<form>
    <fieldset>
        <legend align="center">登录</legend>

    <input type="text" list="a">
    <datalist id="a">
        <option value="111"> 
        <option value="222"> 
        <option value="333"> 
        <option value="444"> 
        <option value="555"> 
    </datalist>

    <input type="number" min="1" max="15" step="15" placeholder>

    <input type="range"  autofocus>

    <input type="color" autofocus>

    <input type="url" require>

    <input type="date" require>

    <input type="email"  require>

    <input type="submit">

    <input type="file">

    <input type="image" src="images/index_zj1.jpg">

    <input type="text" placeholder="请输入姓名">

    <input type="password" placeholder="请输入密码" >

    <input type="radio" name="sex">男
    
    <input type="radio" name="sex">女

    <input type="checkbox">水果
    
    <input type="checkbox">蔬菜

    <select>
        <option>水果</option>
        <option>蔬菜</option>
        <option>海鲜</option>
        <option>肉类</option>
    </select>

    <input type="submit" value="注册">
    <input type="button" value="确定">
    <input type="reset" value="重置">
    <textarea cols="20" rows="3"></textarea>
    </fieldset>
</form>
`}</pre>
            </div>
    
        )
    }
}


