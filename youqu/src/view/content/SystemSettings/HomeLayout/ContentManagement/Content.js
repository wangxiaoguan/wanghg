import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import {Button,Modal,Form,Input,Radio,Cascader,Message} from 'antd';
import {postService,getService} from '../../../myFetch';
import {  BEGIN,getDataSource,getPageData } from '../../../../../redux-root/action';
import {connect} from 'react-redux';
import ServiceApi  from '../../../apiprefix';
import './content.less';
const FormItem = Form.Item;
@connect(
  state => ({
    dataSource: state.tableData,
    pageData:state.pageData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)

@Form.create()
class Content extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      visible: false,
      key:2000,
      id:''
    };
  }
  componentWillMount(){
    //获取党组织数据
    getService(ServiceApi+'services/system/cateogry/categoryList/get',data=>{
      console.log("党组织数据：",data);
          let pOrgs=data.root.list;
          if(pOrgs){
      //调用接口数据处理函数
      this.getPartyOrganationData(pOrgs);
            this.setState({
              partyOrganizationDatas:pOrgs
            });

          }
        }
    );

  }
    //递归取出接口返回的党组织的数据
  getPartyOrganationData(poData){
    poData.map((item,index)=>{
      item.value=item.id;
      item.label=item.name;
      item.children=item.subCategoryList;
      if(item.subCategoryList){//不为空，递归
        this.getPartyOrganationData(item.subCategoryList)
      }
    });
  }
  showModal = (record) => {
    console.log(this.props.pageData)
    this.props.form.setFieldsValue({
        showIndex: record.showIndex,
    });
    this.setState({
      id:record.id
    })
    this.setState({
      visible: true,
      key:this.state.key + 1
    });
  }
  getData = async(url) => {
    await this.props.getData(ServiceApi + `${url}`);
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  //获取到所属栏目的id
  handleCheckChange=(value)=>{
    console.log("级联中的value：",value);
    this.setState({
      selectedValues:value
    });

  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(values.showIndex===undefined){
          values.showIndex=''
        }
        postService(ServiceApi + `services/system/homepageContent/update`,{id:this.state.id,showIndex:values.showIndex} ,data => {
            if (data.retCode == 1) {
               this.getData(`services/system/homepageContent/list/` + `${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            }else{     
                
            }
        });
      }
    });
    this.handleOk()
  }
  //从首页下线
  offLine = () => {
    getService(ServiceApi + `services/system/homepageContent/delete/`+this.state.id,data => {
            if (data.retCode == 1) {
               Message.success('从首页下线成功!');
               this.getData(`services/system/homepageContent/list/` + `${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            }else{     
                
            }
    });
  }
  render() {
    const { getFieldDecorator} = this.props.form;
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '标题名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '所属栏目',
        dataIndex: 'categoryName',
        key: 'categoryName',
      },
      {
        title: '显示顺序',
        dataIndex: 'showIndex',
        key: 'showIndex',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '操作',
        key: 'x',
        render: (text, record, index) => {
          return <div> 
            <a className='operation' onClick={this.showModal.bind(this,record)}>编辑排序</a>
          </div>;
        },
      },
    ];
    const partyidsQF=`Q=categoryId_S_ST=${this.state.selectedValues}`;
    const search = [
      {
        key: 'categoryId',
        label: '所属栏目',
        qFilter: 'Q=categoryId_S_LK',
        type: 'cascader',
        option: this.state.partyOrganizationDatas,
      },
      { key: 'title', label: '标题名称',qFilter:'Q=title_S_LK',type:'input'},
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
    return <div className="content">
      <TableAndSearch tip={true} optionalBtn1={{order:1,label:'从首页下线'}} offLine={true} columns={columns} url={'services/system/homepageContent/list'} delUrl={'services/system/homepageContent/delete'}    search={search}>
      </TableAndSearch>
      <Modal
          title="编辑排序"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
        <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('showIndex', {
            rules: [{ pattern: new RegExp('^[0-9]+$'), message: '请使用数字表示显示顺序！', max:9 }, { required: false, message:'*必填项,最长9个字符！', max:9 }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem>
          <Button className="queryBtn" type="primary" htmlType="submit">保存</Button>
        </FormItem>
      </Form>
        
      </Modal>
    </div>;
  }
}

export default Content;
