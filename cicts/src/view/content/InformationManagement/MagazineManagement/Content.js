import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { Button, Modal, Form, Input,Divider,InputNumber,message} from 'antd';
import {connect} from 'react-redux';
import {  BEGIN} from '../../../../redux-root/action/table/table';
const FormItem = Form.Item;
import MagazineArticle from '../MagazineManagement/Article';
import {pageJummps} from '../PageJumps';
import API_PREFIX from '../../apiprefix';
import {postService, getService } from '../../myFetch';

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
export default class MagazineContent extends Component{
  constructor(props) {
    super(props);

    this.state = {
      visible : false,
      record : {},
      flag:true, 
      header: '编辑杂志目录',
      validSequence: {retCode:0},
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
      flag:false,
      header: '新增杂志目录',
    });
  }

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  editContent =(record) => {
    this.setState({
      visible: true,
      record:record,
      flag:true,
      header: '编辑杂志目录',
    });
  }

  getData = async(url) => {
    await this.props.getData(API_PREFIX + `${url}`);
  }

  getVisible = (visible) => {
    this.setState({
      visible:visible,
    });
  }

  render(){
    let powers = this.props.powers;
    // let createPowers = powers && powers['20001.21604.001'];//新建
    // let updatePowers = powers && powers['20001.21604.002'];//修改
    // let readPowers = powers && powers['20001.21604.003'];
    // let deletePowers = powers && powers['20001.21604.004'];//删除
    // let mContentPowers = powers && powers['20001.21603.000'];//杂志文章
    let createPowers = true;//新建
    let deletePowers = true;//删除
    let mContentPowers = true;//杂志文章
    let articleTab;
    const columns = [
      {
        title: '序号',
        key: 'sequence',
        dataIndex: 'sequence',
      },
      {
        title: '目录名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建日期',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '更新时间',
        dataIndex: 'lastUpdateDate',
        key: 'lastUpdateDate',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (data, record) => {
          return <div>
            <a className="operation" onClick={this.editContent.bind(this,record)}>编辑 </a>
            <Divider type="vertical" />
            <a className="operation" onClick={() => {
              this.props.exchange(null,record.id);
              let obj = JSON.parse(window.sessionStorage.getItem('magazine'));
              articleTab = this.props.tabtitle + '-' + obj.name + this.props.periods +'-' + '杂志文章';
              this.props.add('two',[{ title: articleTab, content: <MagazineArticle id={this.props.id} data={[{key:record.id,value:record.name}]} type='single' />, key: '3' }]);
            }} style={{ display: mContentPowers ? 'inline-block' : 'none' }} > 杂志文章</a>
          </div>;
        },
      },
    ];

    return (
      <div>
        <TableAndSearch 
            columns={columns} 
            url={`${pageJummps.CatalogueList}/${this.props.id}`}
            addBtn={createPowers ? { order:1, OnEvent:this.showModal} : null}
            deleteBtn={deletePowers ? {order:2,url:pageJummps.CatalogueDelete,txt:'可能关联杂志文章,您确定删除吗?'} : null}
        />
        <Modal
          title={this.state.header}
          maskClosable={false}//点击蒙层是否关闭
          footer={null}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose
        >
          <WrappedDisplayForm 
            getData={this.getData} 
            handleCancel={this.handleCancel} 
            record={this.state.record} 
            flag={this.state.flag} 
            url={'services/news/magazine/catalogue/list/3'} 
            visible={this.state.visible} 
            getVisible={this.getVisible}
            pageData={this.props.pageData}
          />
        </Modal>
      </div>
    );
  }
}


class DisplayForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      visible: this.props.visible,
      pageData:this.props.pageData,
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.magazineId = window.sessionStorage.getItem('magazineId');
        if(this.props.flag){
          values.id = this.props.record.id;
          postService(API_PREFIX + pageJummps.CatalogueEdit,values, data => {
            if (data.status == 1) {
              message.success('修改成功!');
              this.props.getData(`${pageJummps.CatalogueList}/${window.sessionStorage.getItem('magazineId')}/${this.state.pageData.currentPage}/${this.state.pageData.pageSize}?${this.state.pageData.query}`);
              this.setState({visible:false},() => {this.props.getVisible(this.state.visible);});
            } else {
              message.error(data.errorMsg);
            }
          });
        }else{
          values['state'] = 0;
          postService(API_PREFIX + pageJummps.CatalogueAdd,values, data => {
            if (data.status == 1) {
              message.success('新增成功!');
              this.props.getData(`${pageJummps.CatalogueList}/${window.sessionStorage.getItem('magazineId')}/${this.state.pageData.currentPage}/${this.state.pageData.pageSize}?${this.state.pageData.query}`);
              this.setState({visible:false},() => {this.props.getVisible(this.state.visible);});
            } else {
              message.error(data.errorMsg);
            }
          });
        }
      }
    });
  }

  handleValidSequence= (rule, value, callback) => {
    if(value == ''||value==undefined){
      this.setState({
        validSequence:{
          retCode:0,
        },
      });
      callback();
    }else{
      let obj = JSON.parse(window.sessionStorage.getItem('magazine'));
      let query=`Q=sequence_I_EQ=${value}&Q=magazineid_S_EQ=${obj.id}`;
      if(this.props.flag){
        query=query+'&'+`Q=id_S_NE=${this.props.record.id}`;
      }
      getService(API_PREFIX + `services/system/verify/checkUnique/InformationManagement-Catalog?${query}`, data => {
        if(data.retCode==0){
          this.setState({
            validSequence:{
              retCode:data.retCode,
              retMsg:data.retMsg,
            },
          });
          callback([new Error('该杂志目录序号已存在')]);
        }else{
          this.setState({
            validSequence:{
              retCode:data.retCode,
              retMsg:data.retMsg,
            },
          });
          callback();
        }
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    if(this.props.flag){
      var name = this.props.record.name;
      var sequence = this.props.record.sequence.toString();
    }else{
      var name = '';
      var sequence = '';
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem label="名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入杂志目录名称,且最长为255个字符！',max:255 }],initialValue:name,
          })(
            <Input placeholder="请输入杂志目录名称" />
          )}
        </FormItem>
        <FormItem label="序号" {...formItemLayout}>
          {getFieldDecorator('sequence', {
            rules: [{ required: true, 
                      whitespace: true,
                      validator: (rule, value, callback) => {
                        if(!value){
                          callback('序号为必填项且不能为0');
                        }else if(value<1){
                          callback('请勿输入负数');
                        }else if(value>9999){
                          callback('数值不得超过9999');
                        }else if(String(value).indexOf('.')!=-1){
                          callback('请勿输入小数');
                        }else if(isNaN(value)){
                          callback('请勿输入非数字');
                        }{
                          callback();
                        }
                      },
            }],initialValue:sequence,
          })(
            <InputNumber  style={{width:'100%'}} />
          )}
        </FormItem>
        <FormItem>
          <Button style={{marginLeft:'145px'}} type="primary" className="resetBtn" onClick={this.props.handleCancel}>
                  返回
          </Button>
          <Button type="primary" htmlType="submit" className="queryBtn">
                  保存
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedDisplayForm = Form.create()(DisplayForm);