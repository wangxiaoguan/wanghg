
import React,{Component} from "react";
import './css.scss';
import {Input} from 'antd'
export default class Css4 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    componentDidMount(){
        this.gaodeMap();
    }
    
      
    gaodeMap=()=>{
        //地图加载
        var gaodeMap = new AMap.Map("gaodeMap", {
            resizeEnable: true
        });
        //输入提示
        var autoOptions = {
            input: "inputData"
        };
        var auto = new AMap.Autocomplete(autoOptions);
        var placeSearch = new AMap.PlaceSearch({
            map: gaodeMap
        });  //构造地点查询类
        AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
        function select(e) {
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name);  //关键字查询查询
        }
    }
    render(){
        return(
            <div id='css4'> 
                <Input  id='inputData' placeholder={'请输入搜索地址'} style={{width:700}}/>
                <div id='gaodeMap'></div>
            </div>
    
        )
    }
}


