import React, { Component } from 'react';
import { Upload, Icon, message, Button, Form, Input, Select, Row, Radio, Col, Message, Modal } from 'antd';
import { GetQueryString, postService, getService } from '../../../myFetch';
import ServiceApi, {PictrueUrl,UploadUrl,ChooseUrl,FileUrl,API_FILE_VIEW_INNER } from '../../../apiprefix';
import PicturesWall from '../upLoad.js';
import FormAndInput from'../../../../component/table/FormAndInput';
import './CarouselDetail.less';
// const masterUrl = 'http://10.110.200.62:9080/';
var uploadPicture
if(ChooseUrl==1){
  uploadPicture = UploadUrl+'/carousel';
}else{
  uploadPicture = FileUrl;
}
import { connect } from 'react-redux';
import { BEGIN } from '../../../../../redux-root/action';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@connect(state => ({
  pageData: state.pageData,              //封装表格分页查询条件数据
  selectRowsData: state.selectRowsData,  //封装表格选择数据
}),
dispatch => ({
  getData: n => dispatch(BEGIN(n)),
}))
@Form.create()
export default class CarouselDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: eval(GetQueryString(location.hash, ['isEdit', 'isCheck']).isEdit)||false,
      isCheck: eval(GetQueryString(location.hash, ['isCheck', 'isEdit']).isCheck)||false,
      value:1,
      lab: '相关资讯地址',
      btn: <Button className="add resetBtn">添加资讯</Button>,
      type:'1',
      isEnabled:'false',
      typeOption:[],
      imageUrl: window.sessionStorage.getItem('carousel') ? JSON.parse(window.sessionStorage.getItem('carousel')).pictureUrl : '',
      previewVisible: false,
      previewImage: '',
      fileList: [],
      showAddModal:'0',
      sourceId: '',
      title: '',
      categoryId: '',
      updateKey: 0,
    };
  }
  componentWillUnmount(){
    window.sessionStorage.removeItem('carousel');
  }

  componentDidMount(){
    getService(ServiceApi + 'services/lookup/init/relateType', data => {
      console.log('lookup', data);
      let result =[];
      for (let index = 0; index < data.length; index++) {
        let node = data[index];
        node.key = node.code + '';
        node.value = node.desp + '';
        result.push(node);
      }
      this.setState({
        typeOption: result,
      },()=>{
        if(this.state.isEdit){
          console.log('12212');
          let value =  window.sessionStorage.getItem('carousel');
          let obj = JSON.parse(value);
          console.log('value',obj);
          let url
          if(ChooseUrl==1){
            url = PictrueUrl + obj.pictureUrl;
          }else{
            url = API_FILE_VIEW_INNER+obj.pictureUrl;
          }
          this.setState({
            fileList:[{
              uid: -1,
              name: 'xxx.png',
              status: 'done',
              url:url,
            }],
          });
          this.setState({
            type: obj.type.toString(),
            isEnabled: obj.isEnabled.toString(),
          });
          this.props.form.setFieldsValue({
            source: obj.source,
            pictureUrl: obj.pictureUrl,
            showIndex: obj.showIndex && obj.showIndex.toString(),
          });
        } else if(this.state.isCheck){
          console.log('12212');
          let value =  window.sessionStorage.getItem('carousel');
          let obj = JSON.parse(value);
          console.log('value',obj);
          let url = obj.pictureUrl;
          this.setState({
            fileList:[{
              uid: -1,
              name: 'xxx.png',
              status: 'done',
              url:url,
            }],
          });
          this.setState({
            type: obj.type.toString(),
            isEnabled: obj.isEnabled.toString(),
          });
          this.props.form.setFieldsValue({
            source: obj.source,
            pictureUrl: obj.pictureUrl,
            showIndex: obj.showIndex && obj.showIndex.toString(),
          });
        } else{
          console.log('13231');
          this.setState({
            type:'1',
            isEnabled:'false',
          });
        }
      });
    }
    );

  }
  handleSubmit = e => {
    e.preventDefault();
    let value =  window.sessionStorage.getItem('carousel');
    let obj = JSON.parse(value);

    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.pictureUrl = this.state.imageUrl;
        console.log('Received values of form: ', values);
        if(this.state.isEdit){
          console.log('type',this.state.type);
          values.id = obj.id;
          if(this.state.updateKey == '0' && this.state.type !='3') {
            values.sourceId = obj.sourceId;
            values.title = obj.title;
            values.categoryId = obj.categoryId;
          } else if(this.state.updateKey != '0' && this.state.type !='3'){
            values.sourceId = this.state.sourceId;
            values.title = this.state.title;
            values.categoryId = this.state.categoryId;
          } else{
            values.sourceId = '';
            values.title = '';
            values.categoryId = '';
          }
          postService(ServiceApi + 'services/system/loopPicture/update',values, data => {
            if (data.retCode == 1) {
              Message.success('修改成功');
              history.back();
            }
          });
        }else{
          values.sourceId = this.state.sourceId;
          values.title = this.state.title;
          values.categoryId = this.state.categoryId;
          postService(ServiceApi + 'services/system/loopPicture/insert',values, data => {
            console.log('-----------------');

            //values.setAttribute('categoryId','666');
            console.log('Received values of form: ', values);
            /*values.setAttribute('createUserId','111');
                      values.setAttribute('createDate','2018-05-28 17:13:55');
                      values.setAttribute('lastUpdateUserId','111');
                      values.setAttribute('lastUpdateDate','2018-05-28 17:13:55');*/
            if (data.retCode == 1) {
              Message.success('新增成功');
              history.back();
            }
          });
        }
      }
    });
  };

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
  //子组件往父组件传输imageUrl
    normFile = (e) => {
      console.log('Upload event:', e);
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
    console.log('123',info.file.status);
    if (info.file.status == 'uploading') {
      this.setState({ fileList :info.fileList});
    }
    if (info.file.status === 'done') {
      this.setState({
        previewImage:`${info.file.response.entity[0].filePath}`,
        imageUrl:`${info.file.response.entity[0].filePath}`,
      });
      this.setState({ fileList :info.fileList});
      message.success(`${info.file.name} 上传成功。`);
    }else if(info.file.status === 'error'){
      message.error(`${info.file.name} 上传失败。`);
    }
    /*this.state.fileList.url = this.state.imageUrl;*/
    if (info.file.status == 'removed') {
      this.setState({ fileList :info.fileList});
    }
  };

  onChange = (e) => {
    console.log('radio checked', e.target.value);
    if(e.target.value == 1){
      this.setState({
        lab: '相关资讯地址',
        btn: <Button className="add resetBtn" disabled={this.state.isCheck}>添加资讯</Button>,
      });
    } else if(e.target.value == 2){
      this.setState({
        lab: '相关活动地址',
        btn: <Button className="add resetBtn" disabled={this.state.isCheck}>添加活动</Button>,
      });
    } else if(e.target.value == 3){
      this.setState({
        lab: '相关链接地址',
        btn: <Button style={{visibility:'hidden'}} className="add resetBtn" disabled={this.state.isCheck}>添加活动</Button>,
      });
    } else if(e.target.value == 4){
      this.setState({
        lab: '相关杂志地址',
        btn: <Button className="add resetBtn" disabled={this.state.isCheck}>添加杂志</Button>,
      });
    }
    this.setState({
      value: e.target.value,
    });
  }

  onRelationChange=(e)=>{
    console.log('选择的值', e.target.value);
    this.props.form.setFieldsValue({ source:''});
    this.setState({ type: e.target.value});
  }

  //关联类型输入框输入值的变化
  handleInput = (e, url, type) => {
    this.props.getData(ServiceApi + `${url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=${type}_S_LK=${e.target.value}`);
  }

  getDetailByTypeId=(id)=>{
    switch (id) {
    case '1':
      return { url: 'services/news/artical/newsList/get', code: 'title', desp: '文章', qilter:'Q=onlineState_S_EQ=1&&Q=type_I_NE=6'};
    case '2':
      return { url: 'services/activity/activity/list', code: 'name', desp: '活动', qilter: 'Q=status_I_EQ=1'};
    case '3':
      return { url: '', code: '', desp: '链接', qilter:''};
    case '4':
      return {
        url: 'services/news/magazine/article/list', code: 'title', desp: '杂志', qilter:''};
    default:
      return{url:'',code:'',desp:'',qilter:''};
    }
  }

  handleAddModalOK=()=>{
    console.log('确定',this.props.selectRowsData);
    let url = '';
    let sourceId = '';
    let title = '';
    let categoryId = '';
    let selectRowsData = this.props.selectRowsData[0];
    console.log('selectRowsData',selectRowsData);
    switch (this.state.type) {
    case '1':
      url = `http://www.urlgenerator.com?objectType=1&type=${selectRowsData.type}&isAtlas=${selectRowsData.isatlas}&id=${selectRowsData.id}`;
      sourceId = selectRowsData.id;
      if(selectRowsData.title) {
        title = selectRowsData.title;
      }
      if(selectRowsData.categoryid) {
        let category = selectRowsData.categoryid.toString().split(',');
        categoryId = category[category.length - 1];
      }
      break;
    case '2':
      url = `http://www.urlgenerator.com?objectType=2&type=${selectRowsData.typeId}&id=${selectRowsData.id}`;
      sourceId = selectRowsData.id;
      if(selectRowsData.name) {
        title = selectRowsData.name;
      }
      if(selectRowsData.categoryId) {
        let category = selectRowsData.categoryId.toString().split(',');
        categoryId = category[category.length - 1];
      }
      break;
    case'4':
      url = `http://www.urlgenerator.com?objectType=5&id=${selectRowsData.id}`;
      sourceId = selectRowsData.id;
      if(selectRowsData.title) {
        title = selectRowsData.title;
      }
      break;
    default:
      break;
    }
    this.props.form.setFieldsValue({ source:url});
    this.setState({
      showAddModal:'0',
      sourceId: sourceId,
      title: title,
      categoryId: categoryId,
      updateKey: this.state.updateKey + 1,
    });
  }

  getUrlByTypeId=(id)=>{
    switch (id) {
    case '1':
      return 'url1';
    case '2':
      return 'url2';
    case '4':
      return 'url4';
    default:
      break;
    }
  }
  getCodeByTypeId = (id) => {
    switch (id) {
    case '1':
      return 'imformation';
    case '2':
      return 'activity';
    case '3':
      return 'link';
    case '4':
      return 'magazine';
    default:
      break;
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>);

    const { fileList, showAddModal } = this.state;
    const { typeOption, isEnabled, type, isCheck } = this.state;
    let value =  window.sessionStorage.getItem('carousel');
    let obj = JSON.parse(value);
    console.log('value',obj);
    let pictureUrl;
    if(obj != null) {
      pictureUrl = obj.pictureUrl;
    }

    //console.log('pictureUrl',pictureUrl);
    const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 16 } };
    const props = {
      showUploadList: false,
      accept: 'image/*',
      name: 'file',
      headers: {
        authorization: 'authorization-text',
      },
    };

    let url = this.getDetailByTypeId(showAddModal).url;
    let qilter = this.getDetailByTypeId(showAddModal).qilter;
    let typeCode = this.getDetailByTypeId(showAddModal).code;

    return <Form onSubmit={this.handleSubmit} className="CarouselDetail">


      <div>
        <FormItem {...formItemLayout} label="关联类型" style={{ display: ['2'] ? ['2'].some(_ => _==='1')?'none':'block':'block'}}>
          {getFieldDecorator('type', {
            initialValue: type,
            rules: [
              {
                required: false,
                whitespace: true,
                message: '必填项',
              },
            ],
          })(
            <RadioGroup
              disabled={isCheck}
              options={[
                { label: '文章', value: '1' },
                { label: '活动', value: '2' },
                { label: '链接', value: '3' },
                { label: '杂志', value: '4' },
              ]}
              onChange={this.onRelationChange}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={'相关' +`${this.getDetailByTypeId(type).desp}`+ '地址'} style={{ display: ['2'] ? ['2'].some(_ => _==='1')?'none':'block':'block'}}>
          {getFieldDecorator('source', {
            initialValue: '',
            rules: [
              {
                required: false,
                whitespace: true,
                message: '必填项',
              },
            ],
          })(
            <Input className="input1" readOnly={type!=='3'?true:false}/>
          )}
          {type!=='3'?<Button style={{marginLeft:'5px'}} disabled={isCheck} onClick={()=>this.setState({showAddModal:type})
          } >添加{this.getDetailByTypeId(type).desp}</Button>:null}
        </FormItem>
      </div>


      <FormItem {...formItemLayout} label="轮播图片" >
        {getFieldDecorator('pictureUrl', {
          valuePropName: 'filelist',
          getValueFromEvent: this.normFile,
          rules: [{ required: true, message: '*必填项'}],
        })(
          !isCheck ? (
            <Upload
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
              {ChooseUrl==1?<Button onClick={() => this.setState({ previewVisible: true, previewImage: PictrueUrl + pictureUrl})}>查看</Button>:
              <Button onClick={() => this.setState({ previewVisible: true, previewImage:API_FILE_VIEW_INNER+pictureUrl})}>查看</Button>
              }
              
            </div>

          )
        )
        }
      </FormItem>
      <FormItem {...formItemLayout} label="显示顺序">
        {getFieldDecorator('showIndex',
          {
            initialValue: '',
            rules: [{ pattern: new RegExp('^[0-9]+$'), message: '请使用数字表示显示顺序！', max:9 }, { required: false, message:'最长9个字符！', max:9 }],
          }
        )(<Input disabled={isCheck}/>)}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="是否启用"
      >
        {
          getFieldDecorator('isEnabled',{
            initialValue:isEnabled,
            rules: [{ required: true, whitespace: true, message: '*必填项' }],
          })
          (
            <RadioGroup  disabled={isCheck} >
              <Radio value="true">是</Radio>
              <Radio value="false">否</Radio>
            </RadioGroup>
          )
        }
      </FormItem>
      <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
      </Modal>
      <Modal
        title={`添加${this.getDetailByTypeId(type).desp}`}
        visible={this.state.showAddModal!=='0'?true:false}
        cancelText="取消"
        okText="添加"
        onOk={this.handleAddModalOK}
        onCancel={() => this.setState({ showAddModal:'0'})
        }
        destroyOnClose={true}
      >
        <FormAndInput
          columns={type==='4'?[
            {
              title: '所属系列',
              dataIndex: 'series',
              key: 'series',
            },
            {
              title: '期刊名称',
              dataIndex: 'magazineName',
              key: 'magazineName',
            },
            {
              title: '期数',
              dataIndex: 'periods',
              key: 'periods',
            },
            {
              title: '标题',
              dataIndex: 'title',
              key: 'title',
            },
          ]:[
            {
              title: 'ID',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '标题',
              dataIndex: type==='1'?'title':'name',
              key: type === '1' ? 'title' : 'name',
            },
            {
              title: '创建时间',
              dataIndex: type==='2'?'createDate':'createdate',
              key: type === '2' ? 'createDate' : 'createdate',
            },
          ]}
          url={url}
          qfilter={qilter}
          onSearch={e => this.handleInput(e, url, typeCode, qilter)}
        />
      </Modal>
      <Row style={{paddingLeft:'30%'}}>
        <Button className="resetBtn" onClick={() => history.back()}>返回</Button>
        <Button htmlType="submit" className="queryBtn" type="primary" disabled={isCheck}>保存</Button>
      </Row>
    </Form>;
  }
}