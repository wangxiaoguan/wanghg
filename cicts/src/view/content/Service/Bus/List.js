import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {Button,Modal,Form,Input,Radio,Message,Divider,Spin, Icon,TimePicker,Select} from 'antd';  
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {  BEGIN,getDataSource,getPageData } from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
import {postService,getService} from '../../myFetch';
import API_PREFIX, {DEFAULT_LOGIN_URL} from '../../apiprefix';
import moment from 'moment';
// import './company.lnpm ess';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
class List extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      value: true,
      record:{},
      flag:true,
      key:100,
      edition:[],
      isEdit:false,
      validMobile:{retCode:0},
      userId:'',
      subM:false,
      disable:false,
      isAdd:false,
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
      flag:false,
      key:this.state.key + 1,
      isEdit:false,
      isAdd:true,
      userId:0
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      key:this.state.key + 1
    });
  }
  editHotWordName =(record) => {
    console.log(record)
    this.setState({
      visible: true,
      record:record,
      flag:true,
      key:this.state.key + 1,
      isEdit:false,
      userId:record.id,
      disable:false,
      isAdd:false,
    });
  }
  lookHotWordName = (record) => {
  	this.setState({
      visible: true,
      record:record,
      flag:true,
      key:this.state.key + 1,
      isEdit:true,
      disable:true,
      isAdd:false,
    });
  }
  getData = async(url) => {
    await this.props.getData(API_PREFIX + `${url}`);
  }
  getVisible = (visible) => {
    this.setState({
      visible:visible
    })
  }
  disabled = (record) => {
    let status;
    if(record.status == 1){
        status = 2
    }else{
        status = 1
    }
    postService(API_PREFIX + `services/system/company/update`,{"id":record.id,"status":status},data => {
      if (data.retCode == 1) {
        Message.success("设置成功!")
        this.getData(`services/system/company/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      }else{     
          
      }
    });
  }
  redirect = (record) => {
    console.log("record",record)
     window.localStorage.acount = record.user.acount;
     window.localStorage.company = "company";
     window.open(DEFAULT_LOGIN_URL)
  }
  //重置userId
  resetUserId = () => {
    this.setState({
      userId:0
    })
  }
  render() {
    let powers = this.props.powers;
    console.log('权限码', powers);
    let hasAddPower = powers && powers['20888.22001.001'];
    let hasDelPower = powers && powers['20888.22001.004'];
    let hasEditPower = powers && powers['20888.22001.002'];
    let hasSearchPower = powers && powers['20888.22001.003'];
    console.log("this.props.pageData",this.props.pageData)
    const columns=[
      {
        title:'编号',
        dataIndex:'no',
        key:'no',
      },
      {
        title:'班车牌照',
        dataIndex:'license',
        key:'license',
      },
      {
        title:'车号',
        dataIndex:'carNum',
        key:'carNum',
      },
      {
        title:'车架号',
        dataIndex:'jjh',
        key:'jjh',
      },
      {
        title:'路线',
        width:200,
        dataIndex:'way',
        key:'way',
      },
      {
        title:'上午发车时间',
        dataIndex:'moring',
        key:'moring',
      },
      {
        title:'下午发车时间',
        dataIndex:'night',
        key:'night',
      },
      {
        title:'区域',
        dataIndex:'zone',
        key:'zone',
      },{
        title:'司机',
        dataIndex:'driver',
        key:'driver',
      },{
        title:'司机电话',
        dataIndex:'driverPhone',
        key:'driverPhone',
      },
      {
        title:'班车圈',
        dataIndex:'groupName',
        key:'groupName',
      },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        render:(data,record)=>(
          <div>
            <a className='operation' disabled={!hasEditPower} onClick={this.editHotWordName.bind(this,record)}>编辑</a>
            <Divider type="vertical" />
            <a className='operation' disabled={!hasSearchPower} onClick={this.lookHotWordName.bind(this,record)}>详情</a>
          </div>
        ),
      }

    ];
    return (
        <div>
          <TableAndSearch columns={columns} 
           addBtn={hasAddPower ?{order:1,OnEvent:this.showModal}: null}  
           deleteBtn={hasDelPower ?{order:2,url:'services/servicemanager/shuttleManagement/deleteBusManagement',field:'idList'}: null} 
           url={'services/servicemanager/shuttleManagement/busManagementShow'}
          //  delUrl={'services/servicemanager/shuttleManagement/deleteBusManagement'}
          >

          </TableAndSearch>
          <Modal
            title={this.state.flag ? "班车信息" : "添加班车"}
            maskClosable={false}//点击蒙层是否关闭
            footer={null}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            key={this.state.key}
            className="company modal"
          >
            <WrappedNormalLoginForm resetUserId={this.resetUserId} isAdd={this.state.isAdd} disable={this.state.disable} userId={this.state.userId} isEdit={this.state.isEdit} getData={this.getData} handleCancel={this.handleCancel} record={this.state.record} flag={this.state.flag} url={'services/system/company/list'} visible={this.state.visible} getVisible={this.getVisible}
            pageData={this.props.pageData}/>
          </Modal>
        </div>
    );
  }
}


class NormalLoginForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      visible: this.props.visible,
      pageData:this.props.pageData,
      validUserno:{},
      edition:[],
      provinceDatas:[]
    }
  }

  componentWillMount(){
  	
    // this. detaileData();

  }
  detaileData = () =>{
    getService(API_PREFIX + `services/servicemanager/shuttleManagement/detailedBusManagement/${this.props.record.id}`,data => {
      console.log('data222',data);
      if (data.retCode == 1) {
        console.log(data)
        this.setState({
          edition:data.root,
        })
      }else{     
          
      }
    });
  }


  handleSubmit = (e) => {
    e && e.preventDefault();
    // this.setState({
      // subM:true
    // })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // {no:values.no}
        // let no = JSON.parse(values.no)
        let no = values.no
        let userId = this.props.userId?this.props.userId:0
        getService(`${API_PREFIX}services/servicemanager/shuttleManagement/getBusByNo/${no}/${userId}` ,data=>{
          if(data.retCode >= 1){
            Message.error('班车编号已存在，请重新输入编号！');
            return
          }else{
            // Message.loading('加载中...,切勿重复提交！以免影响体验!')

            // values.moring= this.props.moring;
            // values.night= this.props.night;
            //时间转换
            values['moring']= values['moring'].format('HH:mm:ss');
            values['night']= values['night'].format('HH:mm:ss');
            console.log('Received values of form: ', values);
            if(this.props.flag){
              values.id = this.props.record.id;
              postService(API_PREFIX + `services/servicemanager/shuttleManagement/updateBusManagement`,values, data => {
                if (data.retCode == 1) { 
                  Message.success("修改成功!");
                  this.props.getData(`services/servicemanager/shuttleManagement/busManagementShow/${this.state.pageData.currentPage}/${this.state.pageData.pageSize}`);
                  this.props.resetUserId()
                  this.setState({
                    visible:false,
                    subM:false,
                  },() => {
                    this.props.getVisible(this.state.visible)
                  })
                } else {     
                  Message.warning(data.retMsg);
                }
              });
              
            }else{
              postService(API_PREFIX + `services/servicemanager/shuttleManagement/addBusManagement`,values, data => {
                if (data.retCode == 1) {
                  Message.success("新增成功!");
                  this.props.getData(`services/servicemanager/shuttleManagement/busManagementShow/${this.state.pageData.currentPage}/${this.state.pageData.pageSize}`);
                  this.props.resetUserId()
                  this.setState({
                    visible:false,
                    subM:false,
                  },() => {
                    this.props.getVisible(this.state.visible)
                  })
                } else {     
                  Message.warning(data.retMsg);
                }
              });
            }
          }
        });
          }
        })
    // this. detaileData();
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;
    //区域选择
    const Option = Select.Option;
    const provinceData = ['武昌', '汉口','汉阳','摆渡'];

    if(this.props.flag){
      var no = this.props.record.no        //编号
      var jjh = this.props.record.jjh       //车架号
      var license = this.props.record.license   //车牌号
      var driver = this.props.record.driver
      var driverPhone = this.props.record.driverPhone
      var morings = this.props.record.moring
      var nights = this.props.record.night
      var way = this.props.record.way
      var zone = this.props.record.zone
      var carNum = this.props.record.carNum
      var moring = moment(morings, 'HH:mm')
      var night = moment(nights, 'HH:mm')
      var carHead = this.props.record.carHead
      var carHeadPhone = this.props.record.carHeadPhone 
      var groupName = this.props.record.groupName
    }else{
      var no = ''
      var jjh = ''
      var driver = ''
      var driverPhone = ''
      var moring = ''
      var night = ''
      var way = ''
      var zone = ''
      var carNum = ''
      var carHead = ''
      var carHeadPhone = ''
      var groupName = ''
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem 
        label="编号" 
        {...formItemLayout}>
          {getFieldDecorator('no', {
            rules: [{required: true, message: '请输入班车编号'}, {
              // validator: this.handleValidMobile
            }],
            initialValue:no
          })(
            <Input placeholder="请输入班车编号" disabled={this.props.disable}/>
          )}
        </FormItem>
         <FormItem 
        label="班车牌照" 
        {...formItemLayout}>
          {getFieldDecorator('license', {
            rules: [{ required: true, message: '请输入班车牌照'}, {
              //validator: this.handleValidMobileCopy
            }],
            initialValue:license
          })(
            <Input placeholder="请输入班车牌照" disabled={this.props.disable} />
          )}
        </FormItem>
        <FormItem 
        label="车号" 
        {...formItemLayout}>
          {getFieldDecorator('carNum', {
            rules: [{ required: true, message: '请输入车号'}, {
              //validator: this.handleValidMobile
            }],
            initialValue:carNum
          })(
            <Input placeholder="请输入车号" disabled={this.props.disable}/>
          )}
        </FormItem>
        <FormItem 
        label="车架号" 
        {...formItemLayout}>
          {getFieldDecorator('jjh', {
            initialValue:jjh
          })(
            <Input placeholder="请输入车架号" disabled={this.props.disable}/>
          )}
        </FormItem>
        <FormItem 
        label="路线" 
        {...formItemLayout}>
          {getFieldDecorator('way', {
            rules: [{ required: true, message: '请输入路线'}, {
              //validator: this.handleValidMobile
            }],
            initialValue:way
          })(
            <Input placeholder="请输入路线" disabled={this.props.disable}/>
          )}
        </FormItem>
        <FormItem 
        label="上午发车时间" 
        {...formItemLayout}>
          {getFieldDecorator('moring', {
            rules: [{required: true,
              validator: (rule, value, callback)=>{
                if(!value){
                  callback('请选择上午发车时间')
                }else{
                  callback()
                }
              }}],
            initialValue:moring,
          })(
            <TimePicker disabled={this.props.disable}/>
          )}
        </FormItem>
        <FormItem 
        label="下午发车时间" 
        {...formItemLayout}>
          {getFieldDecorator('night', {
            rules: [{ required: true,
              validator: (rule, value, callback)=>{
                console.log(value)
                if(!value){
                  callback('请选择下午发车时间')
                }else{
                  callback()
                }
              }
            }],
            initialValue:night,
          })(
            <TimePicker disabled={this.props.disable}/>
          )}
        </FormItem>
        <FormItem 
        label="区域" 
        {...formItemLayout}>
          {getFieldDecorator('zone', {
            rules: [{ required: true, message: '请输入区域'}, {
              //validator: this.handleValidMobile
            }],
            initialValue:zone
          })(
            <Select
              // defaultValue="请选择"
              style={{ width: 120 }}
              disabled={this.props.disable}
            >
            {provinceData.map(province => <Option key={province}>{province}</Option>)}
            </Select>
          )}
        </FormItem>
        <FormItem 
        label="司机" 
        {...formItemLayout}>
          {getFieldDecorator('driver', {
            rules: [{ required: true, message: '请填写司机姓名'}, {
              //validator: this.handleValidMobile
            }],
            initialValue:driver
          })(
            <Input placeholder="请填写司机姓名" disabled={this.props.disable}/>
          )}
        </FormItem>
        <FormItem 
        label="司机电话" 
        {...formItemLayout}>
          {getFieldDecorator('driverPhone', {
            // rules: [{ required: true, message: '请填写司机电话'}, {
            //   //validator: this.handleValidMobile
            // }],
            rules: [{ message: '手机号码最多为11位！', max:11 }, { required: true, message:'请输入正确的手机号码！'}],
            initialValue:driverPhone
          })(
            <Input placeholder="请填写司机电话" disabled={this.props.disable}/>
          )}
        </FormItem>
        <FormItem 
        label="班车长" 
        {...formItemLayout}>
          {getFieldDecorator('carHead', {
            rules: [{ required: true, message: '请填写班车长姓名'}, {
              //validator: this.handleValidMobile
            }],
            initialValue:carHead
          })(
            <Input placeholder="请填写班车长姓名" disabled={this.props.disable}/>
          )}
        </FormItem>
        <FormItem 
        label="班车长电话" 
        {...formItemLayout}>
          {getFieldDecorator('carHeadPhone', {
            // rules: [{ required: true, message: '班车长电话'}, {
            //   //validator: this.handleValidMobile
            // }],
            rules: [{ message: '手机号码最多为11位！', max:11 }, { required: true, message:'请输入正确的手机号码！' }],
            initialValue:carHeadPhone
          })(
            <Input placeholder="班车长电话" disabled={this.props.disable}/>
          )}
        </FormItem>
        {
          this.props.isAdd ? null : <FormItem 
          label="班车圈" 
          {...formItemLayout}>
            {getFieldDecorator('groupName', {
              initialValue:groupName
            })(
              <Input disabled={true}/>
            )}
          </FormItem>
        }
        <FormItem>
          <Button style={{marginLeft:"195px"}} type="primary" className='resetBtn' onClick={this.props.handleCancel}>
            返回
          </Button>
          {this.props.isEdit != true ? <Button type="primary" disabled={this.state.subM} htmlType="submit" className='queryBtn'>
            保存
          </Button>:null}
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default List;
