import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {Radio,message,Divider} from 'antd';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
import { postService, getService ,GetQueryString} from '../../myFetch';
import ServiceApi from '../../apiprefix';
const RadioGroup = Radio.Group;
@connect(
    state => ({
      dataSource: state.table.tableData,
      pageData:state.table.pageData,
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
    })
)

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order:1,// 1：按照时间先后顺序   0：点赞数高低
      id:GetQueryString(location.hash,['id']).id,//获取从前一个页面传递过来的id
      targetType:GetQueryString(location.hash,['targetType']).targetType,//类型id ,其中咨询为2
    };
  }

//普通评论转-精彩评论-普通评论
  handleChange=(e,record)=>{
    console.log("record",this.props);
    let body={};
    body.id=record.id;
    if(record.commentTypeName=='普通评论'){ //设置为精彩评论(1)
      body.commentType='0'
    }else if(record.commentTypeName=='精彩评论'){//设置为普通评论(0)
      body.commentType='1'
    }
    console.log('普通评论/精彩评论',body);
    postService(ServiceApi+'services/activity/comment/update',body,data=>{
      console.log("普通评论/精彩评论",data);
      if(data.retCode==1){
        message.success('操作成功');
        // history.go()
        this.props.getData(ServiceApi+`services/activity/comment/list/${this.state.targetType}/1/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      }
    });
  }
  //排序发生改变
  handleOrderChange=(e)=>{
    this.setState({order:e.target.value},()=>{
      console.log("order",this.state.order);
    });

    //重新获取数据
    this.props.getData(ServiceApi+`services/activity/comment/list/${this.state.targetType}/${this.state.order}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
  }
  render() {
    const {updateKey} = this.state;
    let body = {'activityId': '6'};
    console.log('dp', this.state.dp);
    console.log('this.props==>',this.props)
    var pathName=''
    if(this.props.location.pathname==="/InformationManagement/Article/Comments"){
      pathName='#/InformationManagement/Article'
    }else if(this.props.location.pathname==="/InformationManagement/video/Comments"){
      pathName='#/InformationManagement/video'
    }
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '评论人',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '评论内容',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '评论类型',
        dataIndex: 'commentTypeName',
        key: 'commentTypeName',
      },
      {
        title: '是否被回复',
        dataIndex: 'isReplyName',
        key: 'isReplyName',
      }, {
        title: '是否被举报',
        dataIndex: 'isReportName',
        key: 'isReportName',
      },
      {
        title: '评论时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      //
      {
        title: '操作',
        key: 'operation',
        render: (text, record, index) => {
          return <div>
            <a onClick={
            () => ( location.hash = `${pathName}/CommentDetail?targetType=${this.state.targetType}&commentId=${record.id}` )}>详情</a>
            <Divider type="vertical" />
            <a
                onClick={(e) =>this.handleChange(e,record)
                }>{record.commentType=='0'?'精彩评论':'普通评论'}</a>
          </div>;

        },
      },
    ];
    const commetTypeOp=[
      {key:'',
        value:'全部'
      },
      {key:'0',
        value:'普通评论'
      },
      {key:'1',
        value:'精彩评论'
      },
    ];
    const isReplyOp=[
      {key:'',
        value:'全部'
      },
      {key:true,
        value:'是'
      },
      {key:false,
        value:'否'
      },
    ];
    const isReportOp=[
      {key:'',
        value:'全部'
      },
      {key:true,
        value:'是'
      },
      {key:false,
        value:'否'
      },
    ];
    const search = [
      {
        key: 'userName',
        label: '评论人',
        qFilter: 'Q=username_S_LK',
        type: 'input',
      },
      {
        key: 'commentType',
        label: '评论类型',
        qFilter: 'Q=commenttype_S_EQ',
        type: 'select',
        option:commetTypeOp,
      },
      {
        key: 'isReply',
        label: '是否被回复',
        qFilter: 'Q=isreply_Z_EQ',
        type: 'select',
        option:isReplyOp,
      },
      {
        key: 'isReport',
        label: '是否被举报',
        qFilter: 'Q=isreport_Z_EQ',
        type: 'select',
        option:isReportOp,
      },
    ];
    return <TableAndSearch columns={columns} url={`services/activity/comment/list/${this.state.targetType}/${this.state.order}`}
                           search={search}
                          //  special={`Q=targetType_S_EQ=${this.state.id}`}
                           urlfilter={`Q=targetid_EQ=${this.state.id}`}
                           deleteBtn={{order: 1, url: 'services/activity/comment/delete',field:'ids'}}
                          //  exportBtn={{
                          //    order: 2,
                          //    url: `services/activity/comment/exportComment/${this.state.targetType}/${this.state.order}`,
                          //    type: '评论表',
                          //    label: '导出评论列表',
                          //    body
                          //  }} 
                           >
      <RadioGroup defaultValue="0" onChange={(e)=>this.handleOrderChange(e)}>
        <Radio value="0">按时间先后</Radio>
        <Radio value="1">按点赞数高低</Radio>
      </RadioGroup>
    </TableAndSearch>;
  }
}
export default CommentList;
