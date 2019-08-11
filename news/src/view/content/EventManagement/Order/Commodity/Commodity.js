import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import {postService,getService} from '../../../myFetch';
import {Button,Modal,Form,Input,Radio,Message,Row,Col,Upload,Divider} from 'antd';
import './Commodity.less';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {  BEGIN,getDataSource,getPageData } from '../../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
import ServiceApi from '../../../apiprefix';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
class Commodity extends Component {
  constructor(props) {
    super(props);
    this.state={
      showImportModal:false,
    };
  }

	stop = (id) => {
    console.log('id==>',id)
    getService(ServiceApi + `services/activity/goods/enable/` + id,data => {
      console.log("data==>",data)
       this.getData(`services/activity/goods/list/`+ `${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
    });
	}
	getData = async(url) => {
    await this.props.getData(ServiceApi + `${url}`);
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
    let powers = this.props.powers;
    let createPowers = powers && powers['20002.22007.001'];
    let updatePowers = powers &&powers['20002.22007.002'];
    let readPowers = powers && powers['20002.22007.003'];
    let deletePowers = powers && powers['20002.22007.004'];
    let offLinePowers = powers && powers['20002.22007.002'];
    let onLinePowers = powers && powers['20002.22007.002'];
    let exportPowers = powers && powers['20002.22007.202'];  
    let importPowers = powers && powers['20002.22011.206'];  
  	const columns=[
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title:'商品名称',
        dataIndex:'name',
        key:'name'
      },
      {
        title:'价格',
        dataIndex:'price',
        key:'price'
      },
      {
        title:'库存',
        dataIndex:'stock',
        key:'stock'
      },
      {
        title:'状态',
        dataIndex:'status',
        key:'status',
        render:(data,record)=>{
        	if(record.status == 0){
        		return "已停用"
        	}else{
        		return "已启用"
        	}
        }
      },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        render:(data,record)=>(
            <div>
              <a style={{ display: updatePowers ? 'inline-block' : 'none' }} className='operation' onClick={() => {
              	console.log("record",record)
              	location.hash = "EventManagement/Order/CommodityEdit?isEdit=true&&isFlag=false";
              const list = JSON.stringify(record);
              window.sessionStorage.setItem('commodity', list)}}>
                编辑
              </a>
              <Divider type="vertical" />
              <a style={{ display: readPowers ? 'inline-block' : 'none' }} onClick={() => {
              	console.log("record",record)
              	location.hash = "EventManagement/Order/CommodityAdd?isEdit=true&&isFlag=true";
              const list = JSON.stringify(record);
              window.sessionStorage.setItem('commodity', list)}} className='operation' >
                详情
              </a>
              <Divider type="vertical" />
              {
              	record.status == 1 ?
              	  	<a style={{ display: onLinePowers ? 'inline-block' : 'none' }} onClick={this.stop.bind(this,record.id)} className='operation'>
						          停用
						        </a> : <a style={{ display: onLinePowers ? 'inline-block' : 'none' }}  onClick={this.stop.bind(this,record.id)} className='operation'>
						          启用
						        </a>
              }
            </div>
        ),
      }
    ];
    const option = [{
    	key:"",
    	value:"全部"
    },{
    	key:"0",
    	value:"已停用"
    },{
    	key:"1",
    	value:"已启用"
    }]
    const search=[
      {key:'name',label:'商品名称',qFilter:'Q=name_S_LK',type:'input'},
      {key:'status',label:'状态',qFilter:'Q=status_S_LK',option:option}
    ];
    return <div>
    	<TableAndSearch search={search} columns={columns} 
    	url={'services/activity/goods/list'}
      customBtn={importPowers?{ order: 2, label: '批量导入商品', onClick: this.showImportModal, className: 'resetBtn'}:null}
    	addBtn={createPowers?{order:1,url:"EventManagement/Order/CommodityAdd?isEdit=false&&isFlag=false"}:null}
    	deleteBtn={deletePowers?{order:2}:null}
      delUrl={'services/activity/goods/delete'}>
       <Modal
        title="商品导入"
        cancelText="返回"
        okText="确定"
        visible={this.state.showImportModal}
        onOk={this.handleImportModalOk}
        onCancel={this.handleImportModalCancel}
        destroyOnClose={true}
          >
            <ImportPart1
                importUrl={'services/activity/import/goods'}
                listurl={'services/activity/goods/list'}
                pageData={this.props.pageData}
                getData={this.getData}
            downlodUrl={ServiceApi + 'services/activity/goods/template'}/>
          </Modal>
	      </TableAndSearch>
    </div>;
  }
}

export default Commodity;
export class ImportPart1 extends Component{
  constructor(props){
    super(props);
  }
  //文件导入之前的校验函数
  beforeUpload=(file)=>{

    const isExcel = file.type === 'application/vnd.ms-excel'|| file.type ==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isExcel) {
      console.log('isExcel',isExcel);
      message.error('文件格式有误，必须为Excel文件');
    }
    return isExcel ;
  }
  //
  //文件导入的  onChange处理函数
  handleChange=(info)=>{
    console.log('Changeinfo', info);

    if(info.file.status=== 'uploading'){
      // this.setState(
      //     {
      //       showBeforeImortIcon:true
      //     }
      // )
      console.log('uploading-----------');
    }
    if(info.file.response){
      if ( info.file.response.retCode == 1 ) {
        Message.success( info.file.name + ' 上传成功。', 3 );
        this.props.getData(`${this.props.listurl}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      } else if ( info.file.response.retCode == 0 ) {
        console.log("info.file.response.root",info.file.response.root);
        var mess='';
        console.log("info.file.response.root",info.file.response.root);
        if(info.file.response.root.list!=undefined){
          info.file.response.root.list.map((item,index)=>{
            mess=mess+item;
          });
        }else{
          mess=info.file.response.retMsg;
        }
        console.log("mess",mess);
        Message.error('导入失败，' + '失败原因：' + mess, 5 );
      }
    }

  }
  handleClick=(url)=>{
/*    var $eleForm = $("<form method='get'></form>");

    $eleForm.attr("action",url);

    $("#excel").append($eleForm);

    //提交表单，实现下载
    $eleForm.submit();*/
    let a = document.createElement('a');
    a.href = url;
    let fileName = null;
    if(fileName == null){
      fileName = 'default_excel_name';
    }
    a.download = fileName+'.xls';
    if (document.all) {
      a.click();
    } else {
      let evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, true);
      a.dispatchEvent(evt);
    }
  }
  render(){
    return(
      <Row>
        <Col span={10}>
          <span style={{color:'red'}}>*</span>请选择导入文件
        </Col>
        <Col span={6}>
          <Upload
            name="file"
            action= {ServiceApi+this.props.importUrl}
            accept="application/vnd.ms-excel"
            multiple= {false}
            data={null}
            showUploadList={false}
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
          >
            <Button>选择文件</Button>
          </Upload>
        </Col>
        <Col span={6}>
          <Button onClick={this.handleClick.bind(this,this.props.downlodUrl)} className="but-tab" icon="download" style={{float:'right',marginTop:'4px'}}><a id="excel" herf="javascript:void(0);" >模板下载</a></Button>
        </Col>
      </Row>
    );
  }
}