import React, {Component} from 'react';
import {Button,Radio,Modal} from 'antd';
import TreeList from '../../component/tree/TreeList';
import InfoTreeList from '../../component/tree/InfoTreeList';
import { setCheckTreeData } from '../../../redux-root/action/tree/tree';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getService, GetQueryString } from '../../content/myFetch';
import API_PREFIX from '../../content/apiprefix';
@connect(
  state => ({
    AllTreeData: state.tree.treeCheckData,
    checkTreeData: state.tree.treeCheckData,
    powers:state.powers
  }),
  dispatch => ({
    setCheckData: n => dispatch(setCheckTreeData(n)),
    
  })
)
/*
 * 资讯所属栏目专用
 */
export default class ColumnTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkTreeData: this.props.checkTreeData,
      checkData: {column: []},
      treeData:[],
      allData: this.props.allData,
      InfoColumn:false,
    };
  }

  componentDidMount = async () => {
      await this.getTreeData();
      if (this.props.initialValue) {
          this.setInitialValue(this.props.initialValue);
      } else if (this.props.flowData&&JSON.stringify(this.props.flowData) !== '{}'){
          this.setInitialValue(this.props.flowData);
      } else if (this.props.leaveData && this.props.leaveData !== {}) {
          this.setInitialValue(this.props.leaveData);
      }
    
  }
  setInitialValue=(data)=>{
      this.props.setCheckData({ column: data });
  }
  getTreeData = () => {

    let powersStore = this.props.powers;
    let powersLocal = JSON.parse(window.sessionStorage.getItem('powers'))
    let powers = powersLocal || powersStore;
    let columnPower=powers && powers['20003.21405.000'];//栏目管理权限


    if(columnPower){
        let treeData = [];
        getService(API_PREFIX + 'services/web/system/tree/category/getList?Q=categoryState=1', data => {
            if (data.status === 1) {
                if(this.props.belongedType === 'unionLearn'||this.props.belongedType === 'partyLearn'){
                  treeData = data.root.object.filter(item => item.type === 4||item.type===5);
                  this.DealInfoData(treeData);
                }else if (this.props.moduleType === 'information') {
                  treeData = data.root.object.filter(item => item.type === 1||item.type===5);
                  this.DealInfoData(treeData);
                }
                this.setState({treeData,treeDataKey: this.state.treeDataKey + 1});
            }
        })
    }
  }
  DealInfoData = data => {
      data.map(item => {
          item.key = item.id;
          item.children = item.subCategoryList;
          // item.name=item.showType===2?`${item.name}(首页标签)`:item.name;
          if(item.reviewerList&&item.reviewerList.length&&item.showType===2){
            item.name=`${item.name}(首页标签)(带审核)`
          }else{
            if(item.reviewerList&&item.reviewerList.length){
              item.name=`${item.name}(带审核)`
            }
            if(item.showType===2){
              item.name=`${item.name}(首页标签)`
            }
          } 
          if(item.subCategoryList){
              this.DealInfoData(item.subCategoryList);
          }else if(item.id<0&&!item.subCategoryList){
              // this.setState({InfoColumn:true})
              item.noLower = true
              item.name = `${item.name}(请新建栏目)`
          }
      })
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.checkTreeData !== prevState.checkTreeData) {
      let checkData = { ...prevState.checkData };
      checkData = { ...checkData, ...nextProps.checkTreeData };
      return { checkData, checkTreeData: nextProps.checkTreeData };
    }
    return null;
  }
  confirm = () => {
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
    const { disabled} = this.props;

    return (
        <div className="trees">
            <InfoTreeList
              type="column"
              treeData={treeData}
              checkable isforbed='true' 
              style={this.props.style}
              checkedKeys={checkData['column']}
              disabled={disabled}
              InfoColumn={InfoColumn}
            /> 
            {
              this.props.style!='add'?<Button className="location-btn" style={{ marginLeft: '5px' }} onClick={this.confirm} to="/InterfaceManagement/ColumnManagement?back=1">栏目管理</Button>:null
            }
        </div> 
    );
  }
}