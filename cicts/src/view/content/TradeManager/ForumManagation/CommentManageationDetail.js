import React, { Component } from 'react';
import { connect } from 'react-redux';
import { message,Divider,Popconfirm,Modal,Row,Col } from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {BEGIN} from '../../../../redux-root/action/table/table';
import API_PREFIX, {API_FILE_VIEW} from '../../apiprefix';
import { getService, postService,GetQueryString } from '../../myFetch';
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

export default class CommentManageationDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleDetail:false,
            detailId:'',
            postId:GetQueryString(location.hash,['postId']).postId,
        };
    }

    componentDidMount() {

    }
    setTop = (record) => {

    }
    cancel = () => {

    }

    //删除
    delete = (record) => {
        let body=[record.id];
        postService(API_PREFIX+`services/web/bbs/user/comment/delete`,body,data=>{
            if(data.status===1){
                message.success('删除成功');
                this.props.getData(API_PREFIX+`services/web/bbs/user/comment/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            }else{
                message.error(data.errorMsg);
            }
        });
    }

    //详情
    commentDetail=(record)=>{
        this.setState({detailId:record.id},()=>{
            this.setState({visibleDetail:true});
        });
    };

    //弹框确定
    onOk=()=>{
        this.setState({visibleDetail:false});
    }

    //弹框取消
    hideModal=()=>{
        this.setState({visibleDetail:false});
    }

    render() {
        const { powers = {} } = this.props;
        const showExport = powers['20030.20033.202'];
        const search = [
            {
                key: 'createUserName',
                label: '评论用户:',
                qFilter: 'Q=userName',
                type: 'input',
            },
            {
                key: 'commentContent',
                label: '评论内容:',
                qFilter: 'Q=commentContent',
                type: 'input',
            },
            // {
            //     key: 'titleName',
            //     label: '帖子名称:',
            //     qFilter: 'Q=titleName',
            //     type: 'input',
            // },
            {
                key: 'startTime',
                label: '创建时间:',
                qFilter: 'Q=startTime',
                type: 'rangePicker',
            },
        ];
        const columns = [
            {
                title: '评论用户',
                dataIndex: 'createUserName',
                key: 'createUserName',
            },
            {
                title: '评论内容',
                dataIndex: 'content',
                key: 'content',
            },
            {
                title: '帖子标题',
                dataIndex: 'postContent',
                key: 'postContent',
                render: (text, record) => {
                    if(record.postContent && record.postContent.length > 20) {
                        let str = record.postContent.substr(0, 20)
                        return `${str}...`
                    }else {
                        return record.postContent
                    }
                }
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
                render:(text, record)=> {
                    return (
                        <div>
                        <span><a onClick={()=>this.commentDetail(record)}>详情</a></span>
                        <Divider type="vertical"/>
                        <Popconfirm title="确定删除所选项吗？" onConfirm={() => this.delete(record)} okText="确定" cancelText="取消">
                            <a className='operation' >删除</a>
                        </Popconfirm> 
                        </div>
                    );
                },
            },
        ];
        return (
            <div>
                <TableAndSearch
                    search={search}
                    url={'services/web/bbs/user/comment/getList'}
                    columns={columns}
                    rowkey={'id'}
                    urlfilter={`Q=objectId=${this.state.postId}`}
                    type='CommentManageationDetail'
                />
                <Modal
                     title="评论详情"
                     maskClosable={true}
                     footer={null}
                     visible={this.state.visibleDetail}
                     onOk={this.onOk}
                     onCancel={this.hideModal}
                >
                <CommentManageationSecondDetail
                    detailId={this.state.detailId}
                />
                </Modal>
            </div>
        );
    }
}        

export class CommentManageationSecondDetail extends Component{
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
        getService(API_PREFIX+`services/web/bbs/user/comment/getCommentListById/${this.state.detailChangeId}`,data=>{
            if(data.status===1&&JSON.stringify(data.root)!=='{}'){
                this.setState({
                    detailData:data.root.object[0],
                });
            }else{
                message.error(data.errorMsg);
            }
        });
    }

    render(){
        let detailData = this.state.detailData
        let images = []
        if(detailData.imageUrl) {
            if(detailData.imageUrl.indexOf(',') > -1) {
                images = detailData.imageUrl.split(',')
            }else {
                images.push(detailData.imageUrl)
            }
        }
        return(
            <div className="CommentManageationDetail">
                 <Row className="postDetail">
                    <Col span='10'>用户名：{`${this.state.detailData&&this.state.detailData.createUserName}`}</Col>
                    <Col span='10'>帖子标题：{`${this.state.detailData&&this.state.detailData.postContent}`}</Col>
                </Row>
                <Row>评&nbsp;&nbsp;&nbsp;论:&nbsp;&nbsp;{this.state.detailData&&this.state.detailData.replyName?(<span className='replyName'>回复&nbsp;&nbsp;{`${this.state.detailData.replyName}`}&nbsp;&nbsp;</span>):null}
                    <span>{`${this.state.detailData&&this.state.detailData.content}`}</span>
                </Row>
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