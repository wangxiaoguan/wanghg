
import React,{Component} from "react";
import {Button,Icon,Input,Select} from 'antd'
const Option = Select.Option;
import './css.scss'
export default class Css25 extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    componentDidMount(){
        // &::-webkit-scrollbar{
        //     width: 10px;
        // }
        // &::-webkit-scrollbar-track{
        //     box-shadow:inset 0 0 6px rgba(43, 43, 43, 0.3) ;
        //     border-radius: 10px;
        // }
        // &::-webkit-scrollbar-thumb {
        //     border-radius: 10px;
        //     background: rgba(0, 0, 0, 0.1);
        //     box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
        // }
    }

    render(){
        return(
            <div id='css25'> 
                <div className='scroll'>
                    <h2>茶</h2>
                    入夜如水，静坐品茗；茶香袅袅，润喉清心。<br/>
                    徒生感慨，意由心生；提笔以记，为云雾铭。<br/>
                    世有好山，大别形胜；鬼斧神工，古来多云。<br/>
                    山清水秀，水伴山行；沿山植茶，自古至今。<br/>
                    唐有团黄，岁贡朝廷；今有云雾，四海扬名。<br/>
                    形色香味，相辅相成；畅销南北，国饮佳品。<br/>
                    其形悦目，观之提神；或如蕊聚，或如丛笋。<br/>
                    条分缕晰，经络分明；杯中轻舞，状若精灵。<br/>
                    翩翩惊鸿，敦煌洛神；绿衣仙子，栩栩如生。<br/>
                    不一而足，笔意难尽；望而心动，口内生津。<br/>
                    其色养眼，赏之目明；清澈明亮，翠绿尚润。<br/>
                    浓淡适宜，轻妆罗裙；薄雾轻笼，恰似春分。<br/>
                    旷野暖意，穿越心神；虚无缥缈，雅致有痕。<br/>
                    表里如一，触之无根；赏而不腻，悄动心旌。<br/>
                    其香淡雅，闻之心静；幽香持久，悄然销魂。<br/>
                    笋之嫩香，少女怀春；蕊之高香，独具神韵；<br/>
                    茗之清香，入鼻心宁；兰花栗香，可遇难寻。<br/>
                    天上人间，独得灵韵；闻而不舍，沁肺安神。<br/>
                    其味爽口，品之怡情；浅吹慢饮，尝尽鲜醇。<br/>
                    入口清绵，暗藏苦根；回环婉转，渐入佳境。<br/>
                    滴滴含香，久旱甘霖；杯杯玉液，精神倍增。<br/>
                    茶余饭后，难舍难分；品而难弃，神闲气定。<br/>
                    堪叹造化，赋我地灵；山乡处处，满园皆春；<br/>
                    茶乡遍地，片片含情；绿满山河，福祉乡村。<br/>
                    五湖商贾，万载同行；四海宾朋，杯中归真。<br/>
                    临溪煮水，为香茗文；生在茶乡，是为有幸。<br/>
                </div>
<pre>{`
&::-webkit-scrollbar{                               //设置滚动条高宽度
    width: 10px;                                    //竖向滚动条宽度
    height: 10px;                                   //横向滚动条高度
}
&::-webkit-scrollbar-track{                         //滚动条轨道
    box-shadow:inset 0 0 6px rgba(43, 43, 43, 0.3) ;
    border-radius: 10px;
}
&::-webkit-scrollbar-thumb {                        //滚动条滑块
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}
`}</pre>
            </div>
    
        )
    }
}


