import React, { Component } from 'react';
import TableAndSearch from '../../component/table/TableAndSearch';
import {Radio,message,Divider,Modal,Input,Button} from 'antd';
import {connect} from 'react-redux';
import {BEGIN} from '../../../redux-root/action/table/table';
import { postService, getService ,GetQueryString} from '../myFetch';
import API_PREFIX,{API_FILE_VIEW} from '../apiprefix';
import $ from 'jquery'
const RadioGroup = Radio.Group;
const {TextArea} = Input
@connect(
    state => ({
      dataSource: state.table.tableData,
      pageData:state.table.pageData,
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
    })
)

class PageComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order:0 ,
      id:GetQueryString(location.hash,['id']).id,
      type:GetQueryString(location.hash,['type']).type,
      tabsVale:GetQueryString(location.hash,['tabsVale']).tabsVale,
      departmentOption:[],
      detailModal:false,
      detailData:{},
      TextAreaValue:'',
      replyData:{},
      replyModal:false,
      replyDetailData:{},
      ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW, //根据登陆人员来获取oss地址
      replyId:''
    };
  }

  componentDidMount(){
    this.getDepartData()
  }
  getDepartData = () => {
    getService(API_PREFIX + 'services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false',data=>{
      if(data.status === 1){
        let dep = data.root.object;
        if(dep){
          this.getDepartmentData(dep);
          this.setState({departmentOption: dep})
        }
      } else{
        message.error(data.errorMsg);
      }
    });
  }
  getDepartmentData(dpData){
    dpData.map((item,index)=>{
      item.value=item.id;
      item.label=item.name;
      item.children=item.subCompanyOrgList;
      if(item.subCompanyOrgList){
        this.getDepartmentData(item.subCompanyOrgList)
      }
    });
  }
  //评论
  handleChange=(e,record)=>{
    let type = record.commentType?'0':'1'
    postService(API_PREFIX+`services/web/news/article/voteToComment/${record.id}/${type}`,{},data=>{
      if(data.status==1){
        message.success('操作成功');
        this.props.getData(API_PREFIX+`services/web/news/article/commentNum/${this.state.id}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}/${this.state.order}`);
      }else{
        message.error(data.errorMsg);
      }
    });
  }
  //排序
  handleOrderChange=(e)=>{
    this.setState({order:e.target.value});
    const {type} = this.state;
    if(type == 4||type ==5){
      this.props.getData(API_PREFIX+`services/web/news/special/getCommentList/${this.state.id}/${e.target.value}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`)
    }else{
      this.props.getData(API_PREFIX+`services/web/news/article/commentNum/${this.state.id}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}/${e.target.value}?${this.props.pageData.query}`);
    }
  }
  getDetail =  e => {
    const {type} = this.state
    this.setState({replyId:e.id})
    if(type == 4||type == 5){
      getService(API_PREFIX + `services/web/news/special/getCommentById/${e.id}`, data => {
        if (data.status === 1) {
          this.setState({ detailData: data.root.object,detailModal:true,});
        }else{
          message.error(data.errorMsg)
        }
      });
    }else{
      getService(API_PREFIX + `services/web/news/article/getByCommentId/${e.id}`, data => {
        if (data.status === 1) {
          this.setState({ detailData: data.root.object,detailModal:true,});
        }else{
          message.error(data.errorMsg)
        }
      });
    }

  }
  replyComment = e =>{
    this.setState({ replyDetailData: e,replyModal:true,});
  }


  replyOk = () => {
    const {replyData,TextAreaValue,detailData,id,order,type,replyId} = this.state
    console.log(replyData,TextAreaValue)
    let body={
      commentId:replyId,
      object_id:replyData.objectId,
      replyId:replyData.createUserId,
      email:replyData.email,
      full_name:replyData.fullName,
      image_url:replyData.txPic,
      org_id:replyData.orgId,
      reply_name:replyData.createUserName,
      tenant_id:window.sessionStorage.getItem('tenantId'),
      tree_path:replyData.treePath,
      content:TextAreaValue,
      createUserId:window.sessionStorage.getItem('id'),
      createUserName:window.sessionStorage.getItem('userName'),
    }
    postService(API_PREFIX + 'services/web/news/article/replyComment', body, data => {
      if (data.status == 1) {
        message.success('回复成功')
        this.setState({replyData:{},TextAreaValue:''})
        if(type === 4 || type === 5 ){
          this.props.getData(API_PREFIX+`services/web/news/special/getCommentList/${id}/${order}/1/10`)
        }else{
          this.props.getData(API_PREFIX+`services/web/news/article/commentNum/${id}/1/10/${order}`)
        }
        this.getDetail(detailData)
      }else{
        message.error(data.errorMsg);
        this.setState({replyData:{},TextAreaValue:''})
        this.getDetail(detailData)
      }
    });
    $('.commonReply').css({display:'none'})
  }
  replyTwoOk = () => {
    const {replyDetailData,TextAreaValue,id,order,type} = this.state
    console.log(replyDetailData)
    let body={
      commentId:replyDetailData.id,
      object_id:replyDetailData.objectId,
      replyId:replyDetailData.createUserId,
      email:replyDetailData.email,
      full_name:replyDetailData.fullName,
      image_url:replyDetailData.txPic,
      org_id:replyDetailData.orgId,
      reply_name:replyDetailData.createUserName,
      tenant_id:window.sessionStorage.getItem('tenantId'),
      tree_path:replyDetailData.treePath,
      content:TextAreaValue,
      createUserId:window.sessionStorage.getItem('id'),
      createUserName:window.sessionStorage.getItem('userName'),
    }
    postService(API_PREFIX + 'services/web/news/article/replyComment', body, data => {
      if (data.status == 1) {
        message.success('回复成功')
        this.setState({replyModal:false,replyDetailData:{},TextAreaValue:''})
        if(type === 4 || type === 5 ){
          this.props.getData(API_PREFIX+`services/web/news/special/getCommentList/${id}/${order}/1/10`)
        }else{
          this.props.getData(API_PREFIX+`services/web/news/article/commentNum/${id}/1/10/${order}`)
        }
        
      }else{
        message.error(data.errorMsg);
        this.setState({replyModal:false,replyDetailData:{},TextAreaValue:''})
      }
    });
  }

  insertReply = (data,index) => {
    this.setState({TextAreaValue:'',replyData:data})
      $('.commonReply').css({display:'none'})
      $(`.replyPerson${index}`).css({display:'block'})
  }
  onTextArea = e => {
    this.setState({TextAreaValue:e.target.value})
  }
  render() {
    const {type,id,tabsVale,order,detailData,TextAreaValue,replyDetailData,ossViewPath} = this.state;
    console.log(detailData)
    let backUrl='';
    if(type === '1'){
      backUrl = `#/InformationManagement/Article?tabsVale=${tabsVale}`
    }else if(type === '2'){
      backUrl = `#/InformationManagement/Video?tabsVale=${tabsVale}`
    }else if(type === '3'){
      backUrl = '#/InformationManagement/Magazine/List'
    }else if(type === '4'){
      backUrl = `#/InformationManagement/project/list?tabsVale=${tabsVale}`
    }else if(type === '5'){
      backUrl = '#/InformationManagement/project/Bank'
    }
    let columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
        width:'50px',
      },
      {
        title: '评论人',
        dataIndex: 'createUserName',
        key: 'createUserName',
        width:'100px',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        width:'100px',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width:'120px',
      },
      {
        title: '部门',
        dataIndex: 'fullName',
        key: 'fullName',
        width:'600px',
      },
      {
        title: '评论内容',
        key: 'content',
        width:'280px',
        render: (text, record, index) => {
          let imageUrl = record.imageUrl
          if(imageUrl&&imageUrl.length>0){
              return <div>{record.content}<img src={ossViewPath + imageUrl} style={{width:'30px'}} /></div>
          }else{
            return <div>{record.content}</div>
          }
        },
      },
      {
        title: '评论类型',
        dataIndex: 'commentType',
        key: 'commentType',
        width:'100px',
        render:(data,record)=>{
          return <span>{record.commentType?'精彩评论':'普通评论'}</span>
        }
      },
      {
        title: '被回复数',
        dataIndex: 'commentNum',
        key: 'commentNum',
        width:'80px',
        render:(_,record)=>{
          return <a onClick={() =>this.getDetail(record) }>{record.commentNum?record.commentNum:0}</a>
        }
      }, 
      {
        title: '评论时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width:'120px',
      },
      {
        title: '操作',
        key: 'operation',
        width:'150px',
        render: (text, record) => {
          return <div>
            {/* <a onClick={(e) =>{window.sessionStorage.setItem('orderDetail',this.state.order);location.hash = `/InformationManagement/Information/CommentDetail?infoId=${this.state.id}&commentId=${record.id}&type=${type}`;} }>详情</a> */}
            <a onClick={() =>this.replyComment(record) }>详情</a>
            <Divider type="vertical" />
            <a onClick={(e) =>this.handleChange(e,record)}>{record.commentType?'普通评论':'精彩评论'}</a>
          </div>

        },
      },
    ];
    if(type == 4||type == 5){
      columns = [
        {
          title: '序号',
          key: 'sNum',
          dataIndex: 'sNum',
          width:'50px',
        },
        {
          title: '评论人',
          dataIndex: 'createUserName',
          key: 'createUserName',
          width:'100px',
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile',
          width:'100px',
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
          width:'120px',
        },
        {
          title: '部门',
          dataIndex: 'fullName',
          key: 'fullName',
          width:'600px',
        },
        {
          title: '评论内容',
          key: 'content',
          width:'280px',
          render: (text, record, index) => {
            let imageUrl = record.imageUrl
            if(imageUrl&&imageUrl.length>0){
                return <div>{record.content}<img src={ossViewPath + imageUrl} style={{width:'30px'}} /></div>
            }else{
              return <div>{record.content}</div>
            }
          },
        },
        {
          title: '评论类型',
          dataIndex: 'commentType',
          key: 'commentType',
          width:'100px',
          render:(data,record)=>{
            return <span>{record.commentType?'精彩评论':'普通评论'}</span>
          }
        },
        {
          title: '被回复数',
          dataIndex: 'commentNum',
          key: 'commentNum',
          width:'60px',
          render:(_,record)=>{
            return <a onClick={() =>this.getDetail(record) }>{record.commentNum?record.commentNum:0}</a>
          }
        }, 
        {
          title: '评论时间',
          dataIndex: 'commentDate',
          key: 'commentDate',
          width:'120px',
        },
        {
          title: '操作',
          key: 'operation',
          width:'150px',
          render: (text, record) => {
            return <div>
              {/* <a onClick={(e) =>{window.sessionStorage.setItem('orderDetail',this.state.order);location.hash = `/InformationManagement/Information/CommentDetail?infoId=${this.state.id}&commentId=${record.id}&type=${type}`;} }>详情</a> */}
              <a onClick={() =>this.replyComment(record) }>详情</a>
              <Divider type="vertical" />
              <a onClick={(e) =>this.handleChange(e,record)}>{record.commentType?'普通评论':'精彩评论'}</a>
            </div>
  
          },
        },
      ];
    }
    const commetTypeOp=[{key:'',value:'全部'},{key:'0',value:'普通评论'},{key:'1',value:'精彩评论'},];
    const isReportOp=[{key:'',value:'全部'},{key:true,value:'是'},{key:false,value:'否'}];
    const search = [
      {key: 'createUserName',label: '评论人',qFilter: 'Q=createUserName',type: 'input'},
      {key: 'orgId',label: '部门',qFilter: 'Q=orgId',type: 'cascader',option:this.state.departmentOption},
      {key: 'commentType',label: '评论类型',qFilter: 'Q=commentType',type: 'select',option:commetTypeOp},
    ];
    let url = '',commentType = '',hasExport = true;
    if(type == 4||type == 5){
      url = `services/web/news/special/getCommentList/${id}/${order}`
      commentType = 'special'
      hasExport = false
    }else{
      url = `services/web/news/article/commentNum/${id}`
      commentType = 'article';
    }
        return <div>
          <TableAndSearch 
                columns={columns} 
                url={url}
                search={search}   
                type={commentType}
                reorder={this.state.order}
                // deleteBtn={{order: 1, url: 'services/web/news/article/deleteNewComment'}}
                exportBtn={hasExport?{ order: 2,url: `services/web/news/article/exportCommentList`,id:`Q=objectId=${this.state.id}`,type: '资讯评论列表',label: '导出评论列表'}:null} 
                goBackBtn={{ order: 1, url: backUrl,label:'返回' }}
                >
          <RadioGroup defaultValue={this.state.order} onChange={(e)=>this.handleOrderChange(e)} style={{marginLeft:'15px',marginTop:'10px',marginBottom:'10px'}} >
            <Radio value={0}>按时间先后</Radio>
            <Radio value={1}>按点赞数高低</Radio>
          </RadioGroup>
          </TableAndSearch>
          <Modal
              width={800}
              title="被回复详情"
              visible={this.state.detailModal}
              cancelText="取消"
              okText="回复"
              // onOk={this.replyOk}
              footer={null}
              onCancel={()=>this.setState({detailModal:false,detailData:{}})}
              destroyOnClose={true}
              afterClose={()=>this.setState({detailModal:false,detailData:{}})}
          >
          <div className='detailModal'>
              <div className='commentDetail commonStyle'>
                  <div>用户名：<span className='commonSpan'>{detailData.createUserName}</span></div>
                  <div>评论时间：<span className='commonSpan'>{detailData.createDate}</span></div>
                  <div>评论类型：<span className='commonSpan'>{detailData.commentType?'精彩评论':'普通评论'}</span></div>
              </div>
              <div className='commonStyle'>部门名称：<span className='commonSpan'>{detailData.fullName}</span></div>
              <div className='commonStyle'>评论内容：<span className='commonSpan'>{detailData.content}</span>{detailData.imageUrl?<img src={ossViewPath + detailData.imageUrl} style={{width:'30px'}} />:null}</div>
              <hr/>
              <table className='userComments'>
                {
                    detailData.userComments&&detailData.userComments.map((item,index)=>{
                      return <tr>
                          <th style={{width:200,verticalAlign:'top'}}>{item.createUserName}回复{item.replyName}：</th>
                          <th style={{width:550,verticalAlign:'top'}}>
                            <div className='replyContent'>{item.content}</div>
                            <span className='createDate'>{item.createDate}</span>
                            <div className={`replyPerson${index} commonReply`}>
                              <div className='replyOne'>回复：</div><div className='replyTwo'><TextArea placeholder='限制255字' value={TextAreaValue} maxLength={255} onChange={e=>this.onTextArea(e)}/></div>
                            </div>
                          </th>
                          <th style={{width:50,textAlign:'center',verticalAlign:'top'}}><span className='reply' onClick={()=>this.insertReply(item,index)}>回复</span></th>
                      </tr>
                    })
                }
              </table>
              <div style={{textAlign:'center',padding:20}}>
                <Button onClick={()=>this.setState({detailModal:false,detailData:{}})}>取消</Button>　　
                <Button type='primary' disabled={TextAreaValue?false:true} onClick={this.replyOk}>回复</Button>
              </div>
          </div>
        </Modal>
        <Modal
              width={800}
              title="回复"
              visible={this.state.replyModal}
              cancelText="取消"
              okText="回复"
              // onOk={this.replyTwoOk}
              footer={null}
              onCancel={()=>this.setState({replyModal:false,replyDetailData:{}})}
              destroyOnClose={true}
              afterClose={()=>this.setState({replyModal:false,replyDetailData:{}})}
          >
          <div className='detailModal'>
              <div className='commentDetail commonStyle'>
                  <div>用户名：<span className='commonSpan'>{replyDetailData.createUserName}</span></div>
                  <div>评论时间：<span className='commonSpan'>{replyDetailData.createDate}</span></div>
                  <div>评论类型：<span className='commonSpan'>{replyDetailData.commentType?'精彩评论':'普通评论'}</span></div>
              </div>
              <div className='commonStyle'>部门名称：<span className='commonSpan'>{replyDetailData.fullName}</span></div>
              <div className='commonStyle'>评论内容：<span className='commonSpan'>{replyDetailData.content}</span>{replyDetailData.imageUrl?<img src={ossViewPath + replyDetailData.imageUrl} style={{width:'30px'}} />:null}</div>
              <div style={{height:60}}>
                <div className='replyThree'>回复：</div><div className='replyFour'><TextArea placeholder='限制255字' value={TextAreaValue} maxLength={255} onChange={e=>this.onTextArea(e)}/></div>
              </div>
              <div style={{textAlign:'center',padding:20}}>
                <Button onClick={()=>this.setState({replyModal:false,replyDetailData:{}})}>取消</Button>　　
                <Button type='primary' disabled={TextAreaValue?false:true} onClick={this.replyTwoOk}>回复</Button>
              </div>
          </div>
        </Modal>
        </div>;
    
  
   
  }
}
export default PageComment;
