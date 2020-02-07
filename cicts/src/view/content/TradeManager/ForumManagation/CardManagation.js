import React, { Component } from 'react';
import { connect } from 'react-redux';
import { message,Divider,Popconfirm,Modal,Row,Col } from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import API_PREFIX, {API_FILE_VIEW} from '../../apiprefix';
import { getService, postService } from '../../myFetch';
import {BEGIN} from '../../../../redux-root/action/table/table';
import Zmage from 'react-zmage';
import './addstyle.less';

@connect(
    state => ({ 
        powers: state.powers,
        pageData:state.table.pageData,
     }),
     dispatch=>({
        getData: n => dispatch(BEGIN(n)),
     })
)


export default class CommonBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            themeOption: [], //所属主题下拉框数据
            visibleDetail:false,
            detailId:'',
            statusOption:[{key:1,value:'上线中'},{key:0,value:'已下线'},{key:'',value:'全部'}],
            ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW, //根据登陆人员来获取oss地址
        };
    }

    componentDidMount(){
        getService(API_PREFIX+'services/web/bbs/topic/getTopicList',data=>{
            if(data.status===1){
                let topicList=[];
                topicList=data.root.object;
                this.topicList(topicList);
                this.setState({themeOption:topicList});
            }else{
                message.error(data.errorMsg);
            }
        });
    }

    topicList(data){
        let topicListAll={id:'',name:'全部'};//前端新增一个全部字段
        data.unshift(topicListAll);
       }
    //置顶
    setTop = (record) => {
        postService(API_PREFIX+`services/web/bbs/post/updateTopStatus/${record.id}`,{},data=>{
            if(data.status===1){
                message.success('主题置顶成功');
                this.props.getData(API_PREFIX+`services/web/bbs/post/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            }else{
                message.error(data.errorMsg);
            }
        });
    }

    //取消置顶
    cancelTop=(record)=>{
        postService(API_PREFIX+`services/web/bbs/post/cancelTopStatus/${record.id}`,{},data=>{
            if(data.status===1){
                message.success('取消主题置顶成功');
                this.props.getData(API_PREFIX+`services/web/bbs/post/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            }else{
                message.error(data.errorMsg);
            }
        });
    }
    //取消
    cancel = () => {
        this.setState({visible:false});
    }
    //删除
    delete = (record) => {
        let body=[record.id];
        postService(API_PREFIX+`services/web/bbs/post/delete`,body,data=>{
            if(data.status===1){
                message.success('删除成功');
                this.props.getData(API_PREFIX+`services/web/bbs/post/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            }else{
                message.error(data.errorMsg);
            }
        });
    }
    //详情,点击弹出弹框
    cardDetail=(record)=>{
        this.setState({detailId:record.id},()=>{
            this.setState({visibleDetail:true});
        });
    }
    //弹框确定
    onOk=()=>{
        this.setState({visibleDetail:false});
    }
    //弹框取消
    hideModal=()=>{
        this.setState({visibleDetail:false});
    }
    isSetHomeTop = (record) => {
        let path = API_PREFIX + `services/web/bbs/post/${record.isHomeTop ? 'cancelHomeTopStatus' : 'updateHomeTopStatus'}/${record.id}`
        postService(path, null, res => {
            if(res.status === 1) {
                message.success(record.isHomeTop ? '取消首页置顶成功' : '首页置顶成功')
                this.props.getData(API_PREFIX+`services/web/bbs/post/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            }else {
                message.error(res.errorMsg)
            }
        })
    }
    render() {
        const { powers = {} } = this.props;
        const { themeOption,statusOption } = this.state;
        let readPowers = powers && powers['20007.21701.003'];//查询
        let deletePowers=powers && powers['20007.21701.004'];//删除
        let setTopPowers=powers && powers['20007.21701.310'];//置顶
        let cancelTopPowers=powers && powers['20007.21701.311'];//取消置顶
        let hasOnline = powers && powers['20007.21701.313'];//上线
        let hasOffline =powers && powers['20007.21701.312'];//下线
        const columns = [
            {
                title: '用户姓名',
                dataIndex: 'createUserName',
                key: 'createUserName',
            },
            {
                title: '主题',
                dataIndex: 'topicName',
                key: 'topicName',
            },
            {
                title: '帖子内容',
                dataIndex: 'content',
                key: 'content',
                render: (text, record) => {
                    let imageUrl = record.images
                    let content = record.content
                    if(content && content.length > 20) {
                        content = `${content.substr(0, 20)}...`
                    }
                    if(imageUrl&&imageUrl.length>0){
                        let images = imageUrl.split(',')
                        return <div>{content}
                            {images.map(item => {
                                return <img src={this.state.ossViewPath + item} style={{width:'30px'}} />
                            })}
                        </div>
                        
                    }else{
                        return <div>{content}</div>
                    }
                },
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width:100,
                render:(_,record)=>{
                    return <span>{record.status?'上线中':'已下线'}</span>
                }
            },
            {
                title: '评论数',
                dataIndex: 'commentCount',
                key: 'commentCount',
            },
            {
                title: '创建时间',
                dataIndex: 'createDate',
                key: 'createDate',
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                render:(text, record)=> (
                        <div>
                        <span><a style={{display:readPowers?'inline-block':'none'}} onClick={()=>this.cardDetail(record)}>详情</a></span>
                        <Divider type="vertical"/>
                        <span>
                            {
                                record.isTop===false?(
                                    <a style={{display:setTopPowers?'inline-block':'none'}} className='operation' onClick={() => this.setTop(record)}>主题置顶</a>
                                ):(
                                    <a style={{display:cancelTopPowers?'inline-block':'none'}} className='operation' onClick={() => this.cancelTop(record)}>取消主题置顶</a>
                                )
                            }
                        </span>
                        <Divider type="vertical"/>
                        <span>
                            {
                                record.isHomeTop===false?(
                                    <a style={{display:setTopPowers?'inline-block':'none'}} className='operation' onClick={() => this.isSetHomeTop(record)}>首页置顶</a>
                                ):(
                                    <a style={{display:cancelTopPowers?'inline-block':'none'}} className='operation' onClick={() => this.isSetHomeTop(record)}>取消首页置顶</a>
                                )
                            }
                        </span>
                        {/* <Divider type="vertical"/>
                        <Popconfirm title="确定删除所选项吗？" onConfirm={() => this.delete(record)} okText="确定" cancelText="取消">
                            <a style={{display:deletePowers?'inline-block':'none'}} className='operation' >删除</a>
                        </Popconfirm>  */}
                        </div>
                ),
            },
        ];
        const search = [
            {
                key: 'createUserName',
                label: '用户姓名:',
                qFilter: 'Q=search',
                type: 'input',
            },
            {
                key: 'cardThemeId',
                label: '所属主题:',
                qFilter: 'Q=topicId',
                type: 'select',
                option: themeOption,
            },
            {
                key: 'status',
                label: '上线状态:',
                qFilter: 'Q=status',
                type: 'select',
                option: statusOption,
            },
            {
                key: 'createDate',
                label: '创建时间:',
                qFilter: 'Q=startTime',
                type: 'rangePicker',
            },
        ];
        return (
            <div className="CardManagation">
                <TableAndSearch
                    search={search}
                    url={'services/web/bbs/post/getList'}
                    columns={columns}
                    rowkey={'id'}
                    OffLineBtn={hasOffline ? { label: '下线', order: 2, url: 'services/web/bbs/post/setPostOffline' } : null}
                    OnLineBtn={hasOnline ? { label: '上线', order: 1, url: 'services/web/bbs/post/setPostOnline',typeLine:'上线' } : null}
                />
                <Modal
                    title="帖子详情"
                    maskClosable={true}
                    footer={null}
                    visible={this.state.visibleDetail}
                    onOk={this.onOk}
                    onCancel={this.hideModal}
                    className="cardDetailModal"
                >
                    <CardManagationDetail
                       detailId={this.state.detailId}
                    />
                </Modal>
            </div>
        );
    }
}

class CardManagationDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            detailData:{},
            detailChangeId:this.props.detailId,
        };
    }

    componentDidMount(){
        this.requestData();
    }
    componentWillReceiveProps(nextProps){
        if(this.props.detailId!==nextProps.detailId){
            this.setState({detailChangeId:nextProps.detailId},()=>{
                this.requestData();
            });
        }
    }
    //请求详情数据
    requestData=()=>{
        getService(API_PREFIX+`services/web/bbs/post/getById/${this.state.detailChangeId}`,data=>{
            if(data.status===1&&JSON.stringify(data.root)!=='{}'){
                this.setState({
                    detailData:data.root.object,
                });
            }else{
                message.error(data.errorMsg);
            }
        });
    }

    //跳转评论
    goComments=()=>{
        location.hash=`/TradeManager/ForumManagation/CommentManagation/SecondDetail?postId=${this.state.detailData.id}`;
    }

    render(){
        let detailData = this.state.detailData
        let images = []
        if(detailData.images) {
            if(detailData.images.indexOf(',') > -1) {
                images = detailData.images.split(',')
            }else {
                images.push(detailData.images)
            }
        }
        return(
            <div className="CardManagationDetail">
                <Row className="postDetail">
                    <Col span='10'>发信人：{`${this.state.detailData&&this.state.detailData.createUserName}`}</Col>
                    <Col span='10'>评论数：<a className="operation" onClick={this.goComments}>{`${this.state.detailData&&this.state.detailData.commentCount}`}</a></Col>
                </Row>
                <Row className="postDetail">
                    <Col span='10'>员工号：{`${this.state.detailData&&this.state.detailData.userNo}`}</Col>
                    <Col span='10'>创建时间：{`${this.state.detailData&&this.state.detailData.createDate}`}</Col>
                </Row>
                <Row className="postDetail">主&nbsp;&nbsp;&nbsp;题：{`${this.state.detailData&&this.state.detailData.topicName}`}</Row>
                <div className="content" style={{marginBottom: 5}}>
                    <span>{`${this.state.detailData&&this.state.detailData.content}`}</span>
                </div>
                {
                    images.length ? 
                        images.map((item, index) => {
                            return (
                            <span style={{marginRight: 5}}>
                                <Zmage style={{width: '60px', height: '60px'}} key={index} src={`${sessionStorage.getItem('ossViewPath') || API_FILE_VIEW}${item}`} alt='' />
                            </span>
                            );
                        }) : null
                }
            </div>
        );
    }
}