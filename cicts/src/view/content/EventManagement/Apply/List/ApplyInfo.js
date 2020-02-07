import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString, postService, getService } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
import { Form, Cascader, Button, Modal,Row,Col, Checkbox, Input,Descriptions, Radio, Pagination, message  } from 'antd';
const FormItem = Form.Item;
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
      visible: false,
      activityId: GetQueryString(location.hash, ['id']).id || '',
      record:{},
      showData: [],
      dp:[],//视屏归属部门
      activeKey:String(activeKey),
      topicList: '',
      time: '',
      current: 1,
      optionNum: ['A', 'B', 'C', 'D', 'E', 'F','G','H','I','J'],
      allCheckArr: [],
      isCan: '', // 用户能否参加
      total:"",
      activityName:JSON.parse(window.sessionStorage.getItem("applyField")).activityName || "报名信息",
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


  ////单选，多选，问答
 renderItem = (item, index) => {
  const { form } = this.props;
  const { getFieldDecorator, getFieldValue } = form;
  const { current, optionNum } = this.state;

  let arr=[];
  if(item.titleType==2){
    item.userAnswer.split(",").forEach((list1,index_)=>{
      item.optionInfos.forEach((items, list) =>{
        if(list1==items.id){
          arr.push(items.content);
          }    
  });});}
   return ( <Descriptions>
    <Descriptions.Item label={`${index+1}、${item.titleName}`}>
        {item.titleType==1?item.optionInfos.map((items, list) =>{
          if(item.userAnswer==items.id){
            return items.content;
          }
        }):(item.titleType==2)?arr.join(","):item.userAnswer}
   </Descriptions.Item>
 </Descriptions>);
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
    let value =  window.sessionStorage.getItem('applyField');
    let obj = JSON.parse(value);
    let  activityId = obj.id;
    console.log('activityId',activityId);
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
  
  applyInfoDetail =(record) => {
    console.log('record', record);

    let value =  window.sessionStorage.getItem('applyField');
    let obj = JSON.parse(value);
    const activityId = obj.id;
    // const idsQF=`Q=activityid_S_EQ=${activityId}&Q=userid_S_EQ=${record.userId}`;
    let {current}=this.state;

    getService(API_PREFIX+`services/web/activity/enrolment/getUserJoinTitleList/${activityId}/${record.userId}/${record.joinNum}/${current}/1000`,data=>{
      if (data.status == 1) {
        console.log('展示数据：', data.root.list);
        let  topicList= data.root.list;
        let total=data.root.totalNum;
        this.setState({
        topicList,
        total,
        visible: true,
        record:record,
        });
      }
    });
  }

////分页的点击事件
onChangePagination = value => {
  // debugger;
  const {record}=this.state;
  this.setState({ current: value },()=>{
    this.applyInfoDetail(record);
  });
};





  render() {
    const { dp, topicList,total ,current} = this.state;
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

    let value =  window.sessionStorage.getItem('applyField');
    let obj = JSON.parse(value);
    let  activityId = obj.id;
    console.log('activityId',activityId);
    //const cIdsQF=`Q=categoryId_S_ST=${this.state.selectedValues}`;
    // const idsQF=`Q=activityid_S_EQ=${activityId}`;

    const search = [
      { key: 'userName', label: '用户姓名',qFilter:'Q=userName',type:'input'},
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
      {GetQueryString(location.hash, ['activeKey']).activeKey==1?
       <TableAndSearch rowkey="userId" columns={columns} url={`services/web/activity/enrolment/getAllJoinDetail`}  urlfilter={`Q=activityId=${activityId}`} search={search}
       exportBtn={{order:2 ,url:`services/web/activity/enrolment/reportAllJoinDetail`,type:'报名信息', label:'导出报名信息'}}
       goBackBtn={{ order: 1, url: `#/EventManagement/Apply/List?id=${this.state.activeKey}`,label:'返回' }}
       />:
       <TableAndSearch rowkey="userId" columns={columns} url={`services/web/activity/enrolment/getAllJoinDetail`}  urlfilter={`Q=activityId=${activityId}`} search={search}
      //  deleteBtn={{ order: 1, url:`services/activity/signUpActivity/deleteActivityUsers/${activityId}`,field:'ids'}}
       exportBtn={{order:2 ,url:`services/web/activity/enrolment/reportAllJoinDetail`,type:'报名信息', label:'导出报名信息'}}
       goBackBtn={{ order: 1, url: `#/EventManagement/Apply/List?id=${this.state.activeKey}`,label:'返回' }}
       />
    }
      <Modal
        title="报名信息详情"
        maskClosable={false}//点击蒙层是否关闭
        footer={null}
        visible={this.state.visible}
        onCancel={() => this.setState({visible: false})}
        key={this.state.key}
        width={600}
      >
        {topicList ?
          <div>
            <h2 style={{ textAlign: "center" }} >{this.state.activityName}</h2>
            <Form className="titleNum" >
              {topicList && topicList.map((item, index) => this.renderItem(item, index))}
              {/* <Row>
                <Col span={8} offset={8}>
                  <Pagination
                    current={current}
                    pageSize={10}
                    onChange={this.onChangePagination}
                    total={total}
                    className="pagination"
                  />
                </Col>
              </Row> */}
            </Form>
          </div>
          : null}
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

