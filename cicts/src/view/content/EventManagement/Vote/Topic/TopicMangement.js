import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString } from '../../../myFetch';
import { connect } from 'react-redux';
import { Popconfirm,Button,Row,Col,Divider} from 'antd';
import  API_PREFIX from '../../../apiprefix';


@connect(state => ({
    powers: state.powers,
  }))
export default class TopicMangement extends Component {
    constructor(props) {
        super(props);
        this.state = {
          tenantId : window.sessionStorage.getItem("tenantId") || "",
        };
      }

      //停用
      stopUse=(record)=>{
        alert(`${record.id}`+'该题目已被停用');
      }

      render() {
        // const statusChange=[
        //     {   key:'',
        //         value:'全部',
        //     },
        //     {   key:'1',
        //         value:'启用',
        //     },
        //     {   key:'0',
        //         value:'停用',
        //     },
        // ];
        const titleType =[
          { key: '', value: '全部' },
          {
            key: '1', value: '单选',
          }, {
            key: '2', value: '多选',
          }];
        let powers = this.props.powers;
        let createPowers=powers && powers['20002.22008.001'];//新建
        let updatePowers = powers && powers['20002.22008.002'];//修改
        let deletePowers=powers && powers['20002.22008.004'];//删除
        let  {tenantId}=this.state;
        const search=[
            {key:'titleName',label:'题目名称',qFilter:'Q=titleName',type:'input'},
            // {key:'changeType',label:'状态',qFilter:'Q=status',type:'select',option:statusChange},
            {key:'titleType',label:'题目类型',qFilter:'Q=titleType',type:'select',option:titleType},
            ];

            const columns=[
                {
                  title:'序号',
                  dataIndex:'sNum',
                  key:'sNum',  
                },
                {
                    title:'题目名称',
                    dataIndex:'titleName',
                    key:'titleName',  
                  },
                  {
                    title:'题目类型',
                    dataIndex:'titleType',
                    key:'titleType', 
                    render:(text,record)=>{
                        if(record.titleType===1){
                            return '单选';
                        }else if(record.titleType===2){
                            return '多选';
                        }else if(record.titleType===3){
                            return '字符串';
                        }else if(record.titleType===4){
                            return '数字';
                        }
                    }, 
                  },
                  {
                    title:'显示顺序',
                    dataIndex:'showIndex',
                    key:'showIndex',  
                  },
                  {
                    title:'操作',
                    dataIndex:'x',
                    key:'x',
                    render: (text,record)=>{
                        return(
                            <div>
                                <a className="operation" href={`#/EventManagement/Vote/TopicMangementEdit?isEdit=true&id=${record.id}`} style={{ display: updatePowers ? 'inline-block' : 'none' }} >编辑</a>
                            </div>
                        );
                    },
                  },
            ] ;

          return(
              <div>
                <TableAndSearch
                    search={search}
                    columns={columns}
                    url='services/web/activity/votingtitle/getVoteTopic'
                    addBtn={createPowers?{order:1,url:'#/EventManagement/Vote/TopicMangementAdd?isEdit=false'}:null}
                    deleteBtn={deletePowers?{order:2}:null}
                    delUrl={'services/web/activity/votingtitle/batchDeleteTitleInfo'}
                    urlfilter={`Q=tenantId=${tenantId}`}  
                />
              </div>
          );
      }
}