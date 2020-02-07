import React, { Component } from 'react';
// import { Tabs,Button,message,Popconfirm,Divider,Steps ,Spin,Table,Modal,Input} from 'antd';
import { Tabs,message,Popconfirm,Divider,Spin,Modal,Form,Row,Col,Button,Input,Table,Steps} from 'antd';
import {postService,getService,GetQueryString} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import {CategoryAndList,List} from '../AriticleManagement/Article';
import {pageJummps} from '../PageJumps';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
import moment from 'moment';
import {setSelectTreeData,setCheckTreeData} from '../../../../redux-root/action/tree/tree';
import SingleTree from '../../../component/EventAndInfoAdd/SingleTree';
import VerifyTree from '../../../component/EventAndInfoAdd/verifyTree';
const TabPane=Tabs.TabPane;
const Step = Steps.Step;
const TextArea = Input.TextArea;
const FormItem = Form.Item;

@connect(
    state => ({
      dataSource: state.table.tableData,
      pageData:state.table.pageData,
      powers: state.powers,
      checkTreeData: state.tree.treeCheckData,
      selectDetail: state.tree.treeSelectData.selectDetail,
      selectTreeData: state.tree.treeSelectData,
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
      setSelectData: n => dispatch(setSelectTreeData(n)),
      setCheckData: n => dispatch(setCheckTreeData(n)),
    })
)
class Video extends Component{
  constructor(props){
    super(props);
    this.state={
      currentTabsKey:GetQueryString(location.hash,['tabsVale']).tabsVale?GetQueryString(location.hash,['tabsVale']).tabsVale:'1',
      tabsValeVideo:GetQueryString(location.hash,['tabsVale']).tabsVale?GetQueryString(location.hash,['tabsVale']).tabsVale:'1',
      categoryData:[],
      selectedCategory:'',
      loading: false,
      publishModal:false,
      examineModal:false,
      submithModal:false,
      allData:[],
      artData:'',
      dataSource:'',
      submitTxt:'',
      updateKeyOne:0,
      updateKeyTwo:0,
      updateKeyThree:0,
      updateKeyFour:0,
      reviewerList:[],
      detailData:{},
      detailModal:false,
    };
  }
  componentWillMount(){
    localStorage.setItem("selectedRowKeys", '');
  }
  componentDidMount(){
    this.dealData();
  }
  dealData=()=>{
    //获取栏目
    getService(API_PREFIX+pageJummps.InfoColumn,data=>{
        if(data.status === 1){
            let categoryList = [];
            // categoryList.push(data.root.object[0])
            data.root.object.map((item, index) => {
              if(item.name=='资讯' || item.name == '通用'){
                categoryList=[...categoryList, item]
              }
            });
            this.dealCategory(categoryList);
            this.setState({categoryData:categoryList});
        }else{
            message.error(data.errorMsg)
        }
    });
  }
  //递归处理栏目
  dealCategory(values){
    values&&values.map((item,index)=>{
      item.value=item.id+'';//将int型转换为字符串
      item.label=item.showType===2?`${item.name}(首页标签)`:item.name;
      item.children=item.subCategoryList;
      if(item.subCategoryList){
        this.dealCategory(item.subCategoryList);
      }
    });
  }
  dealColumnData(data) {
    data.map((item, index) => {
      if (item.hasReviewer) {//为true则
        this.state.reviewerList.push(item.id);
      }
      if (item.subCategoryList) {
        this.dealColumnData(item.subCategoryList);
      }

    });
  }
  //Tabs标签
  handleChangeTabs=(activeKey)=>{
    localStorage.setItem("selectedRowKeys", '');
    sessionStorage.setItem("videoTabsKey",activeKey);
    this.setState({currentTabsKey:activeKey});
    if(activeKey=='1'){
      this.setState({updateKeyOne:this.state.updateKeyOne+1});
    }else if(activeKey=='2'){
      this.setState({updateKeyTwo:this.state.updateKeyTwo+1});
    }else if(activeKey=='3'){
      this.setState({updateKeyThree:this.state.updateKeyThree+1});
    }else if(activeKey=='4'){
      this.setState({updateKeyFour:this.state.updateKeyFour+1});
    }
  }
  //选中栏目
  getSelectedCategory=(value)=>{
    this.setState({selectedCategory:value?value.toString():''});
  }
  //发布
  publishVideo=(e)=>{
    console.log(e)
    let body =  {id: e.id,categoryList:e.categoryId.split(',')};
    if(e.taskId&&e.isTimePublish){
      let time = new Date(e.publishDate) - new Date()
      if(time<0){
        Message.warning('定时发布时间小于当前时间，请修改再发布')
      }else{
        postService(API_PREFIX+pageJummps.VideoPush,body,data=>{
          if(data.status===1){
              if(data.root.object){
                message.success('该数据发布到待审核列表');
              }else{
                message.success('发布成功');
              }
              let currentPage=this.props.dataSource.root.totalNum%10;
              this.props.getData(API_PREFIX+`${pageJummps.VideoList}/${currentPage==1?this.props.pageData.currentPage-1?this.props.pageData.currentPage-1:1:this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState=0&Q=isReject=0&newsType=3`);
          }else{
              message.error(data.errorMsg)
          }
        });
      }
    }else{
      postService(API_PREFIX+pageJummps.VideoPush,body,data=>{
        if(data.status===1){
            if(data.root.object){
              message.success('该数据发布到待审核列表');
            }else{
              message.success('发布成功');
            }
            let currentPage=this.props.dataSource.root.totalNum%10;
            this.props.getData(API_PREFIX+`${pageJummps.VideoList}/${currentPage==1?this.props.pageData.currentPage-1?this.props.pageData.currentPage-1:1:this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState=0&Q=isReject=0&newsType=3`);
        }else{
            message.error(data.errorMsg)
        }
      });
    }

                  
  }
  //上线
  onTheLine=(record)=>{
      let body ={id: record.id,onLineState:1,};
      postService(API_PREFIX+pageJummps.VideoUpDown,body,data=>{
        if(data.status==1){
          if(data.root.object){
            message.success('该数据上线到待审核列表');
          }else{
            message.success('上线成功');
          }
          let currentPage=this.props.dataSource.root.totalNum%10;
          this.props.getData(API_PREFIX+`${pageJummps.VideoList}/${currentPage==1?this.props.pageData.currentPage-1?this.props.pageData.currentPage-1:1:this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState=2&newsType=3`);
        }else{
          message.error(data.errorMsg)
        }
      });
  }
  //下线
  offLine=(record)=>{
    let body ={id: record.id,onLineState:2};
    postService(API_PREFIX+pageJummps.VideoUpDown,body,data=>{
      if(data.status==1){
        message.success('下线成功');
        let currentPage=this.props.dataSource.root.totalNum%10;
        this.props.getData(API_PREFIX+`${pageJummps.VideoList}/${currentPage==1?this.props.pageData.currentPage-1?this.props.pageData.currentPage-1:1:this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState=1&newsType=3`);
      }else{
        message.error(data.errorMsg)
      }
    });
  }
  //编辑
  editArticle=(record)=>{
    location.hash=pageJummps.editVideo+`?newsId=${record.id}`;
  }
  //详情
  articleDetail=(record)=>{
    location.hash=pageJummps.detailVideo+`?newsId=${record.id}`;
  }
  closeExamine = () => {
      this.setState({examineModal:false,detailData:{}})
  }
  closeDetail = () => {
      this.setState({detailModal:false,detailData:{}})
  }
  examineDetail = (e) => {
      this.setState({detailModal:true,detailData:e})
  }
  render(){
    let powers=this.props.powers;


    let hasAddPower=powers && powers['20001.21602.001'];//新增
    let hasDelPower=powers && powers['20001.21602.004'];//删除
    let hasEditPower=powers && powers['20001.21602.002'];//修改
    let hasSearchPower=powers && powers['20001.21602.003'];
    let hasExportPower=powers && powers['20001.21602.202'];//导出
    let hasReleasePower=powers && powers['20001.21602.005'];//发布
    let onlineOfflinePower=powers && powers['20001.21602.006'];//上线下线
    //设置按钮的权限
    const hasPower={
      add:hasAddPower,
      export:hasExportPower,
      delete:hasDelPower,
    };
    const operUrl= {
      addUrl: pageJummps.newVideo,
      exportUrl:{url:pageJummps.VideoExport,type:'视频'},
      delUrl:{url:pageJummps.VideoDelete},
    };
    const columns=[
      {
        title:'发布人',
        dataIndex:'createUserName',
        key:'createUserName',
        width:100,
        fixed: 'left',
      },
      {
        title:'视频标题',
        dataIndex:'title',
        key:'title',
        width:100,
        fixed: 'left',
      },
      {
        title:'所属栏目',
        dataIndex:'categoryName',
        key:'categoryName',
      },
      {
        title:'是否推送',
        dataIndex:'isPush',
        key:'isPush',
        width:80,
        render:(data,record)=>{
          return <span>{record.isPush?'是':'否'}</span>;
        },
      },
      {
        title:'是否上首页',
        dataIndex:'isHomePage',
        key:'isHomePage',
        width:90,
        render:(data,record)=>{
          return <span>{record.isHomePage?'是':'否'}</span>;
        },
        
      }, {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
        width:150,
      },
      {
        title:'状态',
        dataIndex:'isReject',
        key:'isReject',
        width:100,
        render:(data,record)=>{
        return <span>{record.isReject===3?'驳回':record.isReject===4?'通过':'未审核'}</span>
        }
      },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        width:280,
        fixed: 'right',
        render:(data,record)=>(
            <div>
              {
                hasEditPower?(
                  <span>
                     <span><a className='operation' onClick={()=>this.editArticle(record) }>编辑</a></span>
                     <Divider type="vertical" />
                  </span>
                ):null
              }
                <span><a className='operation' onClick={()=>this.articleDetail(record)}>详情</a></span>
                {
                  record.isReject === 3 ? <span><Divider type="vertical" /><a className='operation' onClick={()=>this.examineDetail(record)}>审核详情</a></span> : null
                }
                {
                  hasReleasePower?(
                    <span>
                      <Divider type="vertical" />
                      <Popconfirm title="确定发布该视频吗?" onConfirm={()=>this.publishVideo(record)}><span><a className='operation'>发布</a></span></Popconfirm>
                    </span>
                  ):null
                }
            </div>
        ),
      },
    ];
    const columnsExamine=[
        
      {
        title:'视频标题',
        dataIndex:'title',
        key:'title',
        width:100,
        fixed: 'left',
      },
      {
        title:'发布人',
        dataIndex:'createUserName',
        key:'createUserName',
        width:100,
        fixed: 'left',
      },
      {
        title:'所属栏目',
        dataIndex:'categoryName',
        key:'categoryName',
      },
      {
        title:'是否推送',
        dataIndex:'isPush',
        key:'isPush',
        width:80,
        render:(data,record)=>{
          return <span>{record.isPush?'是':'否'}</span>;
        },
      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
        width:150,
      },
      {
        title:'发布时间',
        dataIndex:'publishDate',
        key:'publishDate',
        width:150,
      },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        width:300,
        fixed: 'right',
        render:(data,record)=>(
            <div>
                <span><a className='operation' onClick={()=>this.articleDetail(record)}>详情</a></span>
                <Divider type="vertical"/>
                <span><a className='operation' onClick={()=>this.examineDetail(record)}>审核详情</a></span>
            </div>
        ),
      },
    ];
    const anotherColumns=[
      {
        title:'发布人',
        dataIndex:'createUserName',
        key:'createUserName',
        width:100,
        fixed: 'left',
      },
      {
        title:'视频标题',
        dataIndex:'title',
        key:'title',
        width:100,
        fixed: 'left',
      },
      {
        title:'所属栏目',
        dataIndex:'categoryName',
        key:'categoryName',
      },{
        title:<span>浏览数<br/>(实际点击量)</span>,
        dataIndex:'viewCount',
        key:'viewCount',
        width:120,
        render:(data,record)=>{
          return <a onClick={()=>location.hash=pageJummps.videoView+`?id=${record.id}&type=2&tabsVale=2`} >{record.viewCount}({record.realViewCount})</a>;
        },
      },{
        title:'评论数',
        dataIndex:'commentCount',
        key:'commentCount',
        width:70,
        render:(data,record)=>{
          return <a onClick={()=>location.hash=pageJummps.videoComment+`?id=${record.id}&type=2&tabsVale=2`} >
            {record.commentCount}</a>;
        },
      },
      {
        title:'是否推送',
        dataIndex:'isPush',
        key:'isPush',
        width:80,
        render:(data,record)=>{
          return <span>{record.isPush?'是':'否'}</span>;
        },
      },
      {
        title:'是否上首页',
        dataIndex:'isHomePage',
        key:'isHomePage',
        width:90,
        render:(data,record)=>{
          return <span>{record.isHomePage?'是':'否'}</span>;
        },
      }, {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
        width:150,
      }, {
        title:'上线时间',
        dataIndex:'publishDate',
        key:'publishDate',
        width:150,
      },{
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        width:180,
        fixed: 'right',
        render:(data,record)=>(
            <div>
              {onlineOfflinePower?(<Popconfirm title="确定下线该视频吗?" onConfirm={()=>this.offLine(record)}><span><a className='operation'>下线</a></span></Popconfirm>):null}
                {
                  hasEditPower?(
                    <span>
                       <Divider type="vertical" />
                       <span><a className='operation' onClick={()=>this.editArticle(record)}>编辑</a></span>
                    </span>
                  ):null
                }
                <Divider type="vertical" />
                <span><a className='operation' onClick={()=>this.articleDetail(record)}>详情</a></span>
            </div>
        ),
      },
    ];
    const anotherColumns2=[
      {
        title:'发布人',
        dataIndex:'createUserName',
        key:'createUserName',
        width:100,
        fixed: 'left',
      },
      {
        title:'视频标题',
        dataIndex:'title',
        key:'title',
        width:100,
        fixed: 'left',
      },
      {
        title:'所属栏目',
        dataIndex:'categoryName',
        key:'categoryName',
      },{
        title:<span>浏览数<br/>(实际点击量)</span>,
        dataIndex:'viewCount',
        key:'viewCount',
        width:120,
        render:(data,record)=>{
          return <a onClick={()=>location.hash=pageJummps.videoView+`?id=${record.id}&type=2&tabsVale=3`} >{record.viewCount}({record.realViewCount})</a>;
        },
      },{
        title:'评论数',
        dataIndex:'commentCount',
        key:'commentCount',
        width:70,
        render:(data,record)=>{
          return <a onClick={()=>location.hash=pageJummps.videoComment+`?id=${record.id}&type=2&tabsVale=3`} >
            {record.commentCount}</a>;
        },
      },
      {
        title:'是否推送',
        dataIndex:'isPush',
        key:'isPush',
        width:80,
        render:(data,record)=>{
          return <span>{record.isPush?'是':'否'}</span>;
        },
      },
      {
        title:'是否上首页',
        dataIndex:'isHomePage',
        key:'isHomePage',
        width:80,
        render:(data,record)=>{
          return <span>{record.isHomePage?'是':'否'}</span>;
        },
      }, {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
        width:150,
      }, {
        title:'下线时间',
        dataIndex:'lastUpdateDate',
        key:'lastUpdateDate',
        width:150,
      },{
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        width:180,
        fixed: 'right',
        render:(data,record)=>(
            <div>
              {onlineOfflinePower?(<Popconfirm title="确定上线该视频吗?" onConfirm={()=>this.onTheLine(record)}><span><a className='operation'>上线</a></span></Popconfirm>):null}
                {
                  hasEditPower?(
                    <span>
                        <Divider type="vertical" />
                        <span><a className='operation' onClick={()=>this.editArticle(record)}>编辑</a></span>
                    </span>
                  ):null
                }
                <Divider type="vertical" />
                <span><a className='operation' onClick={()=>this.articleDetail(record)}>详情</a></span>
            </div>
        ),
      },
    ];
    const isOrNotOptions = [{ key: '1', value: '是' }, { key: '0', value: '否' }];
    const search = [
      { key: 'categoryId',label : '所属栏目', qFilter: 'Q=categoryId',type:'cascader',option: this.state.categoryData},
      { key: 'isPush', label: '是否推送', qFilter: 'Q=isPush', type: 'select', option: isOrNotOptions },
      { key: 'isHomePage', label: '是否上首页', qFilter: 'Q=isHomePage', type: 'select', option: isOrNotOptions },
      { key: 'title', label: '视频标题',qFilter:'Q=title',type:'input'},
      { key: 'createDate', label: '创建时间', type: 'rangePicker' },
    ];
    return (
      <Spin spinning={this.state.loading}>
        <div>
          <List
              hasPower={hasPower}
              type='video'
              url={pageJummps.VideoList}
              onChange={this.handleChangeTabs}
              operUrl={operUrl}
              onSelect={(value)=>this.getSelectedCategory(value)}
              columns={columns}
              columnsExamine={columnsExamine}
              anotherColumns={anotherColumns}
              anotherColumns2={anotherColumns2}
              search={search}
              updateKeyOne={this.state.updateKeyOne}
              updateKeyTwo={this.state.updateKeyTwo}
              updateKeyThree={this.state.updateKeyThree}
              updateKeyFour={this.state.updateKeyFour}
              tabsValeVideo={this.state.tabsValeVideo}
           />
           <Modal
              width={600}
              title="内容发布"
              visible={this.state.examineModal}
              footer={null}
              onCancel={()=>this.setState({examineModal:false,detailData:{}})}
              destroyOnClose={true}
              afterClose={()=>this.setState({examineModal:false,detailData:{}})}
            >
              <Examine 
                  detailData={this.state.detailData} 
                  pageData={this.props.pageData}
                  getData={this.props.getData}
                  closeExamine={this.closeExamine}
              />
            </Modal>
            <Modal
              width={1000}
              title="审核详情"
              visible={this.state.detailModal}
              footer={null}
              onCancel={()=>this.setState({detailModal:false,detailData:{}})}
              destroyOnClose={true}
              afterClose={()=>this.setState({detailModal:false,detailData:{}})}
            >
              <ExamineDetail 
                  detailData={this.state.detailData} 
                  closeDetail={this.closeDetail}
              />
            </Modal>  
        </div>
       </Spin>
    );
  }
}
class Examine2 extends Component{
  constructor(props){
      super(props);
      this.state={

      }
  }
  componentDidMount(){

  }

