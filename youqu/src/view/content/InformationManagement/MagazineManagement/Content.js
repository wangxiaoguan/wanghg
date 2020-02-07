import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { Tag, Button, Modal, Form, Input, Message,Divider} from 'antd';
import {connect} from 'react-redux';
import {  BEGIN,getDataSource,getPageData } from '../../../../redux-root/action';
const FormItem = Form.Item;
import Content from '../MagazineManagement/Content';
import MagazineArticle from '../MagazineManagement/Article';
import ServiceApi from '../../apiprefix';
import { GetQueryString, postService, getService } from '../../myFetch';

@connect(
  state => ({
    dataSource: state.tableData,
    pageData:state.pageData,
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
      flag:true, //判断是否编辑“杂志目录”，true-编辑，false-新增
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
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  editContent =(record) => {
    console.log(record);
    this.setState({
      visible: true,
      record:record,
      flag:true,
      header: '编辑杂志目录',
    });
  }

  getData = async(url) => {
    await this.props.getData(ServiceApi + `${url}`);
  }

  getVisible = (visible) => {
    this.setState({
      visible:visible,
    });
  }

  componentDidMount(){
    //console.log('this.props.data',this.props.data);
  }

  render(){
    console.log('this.props.pageData',this.state.pageData);
    let magazineId = window.sessionStorage.getItem('magazineId');
    console.log('xxxxxx.xxxx',magazineId);
    let powers = this.props.powers;
    // console.log('权限码', powers);
    let createPowers = powers && powers['20003.23003.001'];
    let updatePowers = powers && powers['20003.23003.002'];
    let readPowers = powers && powers['20003.23003.003'];
    let deletePowers = powers && powers['20003.23003.004'];
    let mContentPowers = powers && powers['20003.23003.000'];
    let articleTab;

    const columns = [
      {
        title: '序号',
        key: 'sequence',
        dataIndex: 'sequence',
        /*render: (text, record, index) => {
          return index + 1;
        },*/
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
            <a className="operation" onClick={this.editContent.bind(this,record)}
              style={{ display: updatePowers ? 'inline-block' : 'none' }}>编辑 </a>
            <Divider type="vertical" />
            <a className="operation" onClick={() => {
              // const list = JSON.stringify(record);
              // window.sessionStorage.setItem('carousel', list);
              // location.hash = '/InformationManagement/Magazine/Article';
              this.props.exchange(null,record.id);
              let obj = JSON.parse(window.sessionStorage.getItem('magazine'));
              articleTab = obj.magazineSeriesName + '-' + obj.name + '-' + obj.periods + '-杂志文章';
              this.props.add('two',[
                { title: articleTab, content: <MagazineArticle />, key: '3' }]);
            }} style={{ display: mContentPowers ? 'inline-block' : 'none' }} > 杂志文章</a>
            {/*<Divider type="vertical" />*/}
          </div>;
        },
      },
    ];

    return (
      <div>
        <TableAndSearch columns={columns} url={`services/news/magazine/catalogue/list/${magazineId}`}
          addBtn={createPowers ? { order:1, OnEvent:this.showModal} : null}
          deleteBtn={deletePowers ? {order:2} : null}
          delUrl={'services/news/magazine/catalogue/delete'}/>
        <Modal
          title={this.state.header}
          maskClosable={false}//点击蒙层是否关闭
          footer={null}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose
        >
          <WrappedDisplayForm getData={this.getData} handleCancel={this.handleCancel} record={this.state.record} flag={this.state.flag} url={'services/news/magazine/catalogue/list/3'} visible={this.state.visible} getVisible={this.getVisible}
            pageData={this.props.pageData}/>
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
    console.log('this.props.pageData',this.state.pageData);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.magazineId = window.sessionStorage.getItem('magazineId');
        console.log('Received values of form: ', values);
        if(this.props.flag){
          values.id = this.props.record.id;
          postService(ServiceApi + 'services/news/magazine/catalogue/update',values, data => {
            if (data.retCode == 1) {
              Message.success('修改成功!');
              console.log('update');
              this.props.getData(`services/news/magazine/catalogue/list/${window.sessionStorage.getItem('magazineId')}/${this.state.pageData.currentPage}/${this.state.pageData.pageSize}?${this.state.pageData.query}`);
              this.setState({
                visible:false,
              },() => {
                this.props.getVisible(this.state.visible);
              });
            } else {

            }
          });
        }else{
          postService(ServiceApi + 'services/news/magazine/catalogue/add',values, data => {
            if (data.retCode == 1) {
              Message.success('新增成功!');
              console.log('add');
              this.props.getData(`services/news/magazine/catalogue/list/${window.sessionStorage.getItem('magazineId')}/${this.state.pageData.currentPage}/${this.state.pageData.pageSize}?${this.state.pageData.query}`);
              this.setState({
                visible:false,
              },() => {
                this.props.getVisible(this.state.visible);
              });
            } else {

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
      if(this.props.flag){//编辑==》额外传入
        query=query+'&'+`Q=id_S_NE=${this.props.record.id}`;
      }
      getService(ServiceApi + `services/system/verify/checkUnique/InformationManagement-Catalog?${query}`, data => {
        if(data.retCode==0){
          console.log('data.retMsg',data.retMsg);
          this.setState({
            validSequence:{
              retCode:data.retCode,
              retMsg:data.retMsg,
            },
          });
          callback([new Error('该杂志目录序号已存在')]);
          // message.error(data.retMsg)
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
    console.log('record',this.props.record);
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
            rules: [{ required: true, message: '请输入杂志序号,且最长为4位整型数字！',max:4 }, {
              validator: this.handleValidSequence,
            }],initialValue:sequence,
          })(
            <Input placeholder="请输入杂志序号" />
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