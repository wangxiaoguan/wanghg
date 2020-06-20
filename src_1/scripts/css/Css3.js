
import React,{Component} from "react";
import './css.scss'
export default class Css3 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='css3'> 
<h2>百度地图</h2>
<pre>{`
<div id="map"></div>
<input style={{display:'none'}} type="text" id="search"/>
<script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=d2xSp70cZxKgiyeGRb8ACTlTEVwEkrHS"></script>
<script>
    var map = new BMap.Map("map");
    var point = new BMap.Point(116.403829,39.915098);   //福州市
    map.centerAndZoom(point, 12);
    var marker = new BMap.Marker(point);                // 创建标注
    map.addOverlay(marker);
    map.enableScrollWheelZoom(true);                    //启用滚轮放大缩小，默认禁用
    map.enableKeyboard(true);                           //启用键盘操作，默认禁用。
    map.enableDragging();                               //启用地图拖拽，默认启用
    map.enableDoubleClickZoom();                        //启用双击放大，默认启用
    map.addControl(new BMap.NavigationControl());       //平移缩放控件
    map.addControl(new BMap.ScaleControl());            //比例尺控件
</script>
`}</pre>


<h2>高德地图</h2>
<pre>{`
<input  id='inputData' placeholder={'请输入搜索地址'} style={{width:700}}/>
<div id='gaodeMap'></div>
<script src="http://webapi.amap.com/maps?v=1.3&key=a82669655cc541a1793e86f273fac31e&plugin=AMap.Autocomplete,AMap.PlaceSearch"></script>
<script>
    var gaodeMap = new AMap.Map("gaodeMap", {resizeEnable: true});
    var autoOptions = {input: "inputData"};                     //输入提示
    var auto = new AMap.Autocomplete(autoOptions);
    var placeSearch = new AMap.PlaceSearch({map: gaodeMap});    //构造地点查询类
    AMap.event.addListener(auto, "select", select);             //注册监听，当选中某条记录时会触发
    function select(e) {
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);                         //关键字查询查询
    }
</script>

`}</pre>
            
              
            </div>
    
        )
    }
}


