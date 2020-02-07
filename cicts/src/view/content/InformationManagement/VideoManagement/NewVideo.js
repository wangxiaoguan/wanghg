import React, { Component } from 'react';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import { Tabs, Select, Button, Message, Table, Input, Modal, Form, Radio, Cascader,Row,Col  } from 'antd';
import { postService, getService } from '../../myFetch';
import FormAndInput from '../../../component/table/FormAndInput';
import {pageJummps} from '../PageJumps';
import moment from 'moment';
import API_PREFIX from '../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN, getPageData } from '../../../../redux-root/action/table/table'; 
import { setSelectTreeData, setCheckTreeData, } from '../../../../redux-root/action/tree/tree';
const TextArea = Input.TextArea
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Search = Input.Search;
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData: state.table.pageData,
    selectRowsData: state.table.selectRowsData,
    checkTreeData: state.tree.treeCheckData,
    selectDetail: state.tree.treeSelectData.selectDetail,
    selectTreeData: state.tree.treeSelectData,
    timePushData: state.flowData.timePushData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    setSelectData: n => dispatch(setSelectTreeData(n)),
    setCheckData: n => dispatch(setCheckTreeData(n)),
    getPageData:n=>dispatch(getPageData(n)), 
  })
)
class NewVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dp: [],
      showAddModal: false,
      keyAddModal: 1,
      set: function () { },
      authorOption: [],
      update: 0,
      publishModal: false,
      submithModal: false,
      allData: [],
      submitTxt: '',
      newsId: '',
      allstop: true,
      allvalue: '',
      type: '',
      reviewerList:[],
      newsType:1,
      qfilter: '', 
      examineModal:false,
      detailData:{},
      //三个步骤对象
      steps: [
        {
          title: '填写视频信息',
          content: [{ key: 'title', label: '视频标题', type: 'input', required: true ,max: 60},
          { key: 'digest', label: '视频摘要', type: 'input' },
          {
            key: 'auth', label: '作者', type: 'infoAuth', disabled: true, ButtonList: [
              { key: 'auth', label: '添加作者', type: 'Button', onClick: this.addAuthor },
              { key: 'auth', label: '删除作者', type: 'Button', onClick: this.deleteAuthor },
            ]
          },
          { key: 'orgType', label: '资讯归属', type: 'infoBelong', required: true,option:infoOption},
          // { key: 'layout', label: '布局形式', type: 'radioButton', option: layoutOption, required: true },
          { key: 'titleimage', label: '标题图片', type: 'uploadPicture_drop', required: true, isIamge: true },
          { key: 'contentImage', label: '内容图片', type: 'filePicture', required: true, isIamge: true,datatype:'video',style:'add' },
          { key: 'content', label: '视频内容', type: 'richText', required: false }, //rich text
          { key: 'categoryIdList', label: '所属栏目', type: 'infoColumnTree', required: true },
          { key: 'video', label: '视频地址', type: 'video', required: true },
          { key: 'url' },
          { key: 'desp' },
          { key: 'videoLong' },
          { key:'orgType'},//资讯归属
          { key:'orgId'},//归属选择
          { key:'depCategory'},
          { key:'remark'}
          ],
          url: pageJummps.VideoAdd,
          updateUrl: pageJummps.VideoEditOne,
        },
        {
          title: '选择发布范围',
          content: '',
          url: pageJummps.InfoAuthorityAdd,
        },
        {
          title: '其他设置',
          content: [
            { key: 'point', label: '奖励经验值数', type: 'inputNumber' },
            // { key: 'treasure', label: '奖励积分数', type: 'inputNumber' },
            // { key: 'treasureProvider', label: '积分提供方', type: 'cascader', options: [] },
            { key: 'isComment', label: '是否可评论', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isNickComment', label: '是否可匿名评论', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isShare', label: '是否可分享', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isInnerShare', label: '是否只能内部转发', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isHomePage', label: '是否上首页', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isPush', label: '是否推送', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isTimePublish', label: '是否定时发送', type: 'isTimePublish', required: true },
            { key: 'isImportant', label: '是否永不清理', type: 'radioButton', option: isOrNotOption , required: true },
          ],
          url: pageJummps.VideoEditThree,
          onlineUrl: pageJummps.VideoPush,
        },
      ],

    };
  }

  componentDidMount() {
    this.dealData();
  }
  dealData = () => {
      // getService(API_PREFIX + pageJummps.DepartmentTree, data => {
      //     if (data.status === 1) {
      //         let organizationData = data.root.object;
      //         this.dealDepartmentData(organizationData);
      //         this.setState({ dp: organizationData }, () => {
      //             let temp = [...this.state.steps];
      //             temp[2].content[2].option =organizationData;
      //             this.setState({ steps: temp, update: this.state.update + 1 });
      //         });
      //     }
      // });
      let localPowers = window.sessionStorage.getItem('powers')
      let powers = JSON.parse(localPowers)
      let departPower=powers && powers['20004.21501.000'];//部门权限
      let partyPower=powers && powers['20005.23001.003'];//党组织权限
      let unionPower=powers && powers['20007.21704.000'];//工会权限
      let type = 1;
      if(departPower&&partyPower&&!unionPower){//110
          type = 1;
      }else if(departPower&&!partyPower&&unionPower){//101
          type = 1;
      }else if(!departPower&&partyPower&&unionPower){//011
          type = 2;
      }else if(departPower&&!partyPower&&!unionPower){//100
          type = 1;
      }else if(!departPower&&!partyPower&&unionPower){//001
          type = 3;
      }else if(!departPower&&partyPower&&!unionPower){//010
          type = 2;
      }else if(departPower&&partyPower&&unionPower){//111
          type = 1;
      }
      console.log(type)
      this.setState({newsType:type})
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
  //添加作者
  addAuthor = (key, get, set) => {
    localStorage.setItem("selectedRowKeys", '')
    this.setState({showAddModal: true,keyAddModal: this.state.keyAddModal + 1,set,});
  }
  //删除作者
  deleteAuthor = (key, get, set) => {
    set(key, '');//将对应的input（通过key对应）框置空
  }
  //添加作者
  handleAddModalOK = () => {
    this.setState({ showAddModal: false });
    let selectedData = this.props.selectRowsData;
    this.state.set('auth', selectedData[0].name);
  }
  //取消作者
  handleAddModalCancel = () => {
    this.setState({ showAddModal: false });
  }
  //搜索作者
  handleInput = (e) => {
    let qfilter = e.target.value == '' ? '' : `Q=name=${e.target.value}` 
    this.setState({qfilter})
    this.props.getPageData({currentPage: 1, pageSize: 10, query: qfilter}); 
    this.props.getData(API_PREFIX+`${pageJummps.InfoAuthor}/1/10?${qfilter}`);
  }
  infoExamine = (e,isTime) => {
    console.log(e)//{ ...this.state.id, categoryIdList: this.state.categoryIdList };
    let body = e.categoryIdList
    postService(API_PREFIX+'services/web/config/review/getPanListByCategoryId',body,data=>{
        if(data.status === 1){
            if(!data.root.object){
                let body2 =  {id: e.id};
                    if(!isTime){
                      postService(API_PREFIX+pageJummps.VideoPush,body2,dataTwo=>{
                        if(dataTwo.status===1){
                            Message.success('发布成功');
                            location.hash='/InformationManagement/Video'
                         }else{
                            Message.error(dataTwo.errorMsg)
                         }
                      });
                    }else{
                      let body = {
                        queryValue:JSON.stringify(e),
                        runTime:this.props.timePushData,
                        name: "文章资讯定时发布任务",
                        type: "41",
                        queryType: "post",
                        queryUrl: API_PREFIX+pageJummps.VideoPush,
                        queryContentType: "application/json"
                      }
                      postService(API_PREFIX + `services/web/system/taskParam/add`, body, timeData => {
                        if (timeData.status === 1) {
                          Message.success(`保存成功！将于${this.props.timePushData}定时发布`);
                          location.hash='/InformationManagement/Video'
                        }else{
                          Message.error(dataTwo.errorMsg)
                          location.hash='/InformationManagement/Video'
                        }
                      })
                    }

                  
            }else{
                this.setState({examineModal:true,detailData:e})
            }
        }else{
          Message.error(data.errorMsg)
        }
    })
  }
  closeExamine = () => {
    this.setState({examineModal:false,detailData:{}})
}
  render() {
    const columns = [
      {
        title: '员工号',
        dataIndex: 'userNo',
        key: 'userNo',
      },

      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '部门',
        dataIndex: 'fullName',
        key: 'fullName',
      },
    ];
    const timePush = {
      body: {
          "name": "视频资讯定时发布任务",
          "type": "41",
          "runTime": "2019-08-23 15:39:08",
          "queryType": "post",
          "queryUrl": API_PREFIX+pageJummps.VideoPush,
          "queryValue": "{}",
          "queryContentType": "application/json"
      },
    };
    return (
      <div>
        <EventAndInfoAdd
          update={this.state.update}
          type="information"
          steps={this.state.steps}
          submitText="保存并发布"
          style="add"
          save={`/InformationManagement/Video?tabsVale=${sessionStorage.getItem('videoTabsKey')}`}
          timePush={timePush}
          belonged="video"
          datatype={'video'}
          newsType={this.state.newsType}
          savePublish={'savePublish'}
          allstop={this.state.allstop}
          infoExamine={this.infoExamine}
        >
        </EventAndInfoAdd>
        <Modal
            width={1000}
            title="添加作者"
            visible={this.state.showAddModal}
            cancelText="取消"
            okText="添加"
            onOk={this.handleAddModalOK}
            onCancel={this.handleAddModalCancel}
            destroyOnClose={true}
          >
            <FormAndInput
              columns={columns}
              url={pageJummps.InfoAuthor}
              onSearch={this.handleInput}
              qfilter={this.state.qfilter}
            />
          </Modal>
          <Modal
              width={600}
              title="内容发布"
              visible={this.state.examineModal}
              footer={null}
              onCancel={()=>this.setState({examineModal:false})}
              destroyOnClose={true}
              afterClose={()=>this.setState({examineModal:false})}
            >
              <Examine 
                  closeExamine={this.closeExamine}
                  detailData={this.state.detailData} 
              />
          </Modal>
      </div>
    );
  }

}
//布局形式
const layoutOption = [
  { label: '左右', value: '1' },
  { label: '上下', value: '2' },
];
const isOrNotOption = [
  { label: '是', value: 'true' },
  { label: '否', value: 'false' },
];
const infoOption = [
  { label: '按照企业部门归属', value: 1 },
  { label: '按照党组织归属', value: 2 },
  { label: '按照工会归属', value: 3 },
]
class Examine2 extends Component{
  constructor(props){
      super(props);
      this.state={

      }
  }
  componentDidMount(){

  }

  handleSubmit = () =>{
    const {detailData} = this.props
    this.props.form.validateFields((err, fieldsValue) => {
        if(err){
          return;
        }
        let body={...fieldsValue,newsId:detailData.id,tenantId:sessionStorage.getItem('tenantId'),status:4,IsValid:1,publishDate:moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}
        postService(API_PREFIX+'services/web/config/review/insert',body,data=>{
            if(data.status === 1 ){
              Message.success('提交成功')
              location.hash='/InformationManagement/Video'
              this.props.closeExamine()
            }else{
              Message.error(data.errorMsg)
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
export default NewVideo;