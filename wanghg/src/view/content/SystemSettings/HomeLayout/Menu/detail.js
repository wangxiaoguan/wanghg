import React, { Component } from 'react';
import { Upload, Icon, message, Button, Form, Input, Select, Radio, Row, Col, Message, Spin, Modal } from 'antd';
import DynamicTree from '../../../../component/tree/DynamicTree';
import { GetQueryString, postService, getService } from '../../../myFetch';
import API_PREFIX, { masterUrl, API_FILE_UPLOAD,API_FILE_VIEW,API_CHOOSE_SERVICE,API_FILE_UPLOAD_INNER,API_FILE_VIEW_INNER} from '../../../apiprefix';
import TreeList from '../../../../component/tree/TreeList';
// import {departmentData } from '../../../../component/tree/departmentData';
import {setCheckTreeData} from'../../../../../redux-root/action/tree/tree';
import PicturesWall from '../upLoad.js';
import { connect } from 'react-redux';
// const masterUrl = 'http://10.110.200.62:9080/';
var uploadPicture
if(API_CHOOSE_SERVICE==1){
  uploadPicture = API_FILE_UPLOAD+'/menu';
}else{
  uploadPicture = API_FILE_UPLOAD_INNER;
}
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@Form.create()
@connect(
  state => ({ //取
    AllTreeData: state.tree.treeCheckData,
    selectDetail: state.tree.treeSelectData.selectDetail,
    selectTreeData: state.tree.treeSelectData.DynamicTree,
    loading:state.loading.loading,
  }),
  dispatch => ({ //存
    setCheckData: n => dispatch(setCheckTreeData(n)),
  })
)
export default class MenuDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayWarn:false,
      treeData: [],
      virtualGroupData:[],
      organizationData:[],
      partyOrganizationData:[],
      treeDataKey: 0,
      AllTreeData: this.props.AllTreeData,
      isEdit: eval(GetQueryString(location.hash, ['isEdit']).isEdit)||false,
      type:'1',
      parentId: '',
      isEnabled:'false',
      judge:false,
      imageUrl : window.sessionStorage.getItem('menu') ? JSON.parse(window.sessionStorage.getItem('menu')).icon : '',
      checkData: {
        column:[],
        department: [],
        partyid: [],
        virtual: [],
      },
      parentMenuOption: [],
      menuTypeOption: [],
      previewVisible: false,
      previewImage: '',
      fileList: [],
      isGet: 'true',
    };
  }
  componentWillUnmount(){
    // window.sessionStorage.removeItem('menu');
  }
  componentDidMount(){
    let value =  window.sessionStorage.getItem('menu'); 
    let obj = JSON.parse(value);
    console.log('---',obj);
    // debugger;
    let queryFilter = '';
    if(obj != null) {
      queryFilter = 'Q=id_S_NE=' + obj.id;
    }
    getService(API_PREFIX + `services/system/homepageMenu/list?${queryFilter}`, data => {
      if (data.retCode == 1) {
        console.log('parentMenu', data.root.list);
        let result = [];
        result.push({
          key: '0', desp: '无',
        });
        for (let index = 0; index < data.root.list.length; index++) {
          let node = data.root.list[index];
          let tmp = {};
          tmp.key = node.id + '';
          tmp.desp = node.name + '';
          result.push(tmp);
        }
        console.log('+++++result',result);
        this.setState({
          parentMenuOption: result,
        }, ()=>{
          console.log('after parentMenuOption',this.state.parentMenuOption);
          console.log("this.state.isEdit",this.state.isEdit)
          console.log('obj',obj)
          if(this.state.isEdit){
            let url = obj.icon;
            if(API_CHOOSE_SERVICE==1){
              this.setState({
                fileList:[{
                  uid: -1,
                  name: 'xxx.png',
                  status: 'done',
                  url:API_FILE_VIEW+url,
                }],
              });
            }else{
              this.setState({
                fileList:[{
                  uid: -1,
                  name: 'xxx.png',
                  status: 'done',
                  url:API_FILE_VIEW_INNER+url,
                }],
              });
            }

            console.log('checkbefore',this.state.checkData);
            let checkData = [];
            // checkData['column'] = [obj.categoryId];
            // checkData['department'] = eval(obj.depView);
            // checkData['virtual'] = eval(obj.groupView);
            // checkData['partyid'] = eval(obj.partyView);
            this.props.setCheckData({
              column: obj.categoryId?obj.categoryId.split(','):'',
              department: obj.depView?obj.depView.split(','):'',
              partyid: obj.partyView?obj.partyView.split(','):'',
              virtual: obj.groupView?obj.groupView.split(','):'',
              isCheck: false,//判断是否可选？true-选中？
            });
            console.log('value',checkData);
            this.setState({
              checkData,
              type: obj.type.toString(),
              isEnabled: obj.isEnabled.toString(),
              isGet: obj.isGet && obj.isGet.toString(),
              // pictureUrl: obj.icon,
            },()=>{
              console.log('check',this.state.checkData);
            });
            this.props.form.setFieldsValue({
              parentId: obj.parentId,
              name: obj.name,
              msgId: obj.msgId,
              icon: obj.icon,
              showIndex: obj.showIndex && obj.showIndex.toString(),
            });
          } else{
            console.log('13231');
            this.setState({
              parentId: '',
              type: '1',
              isEnabled: 'false',
              isGet: 'true',
              // pictureUrl: '',
            });
          }
        });
      }
    });
    getService(API_PREFIX + 'services/lookup/init/menuType', data => {
      let result = [];
      for (let index = 0; index < data.length; index++) {
        let node = data[index];
        node.key = node.code + '';
        node.desp = node.desp + '';
        result.push(node);
      }
      console.log('menuType', data);
      // console.log('menuType', result);
      this.setState({
        menuTypeOption: result,
      }, () => {
        console.log('ago', this.state.menuTypeOption);
      });
    });
    this.getTreeData();

  }
  /* componentDidMount() {
        this.getTreeData();
    }*/
  getTreeData = () => {
    let treeData = [];
    const cutStr = str => {
      // return str.match(/^[$]&/);
      let result = str.split(',');
      return result;
    };
    getService(
      API_PREFIX + 'services/system/cateogry/categoryList/get',
      data => {
        if (data.retCode === 1) {
          treeData = data.root.list;
          const DealData = data => {
            for (let index = 0; index < data.length; index++) {
              let node = data[index];
              node.key = node.id + '';
              node.disabled = node.categoryState === '0';
              node.department = node.department ? cutStr(node.department) : [];
              node.partyid = node.partyid ? cutStr(node.partyid) : [];
              node.virtualgroupid = node.virtualgroupid ? cutStr(node.virtualgroupid) : [];
              node.children = node.subCategoryList;
              if (node.subCategoryList) {
                DealData(node.subCategoryList);
              }
            }
          };
          DealData(treeData);
          this.setState({ treeData, treeDataKey: this.state.treeDataKey + 1 });
        }
      }
    );

    let virtualGroupData = [];
    getService(API_PREFIX + 'services/system/cateogry/group/tree', data => {
      if (data.retCode === 1) {
        virtualGroupData = data.root.list;
        this.setState({ virtualGroupData });
      }
    });

    let organizationData = [];
    getService(API_PREFIX + 'services/system/organization/organizationList/get',data=>{
      if (data.retCode === 1) {
        organizationData = data.root.list;
        const DealData = data => {
          for (let index = 0; index < data.length; index++) {
            let node = data[index];
            node.key = node.id + '';
            node.children = node.subOrganizationList;
            if (node.subOrganizationList) {
              DealData(node.subOrganizationList);
            }
          }
        };
        DealData(organizationData);
        this.setState({ organizationData});

      }
    });

    let partyOrganizationData = [];
    getService(API_PREFIX +'services/system/partyOrganization/partyOrganizationList/get',data=>{
      if (data.retCode === 1) {
        partyOrganizationData = data.root.list;
        const DealData = data => {
          for (let index = 0; index < data.length; index++) {
            let node = data[index];
            node.key = node.id + '';
            node.children = node.partyOrganizationList;
            if (node.partyOrganizationList) {
              DealData(node.partyOrganizationList);
            }
          }
        };
        DealData(partyOrganizationData);
        this.setState({ partyOrganizationData });
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    let value =  window.sessionStorage.getItem('menu');
    let obj = JSON.parse(value);
   
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { checkData } = this.state;
        console.log('选中的树中的数据是：', checkData);
        if ((checkData.department.length === 0 || !checkData.department)&&
              (checkData.partyid.length === 0 || !checkData.partyid)&&
              (checkData.virtual.length === 0 || !checkData.virtual)
        ) {
          this.setState({displayWarn: true});
          // return;
        }

        values.icon = this.state.imageUrl;
        values.categoryId = checkData.column.toString();
        values.depView = checkData.department.toString();
        values.partyView = checkData.partyid.toString();
        values.groupView = checkData.virtual.toString();
        values.groupView = checkData.virtual.toString();
        console.log('Received values of form: ', values);
        if(this.state.isEdit){
          // values['categoryView']= this.props.selectTreeData[0]; //对象的2种写法
          values.id = obj.id;
          postService(API_PREFIX + 'services/system/homepageMenu/update',values, data => {
            if (data.retCode == 1) {
              Message.success('修改成功');
              history.back();
            }
          });
        }else{
          // values['parentId']= 0;
          // values['categoryId']= 222;
          postService(API_PREFIX + 'services/system/homepageMenu/insert',values, data => {
            // values.setAttribute('createUserId','111');
            // values.setAttribute('createDate','2018-05-28 17:13:55');
            // values.setAttribute('lastUpdateUserId','111');
            // values.setAttribute('lastUpdateDate','2018-05-28 17:13:55');
            if (data.retCode == 1) {
              Message.success('新增成功');
              history.back();
            }
          });
        }
      }
    });
  };
  /*beforeUpload = (file, fileList) => {
    console.log('file', file);
    console.log('filelist', fileList);
    const isJPG = file.type === 'image/jpeg';
    this.setState({ image: file });

    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return false;
  }*/
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

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('props',nextProps.AllTreeData,prevState.AllTreeData);
    if (nextProps.AllTreeData !== prevState.AllTreeData) {
      let checkData = { ...prevState.checkData };
      checkData = { ...checkData, ...nextProps.AllTreeData };
      // let judge = prevState.checkData.department.length > 0 || prevState.checkData.partyid.length > 0 || prevState.checkData.virtualgroupid.length > 0;
      return { checkData, AllTreeData: nextProps.AllTreeData };
    }
    return null;
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
        previewImage:masterUrl +`${info.file.response.entity[0].filePath}`,
        imageUrl:masterUrl +`${info.file.response.entity[0].filePath}`,
      });
      this.setState({ fileList :info.fileList});
      message.success(`${info.file.name} 上传成功。`);
    }else if(info.file.status === 'error'){
      message.error(`${info.file.name} 上传失败。`);
    }
    if (info.file.status == 'removed') {
      this.setState({ fileList :info.fileList});
    }
    /*this.state.fileList.url = this.state.imageUrl;*/

  };
  render() {
    //获取数据
    console.log('displayWarn',this.state.department);
    console.log('displayWarn2',this.state.partyOrganization);
    console.log('displayWarn3',this.state.virtualGroup);
    console.log('多棵树勾选的值，根据type区分',this.state.checkData);
    const { previewVisible, previewImage, fileList, isGet } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>);
    const { parentMenuOption, parentId, menuTypeOption, type, pictureUrl, isEnabled, virtualGroupData, organizationData, treeData, treeDataKey, checkData, partyOrganizationData } = this.state;
    console.log('render',menuTypeOption);
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const formItemLayout1 = { labelCol: { span: 3 }, wrapperCol: { span: 16 } };
    const props = {
      showUploadList: false,
      accept: 'image/*',
      name: 'file',
      headers: {
        authorization: 'authorization-text',
      },
    };
    console.log('parentid',parentId);
    return <Form onSubmit={this.handleSubmit} style={{marginTop:'25px'}}>
      <Row>
        <Col span="8">
          <FormItem {...formItemLayout} label="父级菜单">
            {getFieldDecorator('parentId', {
              initialValue: this.state.parentId,
              rules: [{ required: true, whitespace: true, message: '*必填项' }],
            })(<Select getPopupContainer={trigger => trigger.parentNode}>
              { parentMenuOption && parentMenuOption.map((value)=>{
                return (<Option key={value.key} value={value.key}>{value.desp}</Option>);
              })}
            </Select>)}
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem {...formItemLayout} label="菜单名称">
            {getFieldDecorator('name', {
              initialValue: '',
              rules: [{ required: true, whitespace: true, message: '*必填项,最长32个字符！', max:32 }],
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
            {...formItemLayout}
            label="菜单类型"
          >
            {
              getFieldDecorator('type',{
                initialValue: type,
                rules: [{ required: true, whitespace: true, message: '*必填项' }],
              })
              (
                <RadioGroup onChange={e => this.setState({ type:e.target.value})} >
                  { menuTypeOption && menuTypeOption.map((value)=>{
                    return (<Radio value={value.key}>{value.desp}</Radio>);
                  })}
                </RadioGroup>
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem
            {...formItemLayout}
            label="是否需要访问接口" style={{ display: type==='2'?'block':'none'}}
          >
            {
              getFieldDecorator('isGet',{
                initialValue: isGet,
                rules: [{ required: true, whitespace: true, message: '*必填项' }],
              })
              (
                <RadioGroup onChange={e => this.setState({ isGet:e.target.value})}
                  options={[
                    { label: '是', value: 'true' },
                    { label: '否', value: 'false' },
                  ]}
                />
              )
            }
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem {...formItemLayout} label= {(isGet==='true')?'接口ID':'访问地址'} style={{ display: type!=='3'?'block':'none'}} >
            {getFieldDecorator('msgId', {
              initialValue: '',
              rules: [{ required: false, whitespace: true, message: '最长255个字符！', max:255 }],
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem {...formItemLayout} label="显示顺序">
            {getFieldDecorator('showIndex', {
              initialValue: '',
              rules: [{ pattern: new RegExp('^[0-9]+$'), message: '请使用数字表示显示顺序！', max:9 }, { required: false, message:'*必填项,最长9个字符！', max:9 }],
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
            {...formItemLayout}
            label="是否启用"
          >
            {
              getFieldDecorator('isEnabled',{
                initialValue: isEnabled,
                rules: [{ required: true, whitespace: true, message: '*必填项' }],
              })
              (
                <RadioGroup  >
                  <Radio value="true">是</Radio>
                  <Radio value="false">否</Radio>
                </RadioGroup>
              )
            }
          </FormItem>
        </Col>
      </Row>
      <FormItem {...formItemLayout1} label="菜单图标">
        {getFieldDecorator('icon', {
          valuePropName: 'filelist',
          getValueFromEvent: this.normFile,
          rules: [{ required: true, message: '*必填项'}],
        })(
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
        )
        }
      </FormItem>
      <FormItem
        {...formItemLayout1}
        label="关联栏目"
      >
        {
          getFieldDecorator('categoryId',{ initialValue : '' })
          ( <div style={{display:"flex"}}>
            <TreeList treeData={treeData} checkable type="column"
              // defaultCheckedKeys={categoryId}
              checkedKeys={checkData ? checkData.column : []}
              /*onSelect={()=>this.setState({displayWarn:false})}*/ />
            <a style={{marginLeft:"10px",height:"25px"}} className="operation" onClick={() => location.hash = '/SystemSettings/ColumnManagement?back=1' }>栏目管理</a>
          </div>
          )
        }
      </FormItem>
      
      <div>
        <Spin spinning={this.props.loading}>
          {/*<DynamicTree
            externalData={checkData}
            treeData={treeData}
            key={treeDataKey}
            rootDisable={true}
            addUrl={'services/system/cateogry/addCategory'}
            updateUrl={'services/system/cateogry/update'}
            deleteUrl={'services/system/cateogry/deleteCategoryById'}
            stopUrl={'services/system/cateogry/changeCategoryState/stop'}
            startUrl={'services/system/cateogry/changeCategoryState/start'}
          >*/}
          <div className="data-weight">
            <p style={{ margin: '20px 0' }}>
              {/* <span style={{ color: '#ff0000' }}>*</span> */}
              <span>数据鉴权:</span>
              {/* <div style={{display:this.state.displayWarn?'block':'none',color:'red'}} >
                <span>*必填项，必须选择某一发布范围</span>
              </div> */}
              {/* <span
                style={{
                  display: judge ? 'none' : 'inline-block',
                  color: 'red',
                }}
              >
                请选择任一项目
              </span> */}
            </p>
            <div
              className="trees"
              //style={{ border: judge ? 'none' : '1px solid red' }}
            >
              <div className="single-tree">
                <span className="location-span">选择部门</span>
                <div style={{display:"flex"}}>
                  <TreeList
                    type="department"
                    treeData={organizationData}
                    checkable
                    // defaultCheckedKeys={depView}
                    checkedKeys={checkData ? checkData.department : []}
                    /*disabled={this.props.selectTreeData&& this.props.selectTreeData.length>0?false:true}*/
                  /> 
                  <a
                    style={{marginLeft:"10px",marginTop:"5px",height:"25px"}}
                    className="location-btn operation"
                    onClick={() => (location.hash = '/SystemSettings/Department')}
                  >
                      部门管理
                  </a>
                </div>
              </div>

              <div className="single-tree">
                <span className="location-span">选择党组织</span>
               <div style={{display:"flex"}}>
                <TreeList
                  type="partyid"
                  treeData={partyOrganizationData}
                  checkable
                  // dafaultCheckedKeys={partyView}
                  checkedKeys={checkData ? checkData.partyid : []}
                  /*disabled={this.props.selectTreeData && this.props.selectTreeData.length > 0 ? false : true}*/
                /> 
                <a
                  style={{marginLeft:"10px",marginTop:"5px",height:"25px"}}
                  className="location-btn operation"
                  onClick={() =>
                    (location.hash = '/SystemSettings/PartyOrganization')
                  }
                >
                    党组织管理
                </a>
                </div>
              </div>

              <div className="single-tree">
                <span className="location-span">选择虚拟群组</span>
                <div style={{display:"flex"}}>
                <TreeList
                  type="virtual"
                  treeData={virtualGroupData}
                  checkable
                  // dafaultCheckedKeys={groupView}
                  checkedKeys={checkData ? checkData.virtual : []}
                  /*disabled={this.props.selectTreeData && this.props.selectTreeData.length > 0 ? false : true}*/
                />
                <a
                  style={{marginLeft:"10px",marginTop:"5px",height:"25px"}}
                  className="location-btn operation"
                  onClick={() =>
                    (location.hash = '/SystemSettings/VirtualGroup')
                  }
                >
                    虚拟群组管理
                </a>
                </div>
              </div>
            </div>
          </div>
          {/*</DynamicTree>*/}
        </Spin>
      </div>
      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal> 
      <Button style={{marginLeft:'40%',marginBottom:'100px'}} className="resetBtn" onClick={() => history.back()}>返回</Button>
      <Button htmlType="submit" className="queryBtn" type="primary">保存</Button>
    </Form>;
  }
}