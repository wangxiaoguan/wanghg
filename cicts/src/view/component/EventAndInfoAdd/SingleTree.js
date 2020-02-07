import React, { Component } from 'react';
// import { Button } from 'antd';
import TreeList from '../../component/tree/TreeList';
import {
  setSelectTreeData,
  setCheckTreeData,
} from '../../../redux-root/action/tree/tree';
import { setModal}from'../../../redux-root/action/modal';
import { connect } from 'react-redux';
import { getService } from '../../content/myFetch';
import API_PREFIX from '../../content/apiprefix';
import {Link}from'react-router-dom';
// import { Popconfirm, Button, Modal } from 'antd';
import { Modal, Button } from 'antd';
const cutStr = str => {
  let result = str.split(',');
  return result;
};
@connect(
  state => ({
    checkTreeData: state.tree.treeCheckData,
    selectDetail: state.tree.treeSelectData.selectDetail,
    selectTreeData: state.tree.treeSelectData,
  }),
  dispatch => ({
    setSelectData: n => dispatch(setSelectTreeData(n)),
    setCheckData: n => dispatch(setCheckTreeData(n)),
    setModal: n => dispatch(setModal(n)),
  })
)
export default class MultipleTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkTreeData: this.props.checkTreeData,
      checkData: {
        column: [],
      },
      treeData:[],
      treeType :this.props.treeType,
      // treeData:this.props.treeData,
      allData: this.props.allData,
      InfoColumn:false,
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.checkTreeData !== prevState.checkTreeData) {
      let checkData = { ...prevState.checkData };
      checkData = { ...checkData, ...nextProps.checkTreeData };
      return { checkData, checkTreeData: nextProps.checkTreeData };
    }
    return null;
  }

  setInitialValue=(data)=>{
    if (this.props.type === 'selectTree') {
      this.props.setSelectData({ column: data });
    } else if (this.props.type === 'checkTree') {
      this.props.setCheckData({ column: data });
    }
  }
  componentDidUpdate(){
    if (this.props.treeType !== this.state.treeType) {
      let data = [];
      if (this.props.treeType===4) {
        data =this.state.allData.filter(item => item.type === '3');
      }else{
        data = this.state.allData.filter(item => item.type === '1');
      }
      this.DealData(data);
      this.setState({ treeData: data, treeType: this.props.treeType });
    }
  }
   DealData = data => {
     for (let index = 0; index < data.length; index++) {
       let node = data[index];
       node.key = node.id + '';
      //  node.name = node.showType===2?`${node.name}(首页标签)`:node.name;
       node.disabled = node.categoryState === '0';
       node.department = node.department ? cutStr(node.department) : [];
       node.partyid = node.partyid ? cutStr(node.partyid) : [];
       node.virtualgroupid = node.virtualgroupid
         ? cutStr(node.virtualgroupid)
         : [];
       node.children = node.subCategoryList;
       if (node.subCategoryList) {
         this.DealData(node.subCategoryList);
       }
     }
   };
   DealInfoData = data => {
      data.map(item => {
          item.key = item.id;
          item.children = item.subCategoryList;
          if(item.subCategoryList){
              this.DealInfoData(item.subCategoryList);
          }else if(item.id<0&&!item.subCategoryList){
              // this.setState({InfoColumn:true})
              item.noLower = true
              item.name = `${item.name}(请新建栏目)`
          }
      });
   }
   componentDidMount() {
     this.getTreeData();
     if (this.props.initialValue) {
       this.setInitialValue(this.props.initialValue);
     } else if (
       this.props.flowData &&
      JSON.stringify(this.props.flowData) !== '{}'
     ) {
       this.setInitialValue(this.props.flowData);
     } else if (this.props.leaveData && this.props.leaveData !== {}) {
       this.setInitialValue(this.props.leaveData);
     }
   }
  getTreeData = () => {
    let treeData = [];

    getService(API_PREFIX +'services/web/system/tree/category/getList?Q=categoryState=1',data => {
        if (data.status === 1) {
          if (this.props.moduleType === 'information') {
            treeData = data.root.object.filter(item => item.type === 1);
            this.DealInfoData(treeData);
          } else if (this.props.moduleType === 'event') {
            treeData = data.root.object.filter(item => item.type ===2||item.type ===5);
            this.DealInfoData(treeData);
          }
          
          this.setState({
            allData:data.root.object, treeData,
            treeDataKey: this.state.treeDataKey + 1,
          });
        }
      }
    );
  };
  confirm = () => {
    // location.hash = "/SystemSettings/ColumnManagement?back=1"
    Modal.confirm({
        title: '您确定直接前往栏目管理吗？',
        content: '直接前往栏目管理会丢失已修改的数据,建议先点击下方保存按钮!',
        okText: '确认',
        cancelText: '取消',
        onOk() {
            location.hash = "/InterfaceManagement/ColumnManagement?back=1";
        },
    });
  }
  render() {
    const { treeData, checkData,InfoColumn } = this.state;
    const { disabled, selectTreeData, type } = this.props;
    let text = '请先点击下方保存，再确定前往栏目管理，直接确定前往栏目管理会丢失已修改的数据';

    return (
      <div className="trees">
        {type === 'selectTree' ? (
          <TreeList
            type="column"
            treeData={treeData}  
            style={this.props.style}
            selectable  isforbed='true'
            selectedKeys={selectTreeData}
            disabled={disabled}
          />
        ) : (
          <TreeList
            type="column"
            treeData={treeData}
            checkable isforbed='true' 
            style={this.props.style}
            checkedKeys={checkData['column']}
            disabled={disabled}
            InfoColumn={InfoColumn}
          />
        )}
        {/* {
          this.props.style!='add'?<Link
          className="location-btn"
          style={{ marginLeft: '5px' }}
          to="/SystemSettings/ColumnManagement?back=1"
        >
          栏目管理
        </Link>:null
        } */}
        {/* {
          this.props.style!='add'?
          <Popconfirm placement="rightTop" title={text} onConfirm={this.confirm} okText="确定" cancelText="取消">
          <Button
            className="location-btn"
            style={{ marginLeft: '5px' }}
            // to="/SystemSettings/ColumnManagement?back=1"
            >
            栏目管理
            </Button> </Popconfirm>:null
        } */}
        {
          this.props.style!='add'?
          <Button
            className="location-btn"
            style={{ marginLeft: '5px' }}
            onClick={this.confirm}
            to="/InterfaceManagement/ColumnManagement?back=1"
            >
            栏目管理
            </Button>
             :null}
     
      </div>
    );
  }
}
