import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import FormWrapper from '../../../component/EventAndInfoAdd/FormWrapper.js';
import { Tag, Upload, Icon, message, Divider, Button, Form, Input, Select, Row, Radio, Col, Message, Modal } from 'antd';
import ServiceApi, { masterUrl }from '../../apiprefix';
import { GetQueryString, postService, getService } from '../../myFetch';
import {  BEGIN,getDataSource,getPageData } from '../../../../redux-root/action/table/table';
import {pageJummps} from '../PageJumps';
import { connect } from 'react-redux';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@Form.create()
@connect(
  state => ({
    uploadData: state.uploadPicture.contentPictureData,
    editorData: state.editor.editorData,
    flowData: state.flowData.flowData,
    pageData:state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
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

    };
  }

  componentDidMount(){
    if(window.sessionStorage.getItem('indexMagazine') == 'one') {
      let mId = window.sessionStorage.getItem('magazineId');
      getService(ServiceApi + `services/news/magazine/catalogue/list/${mId}`, data => {
        if (data.retCode == 1) {
          let result = [];
          // result.push({;
          //   key: '', value: '全部',
          // });
          for (let index = 0; index < data.root.list.length; index++) {
            let node = data.root.list[index];
            let tmp = {};
            tmp.key = node.id + '';
            tmp.value = node.name + '';
            result.push(tmp);
          }
          this.setState({catalogueIdOption: result}, () => {
          });
        }
      });
    } else{
      getService(ServiceApi + `services/news/magazine/catalogue/name/${window.sessionStorage.getItem('contentId')}`, data => {
        if (data.retCode == 1) {
          this.setState({
            catalogueIdOption : [
              {
                key: window.sessionStorage.getItem('contentId'),
                value: data.root.name + '',
              }],
          }, () => {
          });
        }
      });
    }

    /*let type = JSON.parse(window.sessionStorage.getItem('magazineObj')).type;
    let id = JSON.parse(window.sessionStorage.getItem('magazineObj')).id;
    if (type != null && typeof type != 'undefined') {
      if(type == 0){
        this.setState({
          url : 'services/news/magazine/article/list/magazine/' + id,
        });
      } else {
        this.setState({
          url : 'services/news/magazine/article/list/catalogue/' + id,
        });
      }

    }*/
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
    /*    if(value == ''||value==undefined){
      this.setState({
        validSequence:{
          retCode:0,
        },
      });
      message.error('未填写杂志目录序号');
    }else{*/
    let query=`Q=sequence_I_EQ=${value}&Q=catalogueid_S_EQ=${catalogueId}`;
    if(!this.state.isAdd){//编辑==》额外传入
      query=query+'&'+`Q=id_S_NE=${this.state.id}`;
    }
    getService(ServiceApi + `services/system/verify/checkUnique/InformationManagement-Article?${query}`, data => {
      if(data.retCode==0){
        message.error('该杂志文章序号已存在');
        return data.retCode;
        this.setState({
          validSequence:{
            retCode:data.retCode,
            retMsg:data.retMsg,
          },
        });

        // message.error(data.retMsg)
      }else{
        //message.success('该杂志文章序号不存在重复！');
        return  data.retCode;
        this.setState({
          validSequence:{
            retCode:data.retCode,
            retMsg:data.retMsg,
          },
        });

        //callback();
      }
    });
    /*}*/
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('values',values);
      if (!err) {
        let tempImage = '';
        values.indexImage && values.indexImage.filter(item=>item!==undefined).map(item=>{
          let isMasterUrl
          if(Array.isArray(item)){
            isMasterUrl = item[0].response.entity[0].filePath.indexOf(masterUrl) > -1;
            if (tempImage==='') {
              tempImage = isMasterUrl ? item[0].response.entity[0].filePath : masterUrl + item[0].response.entity[0].filePath;
            }else{
              tempImage = tempImage + ',' + (isMasterUrl ? item[0].response.entity[0].filePath : masterUrl + item[0].response.entity[0].filePath);
            }
          }else{
            isMasterUrl = item.response.entity[0].filePath.indexOf(masterUrl) > -1;
            if (tempImage==='') {
              tempImage = isMasterUrl ? item.response.entity[0].filePath : masterUrl + item.response.entity[0].filePath;
            }else{
              tempImage = tempImage + ',' + (isMasterUrl ? item.response.entity[0].filePath : masterUrl + item.response.entity[0].filePath);
            }
          }
        });
        values.titleImage = values['titleImage'] && this.arrayToString(values['titleImage']);
        values.orgId = values['orgId']&&values['orgId'][values['orgId'].length-1];
        values.pictureUrl = this.state.imageUrl;
        values.indexImage = tempImage;

        let query=`Q=sequence_I_EQ=${values.sequence}&Q=catalogueid_S_EQ=${values.catalogueId}`;
        if(!this.state.isAdd){//编辑==》额外传入
          query=query+'&'+`Q=id_S_NE=${this.state.id}`;
        }
        console.log('提交',values);
        getService(ServiceApi + `services/system/verify/checkUnique/InformationManagement-Article?${query}`, data => {
          if(data.retCode==0){
            message.error('该杂志文章序号已存在');
            // return data.retCode;
            this.setState({
              validSequence:{
                retCode:data.retCode,
                retMsg:data.retMsg,
              },
            });

            // message.error(data.retMsg)
          }else if(data.retCode==1){
            //message.success('该杂志文章序号不存在重复！');
            // return  data.retCode;
            this.setState({
              validSequence:{
                retCode:data.retCode,
                retMsg:data.retMsg,
              },
            });

            if (!this.state.isAdd) {
              values.id = this.state.id;
              postService(ServiceApi + 'services/news/magazine/article/update', values, data => {
                if (data.retCode == 1) {
                  Message.success('修改成功');
                  this.showArticleList();
                  if (window.sessionStorage.getItem('indexMagazine') == 'two') {
                    this.props.getData(ServiceApi + `services/news/magazine/article/list/catalogue/${window.sessionStorage.getItem('contentId')}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
                  } else {
                    this.props.getData(ServiceApi + `services/news/magazine/article/list/magazine/${window.sessionStorage.getItem('magazineId')}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
                  }
                }
              });
            } else {
              postService(ServiceApi + 'services/news/magazine/article/add', values, data => {

                //values.setAttribute('categoryId','666');

                if (data.retCode == 1) {
                  Message.success('新增成功');
                  this.showArticleList();
                  if (window.sessionStorage.getItem('indexMagazine') == 'two') {
                    this.props.getData(ServiceApi + `services/news/magazine/article/list/catalogue/${window.sessionStorage.getItem('contentId')}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
                  } else {
                    this.props.getData(ServiceApi + `services/news/magazine/article/list/magazine/${window.sessionStorage.getItem('magazineId')}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
                  }
                }
              });
            }
            //callback();
          }
        });


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

    let url ;
    let magazineId = window.sessionStorage.getItem('magazineId');
    let contentId = window.sessionStorage.getItem('contentId');
    if (window.sessionStorage.getItem('indexMagazine') == 'one' && magazineId != null && typeof magazineId != 'undefined') {
      url = 'services/news/magazine/article/list/magazine/' + magazineId;
    }else if(window.sessionStorage.getItem('indexMagazine') == 'two' && contentId != null && typeof contentId != 'undefined') {
      url = 'services/news/magazine/article/list/catalogue/' + contentId;
    }



  }

  articleDetail = (record) =>{
    this.setState({
      showList: false,
      isAdd: false,
      disabled: true,
    });

    let url ;
    let magazineId = window.sessionStorage.getItem('magazineId');
    let contentId = window.sessionStorage.getItem('contentId');
    if (window.sessionStorage.getItem('indexMagazine') == 'one' && magazineId != null && typeof magazineId != 'undefined') {
      url = 'services/news/magazine/article/list/magazine/' + magazineId;
    }else if(window.sessionStorage.getItem('indexMagazine') == 'two' && contentId != null && typeof contentId != 'undefined') {
      url = 'services/news/magazine/article/list/catalogue/' + contentId;
    }

    getService(ServiceApi +`${url}/1/10?Q=id_S_EQ=${record.id}`,data=>{
      if (data.retCode ===1) {
        let tempData = data.root.list[0];
        if(tempData.titleImage == ''){
          tempData.titleImage = [];
        }
        this.setState({
          initData: tempData,
          update: this.state.update + 1,
        });
      }
    });
  }

  showArticleList = () =>{
    this.setState({
      showList: true,
      disabled: false,
    });
  }

  dealGetData=(data)=>{
    let newTreePath=[];
    let newPath=[];
    // if(data['treepath']){
    //   newTreePath=data['treepath'].split(',');
    //   // newPath=data['treepath'].split(',').splice(newTreePath.indexOf(this.state.dpRootId));
    //   if(data['belongOrgType']=='2'){
    //     newTreePath.splice(newTreePath.indexOf(this.state.partyRootId));
    //   }else{
    //     newTreePath.splice(newTreePath.indexOf(this.state.dpRootId));
    //   }
    //   //data['treepath']=newTreePath;
    // }

    if (data['treepath'] && (this.state.partyRootId || this.state.dpRootId)) {
      newTreePath = data['treepath'].split(',');
      // newPath=data['treepath'].split(',').splice(newTreePath.indexOf(this.props.dpRootId));
      if (data['belongOrgType'].toString() === '2') {
        let temp = newTreePath.indexOf(this.state.partyRootId);
        if (temp > 0) {
          newTreePath.splice(0, temp - 1);
        }
      } else {
        let temp = newTreePath.indexOf(this.state.dpRootId);
        if (temp > 0) {
          newTreePath.splice(0, temp - 1);
        }
      }
      //data['treepath']=newTreePath;
    }
    let result =  {
      ...data,

      belongOrgType : data['belongOrgType'].toString(),
      orgId: newTreePath,  //todo
      // orgId: newTreePath,
      //orgId: data['treepath']&&data['treepath'].split(',').filter(item=>item!=='-1'),
      titleImage:
        data['titleImage']
        && (Array.isArray(data['titleImage'])?data['titleImage']:data['titleImage'].replace(/(\w+),(\w+),/g, '$1,$2;').split(';')),
      indexImage:
        data['indexImage'] &&
        data['indexImage'].replace(/(\w+),(\w+),/g, '$1,$2;').split(';'),
    };
    result['indexImage']= result['indexImage'] && result['indexImage'].map((item,index)=>{
      return item = { response: { entity: [{ filePath: item }] },id: index };
    });

    return result;
  }

  render(){
    console.log('this.state.initData',this.state.initData);
    let powers = this.props.powers;
    // console.log('权限码', powers);
    let createPowers = powers && powers['20003.23003.001'];
    let updatePowers = powers && powers['20003.23003.002'];
    let readPowers = powers && powers['20003.23003.003'];
    let deletePowers = powers && powers['20003.23003.004'];

    let url ;
    let magazineId = window.sessionStorage.getItem('magazineId');
    let contentId = window.sessionStorage.getItem('contentId');
    if (window.sessionStorage.getItem('indexMagazine') == 'one' && magazineId != null && typeof magazineId != 'undefined') {
      url = 'services/news/magazine/article/list/magazine/' + magazineId;
    }else if(window.sessionStorage.getItem('indexMagazine') == 'two' && contentId != null && typeof contentId != 'undefined') {
      url = 'services/news/magazine/article/list/catalogue/' + contentId;
    }
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { catalogueIdOption, disabled, isAdd, showList } = this.state;
    const { flowData} = this.props;
    console.log('disabled?',disabled);
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
        title:'点击量（评论数）',
        dataIndex:'clickAndComment',
        key:'clickAndComment',
        render:(data,record)=>{
          return <a onClick={()=>location.hash=pageJummps.comment+`?id=${record.id}&targetType=2`} >
            {record.clickAndComment}</a>;
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
            <a className="operation" onClick={this.editArticle.bind(this,record)}
              style={{ display: updatePowers ? 'inline-block' : 'none' }}>编辑 </a>
            <Divider type="vertical" />
            <a className="operation" onClick={this.articleDetail.bind(this,record)}
              style={{ display: readPowers ? 'inline-block' : 'none' }}> 详情</a>
            {/*<Divider type="vertical" />*/}
          </div>;
        },
      },
    ];

    const search = [
      { key: 'catalogueId', label: '所属目录', qFilter: 'Q=catalogueid_S_EQ',type:'select',option: catalogueIdOption },
    ];

    const articleForm = [
      { key: 'catalogueId', label: '所属目录', type: 'select', option: catalogueIdOption, required: true },
      { key: 'sequence', label: '序号', type: 'inputNumber', required: true },
      { key: 'title', label: '标题', type: 'input', required: true, max:20 },
      { key: 'titleImage', label: '标题图片', type: 'uploadPicture_drop', isIamge:true },
      { key: 'digest', label: '摘要', type: 'input' },
      { key: 'author', label: '作者', type: 'input' },
      { key:'belongOrgType'},
      { key: 'orgId', label: '资讯归属', type: 'belong', required: true,magazine:'1'},
      { key: 'content', label: '正文内容', type: 'richText', required: false }, //rich text
      { key: ['isHomePage', 'indexImage', 'layout'], type: 'onHomePage', required: true },
    ];

    const initialData = { 'catalogueId': window.sessionStorage.getItem('indexMagazine') == 'two' && window.sessionStorage.getItem('contentId') ? window.sessionStorage.getItem('contentId') : '' };

    const formItemLayout = { labelCol: { span: 3 }, wrapperCol: { span: 8 } };

    return <div>
      <div  style= {{display:
          showList===true ? 'block' : 'none'}}>
        <TableAndSearch columns={columns} url={`${url}`} search={search}
          addBtn={createPowers ? { order: 1,OnEvent:this.addArticle } : null}
          deleteBtn={deletePowers ? { order: 2, url:'services/news/magazine/article/delete',field:'ids'} : null} />
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
              <FormWrapper {...this.props} key={this.state.update} content={articleForm} disabled={disabled}
                initialValue={((!isAdd) && this.state.initData) ? this.dealGetData(this.state.initData) : null} leaveData={{ magazine: {} }} belonged="magazine"
                indexImage={((!isAdd) && this.state.initData) ? this.dealGetData(this.state.initData) : null} />
              <Button style={(isAdd == false && disabled == true) ? {left: '50%',marginLeft: '0'} : {marginLeft:'40%',marginBottom:'100px'}} className="resetBtn" onClick={this.showArticleList}>返回</Button>
              <Button htmlType="submit" className="queryBtn" type="primary"
                style={{ display: ((isAdd == false && disabled == true) ? 'none' : 'inline-block') }}>保存</Button>
            </Form>
          </div>:null
      }
    </div>;
  }
}