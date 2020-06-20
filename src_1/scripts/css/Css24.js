
import React,{Component} from "react";
import {Input} from 'antd'
// import QRCode from 'qrcode.react'
import QRCode from 'qrcode-react'
import JsBarcode from 'jsbarcode'

import './css.scss'
export default class Css24 extends Component{
    constructor(props){
        super(props);
        this.state={
            codeValue:'1',
            txt:'1'
        }
    }

    componentDidMount() {
        JsBarcode(this.barcode, this.state.txt, {
            displayValue: false,  //  不显示原始值
            background: '#fff',  //  背景色
            lineColor: '#000', // 线条颜色
            width: 1  // 线条宽度
        })
      }
    changeInput = e => {
        JsBarcode(this.barcode, e.target.value, {
            displayValue: false,  //  不显示原始值
            background: '#fff',  //  背景色
            lineColor: '#000', // 线条颜色
            width: 1  // 线条宽度
        })
    }
    render(){
        return(
            <div id='css24'>
                <div className='qrcode'>
                    <h2>二维码</h2>
                    <Input style={{width:300}} placeholder='请输入内容' onChange={e=>this.setState({codeValue:e.target.value})}/><br/>
                    <QRCode
                        value={this.state.codeValue}  //value参数为生成二维码的链接
                        size={200} //二维码的宽高尺寸
                        fgColor="#000000"  //二维码的颜色
                        bgColor='#d0d0d0'    //背景颜色
                        logo={require('../../assets/img/long.jpg')}        //logo图片地址 string 
                        logoWidth={80}  //二维码宽度 number   
                        logoHeight={80}  //二维码高度  number 
                    ></QRCode>
                </div>
                <div className="JsBarcode">
                    <h2>条形码</h2>
                    <Input style={{width:300}} placeholder='请输入字母或者数字' onChange={this.changeInput}/><br/>
                    <svg  ref={ref => this.barcode = ref }></svg>
                </div>
                <div className='code'>
<pre>{`
引入二维码与条形码
import QRCode from 'qrcode.react'
import QRCode from 'qrcode-react'(带logo)
import JsBarcode from 'jsbarcode'

二维码
<QRCode
    value={this.state.codeValue}                    //value参数为生成二维码的链接
    size={200}                                      //二维码的宽高尺寸
    fgColor="#000000"                               //二维码的颜色
    bgColor='#d0d0d0'                               //二维码的背景颜色
    logo={require('../../assets/img/long.jpg')}     //logo图片地址
    logoWidth={80}                                  //logo宽度   
    logoHeight={80}                                 //logo高度 
/>

条形码
<svg  ref={ref => this.barcode = ref }></svg>

JsBarcode(this.barcode, value, {    // value:条形码的信息(字母与数字)
    displayValue: false,            // 不显示原始值
    background: '#fff',             // 背景色
    lineColor: '#000',              // 线条颜色
    width: 1                        // 线条宽度
})
`}</pre>
                </div>
            </div>
    
        )
    }
}


