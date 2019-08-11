import React, { Component } from 'react';
import Editor from 'wangeditor';
import './editor.less'
import { connect } from 'react-redux';
import { setEditorContent} from '../../../redux-root/action/upload/editor';
import ServiceApi, { UploadUrl ,PictrueUrl,ChooseUrl,FileUrl,API_FILE_VIEW_INNER} from '../../content/apiprefix';
// const masterUrl = 'http://10.110.200.62:9080/';
import {uploadService} from '../../content/myFetch';
var uploadPicture
// if(ChooseUrl==1){
//   uploadPicture = UploadUrl+'/activity';
// }else{
//   uploadPicture = FileUrl+'/activity'; 
// }

if(ChooseUrl==1){
  uploadPicture = UploadUrl +'/news';
}else{
  uploadPicture = FileUrl; 
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
        this.changeHandler(html)
        this.props.setEditorData(html);
        this.props.getContent&&this.props.getContent(html);
      }
    };
    editor.customConfig.onblur =  (html) =>{
      // html 即编辑器中的内容
      console.log('onblur', html);
      if (html === '<p><br></p>') {
        this.props.setEditorData('');
        this.props.getContent&&this.props.getContent('');
      }else{
        this.props.setEditorData(html);
        this.props.getContent&&this.props.getContent(html);
      }
    };
    editor.customConfig.debug = true;
    editor.customConfig.showLinkImg = false;
    editor.customConfig.zIndex = 1;
    
    editor.customConfig.customUploadImg = (files, insert) => {
      uploadService(uploadPicture, files, callback => {
        if (callback.sucess) {
          console.log('callback',callback);
          if(ChooseUrl==1){
            insert(PictrueUrl + callback.entity[0].filePath);
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
    return <div className="editor-main" id="htmlContent" style={{width:'70%',height:'70%'}}/>;
  }
}