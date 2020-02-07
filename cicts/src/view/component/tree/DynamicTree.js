import React, { Component } from 'react';
import { Button, Form, Select, DatePicker, Input, Message,InputNumber,Radio,Modal} from 'antd';
import TreeList from'./TreeList';
import './DynamicTree.less';
import { connect } from 'react-redux';
import { cloneObj } from '../../component/tools';
import API_PREFIX  from '../../content/apiprefix';
import { getService, postService, GetQueryString} from '../../content/myFetch';
import { setLoading} from '../../../redux-root/action/loading/loading';
import FormAndInput from '../table/FormAndInput';
import {BEGIN} from '../../../redux-root/action/table/table';
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const isleaf = (selectKey, tree,always) => {
  if (always) {
    return true;
  }
  if (selectKey.length <= 0) {
    return;
  }
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    const key = node.key;
    if (key === selectKey[0]) {
      return node.leaf;
    } else if (node.children) {
      if (node.children.some(item => item.key === key)) {
        return node.children.filter(_ => _.key === selectKey)[0].leaf;
      } else if (isleaf(selectKey, node.children)) {
        return isleaf(selectKey, node.children);
      }
    }
  }
  return false;
};
@Form.create()
@connect(
  state => ({
    selectTreeData: state.tree.treeSelectData.DynamicTree,
    selectDetail: state.tree.treeSelectData.selectDetail,
    getChangeData: state.tree.treeChangeData,
    pageData:state.table.pageData,
    selectRowsData: state.table.selectRowsData,
  }),
  dispatch => ({
    setLoading: n => dispatch(setLoading(n)),
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class DynamicTree extends Component {
  constructor(props) {
    console.log("this.props=>",props)
    super(props);
    this.dataList = [];
    this.validate = false;
    this.state = {
      getChangeData: this.props.getChangeData,
      updateTree: 0,
      nameDisabled:false,   //禁用修改name
      test: 'ccccc',
      selectTreeData: this.props.selectTreeData,
      isSelected: false,
      treeData: this.props.treeData,
      isLeaf: false,
      InputData: {},
      treeKey: 0,
      treeList: [],
      queue: {},
      validateError:false,
      isback: GetQueryString(location.hash, ['back']).back || '',
      person:0,
      personList:[],
      showAddModal:false,
      examiner:[],
      reviewerList:[],
      userId:'',
      sort:'',
      treepathList:'',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.getChangeData !== prevState.getChangeData) {
      // let queue = nextProps.getChangeData
      let treeList = [...nextProps.getChangeData.treeData];
      let queueProps = { ...nextProps.getChangeData };
      delete queueProps.treeData;
      let mession = { ...queueProps, ...prevState.queue };

      return {
        queue: mession,
        treeList,
        getChangeData: nextProps.getChangeData,
      };
    }
    if (
      nextProps.selectTreeData &&
      nextProps.selectTreeData.length > 0 &&
      nextProps.selectTreeData !== prevState.selectTreeData
    ) {
      let isLeaf = isleaf(
        nextProps.selectTreeData,
        nextProps.treeData,
        !nextProps.rootDisable
      );
      let nameDisabled = nextProps.selectDetail&&!nextProps.selectDetail.leaf;
      return { isSelected: true, isLeaf, nameDisabled };
    } else if (
      !nextProps.selectTreeData ||
      nextProps.selectTreeData.length <= 0
    ) {
      return { isSelected: false, isLeaf: !nextProps.rootDisable };
    }
    if (nextProps.treeData !== prevState.treeData) {
      return { treeData: nextProps.treeData };
    }

    return null;
  }
  getInputData = (e, key) => {
    // if (key==='name') {
    // this.generateList(this.state.treeList);
    // if (this.isNameInTree(e.target.value, this.dataList)) {
    //   let InputData = { ...this.state.InputData };
    //   InputData[key] = e.target.value;
    //   this.setState({ InputData, treeKey: key, validateError: true });
    //   return;
    // }else{
      
  

    let InputData = { ...this.state.InputData };

      InputData[key] = e.target.value;
   
    this.setState({ InputData, treeKey: key });
   
    // this.setState({ validateError: false });
    // }
    // }
    
    // this.dataList = [];
  };
  isNameInTree = (name, tree, selectKey)=>{
    // let temp = false;
    for (let index = 0; index < tree.length; index++) {
      const node = tree[index];
      if (selectKey === node.key) {
        if (tree.filter((item,i)=>i!==index).some(item => item.name === name)) {
          this.validate =  true;
          break;
        } else {
          this.validate =  false;
          break;
        } 
      } else if (node.children){
        this.isNameInTree(name, node.children, selectKey);
      }
      // if (node.name === name) {
      //   return true;
      // } else if (node.children){
      //   if (node.children.some(item => item.name === name)) {
      //     return true;
      //   }else{
      //     this.isNameInTree(name,node.children);
      //   }
      // }else{
      //   return false;
      // }
    }
  }
  nameValidator = (rule, value, callback) => {
    // this.generateList(this.state.treeList);
    this.isNameInTree(value, this.state.treeList, this.props.selectTreeData[0]);
    if (this.validate) {
      this.setState({ validateError: true });
      callback([new Error('同一级存在相同的名称！')]);
    } else {
      this.setState({ validateError: false });
      this.dataList = [];
      callback();
    }
  }
  delete = () => {
    const { treeData, updateTree } = this.state;
    const searchData = (selectKey, tree) => {
      for (let index = 0; index < tree.length; index++) {
        let node = tree[index];
        if (node.children) {
          if (node.children.some(item => item.key === selectKey)) {
            let count = node.children.indexOf(
              node.children.filter(item => item.key === selectKey)[0]
            );
            node.children.splice(count, 1);
          } else {
            searchData(selectKey, node.children);
          }
        }
        this.setState({ treeData: tree, updateTree: updateTree + 1 });
      }
    };
    searchData(this.props.selectTreeData[0], treeData);
  };
  generateList = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      this.dataList.push(node);
      if (node.children) {
        this.generateList(node.children, node.key);
      }
    }
  };
  setValue = () => {
    if (!this.props.selectDetail) {
      return;
    }
    console.log(this.props.selectDetail)
    if(this.props.selectDetail) {
        this.setState({
            treepathList: this.props.selectDetail.id
        })
    }
    console.log(this.props.reviewer)
    
    if(this.props.type=='column'&&this.props.selectDetail.id){
      getService(API_PREFIX + `services/system/cateogry/categoryAuthInfo/get/${this.props.selectDetail.id}`,data=>{
        console.log('neirong',data);
        if (data.retCode===1) {
          let allData=data.root.object
          let examiner=this.state.examiner
          
          allData.reviewerList.forEach(item=>{
            examiner.push(item.id)
          })
          this.setState({reviewerList:allData.reviewerList,examiner})
          this.props.RightForm.map(item => {
            if (item.key === 'disabled') {
              this.props.form.setFieldsValue({
                disabled: this.props.selectDetail.disabled ? '停用' : '正常',
              });
            } else {
              this.props.form.setFieldsValue({
                [item.key]: allData[item.key],
              });
            }
          });
          
        }
      })
    }else{
      this.props.RightForm.map(item => {
          if (item.key === 'disabled') {
            this.props.form.setFieldsValue({
              disabled: this.props.selectDetail.disabled ? '停用' : '正常',
            });
          } else {
            this.props.form.setFieldsValue({
              [item.key]: this.props.selectDetail[item.key],
            });
          }
        });
    }
    console.log('=============>>>>>>>>>>', this.props.form.setFieldsValue)
 
  };
  handleSubmit = () => {
    // this.setState({ queue: {} });
    // let orgArr=this.props.orgList;
    // let partyArr=this.props.partyList;
    // let virArr=this.props.virList;
    // let externalData=this.props.externalData;
    // if(externalData){
    //   if(externalData.department&&externalData.department.length==0&&externalData.partyid.length==0&&externalData.virtualgroupid.length==0){
    //     externalData.department=orgArr;
    //     externalData.partyid=partyArr;
    //     externalData.virtualgroupid=virArr;
    //   }
    // }
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      console.log(this.state.queue)
      this.props.setLoading(true);
      let special = this.props.externalData;;
      let add = [];
      let start = [];
      let stop = [];
      let update = [];
      let addChild = [];
      let deletePro = [];
      const dealTreeData = array => {
        console.log("dealTreeData",array);
        if(array.length==0){

        }
        if(array){
          return array.toString();
        }
      };
      const cutFullName=(data)=>{
        let arr = data&&data.split('>');
        let result = '';
        arr&& arr.map((item,index)=>{
          if (result==='') {
            result = item;
          } else if (index !== arr.length-1) {
            result = result + '>' + item;
          }
          return result;
        });
        return result;
      };
      const cutTreePath=(data)=>{
        console.log("cutTreePath",data);
        let arr = data&&data.split(',');
        let result = '';
        arr.map((item, index) => {
          if (result === '') {
            result = item;
          } else if (index !== arr.length - 1) {
            result = result + ',' + item;
          }
          return result;
        });
        return result;
      };
      this.generateList(this.state.treeList);
      console.log(this.state.queue)
      if (this.state.queue.startQueue) {
          let idList = this.state.queue.startQueue
        // let body = { idList: this.state.queue.startQueue };
        let body = { id: idList[idList.length - 1] };
        start.push(
          new Promise((resolve, reject) => {
            postService(API_PREFIX + `${this.props.startUrl}`, body, data =>
            {
              if (data.retCode===1) {
                resolve(data);
              }else{
                reject(data.retMsg);
              }
            }
            );
          })
        );
      }
      if (this.state.queue.stopQueue) {
        let body = { idList: this.state.queue.stopQueue };
        stop.push(
          new Promise((resolve, reject) => {
            postService(API_PREFIX + this.props.stopUrl, body, data =>
            {
              if (data.retCode===1) {
                resolve(data);
                this.setState({queue:{}})
              }else{
                reject(data.retMsg);
              }
            }
            );
          })
        );
      }
      if (this.state.queue.addQueue) {    //平级
        this.state.queue.addQueue.map((item, index) => {
          let data = this.getSelectDetail(item);
          let parentData = this.getSelectDetail(data.parentId);
          let body = special
            ? parentData.leaf
              ? {
                name: data.name,
                department: dealTreeData(data.department),
                partyid: dealTreeData(data.partyid),
                virtualgroupid: dealTreeData(data.virtualgroupid),
                upgradecategory: parentData.upgradecategory,
                categoryState: data.disabled ? '0' : '1',
                instruction: data.instruction,
                type: parentData.type,
                reviewer:this.state.examiner,
                organizationState:fieldsValue.organizationState,
                isEnable: fieldsValue.isEnable ? '1' : '0',
                nickName:fieldsValue.nickName,
                showIndex:fieldsValue.showIndex
              }
              : {
                name: data.name,
                department: data.department
                  ? dealTreeData(data.department)
                  : '',
                partyid: data.partyid ? dealTreeData(data.partyid) : '',
                virtualgroupid: data.virtualgroupid
                  ? dealTreeData(data.virtualgroupid)
                  : '',
                categoryState: data.disabled ? '0' : '1',
                instruction: data.instruction,
                type: parentData.type,
                reviewer:this.state.examiner,
                organizationState:fieldsValue.organizationState,
                isEnable: fieldsValue.isEnable ? '1' : '0',
                nickName:fieldsValue.nickName,
                showIndex:fieldsValue.showIndex
              }
            : parentData.parent ? { //党组织是parentId,企业部门是parent
              name: data.name,
              partyOrganizationState: data.disabled ? '0' : '1',
              instruction: data.instruction,
              treepath: cutTreePath(parentData.treepath),
              parent: parentData.parent,
              fullname: cutFullName(parentData.fullname)+'>'+data.name,
              type: parentData.type,
              reviewer:this.state.examiner,
              organizationState:fieldsValue.organizationState,
              isEnable: fieldsValue.isEnable ? '1' : '0',
              nickName:fieldsValue.nickName,
              showIndex:fieldsValue.showIndex
            } : parentData.parentid? {
              name: data.name,
              partyOrganizationState: data.disabled ? '0' : '1',
              instruction: data.instruction,
              treepath: cutTreePath(parentData.treepath),
              parentid: parentData.parentid,
              fullname: cutFullName(parentData.fullname) + '>' + data.name,
              type: parentData.type,
              reviewer:this.state.examiner,
              organizationState:fieldsValue.organizationState,
              isEnable: fieldsValue.isEnable ? '1' : '0',
              nickName:fieldsValue.nickName,
              showIndex:fieldsValue.showIndex
            }:{
              name: data.name,
              partyOrganizationState: data.disabled ? '0' : '1',
              instruction: data.instruction,
              treepath: cutTreePath(parentData.treepath),
              fullname: cutFullName(parentData.fullname) + '>' + data.name,
              type: parentData.type,
              reviewer:this.state.examiner,
              organizationState:fieldsValue.organizationState,
              isEnable: fieldsValue.isEnable ? '1' : '0',
              nickName:fieldsValue.nickName,
              showIndex:fieldsValue.showIndex
            };
          add.push(
            new Promise((resolve, reject) => {
              let regu = "^[ ]+$";
              let re = new RegExp(regu);
              let NL = re.test(body.name)
              if(NL){
                Message.error('部门名称不能全部为空格')
                return false
              }
              if(body.name!=''){
                postService(API_PREFIX + `${this.props.addUrl}`, body, data =>
                {
                  if (data.retCode===1) {
                    resolve(data);
                  }else{
                    reject(data.retMsg);
                  }
                });
                this.setState({queue:{}})
              }else if(body.name==''){
                Message.error('部门名称不能为空')
              }
            })
          );
        });
      }
      if (this.state.queue.addChildQueue) {     //下级
        this.state.queue.addChildQueue.map(item => {
          let data = this.getSelectDetail(item);
          let parentData = this.getSelectDetail(data.parentId);
          let body = special
            ? {
              name: data.name,
              department: data.department ? dealTreeData(data.department) : '',
              partyid: data.partyid ? dealTreeData(data.partyid) : '',
              virtualgroupid: data.virtualgroupid
                ? dealTreeData(data.virtualgroupid)
                : '',
              upgradecategory: data.parentId,
              categoryState: data.disabled ? '0' : '1',
              instruction: data.instruction,
              type:parentData.type,
              reviewer:this.state.examiner,
              organizationState:fieldsValue.organizationState,
              isEnable: fieldsValue.isEnable ? '1' : '0',
              nickName:fieldsValue.nickName,
              showIndex:fieldsValue.showIndex
            }
            : parentData.parentid ? {       //党组织是parentId,企业部门是parent
              name: data.name,
              partyOrganizationState: data.disabled ? '0' : '1',
              instruction: data.instruction,
              parentid: parentData.id,
              treepath: parentData.treepath,
              fullname: parentData.fullname+'>'+data.name,
              type: parentData.type,
              reviewer:this.state.examiner,
              organizationState:fieldsValue.organizationState,
              isEnable: fieldsValue.isEnable ? '1' : '0',
              nickName:fieldsValue.nickName,
              showIndex:fieldsValue.showIndex
            } : parentData.parent?{
              name: data.name,
              partyOrganizationState: data.disabled ? '0' : '1',
              instruction: data.instruction,
              parent: parentData.id,
              treepath: parentData.treepath,
              fullname: parentData.fullname + '>' + data.name,
              type: parentData.type,
              reviewer:this.state.examiner,
              organizationState:fieldsValue.organizationState,
              isEnable: fieldsValue.isEnable ? '1' : '0',
              nickName:fieldsValue.nickName,
              showIndex:fieldsValue.showIndex
            }:{
              name: data.name,
              partyOrganizationState: data.disabled ? '0' : '1',
              instruction: data.instruction,
              treepath: parentData.treepath,
              fullname: parentData.fullname + '>' + data.name,
              type: parentData.type,
              reviewer:this.state.examiner,
              organizationState:fieldsValue.organizationState,
              isEnable: fieldsValue.isEnable ? '1' : '0',
              nickName:fieldsValue.nickName,
              showIndex:fieldsValue.showIndex
            };
          addChild.push(
            new Promise((resolve, reject) => {
              let regu = "^[ ]+$";
              let re = new RegExp(regu);
              let NL = re.test(body.name)
              if(NL){
                Message.error('部门名称不能全部为空格')
                return false
              }
              if(body.name!=''){
                postService(API_PREFIX + this.props.addUrl, body, data =>
                  {
                    if (data.retCode===1) {
                      resolve(data);
                    }else{
                      reject(data.retMsg);
                    }
                  });
                  this.setState({queue:{}})
              }else if(body.name==''){
                Message.error('部门名称不能为空')
              }
            })
          );
        });
      }
      if (this.state.queue.deleteQueue) {
        this.state.queue.deleteQueue.map(item => {
          deletePro.push(
            new Promise((resolve, reject) => {
              postService(API_PREFIX + this.props.deleteUrl +'/'+ item, '',data =>
              {
                if (data.retCode===1) {
                  resolve(data);
                  this.setState({queue:{}})
                }else{
                  reject(data.retMsg);
                }
              }
              );
            })
          );
        });
      }
      if (this.state.queue.updateQueue) {
        this.state.queue.updateQueue.map(item => {
          let data = this.getSelectDetail(item);
            console.log(data)
          // if(data.department){
          //   if(data.department.length==0&&data.partyid.length==0&&data.virtualgroupid.length==0){
          //     data.department=this.props.orgList;
          //     data.partyid=this.props.partyList;
          //     data.virtualgroupid=this.props.virList;
          //   }
          // }

          let body = {
            name: data.name,
            department: data.department ? dealTreeData(data.department) : '',
            partyid: data.partyid ? dealTreeData(data.partyid) : '',
            virtualgroupid: data.virtualgroupid
              ? dealTreeData(data.virtualgroupid)
              : '',
            id: item,
            categoryState: data.disabled ? '0' : '1',
            partyOrganizationState: data.disabled ? '0' : '1',
            instruction: data.instruction,
            fullname: cutFullName(data.fullname)+'>'+data.name,
            reviewer:this.state.examiner,
            organizationState:fieldsValue.organizationState,
            isEnable: fieldsValue.isEnable ? '1' : '0',
            nickName:fieldsValue.nickName,
            showIndex:fieldsValue.showIndex
          };
          update.push(
            new Promise((resolve, reject) => {
              let regu = "^[ ]+$";
              let re = new RegExp(regu);
              let NL = re.test(body.name)
              if(NL){
                Message.error('部门名称不能全部为空格')
                return false
              }
              console.log(body)
              if(body.name!=''){
                postService(API_PREFIX + `${this.props.updateUrl}`, body, data =>
                {
                  if (data.retCode===1) {
                    resolve(data);
                    this.setState({queue:{}})
                  }else{
                    console.log('data.retMsg',data.retMsg);
                    reject(data.retMsg);
                    this.props.setLoading(false);
                  }
                }
                );
              }else if(body.name==''){
                Message.error('部门名称不能为空')
              }
            })
          );
        });
      }
      Promise.all([
        ...add,
        ...addChild,
        ...update,
        ...deletePro,
        ...start,
        ...stop,
      ]).then(results => {
        console.log('results', results);
        Message.success('保存成功');
        this.props.setLoading(false);
        this.props.updateTree();
        this.setState({ queue: {} });
      },error=>{
        console.log('error', error);
        Message.error(error);
        this.props.setLoading(false);
        this.props.updateTree();
        this.setState({ queue: {} });
      }).catch(function (r) {
        console.log('err');
        console.log(r);
      });
    });
  }
  //删除子节点 错误
  deleteNode=()=>{
    this.setState({ queue: {} });
  }

  getSelectDetail = selectKey => {
    console.log(selectKey)
    return this.dataList.filter(_ => _.key === selectKey)[0];
  };

  onRadioChange = (e, key) => {
    this.setState({ RadioValue: e.target.value });
    this.props.form.setFieldsValue({ [key]: e.target.value });
    let InputData = { ...this.state.InputData }; //yelu 2018-12-24 解决部门管理，仅仅单选框值改变，点击保存不发送updata请求的bug
    InputData[key] = e.target.value;
    this.setState({ InputData});
  };
  addPerson=()=>{
    let person=this.state.person;
    let reviewerList=this.state.reviewerList;
    // person<3?personList.push(person):null
    // person<3?person++:3
    let obj={
      id:0,
      ids: [],
      lastname: "",
      points: 0,
      revision: 1,
      totalPoints: 0,
      totalTreasure: 0,
      treasure: 0,
    }
    reviewerList.length<3?reviewerList.push(obj):null
    this.setState({ reviewerList})
  }
  deletePerson=(index)=>{
    let reviewerList=this.state.reviewerList;
    let examiner=this.state.examiner;
    reviewerList.splice(index,1);
    examiner.splice(index,1);
    this.setState({reviewerList,examiner})
  }
  selectPerson=(item,index)=>{
    this.setState({showAddModal:true});
    console.log(item,index)
    this.setState({userId:item.id,sort:index});
    
  }

  handleAddModalOK=()=>{
    let InputData = { ...this.state.InputData };
    // this.setState({ queue: {id:'0'} });
    let selectedData=this.props.selectRowsData[0];
    InputData['reviewerList'] = selectedData.userId;
    this.setState({ InputData, treeKey: 'reviewerList' });


    let userId=this.state.userId;
    let sort=this.state.sort;
    let reviewerList=this.state.reviewerList
    console.log(sort)
    if(selectedData.userId!=userId){
      reviewerList.splice(sort,1,selectedData);
      let examiner=this.state.examiner
      this.setState({reviewerList})
      console.log(reviewerList)
      examiner.splice(sort,1,selectedData.userId)
      // examiner.push(selectedData.userId+'')
      this.setState({examiner})
      this.props.form.setFieldsValue({reviewerList:examiner}); //为userId设置值
    }
    this.setState({showAddModal:false});
    console.log(selectedData)
    // examiner.push(selectedData.userId+'')
   
   
   
  }
  handleAddModalCancel=()=>{
    this.setState({showAddModal:false});
  }
  handleInput=(e)=>{
    // console.log("value",value);
    this.props.getData(API_PREFIX+`services/system/systemAndCompanyUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=lastname_S_LK=${e.target.value}`);
  }
  render() {
    console.log(this.state.queue)
    let updatePower = this.props.powers &&this.props.powers.update;
    const { isLeaf, isSelected, treeData, updateTree,person,personList,examiner ,reviewerList} = this.state;
    const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
    const {
      children,
      form: { getFieldDecorator },
    } = this.props;
    const columns=[

      {
        title: '姓名',
        dataIndex: 'lastname',
        key: 'lastname',
      },
      {
        title:'手机号',
        dataIndex:'mobile',
        key:'mobile',
      },
      {
        title:'部门',
        dataIndex:'orginfoName',
        key:'orginfoName',
      },
    ];
    const RightForm = this.props.RightForm ? (
      <div className="right-form">
        {this.props.RightForm.map((item, index) => {
          return (
            <div key={index}>
              {item.type === 'inputNumber'?(
                <Form.Item {...formItemLayout} label={item.label}>
                  {getFieldDecorator(item.key,{
                    initialValue: '',
                  })(
                      <InputNumber min={0} />
                  )}
                </Form.Item>
              )
              :item.type === 'radioButton'?(
                <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  initialValue: item.option[0].value, 
                  rules: [
                    {
                      type: typeof item.option[0].value,
                      whitespace: true,
                    },
                  ],
                })(
                  <RadioGroup
                    // disabled={disabled}
                    options={item.option}
                    onChange={e => this.onRadioChange(e, item.key)}
                  />
                )}
              </Form.Item>
              ):item.type === 'Checkbox'?(
                <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  
                  rules: [
                    {
                      type:"array",
                      whitespace: true,
                    },
                  ],
                })(
                  <div>
                    {
                       reviewerList.map((data,index)=>{
                         
                        return <div><Input key={index} defaultValue={data.lastname} style={{width: '40%'} }/>　　<Button  onClick={()=>this.selectPerson(data,index)}>选择人员</Button>　　<Button onClick={()=>this.deletePerson(index)}>删除</Button></div>
                      })
                      // personList.map((item,index)=>{
                      //   return <div><Input defaultValue={examiner} style={{width: '40%'} }/>　　<Button onClick={(item)=>this.selectPerson(item)}>选择人员</Button>　　<Button onClick={this.deletePerson}>删除</Button></div>
                      // })
                    }
                    
                  </div>
                  
                )}
                <Button onClick={this.addPerson} disabled={updatePower? !isSelected:true} >增加人员</Button>
              </Form.Item>
              ):item.type === 'select' ? (
                <Form.Item {...formItemLayout} label={item.label}>
                  {getFieldDecorator(item.key)(
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      onChange={value =>
                        this.handleChange(
                          value,
                          item.key,
                          item.qFilter,
                          item.type
                        )
                      }
                      disabled={updatePower?(!isSelected || item.disabled):true}
                    >
                      {item.option &&
                        item.option.map(_ => {
                          return (
                            <Option key={_.key} value={_.key}>
                              {_.value}
                            </Option>
                          );
                        })}
                    </Select>
                  )}
                </Form.Item>
              ) : (
                <div>
                  {item.type === 'rangePicker' ? (
                    <Form.Item {...formItemLayout} label={item.label}>
                      {getFieldDecorator(item.key, { initialValue: '' })(
                        <RangePicker
                          onChange={value =>
                            this.handleChange(
                              value,
                              item.key,
                              item.qFilter,
                              item.type
                            )
                          }
                          disabled={updatePower? !isSelected:true} 
                        />
                      )}
                    </Form.Item>
                  ) : (
                    <div>
                      {item.type === 'textArea' ? (
                        <Form.Item {...formItemLayout} label={item.label}>
                          {getFieldDecorator(item.key, { initialValue: '' })(
                            <TextArea
                              autosize={{minRows: 4 }}
                              disabled={updatePower? !isSelected:true}
                              onInput={e => this.getInputData(e, item.key)}
                            />
                          )}
                        </Form.Item>
                      ) :
                        (<Form.Item {...formItemLayout} label={item.label}>
                          {getFieldDecorator(item.key, 
                            {
                              validateTrigger: ['onFocus', 'onChange','onBlur'],
                              initialValue: '',
                              rules: [{ validator:this.nameValidator}],
                            })(
                            <Input
                              // yelu 2019-01-15 添加根级部门不能修改名称
                              // disabled={updatePower?((item.key==='name'&&this.state.nameDisabled)|| !isSelected):true}
                              disabled={(this.props.inputDisabled === false && this.state.treepathList != '-1')? false : (updatePower?((item.key==='name'&&this.state.nameDisabled)|| !isSelected ):true)}
                              onInput={e => this.getInputData(e, item.key)}
                            />
                          )}
                        </Form.Item>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    ) : null;
    return (
      <div>
        <div className="dynamic-tree">
          <div className="dynamic-tree-left">
            <TreeList
              powers={this.props.powers}
              treeKey={this.state.treeKey}
              type="DynamicTree"
              checkable={false}
              treeData={treeData}
              selectable
              rightClickable
              onSelectEvent={this.setValue}
              updateTree={updateTree}
              InputData={this.state.InputData}
              externalData={this.props.externalData}
              rootDisable={this.props.rootDisable}
              disabled={this.state.validateError}
              deleteNode={this.deleteNode}
              deleteUrl={this.props.deleteUrl }
              NewAddNode={this.props.NewAddNode}
            />
          </div>
          <div className="dynamic-tree-right">
            <Form>{RightForm}</Form>
          </div>
        </div>
        {children}
        <div style={{
          display: 'flex',
          marginLeft: '40%',
          marginBottom: '100px',
          marginTop: '50px'}}>
          {this.state.isback === '1' ?
            <Button className="resetBtn" type="primary" onClick={() => {
                sessionStorage.setItem('eventAndInfoKey', 1)// yelu 设置从查看权限设置点击进来时，返回后保存tab对应的key值
                history.back()}}>
              返回
            </Button> : null}
             {/* <Button className="resetBtn" type="primary" onClick={() => history.back()}>
              返回
            </Button> */}
          <Button className="queryBtn" type="primary" onClick={this.handleSubmit} disabled={(JSON.stringify(this.state.queue)!=='{}' )?false:true}>
            保存
          </Button>
        </div>
        <Modal
          width={800}
          title="管理用户"
          visible={this.state.showAddModal}
          cancelText="取消"
          okText="确定"
          onOk={this.handleAddModalOK}
          onCancel={this.handleAddModalCancel}
          destroyOnClose={true}
        >
          <FormAndInput
            columns={columns}
            url={'services/system/systemAndCompanyUser/list'}
            onSearch={this.handleInput}
          />
        </Modal>
      </div>
    );
  }
}