import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/color-picker.css';
import 'braft-extensions/dist/table.css';

import React from 'react';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import ColorPicker from 'braft-extensions/dist/color-picker';
import Table from 'braft-extensions/dist/table';
import { connect } from 'react-redux';
import { setEditorContent} from '../../../redux-root/action/upload/editor';
import API_PREFIX, { API_FILE_UPLOAD ,API_FILE_VIEW,API_CHOOSE_SERVICE,API_FILE_UPLOAD_INNER,API_FILE_VIEW_INNER} from '../../content/apiprefix';
// const masterUrl = 'http://10.110.200.62:9080/';
import {uploadService} from '../../content/myFetch';
import { Upload, Icon, Message } from 'antd';
import './braftEditor.less';

BraftEditor.use(ColorPicker({
    includeEditors: ['editor-with-color-picker'],
    theme: 'light', // 支持dark和light两种主题，默认为dark
}));
  
BraftEditor.use(Table({
    defaultColumns: 3, // 默认列数
    defaultRows: 3, // 默认行数
    withDropdown: false, // 插入表格前是否弹出下拉菜单
    // exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
}));

@connect(
    state => ({
      editorData: state.editor.editorData,
    }),
    dispatch => ({
      setEditorData: n => dispatch(setEditorContent(n)),
    })
)

