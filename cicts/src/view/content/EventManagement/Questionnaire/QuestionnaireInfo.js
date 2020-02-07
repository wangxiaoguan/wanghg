import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { postService, getService,GetQueryString } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import { connect } from 'react-redux';
import  './info.less';
import { Form, Cascader, Button, Modal,Row,Col, Checkbox, Input,  Radio, Pagination, message  } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(
  state => ({
    powers: state.powers,
  }),
)
@Form.create()
export default class ApplyInformation extends Component {
  constructor(props) {
    super(props);
    let activeKey = GetQueryString(location.hash, ['activeKey']).activeKey || '0';
    this.state = {
      activityId: GetQueryString(location.hash, ['id']).id || '',
      visible: false,
      record:{},
      showData: [],
      dp:[],//视屏归属部门
      activeKey:String(activeKey),
      current: 1,
      topicList: '',
      optionNum:['A', 'B', 'C', 'D', 'E', 'F','G','H','I','J'],
      allCheckArr: [],
      isCan: '', // 用户能否参加
      time: '',
      total:"",
      activityName:JSON.parse(window.sessionStorage.getItem("activityName")) || "问卷信息",
    };
  }

  componentWillUnmount(){
    window.sessionStorage.removeItem('applyField');
  }

  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
    this.getCompanyData();
  }


////选中选项的函数
  CheckboxOnChange = (value, id) => {
    const { allCheckArr } = this.state;
    const obj = { topicId: id, optionId: value };
    let flag = false;
    for (let i = 0; i < allCheckArr.length; i += 1) {
      if (allCheckArr[i].topicId === id) {
        allCheckArr[i].optionId = value;
        flag = true;
      }
    }
    if (!flag) {
      allCheckArr.push(obj);
    }
    this.setState({ allCheckArr });
    console.log('获取所选像', allCheckArr);
  };




