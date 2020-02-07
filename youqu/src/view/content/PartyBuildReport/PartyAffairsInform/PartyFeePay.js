import React, { Component } from 'react';
import { Form, Button, Input, DatePicker, Table, Row, Col} from 'antd';
import { getService } from '../../myFetch';
import ServiceApi from '../../apiprefix';
import './PartyFeePay.less'
import { Link } from 'react-router-dom';
import moment from 'moment';

const FormItem = Form.Item;
const {RangePicker } = DatePicker;
// const PageSize = 5;
const dateFormat = 'YYYY/MM/DD';

@Form.create()
class PartyFeePay extends Component{
    constructor(props) {
        super(props);
        this.state = {
          PageSize:5,//当前页展示数据的条数//**          修改 */
          total:0,//总计总数据条数                     **修改 */
          current: 1, //当前是第几页                   
          loading: false,
          data:[],//列表中的数据
          value:'',//查询条件                             **修改 */
          emptyAll:{},//清空的初始值                       **修改 */
          queryFilter: {}, //查询条件                      **修改 */
        };
        this.columns = [
            {
              title: "序号",
              dataIndex: 'xuhao',
              key:'xuhao',
              width:71
            },
            {
              title: "党组织名称",
              dataIndex: 'fullname',
              key:'fullname',
              width:353
            },
            {
              title: "党员人数",
              dataIndex: 'feenum',
              key:'feenum',
              width:263
            },
            {
                title: "已缴人数/已缴占比",
                dataIndex: 'feenumyes',
                key:'feeyesnum',
                width:275,
                render: (text, record) =>  {
                  return `${record.feeyesnum}/${record.feeyes}`
                }
              },
              {
                title: "未缴人数/未缴占比",
                dataIndex: 'feenonum'+'/'+'feeno',
                key:'feenonum',
                width:333,
                render: (text, record) =>  {
                  return `${record.feenonum}/${record.feeno}`
                }
              },
            {
              title: "操作",
              width:193,
              key:'feeno',
              render: (text, record) => {
                return  <a className='operation' onClick={()=>this.GotoFirstLevelOrganizationDetails(record) } >详情</a>;
              },
            },
          ];
        
}

//页面修改触发//*实现页面重置功能*/                 修改*/
hangleChange=(key,index,value)=>{
  console.log('key', key);
  console.log('index', index);
  console.log('value', value);
  let query = this.state.emptyAll;
  switch(index){
    case 1:
    query[key] = `Q=username_S_LK=${value}`;
    console.log('11111', query[key]);
    break;
    case 2:
      query[key] = `Q=mobile_S_LK=${value}`;
      console.log('22222', query[key]);
      break;
    case 3:
      if (value.length != 0) {
        query[key] = `Q=createdate_D_GE=${value[0].format('YYYY-MM-DD')}&Q=createdate_D_LE=${value[1].format('YYYY-MM-DD')}`;
      } else {
        query[key] = '';
      }
      break;
    default:
      break;
  }
  this.setState({
    queryFilter: query,
  }, () => {
    console.log('queryFilter:', this.state.queryFilter);
  });
}



  //页面初始化渲染
  componentDidMount(){
    this.setState({loading:true}); //****                修改//
    this.getDate();
  }
  getDate=()=>{
    // let data=this.state.data;
    getService(`${ServiceApi}services/partybuildingreport/partyfee/IdAndNameList?id=306&page=0&pageSize=10`,(date)=>{
      if(date.retCode===1){
        console.log(date.root.list)
        this.setState({
          total:date.root.totalNum,           /**修改 */
          data:date.root.list,
          loading:false,                       /**修改 */
        })
       
      }
    })}


  //一级组织详情
  GotoFirstLevelOrganizationDetails=(record)=>{
    location.hash=`/PartyBuildReport/PartyAffairsInform/PartyFeePay/FirstLevelOrganizationDetails`
  }

  //点击查询触发的form表单，实现结果
  submitSearch=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
    console.log('before qFilter:', this.state.queryFilter)

    let qFilter = '';
    Object.values(this.state.queryFilter).map(item => {
      if (qFilter == '') {
        qFilter = item;
      } else {
        qFilter = qFilter + '&' + item;
      }
    });
    console.log('after qFilter:', qFilter);
    //要传入输入框里面的内容和起始的时间
    getService(`${ServiceApi}services/partybuildingreport/partyfee/IdAndNameList
  ?id=306&page=0&pageSize=10&name=机关&startTime=2017&endTime=2020`,data=>{
    console.log(data)
    if(data.retCode===1){

    }
  })

    })

  }

render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    const config = {
      rules: [{
        required: false,
      }],
    };
    return(
            <div className="PartyFeePay">
            
            <Form layout="inline" className="form" onSubmit={this.submitSearch}>

              <Row>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label="党组织名称" maxLength="70">
                          {
                              getFieldDecorator('name')(
                              <Input placeholder="请输入"
                              onChange={e=>{//输入框的值
                                this.hangleChange('name',1,e.target.value)
                              }}
                              />)
                          }
                    </FormItem>
                  
                  </Col>     
                  <Col span={18}>        
                 
                      <FormItem {...formItemLayout} label="选择时间" maxLength="56">

                          {/* <label className="selectTime">选择时间</label> */}
                              {getFieldDecorator('time',{initialValue:''},config)(
                                  <RangePicker
                                    format={'YYYY-MM-DD'}
                                    onChange={value=>{
                                      this.hangleChange('time',2,value)
                                    }} 
                                    />
                              )}   
                
                      </FormItem>
                           
                  </Col>  
              </Row>   
             
              <Row className="allBtn">
              <Button className="queryBtn" type="primary" htmlType="submit">查询</Button>
              <Button className="resetBtn" onClick={() => {
                this.props.form.resetFields();
                this.setState({
                  emptyAll:{},
                })
              }}>重置</Button>
            </Row>
            </Form>
            <div className="ExportExcelDiv">
             <Button className="resetBtn ExportExcel " onClick={this.ExportExcel}>导出Excel</Button>
            </div>
            {/* 表格数据 */}
            <Table
            className="table"
            rowKey={this.key}
            bordered
            pagination={{
              pageSize: this.state.PageSize,//         修改*****
              current: this.state.current,
              total: this.state.total,
              showSizeChanger :true,
              showQuickJumper: true,
              pageSizeOptions:['5',"10","15","20"],
              onChange: (page) => {
                this.setState({ current: page }, this.requestData);
              },
            }}
            columns={this.columns}
            dataSource={this.state.data}
          />
            </div>
    )
}
}

export default PartyFeePay;