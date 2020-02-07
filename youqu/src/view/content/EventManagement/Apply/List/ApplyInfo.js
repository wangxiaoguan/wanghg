import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString, postService, getService } from '../../../myFetch';
import ServiceApi from '../../../apiprefix';
import { connect } from 'react-redux';
import { Form, Cascader, Button, Modal } from 'antd';
const FormItem = Form.Item;

@connect(
  state => ({
    powers: state.powers,
  }),
)
export default class ApplyInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      record:{},
      showData: [],
      dp:[],//视屏归属部门
    };
  }

  componentWillUnmount(){
    window.sessionStorage.removeItem('applyField');
  }

  componentDidMount(){

  }



  //处理组织机构中的数据
  dealDepartmentData(data){
    data.map((item,index)=>{
      item.value=item.id+'';
      item.label=item.name;
      item.children=item.subOrganizationList;
      if(item.subOrganizationList){//不为空，递归
        this.dealDepartmentData(item.subOrganizationList);
      }
    });
  }

  applyInfoDetail =(record) => {
    console.log('record', record);

    let value =  window.sessionStorage.getItem('applyField');
    let obj = JSON.parse(value);
    const activityId = obj.id;
    const idsQF=`Q=activityid_S_EQ=${activityId}&Q=userid_S_EQ=${record.userId}`;

    getService(ServiceApi+`services/activity/signUpActivity/signUpFormList?${idsQF}`,data=>{
      if (data.retCode == 1) {
        console.log('展示数据：', data.root.list);
        let datas = data.root.list;
        if(datas.length === 0){
          this.setState({
            showData: '暂无数据'
          })
        }
        this.setState({
          showData: data.root.list[0].replace(/\n/g, '<br/>'),
        });
      }
    });

    this.setState({
      visible: true,
      record:record,
    });
  }

  render() {
    const { dp, showData } = this.state;
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
        dataIndex: 'lastname',
        key: 'lastname',
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
        title: '部门',
        dataIndex: 'orginfoName',
        key: 'orginfoName',
      },
      {
        title: '报名时间',
        dataIndex: 'createDate',
        key: 'createDate',
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
    const activityId = obj.id;
    console.log('activityId',activityId);
    //const cIdsQF=`Q=categoryId_S_ST=${this.state.selectedValues}`;
    const idsQF=`Q=activityid_S_EQ=${activityId}`;

    const search = [
      { key: 'lastname', label: '用户姓名',qFilter:'Q=lastname_S_LK',type:'input'},
      { key: 'mobile', label: '手机号',qFilter:'Q=mobile_S_LK',type:'input'},
      { key: 'treepath', label: '部门', qFilter: 'Q=treepath_S_ST', type: 'cascader', option: dp },
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
      <TableAndSearch rowkey="userId" columns={columns} url={`services/activity/signUpActivity/userList/${activityId}`} search={search}
        deleteBtn={{ order: 1, url:`services/activity/signUpActivity/deleteActivityUsers/${activityId}`,field:'ids'}}
        exportBtn={{order:2 ,url:`services/activity/signUpActivity/userInfo/export/${activityId}`,type:'报名信息', label:'导出报名信息'}}/>

      <Modal
        title="报名信息详情"
        maskClosable={false}//点击蒙层是否关闭
        footer={null}
        visible={this.state.visible}
        onCancel={() => this.setState({visible: false})}
        key={this.state.key}
      >
        <div dangerouslySetInnerHTML={{__html:showData}} />
      </Modal>
    </div>;
  }
}

