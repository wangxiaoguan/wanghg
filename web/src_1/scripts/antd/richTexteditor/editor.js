import React, { Component } from 'react';
import Editor from 'wangeditor';
import './editor.less'
import { connect } from 'react-redux';






let editor = '';

export default class RichEditor extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      initialValue: this.props.initialValue,
      // flowData: this.props.flowData,
      // leaveData:this.props.leaveData,
    };
  }
  componentDidUpdate(){
    if (this.props.initialValue !== this.state.initialValue) {
      console.log('this.props.initialValue', this.props.initialValue, this.state.initialValue);
      editor.txt.html(this.props.initialValue);
      this.setState({ initialValue: this.props.initialValue});
      
    }
  }
  changeHandler(html) {
    // if (this.props.onchange) {
    //   this.props.onchange(html);
    // }
  }
  componentDidMount() {
    const {initialValue} = this.props;
    let defaultValue = initialValue;
    const elem = document.getElementById('htmlContent');
    editor = new Editor(elem);
    console.log(editor)
    editor.txt='22222'
    editor.customConfig.onchange = html => {
      this.props.onValueChange(html)
      // console.log('内容', html);
      // console.log('props==>',this.props)
      // this.props.wordCount(html);//字数120--1分钟 
      if (html === '<p><br></p>') {
        this.changeHandler('')
       
        // this.props.getContent&&this.props.getContent('');
      }else{
        this.changeHandler(html)
        
        // this.props.getContent&&this.props.getContent(html);
      }
    };
    editor.customConfig.onblur =  (html) =>{
      // html 即编辑器中的内容
      console.log('onblur', html);
      if (html === '<p><br></p>') {
        
        // this.props.getContent&&this.props.getContent('');
      }else{
      
        // this.props.getContent&&this.props.getContent(html);
      }
    };
    editor.customConfig.debug = false;//样式复制
    editor.customConfig.showLinkImg = false;
    editor.customConfig.zIndex = 1;
    
   
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
    // editor.$textElem.attr('contenteditable', );
    //编辑初始化编辑器内容
    // if(this.props.detail){
    //   editor.txt.html(this.props.detail);
    // }
    // console.log('richinit',this.props.initialValue);
    // console.log('richflow',this.props.flowData);
    // console.log('richleave',this.props.leaveData);
  }
    

  render() {
    return <div className="editor-main" id="htmlContent" style={{width:'100%',height:'100%'}}/>;
  }
}