




import React, { Component } from 'react';
import { Tabs ,Divider,Popconfirm,Message,Spin,Input,Modal,message} from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import API_PREFIX from '../../apiprefix';
import {postService,GetQueryString,getService } from '../../myFetch.js';
import {BEGIN} from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea;
@connect(
  state => ({
    pageData:state.table.pageData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
 class List extends  Component {

  constructor(props){
    super(props);
    this.state={
        updateKeyOne:0,//未发布标签下TABLE的key值，用于在点击时更新页面数据
        updateKeyTwo:0,//已上线标签下TABLE的key值，用于在点击时更新页面数据
        topicOption:[],
        typeOption:[],
        currentTabsKey:'0',//不同状态下，操作不同
        lookModal:false,//查看备注
        passModal:false,//通过对话框
        rebutModal:false,//驳回对话框
        reasonModal:false,
        passid:'',
        rebutid:'',
        rebutTxt:'',
        lookTxt:'',
        columns:[],
        reasonTxt:'',
        loading:false,
        detail:{},
    }
  }
  componentWillMount(){
    getService(API_PREFIX+`services/web/system/tree/category/getList`,data=>{
      if(data.status===1){
        let categoryList = [];
        categoryList.push(data.root.object[0])
        this.dealCategory(categoryList);

        this.setState({columns:categoryList})
      }
    })
  }
  dealCategory(values){
    values&&values.map((item,index)=>{
      item.value=item.id;
      item.label=item.name;
      item.children=item.subCategoryList;
      if(item.subCategoryList){
        this.dealCategory(item.subCategoryList);
      }
    });
  }
//切换标签
handleChangeTabs=(activeKey)=>{
    this.setState({
      currentTabsKey:activeKey,
    });
      if(activeKey=='0'){
        this.setState({
          updateKeyOne:this.state.updateKeyOne+1,
        });

      }else if(activeKey=='1'){
        this.setState({
          updateKeyTwo:this.state.updateKeyTwo+1,
        });

      }
  }

   //查看备注
  lookRemark=(dataid)=>{
    this.setState({lookModal:true,lookTxt:dataid.remark})
  }
  passcontent=(data)=>{
    this.setState({passid:data.newsId,detail:data})
    this.setState({passModal:true})
  }
  rebutcontent=(data)=>{
    this.setState({rebutid:data.newsId,detail:data})
    this.setState({rebutModal:true})
  }
  //查看
  lookOk=()=>{
    this.setState({lookModal:false,lookTxt:''})
  }
  lookCancel=()=>{
    this.setState({lookModal:false,lookTxt:''})
  }
  //通过
  passOk=()=>{
    let {detail} = this.state
    let userId = sessionStorage.getItem('id')
    let body ={newsId:this.state.passid,userId:userId}
    postService(API_PREFIX+`services/web/personal/work/isPass`,body,data=>{
      if(data.status===1){
        postService(API_PREFIX+`services/web/personal/work/isAllPass/${detail.newsId}`,{},data=>{
          if(data.status===1){
            message.success("审核通过成功")
            this.props.getData(API_PREFIX+`services/web/news/article/getReviewInfoByUser/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=status=0&Q=userId=${userId}`);
            this.setState({passModal:false})
            if(data.root.object === 2){
              if(detail.newsType === '视频'){
                getService(API_PREFIX+`services/web/news/vedio/vedioInfo/get/${detail.newsId}`,data=>{
                  if(data.status===1){
                    let allData = data.root.object
                      if(allData.isTimePublish){
                        let timeBody = {
                          "name": "视频资讯定时发布任务",
                          "type": "41",
                          "runTime":allData.publishDate,
                          "queryType": "post",
                          "queryUrl": API_PREFIX+'services/web/news/vedio/publish',
                          "queryValue": "{}",
                          "queryContentType": "application/json"
                        };
                        timeBody['queryValue'] = JSON.stringify({id:allData.id,categoryIdList:allData.categoryIdList})
                        postService(API_PREFIX + `services/web/system/taskParam/add`, timeBody, timeData => {
                          if (timeData.status === 1) {
                            allData['taskId'] = timeData.root.object.id
                            postService(API_PREFIX+'services/web/news/article/updateOther',allData,data=>{
                              if(data.status === 1){

                              }
                            })
                          }
                        })
                      }
                  }else{
                    Message.error(data.errorMsg)
                  }
                })
              }else{
                getService(API_PREFIX+`services/web/news/article/newsInfo/get/${detail.newsId}`,data=>{
                  if(data.status===1){
                    let allData = data.root.object
                      if(allData.isTimePublish){
                        let timeBody = {
                          "name": "文章资讯定时发布任务",
                          "type": "41",
                          "runTime":allData.publishDate,
                          "queryType": "post",
                          "queryUrl": API_PREFIX+'services/web/news/article/publish',
                          "queryValue": "{}",
                          "queryContentType": "application/json"
                        };
                        timeBody['queryValue'] = JSON.stringify({id:allData.id,categoryIdList:allData.categoryIdList})
                        postService(API_PREFIX + `services/web/system/taskParam/add`, timeBody, timeData => {
                          if (timeData.status === 1) {
                            allData['taskId'] = timeData.root.object.id
                            postService(API_PREFIX+'services/web/news/article/updateOther',allData,data=>{
                              if(data.status === 1){

                              }
                            })
                          }
                        })
                      }
                  }else{
                    Message.error(data.errorMsg)
                  }
                })
              }
            }
          }else{
            message.error(data.errorMsg)
          }
        })
      }else{
        message.error(data.errorMsg)
      }
    })

   
  }
  passCancel=()=>{
    this.setState({passModal:false})
  }
  //驳回
  remark=(data)=>{
    let txt=data.target.value;
    if(!txt){
      message.warning("驳回理由不得为空")
    }else if(txt.length>100){
      message.warning("驳回理由字数不得超过100")
    }
    this.setState({rebutTxt:data.target.value})
  }
  rebutOk=()=>{
    console.log(this.state.rebutTxt)
    console.log(this.state.rebutTxt.length)
    let {detail} = this.state
    if(this.state.rebutTxt){
      if(this.state.rebutTxt.length>100){
        message.warning("驳回理由字数不得超过100")
        return
      }
      let userId = sessionStorage.getItem('id')
      let body={
        userId:userId,
        newsId:this.state.rebutid,
        reason:this.state.rebutTxt,
      }
      console.log(body)
      postService(API_PREFIX+`services/web/personal/work/isTureDwon`,body,data=>{
        if(data.status===1){
          message.success("驳回成功")
          this.props.getData(API_PREFIX+`services/web/news/article/getReviewInfoByUser/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=status=0&Q=userId=${userId}`);
          this.setState({rebutTxt:'',rebutModal:false})
          if(detail.newsType === '视频'){
            getService(API_PREFIX+`services/web/news/vedio/vedioInfo/get/${detail.newsId}`,data=>{
              if(data.status===1){
                let allData = data.root.object
                  if(allData.taskId){
                    postService(API_PREFIX + `services/web/system/taskParam/delete/${taskId}`, {}, data => {
                      if (data.status === 1) {
                        console.log('删除成功');
                      }
                    });
                  }
              }else{
                Message.error(data.errorMsg)
              }
            })
          }else{
            getService(API_PREFIX+`services/web/news/article/newsInfo/get/${detail.newsId}`,data=>{
              if(data.status===1){
                let allData = data.root.object
                  if(allData.isTimePublish){
                    if(allData.taskId){
                      postService(API_PREFIX + `services/web/system/taskParam/delete/${taskId}`, {}, data => {
                        if (data.status === 1) {
                          console.log('删除成功');
                        }
                      });
                    }
                  }
              }else{
                Message.error(data.errorMsg)
              }
            })
          }
        }else{
          message.error(data.retMsg)
        }
      })
    }else{
      message.error("请填写驳回理由")
    }
    
   
  }
  rebutCancel=()=>{
    this.setState({rebutModal:false})
  }
  //进入详情页面
  enterDetail=(data)=>{
    console.log(data)
    if(data.newsType==='视频'){
      location.hash =`/PersonalWork/Examine/VideoDetail?newsId=${data.newsId}` 
    }else{
      location.hash =`/PersonalWork/Examine/ArtDetail?newsId=${data.newsId}`
    }
  }
  reasonOk=()=>{
    this.setState({reasonModal:false})
  }
  reasonCancel=()=>{
      this.setState({reasonModal:false})
    }
  lookReason=(data)=>{
      console.log(data)
      getService(API_PREFIX+`services/personal/review/reasonsInfo/${data.id}`,data=>{
        if(data.retCode===1){ 
          this.setState({reasonTxt:data.root.object,reasonModal:true})   
        }
      })
  }
   render(){
     const {lookTxt}=this.state
    const columns=[
        {
          title: '序号',
          key: 'sNum',
          dataIndex: 'sNum',
          width: 100,
          fixed: 'left'
        },
        {
          title: '标题',
          dataIndex: 'newsName',
          key: 'newsName',
        },
        {
          title: '类型',
          dataIndex: 'newsType',
          key: 'newsType',
          // render:(_,data)=>{
          // return <span>{data.newsType===1?'文字':data.newsType===2?'图片':data.newsType===3?'视频':data.newsType===4?'网页':''}</span>
          // }
        },
        {
          title: '所属栏目',
          dataIndex: 'catagoryName',
          key: 'catagoryName',
        },
        {
          title: '提交人',
          dataIndex: 'publisher',
          key: 'publisher',
        },
        {
          title: '提交时间',
          dataIndex: 'createDate',
          key: 'createDate',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width:260,
          fixed: 'right',
          render:(data,record)=>(
              <div>
                <a className='operation' onClick={()=>this.enterDetail(record)} >详情</a>
                <Divider type="vertical"/>
                <a className='operation' onClick={()=>this.lookRemark(record)}  >查看备注</a>
                <Divider type="vertical"/>
                <a className='operation' onClick={()=>this.passcontent(record)}   >通过</a>
                <Divider type="vertical"/>
                <a className='operation' onClick={()=>this.rebutcontent(record)}   >驳回</a>
              </div>
       )
        },
      ];
      const columnsTwo=[
        {
          title: '序号',
          key: 'sNum',
          dataIndex: 'sNum',
          width: 100,
          fixed: 'left'
        },
        {
          title: '标题',
          dataIndex: 'newsName',
          key: 'newsName',
        },
        {
          title: '类型',
          dataIndex: 'newsType',
          key: 'newsType',
          // render:(_,data)=>{
          // return <span>{data.newsType===1?'文字':data.newsType===2?'图片':data.newsType===3?'视频':data.newsType===4?'网页':''}</span>
          // }
        },
        {
          title: '所属栏目',
          dataIndex: 'catagoryName',
          key: 'catagoryName',
        },
        {
          title: '提交人',
          dataIndex: 'publisher',
          key: 'publisher',
        },
        {
          title: '审核时间',
          dataIndex: 'createDate',
          key: 'createDate',
        },
        {
          title: '审核状态',
          dataIndex: 'isValid',
          key: 'isValid',
          render:(data,record)=>(
                <span>{record.status===1?'通过':"驳回"}</span>
          )
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width:200,
          fixed: 'right',
          render:(data,record)=>(
              <div>
                <Divider type="vertical" />
                <a className='operation' onClick={()=>this.enterDetail(record)} >详情</a>
                <Divider type="vertical"/>
                <a className='operation' onClick={()=>this.lookRemark(record)}  >查看备注</a>
                <Divider type="vertical"/>
              </div>
       )
        },
      ];
      const search = [ { key: 'categoryId', label: '所属栏目', qFilter: 'Q=categoryId', type:'cascader', option: this.state.columns } ];
      const {updateKeyOne,updateKeyTwo}=this.state;
      const userId = sessionStorage.getItem('id')
     return(
      <Spin spinning={this.state.loading}>
        <div>
        <Tabs type="card" onChange={this.handleChangeTabs} className="tabCommon">
            <TabPane tab="待审核" key="0">
              <TableAndSearch
                  key={updateKeyOne}
                  columns={columns}
                  search={search}
                  urlfilter={`Q=status=0&Q=userId=${userId}`}
                  url={'services/web/personal/work/getReviewInfoByUser'}
              />
            </TabPane>
            <TabPane tab="已审核" key="1">
              <TableAndSearch
                  key={updateKeyTwo}
                  columns={columnsTwo}
                  search={search}
                  urlfilter={`Q=status=1&Q=userId=${userId}`}
                  url={'services/web/personal/work/getReviewInfoByUser'}
              />
            </TabPane>
        </Tabs>
        <Modal
              style={{textAlign:'center'}}
              width={500}
              centered={true}
              title={'查看备注'}
              cancelText={'取消'}
              okText={'确定'}
              visible={this.state.lookModal}
              destroyOnClose={true}
              onOk={this.lookOk}
              onCancel={this.lookCancel}
          >
          {
            this.state.lookTxt? <TextArea defaultValue={this.state.lookTxt}  disabled={true}  autosize={{ minRows: 8, maxRows: 10 }}/>:null
          }
        
          </Modal>
          <Modal
              style={{textAlign:'center'}}
              width={500}
              centered={true}
              title={'审核通过'}
              cancelText={'取消'}
              okText={'确定'}
              visible={this.state.passModal}
              destroyOnClose={true}
              onOk={this.passOk}
              onCancel={this.passCancel}
          >
           <p>{'审核通过之后，审核内容将直接进行发布，若提交内容设置了定时发布，则到定时时间后文章自动发布。'}</p>
          </Modal>
          <Modal
              style={{textAlign:'center'}}
              width={500}
              centered={true}
              title={'审核驳回'}
              cancelText={'取消'}
              okText={'确定'}
              visible={this.state.rebutModal}
              destroyOnClose={true}
              onOk={this.rebutOk}
              onCancel={this.rebutCancel}
          ><p style={{textAlign:'left'}}>{'驳回理由'}</p>
           <TextArea onChange={(value)=>this.remark(value)}  autosize={{ minRows: 8, maxRows: 10 }}/>
          </Modal>
          <Modal
              style={{textAlign:'center'}}
              width={500}
              centered={true}
              title={'驳回理由'}
              cancelText={'取消'}
              okText={'确定'}
              visible={this.state.reasonModal}
              destroyOnClose={true}
              onOk={this.reasonOk}
              onCancel={this.reasonCancel}
          >
           <TextArea disabled={true} defaultValue={this.state.reasonTxt} autosize={{ minRows: 8, maxRows: 10 }}/>
          </Modal>
      </div>
      </Spin>
     );
   }
}

export default List;
