import React, { Component } from 'react';
import {From,message} from 'antd';
import API_PREFIX from '../../apiprefix';
import{getService} from '../../myFetch'
import TableAndSearch from '../../../component/table/TableAndSearch';
import {connect} from 'react-redux';

//配置导出按钮权限xwx2018/12/26
@connect(
  state => ({
    powers: state.powers
  })
)

class FestivalMaterialsChange extends Component{
    constructor(props){
        super(props);
        this.state={
            loading: true,
            departments:[],//所属部门数据
            isOrNotOptions:[],//变更类型
        }
 
    }
    componentDidMount(){
        this.setState({loading:false})
         //级联请求获取所属部门数据
         let organizationData = [];
         getService(
           API_PREFIX + 'services/system/organization/organizationListNotUserList/get/0',
           data => {
             if (data.retCode === 1) {
               organizationData = data.root.list;
               this.dealDepartmentData(organizationData);
               this.setState({ departments: organizationData,loading: false });
             }else{
               message.error(data.retMsg);
               this.setState({ loading: false });
             }
           }
         );
         //变更数据类型    
         let FestivalMaterials=[];
         getService(
          API_PREFIX +'services/awardpoint/materialChangeRecord/changeType',data=>{
            if(data.retCode===1){
              FestivalMaterials=data.root.object;
              this.getFestivalMaterialsTypeData(FestivalMaterials);
              this.setState({isOrNotOptions:FestivalMaterials,loading: false})
            }else{
              message.error(data.retMsg);
              this.setState({ loading: false });
            }
          }
         )
      }

    //处理组织机构中的数据
    dealDepartmentData(data) {
      data.map((item, index) => {
        item.value = item.id + '';
        item.label = item.name;
        item.children = item.subOrganizationList;
        if (item.subOrganizationList) {
          //不为空，递归
          this.dealDepartmentData(item.subOrganizationList);
        }
      });
    }  
    //处理变更类型的数据
  getFestivalMaterialsTypeData(data){
    let changeTypeAll={code:'',desp:'全部'}//前端新增一个全部字段
    data.unshift(changeTypeAll)
    data.map((item,index)=>{
      item.value=item.desp+'';
      item.key=item.code
    })
  }     
    render(){
          const search=[
            {key:'userName',label:'用户姓名',qFilter:'Q=username_S_LK',type:'input'},
            {key:'changeType',label:'变更类型',qFilter:'Q=type_S_EQ',type:'select',option:this.state.isOrNotOptions},
            {key:'departments',label:'所属部门',qFilter:'Q=orgid_S_LK',type:'cascader',option:this.state.departments},
            {key:'createdate',label:'起止日期',type:'platformPointrangePicker'}
            ]
            const columns=[
                {
                  title:'序号',
                  dataIndex:'sNum',
                  key:'sNum',  
                },
                {
                    title:'变更数值',
                    dataIndex:'point',
                    key:'point',  
                  },
                  {
                    title:'变更类型',
                    dataIndex:'typeDesp',
                    key:'typeDesp',  
                  },
                  {
                    title:'姓名',
                    dataIndex:'userName',
                    key:'userName',  
                  },
                  {
                    title:'所属部门',
                    dataIndex:'orgName',
                    key:'orgName',  
                  },
                  {
                    title:'创建时间',
                    dataIndex:'createDate',
                    key:'createDate',  
                  },
            ]
            let powers = this.props.powers;
            let exportExcelPower = powers && powers['20011.21609.202']
            return(
            <div>
            <TableAndSearch
            search={search}
            columns={columns}
            exportBtn={exportExcelPower?{order:2,url:'services/awardpoint/materialChangeRecord/export',type:'过节物资积分变更'}:null}
            type='platformPointDetail'
            url='services/awardpoint/materialChangeRecord/list'
            />
            </div>
        )
    }
}

export default FestivalMaterialsChange;