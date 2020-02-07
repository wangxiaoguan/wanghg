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
import {BEGIN, getPageData} from '../../../redux-root/action/table/table';
import { message } from 'antd';
// import { concat } from '_rxjs@6.3.3@rxjs';
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
    getPageData:n=>dispatch(getPageData(n)), // yelu 2019-01-02 每次查询时初始缓冲里面的页码为默认值
  })
)
export default class ColumnTree extends Component {
  constructor(props) {
    console.log("this.props=>",props);
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
      queue: {
      },
      validateError:false,
      isback: GetQueryString(location.hash, ['back']).back || '',
      person:0,
      personList:[],
      showAddModal:false,
      examiner:[],
      // reviewerList:this.props.reviewerList,
      reviewerList: [],
      userId:'',
      sort:'',
      qfilter: '',
    };
  }
// componentWillUpdate(){
//   if(this.props.selectDetail){
//     getService(API_PREFIX + `services/system/cateogry/categoryAuthInfo/get/${this.props.selectDetail.id}`,data=>{
//       console.log('neirong',data);
//       if (data.retCode===1) {
//         let allData=data.root.object
//         console.log(allData)
//         this.setState({reviewerList:allData.reviewerList})
//         let examiner=this.state.examiner
//       }
//     })
//   }
  
