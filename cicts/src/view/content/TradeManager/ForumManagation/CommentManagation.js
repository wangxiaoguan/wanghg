import React, { Component } from 'react';
import { connect } from 'react-redux';
import { message,Divider,Popconfirm,Modal,Row,Col } from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {BEGIN} from '../../../../redux-root/action/table/table';
import API_PREFIX, {API_FILE_VIEW} from '../../apiprefix';
import { getService, postService } from '../../myFetch';
import {CommentManageationSecondDetail} from './CommentManageationDetail'
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
            visibleDetail:false,
            detailId:'',
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
        // location.hash=`/TradeManager/ForumManagation/CommentManagation/SecondDetail?postId=${record.objectId}`;
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
        let readPowers = powers && powers['20007.21706.003'];//查询
        let deletePowers=powers && powers['20007.21706.004'];//删除
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
                render: (text, record, index) => {
                  let imageUrl = record.imageUrl
                  if(imageUrl&&imageUrl.length>0){
                        let images = imageUrl.split(',')
                      return <div>{record.content}
                            {images.map(item => {
                                return <img src={(sessionStorage.getItem('ossViewPath') || API_FILE_VIEW) + item} style={{width:'30px'}} />
                            })}
                        </div>
                  }else{
                    return <div>{record.content}</div>
                  }
                },
            },
            {
                title: '帖子标题',
                dataIndex: 'postContent',
                key: 'postContent',
                render: (text, record) => {
                    if(record.postContent && record.postContent.length > 20) {
                        return `${record.postContent.substr(0, 20)}...`
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
                        <span><a style={{display:readPowers?'inline-block':'none'}} onClick={()=>this.commentDetail(record)}>详情</a></span>
                        <Divider type="vertical"/>
                        <Popconfirm title="确定删除所选项吗？" onConfirm={() => this.delete(record)} okText="确定" cancelText="取消">
                            <a style={{display:deletePowers?'inline-block':'none'}} className='operation' >删除</a>
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

/** 点击一级页面就出现弹框*/
// class CommentManageationDetail extends Component{
//     constructor(props){
//         super(props);
//         this.state={
//             detailData:{},
//             detailChangeId:this.props.detailId,
//         };
//     }

//     componentDidMount(){

//     }

//     componentWillReceiveProps(){

//     }

//     //请求详情数据
//     requestData=()=>{
//         getService(API_PREFIX+`services/web/bbs/user/comment/getCommentListById/${this.state.detailChangeId}`,data=>{
//             if(data.status===1&&JSON.stringify(data.root)!=='{}'){
//                 this.setState({
//                     detailData:data.root.object,
//                 });
//             }else{
//                 message.error(data.errorMsg);
//             }
//         });
//     }

//     render(){
//         return(
//             <div className="CommentManageationDetail">
//                  <Row className="postDetail">
//                     <Col span='10'>用户名：{`${this.state.detailData&&this.state.detailData.createUserName}`}</Col>
//                     <Col span='10'>帖子标题：{`${this.state.detailData&&this.state.detailData.commentCount}`}</Col>
//                 </Row>
//                 <Row>评论：
//                     <span />
//                 </Row>
//             </div>
//         );
//     }
// }
