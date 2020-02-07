import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {Button,Modal,Form,Input,Radio,Select,message} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import {  BEGIN,getDataSource,getPageData } from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
import {ImportPart} from '../../PartyBuildGarden/PartyMembers/PartyMembers';
import {postService,getService,GetQueryString,exportExcelService} from '../../myFetch';
import API_PREFIX,{masterUrl} from '../../apiprefix';
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
      groupId:'',
    };
  }
  componentWillMount(){
    let param = GetQueryString(location.hash,['groupId']);
    console.log("param",param);
    this.setState({
      groupId:param.groupId,
    });
  }
  getData = async(url) => {
    await this.props.getData(API_PREFIX + `${url}`);
  }
  SetGroupLord = (record) => {
    postService(API_PREFIX + `services/web/company/group/updateGroupOwner`,{"groupId":this.state.groupId,"userId":record.userId,"memberName":record.lastName}, data => {
            if (data.root.object == 1) {
              message.success("设置成功!");
              this.getData(`services/web/company/group/getGroupUser/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=groupId=${this.state.groupId}`);
            } else if(data.retCode == 0){     
              message.error(data.retMsg);
            }
    });
  }
  //控制用户导入的modal的显示或者隐藏
  showImportModal=()=>{
    this.setState({
      showImportModal:true,
      keyImportModal:this.state.keyImportModal,
    });
  }
  //用户导入 确定的点击事件
  handleImportModalOk=()=>{
    this.setState({
      showImportModal:false,
    });
    //this.props.getData(API_PREFIX+`services/system/systemAndCompanyUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
  }
//用户导入 取消的点击事件
  handleImportModalCancel=()=>{
    this.setState({
      showImportModal:false,
    });
  }
  render() {
  	const columns=[
      {
        title:'手机号',                     //20181213  彭元军 更正title
        dataIndex:'mobile',
        key:'mobile',
      },
      {
        title:'用户姓名',
        dataIndex:'name',
        key:'name',
      },
      {
        title:'邮箱',
        dataIndex:'email',
        key:'email',
      },
      {
        title:'部门',
        dataIndex:'fullName',
        key:'fullName',
      },
      {
        title:'入群时间',
        dataIndex:'createDate',
        key:'createDate',
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
      },

    ];
    const search=[
      {key:'mobile',label:'手机号',qFilter:'Q=mobile',type:'input'},
      {key:'name',label:'姓名',qFilter:'Q=name',type:'input'},
      {key:'email',label:'邮箱',qFilter:'Q=email',type:'input'},
    ];
    return (
    	<div className="virtualGroup">
	    	<TableAndSearch columns={columns} search={search}
	           optionalBtn={{order:1,label:'添加',url:'EnterpriseConfig/VirtualGroupAddUser?groupId='+`${this.state.groupId}`}}  
              goBackBtn={{order:1,label:'返回',url:'EnterpriseConfig/VirtualGroup'}}  
             deleteBtn={{order:2}} url={'services/web/company/group/getGroupUser'}
             urlfilter={`Q=groupId=${this.state.groupId}`}
	         delUrl={`services/web/company/group/batchDeleteGroupUser/${this.state.groupId}`}
             //importBtn={{order:4,url:'services/system/import/groupMember'+'?groupId='+`${this.state.groupId}`}} 
             exportBtn={{order:5,type:"virtualGroup",url:"services/web/company/group/exportUsers?"}}
             groupId={this.state.groupId}
            customBtn={{ order: 2, label: '导入', onClick: this.showImportModal, className: 'resetBtn' }}
            type='virtualGroupDel'
	           />
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
                fileName='圈成员信息'
                importUrl={`services/web/company/group/import/${this.state.groupId}`}
                listurl={'services/web/company/group/getGroupUser'}
                pageData={this.props.pageData}
                getData={this.getData}
                downlodUrl={API_PREFIX+'services/web/company/group/exportGroupUsersTemplate'}/>
          </Modal>
      </div>
    );
  }
}

export default VirtualGroupUser;
