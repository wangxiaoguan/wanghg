
import React,{Component} from "react";
import './data.scss'
import {Button,Input,message} from 'antd'
const {TextArea}=Input
export default class Data16 extends Component{
    constructor(props){
        super(props);
        this.state={
           txt:'',
           isPlay:false,
           isAudio:false,
           media:{},
           audio:{},
           isFlag:false,
        }
    }
    Input=(e)=>{
        this.setState({txt:e.target.value})
    }
    onurlSpeak=()=>{
         //var request=  new URLRequest();
        let url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);        // baidu
        // var url = "http://translate.google.cn/translate_tts?ie=UTF-8&tl=zh-CN&total=1&idx=0&textlen=19&prev=input&q=" + encodeURI(str); // google
            
        　　         //request.url = encodeURI(url);
                    // request.contentType = "audio/mp3"; // for baidu
                    //request.contentType = "audio/mpeg"; // for google
        
                　　let n = new Audio(url);
        
               　　 n.src = url;
        
               　　 n.play();
                　　console.log('播放成功')
               　　 // $("...").play();
                　　// var sound = new Sound(request);
                　　// sound.play();
    }
    onSpeak=()=>{
        if(!this.state.txt){
            message.warning('请输入中文或英文')
        }
        let msg = new SpeechSynthesisUtterance();
        console.log(msg)
        msg.text = this.state.txt;
        // msg.lang='en-US'//zh-CN
        msg.lang='zh-CN'
        msg.rate = 1 //播放语速0.1——10
        //msg.pitch = 1 音调高低0-2
        //msg.text = "播放文本"
        //msg.volume = 0.5 播放音量0-1
        speechSynthesis.speak(msg);
    }
    onStop=()=>{
        SpeechSynthesis.pause()
    }
    onVideo=()=>{


        let video = document.getElementById("video");
        //
        // let constraints = {
        //     video: {width: 500, height: 500},
        //     audio: true
        // };
        // let promise = window.navigator.mediaDevices.getUserMedia(constraints);
        // promise.then(function (MediaStream) {
        //     console.log(MediaStream)
        //     video.srcObject = MediaStream;
        //     video.play();
        // });
        let me = this;
        var media,audio;
        navigator.getUserMedia = navigator.getUserMedia ||navigator.webkitGetUserMedia ||navigator.mozGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({ audio: true, video: { width: 320, height: 320 } },
                    function(stream) {
                        media = typeof stream.stop === 'function' ? stream : stream.getTracks()[1];
                        audio = typeof stream.stop === 'function' ? stream : stream.getTracks()[0];
                        // video.src = (window.URL || window.webkitURL).createObjectURL(stream);
                        video.srcObject = stream;
                        video.play();
                        me.setState({media,audio})
                        // video.src = window.URL.createObjectURL(stream);
                        // video.onloadedmetadata = function(e) {
                        //     video.play();
                        // }; 
                    },
                    function(err) {
                        console.log(err.name);
                    }
            );
        } else {
            console.log("getUserMedia not supported");
        }
        

    }
    onStopVideo=()=>{
        let video = document.getElementById("video");
        if(video.paused){ //如果已暂停则播放
            video.play(); //播放控制
        }else{ // 已播放点击则暂停
            video.pause(); //暂停控制
        }
        this.setState({isPlay:!this.state.isPlay})
    }
    onStopAudio=()=>{
        let video = document.getElementById("video");
        if(video.muted){
            video.muted=false;//(是否静音：是)
        }else{
            video.muted=true;//(是否静音：是)
        }
        this.setState({isAudio:!this.state.isAudio})
    }
    onCloseVideo=()=>{
        const {media,audio} =this.state;
        console.log(this.state)
        media&&media.stop();
        audio&&audio.stop();
    }
    render(){
        const {isPlay,isAudio,isFlag} = this.state;
        return(
            <div id='data16'> 
                <div>
                    <TextArea style={{width:700}} placeholder={'请输入中文或英文'} rows={4} onChange={this.Input} />
                </div>
                <div style={{padding:'20px 0'}}>
                    <Button type='primary' onClick={this.onSpeak}>语音</Button>　
                    <Button type='primary' onClick={this.onVideo}>视频</Button>　
                    <Button type='primary' onClick={this.onCloseVideo}>关闭</Button>　
                    <Button type='primary' onClick={this.onStopVideo}>{isPlay?'暂停':'开启'}</Button>　
                    <Button type='primary' onClick={this.onStopAudio}>{isAudio?'静音':'音量'}</Button>
                </div>
                <video id="video" autoPlay></video>
                <div>
                    <Button onClick={()=>this.setState({isFlag:!this.state.isFlag})}>查看代码</Button>

<pre style={{display:isFlag?'block':'none'}}>{`
var video = document.getElementById("video");
var constraints = {
    video: {width: 500, height: 500},
    audio: true
};
var promise = window.navigator.mediaDevices.getUserMedia(constraints);
promise.then(function (MediaStream) {
    console.log(MediaStream)
    video.srcObject = MediaStream;
    video.play();
});

var me = this;
var media,audio;
navigator.getUserMedia = navigator.getUserMedia ||navigator.webkitGetUserMedia ||navigator.mozGetUserMedia;
if (navigator.getUserMedia) {
    navigator.getUserMedia(
        navigator.getUserMedia接收三个参数，
            1:视频，语音
            2，成功回调
            3，失败回调
        { audio: true, video: { width: 320, height: 320 } },
        function(stream) {
            media = typeof stream.stop === 'function' ? stream : stream.getTracks()[1];
            audio = typeof stream.stop === 'function' ? stream : stream.getTracks()[0];
            me.setState({media,audio})
            1，视频播放方法一
            video.srcObject = stream;
            video.play();
            2，视频播放方法二
            video.src = (window.URL || window.webkitURL).createObjectURL(stream);
            video.onloadedmetadata = function(e) {
                video.play();
            }; 
        },
        function(err) {
            console.log(err.name);
        }
    );
} else {
    console.log("getUserMedia not supported");
}

video.play()　　　　　      播放控制
video.pause()   　　　      暂停控制
video.muted=false　　　     是否静音：是
video.muted=true　　　　    是否静音：否
media.stop()               关闭视频
audio.stop()                关闭麦克风
`}</pre>   
                </div>
            </div>
    
        )
    }
}


