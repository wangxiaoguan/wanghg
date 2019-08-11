import React,{Component} from 'react';
import {Divider,Popconfirm,Message,Spin} from 'antd';
import PartyEdit from './PartyEdit';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { getService,postService } from '../../myFetch.js';
import ServiceApi from '../../apiprefix';
import {BEGIN} from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class PartyApply extends Component{

    constructor(props){
        super(props);
        this.state={
            partyOrganizationDatas: [],    //党组织机构数据
            loading: false,
        }
    }

    componentWillMount() {
      this.setState({ loading: true });
        //获取党组织数据
        getService(ServiceApi + 'services/system/partyOrganization/partyOrganizationList/get', data => {
          console.log('党组织数据：', data);
          let pOrgs = data.root.list;
          if (pOrgs) {
            //调用接口数据处理函数
            this.getPartyOrganationData(pOrgs);
            this.setState({
              partyOrganizationDatas: pOrgs,
              loading: false,
            });
    
          }else{
            message.error(data.retMsg);
            this.setState({ loading: false });
          }
        }
        );
    
      }
      //递归取出接口返回的党组织的数据
      getPartyOrganationData(poData) {
        poData.map((item, index) => {
          item.value = item.id;
          item.label = item.name;
          item.children = item.partyOrganizationList;
          if (item.partyOrganizationList) {//不为空，递归
            this.getPartyOrganationData(item.partyOrganizationList);
          }
        });
      }
    componentDidMount(){}

    //转出党员编辑
    editParty=(data)=>{
      console.log(data)
    }

    applyParty=()=>{

    }

    render(){
        const columns=[
            {
              title: '编号',
              key: 'id',
              dataIndex: 'id',
              width: 100,
              fixed: 'left'
            },
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '员工号',
              dataIndex: 'userNo',
              key: 'userNo',
            },
            {
              title: '用户ID',
              dataIndex: 'userId',
              key: 'userId',
            },
            {
              title: '所属党组织',
              dataIndex: 'partyFullName',
              key: 'partyFullName',
            },
            {
              title: '职务',
              dataIndex: 'postName',
              key: 'postName',          
            },
            {
              title: '转出地点',
              dataIndex: 'turnOutPlace',
              key: 'turnOutPlace',
            },
            {
              title: '转出时间',
              dataIndex: 'turnOutDate',
              key: 'turnOutDate',
            },
            {
              title: '操作',
              dataIndex: 'operation',
              key: 'operation',
              width:100,
              fixed: 'right',
              
              render:(data,record)=>(
                  <div>
                    <Divider type="vertical" />
                    <a className='operation' onClick={() => location.hash = `/SystemSettings/PartyEdit?isEdit=true&userid=${record.id}`} >编辑</a>
                    {/* <Divider type="vertical"/>
                    <a className='operation' onClick={()=>this.applyParty(record) } >详情</a>
                    <Divider type="vertical"/> */}
                  </div>
                )
            },
          ];
          const search = [
            { key: 'name', label: '姓名',qFilter:'Q=name_LK',type:'input'},
            { key: 'partyid',label: '党组织名称',qFilter: 'Q=partyId_S_ST',  type: 'cascader',option: this.state.partyOrganizationDatas,
              },
          ];
        return(
          <Spin spinning={this.state.loading}>
            <div>
                    <TableAndSearch
                        rowkey={'id'}
                        columns={columns}
                        search={search}
                        url={'services/system/partyMenOut/get/list'}
                    ></TableAndSearch>
            </div>
          </Spin>  
        )
    }



}