
import React,{Component} from "react";
import './app.scss'
export default class App11 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='app11'>
                <iframe srcDoc={require('../../assets/html/form.html')}></iframe>
                
<pre>{`
<form>
    <fieldset>
        <legend align="center">登录</legend>

        <input type="text" list="a"><br>
        <datalist id="a">
            <option value="111"> 
            <option value="222"> 
            <option value="333"> 
            <option value="444"> 
            <option value="555"> 
        </datalist><br>

        <input type="number" min="1" max="15" step="15" placeholder><br>

        <input type="range"  autofocus><br>

        <input type="color" autofocus><br>

        <input type="url" require><br>

        <input type="date" require><br>

        <input type="email"  require><br>

        <input type="file"><br>

        <input style="width: 200px" type="image" src="http://wanghg.top/images/img5.jpg"><br>

        <input type="text" placeholder="请输入姓名"><br>

        <input type="password" placeholder="请输入密码" ><br>

        <input type="radio" name="sex">男<br>

        <input type="radio" name="sex">女<br>

        <input type="checkbox">水果<br>

        <input type="checkbox">蔬菜<br>

        <select>
            <option>水果</option>
            <option>蔬菜</option>
            <option>海鲜</option>
            <option>肉类</option>
        </select><br>

        <input type="submit" value="注册"><br>
        <input type="button" value="确定"><br>
        <input type="reset" value="重置"><br>
        <textarea cols="20" rows="3"></textarea>
    </fieldset>
</form>

`}</pre>
                	
                
                
               
            </div>
        )
    }
}


