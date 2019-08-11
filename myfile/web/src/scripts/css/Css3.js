
import React,{Component} from "react";
import './css.scss'
export default class Css3 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }
    componentDidMount(){
      this.initMap();
    }
  
    initMap=()=>{
        var map = new BMap.Map("map");
        var point = new BMap.Point(116.403829,39.915098); //福州市
        map.centerAndZoom(point, 12);
        var marker = new BMap.Marker(point);   // 创建标注
        map.addOverlay(marker);
        map.enableScrollWheelZoom(true);  //启用滚轮放大缩小，默认禁用
        map.enableKeyboard(true);         //启用键盘操作，默认禁用。
        map.enableDragging();             //启用地图拖拽，默认启用
        map.enableDoubleClickZoom();      //启用双击放大，默认启用
        map.addControl(new BMap.NavigationControl()); //平移缩放控件
        map.addControl(new BMap.ScaleControl());      //比例尺控件
    }
    render(){
        return(
            <div id='css3'> 
              <div id="map"></div>
              <input style={{display:'none'}} type="text" id="search"/>
            </div>
    
        )
    }
}


