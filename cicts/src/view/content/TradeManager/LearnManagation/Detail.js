import React, { Component } from 'react';
import { Tabs, Form, Cascader, Message ,Icon, Divider,Spin,Popconfirm } from 'antd';
// import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import NewEventAndInfoAdd from '../../../component/EventAndInfoAdd/NewEventAndInfoAdd';
import {GetQueryString,getService,postService} from '../../myFetch';
import API_PREFIX  from '../../apiprefix';

export default class Detail extends Component{
    constructor(props){
        super(props);
        let param = this.props.location.search.replace('?','').split('&');
        let activeKey = param[1] && Number(decodeURIComponent(param[1].split('=')[1])) || '0';
        this.state={
            newsId:GetQueryString(location.hash,['id']).id,//获取前一个页面传过来的id
            update:0,
            activeKey:String(activeKey),
            steps:[
                {
                    title:'填写学习信息',
                    content:[
                        { key: 'title',label:'学习名称',type:'input',required:true,max:50},//学习名称
                        { key: 'titleImage',label:'标题图片',type:'uploadPicture_drop',required: true,isIamge:true},//标题图片
                        { key: 'categoryIdList', label: '所属栏目', type: 'columnTree',required: true},
                        { key: 'isRequired', label: '是否必修', type: 'unionlearn', option: [{key:1,  value:'选修' },{key:2,  value:'必修' }], required: true},//是否必修
                        { key: 'orgType', label: '资讯归属', type: 'LearnManagationAdd', required: true,option:[{ label: '按工会组织归属', value: 1 }]},//资讯归属
                        { key: 'content', label: '学习内容', type: 'richText',required: true}, //学习内容
                        { key: 'video', label: '视频地址', type: 'videoLearn'},
                        { key: 'url' },
                        { key: 'desp' },
                        { key: 'videoLong' },
                        { key: 'orgId' },
                        { key: 'studyTime', label: '学习时长',type: 'inputNumber1'},
                        { key: 'newsAttachs', label: '学习附件', type: 'filePicture', describe:false,isAttach:true,datatype:'partylearn'},
                        { key: 'isTimePublish', label: '是否定时发送', type: 'isTimePublish', required: true },
                    ],
                    data:{},
                },
                {
                    title:'选择发布范围',
                    content:'',
                    data:{},
                },
            ],
        };
    }

    componentDidMount(){
        let temp= [...this.state.steps];
        Promise.all([this.getData(),this.getAuth(),this.getColumn()]).then(data=>{
            let allData = {...data[0],...data[1]};
            if(allData.contentImage.length){
                allData['desp'] = allData.contentImage[0].desp;
                allData['videoLong'] = allData.contentImage[0].videoLong;
            }else{
                allData['desp'] = '';
                allData['videoLong'] = '';
            }
            allData['categoryId'] = allData['categoryIdList'][0]
            temp[0].data = allData; 
            temp[1].data = allData; 
            temp[0].content[2].option = data[2];
            this.setState({steps:temp,update:this.state.update+1});
        })
    }
    
    getData = () =>{
        return new Promise((pass,fail)=>{
            getService(API_PREFIX+`services/web/union/studyManage/getUnionStudyDetail/${this.state.newsId}`,data=>{
                if(data.status===1){
                    pass(data.root.object)
                }
            })
        })
    }

    getAuth = () => {
        return new Promise((pass,fail)=>{
            postService(API_PREFIX+`services/web/auth/authdata/getAllByDataId/${this.state.newsId}`,{},data=>{
                if(data.status===1){
                    pass(data.root.object)
                }
            })
        })
    }

    getColumn = () =>{
        return new Promise((pass,fail)=>{
            getService(API_PREFIX+`services/web/union/studyManage/getUnionCategoryList?Q=categoryState=1`,data=>{
                if(data.status===1){
                    this.DealColumn(data.root.object)
                    pass(data.root.object)
                }
            })
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
                    key={this.state.update}
                    type="information"
                    steps={this.state.steps}
                    style="detail"
                    id={{ id:this.state.newsId}}
                    save={`/TradeManager/LearnManagation/List?id=${this.state.activeKey}`}
                    belonged="article"
                    belongedType='unionLearn'
                />
            </div>
        );
    }
}