  handleSubmit = () =>{
    const {detailData,pageData} = this.props
    this.props.form.validateFields((err, fieldsValue) => {
        if(err){
          return;
        }
        let body={...fieldsValue,newsId:detailData.id,tenantId:sessionStorage.getItem('tenantId'),status:4,IsValid:1,publishDate:moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}
        postService(API_PREFIX+'services/web/config/review/insert',body,data=>{
            if(data.status === 1 ){
              message.success('提交成功')
              this.props.getData(API_PREFIX+`${pageJummps.VideoList}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState=${detailData.onlineState}&newsType=3`);
              this.props.closeExamine()
            }else{
              message.error(data.errorMsg)
              this.props.closeExamine()
            }
        })
    })
  }
  componentDidMount(){

  }

  render(){
      const {getFieldDecorator}=this.props.form;
      const formItemLayout = {labelCol: {span:4},wrapperCol:{span:20}}
      return(
        <div>

            <Form onSubmit={this.handleSubmit}>
              <Row>
                <div style={{textIndent:'30px'}}>
                提交审核之后，审核人会在个人任务中查看到相应内容，若审核通过则内容直接进行发布，若审核驳回，则您会收到系统邮件，邮件中将附带驳回理由，驳回之后，您可以选择再次提交审核。
                </div>
              </Row>
              <Row>
                  <FormItem {...formItemLayout} label='备注信息'>
                    {getFieldDecorator('remark', {
                      initialValue:'',
                      rules: [
                        {
                          type: 'string',
                          required: true,
                          whitespace: true,
                          // message: `备注信息为必填项`,
                          validator: (rule, value, callback)=>{
                            if(!value){
                              callback('备注信息为必填项');
                            }if(value.length>200){
                              callback('备注信息字数超过200字');
                            }else{
                              callback();
                            }
                        },
                        },
                      ],
                    })(
                      <TextArea placeholder='请填写备注信息，审核人可以查看您的备注信息' rows={4} />
                    )}
                </FormItem>
              </Row>
              <Row>
                  <Col span={3} offset={7}><Button className="resetBtn" onClick={()=>this.props.closeExamine()}>取消</Button></Col>
                  <Col span={3} offset={2}><Button className="queryBtn"  onClick={this.handleSubmit} >确定</Button></Col>
              </Row>
            </Form>
        </div>
      )
  }
}
let Examine = Form.create({})(Examine2)


