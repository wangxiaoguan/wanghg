import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString } from '../../../myFetch';
import { connect } from 'react-redux';
import { Modal,Button,Row,Col,Upload} from 'antd';
import { ServiceApi,masterUrl} from '../../../apiprefix';
import ImportWrapper from '../../../../component/import/import';
@connect(state => ({
  powers: state.powers,
}))
export default class Topic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activityId: GetQueryString(location.hash, ['id']).id || '',
      importModal:false,
    };
  }
  render() {
    let powers = this.props.powers;
    let createPowers = powers && powers['20002.22004.001'];
    let updatePowers = powers && powers['20002.22004.002'];
    let deletePowers = powers && powers['20002.22004.004'];
    // let importPowers = powers && powers['20002.22003.201'];
    let importPowers = true;
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '题目名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '题目类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record, index) => {
          if (record.type === 1) {
            return '单选';
          } else if (record.type === 2) {
            return '多选';
          }
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '操作',
        key: 'x',
        render: (text, record, index) => {
          return (
            <div>
              <a
                className="operation"
                href={`#/EventManagement/Vote/TopicEdit?isEdit=true&id=${
                  record.id
                }&activityId=${this.state.activityId}`}
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
        qFilter: 'Q=title_S_LK',
        type: 'input',
      },
      {
        key: 'type',
        label: '题目类型',
        qFilter: 'Q=type_I_EQ',
        type: 'select',
        option: [
          { key: '', value: '全部' },
          { key: 1, value: '单选' },
          { key: 2, value: '多选' },
        ],
      },
    ];
    
    return (
      <div>
        <TableAndSearch
          columns={columns}
          type={'vote'}
          search={search}
          addBtn={createPowers?{
            order: 1,
            url: `/EventManagement/Vote/TopicAdd?isEdit=false&activityId=${
              this.state.activityId
            }`,
          }:null}
          deleteBtn={deletePowers?{ order: 2, url: 'services/activity/voteActivity/topic/deleteTopics' }:null}
          url={'services/activity/voteActivity/topic/list'}
          urlfilter={`Q=activityid_S_EQ=${this.state.activityId}`}
          /* importBtn={importPowers?{
            order: 3,
            url: `services/activity/import/topics?activityId=${
              this.state.activityId
            }`,
            label: '批量导入题目',
          }:null} */
          
          //注释投票活动设置投票题目的批量导入题目
          // customBtn={importPowers?{
          //   order: 3, label: '批量导入题目', onClick: () => {
          //     this.setState({ importModal: true });
          //   }, className: 'resetBtn',
          // }:null}
          goBackBtn={{order:4,label:"返回",url:"EventManagement/Vote/List"}}
        />
        <Modal
          title="批量导入题目"
          visible={this.state.importModal}
          footer={<Button onClick={() => this.setState({ importModal: false })}>返回</Button>}
          onCancel={()=>this.setState({ importModal: false })}
          destroyOnClose={true}
        >
       {/*  <ImportPart2 title="导入题目模板" 
          uploadUrl={`services/activity/import/topics?activityId=${this.state.activityId}`}  
          downlodUrl={'/services/activity/voteActivity/template'} />*/}
        <ImportWrapper title="导入题目模板" uploadUrl={`services/activity/import/topics?activityId=${this.state.activityId}`} downloadUrl={'/services/activity/voteActivity/template'} />
        </Modal>
      </div>
    );
  }
}
export class ImportPart2 extends Component{
  constructor(props){
    super(props);
  }
  //文件导入之前的校验函数
  beforeUpload=(file)=>{

    const isExcel = file.type === 'application/vnd.ms-excel'|| file.type ==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isExcel) {
      console.log('isExcel',isExcel);
      message.error('文件格式有误，必须为Excel文件');
    }
    return isExcel ;
  }
  //
  //文件导入的  onChange处理函数
  handleChange=(info)=>{
    console.log('Changeinfo', info);

    if(info.file.status=== 'uploading'){
      // this.setState(
      //     {
      //       showBeforeImortIcon:true
      //     }
      // )
      console.log('uploading-----------');
    }
    if(info.file.response){
      if ( info.file.response.retCode == 1 ) {
        Message.success( info.file.name + ' 上传成功。', 3 );
        this.props.getData(`${this.props.listurl}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      } else if ( info.file.response.retCode == 0 ) {
        console.log("info.file.response.root",info.file.response.root);
        var mess='';
        console.log("info.file.response.root",info.file.response.root);
        if(info.file.response.root.list!=undefined){
          info.file.response.root.list.map((item,index)=>{
            mess=mess+item;
          });
        }else{
          mess=info.file.response.retMsg;
        }
        console.log("mess",mess);
        Message.error('导入失败，' + '失败原因：' + mess, 5 );
      }
    }

  }
  handleClick=(url)=>{
/*    var $eleForm = $("<form method='get'></form>");

    $eleForm.attr("action",url);

    $("#excel").append($eleForm);

    //提交表单，实现下载
    $eleForm.submit();*/
    let a = document.createElement('a');
    a.href = url;
    let fileName = null;
    if(fileName == null){
      fileName = 'default_excel_name';
    }
    a.download = fileName+'.xls';
    if (document.all) {
      a.click();
    } else {
      let evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, true);
      a.dispatchEvent(evt);
    }
  }
  render(){
    return(
      <Row>
        <Col span={10}>
          <span style={{color:'red'}}>*</span>请选择导入文件
        </Col>
        <Col span={6}>
          <Upload
            name="file"
            action= {ServiceApi+this.props.uploadUrl}
            accept="application/vnd.ms-excel"
            multiple= {false}
            data={null}
            showUploadList={false}
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
          >
            <Button>选择文件</Button>
          </Upload>
        </Col>
        <Col span={6}>
          <Button onClick={this.handleClick.bind(this,this.props.downlodUrl)} className="but-tab" icon="download" style={{float:'right',marginTop:'4px'}}><a id="excel" herf="javascript:void(0);" >模板下载</a></Button>
        </Col>
      </Row>
    );
  }
}