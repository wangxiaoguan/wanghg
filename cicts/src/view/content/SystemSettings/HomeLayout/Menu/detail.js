import React, { Component } from 'react';
import { Upload, Icon, Message, Button, Form, Input, Select, Radio, Row, Col, message, Spin, Modal } from 'antd';
import DynamicTree from '../../../../component/tree/DynamicTree';
import { GetQueryString, postService, getService } from '../../../myFetch';
import API_PREFIX, { masterUrl, API_FILE_UPLOAD,API_FILE_VIEW,API_CHOOSE_SERVICE,API_FILE_UPLOAD_INNER,API_FILE_VIEW_INNER} from '../../../apiprefix';
import TreeList from '../../../../component/tree/TreeList';
// import {departmentData } from '../../../../component/tree/departmentData';
import {setCheckTreeData} from'../../../../../redux-root/action/tree/tree';
import PicturesWall from '../upLoad.js';
import { connect } from 'react-redux';
import FormAndInput from '../../../../component/table/FormAndInput';
// const masterUrl = 'http://10.110.200.62:9080/';
let uploadPicture;
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
    getPageData:n=>dispatch(getPageData(n)),
    retSetData: n=>dispatch(getDataSource(n)),
    selectRowsData: state.table.selectRowsData,
    powers: state.powers,
  }),
  dispatch => ({ //存
    setCheckData: n => dispatch(setCheckTreeData(n)),
    getData: n => dispatch(BEGIN(n)),
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
      unionsData: [],
      treeDataKey: 0,
      AllTreeData: this.props.AllTreeData,
      isEdit: eval(GetQueryString(location.hash, ['isEdit']).isEdit)||false,
      id: GetQueryString(location.hash, ['id']).id ? GetQueryString(location.hash, ['id']).id : '',
      type:'1',
      parentId: '',
      isEnabled:'false',
      judge:false,
      imageUrl : window.sessionStorage.getItem('menu') ? JSON.parse(window.sessionStorage.getItem('menu')).menuIcon : '',
      // imageUrlB : '',
      checkData: {
        column:[],
        department: [],
        partyid: [],
        unionsId: [],
        virtual: [],
      },
      parentMenuOption: [],
      menuTypeOption: [],
      previewVisible: false,
      previewImage: '',
      fileList: [],
      // previewVisibleB: false,
      // previewImageB: '',
      // fileListB: [],
      isGet: 'true',
      isParent:false,
      relation: '1',
      showAddModal: '0',
      relationAddress:'',
    };
  }
  componentWillUnmount(){
    // window.sessionStorage.removeItem('menu');
  }
  componentDidMount(){
    let value =  window.sessionStorage.getItem('menu'); 
    let obj = JSON.parse(value);
    console.log('---',obj);
    if(this.state.isEdit) {
        this.getColumnAuth()
        getService(API_PREFIX + `services/web/config/homepageMenu/getHomepageMenu/${this.state.id}`, result => {
            if(result.status == 1) {
                let obj = result.root.object;
                let url = obj.menuIcon;
                let ossViewPath = sessionStorage.getItem('ossViewPath') || API_FILE_VIEW
                if(API_CHOOSE_SERVICE==1){
                    this.setState({
                    fileList:[{
                        uid: -1,
                        name: 'xxx.png',
                        status: 'done',
                        url:ossViewPath+url,
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
                let checkData = this.state.checkData;
                checkData['column'] = obj.categoryId;
                // checkData['department'] = obj.departments;
                // checkData['virtual'] = obj.groups;
                // checkData['partyid'] = obj.partys;
                
                this.props.setCheckData({
                    column: obj.categoryId,

                //   column: obj.categoryId?obj.categoryId.split(','):'',
                    // department: obj.departments&&obj.departments.length!==0?obj.departments:[],
                    // partyid: obj.partys&&obj.partys.length!==0?obj.partys:[],
                    // virtual: obj.groups&&obj.groups.length!==0?obj.groups:[],
                    // isCheck: false,//判断是否可选？true-选中？
                });
                console.log('value',checkData);
                this.setState({
                    checkData,
                    type: obj.menuType.toString(),
                    isEnabled: obj.isEnabled.toString(),
                    isGet: obj.isGet && obj.isGet.toString(),
                    // relationAddress:data.root.list[0].relationAddress&&data.root.list[0].relationAddress,
                //   relationAddress:data.root.list[0]&&data.root.list[0].relationAddress,
                    // pictureUrl: obj.icon,
                },()=>{
                    console.log('check',this.state.checkData);
                });
                this.props.form.setFieldsValue({
                    parentId: obj.parentId,
                    menuName: obj.menuName,
                    msgId: obj.msgId,
                    menuUrl: obj.menuUrl,
                    menuIcon: obj.menuIcon,
                    isGet:obj.isGet+'',
                    // bannericon:data.root.list[0].bannericon&&data.root.list[0].bannericon,
                //   bannericon:data.root.list[0]&&data.root.list[0].bannericon,
                    showIndex: obj.showIndex && obj.showIndex.toString(),
                    // relationType:data.root.list[0].relationType&&data.root.list[0].relationType,
                //   relationType:data.root.list[0]&&data.root.list[0].relationType,
                });
                
            }else {
                message.error(result.errorMsg);
            }
        });
    }else{
        this.setState({
            parentId: '',
            type: '1',
            isEnabled: 'false',
            isGet: 'true',
            // pictureUrl: '',
        });
    }
    // debugger;
    let noId = obj ? obj.id : 0;
    getService(API_PREFIX + `services/web/config/homepageMenu/getList/${noId}`, data => {
      if (data.status == 1) {
        console.log('parentMenu', data.root.object);
       
        let result = [];
        result.push({
          key: '0', desp: '全部',
        });
        for (let index = 0; index < data.root.object.length; index++) {
          let node = data.root.object[index];
          let tmp = {};
          tmp.key = node.id + '';
          tmp.desp = node.menuName + '';
          result.push(tmp);
        }
        console.log('+++++result',result);
        this.setState({
          parentMenuOption: result,
        }, ()=>{
          console.log('after parentMenuOption',this.state.parentMenuOption);
          console.log("this.state.isEdit",this.state.isEdit);
          console.log('obj',obj);
          
        });
      }
    });
    getService(API_PREFIX + 'services/web/lookup/init/menuType', res => {
        if(res.status == 1) {
            let data = res.root.object;
            let result = [];
            for (let index = 0; index < data.length; index++) {
                let node = data[index];
                node.key = node.code + '';
                node.desp = node.fieldName + '';
                result.push(node);
            }
            console.log('menuType', data);
            // console.log('menuType', result);
            this.setState({
                menuTypeOption: result,
            }, () => {
                console.log('ago', this.state.menuTypeOption);
            });
        } 
    });
    this.getTreeData();

  }
  /* componentDidMount() {
        this.getTreeData();
    }*/
    setColumnAuth = (data) => {
      let tenantId = window.sessionStorage.getItem("tenantId");
      let body = {
        dataId: data.id,
        dataType: 5,
        departments:data.departments,
        partys:data.partys,
        groups: data.groups,
        companyList: [],
        viewTenantId: [],
        partysJoin: [],
        departmentsJoin: [],
        groupsJoin: [],
        companyJoinList: [],
        unions:data.unions[0] ? data.unions : [],
        unionsJoin:[],
        joinTenantId: [],
      };
      if(!data.departments.length&&!data.partys.length&&!data.groups.length&&!data.unions[0]){
        body['viewTenantId'] =[tenantId]
      }

        postService(API_PREFIX + `services/web/auth/authdata/updAuthData`, body, data => {
          if (data.status === 1) {
            
          }
        });
    }
    getColumnAuth = () => {
        postService(API_PREFIX+`services/web/auth/authdata/getAllByDataId/${this.state.id}`,{},data=>{
          if(data.status===1){
            let obj = data.root.object;
            let checkData = this.state.checkData;
            checkData['department'] = obj.departments;
            checkData['virtual'] = obj.groups;
            checkData['partyid'] = obj.partys;
            checkData['unionsId'] = obj.unions
            
            this.props.setCheckData({
                department: obj.departments,
                partyid: obj.partys,
                virtual: obj.groups,
                unionsId: obj.unions,
                isCheck: false,
            });
            this.setState({checkData})
          }
        })
    }
  getTreeData = () => {
    let treeData = [];
    const cutStr = str => {
      // return str.match(/^[$]&/);
      let result = str.split(',');
      return result;
    };
    let powers = this.props.powers;
    let departmentPowers=powers && powers['20004.21501.000'];//部门树权限码
    let partyPower=powers && powers['20005.23002.003'];//党组织权限
    let virtualGroupPowers=powers && powers['20004.21505.000'];//虚拟树权限码
    let tradePowers = powers && powers['20007.21704.000']; //工会树权限码
    getService(
      API_PREFIX + 'services/web/config/category/getList?Q=categoryState=1',
      data => {
        if (data.status === 1) {
          treeData = data.root.object;
          const DealData = data => {
            for (let index = 0; index < data.length; index++) {
              let node = data[index];
              node.key = node.id + '';
              node.disabled = node.categoryState === '0';
            //   node.department = node.department ? cutStr(node.department) : [];
            //   node.partyid = node.partyid ? cutStr(node.partyid) : [];
            //   node.virtualgroupid = node.virtualgroupid ? cutStr(node.virtualgroupid) : [];
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

    let virtualGroupData = [];//虚拟圈树接口数据请求
    virtualGroupPowers ? getService(API_PREFIX + 'services/web/company/group/getGroupListTree', data => {
      if (data.status === 1) {

        data.root.object.map((item, index) => {
          if (item.name == '虚拟圈') {
            virtualGroupData.push(item);
            const DealData = data => {
              for (let index = 0; index < data.length; index++) {
                let node = data[index];
                node.key = node.id?node.id:'-1';
                node.id = node.id?node.id:'-1';
                node.children = node.subList;
                if (node.subList) {
                  DealData(node.subList);
                }
              }
            };
            DealData(virtualGroupData);
            this.setState({ virtualGroupData });
          }
        });
      }
    }): null

    let organizationData = [];//部门树接口数据请求
    departmentPowers ? getService(API_PREFIX + 'services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false',data=>{
      if (data.status === 1) {
        organizationData = data.root.object;
        const DealData = data => {
          for (let index = 0; index < data.length; index++) {
            let node = data[index];
            node.key = node.id + '';
            node.children = node.subCompanyOrgList;
            if (node.subCompanyOrgList) {
              DealData(node.subCompanyOrgList);
            }
          }
        };
        DealData(organizationData);
        this.setState({ organizationData});

      }
    }):null

    let partyOrganizationData = [];//党组织树接口请求
    partyPower ? getService(API_PREFIX +'services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1',data=>{
      if (data.status === 1) {
        partyOrganizationData = data.root.object;
        const DealData = data => {
          for (let index = 0; index < data.length; index++) {
            let node = data[index];
            node.name = node.partyName
            node.key = node.id + '';
            node.children = node.partyOrgList;
            if (node.partyOrgList) {
              DealData(node.partyOrgList);
            }
          }
        };
        DealData(partyOrganizationData);
        this.setState({ partyOrganizationData });
      }
    }) : null

    tradePowers ? getService(API_PREFIX + 'services/web/union/org/getUnionOrgList/0',data=>{ //工会树接口数据请求
        if (data.status === 1) {
            let unionsData = data.root.object;
            const DealData = data => {
                for (let index = 0; index < data.length; index++) {
                    let node = data[index];
                    node.key = node.id + '';
                    node.children = node.unionOrgList;
                    if (node.unionOrgList) {
                        DealData(node.unionOrgList);
                    }
                }
            };
            DealData(unionsData);
            this.setState({ unionsData});
  
        }
    }): null
  };

  handleSubmit = e => {
    e.preventDefault();
    let value =  window.sessionStorage.getItem('menu');
    let obj = JSON.parse(value);

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { checkData } = this.state;
        console.log('选中的树中的数据是：', checkData);
        // if ((checkData.department.length === 0 || !checkData.department)&&
        //       (checkData.partyid.length === 0 || !checkData.partyid)&&
        //       (checkData.virtual.length === 0 || !checkData.virtual)
        // ) {
        //   this.setState({displayWarn: true});
        //   // return;
        // }

        values.menuIcon = this.state.imageUrl;
        // values.bannericon = this.state.imageUrlB;

        values.categoryId = checkData.column;

        // values.categoryId = checkData.column&&checkData.column.toString();
        values.departments = checkData.department&&checkData.department.length!==0?checkData.department:[];
        values.partys = checkData.partyid&&checkData.partyid.length!==0?checkData.partyid:[];
        values.groups = checkData.virtual&&checkData.virtual.length!==0?checkData.virtual:[];
        values.unions = checkData.unionsId&&checkData.unionsId[0]?checkData.unionsId:[];
        // values.groupView = checkData.virtual.toString();
        console.log('Received values of form: ', values);
        
        if(this.state.isEdit){
          // values['categoryView']= this.props.selectTreeData[0]; //对象的2种写法
          if(values.departments===undefined&&values.groups===undefined&&values.partys===undefined){//传全部时，默认传tenantId
            values.viewTenantId=window.sessionStorage.getItem("tenantId");
          }
          values.id = obj.id;
          this.setColumnAuth(values)
          postService(API_PREFIX + 'services/web/config/homepageMenu/update',values, data => {
            if (data.status == 1) {
              message.success('修改成功');
              history.back();
            }
          });
        }else{
          // values['parentId']= 0;
          // values['categoryId']= 222;
          if(values.departments===''&&values.groups===''&&values.partys===''){//传全部时，默认传tenantId
            values.viewTenantId=window.sessionStorage.getItem("tenantId");
          }
          postService(API_PREFIX + 'services/web/config/homepageMenu/add',values, data => {
            // values.setAttribute('createUserId','111');
            // values.setAttribute('createDate','2018-05-28 17:13:55');
            // values.setAttribute('lastUpdateUserId','111');
            // values.setAttribute('lastUpdateDate','2018-05-28 17:13:55');
            if (data.status == 1) {
              message.success('新增成功');
              values['id'] = data.root.object.id;
              this.setColumnAuth(values)
              history.back();
            } else {
              message.error(data.errorMsg)
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
    console.log('props',prevState, nextProps);
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
      // if(e.file.status != undefined){
      if(e.file.status == 'done'){
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
      }
    }
  handleCancel = () => this.setState({ previewVisible: false })
  // handleCancelB = () => this.setState({ previewVisibleB: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleChange = (info) => {
    console.log('123',info);
    if (info.file.status == 'uploading') {
      this.setState({ fileList :info.fileList});
    }
    if (info.file.status === 'done') {
        let res = info.file.response;
        if(res.status == 1) {
            this.setState({
                previewImage:masterUrl +`${res.root.object[0].filePath}`,
                imageUrl:masterUrl +`${res.root.object[0].filePath}`,
              });
              this.setState({ fileList :info.fileList});
              message.success(`${info.file.name} 上传成功。`);
        }else {
          this.setState({ fileList :[]});
            message.error(`${info.file.name} 上传失败。`);
        }
      
    }else if(info.file.status === 'error'){
      this.setState({ fileList :[]});
      message.error(`${info.file.name} 上传失败。`);
    }
    if (info.file.status == 'removed') {
      this.setState({ fileList :info.fileList});
    }
    /*this.state.fileList.url = this.state.imageUrl;*/
  };

  // handlePreviewB = (file) => {
  //   this.setState({
  //     previewImageB: file.url || file.thumbUrl,
  //     previewVisibleB: true,
  //   });
  // }
  // handleChangeB = (info) => {
  //   console.log('123',info.file.status);
  //   if (info.file.status == 'uploading') {
  //     this.setState({ fileListB :info.fileList});
  //   }
  //   if (info.file.status === 'done') {
  //     this.setState({
  //       previewImageB:masterUrl +`${info.file.response.entity[0].filePath}`,
  //       // imageUrlB:masterUrl +`${info.file.response.entity[0].filePath}`,
  //     });
  //     this.setState({ fileListB :info.fileList});
  //     message.success(`${info.file.name} 上传成功。`);
  //   }else if(info.file.status === 'error'){
  //     message.error(`${info.file.name} 上传失败。`);
  //   }
  //   if (info.file.status == 'removed') {
  //     this.setState({ fileListB :info.fileList});
  //   }
  //   /*this.state.fileList.url = this.state.imageUrl;*/
  // };

  handleChangeParent=(e)=>{
    console.log(e);
    if(e==='0'){
      this.setState({
        isParent:true,
      });
    }else{
      this.setState({
        isParent:false,
      });
    }
  }

  onRelationChange = (e) => {
    this.props.form.setFieldsValue({ relationAddress: '' });
    this.setState({ relation: e.target.value });
  }

  getDetailByTypeId = (id) => {
    switch (id) {
      case '1':
        return { url: 'services/news/artical/newsList/get', code: 'title', desp: '文章', qilter: 'Q=onlineState_S_EQ=1' };
      case '2':
        return { url: 'services/activity/activity/list', code: 'name', desp: '活动', qilter: 'Q=status_I_EQ=1&Q=relation_Z_EQ=false' };
      case '3':
        return { url: '', code: '', desp: '链接', qilter: '' };
      case '4':
        return {
          url: 'services/news/magazine/article/list', code: 'title', desp: '杂志', qilter: '',
        };
      default:
        return { url: '', code: '', desp: '', qilter: '' };
    }
  }

  handleAddModalOK = () => {
    let url = '';
    let selectRowsData = this.props.selectRowsData[0];
    switch (this.state.relation) {
      case '1':
        url = `http://www.urlgenerator.com?objectType=1&type=${selectRowsData.type}&isAtlas=${selectRowsData.isatlas}&id=${selectRowsData.id}`;
        break;
      case '2':
        url = `http://www.urlgenerator.com?objectType=2&type=${selectRowsData.typeId}&id=${selectRowsData.id}`;
        break;
      case '4':
        url = `http://www.urlgenerator.com?objectType=5&id=${selectRowsData.id}`;
        break;
      default:
        break;
    }
    this.props.form.setFieldsValue({ relationAddress: url });
    this.setState({ showAddModal: '0' });
  }

    //关联类型输入框输入值的变化
    handleInput = (e, url, type, qilter) => {
      this.props.getData(API_PREFIX + `${url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=${type}_S_LK=${e.target.value}&&${qilter}`);
    }

  render() {
    //权限码
    let powers = this.props.powers;
    let departmentPowers=powers && powers['20004.21501.000'];//部门树权限码
    let partyPower=powers && powers['20005.23002.003'];//党组织权限
    let virtualGroupPowers=powers && powers['20004.21505.000'];//虚拟树权限码
    let tradePowers = powers && powers['20007.21704.000']; //工会树权限码
    

    //获取数据
    console.log('displayWarn',this.state.department);
    console.log('displayWarn2',this.state.partyOrganization);
    console.log('displayWarn3',this.state.virtualGroup);
    console.log('多棵树勾选的值，根据type区分',this.state.checkData);
    const { previewVisible, previewImage, fileList, isGet,showAddModal,relationAddress } = this.state;
    let url = this.getDetailByTypeId(showAddModal).url;
    let qilter = this.getDetailByTypeId(showAddModal).qilter;
    let typeCode = this.getDetailByTypeId(showAddModal).code;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>);
    const { parentMenuOption, parentId,unionsData, menuTypeOption, type, pictureUrl, isParent,isEnabled , virtualGroupData, organizationData, treeData, treeDataKey, checkData, partyOrganizationData,relation } = this.state;
    console.log('render',menuTypeOption);
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const formItemLayout1 = { labelCol: { span: 3 }, wrapperCol: { span: 16 } };
    const formItemLayout2 = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
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
            {getFieldDecorator('menuName', {
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
              getFieldDecorator('menuType',{
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
            {getFieldDecorator((isGet==='true')?'msgId' : 'menuUrl', {
              initialValue: '',
              rules: [{ required: false, whitespace: true, message: '最长255个字符！', max:255 }],
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem {...formItemLayout} label="显示顺序">
            {getFieldDecorator('showIndex', {
              initialValue: '',
              // rules: [{ pattern: new RegExp('^[0-9]+$'), message: '请使用数字表示显示顺序！', max:9 }, { required: false, message:'*必填项,最长9个字符！', max:9 }],
              rules: [{ pattern: new RegExp('^[0-9]+$'), message: '请使用数字表示显示顺序！', max:9 }, { required: false, message:'最长9个字符！', max:9 }],
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
        {getFieldDecorator('menuIcon', {
          valuePropName: 'filelist',
          getValueFromEvent: this.normFile,
          rules: [{ required: true, message: '菜单图标为必填项'}],
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
      {/* {isParent?
        <div>
            <FormItem {...formItemLayout1} label="banner菜单">
              {getFieldDecorator('bannericon', {
                valuePropName: 'filelist',
                getValueFromEvent: this.normFile,
                rules: [{ required: false}],
              })(
                <Upload
                  action={uploadPicture}
                  listType="picture-card"
                  fileList={fileListB}
                  onPreview={this.handlePreviewB}
                  onChange={this.handleChangeB}
                  beforeUpload={this.beforeUpload}
                >
                  {fileListB.length >= 1 ? null : uploadButton}
                </Upload>
              )}
          </FormItem>
          <Form.Item {...formItemLayout1} label="关联类型">
              {getFieldDecorator('relationType', {
                initialValue: '1',
                rules: [
                  {
                    required: false,
                    whitespace: true,
                    message: '关联类型必填项',
                  },
                ],
              })(
                <RadioGroup
                  options={[
                    { label: '文章', value: '1' },
                    { label: '活动', value: '2' },
                    { label: '链接', value: '3' },
                    { label: '杂志', value: '4' },
                  ]}
                  onChange={this.onRelationChange}
                />
              )}
            </Form.Item>
              <Form.Item {...formItemLayout1} label={'相关' + `${this.getDetailByTypeId(relation).desp}` + '地址'}>
                {getFieldDecorator('relationAddress', {
                  initialValue: relationAddress,
                  rules: [
                    {
                      required: false,
                      whitespace: true,
                      message: '必填项',
                    },
                  ],
                })(
                  <Input className="input1" readOnly={relation !== '3' ? true : false} />
                )}
                {relation !== '3' ? <Button style={{ marginLeft: '5px' }} onClick={() => this.setState({ showAddModal: relation })
                }>添加{this.getDetailByTypeId(relation).desp}</Button> : null}
              </Form.Item>
        </div>
      :null
      } */}

      {type!="2"?      
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
            {
              this.state.isEdit?<a style={{marginLeft:"10px",height:"25px"}} className="operation" onClick={() => location.hash = '/InterfaceManagement/ColumnManagement?back=1' }>栏目管理</a>:null
            }
          </div>
          )
        }
      </FormItem>:null
    }

      
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
              {departmentPowers?(
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
                    {
                      this.state.isEdit? <a
                      style={{marginLeft:"10px",marginTop:"5px",height:"25px"}}
                      className="location-btn operation"
                      onClick={() => (location.hash = '/EnterpriseConfig/DepartMent')}
                    >
                        部门管理
                    </a>:null
                    }
                   
                  </div>
                </div>
              ):null}
              {
                partyPower?
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
                {
                  this.state.isEdit?<a
                  style={{marginLeft:"10px",marginTop:"5px",height:"25px"}}
                  className="location-btn operation"
                  onClick={() =>
                    (location.hash = '/PartyBuildGarden/PartyOrganization')
                  }
                >
                    党组织管理
                </a>:null
                }
                
                </div>
              </div>:null
              }

                {
                  virtualGroupPowers?(
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
                    {
                      this.state.isEdit?<a
                      style={{marginLeft:"10px",marginTop:"5px",height:"25px"}}
                      className="location-btn operation"
                      onClick={() =>
                        (location.hash = '/EnterpriseConfig/VirtualGroup')
                      }
                    >
                        虚拟群组管理
                    </a>:null
                    }
                    
                    </div>
                  </div>
                  ):null
                }
              {tradePowers?(
                  <div className="single-tree">
                  <span className="location-span">选择工会</span>
                  <div style={{display:"flex"}}>
                    <TreeList
                      type="unionsId"
                      treeData={unionsData}
                      checkable
                      // defaultCheckedKeys={depView}
                      checkedKeys={checkData ? checkData.unionsId : []}
                      /*disabled={this.props.selectTreeData&& this.props.selectTreeData.length>0?false:true}*/
                    /> 
                    {
                      this.state.isEdit? <a
                      style={{marginLeft:"10px",marginTop:"5px",height:"25px"}}
                      className="location-btn operation"
                      onClick={() => (location.hash = '/TradeManager/Organization?back=1')}
                    >
                        工会组织管理
                    </a>:null
                    }
                   
                  </div>
                </div>
              ):null}
            </div>
          </div>
          {/*</DynamicTree>*/}
        </Spin>
      </div>
      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal> 
      <Modal
        title={`添加${this.getDetailByTypeId(relation).desp}`}
        visible={this.state.showAddModal !== '0' ? true : false}
        footer={
          <React.Fragment>
            <Button onClick={this.handleAddModalOK}
              disabled={!(this.props.selectRowsData && this.props.selectRowsData.length > 0)}>添加</Button>
            <Button onClick={() => this.setState({ showAddModal: '0' })
            }>取消</Button>
          </React.Fragment>}
        onCancel={() => this.setState({ showAddModal: '0' })
        }
        destroyOnClose={true}
      >
        <FormAndInput
          columns={relation === '4' ? [
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
          ] : [
              {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
              },
              {
                title: '标题',
                dataIndex: relation === '1' ? 'title' : 'name',
                key: relation === '1' ? 'title' : 'name',
              },
              {
                title: '创建时间',
                dataIndex: relation === '2' ? 'createDate' : 'createdate',
                key: relation === '2' ? 'createDate' : 'createdate',
              },
            ]}
          url={url}
          qfilter={qilter}
          onSearch={e => this.handleInput(e, url, typeCode, qilter)}
        />
      </Modal>
      <Button style={{marginLeft:'40%',marginBottom:'100px'}} className="resetBtn" onClick={() => history.back()}>返回</Button>
      <Button htmlType="submit" className="queryBtn" type="primary">保存</Button>
    </Form>;
  }
}