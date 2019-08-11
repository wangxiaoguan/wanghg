import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import {GetQueryString, postService, getService, exportExcelService} from '../../../myFetch';
import ServiceApi from '../../../apiprefix';
import { connect } from 'react-redux';
import TreeList from '../../../../component/tree/TreeList';
import {setCheckTreeData} from'../../../../../redux-root/action/tree/tree';
import { BEGIN, getDataSource, getPageData, getSelectRows } from '../../../../../redux-root/action/table/table';
import {setGranteeData } from '../../../../../redux-root/action/specialPoint/specialPoint';
import AddBasicInfo from './AddBasicInfo';
import { Form, Steps, Row, Col, Input, InputNumber, Select, Modal, Radio, Cascader, Divider, Button, message, Table, Popconfirm} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const Step = Steps.Step;


@Form.create()
@connect(
  state => ({
    AllTreeData: state.tree.treeCheckData,
    getBasicInfoData: state.specialPoint.getBasicInfoData,
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    setCheckData: n => dispatch(setCheckTreeData(n)),
    setGranteeData: n => dispatch(setGranteeData(n)),
    getData: n => dispatch(BEGIN(n)),
    getPageData:n=>dispatch(getPageData(n)),
    retSetData: n=>dispatch(getDataSource(n)),
    getSelectRowData: n => dispatch(getSelectRows(n)),
  })
)
export default class AddGrantee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      organizationData: [], //部门
      partyOrganizationData: [], //党组织
      virtualGroupData: [], //虚拟群组
      checkData: {
        depts: [],
        partys: [],
        groups: [],
      },
      AllTreeData: this.props.AllTreeData,
      status:1,
    };
  }

  componentDidMount() {
    this.getInitialData();
    let organizationData = [];
    getService(ServiceApi + 'services/system/organization/organizationList/getUserAndOrg', data => {
      if(data.retCode === 1){
        organizationData = data.root.list;
        const dealData = data => {
          for(let index=0; index<data.length; index++){
            let node = data[index];
            node.key = node.id + '';
            node.children = node.subOrganizationList;
            if(node.subOrganizationList){
              dealData(node.subOrganizationList);
            }
          }
        };
        dealData(organizationData);
        this.setState({ organizationData });
      }
    });

    let partyOrganizationData = [];
    getService(ServiceApi +'services/system/partyOrganization/partyOrganizationList/get',data=>{
      if (data.retCode === 1) {
        partyOrganizationData = data.root.list;
        const dealData = data => {
          for (let index = 0; index < data.length; index++) {
            let node = data[index];
            node.key = node.id + '';
            node.children = node.partyOrganizationList;
            if (node.partyOrganizationList) {
              dealData(node.partyOrganizationList);
            }
          }
        };
        dealData(partyOrganizationData);
        this.setState({ partyOrganizationData });
      }
    });

    let virtualGroupData = [];
    getService(ServiceApi + 'services/system/cateogry/group/tree', data => {
      if (data.retCode === 1) {
        virtualGroupData = data.root.list;
        this.setState({ virtualGroupData });
      }
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('props',nextProps.AllTreeData,prevState.AllTreeData);
    if (nextProps.AllTreeData !== prevState.AllTreeData) {
      let checkData = { ...prevState.checkData };
      checkData = { ...checkData, ...nextProps.AllTreeData };
      // let judge = prevState.checkData.department.length > 0 || prevState.checkData.partyid.length > 0 || prevState.checkData.virtualgroupid.length > 0;
      return { checkData, AllTreeData: nextProps.AllTreeData };
    }
    return null;
  }

  //获取第二步-发放对象的回填数据
  getInitialData = () => {
    console.log('grantee-flowData:', this.props.getGranteeData);
    if(this.props.flowData && this.props.flowData){
      let ddd ={};
    }
  }
  ChangeStaus=(arg)=>{
    console.log(arg)
    this.setState({status:arg.target.value})
  }

  
 
  //表单提交事件
  handleSubmit=(e,publish)=>{ //publish:为空，则是 保存并返回  不为空：保存并发布
    let checkData=this.state.checkData
   
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      console.log('fieldsValue', fieldsValue);
      if (err) {
        console.log('err', err);
        return;
      }
      console.log('id',this.props.getBasicInfoData.id);
      let values={
        ...fieldsValue,
        depts:checkData.depts.join(","),
        groups:checkData.groups.join(","),
        partys:checkData.partys.join(","),
        'id': this.props.getBasicInfoData.id,
        'pushStatus': publish?1:0,
      };
      //保存||保存并发布  调用更新的接口  pushStatus设置为0    pushStatus设置为1
      postService(ServiceApi+'services/system/specialTreasureTask/update/task',values,data=> {
        if (data.retCode === 1) { //增加成功  返回一系列数据，放入redux中
          message.success('保存成功');
          // if(publish){//保存并发布
          //   let body={
          //     ids:[values.id],
          //   };
          //   postService(ServiceApi+'services/partybuilding/task/update/updateTasksOnline',body,data=>{
          //     if (data.retCode ===1) {
          //       message.success('发布成功!');
          //     }
          //     else{
          //       message.error(data.retMsg);
          //     }
          //   });
          // }
          //返回到列表页面
          location.hash = '/PointManagement/SpecialPoint';
        }else{
          message.error(data.retMsg);
        }
      });

    });
  }

  render() {
    const { organizationData, partyOrganizationData, virtualGroupData, checkData,status} = this.state;
    console.log('多棵树勾选的值，根据type区分',this.state.checkData);
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return(
      <Form onSubmit={this.handleSubmit} style={{marginTop:'25px'}}>
        <div
          className="trees"
        //style={{ border: judge ? 'none' : '1px solid red' }}
        >
          <div className="single-tree">
            <span className="location-span">选择部门</span>
            <div style={{display:'flex'}}>
              <TreeList
                type="department"
                treeData={organizationData}
                checkable
                type="depts"
                // defaultCheckedKeys={depView}
                checkedKeys={checkData ? checkData.depts : []}
              // disabled={this.props.selectTreeData&& this.props.selectTreeData.length>0?false:true}
              // disabled={false}
              />
              <a
                style={{marginLeft:'10px',marginTop:'5px'}}
                className="location-btn operation"
                onClick={() => (location.hash = '/SystemSettings/Department')}
              >
                部门管理
              </a>
            </div>
          </div>


          <div className="single-tree">
            <span className="location-span">选择党组织</span>
            <div style={{display:'flex'}}>
              <TreeList
                type="partyid"
                treeData={partyOrganizationData}
                checkable
                type="partys"
                // dafaultCheckedKeys={partyView}
                checkedKeys={checkData ? checkData.partys : []}
              /*disabled={this.props.selectTreeData && this.props.selectTreeData.length > 0 ? false : true}*/
              />
              <a
                style={{marginLeft:'10px',marginTop:'5px'}}
                className="location-btn operation"
                onClick={() =>
                  (location.hash = '/SystemSettings/PartyOrganization')
                }
              >
                党组织管理
              </a>
            </div>
          </div>

          <div className="single-tree">
            <span className="location-span">选择虚拟群组</span>
            <div style={{display:'flex'}}>
              <TreeList
                type="virtual"
                treeData={virtualGroupData}
                checkable  
                type="groups"
                // dafaultCheckedKeys={groupView}
                checkedKeys={checkData ? checkData.groups : []}
              /*disabled={this.props.selectTreeData && this.props.selectTreeData.length > 0 ? false : true}*/
              />
              <a
                style={{marginLeft:'10px',marginTop:'5px'}}
                className="location-btn operation"
                onClick={() =>
                  (location.hash = '/SystemSettings/VirtualGroup')
                }
              >
                虚拟群组管理
              </a>
            </div>
          </div>
        </div>
        <FormItem
          {...formItemLayout}
          label="是否启用"
        >
          {
            getFieldDecorator('status',{
              initialValue: status,
              rules: [
                {
                  type: 'integer',
                  required: true,
                  whitespace: true,
                  message: '是否启用是必填项',
                },
              ],
            })
            (
              <RadioGroup onChange={this.ChangeStaus}>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </RadioGroup>
            )
          }
        </FormItem>

        <Row>
          <Col  span={6}  offset={6}><Button  className="resetBtn" onClick={this.props.prev}>上一步</Button></Col>
          <Col  span={6}><Button  className="queryBtn" onClick={this.handleSubmit}>保存并返回</Button></Col>
          {/*<Col  span={6}><Button  className="queryBtn" onClick={(e)=>this.handleSubmit(e,'publish')}>保存并发布</Button></Col>*/}
        </Row>
      </Form>
    );
  }
}


