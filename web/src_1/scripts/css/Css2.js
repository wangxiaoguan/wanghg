
import React,{Component} from "react";
import './css.scss'
export default class Css2 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='css2'> 
                <div className='app'>
                    <div className="show">
                        <div className="box">
                            <div className="a1"></div>
                            <div className="a2"></div>
                            <div className="a3"></div>
                            <div className="a4"></div>
                            <div className="a5"></div>
                            <div className="a6"></div>
                            <div className="a7"></div>
                            <div className="a8"></div>
                            <div className="a9"></div>
                            <div className="a10"></div>
                            <div className="a11"></div>
                            <div className="a12"></div>
                        </div>
                    </div>
                </div>
                <div>
<pre>{`
<div className='app'>
  <div className="show">
      <div className="box">
          <div className="a1"></div>
          <div className="a2"></div>
          <div className="a3"></div>
          <div className="a4"></div>
          <div className="a5"></div>
          <div className="a6"></div>
          <div className="a7"></div>
          <div className="a8"></div>
          <div className="a9"></div>
          <div className="a10"></div>
          <div className="a11"></div>
          <div className="a12"></div>
      </div>
  </div>
</div>
`}</pre>
<pre>{`
.app{
    perspective:1000px;
    border: 1px solid #ccc;
    .show{
        transform-style:preserve-3d;
        perspective:1000px;
        transform:rotateX(-25deg);
        .box{
            width:100px;
            height:200px;
            transform-style:preserve-3d;
            position:relative;
            margin:100px auto;
            animation:rotate 3s linear infinite;
            @keyframes rotate{
                0%{transform:rotateY(0deg);}
                100%{transform:rotateY(360deg);}
          }
          div{
              width:100px;
              height:100px;
              position:absolute;
              left: 0;top: 0;
          }
          .a1{background:#ff0000;transform:rotateY(0deg) translateZ(200px);}
          .a2{background:#b6f800;transform:rotateY(30deg) translateZ(200px);}
          .a3{background:#ffee01;transform:rotateY(60deg) translateZ(200px);}
          .a4{background:#06ffc9;transform:rotateY(90deg) translateZ(200px);}
          .a5{background:#00d9ff;transform:rotateY(120deg) translateZ(200px);}
          .a6{background:#019aff;transform:rotateY(150deg) translateZ(200px);}
          .a7{background:#0105f7;transform:rotateY(180deg) translateZ(200px);}
          .a8{background:#610cff;transform:rotateY(210deg) translateZ(200px);}
          .a9{background:#9601fa;transform:rotateY(240deg) translateZ(200px);}
          .a10{background:#e203ff;transform:rotateY(270deg) translateZ(200px);}
          .a11{background:#ff04a3;transform:rotateY(300deg) translateZ(200px);}
          .a12{background:#ff0202;transform:rotateY(330deg) translateZ(200px);}
        }
    }
}
`}</pre>
                </div>
            </div>
    
        )
    }
}


