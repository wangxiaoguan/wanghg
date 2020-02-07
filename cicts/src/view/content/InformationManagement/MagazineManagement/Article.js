import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import FormWrapper from '../../../component/EventAndInfoAdd/FormWrapper.js';
import FormAndInput from '../../../component/table/FormAndInput';
import {message, Divider, Button, Form, Modal } from 'antd';
import API_PREFIX from '../../apiprefix';
import {postService, getService } from '../../myFetch';
import {  BEGIN ,getPageData} from '../../../../redux-root/action/table/table';
import {pageJummps} from '../PageJumps';
import { connect } from 'react-redux';


@Form.create()
@connect(
  state => ({
    uploadData: state.uploadPicture.contentPictureData,
    selectRowsData: state.table.selectRowsData,
    editorData: state.editor.editorData,
    flowData: state.flowData.flowData,
    pageData:state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    getPageData:n=>dispatch(getPageData(n)),
  })
)
export default class MagazineArticle extends Component{
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      catalogueIdOption: [],
      showList: true,
      isAdd: true,
      // url:null,
      id: '',
      mArticleUrl:'services/news/magazine/article/list/magazine',//杂志跳转
      cArticleUrl:'services/news/magazine/article/list/catalogue',//目录跳转
      initData: '',
      update:0,
      uploadData: this.props.uploadData,
      validSequence: {retCode:0},
      partyRootId:'-1',
      dpRootId:'-1',
      set: function () { },
      keyAddModal: 1,//作者列表的key值
      showAddModal: false,//展示作者列表，数据来源于用于管理
      qfilter: '',
      articleForm:[
        { key: 'catalogueId', label: '所属目录', type: 'select', option: [], required: false },
        { key: 'sequence', label: '序号', type: 'inputNumber', required: true },
        { key: 'title', label: '标题', type: 'input', required: true, max:60 },
        { key: 'titleImage', label: '标题图片', type: 'uploadPicture_drop', isIamge:true ,magazineType:'magazine1'},
        { key: 'digest', label: '摘要', type: 'input' },
        {
          key: 'author', label: '作者', type: 'infoAuth', disabled: true, ButtonList: [
            { key: 'author', label: '添加作者', type: 'Button', onClick: this.addAuthor },
            { key: 'author', label: '删除作者', type: 'Button', onClick: this.deleteAuthor },
          ]},
        { key:'orgType'},
        { key: 'orgType', label: '资讯归属', type: 'infoBelong', required: true,option:infoOption},
        { key: 'orgId'},
        { key: 'content', label: '正文内容', type: 'richText', required: true }, //rich text
        { key: ['isHomePage', 'indexImage', 'layout'], type: 'onHomePage', required: false },
        { key:'depCategory'}
      ],

    };
  }

  componentDidMount(){
    let {articleForm} = this.state
    if(this.props.type === 'total'){
      getService(API_PREFIX + `${pageJummps.CatalogueList}/${this.props.id}/1/10`, data => {
        if (data.status == 1&&JSON.stringify(data.root!=='{}')) {
          let list = [];
          data.root.list.map(item=>{list.push({key:item.id,value:item.name});});
          articleForm[0].option = list
          this.setState({catalogueIdOption: list,articleForm});
        }else{
          this.setState({catalogueIdOption:[]});
        }
      });
    }else if(this.props.type === 'single'){
      articleForm[0].option = this.props.data
      this.setState({catalogueIdOption:this.props.data,articleForm});
    }
  }
  arrayToString = array => {
    let str = '';
    array &&
      array.map((item, index) => {
        if (index === 0) {
          str = item;
        } else {
          str = str + ',' + item;
        }
      });
    return str;
  };

  handleValidSequence= (value, catalogueId) => {
    let query=`Q=sequence_I_EQ=${value}&Q=catalogueid_S_EQ=${catalogueId}`;
    if(!this.state.isAdd){
      query=query+'&'+`Q=id_S_NE=${this.state.id}`;
    }
    getService(API_PREFIX + `services/system/verify/checkUnique/InformationManagement-Article?${query}`, data => {
      if(data.retCode==0){
        message.error('该杂志文章序号已存在');
        return data.retCode;
        this.setState({
          validSequence:{
            retCode:data.retCode,
            retMsg:data.retMsg,
          },
        });

      }else{
        return  data.retCode;
        this.setState({
          validSequence:{
            retCode:data.retCode,
            retMsg:data.retMsg,
          },
        });

      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('values',values);
      if (!err) {
        let tempImage = '';
        values.indexImage && values.indexImage.map(item=>{
          if(this.state.isAdd){
            if(Array.isArray(item)){
              tempImage = item[0].response.root.object[0].filePath;
            }else{
              tempImage = item.response.root.object[0].filePath;
            }
          }else{
            tempImage = item.response.root.object[0].filePath;
          }
          
        });
        values.titleImage = values['titleImage'] && values['titleImage'][0];
        values.indexImage = tempImage;
        values.orgId = values.orgId[values.orgId.length-1];
        values.tenantId = window.sessionStorage.getItem('tenantId')
        values.magazineId = this.props.id;
        if(!this.state.isAdd){
          values.id = this.state.id;
          postService(API_PREFIX + pageJummps.MagaArtEdit, values, data => {
            if (data.status == 1) {
              message.success('修改成功');
              this.showArticleList();
              if (window.sessionStorage.getItem('indexMagazine') == 'two') {
                this.props.getData(API_PREFIX + `${pageJummps.MagaArtList}/${window.sessionStorage.getItem('contentId')}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
              } else {
                this.props.getData(API_PREFIX + `services/web/news/magazine/article/getMagazineArticles/${window.sessionStorage.getItem('magazineId')}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
              }
            }else{
              message.error(data.errorMsg);
            }
          });
        }else{
          values['state'] = 0;
          postService(API_PREFIX + pageJummps.MagaArtAdd, values, data => {
            if (data.status == 1) {
              message.success('新增成功');
              this.showArticleList();
              if (window.sessionStorage.getItem('indexMagazine') == 'two') {
                this.props.getData(API_PREFIX + `${pageJummps.MagaArtList}/${window.sessionStorage.getItem('contentId')}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
              } else {
                this.props.getData(API_PREFIX + `services/web/news/magazine/article/getMagazineArticles/${window.sessionStorage.getItem('magazineId')}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
              }
            }else{
              message.error(data.errorMsg);
            }
          });
        }
      }
    });
  };

  addArticle = () => {
    this.setState({
      showList: false,
      isAdd: true,
      update: this.state.update+1,
    });
  }

  editArticle = (record) =>{
    this.setState({
      id: record.id,
      showList: false,
      isAdd: false,
      disabled: false,
      update: this.state.update + 1,
    });
    let {articleForm} = this.state
    getService(API_PREFIX +`${pageJummps.MagaArtDetail}/${record.id}`,data=>{
      if (data.status ===1) {
        let tempData = data.root.object;
        if(tempData.titleImage == ''){
          tempData.titleImage = [];
        }
        console.log(tempData)
        if(tempData.isHomePage&&tempData.layout!==0){
          articleForm[3].required = true
        }
        this.setState({
          initData: tempData,
          update: this.state.update + 1,
          articleForm
        });
      }else{
        message.error(data.errorMsg);
      }
    });
  }

  articleDetail = (record) =>{
    this.setState({
      showList: false,
      isAdd: false,
      disabled: true,
    });
    let {articleForm} = this.state
    getService(API_PREFIX +`${pageJummps.MagaArtDetail}/${record.id}`,data=>{
      if (data.status ===1) {
        let tempData = data.root.object;
        if(tempData.titleImage == ''){
          tempData.titleImage = [];
        }else{
          message.error(data.errorMsg);
        }
        console.log(tempData)
        if(tempData.isHomePage&&tempData.layout!==0){
          articleForm[3].required = true
        }
        this.setState({initData: tempData,update: this.state.update + 1,articleForm});
      }else{
        message.error(data.errorMsg);
      }
    });
  }

  showArticleList = () =>{
    this.setState({
      showList: true,
      disabled: false,
    });
  }
  dealFiles = files =>{
    let data = [];
    let list = files.split('/');
    data.push({size:893,type:3, response: { root: {object:[{ filePath:files,fileName:list[list.length-1] }] }}});
    return data;
  }
  dealGetData=(data)=>{
    let result =  {
      ...data,
      orgId:data['orgId'].split(','),
      titleImage:data['titleImage']&& (Array.isArray(data['titleImage'])?data['titleImage']:data['titleImage'].replace(/(\w+),(\w+),/g, '$1,$2;').split(';')),
      indexImage:data['indexImage']&&this.dealFiles(data['indexImage']),
    };
    return result;
  }
  getCreateOrgName = e => {
    
  }
  //添加作者
  addAuthor = (key, get, set) => {
    localStorage.setItem("selectedRowKeys", '')
    this.setState({showAddModal: true,keyAddModal: this.state.keyAddModal + 1,set})
  }
  //删除作者
  deleteAuthor = (key, get, set) => {
      set(key, '');
  }
  //添加作者
  handleAddModalOK = () => {
      this.setState({ showAddModal: false });
      let selectedData = this.props.selectRowsData;
      this.state.set('author',selectedData[0].name);
  }
  //取消作者
  handleAddModalCancel = () => {
      this.setState({ showAddModal: false });
  }
  //搜索作者
  handleInput = (e) => {
      let qfilter = e.target.value == '' ? '' : `Q=name=${e.target.value}`
      this.setState({qfilter,})
      this.props.getPageData({currentPage: 1, pageSize: 10, query: qfilter});
      this.props.getData(API_PREFIX+`${pageJummps.InfoAuthor}/1/10?${qfilter}`);
  }
  setRequired = e => {
      let {articleForm} = this.state
      if(e!==0){
        articleForm[3].required = true
      }else{
        articleForm[3].required = false
      }
      this.setState({articleForm})
  }
  render(){
    let powers = this.props.powers;
    // let createPowers = powers && powers['20001.21603.001'];//新建
    // let updatePowers = powers && powers['20001.21603.002'];//修改
    // let readPowers = powers && powers['20001.21603.003'];//查询
    // let deletePowers = powers && powers['20001.21603.004'];//删除
    let createPowers = true;//新建
    let deletePowers = true;//删除

    let url ;
    let magazineId = window.sessionStorage.getItem('magazineId');
    let contentId = window.sessionStorage.getItem('contentId');
    if (window.sessionStorage.getItem('indexMagazine') == 'one' && magazineId != null && typeof magazineId != 'undefined') {
      url = 'services/web/news/magazine/article/getMagazineArticles/' + magazineId;
    }else if(window.sessionStorage.getItem('indexMagazine') == 'two' && contentId != null && typeof contentId != 'undefined') {
      url = `${pageJummps.MagaArtList}/${contentId}`
    }
    const { form: { getFieldDecorator }} = this.props;
    const { catalogueIdOption, disabled, isAdd, showList,articleForm } = this.state;
    const { flowData} = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'sequence',
        key: 'sequence',
      },
      {
        title: '文章名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title:'点击量(评论数)',
        dataIndex:'voteCount',
        key:'voteCount',
        render:(data,record)=>{
          return <a onClick={()=>location.hash=pageJummps.magazineView+`?id=${record.id}&type=3`} >{`${record.viewCount}(${record.commentCount})`}</a>;
        },
      },
      {
        title: '创建时间',
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
        render: (text, record) => {
          return <div>
            <a className="operation" onClick={this.editArticle.bind(this,record)}>编辑 </a>
            <Divider type="vertical" />
            <a className="operation" onClick={this.articleDetail.bind(this,record)}> 详情</a>
          </div>;
        },
      },
    ];
    const columnsAuthor = [
      {
        title: '员工号',
        dataIndex: 'userNo',
        key: 'userNo',
      },

      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '部门',
        dataIndex: 'fullName',
        key: 'fullName',
      },
    ];
    const search = [{ key: 'catalogueId', label: '所属目录', qFilter: 'Q=catalogueId',type:'select',option: catalogueIdOption }];
    
    // const articleForm = [
    //   { key: 'catalogueId', label: '所属目录', type: 'select', option: catalogueIdOption, required: false },
    //   { key: 'sequence', label: '序号', type: 'inputNumber', required: true },
    //   { key: 'title', label: '标题', type: 'input', required: true, max:60 },
    //   { key: 'titleImage', label: '标题图片', type: 'uploadPicture_drop', isIamge:true ,magazineType:'magazine1'},
    //   { key: 'digest', label: '摘要', type: 'input' },
    //   {
    //     key: 'author', label: '作者', type: 'infoAuth', disabled: true, ButtonList: [
    //       { key: 'author', label: '添加作者', type: 'Button', onClick: this.addAuthor },
    //       { key: 'author', label: '删除作者', type: 'Button', onClick: this.deleteAuthor },
    //     ]},
    //   { key:'orgType'},
    //   { key: 'orgType', label: '资讯归属', type: 'infoBelong', required: true,option:infoOption},
    //   { key: 'orgId'},
    //   { key: 'content', label: '正文内容', type: 'richText', required: true }, //rich text
    //   { key: ['isHomePage', 'indexImage', 'layout'], type: 'onHomePage', required: false },
    //   { key:'depCategory'}
    // ];
    if(disabled){
      articleForm.splice(5,1,{key: 'author', label: '作者', type: 'input' })
    }
    const initialData = { 'catalogueId': window.sessionStorage.getItem('indexMagazine') == 'two' && window.sessionStorage.getItem('contentId') ? window.sessionStorage.getItem('contentId') : '' };

    const formItemLayout = { labelCol: { span: 3 }, wrapperCol: { span: 8 } };

    return <div>
      <div  style= {{display:
          showList===true ? 'block' : 'none'}}>
        <TableAndSearch 
            columns={columns} 
            url={`${url}`} 
            search={search}
            addBtn={createPowers ? { order: 1,OnEvent:this.addArticle } : null}
            deleteBtn={deletePowers ? { order: 2, url:pageJummps.MagaArtDeleta} : null} 
        />
      </div>

      {
        showList === false ?
          <div>

            {isAdd == true && (
              <h4 style={{ textAlign: 'center' }}>
                          新建杂志文章
              </h4>
            )}
            {isAdd == false && disabled == false && (
              <h4 style={{ textAlign: 'center' }}>
                          编辑杂志文章
              </h4>
            )}
            {isAdd == false && disabled == true && (
              <h4 style={{ textAlign: 'center' }}>
                          杂志文章详情
              </h4>
            )}
            <Form onSubmit={this.handleSubmit}>
              <FormWrapper 
                {...this.props} 
                key={this.state.update} 
                content={articleForm} 
                disabled={disabled}
                isAdd={isAdd}
                setRequired={this.setRequired}
                getCreateOrgName={this.getCreateOrgName}
                initialValue={((!isAdd) && this.state.initData) ? this.dealGetData(this.state.initData) : null} leaveData={{ magazine: {} }} belonged="magazine"
                indexImage={((!isAdd) && this.state.initData) ? this.dealGetData(this.state.initData) : null} 
              />
              <Button style={(isAdd == false && disabled == true) ? {left: '50%',marginLeft: '0'} : {marginLeft:'40%',marginBottom:'100px'}} className="resetBtn" onClick={this.showArticleList}>返回</Button>
              <Button htmlType="submit" className="queryBtn" type="primary" style={{ display: ((isAdd == false && disabled == true) ? 'none' : 'inline-block') }}>保存并返回</Button>
            </Form>
          </div>:null
      }
        <Modal
          width={1000}
          title="添加作者"
          visible={this.state.showAddModal}
          cancelText="取消"
          okText="添加"
          onOk={this.handleAddModalOK}
          onCancel={this.handleAddModalCancel}
          destroyOnClose={true}
        >
          <FormAndInput
            columns={columnsAuthor}
            url={pageJummps.InfoAuthor}
            onSearch={this.handleInput}
            qfilter={this.state.qfilter}
          />
        </Modal>
    </div>;
  }
}
const infoOption = [{ label: '按照企业部门归属', value: 1 },{ label: '按照党组织归属', value: 2 }, { label: '按照工会归属', value: 3 },];