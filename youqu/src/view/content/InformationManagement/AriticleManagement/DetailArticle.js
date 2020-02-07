import React, { Component } from 'react';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import { Tabs,Select,Button,message, Table,Input,Modal,Form,Radio,Cascader} from 'antd';
import {GetQueryString,getService} from '../../myFetch';
import ServiceApi from '../../apiprefix';
class DetailArticle extends  Component{
  constructor(props){
    super(props);
    this.state={
      newsId:GetQueryString(location.hash,['newsId']).newsId,//获取前一个页面传过来的id
      newsData:{},//详情中的数据
      set:function(){},
      partyRootId:'',
      dpRootId:'',
      update:0,
      //三个步骤对象
      steps:[
        {
          title:'填写文章信息',
          content:[
            { key: 'type', label: '文章类型', type: 'information_type', option: [], required: true},
            { key: 'title', label: '文章标题', type: 'input', required: true },
            { key: 'digest', label: '文章摘要', type: 'input' },
            { key: 'author', label: '作者', type: 'input' },
            { key: 'orgId', label: '文章归属', type: 'belong', required: true},
            { key: 'layout', label: '布局形式', type: 'radioButton', option:PicLayoutOption ,required: true ,hide:['1','4','5','10']},
            { key: 'layout', label: '布局形式', type: 'radioButton', option:layoutOption ,required: true ,hide:['4','10','2']},
            { key: 'titleimage', label: '标题图片', type: 'uploadPicture_drop',required: true,isIamge:true},
            { key: 'picUrl', label: '内容图片', type: 'uploadPicture_button',describe:true,hide:['4','10'],isIamge:true},
            { key: 'isatlas', label: '是否设置为图集', type: 'radioButton', option:atlasOption ,required: true },
            { key: 'imagetype', label: '图片类型', type: 'radioButton', option:imageTypeOp },
            { key: 'content', label: '文章内容', type: 'richText',hide:['2','4','10'],required: true}, //rich text
            {  label: '关联类型测试', type: 'relation',hide:['2']},
            { key: 'fileUrl', label: '上传附件', type: 'uploadPicture_button', describe:false,hide:['2'],isAttach:true},
            {key:'belongOrgType'},
            {key:'relationAddress'},
            {key:'relationType'},
            {key:'orgid'},
          ],
          data:{},
        },
        {
          title:'选择发布范围',
          content:'',
          data:{}
        },
        {
          title:'其他设置',
          content:[
            { key: 'point',             label: '验值数',        type: 'inputNumber' },
            { key: 'treasureProvider',  label: '积分提供方',    type: 'cascader',     options:[]},
            { key: 'isrequired',        label: '是否必修',      type: 'radioButton',  option: isOrNotOption, required: true },
            { key: 'istimepush',        label: '是否发送',      type: 'isTimePush',   required: true },
          ],
          data:{}
        },
      ],
    }
  }
  componentDidMount(){
 
  }
  
  render(){
    return(
        <div>
            <EventAndInfoAdd
                key={this.state.update}
                type="information"
                steps={this.state.steps}
                style="detail"
                id={{ id:this.state.newsId}}
                save="/InformationManagement/Article"
                belonged="article"
                partyRootId={this.state.partyRootId}
                dpRootId={this.state.dpRootId}
            >
            </EventAndInfoAdd>
        </div>
    );
  }

}
//布局形式——图片
const PicLayoutOption = [
  { label: '左右', value: 1 },
  { label: '上下', value: 2 },
  { label: '三张图片一次排开', value: 3 },
];
//布局形式——非图片
const layoutOption = [
  { label: '左右', value: 1 },
  { label: '上下', value: 2 },

];
//图片类型
const imageTypeOp=[
  { label: '大横幅', value: 1 },
  { label: '小横幅', value: 2},
];
//是否设置为图集
const atlasOption=[
  { label: '是', value: true },
  { label: '否', value: false },
]
const isOrNotOption=[
  { label: '是', value: true },
  { label: '否', value: false },
];

export default DetailArticle;