import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {Button,Modal,Form,Input,Radio,Select,Message} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import {  BEGIN,getDataSource,getPageData } from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
import {ImportPart} from '../PartyMembers/PartyMembers';
import {postService,getService,GetQueryString,exportExcelService} from '../../myFetch';
import ServiceApi,{masterUrl} from '../../apiprefix';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
class VirtualGroupUser extends Component {
	constructor(props){
    super(props);
    this.state = {
      groupId:''
    }
  }
  componentWillMount(){
    let param = GetQueryString(location.hash,['groupId']);
    console.log("param",param)
    this.setState({
      groupId:param.groupId
    })
  }
  getData = async(url) => {
    await this.props.getData(ServiceApi + `${url}`);
  }
  SetGroupLord = (record) => {

  }
  //控制用户导入的modal的显示或者隐藏
  showImportModal=()=>{
    this.setState({
      showImportModal:true,
      keyImportModal:this.state.keyImportModal
    })
  }
  //用户导入 确定的点击事件
  handleImportModalOk=()=>{
    this.setState({
      showImportModal:false,
    });
    //this.props.getData(ServiceApi+`services/system/systemAndCompanyUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
  }
//用户导入 取消的点击事件
  handleImportModalCancel=()=>{
    this.setState({
      showImportModal:false,
    })
  }
  render() {
  	const columns=[
      {
        title:'用户名',
        dataIndex:'acount',
        key:'acount'
      },
      {
        title:'用户姓名',
        dataIndex:'lastName',
        key:'lastName'
      },
      {
        title:'邮箱',
        dataIndex:'email',
        key:'email'
      },
      {
        title:'部门',
        dataIndex:'orgName',
        key:'orgName'
      },
      {
        title:'入群时间',
        dataIndex:'createDate',
        key:'createDate'
      },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        render:(data,record)=>(
            <div>
              {/*<a className='operation' onClick={this.SetGroupLord.bind(this,record)}>*/}
                {record.isOwner == true ? <a  style={{color:'grey'}}>设为群主</a> : <a className='operation' onClick={this.SetGroupLord.bind(this,record)}>设为群主</a>}
             {/* </a>*/}
            </div>
        ),
      }

    ];
    const search=[
      {key:'acount',label:'手机号',qFilter:'Q=acount_S_LK',type:'input'},
      {key:'lastname',label:'姓名',qFilter:'Q=lastname_S_LK',type:'input'},
      {key:'email',label:'邮箱',qFilter:'Q=email_S_LK',type:'input'},
    ];
    return (
    	<div className="virtualGroup">
	    	<TableAndSearch columns={columns} search={search}
	           optionalBtn={{order:1,label:'添加',url:'SystemSettings/VirtualGroupAddUser?groupId='+`${this.state.groupId}`,}}  
              goBackBtn={{order:1,label:'返回',url:'SystemSettings/VirtualGroup',}}  
             deleteBtn={{order:2}} url={'services/system/virtualGroup/getMemberList/'+`${this.state.groupId}`}
	           delUrl={'services/system/virtualGroup/deleteMembers'}
             //importBtn={{order:4,url:'services/system/import/groupMember'+'?groupId='+`${this.state.groupId}`}} 
             exportBtn={{order:5,type:"virtualGroup",url:"services/system/virtualGroup/export/"}}
             groupId={this.state.groupId}
            customBtn={{ order: 2, label: '导入', onClick: this.showImportModal, className: 'resetBtn' }}
	          >
	      </TableAndSearch>
         <Modal
              title="群成员导入"
              cancelText="返回"
              okText="确定"
              visible={this.state.showImportModal}
              onOk={this.handleImportModalOk}
              onCancel={this.handleImportModalCancel}
              destroyOnClose={true}
              className="modal"
          >
            <ImportPart
                importUrl={'services/system/import/groupMember'+'?groupId='+`${this.state.groupId}`}
                listurl={'services/system/virtualGroup/getMemberList/'+`${this.state.groupId}`}
                pageData={this.props.pageData}
                getData={this.getData}
            downlodUrl={ServiceApi + 'services/system/virtualGroup/template'}/>
          </Modal>
      </div>
    );
  }
}

export default VirtualGroupUser;
