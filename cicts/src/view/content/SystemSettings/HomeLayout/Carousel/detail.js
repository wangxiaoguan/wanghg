import React, { Component } from 'react';
import { Upload, Icon, Message, Button, Form, Input, Select, Row, Radio, Col, message, Modal } from 'antd';
import { GetQueryString, postService, getService } from '../../../myFetch';
import API_PREFIX, {API_FILE_VIEW,API_FILE_UPLOAD,API_CHOOSE_SERVICE,API_FILE_UPLOAD_INNER,API_FILE_VIEW_INNER } from '../../../apiprefix';
import PicturesWall from '../upLoad.js';
import FormAndInput from'../../../../component/table/FormAndInput';
import './CarouselDetail.less';
// const masterUrl = 'http://10.110.200.62:9080/';
let uploadPicture;
if(API_CHOOSE_SERVICE==1){
  uploadPicture = API_FILE_UPLOAD+'/carousel';
}else{
  uploadPicture = API_FILE_UPLOAD_INNER;
}
import { connect } from 'react-redux';
import { BEGIN,getPageData } from '../../../../../redux-root/action/table/table';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@connect(state => ({
  pageData: state.table.pageData,              //封装表格分页查询条件数据
  selectRowsData: state.table.selectRowsData,  //封装表格选择数据
}),
dispatch => ({
  getData: n => dispatch(BEGIN(n)),
  getPageData:n=>dispatch(getPageData(n)), // wkjj 2019.1.16 每次查询时初始缓冲里面的页码为默认值
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
      sourceType:'1',
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
      parentId: '0',
      isDisabled: false,
      qfilter:'Q=onlineState_S_EQ=1&Q=type_S_NI=3,4',
      txt:'',
      code:'title',
      ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW, //根据登陆人员来获取oss地址
    };
  }

  componentWillUnmount(){
    window.sessionStorage.removeItem('carousel');
  }

  componentDidMount(){

    getService(API_PREFIX + 'services/web/config/homepageMenu/getList/1/20', data => {
      if( data.status===1){
        console.log(data);
        let value =  window.sessionStorage.getItem('carousel'); 
        let obj = JSON.parse(value);
        let MenuOptions=[];
        MenuOptions.push({
          key: '0', desp: '无',
        });
        for (let index = 0; index < data.root.list.length; index++) {
          let node = data.root.list[index];
          let tmp = {};
          if(node.name!='无'){
            tmp.key = node.id + '';
            tmp.desp = node.menuName + '';
            MenuOptions.push(tmp);
          }
        }
        this.setState({
          parentMenuOption: MenuOptions,
        });
       if(this.state.isEdit || this.state.isCheck){
        if(obj.sourceType&&obj.sourceType==1){//文章
          obj.sourceType=1;
        }else if(obj.sourceType&&obj.sourceType==2){//活动
          obj.sourceType=2;
        }else if(obj.sourceType&&obj.sourceType==3){//杂志
          obj.sourceType=4;
        }else if(obj.sourceType&&obj.sourceType==4){//专题
          obj.sourceType=5;
        }else if(obj.sourceType&&obj.sourceType==5){//视频
          obj.sourceType=6;
        }
         this.props.form.setFieldsValue({
          parentId: obj.parentId,
         showIndex: obj.showIndex && obj.showIndex.toString(),
         isEnabled: obj.isEnabled && obj.isEnabled.toString(),
         sourceType: obj.sourceType && obj.sourceType.toString(),
         pictureUrl: obj.pictureUrl && obj.pictureUrl.toString(),
       
        });
        }
        // this.setState({
        //   fileList:[{
        //     uid: -1,
        //     name: 'xxx.png',
        //     status: 'done',
        //     url:obj.pictureUrl,
        //   }],
        // });
      }else{
        message.error(data.errorMsg);
      }
    });


    getService(API_PREFIX + 'services/web/lookup/init/relateType', data => {
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
          let url;
          if(API_CHOOSE_SERVICE==1){
            url = this.state.ossViewPath + obj.pictureUrl;
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
          if(obj.sourceType&&obj.sourceType==1){//文章
            obj.sourceType=1;
          }else if(obj.sourceType&&obj.sourceType==2){//活动
            obj.sourceType=2;
          }else if(obj.sourceType&&obj.sourceType==3){//杂志
            obj.sourceType=4;
          }else if(obj.sourceType&&obj.sourceType==4){//专题
            obj.sourceType=5;
          }else if(obj.sourceType&&obj.sourceType==5){//视频
            obj.sourceType=6;
          }
          this.setState({
            type: obj.sourceType.toString(),
            isEnabled: obj.isEnabled.toString(),
          });
          this.props.form.setFieldsValue({
            pictureSource: obj.pictureSource,
            pictureUrl: obj.pictureUrl,
            showIndex: obj.showIndex && obj.showIndex.toString(),
            isEnabled: obj.isEnabled? obj.isEnabled.toString():'false',
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
            type: obj.pictureSource.toString(),
            isEnabled: obj.isEnabled.toString(),
          });
          this.props.form.setFieldsValue({
            pictureSource: obj.pictureSource,
            pictureUrl: obj.pictureUrl,
            showIndex: obj.showIndex && obj.showIndex.toString(),
            isEnabled: obj.isEnabled ? obj.isEnabled.toString():'false',
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
    console.log(obj);

    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.pictureUrl = this.state.imageUrl;
        console.log('Received values of form: ', values);
        if(this.state.isEdit){
          console.log('type',this.state.type);
          values.id = obj.id;
          if(this.state.updateKey == '0' && this.state.type !='3') {
            values.sourceId = obj.sourceId;
            values.pictureTitle = obj.pictureTitle;
            values.categoryId = obj.categoryId;
            values.pictureSource = obj.pictureSource;
          } else if(this.state.updateKey != '0' && this.state.type !='3'){
            values.sourceId = this.state.sourceId;
            values.pictureTitle = this.state.title;
            values.categoryId = this.state.categoryId;
          } else{
            values.sourceId = '';
            values.pictureTitle = '';
            values.categoryId = '';
          }
        if(values.type==5||values.type==6){
          values.type=1;    
        }
        if(values.isEnabled === "true"){
          values.isEnabled === true;
        }
        if(values.sourceType==='1'){//文章
          values.sourceType='1';
        }else if(values.sourceType==='2'){//活动
          values.sourceType='2';
        }else if(values.sourceType==='4'){//杂志
          values.sourceType='3';
        }else if(values.sourceType==='5'){//专题
          values.sourceType='4';
        }else if(values.sourceType==='6'){//视频
          values.sourceType='5';
        }
        console.log("更新前",values);
        console.log("更新前",values.isEnabled);
        postService(API_PREFIX + 'services/web/config/loopPicture/update',values, data => {
            console.log("22222222222222222222222222222222222222222222222222222222",values);
            if (data.status == 1) {
              message.success('修改成功');
              history.back();
            }
          });
        }else{
          values.sourceId = this.state.sourceId;
          values.pictureTitle = this.state.title;
          values.categoryId = this.state.categoryId;
          if(values.sourceType==='1'){//文章
            values.sourceType='1';
          }else if(values.sourceType==='2'){//活动
            values.sourceType='2';
          }else if(values.sourceType==='4'){//杂志
            values.sourceType='3';
          }else if(values.sourceType==='5'){//专题
            values.sourceType='4';
          }else if(values.sourceType==='6'){//视频
            values.sourceType='5';
          }
          postService(API_PREFIX + 'services/web/config/loopPicture/add',values, data => {
            console.log('-----------------');

            //values.setAttribute('categoryId','666');
            console.log('Received values of form: ', values);
            /*values.setAttribute('createUserId','111');
                      values.setAttribute('createDate','2018-05-28 17:13:55');
                      values.setAttribute('lastUpdateUserId','111');
                      values.setAttribute('lastUpdateDate','2018-05-28 17:13:55');*/
            if (data.status === 1) {
              message.success('新增成功');
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
    console.log('123',info);
    if (info.file.status == 'uploading') {
      this.setState({ fileList :info.fileList,isDisabled:true});
    }
    if (info.file.status === 'done') {
      this.setState({
        previewImage:`${info.file.response.root.object[0].filePath}`,
        imageUrl:`${info.file.response.root.object[0].filePath}`,
        isDisabled:true,
      });
      this.setState({ fileList :info.fileList});
      message.success(`${info.file.name} 上传成功。`);
      this.setState({isDisabled:false});
    }else if(info.file.status === 'error'){
      message.error(`${info.file.name} 上传失败。`);
      this.setState({isDisabled:false});
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
    let qilter = this.getDetailByTypeId(e.target.value).qilter;
    let code = this.getDetailByTypeId(e.target.value).code;
    this.setState({ type: e.target.value,qfilter:qilter,code});
    this.props.form.setFieldsValue({
      "pictureSource":"",
    })
  }

  //wkjj 2019.1.16 修改首页轮播图编辑轮播图分页不带条件查询
  //关联类型输入框输入值的变化
  handleInput=(e,url,type,qilter)=>{
    console.log(e.target.value,url,type,qilter);
    this.setState({txt:e.target.value});
    // let qfilter = e.target.value == '' ? '' : `Q=${type}_S_LK=${e.target.value}` 
    let qfilter =e.target.value? `${qilter}&Q=${type}=${e.target.value}` :`${qilter}`;
    this.setState({qfilter});
    this.props.getPageData({currentPage: 1, pageSize: 10, query: qfilter}); // 每次查询时初始缓冲里面的页码为默认值
    this.props.getData(API_PREFIX + `${url}/1/10?${qfilter}`);
    // this.props.getData(API_PREFIX + `${url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=${type}_S_LK=${e.target.value}`);
  }

  getDetailByTypeId=(id)=>{
    localStorage.setItem('selectedRowKeys','');
    switch (id) {
    case '1':
      return { url: 'services/web/news/article/newsList/get', code: 'title', desp: '文章', qilter:'Q=onlineState=1'};
    case '2':
      return { url: 'services/web/activity/enrolment/getList', code: 'activityName', desp: '活动', qilter: `Q=tenantId=${sessionStorage.getItem('tenantId')}&Q=status=1`};
    // case '3':
    //   return { url: 'services/news/video/newsList/get', code: '', desp: '视频', qilter:'Q=onlineState_S_EQ=1&Q=type_S_EQ=3'};
    case '4':
      return {
        url: 'services/web/news/magazine/article/getArticleByTitle', code: 'title', desp: '杂志', qilter:''};
    case '5':
    return {
      url: 'services/web/news/special/normal/getList', code: 'title', desp: '专题', qilter:`Q=tenantId=${sessionStorage.getItem('tenantId')}&Q=onlineState=1`};
    case '6':
    return { url: 'services/web/news/vedio/vedioList/get', code: 'title', desp: '视频', qilter:'Q=onlineState=1'};
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
    console.log('selectRowsData选择的数据',selectRowsData);
    console.log('type类型==》',this.state.type);
    switch (this.state.type) {
    case '1'://文章
      url = `http://www.urlgenerator.com?objectType=1&type=${selectRowsData.newsType}&isAtlas=${selectRowsData.isAtlas}&id=${selectRowsData.id}`;
      sourceId = selectRowsData.id;
      if(selectRowsData.title) {
        title = selectRowsData.title;
      }
      if(selectRowsData.categoryid) {
        let category = selectRowsData.categoryid.toString().split(',');
        categoryId = category[category.length - 1];
      }
      break;
    case '2'://活动
      url = `http://www.urlgenerator.com?objectType=2&type=${selectRowsData.typeId}&id=${selectRowsData.id}`;
      sourceId = selectRowsData.id;
      if(selectRowsData.activityName) {
        title = selectRowsData.activityName;
      }
      if(selectRowsData.categoryId) {
        let category = selectRowsData.categoryId.toString().split(',');
        categoryId = category[category.length - 1];
      }
      break;
    case'4'://杂志
      url = `http://www.urlgenerator.com?objectType=4&id=${selectRowsData.id}`;
      sourceId = selectRowsData.id;
      if(selectRowsData.title) {
        title = selectRowsData.title;
      }
      break;
      case '5'://专题
      url = `http://www.urlgenerator.com?objectType=3&type=${selectRowsData.type}&id=${selectRowsData.id}`;
      sourceId = selectRowsData.id;
      if(selectRowsData.title) {
        title = selectRowsData.title;
      }
      break;
      case '6'://视频
      url = `http://www.urlgenerator.com?objectType=1&type=${selectRowsData.newsType}&id=${selectRowsData.id}`;
      sourceId = selectRowsData.id;
      if(selectRowsData.title) {
        title = selectRowsData.title;
      }
      break;
    default:
      break;
    }
    this.props.form.setFieldsValue({ pictureSource:url});
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
  emptyTxt=(e)=>{
    this.setState({txt:''});
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
    const { typeOption, isEnabled, type, isCheck,parentMenuOption,code,txt } = this.state;
    let value =  window.sessionStorage.getItem('carousel');
    let obj = JSON.parse(value);
    console.log('value',obj);
    let pictureUrl;
    if(obj != null) {
      pictureUrl = obj.pictureUrl;
    }

    //console.log('pictureUrl',pictureUrl);
    const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 16 } };
    const formItemLayout1 = { labelCol: { span: 5 }, wrapperCol: { span: 11 } };
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
    if(txt){
      qilter=qilter+`&Q=${code}_S_LK=${txt}`;
    }
    return <Form onSubmit={this.handleSubmit} className="CarouselDetail">


      <div>
        <FormItem {...formItemLayout} label="关联类型" style={{ display: ['2'] ? ['2'].some(_ => _==='1')?'none':'block':'block'}}>
          {getFieldDecorator('sourceType', {
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
                { label: '杂志', value: '4' },
                { label: '专题', value: '5' },//xwx新增普通专题2019/4/17
                { label: '视频', value: '6' },//xwx新增视频2019/4/17
              ]}
              onChange={this.onRelationChange}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={'相关' +`${this.getDetailByTypeId(type).desp}`+ '地址'} style={{ display: ['2'] ? ['2'].some(_ => _==='1')?'none':'block':'block'}}>
          {getFieldDecorator('pictureSource', {
            initialValue: '',
            rules: [
              {
                required: true,
                whitespace: true,
                message: '必填项',
              },
            ],
          })(
            <Input className="input1" readOnly={type!=='3'?true:false} disabled={this.state.isCheck}/>
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
          !isCheck ?
           (
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
              {API_CHOOSE_SERVICE==1?<Button onClick={() => this.setState({ previewVisible: true, previewImage: this.state.ossViewPath +pictureUrl})}>查看</Button>:
              <Button onClick={() => this.setState({ previewVisible: true, previewImage:API_FILE_VIEW_INNER+pictureUrl})}>查看2</Button>
              }
              
            </div>

          )
        )
        }
      </FormItem>
      <FormItem {...formItemLayout1} label="显示顺序">
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
      <FormItem {...formItemLayout1} label="关联菜单">
        {getFieldDecorator('parentId', {
          initialValue: this.state.parentId,
          // rules: [{ required: true, whitespace: true, message: '*必填项' }],
        })(<Select disabled={this.state.isCheck}
            getPopupContainer={trigger => trigger.parentNode}>
          { parentMenuOption && parentMenuOption.map((value)=>{
            return (<Option key={value.key} value={value.key}>{value.desp}</Option>);
          })}
        </Select>)}
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
        afterClose={this.emptyTxt}
      >
        <FormAndInput
          columns={type==='4'?[//杂志
            {
              title: '所属系列',
              dataIndex: 'fieldName',
              key: 'fieldName',
            },
            {
              title: '期刊名称',
              dataIndex: 'name',
              key: 'name',
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
          ]:type=='5'?[//专题
            {
              title: 'ID',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '标题',
              dataIndex: 'title',
              key: 'title',
            },
            {
              title: '创建时间',
              dataIndex:'createDate',
              key:'createDate',
            },
          ]:type=='6'?[//视频
            {
              title: 'ID',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '标题',
              dataIndex: 'title',
              key: 'title',
            },
            {
              title: '创建时间',
              dataIndex:'createDate',
              key:'createDate',
            },
          ]:
          [//文章、活动
            {
              title: 'ID',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '标题',
              dataIndex: type==='1'?'title':'activityName',
              key: type === '1' ? 'title' : 'activityName',
            },
            {
              title: '创建时间',
              dataIndex:'createDate',
              key:'createDate',
            },
          ]}
          url={url}
          qfilter={qilter}
          // qfilter={this.state.qfilter}
          onSearch={e => this.handleInput(e, url, typeCode, qilter)}
        />
      </Modal>
      <Row style={{paddingLeft:'30%'}}>
        <Button className="resetBtn" onClick={() => history.back()}>返回</Button>
        {this.state.isCheck != true ?<Button 
        htmlType="submit" 
        className="queryBtn" 
        type="primary" 
        // disabled={isCheck}
        // disabled={this.state.isDisabled}
        >保存</Button> : null}
      </Row>
    </Form>;
  }
}