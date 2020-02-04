
import React,{Component} from "react";
import $ from 'jquery'
import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';
import Carousel from 'react-images';
import Zmage from 'react-zmage'
// import Img from 'react-image'
const img1=require('../../assets/images/img1.jpg')
const img2=require('../../assets/images/img2.jpg')
const img3=require('../../assets/images/img3.jpg')
import './react.scss'
export default class React7 extends Component{
        constructor(props){
            super(props);
            this.state={
                visible: false,
                images:[
                    {src:img1, alt: 'img1'},
                    {src:img2, alt: 'img2'},
                    {src:img3, alt: 'img3'},
                ],
                sort:0,
            }
        }
        showImg=(sort)=>{
            this.setState({sort,visible: !this.state.visible})
        }
        
        render(){
            
            return(
                <div id='react7'>
                    <h1>图片react-viewer,react-zmage,react-image,react-images</h1>
                    <div style={{fontSize:20,color:'#00f',textIndent:60}}>
                        
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
                        <Zmage src={img1} alt='' set={[{src:img1},{src:img2},{src:img3}]} controller={{close: true,zoom: true,download: true,rotate: true,flip: true,pagination: true,}}/>
                    </div>
                    <div style={{background:'#ddd',margin:10,width:600}}>
                        <Carousel views={[{src:img1},{src:img2},{src:img3}]} />
                    </div>
                    {/* <div style={{background:'#ccc',margin:10}}>
                        <Img src={[img7,img8,img9]}/>
                    </div> */}
                    
                       
                    
                </div>
        
            )
        }
    }
    
    
    


