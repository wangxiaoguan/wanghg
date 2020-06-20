import { Tree,Form,Button ,DatePicker,Select, Input,Cascader,Table,Tag,Divider ,Row,Col,message,Popconfirm,Radio} from 'antd';
import React,{Component} from 'react'
import ReactDOM,{render} from 'react-dom'
// import QRCode  from 'qrcode-react';
// const QRCode = require('qrcode.react');
import { getFileItem } from 'antd/lib/upload/utils';
import {checkInput} from './checkForm'
import {getService} from './myFetch'
// import RichEditor from './richTexteditor/editor'
import './addStyle.css';
import { LocaleProvider } from 'antd';

import zh_CN from 'antd/lib/locale-provider/zh_CN';

import 'moment/locale/zh-cn';
// import {file} from './ajax'
import $ from 'jquery'
const TreeNode = Tree.TreeNode;
const FormItem=Form.Item
const Option = Select.Option;
const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
import DemoLearn  from './antd';
import Uploadfile from './upload';
import moment from 'moment';
const RadioGroup = Radio.Group;
// const treeData = [{
//   title: '0-0',
//   key: '0-0',
//   children: [{
//     title: '0-0-0',
//     key: '0-0-0',
//     children: [
//       { title: '0-0-0-0', key: '0-0-0-0' },
//       { title: '0-0-0-1', key: '0-0-0-1' },
//       { title: '0-0-0-2', key: '0-0-0-2' },
//     ],
//   }, {
//     title: '0-0-1',
//     key: '0-0-1',
//     children: [
//       { title: '0-0-1-0', key: '0-0-1-0' },
//       { title: '0-0-1-1', key: '0-0-1-1' },
//       { title: '0-0-1-2', key: '0-0-1-2' },
//     ],
//   }, {
//     title: '0-0-2',
//     key: '0-0-2',
//   }],
// }, {
//   title: '北京',
//   key: '0-1',
//   children: [
//     { title: '0-1-0', key: '0-1-0' },
//     { title: '0-1-1', key: '0-1-1' },
//     { title: '0-1-2', key: '0-1-2' },
//   ],
// }, {
//   title: '0-2',
//   key: '0-2',
// }];
var citylist=[]