export default class editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          initialValue: this.props.initialValue,
          flowData: this.props.flowData,
          leaveData:this.props.leaveData,
          editorState: BraftEditor.createEditorState(''), // 设置编辑器初始内容
          uploadPicture: '',
          contentHTML: '',
          readOnly: false,
        };
    }
    componentDidUpdate(){
        if (this.props.initialValue !== this.state.initialValue) {
            this.setState({ 
                initialValue: this.props.initialValue,
                editorState: BraftEditor.createEditorState(this.props.initialValue), // 设置编辑器内容
                contentHTML: this.props.initialValue,
            });
          
        } else if (this.props.flowData !== this.state.flowData) {
          this.setState({
               flowData: this.props.flowData ,
               editorState: BraftEditor.createEditorState(this.props.flowData), // 设置编辑器内容
               contentHTML: this.props.flowData,
            });
        } else if (this.props.leaveData !== this.state.leaveData) {
          this.setState({
               leaveData: this.props.leaveData,
               editorState: BraftEditor.createEditorState(this.props.leaveData), // 设置编辑器内容
               contentHTML: this.props.leaveData,
            });
        }
        {/*
        
        editor.customConfig.pasteTextHandle = (content) => {
        }
        */}
      }
    componentDidMount () {
        const { flowData, initialValue, leaveData } = this.props;
        let defaultValue = initialValue ? initialValue : flowData ? flowData : leaveData ? leaveData : '';
        if(API_CHOOSE_SERVICE==1){
            if(this.props.modal=='event'){
              this.setState({
                  uploadPicture:API_FILE_UPLOAD + '/activity',
              });
            }else{
                this.setState({
                    uploadPicture:API_FILE_UPLOAD + '/news',
                });
            }
          }else{
            if(this.props.modal=='event'){
              this.setState({
                  uploadPicture:API_FILE_UPLOAD_INNER,
              });
            }else{
              this.setState({
                  uploadPicture:API_FILE_UPLOAD_INNER ,
              });
            }
          }
        this.setState({
            editorState: BraftEditor.createEditorState(defaultValue), // 设置编辑器初始内容
            contentHTML: defaultValue,
        });
        if(this.props.detail){
            this.setState({
                editorState: BraftEditor.createEditorState(this.props.detail), // 设置编辑器初始内容
                contentHTML: defaultValue,
            });
        }
        let fn = this.throttle(this.handleHTML, 1000, 2000);
        this.setState({fn: fn});
    }
    handleHTML = (editorState) => { //处理编辑器内容中的图片，在外层包裹一层a标签
        let html = editorState.toHTML();
        // let reg = /(<\s*img\s+src="\s*(.*?)\s*"\s*\/?\s*>)/g
        html = html.replace(/((\<\s*a[^\>]*\>)(\<\s*img.*?\>))/g, '$3'); //编辑时先清除img外面包裹的a标签
        html = html.replace(/(<\s*img[^\>]*\>)(\<\/a\>)/g, '$1');
        html = html.replace(/(<\s*img.*?src="\s*(.*?)\s*".*?>)/g,  '<a style="display:inline-block" target="_blank" href="$2">$1</a>'); //给img标签外面包裹一个a标签
        html = html.replace(/(<\s*img)(.*?>)/g, '$1 style="max-width:100%;" $2');
        let div = document.createElement('div');
        div.innerHTML = html;
        let table = div.querySelectorAll('table');
        for(let i = 0; i < table.length; i++) {
            // table[i].style.border = '1px solid #c5c5c5'
            table[i].border = '.5 solid #1c1c1c';
            table[i].style.width = '100%';
            table[i].cellSpacing = '0';
            // let td = table[i].querySelectorAll('td')
            // for(var j = 0; j < td.length; j++) {
            //     td[j].style.border = '1px solid #c5c5c5'
            //     td[j].style.textAlign = 'center'
            // }
        }
        html = div.innerHTML;
        if (html === '<p></p>') {
            this.changeHandler('');
            this.props.setEditorData('');
            this.props.getContent&&this.props.getContent('');
        }else{
            this.changeHandler(html);
            this.props.setEditorData(html);
            this.props.getContent&&this.props.getContent(html);
        }
        this.setState({
            contentHTML: html,
        });
    }
    changeHandler(html) {
        if (this.props.onchange) {
          this.props.onchange(html);
        }
    }
    handleChange = (editorState) => { //编辑器内值改变触发的函数
        this.state.fn(editorState); 
        this.setState({
            editorState: editorState,
        });
    }
    throttle = (method, delay, time) => { //编辑器内值改变时的节流函数
        let timeout,startTime = +new Date();
        return function(args) {
            let curTime = +new Date();
            clearTimeout(timeout);
            // 如果达到了规定的触发时间间隔，触发 handler
            if (curTime - startTime >= time) {
                method(args);
                startTime = curTime;
            } else {
                // 没达到触发间隔，重新设定定时器
                timeout = setTimeout(() => method(args), delay);
            }
        };
    }
    beforeUpload = (file) => {
        const isPic=file.type === 'image/jpeg'||file.type === 'image/png'||file.type === 'image/bmp'||file.type === 'image/gif';
        if (!isPic) {
            Message.error('仅支持上传JPG/JPEG/PNG/GIF格式图片!');
            return false;
        }
    }
    uploadHandler = info => { // 插入图片上传到服务器
        console.log('呵呵呵呵呵呵呵呵和呵呵呵呵呵呵呵',info);
        // if(info.file.size>1024*1024*2){
        //   Message.error('图片大小不得超过2M');
        //   return;
        // }
        const status = info.file.status;
        let fileList = [...info.fileList];
        if(this.props.RadioValue!==3){
          fileList = fileList.slice(-1);
        }
        this.setState({ uploadTitleList: fileList });
        if (!status) {
          fileList.slice(0);
          fileList.splice(fileList.length-1,1);
          this.setState({ uploadTitleList: fileList });
        }
        if (status === 'uploading') {
          if (info.file.response === '') {
            Message.error('请检查接口状态！');
          }
        }
        if (status === 'removed') {
          delete uploadTitleList[0];
          let content = [...uploadTitleList];
          this.props.setUploadPicture({[this.props.keys]: fileList});
        }
        if (status === 'done') {
          if (info.file.response!=='') {
            Message.success(`${info.file.name}上传成功。`);
            let ossViewPath = sessionStorage.getItem('ossViewPath') || API_FILE_VIEW
            let imgSrc = '';
            if(API_CHOOSE_SERVICE==1){
                imgSrc = ossViewPath + info.file.response.root.object[0].filePath;
              }else{
                imgSrc = API_FILE_VIEW_INNER + info.file.response.root.object[0].filePath;
              }
            this.setState({
                editorState: ContentUtils.insertMedias(this.state.editorState, [{
                  type: 'IMAGE',
                  url: imgSrc,
                }]),
              });
          }else{
            Message.error('请检查接口状态！');
            this.setState({ uploadTitleList: [] });
          }
        } else if (status === 'error') {
          Message.error(`${info.file.name} 上传失败。`);
        }
    }
    showPreview = () => { //预览点击时modal中加入html
        setTimeout(() => {
            // document.getElementById('previewContent').innerHTML = this.state.editorState.toHTML()
            document.getElementById('editor-previewContent').innerHTML = this.state.contentHTML;
        }, 500);
        
    }
    render () {

        const { editorState } = this.state;
        const excludeControls = ['emoji', 'code', 'media'];
        const extendControls = [
            {
              key: 'antd-uploader',
              type: 'component',
              component: (
                <Upload
                    accept="image/*"
                    showUploadList={false}
                    action={this.state.uploadPicture}
                    // customRequest={this.uploadHandler}
                    beforeUpload={this.beforeUpload}
                    onChange={this.uploadHandler}
                >
                  {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                  <button type="button" className="control-item button upload-button" data-title="插入图片">
                    <Icon type="picture" theme="filled" />
                  </button>
                </Upload>
              ),
            },
            {
                key: 'custom-modal',
                type: 'modal',
                text: '预览',
                onClick: this.showPreview,
                modal: {
                  id: 'preview',
                  showCancel: false,
                  showConfirm: true,
                  confirmable: true,
                //   title: '预览',
                  children: (
                    <div id='editor-previewContent' style={{width: 375,height:580, padding: '0 10px'}}>
                      {/* {this.state.editorState.toHTML()} */}
                    </div>
                  ),
                },
            },
          ];
        const imageControls = [
            'float-left',
            'float-right',
            'align-left', // 设置图片居左
            'align-center', // 设置图片居中
            'align-right', // 设置图片居右
            // 'size',
            'remove',
        ];
        return (
        <div>
            <div className="editor-wrapper" style={{border: '1px solid #ccc'}}>
            <BraftEditor
                id="editor-with-color-picker"
                value={editorState}
                onChange={this.handleChange}
                excludeControls={excludeControls}
                extendControls={extendControls}
                imageControls={imageControls}
                imageResizable={false}
                readOnly={this.props.disabled?true:false}
            />
            </div>
        </div>
        );

    }

}