class ExamineDetail2 extends Component{
constructor(props){
    super(props);
    this.state={
      startDate: '',
      endDate: '',
      selectedRowKeys: [],
      loading: false,
      total: 0,
      pageSize: 10,
      current: 1,
      query: '',
      data: [],
      newsId: 0,
      spinning: false,
      tabKey: '1',
      partyId: null,
      reportExcel: false,
      searchValue:''
    }
}
componentDidMount(){
    this.getData()
}
getData = () => {
  this.setState({spinning: true})
  let {current, pageSize} = this.state
  let {detailData} = this.props
  getService(`${API_PREFIX}services/web/news/article/getReviewInfoByUser/1/10?Q=newsId=${detailData.id}`, data => {
    if(data.status === 1) {
      this.setState({
        data: data.root.object||[],
        total: data.root.totalNum||0,
        spinning: false
      })
    }else {
      this.setState({spinning:false})
      message.error(data.errorMsg)
    }
  })
}
change = (page,pageSize) => {
  this.setState({
    current: page,
    pageSize: pageSize
  },() => {
    this.getData()
  })
}
pageSizeChange = (current, size) => {
  this.setState({
    current: 1,
    pageSize: size
  },() => {
    this.getData()
  })
}
render(){
  const {spinning } = this.state;

  let pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    total: this.state.total,
    current: this.state.current,
    pageSize: this.state.pageSize,
    onChange: this.change,
    onShowSizeChange: this.pageSizeChange,
    showTotal: total => `共 ${total} 条`
  }
  const columns=[
    {
      title: '栏目',
      dataIndex: 'catagoryName',
      key: 'catagoryName',
      width:100
    },
    {
      title: '审核人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      width:100
    },
    {
      title: '审核结果',
      dataIndex: 'status',
      key: 'status',
      width:120,
      render:(_,data)=>{
      return <span>{data.status===0?'未审核':data.status===1?'通过':data.status===2?'驳回':''}</span>
      }
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: '时间',
      dataIndex: 'lastUpdateDate',
      key: 'lastUpdateDate',
      width:160
    },
  ];
    return(
      <Spin spinning={spinning}>
        <div>
            <Table rowKey={'userId'} key={'userId'} columns={columns} dataSource={this.state.data} bordered={true} pagination={pagination} />
        </div>
      </Spin>

    )
}
}
let ExamineDetail = Form.create({})(ExamineDetail2)
export default Video;