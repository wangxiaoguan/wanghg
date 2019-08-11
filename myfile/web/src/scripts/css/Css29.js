
import React,{Component} from "react";
import {Button,Icon,Input,Select,Slider} from 'antd'
import './css.scss'
export default class Css29 extends Component{
    constructor(props){
        super(props);
        this.state={
            X:0,
            Y:0,
            R:0,
            InsetX:0,
            InsetY:0,
            InsetR:0,
            TextX:0,
            TextY:0,
            TextR:0,
        }
    }
    componentDidMount(){
      
    }
    changeX=(e)=>{
        console.log(e)
        this.setState({X:e})
    }
    changeY=(e)=>{
        console.log(e)
        this.setState({Y:e})
    }
    changeR=(e)=>{
        console.log(e)
        this.setState({R:e})
    }


    changeInsetX=(e)=>{
        console.log(e)
        this.setState({InsetX:e})
    }
    changeInsetY=(e)=>{
        console.log(e)
        this.setState({InsetY:e})
    }
    changeInsetR=(e)=>{
        console.log(e)
        this.setState({InsetR:e})
    }

    changeTextX=(e)=>{
        console.log(e)
        this.setState({TextX:e})
    }
    changeTextY=(e)=>{
        console.log(e)
        this.setState({TextY:e})
    }
    changeTextR=(e)=>{
        console.log(e)
        this.setState({TextR:e})
    }
    render(){
        const {X,Y,R,InsetX,InsetY,InsetR,TextX,TextY,TextR} = this.state
        return(
            <div id='css29'> 
                <div className="app">
                    <h2 style={{width:900,padding:'20px 0'}}>外部阴影:box-shadow:Xpx Ypx Rpx #000　　　<span style={{color:'red'}}>box-shadow:{X}px {Y}px {R}px #000</span></h2>
                    <div className='left'>
                        <div className='leftbox'>
                            <span>水平位移X:</span>
                            <span><Slider onChange={this.changeX} style={{width:200}} min={-20} max={20} defaultValue={0} /></span>
                        </div>
                        <div className='leftbox'>
                            <span>垂直位移Y:</span>
                            <span><Slider onChange={this.changeY} style={{width:200}} min={-20} max={20} defaultValue={0} /></span>
                        </div>
                        <div className='leftbox'>
                            <span>模糊半径R:</span>
                            <span><Slider onChange={this.changeR} style={{width:200}} min={0} max={20} defaultValue={0} /></span>
                        </div>
                    </div>
                    <div className='right'>
                        <div style={{boxShadow:`${X}px ${Y}px ${R}px #000`,marginTop: 10}} className='rightbox'></div>
                    </div>
                    
                </div>
                <div className="app">
                    <h2 style={{width:900,padding:'20px 0'}}>内部阴影:box-shadow:inset Xpx Ypx Rpx #000　　　<span style={{color:'red'}}>box-shadow:inset {InsetX}px {InsetY}px {InsetR}px #000</span></h2>
                    <div className='left'>
                        <div className='leftbox'>
                            <span>水平位移X:</span>
                            <span><Slider onChange={this.changeInsetX} style={{width:200}} min={-20} max={20} defaultValue={0} /></span>
                        </div>
                        <div className='leftbox'>
                            <span>垂直位移Y:</span>
                            <span><Slider onChange={this.changeInsetY} style={{width:200}} min={-20} max={20} defaultValue={0} /></span>
                        </div>
                        <div className='leftbox'>
                            <span>模糊半径:</span>
                            <span><Slider onChange={this.changeInsetR} style={{width:200}} min={0} max={20} defaultValue={0} /></span>
                        </div>
                    </div>
                    <div className='right'>
                        <div style={{boxShadow:`inset ${InsetX}px ${InsetY}px ${InsetR}px #000`,marginTop: 10}} className='rightbox'></div>
                    </div>
                </div>
                <div className="app">
                    <h2 style={{width:900,padding:'20px 0'}}>文字阴影:text-shadow:Xpx Ypx Rpx #000　　　<span style={{color:'red'}}>text-shadow:{TextX}px {TextY}px {TextR}px #000</span></h2>
                    <div className='left'>
                        <div className='leftbox'>
                            <span>水平位移X:</span>
                            <span><Slider onChange={this.changeTextX} style={{width:200}} min={-20} max={20} defaultValue={0} /></span>
                        </div>
                        <div className='leftbox'>
                            <span>垂直位移Y:</span>
                            <span><Slider onChange={this.changeTextY} style={{width:200}} min={-20} max={20} defaultValue={0} /></span>
                        </div>
                        <div className='leftbox'>
                            <span>模糊半径:</span>
                            <span><Slider onChange={this.changeTextR} style={{width:200}} min={0} max={20} defaultValue={0} /></span>
                        </div>
                    </div>
                    <div className='right'>
                        <div style={{textShadow:`${TextX}px ${TextY}px ${TextR}px #000`,marginTop: 10,fontSize:60}}>中国梦</div>
                    </div>
                </div>
            </div>
    
        )
    }
}