class Demo extends Component {
    constructor(props){
        super(props);
        this.state={
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: ['0-0-0'],
            isDate:true,
            treeData: [
              { title: 'Expand to load', key: '0' },
              { title: 'Expand to load', key: '1' },
              { title: 'Tree Node', key: '2', isLeaf: true },
            ],
            time:'',
            treeCity:[],
            citys:[],
            number:1,
            country:[],
            currentDay:new Date().getDate(),
            timelimt:true,
            word:'',
            visible:false,
            url:"www.baidu.com",
        }
    }
  componentWillMount(){
    console.log($)
    let that=this
    let req = new XMLHttpRequest();
        req.open("get", "http://api.yytianqi.com/citylist/id/2", true);
        req.send();
        req.onreadystatechange = function () {
            if (req.readyState == 4&&req.status == 200) {
                let result = req.responseText;
                
                that.setState({treeCity:[JSON.parse(result)]})
               
                }
            }
    let xhr = new XMLHttpRequest();
        xhr.open("get", "http://api.yytianqi.com/citylist/id/3", true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4&&xhr.status == 200) {
                let result = xhr.responseText;
                
                that.setState({country:JSON.parse(result)})
                
                }
            }

  }
  componentDidUpdate(){
    let treeList=this.state.treeCity;
    let country=this.state.country;
   
    let city=this.citys(country)
  
    if(this.state.number==1){
 this.setState({country:city,number:2})
//  this.props.form.setFieldsValue({learn:'中华民族奋斗方向'});
    }
   
    this.renderList(treeList)
   
   
  }
  
    citys=(data)=>{
      let countryList=[]
       data.map(item=>{
        if(item.list){
          let nation=item.list;
          nation.map(record=>{
            countryList.push({city_id: item.city_id, name: item.name,country:record.name})
          })
        }
      })
      return countryList
    }
  
  
 
  renderList=(data)=>{
    return data.map((item)=>{
      if(item.list){
        item['value']=item.city_id;
        item['label']=item.name;
        item['children']=item.list
        this.renderList(item.list)
      }else{
        item['value']=item.city_id;
        item['label']=item.name;
      }
    })
      
  }
    onLoadData = (treeNode) => {
      return new Promise((resolve) => {
        if (treeNode.props.children) {
          resolve();
          return;
        }
        setTimeout(() => {
          treeNode.props.dataRef.children = [
            { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
            { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
          ];
          this.setState({
            treeData: [...this.state.treeData],
          });
          resolve();
        }, 100);
      });
    }
  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent:true,
    });
  }

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
    this.props.form.setFieldsValue({value:checkedKeys});
  }

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.list) {
        return (
          <TreeNode title={item.name} key={item.city_id} dataRef={item}>
            {this.renderTreeNodes(item.list)}
          </TreeNode>
        );
      }else{
        return <TreeNode title={item.name} key={item.city_id} dataRef={item}/>;
      }
      // return <TreeNode title={item.name} key={item.city_id} dataRef={item}/>;
    });
  }
  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   this.props.form.validateFields((err, values) => {
  //     if (!err) {
  //       console.log('Received values of form: ', values);
  //     }
  //   });
  // }
  cancel=()=>{
    this.setState({
      checkedKeys: [],
     
    })
    this.props.form.setFieldsValue({value:'',city:'',result:'',createDate:'',learn:''})
  }
  changeKey=()=>{
      this.setState({
        checkedKeys: ["CH200101"],
        word:'我爱中华'
       
      })
      this.props.form.setFieldsValue({value: ["CH200101"],city:["CH", "CH04"],result:'1',time:moment('2018/09/15', 'YYYY/MM/DD')})
      this.props.form.setFieldsValue({createDate:[moment('2018/09/15', 'YYYY/MM/DD'), moment('2018/12/30', 'YYYY/MM/DD')]})
      this.props.form.setFieldsValue({learn:'中华民族奋斗方向'});
      this.props.form.setFieldsValue({content:'中华人民共和国'})
  }
  // onChange=(value, dateString)=> {
  //   console.log(value)
  //   console.log(dateString)
  //   this.setState({time:dateString})
  //   let currentDay=new Date().getDate();
    
  //  if(value._d.getDate()==currentDay){
  //    this.setState({
  //      isDate:true
  //    })
  //  }else{
  //   this.setState({
  //     isDate:false
  //   })
  //  }
   
  // }
  
  onOk=(value)=> {
    console.log('onOk: ', value.format('YYYY-MM-DD HH:mm:ss'));
    this.props.form.setFieldsValue({time:value.format('YYYY-MM-DD HH:mm:ss')})
  }
  range=(start, end)=> {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  disabledDate=(current)=> {
    return current < moment().add(-1, 'd');
  }
  
  disabledDateTime=()=> {
    if(this.state.isDate){
      return {
        disabledHours: () => this.range(0, 24).splice(0, new Date().getHours()),
        disabledMinutes: () => this.range(0, 60).splice(0, new Date().getMinutes()),
        disabledSeconds: () => this.range(0, 60).splice(0, new Date().getSeconds()+1),
  
      };
    }
    
  }
 // validator: (rule, value, callback) => illegalInput(rule, value, callback),

 handleSubmit=(e)=>{
  //  console.log(e)
  e.preventDefault();
  this.props.form.validateFields((err, fieldsValue) => {
    // console.log(fieldsValue)
    let createDate=[]
    createDate.push(fieldsValue.createDate[0].format('YYYY-MM-DD 00:00:00'))
    createDate.push(fieldsValue.createDate[1].format('YYYY-MM-DD 23:59:59'))
    let data={...fieldsValue,createDate}
    console.log(data)
    if (err) {
  
      return;
    }
    message.success('保存成功')
 })
}
changeCity=(value)=>{
  console.log(value)
}
 //禁止选择部分日期
 disabledDate =(current) => {
  //  console.log(current)
  // console.log('disabledDate', new Date().toLocaleString());
  // return current && current < moment().endOf('day');
  //  return  current && current < moment().add(-1, 'd');
  const today = moment(Date.parse(new Date()) + 0*86400000).hour(0).minute(0).second(0); // 获取当天日期并转换成时间戳格式
  return (current && current.valueOf() <= today.valueOf());
   

}

//禁止选择部分时间
disabledDateTime =() => {
  if(this.state.timelimt){
    return {
      disabledHours: () => this.range(0, 24).splice(0, new Date().getHours()+1),
      disabledMinutes: () => this.range(0, 60).splice(0, new Date().getMinutes()+1),
      disabledSeconds: () => this.range(0, 60).splice(0, new Date().getSeconds()+1),
    };
  }
  
}
onChange=(value)=>{
  let currentDay=new Date().getDate()
  let month=String(value._d).split(" ")[2]
  if(month==currentDay){
    this.setState({timelimt:true})
    this.disabledDateTime() 
  }else{
    this.setState({timelimt:false})
    this.disabledDateTime() 
  }
}
onOk=(value)=>{
  console.log(value)
  let time=value.format('YYYY-MM-DD 00:00:00')
  console.log(time)
}
changeTime=(e)=>{
  console.log(e)
  let time1=e[0].format('YYYY-MM-DD HH:mm:ss')
  let time2=e[1].format('YYYY-MM-DD HH:mm:ss')
  console.log(time1)
  console.log(time2)
}
sureTime=(e)=>{
  console.log(e)
  let time1=e[0].format('YYYY-MM-DD 00:00:00')
  let time2=e[1].format('YYYY-MM-DD 23:59:59')
  console.log(time1)
  console.log(time2)
}
onDetailValueChange=(value)=>{
 console.log(value)
 this.setState({word:value})
}
onCancel=()=>{
  this.setState({visible:false})
}
onVisibleChange=()=>{
  console.log('11111111111111111')
  this.setState({visible:true})
}
onSure=()=>{
  console.log('22222222222222222')
  this.setState({visible:false})
}
onChangeRadio=(data)=>{
  console.log(data.target.value)
}
  render() {
      const { getFieldDecorator } = this.props.form;
      // const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
      const formItemLayout = {
        labelCol: {
          xs: { span: 18 },
          sm: { span: 8},
        },
        wrapperCol: {
          xs: { span: 18 },
          sm: { span: 8 },
        },
      };
      const {time,treeCity,country}=this.state;
     
      const rowSelection={
        onChange:(selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps:record => ({
          disabled: record.name === 'Disabled User', 
          name: record.name,
        })
      }
     
      const columns = [{
        title: '国家',
        dataIndex: 'country',
        key: 'country',
        width:'160px'
       
      }, {
        title: '洲际',
        dataIndex: 'name',
        key: 'name',
        width:'160px'
      }];
   

    return (
        <div style={{width:1200}}>
            <Form onSubmit={this.handleSubmit}  >
            <FormItem  label='学习名称' {...formItemLayout}  >
                    {
                        getFieldDecorator('learn',{
                            rules:[
                                {
                                    required: true, 
                                    whitespace: true,
                                
                                    // message: '请输入结果',
                                    validator: (rule, value, callback) => checkInput(rule, value, callback)

                                }
                            ],initialValue: '', 
                        })
                        (<Input  /> )
                    }
                </FormItem>
                <FormItem  label='学习内容' {...formItemLayout}  >
                    {
                        getFieldDecorator('content',{
                            rules:[
                                {   type:'string',
                                    required: true, 
                                    whitespace: true,
                                    message: '学习内容为必填项',
                                }
                            ],initialValue: '', 
                        })
                        (<TextArea autosize={{ minRows: 8, maxRows: 10 }}/> )
                    }
                </FormItem>
                {/* <FormItem  label='发表内容' {...formItemLayout}  >
                    {
                        getFieldDecorator('edit',{
                            rules:[
                                {   type:'string',
                                    required: true, 
                                    whitespace: true,
                                    message: '发布内容为必填项',
                                }
                            ],initialValue:this.state.word, 
                        })
                        (<RichEditor initialValue={this.state.word} onValueChange={(value) => {this.onDetailValueChange(value)}}/> )
                    }
                </FormItem> */}
                <FormItem label="上传图片" {...formItemLayout}>
                    {
                      getFieldDecorator('picture',{
                        rules:[
                          {
                              type:'array',
                              required: true, 
                              whitespace: true,
                              message: '图片为必填项',
                          }
                      ],initialValue:['i2.tiimg.com/1949/626765ed136e2963t.jpg']
                      })( <Uploadfile
                        initialValue={this.props.initialValue}
                      />)
                    }
                </FormItem>
                <FormItem  label='多选择框' {...formItemLayout} >
                    {
                        getFieldDecorator('radiobutton',{
                            rules:[
                                {
                                    required: true, 
                                    message: '请选择',
                                }
                            ],initialValue:3
                        })
                        (
                          <RadioGroup onChange={this.onChangeRadio} >
                            <Radio key={1} value={1}>A</Radio>
                            <Radio key={2} value={2}>B</Radio>
                            <Radio key={3} value={3}>C</Radio>
                            <Radio key={4} value={4}>D</Radio>
                          </RadioGroup>
                        )
                    }
                </FormItem>
                <FormItem  label='下拉选择' {...formItemLayout} >
                    {
                        getFieldDecorator('result',{
                            rules:[
                                {
                                    required: true, 
                                    message: '请输入结果',
                                }
                            ],initialValue:''
                        })
                        (
                          <Select  allowClear>
                            <Option value="1">图片</Option>
                            <Option value="2">视频</Option>
                            <Option value="3">文档</Option>
                          </Select>
                        )
                    }
                </FormItem>
                
                <FormItem label="创建时间" {...formItemLayout}>
                    {
                      getFieldDecorator('createDate',{
                        rules:[
                          {
                              type:'array',
                              required: true, 
                              whitespace: true,
                              message: '树形控件为必填项',
                          }
                      ],initialValue:''
                      })(<RangePicker 
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            onChange={e=>this.changeTime(e)}
                            onOk={this.sureTime}
                        
                        />)
                    }
                </FormItem>
                <FormItem label="级联选择" {...formItemLayout}>
                    {
                      getFieldDecorator('city',{
                        rules:[
                          {
                              type:'array',
                              required: true, 
                              whitespace: true,
                              message: '级联控件为必填项',
                          }
                      ],initialValue:''
                      })(<Cascader 
                        placeholder={'请选择城市'}
                        options={treeCity} 
                        changeOnSelect 
                        onChange={this.changeCity} 
                         />)
                    }
                </FormItem>
                <FormItem label="时间选择" {...formItemLayout}>
                    {
                      getFieldDecorator('time',{
                        rules:[
                          {
                              type:'object',
                              required: true, 
                              whitespace: true,
                              message: '时间为必填项',
                          }
                      ],
                      })(<DatePicker 
                        disabledDate={this.disabledDate}
                        disabledTime={this.disabledDateTime}
                        format="YYYY-MM-DD HH:mm:ss"
                        onChange={this.onChange}
                        onOk={this.onOk}
                        showTime />)
                    }
                </FormItem>
                <FormItem  label='树形控件' {...formItemLayout}>
                    {
                        getFieldDecorator('value',{
                            rules:[
                                {
                                    type:'array',
                                    required: true, 
                                    whitespace: true,
                                    message: '树形控件为必填项',
                                }
                            ],initialValue:''
                        })
                        (
                            <Tree
                                
                                checkable
                                // selectable
                                // rightClickable
                                // showLine
                                onExpand={this.onExpand}
                                expandedKeys={this.state.expandedKeys}
                                // autoExpandParent={this.state.autoExpandParent}
                                onCheck={this.onCheck}
                                checkedKeys={this.state.checkedKeys}
                                onSelect={this.onSelect}
                                selectedKeys={this.state.selectedKeys}
                            >
                                {this.renderTreeNodes(treeCity)}
                            </Tree>
                            
                        )
                    }
                </FormItem>
                <Row>
                  <Col offset={8}  span={2}><Button  className="queryBtn"  onClick={this.handleSubmit}>保存</Button></Col>
                  <Col  span={2}><Button type="primary" onClick={this.changeKey}>输入</Button></Col>
                  <Col   span={2}>
                    <Popconfirm title="确定删除所选项吗？" visible={this.state.visible} onVisibleChange={this.onVisibleChange} onCancel={this.onCancel} onConfirm={this.onSure} okText="确定" cancelText="取消">
                        <Button type="danger" >取消</Button>
                    </Popconfirm>
                  </Col>
                </Row>
                
                
                
            </Form>
            {/* <Table
              rowSelection={rowSelection}
              columns={columns} 
              dataSource={country.length>0?country:null} 
              bordered 
              />

            
            <Tree loadData={this.onLoadData} checkable>
              {this.renderTreeNodes(this.state.treeData)}
            </Tree>
            <br/>
            <DatePicker
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              disabledDate={this.disabledDate}
              disabledTime={this.disabledDateTime}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择时间"
              onChange={this.onChange}
              onOk={this.onOk}
            />
            <div>
              <DemoLearn
              time={time}
              />
            </div>
            <Uploadfile/> */}
            {/* <QRCode size={150} value={this.state.url}/> */}
           
           
        </div>
     
    );
  }
}

const App=Form.create()(Demo)

export default class Antd extends  Component{
    render(){
      return(
        <div>
            <LocaleProvider locale={zh_CN}><App /></LocaleProvider>
        </div>
         
      )
        
    }
}
//  Antd 
// render(, document.getElementById('app'));
