import React, { Component } from 'react'
import {Button,Table,Form,Tabs,Modal,Input,Row,Col,Select,InputNumber,message} from 'antd'
import moment from 'moment'
import {getService, postService} from '../../myFetch'
import API_PREFIX from '../../apiprefix';
import './WeightManagList.less'
import {RuleConfig} from '../../ruleConfig'
import { connect } from 'react-redux';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane
const Option = Select.Option;

@connect(
  state => ({
    powers: state.powers
  })
)

export default class WeightManagList extends Component{
    constructor(props){
        super(props)
        this.state={
           tabKey: '1',
           loading: false,
           selectedRowKeys: [],
           visible: false, //显示弹窗 --true:显示,false:关闭
           dataInfo: {}, //获取列表的某行数据
           flag: false, //是否显示 编辑Modal,true-显示，false-不显示
           pageSize: 10, //每页五条数据
           current: 1, //当前页
           total: 0,//查询的总数量
           data:[],//表格的数据
        }
    }

//暂时用不到，用于点击划到第二页
  keyChange = (k) => {
        this.setState({
          tabKey: k
        })
      }

  //控制全选与单选//table选中项发生变化时的回调    
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

 //编辑Modal  
  editData = (value) => {
    // getService(API_PREFIX+`services/system/weight/queryWeightById/${value.id}`,data=>{
    //   if(data.retCode===1){
    //     this.setState({
    //       visible: true,
    //       flag: true,
    //       dataInfo: value,
    //     },()=>{
    //       console.log('rechargePoint:',this.state.dataInfo);
    //     });
    //   }
    // })
    this.setState({
      visible: true,
      flag: true,
      dataInfo: value,
    },()=>{
      console.log('rechargePoint:',this.state.dataInfo);
    });
  }  
 //关闭Modal
 closeModal = () => {
  this.setState({
    visible: false,
  });
}

//get请求函数封装
commonServer=(current,pageSize)=>{
  getService(API_PREFIX+`services/system/weight/queryWeight/${current}/${pageSize}`,data=>{
    if(data.retCode===1){
      this.setState({
        data:data.root.list,
        total:data.root.totalNum
      })
    }
  })
}

//页码改变触发
onPageChange=(current,pageSize)=>{
    this.commonServer(current,pageSize) 
  this.setState({
    current,
    pageSize
  })
}

//页面大小改变触发
onPageSizeChange=(current,pageSize)=>{
  this.commonServer(current,pageSize)
  this.setState({
    current,
    pageSize
  })
}

//初始化状态渲染
  componentWillMount(){
    this.commonServer(this.state.current,this.state.pageSize)
}

//刷新列表展示数据
refreshData=()=>{
  this.commonServer(this.state.current,this.state.pageSize)
}
    render(){
        const { loading, selectedRowKeys } = this.state;
        let powers = this.props.powers;
        //编辑权限码设置
        let hasEditPower=powers && powers['20001.21816.002']
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
          }; 
          const columns = [{
            title: '权重ID',
            dataIndex: 'id',
            key: 'id',
            width:100
          },
          {
            title: '权重类别',
            dataIndex: 'category',
            key: 'category',
            width:100,
            render:(text,record)=>{
              if(record.category==2){
                return <span>经验值</span>;
              }else{
                return <span>积分</span>;
              }
            }
          }, {
            title: '权重名称',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
          }, {
            title: '权重分值',
            dataIndex: 'point',
            key: 'point',
          }, {
            title: '每日上限分值',
            dataIndex: 'maxPoint',
            key: 'maxPoint',
          }, {
            title: '创建时间',
            dataIndex: 'createDate',
            key: 'createDate',
          }, {
            title: '操作',
            dataIndex: '',
            key: '',
            width:156,
            render:(text,record)=>{
              return <div>
                <a className="operation" disabled={!hasEditPower} onClick={this.editData.bind(this,record)}
                style={{ display: 'inline-block' }}
                 >编辑</a>
              </div>
            }
          }
        ]    

