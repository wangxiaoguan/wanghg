import React, { Component } from 'react';
import { Button, Form, Input, Select, Radio, Row, Col, Message } from 'antd';
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
      checkData: {
        column:[],
      },
      validName:{retCode:0},
    };
  }
  componentDidMount(){
    this.getTreeData();
    if(this.state.isEdit){
      let value =  window.sessionStorage.getItem('tag');
      let obj = JSON.parse(value);
      console.log('value',obj.name);
      let checkData = [];
      // checkData['column'] = [obj.categoryId];
      this.props.setSelectData({
        column: obj.categoryView.split(','),
      });
      this.setState({
        isEnabled: obj.isEnabled.toString(),
      });
      this.props.form.setFieldsValue({
        checkData,
        name: obj.name,
        showIndex: obj.showIndex && obj.showIndex.toString(),
        categoryView: obj.categoryView,
      });
    } else{
      console.log('13231');
      this.setState({
        isEnabled:'false',
      });
    }
  }

  getTreeData = () => {
    let treeData = [];
    const cutStr = str => {
      // return str.match(/^[$]&/);
      let result = str.split(',');
      return result;
    };
    getService(
      API_PREFIX + 'services/system/cateogry/categoryList/get',
      data => {
        if (data.retCode === 1) {
          treeData = data.root.list;
          const DealData = data => {
            for (let index = 0; index < data.length; index++) {
              let node = data[index];
              node.key = node.id + '';
              node.disabled = node.categoryState === '0';
              node.department = node.department ? cutStr(node.department) : [];
              node.partyid = node.partyid ? cutStr(node.partyid) : [];
              node.virtualgroupid = node.virtualgroupid ? cutStr(node.virtualgroupid) : [];
              node.children = node.subCategoryList;
              if (node.subCategoryList) {
                DealData(node.subCategoryList);
              }
            }
          };
          DealData(treeData);
          this.setState({ treeData, treeDataKey: this.state.treeDataKey + 1 });
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

  handleSubmit = (e) => {
    e.preventDefault();
    let value =  window.sessionStorage.getItem('tag');
    let obj = JSON.parse(value);

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { selectTreeData } = this.props;
        values.categoryView = selectTreeData.toString();
        console.log('Received values of form: ', values);
        if(this.state.isEdit){
          // values['categoryView']= this.props.selectTreeData[0]; //对象的2种写法
          values.id = obj.id;
          postService(API_PREFIX + 'services/system/homepageTag/update',values, data => {
            if (data.retCode == 1) {
              Message.success('修改成功');
              history.back();
            }
          });
        }else{
          // values['categoryView']= this.props.selectTreeData[0];
          postService(API_PREFIX + 'services/system/homepageTag/insert',values, data => {
            /*values.setAttribute('createUserId','111');
            values.setAttribute('createDate','2018-05-28 17:13:55');
            values.setAttribute('lastUpdateUserId','111');
            values.setAttribute('lastUpdateDate','2018-05-28 17:13:55');*/
            if (data.retCode == 1) {
              Message.success('新增成功');
              history.back();
            }
          });
        }
      }
    });
  }

  handleValidName= (rule, value, callback) => {
    if(value == ''||value==undefined){
      this.setState({
        validName:{
          retCode:0,
        },
      });
      callback();
    }else{
      let query=`Q=name_S_EQ=${value}`;
      if(this.state.isEdit){//编辑==》额外传入
        let value =  window.sessionStorage.getItem('tag');
        query=query+'&'+`Q=id_S_NE=${JSON.parse(value).id}`;
      }
      getService(API_PREFIX + `services/system/verify/checkUnique/HomeLayout-Tag?${query}`, data => {
        if(data.retCode==0){
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
    console.log('111',this.props.selectTreeData);
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { isEnabled, treeData, treeDataKey, checkData } = this.state;
    const formItemLayout = { labelCol: { span: 2 }, wrapperCol: { span: 12 } };

    return <Form onSubmit={this.handleSubmit} className="Tag">
      <FormItem {...formItemLayout} label="标签名称">
        {getFieldDecorator('name',
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
            rules: [{ pattern: new RegExp('^[0-9]+$'), message: '请使用数字表示显示顺序！' }, { required: false, message:'*必填项,最长9个字符！', max:9 }],
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
      <FormItem
        {...formItemLayout}
        label="关联栏目"
      >
        {
          getFieldDecorator('categoryView',{ initialValue : '' })
          ( <div>
            <TreeList treeData={treeData} selectable type="column"
              defaultSelectedKey={this.props.selectTreeData}
              /* OnSelect={()=>this.setState({displayWarn:false})}*//>
            
          </div>
          )
        }
      </FormItem>
      <a className="operation" onClick={() => location.hash = '/SystemSettings/ColumnManagement' }>栏目管理</a>
      <Button style={{marginLeft:'21%'}} onClick={() => history.back()} className="resetBtn" >返回</Button>
      <Button htmlType="submit" className="queryBtn" type="primary">保存</Button>
    </Form>;
  }
}