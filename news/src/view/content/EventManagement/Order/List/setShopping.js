import React, { Component } from 'react';
import { Tabs,Modal,Button,Table,Input,Row,Col,Upload} from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString, postService, getService } from '../../../myFetch';
import {connect} from 'react-redux';
const Search = Input.Search;
const TabPane = Tabs.TabPane;
import ServiceApi from'../../../../content/apiprefix';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    selectRowsData:state.table.selectRowsData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class SetShopping extends Component {
  constructor(props) {
    super(props);
    this.state={
      activityId:(GetQueryString(location.hash, ['id']).id),
      visible: false,
      value: true,
      record:{},
      flag:true,
      key:90324832400,
      keyTable:345678,
      totalNum:null,
      currentPage:1,
      data:[],
      selectedRows: [],
      value:''
    };
  }
  componentDidMount() {
    
  }
  onPageChange = (currentPage) => {
    this.setState({ 
      currentPage 
    },() => {
      getService(ServiceApi + `services/activity/orderActivity/goods/list/${this.state.currentPage}/10?Q=status_I_EQ=1&Q=name_S_LK=`+this.state.value, data => {
      data.root.list.map((item,index) => {
        item.key = index
      })
       this.setState({
         totalNum:data.root.totalNum,
         data:data.root.list
       })    
    });
    });
  }
  showModal = () => {
    getService(ServiceApi + `services/activity/orderActivity/goods/list/1/10?Q=status_I_EQ=1`, data => {
      data.root.list.map((item,index) => {
        item.key = index
      })
       this.setState({
         totalNum:data.root.totalNum,
         data:data.root.list,
         currentPage:1
       })    
    });
    this.setState({
      visible: true,
      flag:false,
      selectedRowKeys:[],
      key:this.state.key + 1,
      value:''
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      key:this.state.key + 1,
      keyTable:this.state.keyTable + 1
    });
  }
  addShopping = () => {
    const values = []
    this.state.selectedRows.map((item) => {
       values.push(item.id)
    })
    postService(ServiceApi+'services/activity/orderActivity/goods/add/'+this.state.activityId,{"ids":values},data=>{
      if(data.retCode == 1 ){
      	this.handleCancel()
      }
    });
  }
  onSearch = (value) => {
    getService(ServiceApi + `services/activity/orderActivity/goods/list/1/10?Q=status_I_EQ=1&Q=name_S_LK=`+value, data => {
      data.root.list.map((item,index) => {
        item.key = index
      })
       this.setState({
         totalNum:data.root.totalNum,
         data:data.root.list,
         currentPage:1,
         value:value
       })    
    });
  }
  onSelectChange = (selectedRowKeys,selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRows);
    this.setState({ selectedRows, selectedRowKeys});
  }
  render() {
    const { tabKey} = this.state;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const search = [
		  {
		    key: 'name',
		    label: '商品名称',
		    qFilter: 'Q=name_S_LK',
		    type: 'input',
		  }
		];
    const columns = [
      {
        title: '序号',
        key: 'id',
        dataIndex: 'id',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '库存',
        dataIndex: 'stock',
        key: 'stock',
      },
      {
        title: '显示顺序',
        dataIndex: 'showIndex',
        key: 'showIndex',
        render: (text, record, index) => {
          return index + 1;
        },
      },
   /*   {
        title: '操作',
        key: 'x',
        render: (text, record, index) => {
          return <div>
            <a onClick={() => (location.hash = `/EventManagement/Examination/Edit?id=${record.id}`)}>编辑</a>
          </div>;

        },
      },*/
    ];
    let pagination = {
      //showQuickJumper: true,
      //showSizeChanger: true,
      total: this.state.totalNum,
      current: this.state.currentPage,
      onChange: this.onPageChange,
    };
    const columns1=[
    	{
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
      }
    ];
    return(
    	<div>
    		  <TableAndSearch key={this.state.keyTable} search={search}  customBtn={{order:1,onClick:this.showModal,label: '添加商品',className:'queryBtn'}} goBackBtn={{order:3,label:"返回",url:"EventManagement/Order/List"}}  deleteBtn={{order:2}}
           delUrl={'services/activity/orderActivity/goods/delete/'+ this.state.activityId} columns={columns} url={'services/activity/orderActivity/goods/list/'+ this.state.activityId}  />
          
          <Modal
            title="添加商品"
            maskClosable={false}//点击蒙层是否关闭
            footer={null}
            visible={this.state.visible}
            destroyOnClose={true}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            key={this.state.key}
            //className="setShopping"
            width={800}
          >
          <Search
            style={{width:"720px",marginLeft:"15px",marginBottom:"20px"}}
            placeholder="请输入商品名称"
            onSearch={this.onSearch}
            enterButton
          />
          <Table rowSelection={rowSelection} bordered columns={columns1} dataSource={this.state.data} pagination={pagination} />
          <Button style={{marginLeft:"300px"}} type="primary" className='resetBtn' onClick={this.handleCancel}>
            返回
          </Button>
          <Button type="primary" onClick={this.addShopping} className='queryBtn'>
            保存
          </Button>
          </Modal>
    	</div>
    )
  }
}