        let pagination={
          total: this.state.total,
          current: this.state.current,
          pageSize: this.state.pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: this.onPageChange,
          onShowSizeChange: this.onPageSizeChange,
          showTotal: total => `共 ${total} 条`
        }
        return(
            <div className='WeightManagList'>
                <Tabs defaultActiveKey={this.state.tabKey} className='tab' onChange={this.keyChange}>
                    <TabPane tab="开发配置" key="1" className='tabItem'>
                        <Table rowKey="id" id='tableExcel' rowSelection={rowSelection}
                          columns={columns}
                          dataSource={this.state.data}
                          bordered={true}
                          pagination={pagination} 
                          />
                        <Modal
                          title="编辑权重信息"
                          visible={this.state.visible}
                          key={'rechargePointModal'}
                          onCancel={this.closeModal}
                          footer={null} //底部内容，当不需要默认底部按钮时--null
                          destroyOnClose={true}
                        >
          <WrappedPointForm
           dataInfo={this.state.dataInfo} 
           flag={this.state.flag} 
           refreshData={this.refreshData}
           closeModal={this.closeModal}
           />
                        </Modal>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

class WeightManagListModal extends Component{
  constructor(props){
    super(props);
  }

  //Modal框提交数据 1为积分，2为经验值
handleSubmit=(e)=>{
  e.preventDefault();
  this.props.form.validateFields((err, fieldsValue) =>{
    if(err){
      return;
    }

    const values = {
      ...fieldsValue,
    };
    //将对应的文字转化为对应的数字
    if(values.category==="经验值"){
      values.category=2
    }else if(values.category==="积分"){
      values.category=1
    }
    //当每日上限分值为undefined或者为空时，传递NaN过去
    if(values.maxPoint===undefined||values.maxPoint===''){
      values.maxPoint=NaN
    }
    //当count满足数为undefined或者为空时，传递NaN过去
    if(values.count===undefined||values.count===''){
      values.count=NaN
    }

    if(this.props.flag){
      values.id = this.props.dataInfo.id;
      postService(API_PREFIX +`services/system/weight/editWeight`,values,data=>{
        if(data.retCode===1){
          message.success(data.retMsg);
          this.props.refreshData();
          this.props.closeModal();
        }
      })
    }
  })
  
}
  componentDidMount(){

  }
  render(){
    console.log("INFO",this.props.dataInfo)
 
    //获取数据
    const { getFieldDecorator } = this.props.form;
    //设置formItem的格式
    const formItemLayout = {
      labelCol: {
        sm: { span: 8},
      },
      wrapperCol: {
        sm: { span: 10 },
      },
    }

    return(
    <div className="WeightManagListModal">
      <Form onSubmit={this.handleSubmit}>
      <FormItem {...formItemLayout} label="权重类别:" >
      {getFieldDecorator('category', {
                initialValue: this.props.dataInfo.category==2? '经验值':'积分',
                ...RuleConfig.statusCofig
            })(
                <Select style={{ width: 200 }}>
                     <Option value={1}>积分</Option>
                     <Option value={2}>经验值</Option>
                </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="权重名称:" >
          {getFieldDecorator('name', {
            initialValue: this.props.dataInfo.name ? this.props.dataInfo.name : '',
            ...RuleConfig.WeightTitleCofig
          })(
            <Input />
          )}
          </FormItem>
          <FormItem {...formItemLayout} label="描述(文案模板):" >
          {getFieldDecorator('description', {
            initialValue: this.props.dataInfo.description ? this.props.dataInfo.description : '',
          })(
            <Input />
          )}
          </FormItem>
          <FormItem {...formItemLayout} label="权重分值(point):" >
          {getFieldDecorator('point', {
            initialValue: (this.props.dataInfo.point||this.props.dataInfo.point==0) ? this.props.dataInfo.point : '',
            ...RuleConfig.changeWeightCofig
          })(
            <InputNumber min={0} />
          )}
          </FormItem>
          <FormItem {...formItemLayout} label="每日上限分值(maxPoint):" >
          {getFieldDecorator('maxPoint', {
            initialValue: (this.props.dataInfo.maxPoint||this.props.dataInfo.maxPoint==0) ? this.props.dataInfo.maxPoint : '',
          })(
            <InputNumber  min={0} />
          )}
          </FormItem>
          <FormItem {...formItemLayout} label="满足数(count):" >
          {getFieldDecorator('count', {
            initialValue: this.props.dataInfo.count ? this.props.dataInfo.count : '',
          })(
            <InputNumber  min={0} />
          )}
          </FormItem>
          <Row {...formItemLayout}>
            <Col className="describewenzi">
            文案预览:   参加一次党建考试:参加一次党建考试,3荣誉积分
            </Col>
          </Row>
          <Row>
          <Col>
            <Button style={{marginLeft:'165px'}} className="queryBtn" type="primary" htmlType="submit" >确定</Button>
            <Button className="resetBtn" onClick={()=>this.props.closeModal()}>返回</Button>
          </Col>
        </Row>
      </Form>
    </div>
    )
  }
}
const WrappedPointForm = Form.create()(WeightManagListModal);