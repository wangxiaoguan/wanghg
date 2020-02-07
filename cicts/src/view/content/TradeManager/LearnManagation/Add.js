import React, { Component } from 'react';
import { Tabs, Form, Cascader, Message ,Icon, Divider,Spin,Popconfirm,message } from 'antd';
// import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import NewEventAndInfoAdd from '../../../component/EventAndInfoAdd/NewEventAndInfoAdd';
import {postService,getService} from '../../myFetch';
import API_PREFIX  from '../../apiprefix';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';

export default class Add extends Component{
    constructor(props){
        super(props);
        this.state={
            update:0,
            categoryIdList:[],
            steps:[
                {
                    title:'填写学习信息',
                    content:[
                        { key: 'title',label:'学习名称',type:'input',required:true,max:50},
                        { key: 'titleImage',label:'标题图片',type:'uploadPicture_drop',required: true,isIamge:true},
                        { key: 'categoryIdList', label: '所属栏目', type: 'columnTree',required: true},
                        { key: 'isRequired', label: '是否必修', type: 'unionlearn', option: [{key:1,  value:'选修' },{key:2,  value:'必修' }], required: true},
                        { key: 'orgType', label: '资讯归属', type: 'LearnManagationAdd', required: true,option:[{ label: '按工会组织归属', value: 1 }]},
                        { key: 'content', label: '学习内容', type: 'richText',required: true},
                        { key: 'video', label: '视频地址', type: 'videoLearn'},
                        { key: 'url' },
                        { key: 'desp' },
                        { key: 'videoLong' },
                        { key: 'orgId' },
                        { key: 'studyTime', label: '学习时长',type: 'inputNumber1'},
                        { key: 'newsAttachs', label: '学习附件', type: 'filePicture', describe:false,isAttach:true,datatype:'partylearn'},
                        { key: 'isTimePublish', label: '是否定时发送', type: 'isTimePublish', required: true },
                    ],
                    url: 'services/web/union/studyManage/addUnionStudy',
                    updateUrl: 'services/web/union/studyManage/updateUnionStudy',
                },
                {
                    title:'选择发布范围',
                    content:'',
                    url:'services/web/auth/authdata/updAuthData',
                },
            ],
        };
    }
    componentDidMount(){
        getService(API_PREFIX+'services/web/union/studyManage/getUnionCategoryList?Q=categoryState=1',data=>{
            if(data.status === 1){
                let temp= [...this.state.steps];
                this.DealColumn(data.root.object)
                temp[0].content[2].option = data.root.object
                this.setState({categoryIdList:data.root.object})
                this.setState({steps:temp,update:this.state.update+1});
            }
        })
    }
    DealColumn = data => {
        data.map(item=>{
            item.key = item.id;
            item.value = item.name;
        })
    }
    render(){
        return(
            <div>
                <NewEventAndInfoAdd
                  update={this.state.update}
                  type="information"
                  steps={this.state.steps}
                  submitText="保存并发布"
                  style="add"
                  save="/TradeManager/LearnManagation/List"
                  belonged="article"
                  belongedType='unionLearn'
                  partyReturn='back'
                  addlearnType="addlearnTimePush"  
                />
            </div>
        );
    }
}