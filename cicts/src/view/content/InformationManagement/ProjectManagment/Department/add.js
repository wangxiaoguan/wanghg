import React, { Component } from 'react';
import { Tabs,Select,Button,message,Cascader,Form,Popconfirm,Modal,Spin,Table,Row,Col,Input ,Icon,Upload} from 'antd';
import {pageJummps} from '../../PageJumps';
import {postService,getService,GetQueryString } from '../../../myFetch';
import API_PREFIX, {API_FILE_VIEW,API_FILE_UPLOAD,API_CHOOSE_SERVICE,API_FILE_UPLOAD_INNER,API_FILE_VIEW_INNER} from '../../../apiprefix';
const FormItem = Form.Item;
var uploadPicture
if(API_CHOOSE_SERVICE==1){
  uploadPicture = API_FILE_UPLOAD+'/project';
}else{
  uploadPicture = API_FILE_UPLOAD_INNER;
}

@Form.create()
class DepartmentL extends Component {
  constructor(props){
    super(props);
    this.departList=[];
    this.state={  
        loading:false,
        previewVisible: false,
        previewImage: '',
        fileList: [],
        isCheck:false,
        newsId:GetQueryString(location.hash, ['newsId']).newsId ||0,
        isEdit:GetQueryString(location.hash, ['isEdit']).isEdit||'',
        belongsData:[],
        selectFlag:false,
        orgName:'',//部门名称
        ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW, //根据登陆人员来获取oss地址
    }
  }

  componentDidMount(){
    let {isEdit,newsId}=this.state;
    //获取部门的数据
    let organizationData = [];
    getService(API_PREFIX + 'services/web/news/special/orgHasTip', data => {
      if (data.status === 1) {
        organizationData.push(data.root.object);
        let authorityOrgIds = this.getDpData(organizationData)
        this.dealDepartmentData(organizationData,authorityOrgIds);
        this.setState({ belongsData: organizationData });
      }else{
        message.error(data.errorMsg);
      }
    });
    if(isEdit==='true'){
        getService(API_PREFIX + `services/web/news/special/normal/getList/1/10?Q=type=7&Q=id=${newsId}`, data => {
            if(data.status === 1){
                this.setState(()=>{
                      let url
                      if(API_CHOOSE_SERVICE==1){
                        url = this.state.ossViewPath + data.root.list[0].titleImage;
                      }else{
                        url = API_FILE_VIEW_INNER + data.root.list[0].titleImage;
                      }
                      this.setState({
                        fileList:[{
                          uid: -1,
                          name: 'xxx.png',
                          status: 'done',
                          url:url,
                        }],
                      });
                      this.props.form.setFieldsValue({
                        titleImage: data.root.list[0].titleImage,
                        orgId:data.root.list[0].orgId.split(',')
                      });
                })
            }else{
              message.error(data.errorMsg);
            }
        })
    }
  }


  getDpData(data) {
    let orgIds = window.sessionStorage.getItem('authorityOrgIds')?window.sessionStorage.getItem('authorityOrgIds'):false;
    data.map((item, index) => {
      if(orgIds&&orgIds.indexOf(item.id)>-1){
        this.departList.push(item.treePath.split(','));
      }
      if (item.sub) {
        this.getDpData(item.sub);
      }
    });
    let List = this.departList.join(',').split(',');
    return [...new Set(List)];
  }
  //处理部门数据
  dealDepartmentData(data,e) {
    let tenantId = window.sessionStorage.getItem('tenantId')
    let orgIds = window.sessionStorage.getItem('authorityOrgIds')?window.sessionStorage.getItem('authorityOrgIds'):false;
    data.map((item, index) => {
      item.value = item.id + '';
      if(item.isCreated){
        item.label = `${item.name}(已创建)`
      }else{
        item.label = item.name
      }
      if(orgIds === 'no'){
        item.disabled = true
      }else if(orgIds !== 'no'&&orgIds){
        item.disabled = e.indexOf(item.id)>-1?false:true 
      }
      if (item.sub&&item.sub[0]&&item.sub[0].parentId===tenantId) {
        item.children = item.sub;
        this.dealDepartmentData(item.sub,e);
      }
    });
  }

