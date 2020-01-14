import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/color-picker.css';
import 'braft-extensions/dist/table.css';

import React from 'react';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import ColorPicker from 'braft-extensions/dist/color-picker';
import Table from 'braft-extensions/dist/table';
import './braftEditor.scss';

BraftEditor.use(ColorPicker({
    includeEditors: ['editor-with-color-picker'],
    theme: 'light',
}));
  
BraftEditor.use(Table({
    defaultColumns: 3, 
    defaultRows: 3, 
    withDropdown: false, 
}));

export default class Editor extends React.Component {
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
    componentDidUpdate(prevProps){
        console.log(this.props)
        if(prevProps.content !==  this.props.content) {
            this.setState({
                contentHTML: this.props.content,
                editorState: BraftEditor.createEditorState(unescape(this.props.content)),
            })
        }
      }
    componentDidMount () {
 
        let fn = this.throttle(this.handleHTML, 1000, 2000);
        this.setState({fn: fn});
    }
    handleHTML = (editorState) => { 
        let html = editorState.toHTML();
        let div = document.createElement('div');
        div.innerHTML = html;
        let table = div.querySelectorAll('table');
        for(let i = 0; i < table.length; i++) {
            table[i].border = '.5 solid #1c1c1c';
            table[i].style.width = '100%';
            table[i].cellSpacing = '0';
            
        }
        html = div.innerHTML;
        this.changeHandler(html);
        this.setState({
            contentHTML: html,
        });
    }
    changeHandler(html) {
        if (this.props.getContent) {
          this.props.getContent(html);
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

    render () {

        const { editorState } = this.state;
        const excludeControls = ['emoji', 'code', 'media'];
        console.log(this.state)

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
                // extendControls={extendControls}
                imageControls={imageControls}
                imageResizable={false}
                // readOnly={this.props.disabled?true:false}
            />
            </div>
        </div>
        );

    }

}