import React, { Component } from 'react';
import Editor from 'wangeditor';
import './editor.less'
import { connect } from 'react-redux';
import { setEditorContent} from '../../../redux-root/action/upload/editor';
import API_PREFIX, { API_FILE_UPLOAD ,API_FILE_VIEW,API_CHOOSE_SERVICE,API_FILE_UPLOAD_INNER,API_FILE_VIEW_INNER} from '../../content/apiprefix';
// const masterUrl = 'http://10.110.200.62:9080/';
import {uploadService} from '../../content/myFetch';
var uploadPicture
// if(API_CHOOSE_SERVICE==1){
//   uploadPicture = API_FILE_UPLOAD+'/activity';
// }else{
//   uploadPicture = API_FILE_UPLOAD_INNER+'/activity'; 
// }

if(API_CHOOSE_SERVICE==1){
  uploadPicture = API_FILE_UPLOAD +'/news';
}else{
  uploadPicture = API_FILE_UPLOAD_INNER; 
}

let editor = '';
@connect(
  state => ({
    editorData: state.editor.editorData,
  }),
  dispatch => ({
    setEditorData: n => dispatch(setEditorContent(n)),
  })
)
export default class RichEditor extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      initialValue: this.props.initialValue,
      flowData: this.props.flowData,
      leaveData:this.props.leaveData,
    };
  }
  componentDidUpdate(){
    if (this.props.initialValue !== this.state.initialValue) {
      console.log('this.props.initialValue', this.props.initialValue, this.state.initialValue);
      editor.txt.html(this.props.initialValue);
      this.setState({ initialValue: this.props.initialValue});
      
    } else if (this.props.flowData !== this.state.flowData) {
      editor.txt.html(this.props.flowData);
      this.setState({ flowData: this.props.flowData });
    } else if (this.props.leaveData !== this.state.leaveData) {
      editor.txt.html(this.props.leaveData);
      this.setState({ leaveData: this.props.leaveData });
    }
    {/*
    
    editor.customConfig.pasteTextHandle = (content) => {
      console.log('富文本编辑器内容===================================',content)
    }
    */}
  }
  changeHandler(html) {
    if (this.props.onchange) {
      this.props.onchange(html);
    }
  }
  componentDidMount() {
    const { flowData, initialValue, leaveData } = this.props;
    let defaultValue = initialValue ? initialValue : flowData ? flowData : leaveData ? leaveData : null;
    const elem = document.getElementById('htmlContent');
    editor = new Editor(elem);
    editor.customConfig.onchange = html => {
      console.log('内容', html);
      console.log('props==>',this.props)
      this.props.wordCount(html);//字数120--1分钟 
      if (html === '<p><br></p>') {
        this.changeHandler('')
        this.props.setEditorData('');
        this.props.getContent&&this.props.getContent('');
      }else{
        //   html = html.replace(/\<p style="line-height: 2;"/img, '<p')
        //   html = html.replace(/\<p/img, '<p style="line-height: 2;"')
        let div = document.createElement('div')
        div.innerHTML = html
        let p = div.querySelectorAll('p')
        for(var i = 0; i < p.length; i++) {
            p[i].style.lineHeight = 2
        }
        html = div.innerHTML

          console.log('处理后的内容', html)
        this.changeHandler(html)
        this.props.setEditorData(html);
        this.props.getContent&&this.props.getContent(html);
      }
    };
    editor.customConfig.pasteTextHandle = (html) => {
      var msg=html.replace(/(<\/?font.*?>)|(<\/?span.*?>)/g, '');
          msg = msg.replace(/(<\/?i.*?>)|(<\/?h1.*?>)|(<\/?h2.*?>)|(<\/?h3.*?>)|(<\/?h4.*?>)|(<\/?h5.*?>)|(<\/?h6.*?>)|(<\/?b.*?>)|(<\/?u.*?>)/g, '');
          msg = msg.replace(/<s>/img,'')
          msg = msg.replace(/<\/s>/img,'')
      return msg
    }
    editor.customConfig.onblur =  (html) =>{
      // html 即编辑器中的内容
      // console.log('onblur', html);
      // if (html === '<p><br></p>') {
      //   this.props.setEditorData('');
      //   this.props.getContent&&this.props.getContent('');
      // }else{
      //   this.props.setEditorData(html);
      //   this.props.getContent&&this.props.getContent(html);
      // }
    };
    editor.customConfig.debug = true;
    editor.customConfig.showLinkImg = false;
    editor.customConfig.zIndex = 1;
    
    editor.customConfig.customUploadImg = (files, insert) => {
      uploadService(uploadPicture, files, callback => {
        if (callback.sucess) {
          console.log('callback',callback);
          let ossViewPath = sessionStorage.getItem('ossViewPath') || API_FILE_VIEW
          if(API_CHOOSE_SERVICE==1){
            insert(ossViewPath + callback.entity[0].filePath);
          }else{
            insert(API_FILE_VIEW_INNER + callback.entity[0].filePath);
          }
          /*   callback.entity.map((item) => {
             console.log('url', masterUrl + item.filePath);*/
          
          /*});*/
        }
      });
    };
    editor.customConfig.menus = [
      'fontName',
      'fontSize',
      'head',
      'bold',
      'italic',
      'underline',
      'strikeThrough',
      'foreColor',
      'backColor',
      'link',
      'list',
      'justify',
      'quote',
      'image',
      'table',
      'undo',
      'redo',
    ]; // 字体 // 字号 // 标题 // 粗体 // 斜体 // 下划线 // 删除线 // 文字颜色 // 背景颜色 // 插入链接 // 列表 // 对齐方式 // 引用 // 插入图片 // 表格 // 插入视频 // 撤销 // 重复
    editor.create();
    editor.txt.html(defaultValue);
    editor.$textElem.attr('contenteditable', this.props.disabled?false:true);
    //编辑初始化编辑器内容
    if(this.props.detail){
      editor.txt.html(this.props.detail);
    }
    console.log('richinit',this.props.initialValue);
    console.log('richflow',this.props.flowData);
    console.log('richleave',this.props.leaveData);
  }
    
  //编辑的时候置空拿不到值
  /* componentWillUnmount(){
    this.props.setEditorData('');
  }*/
  render() {
    return <div>
        <div className="editor-main" id="htmlContent" style={{width:'70%',height:'70%'}}/>
        <span style={{color:'red'}}>编辑器暂只支持谷歌浏览器！</span>
    </div>
    
  }



  
}