  onRemove= (file) => {
    this.setState(({ fileList }) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList,
      };
    });
  }

  beforeUpload=(file)=>{
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isGIF = file.type === 'image/gif';
    if ( !isJPG && !isPNG && !isGIF) {
      message.error('仅支持上传JPG/JPEG/PNG/GIF格式文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片尺寸大小必须小于2MB!');
    }
    return (isJPG || isPNG || isGIF) && isLt2M;
  }
    normFile = (e) => {
      if(e.file.status != undefined){
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
      }
    }
  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleChange = (info) => {
    if (info.file.status == 'uploading') {
      this.setState({ fileList :info.fileList}); 
    }
    if (info.file.status === 'done') {
      this.setState({
        previewImage:`${info.file.response.root.object[0].filePath}`,
        imageUrl:`${info.file.response.root.object[0].filePath}`,
      });
      this.setState({ fileList :info.fileList});
      message.success(`${info.file.name} 上传成功。`);
    }else if(info.file.status === 'error'){
      message.error(`${info.file.name} 上传失败。`);
    }
    if (info.file.status == 'removed') {
      this.setState({ fileList :info.fileList});
    }
  };
  setColumnAuth = (data) => {
    let tenantId = window.sessionStorage.getItem("tenantId");
    let body = {
        dataId: data.id,
        dataType: 6,
        departments:[],
        partys:[],
        groups: [],
        companyList: [],
        viewTenantId: [tenantId],
        partysJoin: [],
        departmentsJoin: [],
        groupsJoin: [],
        companyJoinList: [],
        unions:[],
        unionsJoin:[],
        joinTenantId: [],
    };
    postService(API_PREFIX + pageJummps.InfoAuthorityAdd, body, data => {
      if (data.status === 1) {
        
      }else{
        message.error(data.errorMsg);
      }
    });
}
  handleSubmit = e => {
    e.preventDefault();
    let {newsId,selectFlag}=this.state
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.pictureUrl = this.state.imageUrl;
        if(this.state.isEdit==='true'){
          if(selectFlag){
            message.error('部门已创建，请重新选择部门')
            return;
          }
          let body={}
          body.title=values.title;
          if(values.titleImage instanceof Array === true){
            body.titleImage=values.titleImage[0].response.root.object[0].filePath;
          }else{
            body.titleImage=values.titleImage;
          }
          if(this.state.orgName){
            body.orgName = this.state.orgName;
          }
          body.orgId = values.orgId[values.orgId.length-1]
          body.id = newsId;
          postService(API_PREFIX + pageJummps.DepartmentEdit,body, data => {
            if(data.status == 1){
              message.success('修改成功');
              history.back();
            }else {
              message.error(data.errorMsg)
            }
          });
        }else{
            let body={}
            body.titleImage=this.state.imageUrl;
            body.orgId = values.orgId[values.orgId.length-1]
            body.orgName = this.state.orgName;
            postService(API_PREFIX + pageJummps.DepartmentAdd,body, data => {
                if (data.status == 1) {
                  this.setColumnAuth(data.root.object)
                    message.success('新增成功');
                    history.back();
                }else{
                  message.error(data.errorMsg)
                }
            });
        }
      }
    });
  };

  onChange=(value,e)=>{
    let data=e[e.length-1].name.indexOf('(已创建)')>-1;
    this.setState({selectFlag:data,orgName:e[e.length-1].name})
  }
  render() {
    const {isCheck,fileList,titleImage} = this.state;
    const { form: { getFieldDecorator }} = this.props;
    const uploadButton = (<div><Icon type="plus" /><div className="ant-upload-text">Upload</div></div>);
    const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 18 } };
    const formItemLayout1 = { labelCol: { span: 5 }, wrapperCol: { span: 13 } };
    return (
      <Spin spinning={this.state.loading}>
        <div style={{marginTop:'40px'}}>
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout1} label="专题封面" >
                    {getFieldDecorator('titleImage', {
                    valuePropName: 'filelist',
                    getValueFromEvent: this.normFile,
                    rules: [{ required: true, message: '*必填项'}],
                    })(
                    !isCheck ? (
                        <Upload
                        accept={'image/*'}
                        action={uploadPicture}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                        beforeUpload={this.beforeUpload}
                        >
                        {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                    ) : (
                        <div>
                        {
                          API_CHOOSE_SERVICE==1?
                          <Button onClick={() => this.setState({ previewVisible: true, previewImage: this.state.ossViewPath + titleImage})}>查看</Button>:
                          <Button onClick={() => this.setState({ previewVisible: true, previewImage:API_FILE_VIEW_INNER+titleImage})}>查看</Button>
                        }
                        </div>
                    ))}
                </FormItem>
                <Row style={{marginBottom:'30px'}}>
                    <Col offset={5} span={24}>只能添加一张，图片标准尺寸210*122，若上传非标准尺寸图片，系统将采用拉伸处理</Col>
                </Row>
                <FormItem {...formItemLayout} label="选择部门">
                  {getFieldDecorator('orgId', {
                    rules: [
                      {
                        type: 'array',
                        required: true,
                        whitespace: true,
                        message: '必填项',
                      },
                    ],
                  })(
                    <Cascader style={{width:'50%'}}
                      className="input"
                      options={this.state.belongsData}
                      placeholder="请输入关键字"
                      // disabled={disabled}
                      changeOnSelect
                      onChange={this.onChange}
                    />
                  )}
                </FormItem> 

                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Row style={{width:'164px',paddingTop:'250px',margin:'0 auto'}}>
                    <Button className="resetBtn" onClick={() => history.back()}>返回</Button>
                    <Button htmlType="submit" className="queryBtn" type="primary" disabled={isCheck}>保存</Button>
                </Row>
            </Form>

        </div>
      </Spin>
    );
  }
}

export default DepartmentL;