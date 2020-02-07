import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { Radio, message, Divider, Modal, Input, Button } from 'antd';
import { connect } from 'react-redux';
import { BEGIN } from '../../../../../redux-root/action/table/table';
import { postService, getService, GetQueryString } from '../../../myFetch';
import API_PREFIX, { API_FILE_VIEW } from '../../../apiprefix';
const RadioGroup = Radio.Group;
import $ from 'jquery'
const { TextArea } = Input
const icon_logo = require('../../../../../styles/images/login/logo.png');
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData: state.table.pageData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: GetQueryString(location.hash, ['id']).id,//获取从前一个页面传递过来的id
      targetType: GetQueryString(location.hash, ['targetType']).targetType,//类型id ,其中咨询为2
      order: 2,
      dp: [],
      replyDetailData: {},
      detailModal: false,
      detailData: {},
      TextAreaValue: '',
      replyData: {},
      replyModal: false,
      detail: {},
      activity: GetQueryString(location.hash, ['id']).id,
      LoginauthInfo: JSON.parse(window.localStorage.getItem("LoginauthInfo"))
    };
  }


  componentDidMount() {
    //获取部门的数据
    let organizationData = [];
    let isAll = 'Q=isAll=false';
    let haveUsers = "Q=haveUsers=false";
    getService(API_PREFIX + `services/web/company/org/orgList/get?${isAll}&${haveUsers}`, data => {
      if (data.status === 1) {
        organizationData = data.root.object;
        this.dealDepartmentData(organizationData);
        this.setState({ dp: organizationData });
      }
    });
  }
  //处理组织机构中的数据
  dealDepartmentData(data) {
    data.map((item, index) => {
      item.value = item.id + '';
      item.label = item.name;
      item.children = item.subCompanyOrgList;
      if (item.subCompanyOrgList) {//不为空，递归
        this.dealDepartmentData(item.subCompanyOrgList);
      }
    });
  }

  //普通评论转-精彩评论-普通评论
  handleChange = (e, record) => {
    console.log("record", this.props);
    console.log("record", record);
    let body = {};
    let status = "";
    let commentId = record.id;               /////commentType 0普通 1经常 2水贴
    if (record.commentType == 0) { //设置为精彩评论(1)
      status = '1';
    } else if (record.commentType == 1) {//设置为普通评论(0)
      status = '0';
    } else if (record.commentType == 2) {//设置为普通评论(0)
      status = '0';
    }
    console.log('普通评论/精彩评论', body);
    postService(API_PREFIX + `services/web/activity/ordering/setGoodComment/${commentId}/${status}`, body, data => {
      console.log("普通评论/精彩评论", data);
      if (data.status == 1) {
        message.success('操作成功');
        // history.go()
        this.props.getData(API_PREFIX + `services/web/activity/ordering/getAllCommentDetail/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      }
    });
  }
  //排序发生改变
  handleOrderChange = (e) => {
    console.log(this.props.pageData.query);
    console.log($.serializeArray(this.props.pageData.query))
    debugger;
    this.setState({ order: e.target.value }, () => {
      this.props.getData(API_PREFIX + `services/web/activity/ordering/getAllCommentDetail/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}&Q=sort=${this.state.order}`);
    });
  }

  // 文本框
  onTextArea = e => {
    this.setState({ TextAreaValue: e.target.value })
  }

  // 回复
  replyOk = () => {
    const { replyData, TextAreaValue } = this.state
    console.log(replyData, TextAreaValue)
    this.setState({ TextAreaValue: '' })
    $('.commonReply').css({ display: 'none' })
  }

  sumitReply = (e, item) => {
    const { TextAreaValue } = this.state
    console.log(item, TextAreaValue);
    if (TextAreaValue.length == 0) {
      message.error("回复内容的长度不能为空");
      return false;
    }

    let commentId =item.replyId?item.commentId:item.id;
    let body = {
      org_id: this.state.LoginauthInfo.orgId,
      email: this.state.LoginauthInfo.email,
      full_name: this.state.LoginauthInfo.fullName,
      tree_path: this.state.LoginauthInfo.treePath ? this.state.LoginauthInfo.treePath : '',
      tenant_id: this.state.LoginauthInfo.tenantId,
      create_user_id: this.state.LoginauthInfo.userId,
      create_user_name: this.state.LoginauthInfo.name,
      object_id: this.state.activity,
      content: TextAreaValue,

      image_url: item.imageUrl ? item.imageUrl : null,
      comment_id: commentId,
      reply_id: item.createUserId,
      reply_name: item.createUserName
    }

    postService(API_PREFIX + 'services/web/activity/exam/replyComment', body, data => {
      if (data.status == 1) {
        message.success('回复成功')
        this.setState({ TextAreaValue: '' });
        let params = {};
        params['id'] = this.state.detail.id;
        this.getMainDetail(params);
        this.props.getData(API_PREFIX + `services/web/activity/ordering/getAllCommentDetail/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      } else {
        message.error(data.errorMsg);
        this.setState({ TextAreaValue: '' })
      }
    });
  }



  // 获取评论详情
  replyComment = e => {
    this.getMainDetail(e)
    this.setState({ replyModal: true, TextAreaValue: "" });
  }

  // 得到评论详情
  getDetail = e => {
    this.getMainDetail(e);
    this.setState({ detailModal: true, });
  }

  //得到1级评论详情
  getMainDetail = e => {
    getService(API_PREFIX + `services/web/activity/ordering/getByCommentId/${e.id}`, data => {
      if (data.status === 1) {
        this.setState({ detail: data.root.object, replyDetailData: data.root.object });
      }
    })
  }

  //回复切换
  insertReply = (data, index) => {
    this.setState({ TextAreaValue: '', replyData: data })
    $('.commonReply').css({ display: 'none' })
    $(`.replyPerson${index}`).css({ display: 'block' })
  }


  replyTwoOk = () => {
    const { replyDetailData, TextAreaValue } = this.state;
    console.log(TextAreaValue)
    if (TextAreaValue.length == 0) {
      message.error("回复内容不能为空");
      return false;
    }

     let commentId = this.state.detail.id;
    let body = {
      org_id: this.state.LoginauthInfo.orgId,
      email: this.state.LoginauthInfo.email,
      full_name: this.state.LoginauthInfo.fullName,
      tree_path: this.state.LoginauthInfo.treePath ? this.state.LoginauthInfo.treePath : '',
      tenant_id: this.state.LoginauthInfo.tenantId,
      create_user_id: this.state.LoginauthInfo.userId,
      create_user_name: this.state.LoginauthInfo.name,
      object_id: this.state.activity,
      content: TextAreaValue,
      image_url: this.state.detail.imageUrl ? this.state.detail.imageUrl : null,
      comment_id: commentId,
      reply_id: this.state.detail.createUserId,
      reply_name: this.state.detail.createUserName
    }

    postService(API_PREFIX + 'services/web/activity/exam/replyComment', body, data => {
      if (data.status == 1) {
        message.success('回复成功')
        this.setState({ replyModal: false, replyDetailData: {}, TextAreaValue: '', detail: {}, replyDetailData: {} });
        this.props.getData(API_PREFIX + `services/web/activity/ordering/getAllCommentDetail/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      } else {
        message.error(data.errorMsg);
        this.setState({ replyModal: false, replyDetailData: {}, TextAreaValue: '', detail: {}, replyDetailData: {} })
      }
    });
  }

  render() {
    const { updateKey, order, detailData, TextAreaValue, replyDetailData } = this.state;
    console.log("replyDetailData===>",replyDetailData);
    let body = { 'activityId': '6' };
    console.log('dp', this.state);
    console.log('this.props==>', this.props);
    let ossViewPath = sessionStorage.getItem('ossViewPath') || API_FILE_VIEW
    let pathName = '';
    let urlName = '';
    if (this.props.location.pathname === "/InformationManagement/Article/Comments") {
      pathName = '#/InformationManagement/Article';
      urlName = '#/InformationManagement/Article' + `?tabsVale=${sessionStorage.getItem('TabsKey')}`;//文章管理评论数点击返回返回到对应所在页xwx2018/12/19
    } else if (this.props.location.pathname === "/InformationManagement/Video/Comments") {
      pathName = '#/InformationManagement/Video';
      urlName = '#/InformationManagement/Video' + `?tabsVale=${sessionStorage.getItem('videoTabsKey')}`;//视频管理评论数点击返回返回到对应所在页xwx2019/3/19
    } else if (this.props.location.pathname === "/EventManagement/Apply/CommentList") {
      pathName = '#/EventManagement/Apply';
    } else if (this.props.location.pathname === "/EventManagement/Examination/CommentList") {
      pathName = '#/EventManagement/Examination';
    } else if (this.props.location.pathname === "/EventManagement/Questionnaire/CommentList") {
      pathName = '#/EventManagement/Questionnaire';
    } else if (this.props.location.pathname === "/EventManagement/Vote/CommentList") {
      pathName = '#/EventManagement/Vote';
    } else if (this.props.location.pathname === "/EventManagement/Order/CommentList") {
      pathName = '#/EventManagement/Order';
    }
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
        // width:'50px',
      },
      {
        title: '评论人',
        dataIndex: 'createUserName',
        key: 'createUserName',
        // width:'100px',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'phone',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '部门',
        dataIndex: 'fullName',
        key: 'fullName',
      },
      {
        title: '评论内容',
        dataIndex: 'content',
        key: 'content',
        width: '280px',
        // render: (text, record, index) => {
        //   let imgs = record.imageUrl &&JSON.parse(record.imageUrl);
        //   if(imgs&&imgs.length>0){
        //       return <div>
        //         {record.content}
        //           {
        //             imgs.map(function(t){
        //               return <img src={ossViewPath + t} style={{width:'30px'}} />;
        //           })}
        //     </div>;
        //   }else{
        //     return <div>
        //       {record.content}
        //     </div>;
        //   }
        // },
        render: (text, record, index) => {
          let imgs = record.imageUrl;
          if (imgs && imgs.length > 0) {
            return <div>
              {
                <img src={ossViewPath + imgs} style={{ width: '30px', marginRight: 5 }} />
              }
              : {record.content}
            </div>;
          } else {
            return <div>
              {record.content}
            </div>;
          }
        },
      },
      {
        title: '评论类型',
        dataIndex: 'commentType',
        key: 'commentType',
        width: '80px',
        render: (record) => {
          if (record === 0) {
            return '普通评论';
          } else if (record === 1) {
            return '精彩评论';
          } else if (record === 2) {
            return '水贴';
          }
        },
      },
      // {
      //   title: '被回复人',
      //   dataIndex: 'replyName',
      //   key: 'isReplyName',
      //   width:'100px',
      // },
      //    {
      //     title: '是否被举报',
      //     dataIndex: 'isReport',
      //     key: 'isReport',
      //     width:'100px',
      //     render:(record)=>{
      //       if(record===false){
      //         return '否';
      //       }else if(record===true){
      //         return '是';
      //     }
      //   },
      // },
      {
        title: '评论时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width: '120px',
      },
      {
        title: '被回复数',
        dataIndex: 'createDate',
        key: 'createDate',
        width: '120px',
        render: (text, record, index) => {
          console.log("111", record)
          return <a onClick={() => this.getDetail(record)}>{record.commentNum ? record.commentNum : 0}</a>
        },
      },
      //
      {
        title: '操作',
        key: 'operation',
        width: '150px',
        render: (text, record, index) => {
          return <div>
            <a onClick={() => this.replyComment(record)}>详情</a>
            {/* <a onClick={(e) =>{ window.sessionStorage.setItem('orderDetail', JSON.stringify(record)); console.log("record",record);
                location.hash = `${pathName}/CommentDetail?targetType=${this.state.targetType}&commentId=${record.id}&activity=${this.state.id}`;} }>详情bak</a> */}
            <Divider type="vertical" />
            <a
              onClick={(e) => this.handleChange(e, record)
              }>{record.commentType == '0' ? '设为精彩评论' : '设为普通评论'}</a>
          </div>;

        },
      },
    ];
    const commetTypeOp = [
      {
        key: '',
        value: '全部',
      },
      {
        key: '0',
        value: '普通评论',
      },
      {
        key: '1',
        value: '精彩评论',
      },
    ];
    const isReplyOp = [
      {
        key: '',
        value: '全部',
      },
      {
        key: true,
        value: '是',
      },
      {
        key: false,
        value: '否',
      },
    ];
    const isReportOp = [
      {
        key: '',
        value: '全部',
      },
      {
        key: 1,
        value: '是',
      },
      {
        key: 0,
        value: '否',
      },
    ];
    const search = [
      {
        key: 'userName',
        label: '评论人',
        qFilter: 'Q=userName',
        type: 'input',
      },
      {
        key: 'orgId',
        label: '部门',
        qFilter: 'Q=orgId',
        type: 'cascader',
        option: this.state.dp,
      },
      {
        key: 'commentType',
        label: '评论类型',
        qFilter: 'Q=commentType',
        type: 'select',
        option: commetTypeOp,
      },
      // {
      //   key: 'isReply',
      //   label: '是否被回复',
      //   // qFilter: 'Q=isreplyname_S_EQ',
      //   qFilter: 'Q=isreply_Z_EQ',
      //   type: 'select',
      //   option:isReplyOp,
      // },
      // {
      //   key: 'isReport',
      //   label: '是否被举报',
      //   qFilter: 'Q=report',
      //   type: 'select',
      //   option:isReportOp,
      // },
    ];
    return <div><TableAndSearch columns={columns}
      ///////url={`services/activity/comment/list/${this.state.targetType}/${this.state.order}`}20190822wgs
      url={`services/web/activity/ordering/getAllCommentDetail`}
      search={search} reorder={this.state.order}
      findData={this.state.order}
      //  special={`Q=targetType_S_EQ=${this.state.id}`}
      urlfilter={`Q=activityId=${this.state.id}`}
      // deleteBtn={{order: 1, url: 'services/web/activity/exam/batchDeleteUserComment',field:'ids'}}
      // deleteBtn={{order: 1, url: 'services/web/activity/exam/batchDeleteUserComment'}}
      goBackBtn={{ order: 1, url: urlName, label: '返回' }}

      // scroll={{width:1600}}
      exportBtn={{
        order: 2, url: `services/web/activity/enrolment/exportCommentList`,
        type: '评论列表',
        label: '导出评论列表',
      }}
    >
      <RadioGroup defaultValue={this.state.order} onChange={(e) => this.handleOrderChange(e)} style={{ marginLeft: '15px', marginTop: '10px', marginBottom: '10px' }} >
        <Radio value={2}>按时间先后</Radio>
        <Radio value={1}>按点赞数高低</Radio>
      </RadioGroup>
    </TableAndSearch>
      <Modal
        width={800}
        title="被回复详情"
        visible={this.state.detailModal}
        cancelText="取消"
        okText="回复"
        footer={null}
        onOk={this.replyOk}
        onCancel={() => this.setState({ detailModal: false, replyDetailData: {} })}
        destroyOnClose={true}
        afterClose={() => this.setState({ detailModal: false, replyDetailData: {} })}
      >
        <div className='detailModal'>
          <div className='commentDetail commonStyle'>
            <div>用户名：<span className='commonSpan'>{replyDetailData.createUserName}</span></div>
            <div>评论时间：<span className='commonSpan'>{replyDetailData.createDate}</span></div>
            <div>评论类型：<span className='commonSpan'>{replyDetailData.commentType ? '精彩评论' : '普通评论'}</span></div>
          </div>
          <div className='commonStyle'>部门名称：<span className='commonSpan'>{replyDetailData.fullName}</span></div>
          <div className='commonStyle'>评论内容：<span className='commonSpan'>{replyDetailData.content}</span>{replyDetailData.imageUrl ? <img src={ossViewPath + replyDetailData.imageUrl} style={{ width: '30px' }} /> : null}</div>
          <hr />
          <table className='userComments'>
            {
              replyDetailData.userComments && replyDetailData.userComments.map((item, index) => {
                return <tr>
                  <th style={{ width: 200, verticalAlign: 'top' }}>{item.createUserName}回复{item.replyName}：</th>
                  <th style={{ verticalAlign: 'top', width: 450 }}>
                    <div className='replyContent'>{item.content}</div>
                    <span className='createDate'>{item.createDate}</span>
                    <div className={`replyPerson${index} commonReply`}>
                      <div className='replyOne'>回复：</div>
                      <div className='replyTwo'><TextArea placeholder='限制255字' value={TextAreaValue} maxLength={255} onChange={e => this.onTextArea(e)} /></div>
                      <div className="replyThree"><Button size="small" onClick={(e) => this.sumitReply(e, item)} type="primary">提交回复</Button></div>
                    </div>
                  </th>
                  <th style={{ width: 50, textAlign: 'center', verticalAlign: 'top' }}><span className='reply' onClick={() => this.insertReply(item, index)}>回复</span></th>
                </tr>
              })
            }
          </table>
        </div>
      </Modal>
      <Modal
        width={800}
        title="回复"
        visible={this.state.replyModal}
        cancelText="取消"
        okText="回复"
        onOk={this.replyTwoOk}
        onCancel={() => this.setState({ replyModal: false, replyDetailData: {} })}
        destroyOnClose={true}
        afterClose={() => this.setState({ replyModal: false, replyDetailData: {} })}
      >
        <div className='detailModal'>
          <div className='commentDetail commonStyle'>
            <div>用户名：<span className='commonSpan'>{replyDetailData.createUserName}</span></div>
            <div>评论时间：<span className='commonSpan'>{replyDetailData.lastUpdateDate}</span></div>
            <div>评论类型：<span className='commonSpan'>{replyDetailData.commentType ? '精彩评论' : '普通评论'}</span></div>
          </div>
          <div className='commonStyle'>部门名称：<span className='commonSpan'>{replyDetailData.fullName}</span></div>
          <div className='commonStyle'>评论内容：<span className='commonSpan'>{replyDetailData.content}</span>{replyDetailData.imageUrl ? <img src={ossViewPath + replyDetailData.imageUrl} style={{ width: '30px' }} /> : null}</div>
          <div style={{ height: 60 }}>
            <div className='replyThree'>回复：</div><div className='replyFour'><TextArea placeholder='限制255字' value={TextAreaValue} maxLength={255} onChange={e => this.onTextArea(e)} /></div>
          </div>
        </div>
      </Modal>
    </div>
  }
}
export default CommentList;
