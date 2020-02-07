import React, { Component } from 'react';
import { Form, Button, message, Row, Col, Radio } from 'antd';
import { connect } from 'react-redux';
import TreeList from '../../../component/tree/TreeList';
import TreeArr from '../../../component/tree/TreeArr';
import { getService, postService, GetQueryString } from '../../myFetch';
import { setCheckTreeData } from '../../../../redux-root/action/tree/tree';
import API_PREFIX from '../../apiprefix';

@Form.create()
@connect(
  state => ({
    powers: state.powers,
    AllTreeData: state.tree.treeCheckData,
  }),
  dispatch => ({
    setCheckData: n => dispatch(setCheckTreeData(n)),
  })
)
class AuthorizationRang extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayWarn: false,
      AllTreeData: this.props.AllTreeData,
      checkData: {
        department: [],
        partyOrganization: [],
        virtualGroup: [],
        tradeUnion: []
      },
      department: [],
      partyOrganization: [],
      virtualGroup: [],
      tradeUnion: [],
      //从页面跳转的url中获取userId
      userId: GetQueryString(location.hash, ['userId']).userId,//保存当前用户的id (从前一个页面获取)
      wordTreeData: [],
      value: '1',
    };
  }
  componentDidMount() {
    //获取展示的树的数据
    this.getData();
  }
  //根据用户的userId获取用户拥有的发布权限范围
  getAuthData = () => {
    getService(API_PREFIX + `services/web/company/userInfo/userDataResource/get/${this.state.userId}`, data => {
      if (data.status == 1) {
        //设置默认，将用户已经拥有的发布权限范围设置到checkData中
        let obj = data.root.object;//获取返回的内容
        console.log("obj", obj);
        if (obj) {//不为空
          if (obj.tenantId && obj.userId || obj.orgIds.length === 0 && obj.partyIds.length === 0 && obj.virtualGroupIds.length === 0 && obj.unionIds.length) {//全部
            this.setState({ value: '1' });
          } else {//部分
            this.setState({ value: '2' });
          }
          // let orgIds = obj.orgIds&&obj.orgIds.length!==0 ? this.handleTreeData(this.state.department, obj.orgIds, []) : []
          // let virtualGroupIds = obj.virtualGroupIds&&obj.virtualGroupIds.length!==0 ? this.handleTreeData(this.state.virtualGroup, obj.virtualGroupIds, []) : []
          // let unionIds = obj.unionIds&&obj.unionIds.length!==0 ? this.handleTreeData(this.state.tradeUnion, obj.unionIds, []) : []
          // let partyIds = obj.partyIds&&obj.partyIds.length!==0 ? this.handleTreeData(this.state.partyOrganization, obj.partyIds, []) : []
          this.props.setCheckData({
            department: obj.orgIds && obj.orgIds.length !== 0 ? obj.orgIds : [],
            partyOrganization: obj.partyIds && obj.partyIds.length !== 0 ? obj.partyIds : [],
            virtualGroup: obj.virtualGroupIds && obj.virtualGroupIds.length !== 0 ? obj.virtualGroupIds : [],
            tradeUnion: obj.unionIds && obj.unionIds.length !== 0 ? obj.unionIds : [],
            // department: orgIds,
            // partyOrganization: partyIds,
            // virtualGroup: virtualGroupIds,
            // tradeUnion: unionIds,
            isCheck: false,
          });
        }
      }
    });
  }
  handleTreeData = (treeData, orgData, res) => {
    const depTree = (treeData, key, res) => {
      treeData.forEach(v => {
        if (v.id == key && (!v.children || v.children.length == 0)) {
          res.push(key)
        }
        if (v.children) {
          depTree(v.children, key, res)
        }
      })
    }
    orgData.map(item => {
      depTree(treeData, item, res)
    })
    return res
  }
  //获取部门树的数据
  getDepartmentData = () => {
    let promise = new Promise((pass, fail) => {
      getService(API_PREFIX + `services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false`, data => {
        if (data.status === 1) {
          let depData = data.root.object;
          this.dealDepartmentData(depData);
          console.log('virtualGroupData==>', depData);
          this.setState({ department: depData });
          pass(depData);
        }
      });
    });
    return promise;
  }
  //获取党组织树的数据
  getPartyData = () => {
    let promise = new Promise((pass, fail) => {
      getService(API_PREFIX + `services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1`, data => {
        if (data.status === 1) {
          let partyData = data.root.object
          this.dealPartyOrganaitonData(partyData)
          this.setState({ partyOrganization: partyData });
          pass(partyData)
        }
      })
    })
    return promise
  }
  //获取虚礼群组树的数据
  getGroupData = () => {
    let promise = new Promise((pass, fail) => {
      getService(API_PREFIX + `services/web/company/group/getGroupListTree`, data => {
        if (data.status === 1) {
          let virtualGroupData = data.root.object;
          this.dealVirtualGroupData(virtualGroupData);
          console.log('virtualGroupData==>', virtualGroupData);
          this.setState({ virtualGroup: virtualGroupData });
          pass(virtualGroupData);
        }
      });
    });
    return promise;
  }
  //获取工会树的数据
  getUnionData = () => {
    let promise = new Promise((pass, fail) => {
      getService(API_PREFIX + `services/web/union/org/getUnionOrgList/0`, data => {
        if (data.status === 1) {
          let tradeUnionData = data.root.object;
          this.dealtradeUnionDataData(tradeUnionData);
          console.log('virtualGroupData==>', tradeUnionData);
          this.setState({ tradeUnion: tradeUnionData });
          pass(tradeUnionData);
        }
      });
    });
    return promise;
  }
  //获取四棵树的数据
  getData = () => {
    let powers = this.props.powers;
    let departmentPowers=powers && powers['20004.21501.000'];//部门树权限码
    let partyPower=powers && powers['20005.23002.003'];//党组织权限
    let virtualGroupPowers=powers && powers['20004.21505.000'];//虚拟树权限码
    let tradePowers = powers && powers['20007.21704.000']; //工会树权限码
    this.getAuthData()
    departmentPowers && this.getDepartmentData()
    partyPower && this.getPartyData()
    virtualGroupPowers && this.getGroupData()
    tradePowers && this.getUnionData()
    // Promise.all([this.getDepartmentData(), this.getPartyData(), this.getGroupData(), this.getUnionData()]).then(data => {
    //   console.log(data);
    //   this.setState({ department: data[0], partyOrganization: data[1], virtualGroup: data[2], tradeUnion: data[3] });
    //   this.getAuthData()
    // });
  }
  //处理部门数据的函数
  dealDepartmentData(dp) {
    dp.map((item, index) => {
      item.key = item.id + '';
      item.children = item.subCompanyOrgList;
      if (item.subCompanyOrgList) {
        this.dealDepartmentData(item.subCompanyOrgList);
      }
    });
  }

  //处理虚拟圈的函数
  dealVirtualGroupData(vg) {
    vg.map(item => {
      item.key = item.id ? item.id : '-1';
      item.id = item.id ? item.id : '-1';
      item.children = item.subList;
      if (item.subList) {
        this.dealVirtualGroupData(item.subList);
      }
    });
  }

  // 处理党组织关系的函数
  dealPartyOrganaitonData(po) {
    po.map((item, index) => {
      item.name = item.partyName
      item.key = item.id + '';
      item.children = item.partyOrgList;
      if (item.partyOrgList) {
        this.dealPartyOrganaitonData(item.partyOrgList);
      }
    });

  }

  //处理组织工会关系的函数
  dealtradeUnionDataData(po) {
    console.log("www", po);
    po.map((item, index) => {
      item.key = item.id + '';
      item.children = item.unionOrgList;
      if (item.unionOrgList) {
        this.dealtradeUnionDataData(item.unionOrgList);
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
  dealCheckTreeData = (treeData, checkData, res) => { //处理传个后台选择的树数据
    const dealData = (data) => {
      data.map(item => {
        if (checkData.indexOf(item.id) > -1) {
          res.push(item.id)
        } else if (item.children && item.children.length > 0) {
          let flag = true
          item.children.forEach(v => {
            if (checkData.indexOf(v.id) == -1) {
              flag = false
            }
          })
          if (flag) {
            res.push(item.id)
          }
        }
        if (item.children && item.children.length > 0) {
          dealData(item.children)
        }
      })
    }
    dealData(treeData)
    return res
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      console.log("选中的树中的数据是：", this.state.checkData);
      // if ((this.state.checkData.department.length === 0 || !this.state.checkData.department)&&
      //     (this.state.checkData.partyOrganization.length === 0 || !this.state.checkData.partyOrganization)&&
      //     (this.state.checkData.virtualGroup.length === 0 || !this.state.checkData.virtualGroup)
      // ) {
      //   this.setState({displayWarn: true})
      //   return;
      // }
      if (err) {
        return;
      }
      if (this.state.value === '2' && this.state.checkData.department.length === 0 && this.state.checkData.partyOrganization.length === 0 && this.state.checkData.virtualGroup.length === 0 && this.state.checkData.tradeUnion.length === 0) {
        message.error("必须选择一类组织");
        return;
      }
      let values = {};
      if (this.state.value === '1') {//选择全部
        values = {
          ...fieldsValue,
          'orgIds': [],
          'partyIds': [],
          'virtualGroupIds': [],
          'unionIds': [],
          'userId': this.state.userId,
          'tenantId': GetQueryString(location.hash, ['tenantId']).tenantId,
        };
      } else if (this.state.value === '2') {//选择部分
        // let orgIds = this.dealCheckTreeData(this.state.department, this.state.checkData.department, [])
        // let partyIds = this.dealCheckTreeData(this.state.partyOrganization, this.state.checkData.partyOrganization, [])
        // let virtualGroupIds = this.dealCheckTreeData(this.state.virtualGroup, this.state.checkData.virtualGroup, [])
        // let unionIds = this.dealCheckTreeData(this.state.tradeUnion, this.state.checkData.tradeUnion, [])
        // console.log('我问过i我攻击二欧文机构文件欧冠建瓯我', orgIds)
        values = {
          ...fieldsValue,
          'orgIds': this.state.checkData.department.length !== 0 && this.state.checkData.department.toString() ? this.state.checkData.department.toString().split(',') : [],
          'partyIds': this.state.checkData.partyOrganization.length !== 0 && this.state.checkData.partyOrganization.toString() ? this.state.checkData.partyOrganization.toString().split(',') : [],
          'virtualGroupIds': this.state.checkData.virtualGroup.length !== 0 && this.state.checkData.virtualGroup.toString() ? this.state.checkData.virtualGroup.toString().split(',') : [],
          'unionIds': this.state.checkData.tradeUnion.length !== 0 && this.state.checkData.tradeUnion.toString() ? this.state.checkData.tradeUnion.toString().split(',') : [],
          // 'orgIds':orgIds,
          // 'partyIds':partyIds,
          // 'virtualGroupIds':virtualGroupIds,
          // 'unionIds':unionIds,
          'userId': this.state.userId,
          'tenantId': '',
        };
      }

      console.log("表单中的值为：", values);
      postService(API_PREFIX + 'services/web/company/userInfo/userDataResource/add', values, data => {
        if (data.status == 1) {
          message.success('保存成功！');
          // location.hash = "/EnterpriseConfig/UserManagement";
        } else {
          message.error(data.errorMsg);
        }
      });
    });

  }

  //全部，选择部分
  onChange = (e) => {
    console.log('十大大苏打实打实', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    let powers = this.props.powers;
    let departmentPowers = powers && powers['20004.21501.000'];//部门树权限码
    let partyPower = powers && powers['20005.23002.003'];//党组织权限
    let virtualGroupPowers = powers && powers['20004.21505.000'];//虚拟树权限码
    let tradePowers = powers && powers['20007.21704.000']; //工会树权限码
    const { checkData, wordTreeData, value } = this.state;
    return (
      <Form onSubmit={this.handleSubmit} style={{ padding: "30px" }}>
        <Row>
          {/* <Col> <span style={{color:'red'}}>*</span>数据权限设置:</Col>
             <div style={{display:this.state.displayWarn?'block':'none',color:'red'}} >
               <span>必须选择某一发布范围</span>
             </div> */}
          <Col><span style={{ color: 'red' }}>*</span>&nbsp; 数据权限设置:</Col>
        </Row>
        <Row>
          <Radio.Group onChange={this.onChange} value={this.state.value}>
            <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value={'1'}>
              全部
              </Radio>
            <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value={'2'}>
              选择部分
              </Radio>
          </Radio.Group>
        </Row>
        {
          value != '1' ?
            (
              <div className='trees'>
                {
                  departmentPowers ? <div className="single-tree">
                    <span className="location-span">选择部门</span>
                    <div style={{ display: "flex" }}>
                      <TreeList treeData={this.state.department} checkable type="department" checkedKeys={checkData ? checkData.department : []} />
                      <a
                        style={{ marginLeft: "-60px", marginTop: "-20px", height: "25px",width:'60px' }}
                        className="location-btn operation"
                        onClick={() => (location.hash = '/EnterpriseConfig/DepartMent?back=1')}
                      >部门管理</a>
                    </div>
                  </div> : null
                }
                {
                  partyPower ? <div className="single-tree">
                    <span className="location-span">选择党组织</span>
                    <div style={{ display: "flex" }}>
                      <TreeList treeData={this.state.partyOrganization} checkable type="partyOrganization" checkedKeys={checkData ? checkData.partyOrganization : []} />
                      <a
                        style={{ marginLeft: "-76px", marginTop: "-20px", height: "25px",width:'76px' }}
                        className="location-btn operation"
                        onClick={() =>
                          (location.hash = '/PartyBuildGarden/PartyOrganization?back=1')
                        }
                      >党组织管理</a>
                    </div>
                  </div> : null
                }
                {
                  virtualGroupPowers ? <div className="single-tree">
                    <span className="location-span">选择虚拟群组</span>
                    <div style={{ display: "flex" }}>
                      <TreeList treeData={this.state.virtualGroup} wordTreeData={wordTreeData} checkable type="virtualGroup" checkedKeys={checkData ? checkData.virtualGroup : []} />
                      <a
                        style={{ marginLeft: "-88px", marginTop: "-20px", height: "25px",width:'88px' }}
                        className="location-btn operation"
                        onClick={() =>
                          (location.hash = '/EnterpriseConfig/VirtualGroup')
                        }
                      >虚拟群组管理</a>
                    </div>
                  </div> : null
                }
                {
                  tradePowers ? <div className="single-tree">
                    <span className="location-span">选择工会</span>
                    <div style={{ display: "flex" }}>
                      <TreeList treeData={this.state.tradeUnion} checkable type="tradeUnion" checkedKeys={checkData ? checkData.tradeUnion : []} />
                      <a
                        style={{ marginLeft: "-88px", marginTop: "-20px", height: "25px",width:'88px' }}
                        className="location-btn operation"
                        onClick={() => (location.hash = '/TradeManager/Organization?back=1')}
                      >工会组织管理</a>
                    </div>
                  </div> : null
                }
              </div>
            ) : null
        }
        {/* {value !== '1' ? (
          <div>
            <Row>
              <Col span={5}>
                选择部门
              </Col>
              <Col span={5}>
                <a className="operation" onClick={() => location.hash = "/EnterpriseConfig/DepartMent"}>部门管理</a>
              </Col>
              <Col span={5}>
                选择党组织
              </Col>
              <Col span={5}>
                <a className="operation" onClick={() => location.hash = "/PartyBuildGarden/PartyOrganization"}>党组织管理</a>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <div style={{ display: this.state.dis ? 'block' : 'none' }}>必选项</div>
                <TreeList treeData={this.state.department} checkable type="department" checkedKeys={checkData ? checkData.department : []} />
              </Col>
              <Col span={10}>
                <TreeList treeData={this.state.partyOrganization} checkable type="partyOrganization" checkedKeys={checkData ? checkData.partyOrganization : []} />
              </Col>
            </Row>
            <Row>
              <Col span={5}>
                选择虚拟组
              </Col>
              <Col span={5}>
                <a className="operation" onClick={() => location.hash = "/EnterpriseConfig/VirtualGroup"}>虚拟群组管理</a>
              </Col>


              <Col span={5}>
                选择工会组织
              </Col>
              <Col span={5}>
                <a className="operation" onClick={() => location.hash = "/TradeManager/Organization"}>工会组织管理</a>
              </Col>

            </Row>
            <Row>
              <Col span={10}>
                <TreeList treeData={this.state.virtualGroup} wordTreeData={wordTreeData} checkable type="virtualGroup" checkedKeys={checkData ? checkData.virtualGroup : []} />
              </Col>
              <Col span={10}>
                <TreeList treeData={this.state.tradeUnion} checkable type="tradeUnion" checkedKeys={checkData ? checkData.tradeUnion : []} />
              </Col>

            </Row>
          </div>
        ) : null} */}
        <Row>
          <Button style={{ marginLeft: "42%", marginTop: "20px", marginBottom: "100px" }} className="queryBtn" type="primary" htmlType="submit" size="large">保存</Button>
          <Button className="resetBtn" onClick={() => location.hash = "/EnterpriseConfig/UserManagement"}>返回</Button>
        </Row>
      </Form>

    );
  }

}
export default AuthorizationRang;