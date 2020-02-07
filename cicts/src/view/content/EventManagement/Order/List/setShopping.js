import React, { Component } from 'react';
import { Tabs,Modal,Button,Table,Input,Row,Col,Upload,Form,InputNumber } from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString, postService, getService } from '../../../myFetch';
import {connect} from 'react-redux';
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import API_PREFIX,{API_FILE_VIEW,API_FILE_MALLVIEW} from'../../../../content/apiprefix';
import { BEGIN ,getPageData} from '../../../../../redux-root/action/table/table';
import { message } from 'antd';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    selectRowsData:state.table.selectRowsData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    getPageData: n => dispatch(getPageData(n)),
  })
)

@Form.create()
export default class SetShopping extends Component {
  constructor(props) {
    super(props);
    // let activeKey = GetQueryString(location.hash, ['activeKey']).activeKey||0;
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
      value:'',
      type:1,
      activeKey:GetQueryString(location.hash, ['activeKey']).activeKey||0,
      modal_visible:false,
      productId:null,   //商品id
      setgoodsStock:0,
      id:0,   //商品的主键id
      orderList:null,
      InitgoodsStock:0,
      // ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW,
      ossViewPath: API_FILE_MALLVIEW,
    };
  }
  componentWillMount(){
    localStorage.setItem("selectedRowKeys", '');   
  }

  componentDidMount(){
    this.getOrderList();
  }
   getOrderList(){
  // 获取订购列表
  getService(API_PREFIX + `services/web/activity/ordering/getActivityProductList/1/1000?Q=activityId=${this.state.activityId}`, data => {
    if(data.status==1){
       this.setState({orderList:data.root.object})
    }   
});
   }
  onPageChange = (currentPage) => {
    this.setState({ 
      currentPage 
    },() => {
      getService(API_PREFIX + `services/web/mall/product/info/getList/${this.state.currentPage}/10?Q=status=1${this.state.value?"&Q=name="+this.state.value:''}`, data => {
       this.setState({
         totalNum:data.root.totalNum,
         data:data.root.list,
         currentPage:data.root.page
       })    
    });
    });
  }
  showModal = () => {
    this.getOrderList();
    getService(API_PREFIX + `services/web/mall/product/info/getList/1/10?Q=status=1`, data => {
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
      value:'',
      selectedRows:[]
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.getOrderList();
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
    const values = [];
    this.state.selectedRowKeys.map((item) => {//xwx2018/12/24修改将selectedRows改为selectedRowKeys，将values.push(item.id)修改为values.push(item)
       values.push(item)
    })


   let selectedRows=this.state.selectedRows;
   selectedRows.map((item,index)=>{
     item.productStock=0,
     item.activityId=this.state.activityId;
     item.showIndex=0;
   })

   if(selectedRows.length==0){
    message.error("请选择商品");
     return false;
   }

    let params={
      activity:{id:""},
      productInfos:null
    };
    params.activity.id=this.state.activityId;
    params.activity.activityId=this.state.activityId;
    params.productInfos=selectedRows;
    postService(API_PREFIX+'services/web/activity/ordering/setActivityProduct',JSON.parse(JSON.stringify(params)),data=>{
      if(data.status == 1 ){
      	this.handleCancel()
      }else { // yelu 添加重复商品给错误提示
          message.error(data.retMsg)
      }
    });
  }
  onSearch = (value) => {
    getService(API_PREFIX + `services/web/mall/product/info/getList/1/10?Q=status=1${value?"&Q=name="+value:''}`, data => {
       this.setState({
         totalNum:data.root.totalNum,
         data:data.root.list,
         currentPage:1,
         value:value
       })    
    });
  }
  onSelectChange = (selectedRowKeys,selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRows, selectedRowKeys});
  }
    
  isModal=(e,record,type)=>{
    console.log("record==>",record,type);
       this.setgoodsStock(record.productId);
       this.setState({type,modal_visible:true,productId:record.productId,id:record.id,InitgoodsStock:record.productStock},()=>{
        this.props.form.setFieldsValue({
          showIndex:record.showIndex
        })
    })
  }

  setgoodsStock=(productId)=>{
    getService(API_PREFIX + `services/web/mall/product/info/getById/${productId}`, data => {
      if(data.status==1)
       this.setState({
        setgoodsStock:data.root.object?data.root.object.productStock:0
       })    
    });
  }
 
  setShowIndex=(id,showIndex)=>{
   if(!showIndex){
    showIndex=0;
   }
    postService(API_PREFIX+`services/web/activity/ordering/updateActivityPrductIndex/${id}/${showIndex}`,{},data=>{
      if(data.status==1){
        this.props.getData( API_PREFIX + `services/web/activity/ordering/getActivityProductList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize }?${this.props.pageData.query?this.props.pageData.query:''}` );
        this.setState({ modal_visible: false })
      }else{
        message.error(data.errorMsg);
      }
    });
  }
  handleSubmit=(e)=>{
    e.preventDefault();
    let { programa, sortId,currentPage,pageSize,newsId,type}=this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
     if(err){
       return;
     }

    //  排序
     this.setShowIndex(this.state.id,fieldsValue.showIndex);
  
    //  增加减少库存
    //  if(type==='1'){ 
    //     postService(API_PREFIX+`services/web/activity/ordering/addActivityPrductStock/${this.state.id}/${this.state.productId}/${fieldsValue.stockNum}`,{},data=>{
    //       if(data.status==1){
    //         message.success('新增成功');
    //         this.setShowIndex(this.state.id,fieldsValue.showIndex);
    //         this.props.getData( API_PREFIX + `services/web/activity/ordering/getActivityProductList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize }?${this.props.pageData.query?this.props.pageData.query:''}` );
    //         this.setState({ modal_visible: false })
    //       }else{
    //         message.error(data.errorMsg);
    //       }
    //     });
    // }else{
    //   postService(API_PREFIX+`services/web/activity/ordering/reductActivityPrductStock/${this.state.id}/${this.state.productId}/${fieldsValue.stockNum}`,{},data=>{
    //       if(data.status==1){
    //         message.success('减少成功');
    //         this.setShowIndex(this.state.id,fieldsValue.showIndex);
    //         this.props.getData( API_PREFIX + `services/web/activity/ordering/getActivityProductList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize }?${this.props.pageData.query?this.props.pageData.query:''}` );
    //         this.setState({ modal_visible: false })
    //       }else{
    //         message.error(data.errorMsg);
    //       }})
    //     }
    })
  }
 
   compare=()=>{
        let arr=[]
        const {orderList}=this.state;     
        orderList&&orderList.length>0&&orderList.map((item,index)=>{
          arr.push(item.productId)
        })
        return arr;
   }

  render() {
    const { selectedRowKeys } = this.state;
    const {getFieldDecorator}=this.props.form;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled:this.compare().some(v=>{
          return v==record.id
        })||record.productStock==0
      }),
    };
    const search = [
		  {
		    key: 'productName',
		    label: '商品名称',
		    qFilter: 'Q=productName',
		    type: 'input',
		  }
		];
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum'
      },
      {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
      },
      // {
      //   title: '销量',
      //   dataIndex: 'sales',
      //   key: 'sales',
      // }, {
      //   title: '库存',
      //   dataIndex: 'productStock',
      //   key: 'productStock',
      // },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '商家名称',
        dataIndex: 'merchantName',
        key: 'merchantName',
      },
      {
        title: '商品图片',
        dataIndex: 'images',
        key: 'images',
        render: (text, record, index) => {
          return <div><img src={`${this.state.ossViewPath}${record.images}`} style={{width:"100px",maxHeight:"120px"}}/></div>;
        }
      },
      {
        title: '所属分类',
        dataIndex: 'categoryName',
        key: 'categoryName'
      },
      {
        title: '显示顺序',
        dataIndex: 'showIndex',
        key: 'showIndex'
      },
     {
        title: '操作',
        key: 'x',
        render: (text, record, index) => {
          return <div>
             <a onClick={(e) =>this.isModal(e,record,"2")}>设置</a> 
            {/* <a onClick={(e) =>this.isModal(e,record,"1")} style={{marginRight:"6px"}}>增加库存</a>
            <a onClick={(e) =>this.isModal(e,record,"2")}>减少库存</a>      */}
          </div>;

        },
      }
    ];
    let pagination = {
      total: this.state.totalNum,
      current: this.state.currentPage,
      onChange: this.onPageChange,
    };
    const columns1=[
    	{
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '商家名称',
        dataIndex: 'merchantName',
        key: 'merchantName',
      },
      {
        title: '联系人',
        dataIndex: 'linkName',
        key: 'linkName',
      },
      {
        title: '价格',
        dataIndex: 'productPrice',
        key: 'productPrice',
      },
      {
        title: '库存',
        dataIndex: 'productStock',
        key: 'productStock',
      }
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4},
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    
   console.log(GetQueryString(location.hash, ['activeKey']).activeKey)
    return(
    	<div>
    		
          <TableAndSearch key={this.state.keyTable} search={search}  customBtn={GetQueryString(location.hash, ['activeKey']).activeKey&&GetQueryString(location.hash, ['activeKey']).activeKey!=0?null:{order:1,onClick:this.showModal,label: '添加商品',className:'queryBtn'}} goBackBtn={{order:3,label:"返回",url:`EventManagement/Order/List?id=${this.state.activeKey}`}}  deleteBtn={GetQueryString(location.hash, ['activeKey']).activeKey&&GetQueryString(location.hash, ['activeKey']).activeKey!=0?null:{order:2}}
           delUrl={'services/web/activity/ordering/deleteActivityProduct'} columns={columns} url={'services/web/activity/ordering/getActivityProductList'}    urlfilter={`Q=activityId=${this.state.activityId}`}  setgoods={true}/>
        <Modal
            className="modal"
            // title={this.state.type==='1'?"增加库存":'减少库存'}
            title="修改排序"
            maskClosable={false}
            footer={null}
            visible={this.state.modal_visible ? true : false}
            onCancel={() => this.setState({ modal_visible: false })}
            key={'examDbModal'}
            destroyOnClose={true}
          > 
          <Form  onSubmit={this.handleSubmit}>
              {/* <FormItem  label={this.state.type=='1'?"库存增加":"库存减少"} {...formItemLayout}>
                      {
                        getFieldDecorator('stockNum',{
                          rules: [
                            {
                              required:true ,
                              whitespace: true,
                              validator: (rule, value, callback) => {
                                if(!value){
                                  callback('必填项且不能为0')
                                }else if(value<0){
                                  callback('请勿输入负数')
                                }else if(value>999999999){
                                  callback('数值不得超过999999999')
                                }else if(String(value).indexOf('.')!=-1){
                                  callback('请勿输入小数')
                                }else if(isNaN(value)){
                                  callback('请勿输入非数字')
                                }else if(this.state.type==1&&value>this.state.setgoodsStock){
                                  callback(`最大不能大于库存总量${this.state.setgoodsStock}`)
                                }else  if(this.state.type!=1&&value>this.state.InitgoodsStock){
                                  callback(`最大不能大于库存总量${this.state.InitgoodsStock}`) 
                                } else {
                                  callback()
                                }
                              },
                            },
                          ],
                        })
                        (<Input />)                      
                      }
                     <span style={{color:"red"}}>商品库存量:{this.state.type==1?this.state.setgoodsStock:this.state.InitgoodsStock}</span>
                </FormItem> */}
                <FormItem  label="显示顺序" {...formItemLayout} >
                      {
                        getFieldDecorator('showIndex',{
                          rules: [
                            {
                              // required:true ,
                              whitespace: true,
                              validator: (rule, value, callback) => {
                               if(value<0){
                                  callback('请勿输入负数')
                                }else if(value>999999999){
                                  callback('数值不得超过999999999')
                                }else if(String(value).indexOf('.')!=-1){
                                  callback('请勿输入小数')
                                }else if(isNaN(value)){
                                  callback('请勿输入非数字')
                                }{
                                  callback()
                                }
                              },
                            },
                          ],
                        })
                        (<InputNumber  style={{width:'100%'}}/>)
                      }
                </FormItem>
                <Button className="resetBtn" style={{marginLeft:"166px",marginTop:"10px"}} onClick={() => this.setState({ modal_visible: false })}>取消</Button>
                <Button className="queryBtn" onClick={this.handleSubmit} loading={this.state.loading}>确定</Button>
          </Form>
          </Modal>   

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
          <Table rowKey='id' rowSelection={rowSelection} bordered columns={columns1} dataSource={this.state.data} pagination={pagination} />
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