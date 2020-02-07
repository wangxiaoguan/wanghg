import React, { Component } from 'react';
import { Tabs, Select, Button, Message, Table, Input, Modal, Form, Radio, Cascader,Row,Col } from 'antd';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import FormAndInput from '../../../component/table/FormAndInput';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { postService, getService } from '../../myFetch';
import moment from 'moment';
import { pageJummps } from '../PageJumps';
import API_PREFIX from '../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN,getPageData } from '../../../../redux-root/action/table/table'; // yelu 2019-01-16 取出缓存里面设置分页数据函数getPageData
import SingleTree from '../../../component/EventAndInfoAdd/SingleTree';//栏目管理
import VerifyTree from '../../../component/EventAndInfoAdd/verifyTree';
import { setSelectTreeData, setCheckTreeData, } from '../../../../redux-root/action/tree/tree';//栏目管理树形选择
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
    timePushData: state.flowData.timePushData,//xwx/2018/12/3
    powers: state.powers,//权限码xwx2018/12/24
    timePushData: state.flowData.timePushData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    setSelectData: n => dispatch(setSelectTreeData(n)),
    setCheckData: n => dispatch(setCheckTreeData(n)),
    getPageData:n=>dispatch(getPageData(n)), // yelu 2019-01-02 每次查询时初始缓冲里面的页码为默认值
  })
)
class NewArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newsTypeOptions: [],//文章类型(lookup字典中)
      dp: [],//文章归属部门
      partyData: [],//文章归属党组织
      showAddModal: false,//展示作者列表，数据来源于用于管理
      keyAddModal: 1,//作者列表的key值
      inputValue: '',//查询时输入框的内容
      selectedRowKeys: [],//当前选中
      currentValue: '',//文章归属  单选按钮选中的值
      set: function () { },
      authorOption: [],
      update: 0,
      publishModal: false,//内容发布
      submithModal: false,//提交审核
      submitTxt: '',//审核备注信息
      newsId: '',
      allstop: true,
      allvalue: '',
      type: '',
      taskIdUpdate:'',//更新时，获取到的任务id
      liveList:[],//直播间数据
      reviewerList:[],
      newsType:1,
      examineModal:false,
      detailData:{},
      qfilter: '', // yelu 2019-01-16 添加作者查询条件字段 
      //三个步骤对象
      steps: [
        {
          title:'填写文章信息',
          content:[
            { key: 'newsType', label: '文章类型', type: 'information_type', option:[], required: true},
            { key: 'title', label: '文章标题', type: 'input', required: true, max:60},
            { key: 'digest', label: '文章摘要', type: 'input' },
            {
              key: 'auth', label: '作者', type: 'infoAuth', disabled: true, ButtonList: [
                { key: 'auth', label: '添加作者', type: 'Button', onClick: this.addAuthor },
                { key: 'auth', label: '删除作者', type: 'Button', onClick: this.deleteAuthor },
              ]},
            { key: 'orgType', label: '资讯归属', type: 'infoBelong', required: true,option:infoOption},
            { key: 'layout', label: '布局形式', type: 'radioButton', option:PicLayoutOption ,required: true ,hide:[1,4]},
            { key: 'layout', label: '布局形式', type: 'radioButton', option:layoutOption ,required: true ,hide:[2]},
            { key: 'titleImage', label: '标题图片', type: 'uploadPicture_drop',required:true,isIamge:true},
            { key: 'contentImage', label: '内容图片', type: 'filePicture',describe:true,hide:[4],isIamge:true,style:'add',datatype:'articleContent',required: false,},
            { key: 'isAtlas', label: '是否设置为图集', type: 'radioButton', option:atlasOption ,required: true,hide:[4] },
            { key: 'imageType', label: '图片类型', type: 'radioButton', option:imageTypeOp,hide:[4] },
            { key: 'url', label: '网页地址', type: 'inputUrl', describe:false,hide:[1,2],required:true},
            { key: 'content', label: '文章内容', type: 'richText',hide:[2,4],required:true},
            { label: '关联类型测试', type: 'relation',hide:[2,4]},
            // { key: 'categoryIdList', label: '所属栏目', type: 'columnTree', required: true,},
            { key: 'categoryIdList', label: '所属栏目', type: 'infoColumnTree', required: true,},
            { key: 'newsAttachs', label: '上传附件', type: 'filePicture', describe:false,hide:[4],isAttach:true,style:'add',datatype:'articleAttachs'},
            { key:'orgType'},
            { key:'orgId'},
            { key:'relationType'},
            { key:'url'},
            { key:'depCategory'},
            { key:'remark'}
          ],

          url: pageJummps.ArticleAdd,
          updateUrl: pageJummps.ArticleEditOne,
        },
        {
          title: '选择发布范围',
          content: '',
          url: pageJummps.InfoAuthorityAdd,
        },
        {
          title: '其他设置',
          content: [
            { key: 'exp', label: '奖励经验值数', type: 'inputNumber' },
            // { key: 'point', label: '奖励积分数', type: 'inputNumber' },
            { key: 'isComment', label: '是否可评论', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isNickComment', label: '是否可匿名评论', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isShare', label: '是否可分享',  type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'isInnerShare', label: '是否只能内部转发', type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'isHomePage', label: '是否上首页',  type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isPush', label: '是否推送',  type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'isTimePublish', label: '是否定时发送', type: 'isTimePublish', required: true },
            { key: 'isImportant', label: '是否永不清理', type: 'radioButton', option: isOrNotOption , required: true },
          ],
          url: pageJummps.ArticleEditThree,
          onlineUrl: pageJummps.ArticlePush,
        },
      ],
    };
  }
  componentWillMount() {
    console.log(React)
  }

  componentDidMount() {
    this.dealData();
  }
  dealData = () => {
      //文章类型
      getService(API_PREFIX+pageJummps.ArticleType,data=>{
          if(data.status === 1){
              let steps = this.state.steps;
              this.dealLookup(data.root.object);
              steps[0].content[0].option = data.root.object
              this.setState({steps,update: this.state.update + 1 });
          }else{
            Message.error(data.errorMsg)
          }
      });
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

  //处理文章类型的数据
  dealLookup(data) {
    data.map(item => {
      item.key = Number(item.code);
      item.value = item.fieldName;
    });
  }
  //添加作者
  addAuthor = (key, get, set) => {
    localStorage.setItem("selectedRowKeys", '')
    this.setState({showAddModal: true,keyAddModal: this.state.keyAddModal + 1,set})
  }
  //删除作者
  deleteAuthor = (key, get, set) => {
      set(key, '');
  }
  //添加作者
  handleAddModalOK = () => {
      this.setState({ showAddModal: false });
      let selectedData = this.props.selectRowsData;
      this.state.set('auth',selectedData[0].name);
  }
  //取消作者
  handleAddModalCancel = () => {
      this.setState({ showAddModal: false });
  }
  //搜索作者
  handleInput = (e) => {
      let qfilter = e.target.value == '' ? '' : `Q=name=${e.target.value}`
      this.setState({qfilter,})
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
                      postService(API_PREFIX+pageJummps.ArticlePush,body2,dataTwo=>{
                        if(dataTwo.status===1){
                            Message.success('发布成功');
                            location.hash='/InformationManagement/Article'
                         }else{
                            Message.error(dataTwo.errorMsg)
                         }
                      });
                    }else{
                      let body = {
                        queryValue:JSON.stringify(e),
                        runTime:this.props.timePushData,
                        name: "视频资讯定时发布任务",
                        type: "41",
                        queryType: "post",
                        queryUrl: API_PREFIX+pageJummps.ArticlePush,
                        queryContentType: "application/json"
                      }
                      postService(API_PREFIX + `services/web/system/taskParam/add`, body, timeData => {
                        if (timeData.status === 1) {
                          Message.success(`保存成功！将于${this.props.timePushData}定时发布`);
                          location.hash='/InformationManagement/Article'
                        }else{
                          Message.error(dataTwo.errorMsg)
                          location.hash='/InformationManagement/Article'
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
          "name": "文章资讯定时发布任务",
          "type": "41",
          "runTime": "2019-08-23 15:39:08",
          "queryType": "post",
          "queryUrl": API_PREFIX+pageJummps.ArticlePush,
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
          save={`/InformationManagement/Article?tabsVale=${sessionStorage.getItem('TabsKey')}`}
          timePush={timePush}
          belonged="article"
          newsType={this.state.newsType}
          datatype={'article'}
          savePublish={'savePublish'}
          allstop={this.state.allstop}
          infoExamine={this.infoExamine}
        />
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
            qfilter={this.state.qfilter} // yelu 2019-01-16 传递过去查询条件，修改分页后不带查询条件的问题
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
//布局形式——图片
const PicLayoutOption = [
  { label: '左右', value: 1 },
  { label: '上下', value: 2 },
  { label: '三张图片依次排开', value: 3 },
];
//布局形式——非图片
const layoutOption = [
  { label: '左右', value: 1 },
  { label: '上下', value: 2 },
  { label: '纯文本', value: 0 },

];
//图片类型
const imageTypeOp = [
  { label: '大横幅', value: 1 },
  { label: '小横幅', value: 2 },
];
//是否设置为图集
const atlasOption = [
  { label: '是', value: true },
  { label: '否', value: false },
];
const isOrNotOption = [
  { label: '是', value: true },
  { label: '否', value: false },
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
              location.hash='/InformationManagement/Article'
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
export default NewArticle;
