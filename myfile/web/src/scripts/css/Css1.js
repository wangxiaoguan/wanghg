
import React,{Component} from "react";
import './css.scss'
export default class Css1 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='css1'> 
              <div className="app">
                  <div className='left'></div>
                  <div className='right'>
                    <pre>{`
  width: 160px;
  height:260px;
  transition: 1s;
  &:hover{width:260px }
                    `}</pre>
                  </div>
              </div>
              <div className="app">
                  <div className='left2'></div>
                  <div className='right'>
                    <pre>{`
  width:260px;
  height:260px;
  transition:2s;
  &:hover{transform:scale(-1);} /*缩小*/
  &:hover{transform:scale(2);}  /*放大*/
                    `}</pre>
                  </div>
              </div>
              <div className="app">
                  <div className='left3'></div>
                  <div className='right'>
                    <pre>{`
  width:160px;
  height: 260px;
  transition:2s;
  &:hover{transform:translateX(100px)}/*向右平移*/
  &:hover{transform:translateX(-100px)}/*向左平移*/
                    `}</pre>
                  </div>
              </div>
              <div className="app">
                  <div className='left4'></div>
                  <div className='right'>
                    <pre>{`
  width:260px;
  height:160px;
  transition:2s;
  &:hover{transform:translateY(100px)}/*向小平移*/
  &:hover{transform:translateY(-100px)}/*向上平移*/
                    `}</pre>
                  </div>  
              </div>
              <div className="app">
                  <div className='left5'></div>
                  <div className='right'>
                    <pre>{`
  width:160px;
  height:160px;
  transition:1s;
  &:hover{transform:rotate(360deg);}/*顺时针旋转*/
  &:hover{transform:rotate(-360deg);}/*逆时针旋转*/
                    `}</pre>
                  </div>  
              </div>
              <div className="app">
                  <div className='left6'></div>
                  <div className='right'>
                    <pre>{`
  width:160px;
  height:160px;
  transition:1s;
  &:hover{transform:skew(30deg);}/*向左倾斜*/
  &:hover{transform:skew(-30deg);}/*向右倾斜*/
                    `}</pre>
                  </div>  
              </div>
            </div>
    
        )
    }
}