// }
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('getChangeDate==>>', nextProps);
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
      if(nextProps.dataCodeType === 'columnTree' && nextProps.selectTreeData[0] && nextProps.selectTreeData[0].indexOf('-') > -1) {
        return {isSelected: false, isLeaf, nameDisabled }
      }else {
        return { isSelected: true, isLeaf, nameDisabled };
      }
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
    console.log('aaaaaaaaaaaaaaaa', this.props.selectDetail);
    if (!this.props.selectDetail) {
      return;
    }
      this.props.RightForm.map(item => {
        console.log(item);
        if (item.key === 'disabled') {
          this.props.form.setFieldsValue({
            disabled: this.props.selectDetail.disabled ? '停用' : '正常',
          });
        } else {
          this.setState({reviewerList:this.props.selectDetail.reviewerList, examiner: this.props.selectDetail.reviewerList || []});
          this.props.form.setFieldsValue({
            [item.key]: this.props.selectDetail[item.key],
          });
        }
      });
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
      // this.setState({reviewerList:[]})
      console.log(this.state.queue);
      this.props.setLoading(true);
      let special = this.props.externalData;
      let add = [];
      let start = [];
      let stop = [];
      let update = [];
      let addChild = [];
      let deletePro = [];
      const dealTreeData = array => {
        console.log("dealTreeData",array);
        // if(array.length==0){

        // }
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
      console.log(this.state.queue);
      if (this.state.queue.startQueue) {
         //启用接口
        // let body = { idList: this.state.queue.startQueue };
        let body=this.state.queue.startQueue;

        start.push(
          new Promise((resolve, reject) => {
            postService(API_PREFIX + `${this.props.startUrl}`, body, data =>
            {
              if (data.status===1) {
                resolve(data);
              }else{
                reject(data.errorMsg);
              }
            }
            );
          })
        );
      }
      if (this.state.queue.stopQueue) {
        // let body = { idList: this.state.queue.stopQueue };
        //停用接口
        let body=this.state.queue.stopQueue;
        stop.push(
          new Promise((resolve, reject) => {
            postService(API_PREFIX + this.props.stopUrl, body, data =>
            {
              if (data.status===1) {
                resolve(data);
                this.setState({queue:{}});
              }else{
                reject(data.errorMsg);
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
          console.log(this.state.reviewerList);
          console.log(this.state.examiner);
          let body = special
            ? parentData.leaf
              ? {
                name: data.name,
                departments: data.department?dealTreeData(data.department).split(','):[],
                partys: data.partyid?dealTreeData(data.partyid).split(','):[],
                groups: data.virtualgroupid?dealTreeData(data.virtualgroupid).split(','):[],
                unions: data.unionsId ? dealTreeData(data.unionsId).split(',') : [],
                upgradeCategoryId: parentData.upgradeCategoryId,
                categoryState: data.disabled ? '0' : '1',
                instruction: data.instruction,
                type: parentData.type,
                reviewerList:this.state.examiner,
                organization_state:fieldsValue.organization_state,
                nickName:fieldsValue.nickName,
                show_index:fieldsValue.show_index,
              }
              : {
                name: data.name,
                departments: data.department
                  ? dealTreeData(data.department).split(',')
                  : [],
                partys: data.partyid ? dealTreeData(data.partyid).split(',') : [],
                unions: data.unionsId ? dealTreeData(data.unionsId).split(',') : [],
                groups: data.virtualgroupid
                  ? dealTreeData(data.virtualgroupid).split(',')
                  : [],
                categoryState: data.disabled ? '0' : '1',
                instruction: data.instruction,
                type: parentData.type,
                reviewerList:this.state.examiner,
                organization_state:fieldsValue.organization_state,
                nickName:fieldsValue.nickName,
                show_index:fieldsValue.show_index,
              }
            : parentData.parent ? { //党组织是parentId,企业部门是parent
              name: data.name,
              partyOrganizationState: data.disabled ? '0' : '1',
              organizationState: data.disabled ? '0' : '1',
              instruction: data.instruction,
              treepath: cutTreePath(parentData.treepath),
              parent: parentData.parent,
              fullname: cutFullName(parentData.fullname)+'>'+data.name,
              type: parentData.type,
              reviewerList:this.state.examiner,
              organization_state:fieldsValue.organization_state,
              nickName:fieldsValue.nickName,
              show_index:fieldsValue.show_index,
            } : parentData.parentid? {
              name: data.name,
              partyOrganizationState: data.disabled ? '0' : '1',
              organizationState: data.disabled ? '0' : '1',
              instruction: data.instruction,
              treepath: cutTreePath(parentData.treepath),
              parentid: parentData.parentid,
              fullname: cutFullName(parentData.fullname) + '>' + data.name,
              type: parentData.type,
              reviewerList:this.state.examiner,
              organization_state:fieldsValue.organization_state,
              nickName:fieldsValue.nickName,
              show_index:fieldsValue.show_index,
            }:{
              name: data.name,
              partyOrganizationState: data.disabled ? '0' : '1',
              organizationState: data.disabled ? '0' : '1',
              instruction: data.instruction,
              treepath: cutTreePath(parentData.treepath),
              fullname: cutFullName(parentData.fullname) + '>' + data.name,
              type: parentData.type,
              reviewerList:this.state.examiner,
              organization_state:fieldsValue.organization_state,
              nickName:fieldsValue.nickName,
              show_index:fieldsValue.show_index,
            };
            console.log('00000000',body)

          add.push(
            new Promise((resolve, reject) => {
              let regu = "^[ ]+$";
              let re = new RegExp(regu);
              let NL = re.test(body.name);
              console.log(body);
              if(NL){
                Message.error('部门名称不能全部为空格');
                return false;
              }
              if(body.name!=''){
                this.setState({reviewerList:[]});
                if(body.departments===''&&body.groups===''&&body.partys===''){//传全部时，默认传tenantId
                  body.viewTenantId=window.sessionStorage.getItem("tenantId");
                }
                postService(API_PREFIX + `${this.props.addUrl}`, body, data =>
                {
                  if (data.status===1) {
                    if(this.props.type === 'column'){
                      body['id'] = data.root.object.id
                      this.props.setColumnAuth(body,'add')
                    }
                    resolve(data);
                  }else{
                    reject(data.errorMsg);
                  }
                });
                this.setState({queue:{}});
              }else if(body.name==''){
                Message.error('部门名称不能为空');
              }
            })
          );
        });
      }
      if (this.state.queue.addChildQueue) {     //下级
        this.state.queue.addChildQueue.map(item => {
          let data = this.getSelectDetail(item);
          let parentData = this.getSelectDetail(data.parentId);
          console.log(this.state.reviewerList);
          console.log(this.state.examiner);
          let body = special
            ? {
              name: data.name,
              departments: data.department ? dealTreeData(data.department).split(',') : [],
              partys: data.partyid ? dealTreeData(data.partyid).split(',') : [],
              unions: data.unionsId ? dealTreeData(data.unionsId).split(',') : [],
              groups: data.virtualgroupid
                ? dealTreeData(data.virtualgroupid).split(',')
                : [],
              upgradeCategoryId: data.parentId,
              categoryState: data.disabled ? '0' : '1',
              instruction: data.instruction,
              type:parentData.type,
              reviewerList:this.state.examiner,
              organization_state:fieldsValue.organization_state,
              nickName:fieldsValue.nickName,
              show_index:fieldsValue.show_index,
            }
            : parentData.parentid ? {       //党组织是parentId,企业部门是parent
              name: data.name,
              partyOrganizationState: data.disabled ? '0' : '1',
              organizationState: data.disabled ? '0' : '1',
              instruction: data.instruction,
              parentid: parentData.id,
              treepath: parentData.treepath,
              fullname: parentData.fullname+'>'+data.name,
              type: parentData.type,
              reviewerList:this.state.examiner,
              organization_state:fieldsValue.organization_state,
              nickName:fieldsValue.nickName,
              show_index:fieldsValue.show_index,
            } : parentData.parent?{
              name: data.name,
              partyOrganizationState: data.disabled ? '0' : '1',
              organizationState: data.disabled ? '0' : '1',
              instruction: data.instruction,
              parent: parentData.id,
              treepath: parentData.treepath,
              fullname: parentData.fullname + '>' + data.name,
              type: parentData.type,
              reviewerList:this.state.examiner,
              organization_state:fieldsValue.organization_state,
              nickName:fieldsValue.nickName,
              show_index:fieldsValue.show_index,
            }:{
              name: data.name,
              partyOrganizationState: data.disabled ? '0' : '1',
              organizationState: data.disabled ? '0' : '1',
              instruction: data.instruction,
              treepath: parentData.treepath,
              fullname: parentData.fullname + '>' + data.name,
              type: parentData.type,
              reviewerList:this.state.examiner,
              organization_state:fieldsValue.organization_state,
              nickName:fieldsValue.nickName,
              show_index:fieldsValue.show_index,
            };
            console.log('11111111',body)
          addChild.push(
            new Promise((resolve, reject) => {
              let regu = "^[ ]+$";
              let re = new RegExp(regu);
              let NL = re.test(body.name);
              if(NL){
                Message.error('部门名称不能全部为空格');
                return false;
              }
              if(body.name!=''){
                this.setState({reviewerList:[]});
                if(body.departments===''&&body.groups===''&&body.partys===''){//传全部时，默认传tenantId
                  body.viewTenantId=window.sessionStorage.getItem("tenantId");
                }
                postService(API_PREFIX + this.props.addUrl, body, data =>
                  {
                    if (data.status===1) {
                      if(this.props.type === 'column'){
                        body['id'] = data.root.object.id;
                        this.props.setColumnAuth(body,'add')
                      }
                      console.log(data)
                      resolve(data);
                    }else{
                      reject(data.errorMsg);
                    }
                  });
                  this.setState({queue:{}});
              }else if(body.name==''){
                Message.error('部门名称不能为空');
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
                if (data.status===1) {
                  resolve(data);
                  this.setState({queue:{}});
                }else{
                  
                  reject(data.errorMsg);
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
            console.log(data);
          // if(data.department){
          //   if(data.department.length==0&&data.partyid.length==0&&data.virtualgroupid.length==0){
          //     data.department=this.props.orgList;
          //     data.partyid=this.props.partyList;
          //     data.virtualgroupid=this.props.virList;
          //   }
          console.log(this.state.reviewerList);
          console.log(this.state.examiner);
          // }
          console.log(this.state.examiner);
          if(data.examiner){
            
          }
          let body = {
            name: data.name,
            departments: data.department ? dealTreeData(data.department).split(',') : [],
            partys: data.partyid ? dealTreeData(data.partyid).split(',') : [],
            unions: data.unionsId ? dealTreeData(data.unionsId).split(',') : [],
            groups: data.virtualgroupid
              ? dealTreeData(data.virtualgroupid).split(',')
              : [],
            id: item,
            categoryState: data.disabled ? '0' : '1',
            partyOrganizationState: data.disabled ? '0' : '1',
            instruction: data.instruction,
            fullname: cutFullName(data.fullname)+'>'+data.name,
            reviewerList:this.state.examiner,
            organization_state:fieldsValue.organization_state,
            nickName:fieldsValue.nickName,
            show_index:fieldsValue.show_index,
            type: data.type,
            upgradeCategoryId:data.upgradeCategoryId,
          };
          console.log('333333333',body)
          if(this.props.type === 'column'){
            this.props.setColumnAuth(body,'edit')
          }
          update.push(
            new Promise((resolve, reject) => {
              let regu = "^[ ]+$";
              let re = new RegExp(regu);
              let NL = re.test(body.name);
              if(NL){
                Message.error('部门名称不能全部为空格');
                return false;
              }
              console.log(body);
              if(body.name!=''){
                this.setState({reviewerList:[]});
                if(body.departments===''&&body.groups===''&&body.partys===''){//传全部时，默认传tenantId
                  body.viewTenantId=window.sessionStorage.getItem("tenantId");
                }
                postService(API_PREFIX + `${this.props.updateUrl}`, body, data =>
                {
                  if (data.status===1) {
                    resolve(data);
                    this.setState({queue:{}});
                  }else{
                    console.log('data.errorMsg',data.errorMsg);
                    reject(data.errorMsg);
                    this.props.setLoading(false);
                  }
                }
                );
              }else if(body.name==''){
                Message.error('部门名称不能为空');
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
        this.setState({reviewerList:[]});
        this.props.columnChange('1');
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

      this.props.NewAddNode(false);
    });
  }
  //删除子节点 错误
  deleteNode=()=>{
    this.setState({ queue: {} });
  }

  getSelectDetail = selectKey => {
    return this.dataList.filter(_ => _.key === selectKey)[0];
  };

  onRadioChange = (e, key) => {
    this.setState({ RadioValue: e.target.value });
    // this.props.form.setFieldsValue({ [key]: e.target.value });
  };
//审核人员添加
  addPerson=()=>{
    console.log(this.state)
    // let person=this.state.person;
    let List=this.state.reviewerList.filter(item=>{
      return item.userId!==undefined
    })

    if(this.state.reviewerList.length!==List.length){
      Message.warning('请选择人员')
    }else{
      let reviewerList=this.state.reviewerList?this.state.reviewerList:[];
      let obj={
        id:0,
        ids: [],
        lastname: "",
        points: 0,
        revision: 1,
        totalPoints: 0,
        totalTreasure: 0,
        treasure: 0,
      };
      reviewerList.length<5?reviewerList.push(obj):null;
      this.setState({ reviewerList});
    }

  }
//审核人删除
  deletePerson=(index)=>{
    let InputData = { ...this.state.InputData };
    InputData['reviewerList'] = 0;
    this.setState({ InputData, treeKey: 'reviewerList' });

    let reviewerList=this.state.reviewerList;
    reviewerList.splice(index,1);
    let examiner=[];
    reviewerList.map(item=>{
      examiner.push({userId:item.userId, userName: item.userName, categoryid: item.categoryid});
    });
    console.log(examiner);
    this.setState({examiner,reviewerList});
  }
  selectPerson=(item,index)=>{
    this.setState({showAddModal:true});
    this.setState({userId:item.userId,sort:index});
    
  }
//审核确定
  handleAddModalOK=()=>{
    let InputData = { ...this.state.InputData };
    // this.setState({ queue: {id:'0'} });
    let selectedData=this.props.selectRowsData[0];
    if(!selectedData) { // yelu 2019-01-02 未选择人员点击确定的时候做提示，以免下面代码报错
      message.error('请选择审核人员');
      return;
    }
    let reviewerList=this.state.reviewerList;
    for(let i = 0; i < reviewerList.length; i++) { // yelu 2019-01-02 避免选择了相同的审核人员
      if(reviewerList[i].userId == selectedData.id) {
        message.error('请不要选择相同的审核人员');
        return;
      }
    }
    InputData['reviewerList'] = selectedData.id;
    this.setState({ InputData, treeKey: 'reviewerList' });
    let userId=this.state.userId;
    let sort=this.state.sort;
    console.log(reviewerList);
    let selectDetail = this.props.selectDetail
    console.log('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', selectDetail)
    reviewerList[sort]={userId:selectedData.id,userName:selectedData.name, categoryid: selectDetail.id};
    let examiner=[];
    reviewerList.map(item=>{
      examiner.push({userId:item.userId,userName:item.userName, categoryid: item.categoryid});
    });
    console.log(examiner);
    this.setState({examiner});
    // if(selectedData.userId!=userId){
    //   reviewerList.splice(sort,1,selectedData);
    //   let examiner=this.state.examiner
    //   this.setState({reviewerList})
    //   console.log(reviewerList)
    //   examiner.splice(sort,1,selectedData.userId)
    //   // examiner.push(selectedData.userId+'')
    //   this.setState({examiner})
    //   this.props.form.setFieldsValue({reviewerList:examiner}); //为userId设置值
    // }
    this.setState({showAddModal:false});
    // console.log(selectedData)
    // examiner.push(selectedData.userId+'')
   
   
   
  }
  handleAddModalCancel=()=>{
    this.setState({showAddModal:false});
  }
  handleInput=(e)=>{
    // console.log("value",value);
    let qfilter = e.target.value == '' ? '' : `Q=name=${e.target.value}`; // yelu 2019-01-02 修改选择人员查询后分页后不带查询条件
    this.setState({qfilter});
    // yelu 2019-01-02 每次查询的时候要重置页码为1
    // this.props.getData(API_PREFIX+`services/system/systemAndCompanyUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=lastname_S_LK=${e.target.value}`);
    this.props.getPageData({currentPage: 1, pageSize: 10, query: qfilter}); // 每次查询时初始缓冲里面的页码为默认值
    this.props.getData(API_PREFIX+`services/web/company/userInfo/list/1/10?${qfilter}`);
  }
  afterClose=()=>{
      this.setState({qfilter:''});
  }

  render() {
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
        dataIndex: 'name',
        key: 'name',
      },
      {
        title:'手机号',
        dataIndex:'mobile',
        key:'mobile',
      },
      {
        title:'部门',
        dataIndex:'fullName',
        key:'fullName',
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
              ):item.type === 'Checkbox'?this.props.selectDetail&&this.props.selectDetail.type=='1'||this.props.datatype=='1'?(
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
                       (reviewerList instanceof Array)&&reviewerList&&reviewerList.map((data,index)=>{
                         console.log(data);
                        //  return (<div key={index}>{data.lastname} </div>)
                        return (<div style={{width:'400px'}} key={index}><input disabled className='ant-form-item-control-input' value={data.userName} style={{width:'30%'} }/>　　<button  className='ant-btn' onClick={()=>this.selectPerson(data,index)}>选择人员</button>　　<button className='ant-btn' onClick={()=>this.deletePerson(index)}>删除</button></div>);
                      })
                      
                    }
                    
                  </div>
                  
                )}
               <Button onClick={this.addPerson} disabled={updatePower? !isSelected:true} >增加人员</Button>

               
              </Form.Item>
              // <div/>//暂时先屏蔽xwx2019/8/7
              ):null:item.type === 'select' ? (
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
                      ) : (
                        <Form.Item {...formItemLayout} label={item.label}>
                          {getFieldDecorator(item.key, 
                            {
                              validateTrigger: ['onFocus', 'onChange','onBlur'],
                              initialValue: '',
                              rules: [{ validator:this.nameValidator}],
                            })(
                            <Input
                              // disabled={updatePower?((item.key==='name'&&this.state.nameDisabled)|| !isSelected):true}
                              disabled={(this.props.inputDisabled === false)? false : (updatePower?((item.key==='name'&&this.state.nameDisabled)|| !isSelected):true)}
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
              isforbed={this.props.isforbed}
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
              columnonCLick={this.props.columnonCLick}
              NewAddNode={this.props.NewAddNode}
              checkTree = {'columnTreeType'}
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
            <Button className="resetBtn" type="primary" onClick={() => history.back()}>
              返回
            </Button> : null}
            {/* <Button className="resetBtn" type="primary" onClick={() => history.back()}>
              返回
            </Button> */}
          <Button className="queryBtn" type="primary" onClick={this.handleSubmit} disabled={!isSelected ? true: JSON.stringify(this.state.queue)!=='{}'?false:true}>
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
          afterClose={this.afterClose}
        >
          <FormAndInput
            columns={columns}
            url={'services/web/company/userInfo/list'}
            onSearch={this.handleInput}
            qfilter={this.state.qfilter} //yelu 2019-01-02 修改选择人员查询后分页后不带查询条件
          />
        </Modal>
      </div>
    );
  }
}