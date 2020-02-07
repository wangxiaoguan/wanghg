import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { postService, getService,GetQueryString } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
// import  '../../Questionnaire/info.less';
import { Form,Button, Modal,Row,Col, Checkbox, Input,  Radio, Pagination ,message} from 'antd';
const RadioGroup = Radio.Group;
@connect(
  state => ({
    powers: state.powers,
  }),
)
@Form.create()
export default class Score extends Component {
  constructor(props) {
    super(props);
    let param = this.props.location.search.replace('?','').split('&');
    let activeKey = param[1] && Number(decodeURIComponent(param[1].split('=')[1])) || '0';
    this.state = {
      activityId: GetQueryString(location.hash, ['id']).id || '',
      visible: false,
      record:{},
      showData: [],
      dp:[],//视屏归属部门
      activeKey:String(activeKey),
      current: 1,
      topicList: '',
      optionNum: ['A', 'B', 'C', 'D', 'E', 'F','G','H','I','J'],
      allCheckArr: [],
      isCan: '', // 用户能否参加
      time: '',
      total:"",
      companyData:[],
      activityName:JSON.parse(window.sessionStorage.getItem("activityName")) || "考试标题",
    };
  }
  //处理组织机构中的数据
  dealDepartmentData(data) {
    data.map((item, index) => {
      item.value = item.id + '';
      item.label = item.name;
      item.children = item.subCompanyOrgList;
      if (item.subCompanyOrgList) {//不为空，递归
        this.dealDepartmentData(item.subCompanyOrgList);
      }
    });
  }
  componentDidMount() {

    //获取部门的数据
    let isAll='Q=isAll=false';
    let haveUsers="Q=haveUsers=false";
    let organizationData = [];
    getService(API_PREFIX + `services/web/company/org/orgList/get?${isAll}&${haveUsers}`, data => {
      if (data.status === 1) {
        organizationData = data.root.object;
        this.dealDepartmentData(organizationData);
        this.setState({ dp: organizationData });
      }
    });

    this.getCompanyData();
  }



  //选中选项的函数
  // CheckboxOnChange = (value, id) => {
  //   const { allCheckArr } = this.state;
  //   const obj = { topicId: id, optionId: value };
  //   let flag = false;
  //   for (let i = 0; i < allCheckArr.length; i += 1) {
  //     if (allCheckArr[i].topicId === id) {
  //       allCheckArr[i].optionId = value;
  //       flag = true;
  //     }
  //   }
  //   if (!flag) {
  //     allCheckArr.push(obj);
  //   }
  //   this.setState({ allCheckArr });
  //   console.log('获取所选像', allCheckArr);
  // };

  getCompanyData=()=>{
    let {activityId}=this.state;
    //获取企业的数据
    let companyData = [];
    getService(
      API_PREFIX +
      `services/web/company/enterprise/getCompanyListFromAuth/${activityId}`,
      data => {
        if (data.status == 1) {
          console.log("companyData===",data.root.object);
            companyData=data.root.object.map((item, index) => {
             item.value = item.id + '';item.label = item.name;
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


  applyInfoDetail =(record) => {
    console.log('record', record);
    let {activityId,current}=this.state;
    getService(API_PREFIX+`services/web/activity/voting/getUserJoinTitleList/${activityId}/${record.userId}/${record.joinNum}/${current}/10`,data=>{
      if (data.status == 1) {
        console.log('展示数据：', data.root.list);
        let  topicList= data.root.list;
        let total=data.root.totalNum;
        this.setState({
        topicList,
        total,
        SeeTopichandModal: true,
        record:record,
        });
      }
    });
  }

  render() {
    const { dp, showData, current, topicList,total,activityId } = this.state;
    // const getList2 = topicList && topicList.slice((current - 1) * 10, current * 10);


    const search = [
      {key: 'name',label: '用户姓名', qFilter: 'Q=userName',type: 'input'},
      // { key: 'mobile', label: '手机号',qFilter: 'Q=mobile',type: 'input',},
      // {key: 'orgId', label: '部门', qFilter: 'Q=orgId', type: 'cascader',option: this.state.dp},
      {key: 'tenantId', label: '企业', qFilter: 'Q=tenantId', type: 'company',option: this.state.companyData, option2: dp, qFilter2: 'Q=orgId',key2: 'orgId'},
    ];
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
        title: '分数',
        dataIndex: 'score',
        key: 'score',
      },
      {
        title: '考试时间',
        dataIndex: 'joinDate',   //todo
        key: 'joinDate',
      },
      {
        title: '操作',
        key: 'x',
        render: (text, record, index) => {
          return <div>
            <a onClick={this.applyInfoDetail.bind(this,record)}>详情</a>
          </div>;

        },
      },

    ];
    return(
      <div>
        <TableAndSearch columns={columns} url={`services/web/activity/exam/getAllJoinDetail`} urlfilter={`Q=activityId=${activityId}`}
          search={search}
          // deleteBtn={GetQueryString(location.hash, ['activeKey']).activeKey==1?null:{ order: 1, url:'services/activity/examActivity/deleteExamResult' }}
          exportBtn={{ order: 2, url: `services/web/activity/exam/exportExamScore`, type: '考试成绩', label: '导出考试成绩' }}
          goBackBtn={{ order: 1, url: `#/EventManagement/Examination/List?id=${this.state.activeKey}`,label:'返回' }}
          />
            <Modal
          width={1000}
          title="查看考试题目"
          visible={this.state.SeeTopichandModal}
          footer={null}
          destroyOnClose={true}
          onCancel={()=>this.setState({SeeTopichandModal:false})}
        >
     {topicList ?
          <div>
            <h2 style={{ textAlign: "center" }}>{this.state.activityName}</h2>
            <Form className="titleNum lookDeta" >
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
              <Button type='default' className="resetBtn" onClick={() => this.setState({ SeeTopichandModal: false })} >返回</Button>
            </Col>
          </Row>
        </div>    
        </Modal>
      </div>
        );
  }
}