////分页的点击事件
onChangePagination = value => {
  // debugger;
  const {record}=this.state;
  this.setState({ current: value },()=>{
    this.applyInfoDetail(record);
  });
};

  ////单选，多选，问答
  renderItem = (item, index) => {
    const { form } = this.props;
    const { current, optionNum } = this.state;
    if (item.titleType === 1) {
      return (
        <Row key={item.id}>
          <Col offset={1}>
            <Col span={22} style={{ marginBottom: '10px' }} 
             className="selectItem"
            >
              <span style={{ marginRight: 5 }}>{index + 1 + (current - 1) * 10}.</span>
              {item.titleName}
              <span style={{ color: '#40a9ff' }}>（单选）</span>
            </Col>
          </Col>
          <Col offset={1}>
            <Form.Item>
                 <Checkbox.Group
                  style={{ width: '100%' }}
                  value={item.userAnswer ? [item.userAnswer]:null}
                >
                  <Row>
                    {item.optionInfos &&
                      item.optionInfos.map((items, list) => (
                        // <Col >
                        <Checkbox 
                         className="Checkbox"
                         value={items.id}
                         key={items.id}
                         disabled
                        >
                          <span 
                          className="selectItem"
                          >
                            {optionNum[list]}.{items.content}
                          </span>
                        </Checkbox>
                        // </Col>
                      ))}
                  </Row>
                </Checkbox.Group>
     
            </Form.Item>
          </Col>
        </Row>
      );
    }
    if (item.titleType === 2) {
      return (
        <Row key={item.id}>
          <Col offset={1}>
            <Col span={22} style={{ marginBottom: '10px' }} 
             className="selectItem"
            >
              <span style={{ marginRight: 5 }}>{index + 1 + (current - 1) * 10}.</span>
              {item.titleName}
              <span style={{ color: '#40a9ff' }}>（多选）</span>
            </Col>
          </Col>
          <Col offset={1}>
            <Form.Item>
                <Checkbox.Group
                  style={{ width: '100%' }}
                  value={item.userAnswer  ? item.userAnswer.split(","):null}
                >
                  <Row>
                    {item.optionInfos &&
                      item.optionInfos.map((items, list) => (
                        // <Col >
                        <Checkbox 
                         className="Checkbox"
                         value={items.id}
                         key={items.id}
                        disabled
                        >
                          <span 
                          className="selectItem"
                          >
                            {optionNum[list]}.{items.content}
                          </span>
                        </Checkbox>
                        // </Col>
                      ))}
                  </Row>
                </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>
      );
    }
  
    return (
      <Row key={item.id}>
        <Col offset={1}>
          <Col span={1}>{index + 1 + (current - 1) *10}.</Col>
          <Col span={22} style={{ marginBottom: '10px' }} 
          className="selectItem"
          >
            {item.titleName}
          </Col>
        </Col>
        <Col offset={1}>
          <Form.Item>
              <Input
            
                value={item.userAnswer}
                disabled
              />
          </Form.Item>
        </Col>
      </Row>
    );
  };

  dealData=()=> {
    //获取部门的数据
    let organizationData = [];
    // system/organization/organizationList/get
    let isAll='Q=isAll=false';
    let haveUsers="Q=haveUsers=false";
    getService(API_PREFIX + `services/web/company/org/orgList/get?${isAll}&${haveUsers}`, data => {
      if (data.status === 1) {
        organizationData = data.root.object;
        this.dealDepartmentData(organizationData);
        this.setState({dp: organizationData});
      }
    });
  }


  //处理组织机构中的数据
  dealDepartmentData(data){
    data.map((item,index)=>{
      item.value=item.id+'';
      item.label=item.name;
      item.children=item.subCompanyOrgList;
      if(item.subCompanyOrgList){//不为空，递归
        this.dealDepartmentData(item.subCompanyOrgList);
      }
    });
  }


  getCompanyData=()=>{
    //获取企业的数据
    let {activityId}=this.state;
    let companyData = [];
    getService(
      API_PREFIX +
      `services/web/company/enterprise/getCompanyListFromAuth/${activityId}`,
      data => {
        if (data.status == 1) {
          console.log("companyData===",data.root.object);
            companyData=data.root.object.map((item, index) => {
             item.value = item.id + '';item.label = item.companyName;
             return item;
            });
          console.log("companyData===",companyData);
          this.setState({ companyData });
        } else {
          message.error(data.errorMsg);
          // this.setState({ loading: false });
        }
      }
    );
  }
  applyInfoDetail =(record) => {
    console.log('record', record);

    // let value =  window.sessionStorage.getItem('applyField');
    // let obj = JSON.parse(value);
    // const activityId = obj.id;
    // const idsQF=`Q=activityid_S_EQ=${activityId}&Q=userid_S_EQ=${record.userId}`;
    let {activityId,current}=this.state;

    getService(API_PREFIX+`services/web/activity/question/getUserJoinTitleList/${activityId}/${record.userId}/${record.joinNum}/${current}/10`,data=>{
      if (data.status == 1) {
        console.log('展示数据：', data.root.list);
        let  topicList= data.root.list;
        let total=data.root.totalNum;
        // if(datas.length === 0){
        //   this.setState({
        //     showData: '暂无数据',
        //   });
        // }
        // this.setState({
        //   showData: data.root.list[0].replace(/\n/g, '<br/>'),
        // });
        this.setState({
        topicList,
        total,

        });
      }
    });

    this.setState({
      visible: true,
      record:record,
    });
  }

  render() {
    const { dp, showData, current, topicList,total,activityId } = this.state;
    // const getList2 = topicList && topicList.slice((current - 1) * 4, current * 10);
    // let powers = this.props.powers;
    // let readPowers = powers && powers['20002.22001.003'];
    // let deletePowers = powers && powers['20002.22001.004'];
    // let exportPowers = powers && powers['20002.22001.202'];

    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '用户姓名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '企业名称',
        dataIndex: 'tenantName',
        key: 'tenantName',
      },
      {
        title: '部门',
        dataIndex: 'orgName',
        key: 'orgName',
      },
      {
        title: '报名时间',
        dataIndex: 'joinDate',
        key: 'joinDate',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          return <div>
            <a className="operation" onClick={this.applyInfoDetail.bind(this,record)}
              style={{ display: 'inline-block' }}>详情</a>
          </div>;
        },
      },
    ];

    // let value =  window.sessionStorage.getItem('applyField');
    // let obj = JSON.parse(value);
    ////// const activityId = obj.id;
    // console.log('activityId',activityId);
    // //const cIdsQF=`Q=categoryId_S_ST=${this.state.selectedValues}`;
    // const idsQF=`Q=activityid_S_EQ=${activityId}`;

    const search = [
      { key: 'userName', label: '用户姓名',qFilter:'Q=userName',type:'input'},
      // { key: 'mobile', label: '手机号',qFilter:'Q=mobile',type:'input'},
      // { key: 'orgId', label: '部门', qFilter: 'Q=orgId', type: 'cascader', option: dp },
      {key: 'tenantId', label: '企业', qFilter: 'Q=tenantId', type: 'company',option: this.state.companyData, option2: dp, qFilter2: 'Q=orgId',key2: 'orgId'},
    ];

      //设置formItem的格式
    const formItemLayout = {
      labelCol: {
        xs: { span: 12},
        sm: { span: 2},
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
    };



    return <div className="CarouselDetail1">
      <Form className="Content">
        {/*<FormItem
          {...formItemLayout}
          label="所属栏目"
        >
          <Cascader changeOnSelect options={this.state.categoryOption} placeholder="全部" onChange={this.handleCheckChange} />
        </FormItem>*/}
      </Form>
      {GetQueryString(location.hash, ['activeKey']).activeKey==1?
       <TableAndSearch rowkey="userId" columns={columns} url={`services/web/activity/question/getAllJoinDetail`} urlfilter={`Q=activityId=${activityId}`}
       search={search}
       exportBtn={{order:2 ,url:`services/web/activity/question/reportAllJoinDetail`,type:'问卷信息', label:'导出问卷信息'}}
       goBackBtn={{ order: 1, url: `#/EventManagement/Questionnaire/List?id=${this.state.activeKey}`,label:'返回' }}
       />:
       <TableAndSearch rowkey="userId" columns={columns} url={`services/web/activity/question/getAllJoinDetail`} urlfilter={`Q=activityId=${activityId}`} search={search}
      //  deleteBtn={{ order: 1, url:`services/activity/signUpActivity/deleteActivityUsers/${this.state.activityId}`,field:'ids'}}
       exportBtn={{order:2 ,url:`services//web/activity/question/reportAllJoinDetail`,type:'问卷信息', label:'导出问卷信息'}}
       goBackBtn={{ order: 1, url: `#/EventManagement/Questionnaire/List?id=${this.state.activeKey}`,label:'返回' }}
       />
    }
     

      <Modal
        title="问卷标题"
        width={1000}
        maskClosable={true}//点击蒙层是否关闭
        footer={null}
        visible={this.state.visible}
        onCancel={() => this.setState({visible: false})}
        key={this.state.key}
      >
       {topicList ?
          <div className="Questioninfo">
            <h2 style={{ textAlign: "center" }}>{this.state.activityName}</h2>
            <Form className="titleNum" >
              {topicList && topicList.map((item, index) => this.renderItem(item, index))}
              <Row>
                <Col span={8} offset={8}>
                  <Pagination
                    current={current}
                    pageSize={10}
                    onChange={this.onChangePagination}
                    total={total}
                    className="pagination"
                  />
                </Col>
              </Row>
            </Form>
          </div>
          :null}
        <div style={{ marginTop: 30 }}>
          <Row>
            <Col span={12} offset={12}>
              <Button type='default' className="resetBtn" onClick={() => this.setState({ visible: false })} >返回</Button>
            </Col>
          </Row>
        </div>    
        
      </Modal>
    </div>;
  }
}

