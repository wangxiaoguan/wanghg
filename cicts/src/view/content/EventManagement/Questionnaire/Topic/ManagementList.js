import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString } from '../../../myFetch';
import { Modal,Button,Row,Col,Upload,Table,Message} from 'antd';
import { connect } from 'react-redux';
import { Divider} from 'antd';
import API_PREFIX from '../../../apiprefix';
import ImportWrapper from '../../../../component/import/import';
import ImportPart1 from '../../ImportPart1';
import { BEGIN } from '../../../../../redux-root/action/table/table';
@connect(state => ({
  powers: state.powers,
}),  dispatch => ({
  getData: n => dispatch(BEGIN(n)),
}))
export default class List extends Component {
  constructor(props) {
    super(props);
    let activeKey = GetQueryString(location.hash, ['activeKey']).activeKey || '0';
    this.state = {
      activityId: GetQueryString(location.hash, ['id']).id || '',
      importModal:false,
      activeKey:String(activeKey),
      tenantId : window.sessionStorage.getItem("tenantId") || "",
    };
  }
  hideModel = () => {
    this.setState({importModal: false});
  }

 // 父组件调用子组件的方法
 onRef = (ref) => {
  this.child = ref
}

  //确定用户导入
  handleImportModalOk = () => {
    this.child.UploadChange();
    this.setState({
      importModal: false,
    });
  }
  //取消用户导入
  handleImportModalCancel = () => {
    this.setState({
      importModal: false,
    });
  }

 stop = () => {
    console.log("点击了");
  }
  
  getSuccessResult=(selectedData) => {
    this.props.getData(API_PREFIX + `services/web/activity/questiontitle/getQuestionTopic/1/10?Q=tenantId=${this.state.tenantId}`);
  }


  render() {
    let powers = this.props.powers;
    let createPowers = powers && powers['20002.22006.001'];//新建
    let updatePowers = powers && powers['20002.22006.002'];//修改
    let deletePowers = powers && powers['20002.22006.004'];//删除
    let importPowers= powers && powers['20002.22006.201'];//删除
    let  {tenantId}=this.state;
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '题目名称',
        dataIndex: 'titleName',
        key: 'titleName',
      },
      {
        title: '题目类型',
        dataIndex: 'titleType',
        key: 'titleType',
        render: (text, record, index) => {
          if (record.titleType === 1) {
            return '单选';
          } else if (record.titleType === 2) {
            return '多选';
          }else if(record.titleType===3){
            return '问答';
          }
        },
      },
      {
        title: '显示顺序',
        dataIndex: 'showIndex',
        key: 'showIndex',
      },
      // {
      //   title: '创建时间',
      //   dataIndex: 'createDate',
      //   key: 'createDate',
      // },
      {
        title: '操作',
        key: 'x',
        render: (text, record, index) => {
          return (
            <div>
              <a
                className="operation"
                href={
                  GetQueryString(location.hash, ['activeKey']).activeKey==1?
                  `#/EventManagement/Questionnaire/TopicManagementEdit?isEdit=true&id=${
                    record.id
                  }&activityId=${this.state.activityId}&questionTop=questionTop`
                  :
                  `#/EventManagement/Questionnaire/TopicManagementEdit?isEdit=true&id=${
                  record.id
                }&activityId=${this.state.activityId}`
              }
                style={{ display: updatePowers ? 'inline-block' : 'none' }}
              >
                编辑
              </a>
        
            </div>
          );
        },
      },
    ];
    const search = [
      {
        key: 'title',
        label: '题目名称',
        qFilter: 'Q=titleName',
        type: 'input',
      },
      {
        key: 'type',
        label: '题目类型',
        qFilter: 'Q=titleType',
        type: 'select',
        option: [
          { key: '', value: '全部' },
          { key: 1, value: '单选' },
          { key: 2, value: '多选' },
          { key: 3, value: '问答' },
        ],
      },
    ];
    return (
      <div>
        <TableAndSearch
          columns={columns}
          search={search}
          type=""
          addBtn={createPowers?
            GetQueryString(location.hash, ['activeKey']).activeKey==1?null:
            {
            order: 1,
            url: `/EventManagement/Questionnaire/TopicManagementAdd?isEdit=false&activityId=${
              this.state.activityId
            }`,
          }:null}
          customBtn={importPowers ?{ order: 3, label: '批量导入题目', onClick:()=>{this.setState({importModal:true});
        }, className: 'resetBtn' } :null}
          deleteBtn={deletePowers?
            GetQueryString(location.hash, ['activeKey']).activeKey==1?null:
            { order: 2, url: 'services/web/activity/questiontitle/batchDeleteTitleInfo' }:null}
          // deleteBtn={ order: 2, url: 'services/activity/topic/deleteTopics' }
         url={`services/web/activity/questiontitle/getQuestionTopic`}
          ////url={`services/web/activity/votingtitle/getQuestionTopic`}
          urlfilter={`Q=tenantId=${tenantId}`}  
        />
         <Modal
          title="批量导入题目"
          cancelText="返回"
          okText="确定"
          visible={this.state.importModal}
          // footer={null}
          onOk={this.handleImportModalOk}
          // onCancel={this.handleImportModalCancel}
          onCancel={this.handleImportModalCancel}
          // onCancel={()=>this.setState({ importModal: false })}
          destroyOnClose={true}
        >
        <ImportPart1
          onRef={this.onRef}
           importUrl={`services/web/activity/questiontitle/importQuestionTitle`}
           listurl={`${API_PREFIX}services/web/activity/questiontitle/getQuestionTopic`}
           downlodUrl={ `${API_PREFIX}services/web/activity/questiontitle/titletemplate`}
           fileName='导入题目模板'
           getSuccessResult={this.getSuccessResult}
           hideModel={this.hideModel}
           />
        </Modal>
      </div>
    );
  }
}

