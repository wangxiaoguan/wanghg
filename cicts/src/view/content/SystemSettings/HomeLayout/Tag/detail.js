import React, { Component } from 'react';
import { Button, Form, Input, Select, Radio, Row, Col, message } from 'antd';
import { GetQueryString, postService, getService } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import './Tag.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import TreeList from '../../../../component/tree/TreeList';
import {setCheckTreeData,setSelectTreeData} from'../../../../../redux-root/action/tree/tree';
import { connect } from 'react-redux';
@connect(
  state => ({ //取（另一个dispatch为“存”）
    AllTreeData: state.tree.treeCheckData,
    selectDetail: state.tree.treeSelectData.selectDetail,
    selectTreeData: state.tree.treeSelectData.column,
    loading:state.loading.loading,
  }),
  dispatch => ({ //存
    setCheckData: n => dispatch(setCheckTreeData(n)),
    setSelectData: n => dispatch(setSelectTreeData(n)),
  })
)
@Form.create()
export default class TagDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      treeDataKey: 0,
      AllTreeData: this.props.AllTreeData,
      isEdit: eval(GetQueryString(location.hash, ['isEdit']).isEdit)||false,
      isEnabled:'false',
      categoryView:'',
      checkData: {
        column:[],
      },
      validName:{retCode:0},
      selectTreeData:"",

    };
  }
  componentDidMount(){
    this.getTreeData();
  }

  getTreeData = () => {
    let treeData = [];
    getService(
      API_PREFIX + 'services/web/lookup/init/categoryType',
      data => {
        if (data.status === 1) {
          treeData = data.root.object;
          this.setState({ treeData, treeDataKey: this.state.treeDataKey + 1 },()=>{
            if(this.state.isEdit){//编辑
              let value =  window.sessionStorage.getItem('tag');
              let obj = JSON.parse(value);
              console.log('value',obj.tagName);
              let checkData = [];
              treeData.length!==0&&treeData.map(item=>{
                if(Math.abs(item.id)==Math.abs(obj.categoryView)){
                  this.setState({categoryView: item.fieldName});
                }
              });
              this.setState({
                isEnabled: obj.isEnabled.toString(),
              });
              this.props.form.setFieldsValue({
                checkData,
                tagName: obj.tagName,
                showIndex: obj.showIndex && obj.showIndex.toString(),
              });
            } else{
              console.log('13231');
              this.setState({
                isEnabled:'false',
              });
            }
          });
        }else{
          message.error(data.errorMsg);
        }
      }
    );
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.AllTreeData !== prevState.AllTreeData) {
      let checkData = { ...prevState.checkData };
      checkData = { ...checkData, ...nextProps.AllTreeData };
      // let judge = prevState.checkData.department.length > 0 || prevState.checkData.partyid.length > 0 || prevState.checkData.virtualgroupid.length > 0;
      return { checkData, AllTreeData: nextProps.AllTreeData };
    }
    return null;
  }
  setColumnAuth = (data) => {
      let tenantId = window.sessionStorage.getItem("tenantId");
      let body = {
          dataId: data.id,
          dataType: 4,
          departments:[],
          partys:[],
          groups: [],
          companyList: [],
          viewTenantId: [tenantId],
          partysJoin: [],
          departmentsJoin: [],
          groupsJoin: [],
          companyJoinList: [],
          unions:[],
          unionsJoin:[],
          joinTenantId: [],
      };
      postService(API_PREFIX + `services/web/auth/authdata/updAuthData`, body, data => {
        if (data.status === 1) {
          
        }
      });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    let value =  window.sessionStorage.getItem('tag');
    let obj = JSON.parse(value);
    console.log('props',this.props);
    this.props.form.validateFields((err, values) => {
      console.log("value=====",values);
      if(values.categoryViewName ===""){
        message.error('关联栏目为必填项！');
        return;
      }

      if (!err) {
        // const { selectTreeData } = this.state;
        // console.log("selectTreeData",selectTreeData);
        // values.categoryView = selectTreeData.toString();
        console.log('Received values of form: ', values);
        if(this.state.isEdit){
          // values['categoryView']= this.props.selectTreeData[0]; //对象的2种写法
          if(values.categoryView){
            this.state.treeData.length!==0&&this.state.treeData.map(item=>{
              if(item.fieldName===values.categoryView){
                values.categoryView=item.id;
              }
            });
            values.categoryView=-values.categoryView;
          }
          values.id = obj.id;
          postService(API_PREFIX + 'services/web/config/homepageTag/update',values, data => {
            if (data.status == 1) {
              message.success('修改成功');
              history.back();
            }else {
              message.error(data.errorMsg)
            }
          });
        }else{
          if(values.categoryView){
            values.categoryView=-values.categoryView;
          } 
          // values['categoryView']= this.props.selectTreeData[0];
          values['ShowType'] = 2
          postService(API_PREFIX + 'services/web/config/homepageTag/add',values, data => {
            /*values.setAttribute('createUserId','111');
            values.setAttribute('createDate','2018-05-28 17:13:55');
            values.setAttribute('lastUpdateUserId','111');
            values.setAttribute('lastUpdateDate','2018-05-28 17:13:55');*/
            if (data.status == 1) {
              this.setColumnAuth(data.root.object)

              message.success('新增成功');
              history.back();
            }else {
              message.error(data.errorMsg)
            }
          });
        }
      }
    });
  }
  handleChange=(value)=> {
    ///console.log(`selected ${value}`);
    this.setState({
      selectTreeData:value,
    });
  }
  handleValidName= (rule, value, callback) => {
    console.log("value====",value);
    if(value == ''||value==undefined){
      this.setState({
        validName:{
          retCode:0,
        },
      });
      callback();
    }else{
      let query={};
       query.tagName=value;
      if(this.state.isEdit){//编辑==》额外传入
        let value =  window.sessionStorage.getItem('tag');
        let values=JSON.parse(value);
        query.id=values.id;
        console.log("queryquery",query);
      }
      postService(API_PREFIX + `services/web/config/homepageTag/check/name`,query, data => {
        if(data.status==1 && data.root.object.retType==false ){
          console.log('data.retMsg',data.retMsg);
          this.setState({
            validName:{
              retCode:data.retCode,
              retMsg:data.retMsg,
            },
          });
          callback([new Error('该标签名称已存在')]);
          // message.error(data.retMsg)
        }else{
          this.setState({
            validName:{
              retCode:data.retCode,
              retMsg:data.retMsg,
            },
          });
          callback();
        }
      });
    }
  }

  render() {
    console.log('111',this.state.selectTreeData);
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { isEnabled, treeData,categoryView, treeDataKey, checkData } = this.state;
    const formItemLayout = { labelCol: { span: 2 }, wrapperCol: { span: 12 } };
    const options = treeData.map(d => <Option key={d.id}>{d.fieldName}</Option>);
    return <Form onSubmit={this.handleSubmit} className="Tag">
      <FormItem {...formItemLayout} label="标签名称">
        {getFieldDecorator('tagName',
          {
            initialValue: '',
            rules: [{ required: true, whitespace: true, message: '*必填项,最长32个字符！', max:32 }, {
              validator: this.handleValidName,
            }],
          })(<Input />)}
      </FormItem>
      <FormItem {...formItemLayout} label="显示顺序">
        {getFieldDecorator('showIndex',
          {
            initialValue: '',
            // rules: [{ pattern: new RegExp('^[0-9]+$'), message: '请使用数字表示显示顺序！' }, { required: false, message:'*必填项,最长9个字符！', max:9 }],
            rules: [{ pattern: new RegExp('^[0-9]+$'), message: '请使用数字表示显示顺序！', max:9 }, { required: false, message:'最长9个字符！', max:9 }],
          })(<Input />)}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="是否启用"
      >
        {
          getFieldDecorator('isEnabled',{
            initialValue:isEnabled,
            rules: [{ required: true, whitespace: true, message: '*必填项' }],
          })
          (
            <RadioGroup  >
              <Radio value="true">是</Radio>
              <Radio value="false">否</Radio>
            </RadioGroup>
          )
        }
      </FormItem>
      {/* <FormItem
        {...formItemLayout}
        label="父级栏目"
      >
        {
          getFieldDecorator('categoryView',{ initialValue : ''})
          ( <div>
            <TreeList treeData={treeData} selectable type="column" isforbed={this.state.isEdit?true:false}
              defaultSelectedKey={this.props.selectTreeData}
               OnSelect={()=>this.setState({displayWarn:false})}/>
            

          </div>
          )
        }
      </FormItem> */}
       <FormItem
        {...formItemLayout}
        label="父级栏目"
      >
        {
          getFieldDecorator('categoryView',{
            initialValue:categoryView?categoryView:'',
            rules: [{ required: true, whitespace: true, message: '*必填项' }],
          })
          (
           <Select  style={{ width: 320 }} 
           placeholder="请选择栏目"
           onChange={this.handleChange} >
          {options}
          </Select>
          )
        }
      </FormItem>
      
      {
          this.state.isEdit?<a className="operation" onClick={() => location.hash = '/InterfaceManagement/ColumnManagement?back=1' }>栏目管理</a>:null
      }
      
      <Button style={{marginLeft:'21%'}} onClick={() => history.back()} className="resetBtn" >返回</Button>
      <Button htmlType="submit" className="queryBtn" type="primary">保存</Button>
    </Form>;
  }
}