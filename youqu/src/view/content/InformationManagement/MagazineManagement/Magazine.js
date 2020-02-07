import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { message, Tabs, Modal, Popconfirm, Divider,Spin} from 'antd';
import Content from '../MagazineManagement/Content';
import MagazineArticle from '../MagazineManagement/Article';
import ServiceApi ,{PictrueUrl,UploadUrl,masterUrl,ChooseUrl,API_FILE_VIEW_INNER} from '../../apiprefix';
import { GetQueryString, postService, getService } from '../../myFetch';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action';
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

export default class Magazine extends Component{
  constructor(props) {
    super(props);

    this.state = {
      magazineSeriesOption : [],
      isPublishOption : [],
      previewImage: '',
      previewVisible: false,
      ispublish:false,
      loading: false,
    };
  }


  componentDidMount(){
    this.setState({ loading: true });
  

    this.setState({
      isPublishOption : [
        {
          key: '', value: '全部',
        },
        {
          key: 'true', value: '已发布',
        }, {
          key: 'false', value: '未发布',
        }],
    });
  }

  exchange = (magazineId,contentId) => {
    if(magazineId != null && typeof magazineId != 'undefined'){
      console.log('magazineId',magazineId);
      window.sessionStorage.setItem('magazineId',magazineId);
    }
    if (contentId != null && typeof contentId != 'undefined'){
      console.log('contentId',contentId);
      window.sessionStorage.setItem('contentId',contentId);
    }


    /* let magazine;
      let content;
      if(magazineId != null){
        magazine = magazineId;
      } else if(contentId != null ){
        content = contentId;
      }
     this.setState({
        magazineId: magazine,
        contentId: content},() => {
        console.log('magazineId', this.state.magazineId);
        console.log('contentId', this.state.contentId);
      });*/
  }

  handleMagazinePreview = (pictureUrl) => {
    this.setState({
      previewImage: pictureUrl,
      previewVisible: true,
    },() => {
      console.log('previewImage',this.state.previewImage);
      console.log('previewVisible',this.state.previewVisible);
    });
  }

