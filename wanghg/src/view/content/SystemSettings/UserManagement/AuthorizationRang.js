import React, { Component } from 'react';
import { Form, Button, message,Row,Col} from 'antd';
import { connect } from 'react-redux';
import TreeList from '../../../component/tree/TreeList';
import { getService ,postService,GetQueryString} from '../../myFetch';
import {setCheckTreeData} from '../../../../redux-root/action/tree/tree';
import API_PREFIX from '../../apiprefix';

@Form.create()
@connect(
    state => ({
  AllTreeData: state.tree.treeCheckData,
}),
    dispatch => ({
      setCheckData: n => dispatch(setCheckTreeData(n)),
    })
    )
class AuthorizationRang extends Component{
  constructor(props){
    super(props);
    this.state={
      displayWarn:false,
      AllTreeData:this.props.AllTreeData,
      checkData:{
        department:[],
        partyOrganization:[],
        virtualGroup:[]
      },
      department:[],
      partyOrganization:[],
      virtualGroup:[],
      //从页面跳转的url中获取userId
      userId:GetQueryString(location.hash,['userId']).userId,//保存当前用户的id (从前一个页面获取)
    }
  }
  componentDidMount(){
    //获取展示的树的数据
    this.getTreeData();
    //根据用户的userId获取用户拥有的发布权限范围
    console.log("******用户的id:",this.state.userId);
    getService(API_PREFIX+`services/system/systemAndCompanyUser/query/userRealease/${this.state.userId}`,data=>{
          if(data.retCode == 1){
            //设置默认，将用户已经拥有的发布权限范围设置到checkData中
            let  obj=data.root.object;//获取返回的内容
            console.log("obj",obj);
            if(obj){//不为空
              // this.setState({
              //   checkData:{
              //     department:obj.orgids?obj.orgids.split(','):[],
              //     partyOrganization:obj.partyPostIds?obj.partyPostIds.split(','):[],
              //     virtualGroup:obj.virtualGroupIds?obj.virtualGroupIds.split(','):[],
              //   },
              // });
              this.props.setCheckData({
                department:obj.orgids?obj.orgids.split(','):[],
                partyOrganization:obj.partyPostIds?obj.partyPostIds.split(','):[],
                virtualGroup:obj.virtualGroupIds?obj.virtualGroupIds.split(','):[],
                isCheck:false,
              })

            }

          }
    });



  }
  //获取三棵树的数据函数
  getTreeData=()=>{
    //虚拟群组数据的获取
    let virtualGroupData = [];
    getService(API_PREFIX + 'services/system/cateogry/group/tree', data => {
      if (data.retCode === 1) {
        virtualGroupData = data.root.list;
        this.setState({ virtualGroup:virtualGroupData });
      }
    });
    //获取部门的数据
    let organizationData = [];
    getService(API_PREFIX + 'services/system/organization/organizationList/get',data=>{
      if (data.retCode === 1) {
        organizationData = data.root.list;
        this.dealDepartmentData(organizationData);
        this.setState({ department:organizationData});

      }
    });
    //获取党组织机构中的数据
    let partyOrganizationData = [];
    getService(API_PREFIX +'services/system/partyOrganization/partyOrganizationList/get',data=>{
      if (data.retCode === 1) {
        partyOrganizationData = data.root.list;
        this.dealPartyOrganaitonData(partyOrganizationData);
        this.setState({partyOrganization: partyOrganizationData });

      }
    });

}
//处理部门数据的函数
  dealDepartmentData(dp){
    dp.map((item,index)=>{
      item.key=item.id+'';
      item.children=item.subOrganizationList;
      if(item.subOrganizationList){
        this.dealDepartmentData(item.subOrganizationList);
      }
    });
  }
// 处理党组织关系的函数
  dealPartyOrganaitonData(po){
    po.map((item,index)=>{
      item.key=item.id+'';
      item.children=item.partyOrganizationList;
      if(item.partyOrganizationList){
        this.dealPartyOrganaitonData(item.partyOrganizationList);
      }
    });

  }


  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.AllTreeData !== prevState.AllTreeData) {
      console.log(nextProps.AllTreeData);
      let checkData = prevState.checkData;
      checkData = { ...checkData, ...nextProps.AllTreeData };
      return { checkData, AllTreeData: nextProps.AllTreeData };
    }
    return null;
  }
  handleSubmit=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      console.log("选中的树中的数据是：", this.state.checkData)
      if ((this.state.checkData.department.length === 0 || !this.state.checkData.department)&&
          (this.state.checkData.partyOrganization.length === 0 || !this.state.checkData.partyOrganization)&&
          (this.state.checkData.virtualGroup.length === 0 || !this.state.checkData.virtualGroup)
      ) {
        this.setState({displayWarn: true})
        return;
      }
      if (err) {
        return;
      }
      const values={
        ...fieldsValue,
        'orgids':this.state.checkData.department.toString(),
        'partyPostIds':this.state.checkData.partyOrganization.toString(),
        'virtualGroupIds':this.state.checkData.virtualGroup.toString(),
        'userId':this.state.userId,
      };
      console.log("表单中的值为：",values);
      postService(API_PREFIX+'services/system/systemAndCompanyUser/save/userReleaseRange',values,data=>{
        if (data.retCode == 1) {
          message.success('发布范围权限选择成功！');
          location.hash = "/SystemSettings/UserManagement"
        } else {
          message.error(data.retMsg);
        }
      });
    })

  }
  render(){
    //获取数据
    console.log('displayWarn',this.state.department)
    console.log('displayWarn2',this.state.partyOrganization)
    console.log('displayWarn3',this.state.virtualGroup)
    console.log('多棵树勾选的值，根据type区分',this.state.checkData);
    const {checkData} =this.state;

     return (
         <Form onSubmit={this.handleSubmit} style={{paddingLeft:"10%",paddingTop:"20px"}}>
           <Row>
             <Col> <span style={{color:'red'}}>*</span>数据权限设置:</Col>
             <div style={{display:this.state.displayWarn?'block':'none',color:'red'}} >
               <span>必须选择某一发布范围</span>
             </div>
           </Row>
           <Row>
             <Col  span={4}>
              选择部门
             </Col>
             <Col  span={4}>
               <a className="operation" onClick={()=>location.hash="/SystemSettings/DepartMent"}>部门管理</a>
             </Col>
             <Col  span={4}>
               选择党组织
             </Col>
             <Col  span={4}>
               <a className="operation" onClick={()=>location.hash="/SystemSettings/PartyOrganization"}>党组织管理</a>
             </Col>
             <Col  span={4}>
               选择虚拟组
             </Col>
             <Col  span={4}>
               <a className="operation" onClick={()=>location.hash="/SystemSettings/VirtualGroup"}>虚拟群组管理</a>
             </Col>

           </Row>
           <Row>
             <Col  span={8}>
               <div style={{display:this.state.dis?'block':'none'}}>必选项</div>
               <TreeList treeData={this.state.department} checkable type="department" checkedKeys={checkData?checkData.department:[]}></TreeList>
             </Col>
             <Col  span={8}>
               <TreeList treeData={this.state.partyOrganization} checkable type="partyOrganization" checkedKeys={checkData?checkData.partyOrganization:[]}></TreeList>
             </Col>
             <Col  span={8}>
               <TreeList treeData={this.state.virtualGroup} checkable type="virtualGroup" checkedKeys={checkData?checkData.virtualGroup:[]}></TreeList>
             </Col>

           </Row>

            <Row>
              <Button style={{marginLeft:"42%",marginTop:"20px",marginBottom:"100px"}} className="queryBtn" type="primary" htmlType="submit" size="large">保存</Button>
              <Button  className="resetBtn" onClick={()=>location.hash = "/SystemSettings/UserManagement"}>返回</Button>
            </Row>
         </Form>

     );
  }

}
export default AuthorizationRang;