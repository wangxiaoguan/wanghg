
import React,{Component} from "react";
import $ from 'jquery'
import './css.scss'
import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';
import Carousel from 'react-images';
import Zmage from 'react-zmage'
// import Img from 'react-image'
const img1=require('../../assets/images/img1.jpg')
const img2=require('../../assets/images/img2.jpg')
const img3=require('../../assets/images/img3.jpg')
const img4=require('../../assets/images/img4.jpg')
const img5=require('../../assets/images/img5.jpg')
const img6=require('../../assets/images/img6.jpg')
const img7=require('../../assets/images/img7.jpg')
const img8=require('../../assets/images/img8.jpg')
const img9=require('../../assets/images/img9.jpg')
export default class Css9 extends Component{
    constructor(props){
        super(props);
        this.state={
            visible: false,
            images:[
                {src:img1, alt: 'img1'},
                {src:img2, alt: 'img2'},
                {src:img3, alt: 'img3'},
                {src:img4, alt: 'img4'},
                {src:img5, alt: 'img5'},
                {src:img6, alt: 'img6'},
                {src:img7, alt: 'img7'},
                {src:img8, alt: 'img8'},
                {src:img9, alt: 'img9'},
            ],
            sort:0,
        }
    }
    showImg=(sort)=>{
        this.setState({sort,visible: !this.state.visible})
    }
    
    render(){
        
        return(
            <div id='css9'>
                <div style={{fontSize:20,color:'#00f',textIndent:60}}>
                    <h2>react图片插件</h2>
                    <p>react-viewer ——————>import Viewer from 'react-viewer';</p>
                    <p>react-zmage  ——————>import Zmage from 'react-zmage'</p>
                    {/* <p>react-image  ——————>import Img from 'react-image'</p> */}
                    <p>react-images ——————>import Carousel from 'react-images';</p>
                    <h3 style={{color:'red'}}>备注:react-viewer在react任何版本可行<br/>
                    　　　　　react-zmage、react-images在react16.0.0以上可行
                    </h3>
                </div>
                <ul className='css9-app'>
                    <li onClick={()=>this.showImg(0)}><img src={img1} style={{width:300}} alt='img1' /></li>
                    <li onClick={()=>this.showImg(1)}><img src={img2} style={{width:300}} alt='img2' /></li>
                    <li onClick={()=>this.showImg(2)}><img src={img3} style={{width:300}} alt='img3' /></li>
                    <li onClick={()=>this.showImg(3)}><img src={img4} style={{width:300}} alt='img4' /></li>
                    <li onClick={()=>this.showImg(4)}><img src={img5} style={{width:300}} alt='img5' /></li>
                    <li onClick={()=>this.showImg(5)}><img src={img6} style={{width:300}} alt='img6' /></li>
                    <li onClick={()=>this.showImg(6)}><img src={img7} style={{width:300}} alt='img7' /></li>
                    <li onClick={()=>this.showImg(7)}><img src={img8} style={{width:300}} alt='img8' /></li>
                    <li onClick={()=>this.showImg(8)}><img src={img9} style={{width:300}} alt='img9' /></li>
                </ul>
                <Viewer
                visible={this.state.visible}
                zoomable={1}
                noToolbar={false}
                noFooter={false}
                zoomSpeed={1}
                zIndex={3}
                activeIndex={this.state.sort}
                onClose={() => { this.setState({ visible: false }); } }
                images={this.state.images}
                />
                <div style={{margin:10,width:600}}>
                    <Zmage src={img1} alt='' set={[{src:img1},{src:img2},{src:img3},{src:img4}]} controller={{close: true,zoom: true,download: true,rotate: true,flip: true,pagination: true,}}/>
                </div>
                <div style={{background:'#ddd',margin:10,width:600}}>
                    <Carousel views={[{src:img4},{src:img5},{src:img6},{src:img7}]} />
                </div>
                {/* <div style={{background:'#ccc',margin:10}}>
                    <Img src={[img7,img8,img9]}/>
                </div> */}
                
                   
                
            </div>
    
        )
    }
}