  publish = (record) => {
    getService(ServiceApi + `services/news/magazine/newsInfo/publish/${record.id}/1`, data => {
      if(data.retCode==1){
        message.success('杂志已成功发布！', 2);
        this.setState({
          ispublish:record.ispublish,
        });
        this.props.getData(ServiceApi+`services/news/magazine/magazineList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      } else{
        message.error(data.retMsg);
      }
    });

  }



  render(){
    const { magazineSeriesOption, isPublishOption} = this.state; //coverimage
    let powers = this.props.powers;
    // console.log('权限码', powers);
    let createPowers = powers && powers['20003.23003.001'];
    let updatePowers = powers && powers['20003.23003.002'];
    let readPowers = powers && powers['20003.23003.003'];
    let deletePowers = powers && powers['20003.23003.004'];
    let mContentPowers = powers && powers['20003.23003.000'];
    let contentTab;
    let articleTab;

    const columns = [
      {
        title: '封面',
        dataIndex: 'coverimage',
        key: 'coverimage',
        width:100,
        fixed: 'left',
        render: (text, record,index) => {
          return <span>
            {ChooseUrl==1?
              <img onClick={this.handleMagazinePreview.bind(this,record.coverimage)} key={index} src={PictrueUrl+record.coverimage} style={{width:'50px',height:'50px'}} />:
              <img onClick={this.handleMagazinePreview.bind(this,record.coverimage)} key={index} src={API_FILE_VIEW_INNER + record.coverimage} style={{width:'50px',height:'50px'}} />

            }
          </span>
          
        },
      },
      {
        title: '期刊名称',
        dataIndex: 'name',
        key: 'name',
        width:100,
        fixed: 'left',
      },
      {
        title: '期数',
        dataIndex: 'periods',
        key: 'periods',
      },
      {
        title: '杂志系列',
        dataIndex: 'magazineSeriesName',
        key: 'magazineSeriesName',
      },
      {
        title: '是否发布',
        dataIndex: 'ispublishDesp',
        key: 'ispublishDesp',
      },
      {
        title: '发布时间',
        dataIndex: 'publishDate',
        key: 'publishDate',
        width:150,
      },
      {
        title: '更新时间',
        dataIndex: 'lastUpdateDate',
        key: 'lastUpdateDate',
        width:150,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width:250,
        fixed: 'right',
        render: (text, record) => {
          return <div>

            {record.ispublish == true ? <span><a  style={{color:'grey', display: updatePowers ? 'inline-block' : 'none'}} >发布</a> <Divider type="vertical" /></span>
              : <span>
                <Popconfirm title="确定发布该杂志吗?" onConfirm={()=>this.publish(record)}>
                  <a className="operation" style={{ display: updatePowers ? 'inline-block' : 'none' }}>发布</a>
                </Popconfirm>
                <Divider type="vertical" />
              </span>}
            {/*<a className="operation" onClick={()=>this.publish(record)}  disabled={this.state.ispublish}>发布 </a>*/}
            <span>
              <a className="operation" onClick={() => {
                const list = JSON.stringify(record);
                window.sessionStorage.setItem('magazine', list);
                location.hash = `/InformationManagement/Magazine/Edit?id=${record.id}`;
              }} style={{ display: updatePowers ? 'inline-block' : 'none' }} > 编辑</a>
              <Divider type="vertical" />
              <a className="operation" onClick={() => {
              // const list = JSON.stringify(record);
              // window.sessionStorage.setItem('carousel', list);
              // location.hash = '/InformationManagement/Magazine/Content';
                this.exchange(record.id,null);
                const list = JSON.stringify(record);
                window.sessionStorage.setItem('magazine', list);
                contentTab = record.magazineSeriesName + '-' + record.name + '-' + record.periods + '-杂志目录';
                this.props.add('two',[{ title: contentTab, content: <Content  add={this.props.add} exchange={this.exchange}/>, key: '2' }]);
              }} style={{ display: mContentPowers ? 'inline-block' : 'none' }} > 杂志目录</a>
              <Divider type="vertical" />
              <a className="operation" onClick={() => {
              // const list = JSON.stringify(record);
              // window.sessionStorage.setItem('carousel', list);
              // location.hash = '/InformationManagement/Magazine/Article'
                this.exchange(record.id,null);
                const list = JSON.stringify(record);
                window.sessionStorage.setItem('magazine', list);
                contentTab = record.magazineSeriesName + '-' + record.name + '-' + record.periods + '-杂志目录';
                articleTab = record.magazineSeriesName + '-' + record.name + '-' + record.periods + '-杂志文章';
                this.props.add('one',[
                  { title: contentTab, content: <Content  add={this.props.add} exchange={this.exchange}/>, key: '2' },
                  { title: articleTab, content: <MagazineArticle  />, key: '3' }]);
              }} style={{ display: mContentPowers ? 'inline-block' : 'none' }} > 杂志文章</a>
              {/*<Divider type="vertical" />*/}
            </span>

          </div>;
        },
      },
    ];

    const search = [
      { key: 'type', label: '杂志系列', qFilter: 'Q=magazineSeriesId_S_EQ',type:'select',option: magazineSeriesOption },
      { key: 'isEnabled', label: '是否发布', qFilter: 'Q=ispublish_Z_EQ', type: 'select', option: isPublishOption },
    ];

    return (
    
        <div>
          <TableAndSearch columns={columns} url={'services/news/magazine/magazineList/get'} search={search}
            addBtn={createPowers ? { order: 1, url: '/InformationManagement/Magazine/Add' } : null}
            updateBtn={updatePowers ? {order:1} : null}
            deleteBtn={deletePowers ? { order: 2, url:'services/news/magazine/deleteMagazineByIdList/delete',field:'magazineIdList'} : null}
            typeId="Magazine"
            scroll={{width:1600}}
          />
          <Modal
            visible={this.state.previewVisible}
            onCancel={() => this.setState({ previewVisible: false })}
            footer={null}
            destroyOnClose>
            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
          </Modal>
        </div>
     
    );  
  }
}