import React, { Component } from 'react';
import { Card, List, Button, Progress, Form } from 'antd';
import { connect } from 'dva';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import EditButton from '@/components/EditButton';
import { DOWNLOAD_API } from '@/services/api';
import SearchList from './SearchList';
import SearchTable from '@/components/SearchTable';
const classNames = require('./FileManage.less');
import { Context } from '@/components/SearchTable';

const FormItem = Form.Item;

const STEPS = [];

const editUrl = 'http://58.49.132.133:8088/OnlineEditorsExampleJava/EditorServlet?mode=edit&fileName='

@connect(({ loading }) => ({
  loading
}))
class FileManage extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state={
      fileList:null,
      fileLoading:true,
      selectFloderID:'',
      selectedFileList:{},
    }
    this.TABLE_COLUMNS = [
      {
        title: '图片名称',
        dataIndex: 'fileName',
        // width:'60%',
        // render: (text) => {
        //   return renderAttatch(text);
        // }
      },
      {
        title: '是否启用',
        // width:'30%',
        render: (text, record) => {
          return (
            <div className='controlsContainer'>
                  <Button icon="edit" onClick={()=>{
                    this.requestEditInfo(record,false)
                  }}>编辑</Button>
                  <a href={DOWNLOAD_API(record.filePath)} target="_blank">下载</a>
                  <Button icon="delete" type="danger" onClick={()=>{
                    this.props.dispatch({
                      type:'TaskManage/FileDelete',
                      payLoad:{
                        id:record.id,
                      },
                      callBack:(res)=>{
                        // callback(res)
                        this.requestFileList(this.state.selectFloderID,(res)=>{
                          console.log(res)
                          this.setState({
                            fileList:res.data.data,
                            fileLoading:true,
                          })
                        })
                      }
                    })
                  }} />
                </div>
          );
        }
      },
    ];
  }

  componentDidUpdate(){
    if(this.props.stepInfo.stepID && !this.state.fileList && this.state.fileLoading && this.props.stepInfo.floderList.fhStdDocTypeList){
      // this.requestFileList(this.props.stepInfo.floderList.fhStdDocTypeList[0].id,(res)=>{
      //   console.log(res)
      //   this.setState({
      //     fileList:res.data.data,
      //     fileLoading:true,
      //     selectFloderID:this.props.stepInfo.floderList.fhStdDocTypeList[0].id
      //   })
      // }))
      this.setState({
        fileLoading:false,
        selectFloderID:this.props.stepInfo.floderList.fhStdDocTypeList[0].id
      },()=>{
        this.searchTable.refresh()
      })
      for(let i=0;i<this.props.stepInfo.floderList.fhStdDocTypeList.length;i++) {
        // console.log(this.props.stepInfo.floderList.fhStdDocTypeList[i])
        const {selectedFileList} = this.state
        selectedFileList[this.props.stepInfo.floderList.fhStdDocTypeList[i].id] = []
        this.setState({
          selectedFileList,
        })
      }
    }
  }

  requestFileList=(id,callback)=>{
    this.setState({
      fileLoading:false
    })
    this.props.dispatch({
      type:'TaskManage/FileList',
      payLoad:{
        id,
      },
      callBack:(res)=>{
        callback(res)
      }
    })
  }

  requestEditInfo=(record,isNew)=>{
    isNew ? this.props.dispatch({
      type:'TaskManage/FileDetailGet',
      payLoad:{
        // id:record.id,
        filePath:record.filePath,
        fileName:record.fileName,
      },
      callBack:(res)=>{
        // callback(res)
        console.log(res.data.result)
        if(res.data.result) {
          console.log(123)
          window.location.href = `${editUrl}${res.fileName}`;
        }
      }
    }) : this.props.dispatch({
      type:'TaskManage/FileEditCheck',
      payLoad:{
        id:record.id,
      },
      callBack:(res)=>{
        // callback(res)
        console.log(res.data.result)
        if(res.data.result) {
          console.log(123)
          this.props.dispatch({
            type:'TaskManage/FileDetailGet',
            payLoad:{
              // id:record.id,
              filePath:record.filePath,
              fileName:record.fileName,
            },
            callBack:(res)=>{
              // callback(res)
              console.log(res.data.result)
              if(res.data.result) {
                console.log(123)
                window.location.href = `${editUrl}${res.fileName}`;
              }
            }
          })
        }
      }
    })
  }

  requestFileUpload=(params,callback)=>{
    this.props.dispatch({
      type:'TaskManage/FileUpload',
      payLoad:{
        ...params,
      },
      callBack:(res)=>{
        callback(res)
      }
    })
  }
  

  searchCreater=(formValues, pageSize, current)=>{
    // return `/services/indexManage/image/list/${current}/${pageSize}?Q=module_EQ=index`;
    // return this.props.stepInfo.stepID && this.props.stepInfo.floderList.fhStdDocTypeList ? `/services/standard/fhstdfile/list/${current}/${pageSize}?Q=typeId_EQ=${this.props.stepInfo.stepID && !this.state.fileList && this.state.fileLoading && this.props.stepInfo.floderList.fhStdDocTypeList ? this.props.stepInfo.floderList.fhStdDocTypeList[0].id:''}&Q=deleteStatus_EQ=1` : ''
    return `/services/standard/fhstdfile/list/${current}/${pageSize}?Q=typeId_EQ=${this.state.selectFloderID}&Q=deleteStatus_EQ=1`
  }

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    //this.props.stepInfo.floderList.fhStdDocTypeList
    // console.log(this.props.stepInfo.floderList)
    const {fileList} = this.state
    const {  selectedFileList, selectFloderID } = this.state;
    return (
      <Card
        id={this.props.id}
        title='项目文档'
        className={`${classNames.FileManage} ${this.props.className}`}
        extra={
          <Button
            onClick={() => {
              if (this.props.closeHandler) {
                this.setState({
                  fileList:null,
                  fileLoading:true,
                  selectedFileList:{},
                })
                this.props.closeHandler();
              }
            }}
          >
            关闭
        </Button>}
      >
        <div className={classNames.Left}>
          <List
            header={this.props.stepInfo.floderList?this.props.stepInfo.floderList.processName:''}
            dataSource={this.props.stepInfo.floderList && this.props.stepInfo.floderList.fhStdDocTypeList?this.props.stepInfo.floderList.fhStdDocTypeList:STEPS}
            renderItem={(item) => {
              return (
                <li className={classNames.StepItem} onClick={()=>{
                  console.log(2345)
                  this.setState({
                    selectFloderID:item.id
                  },()=>{
                    this.searchTable.refresh()
                  })
                  // this.requestFileList(item.id,(res)=>{
                  //   console.log(res)
                  //   this.setState({
                  //     fileList:res.data.data,
                  //     fileLoading:true,
                  //   })
                  // })
                }}>{item.typeName}</li>
              );
            }}
          />
          <footer>
            <h1>完成度</h1>
            <Progress percent={this.props.stepInfo.stepPrecent} strokeWidth={16} size="small" />
          </footer>
          <Button type="primary" style={{margin:10}} onClick={()=>{
            // console.log('sb')
            this.props.dispatch({
              type:'TaskManage/FileList',
              payLoad:{
                id:111,
              },
              callBack:(res)=>{
                // callback(res)
              }
            })
          }}>提交审核</Button>
        </div>
        <SearchTable
          getInstance={(target) => {this.searchTable = target}}
          formItems={SearchForm}
          columns={this.TABLE_COLUMNS}
          searchCreater={this.searchCreater}
          style={{
            flex:1,
            width:10,
          }}
          pageSize={5}
          // selectedAble
          // rowSelection={rowSelection}
          tableProps={{
            showHeader:false,
            rowSelection:{
              selectedRows:selectedFileList[selectFloderID],
              onChange:(selectedRowKeys, selectedRows)=>{
                // console.log(2234)
                const selectedFile = selectedFileList
                selectedFile[selectFloderID] = selectedRows
                this.setState({
                  selectedFileList:selectedFile,
                })
              },
            },//{rowSelection},
          }}
          formItemsProps={{
            stepInfo:this.props.stepInfo,
            selectFloderID:this.state.selectFloderID,
            // requestFileList:this.requestFileList,
            requestFileUpload: this.requestFileUpload,
            requestEditInfo:this.requestEditInfo
          }}
          // transData={this.transData}
        />
      </Card >
    );
  }
}

// @connect(({ loading }) => ({
//   loading
// }))
class SearchForm extends Component {
  static contextType = Context;
  render() {
    return (
      <div className='divAreaContainer controlsContainer'>
        <Button
          icon="plus"
          type="primary"
          onClick={() => {
            // window.location.href = `${editUrl}6355`;
            this.props.requestEditInfo({
              // id:'6355',
              filePath:'6355',
              fileName:'base.docx',
            },true)
          }}
        >
          新建
        </Button>
        <LimitUpload uploadProps={{showUploadList:false}} max={0} onFileUploadSuccess={(file)=>{
            this.props.requestFileUpload({
              typeId:this.props.selectFloderID,
                filePath:file.response.entity[0].id,
                fileName:file.response.entity[0].fileName,
                stdId:this.props.stepInfo.taskID,
            },()=>{
              if (this.context.refresh) {
                this.context.refresh();
              }
            })
            // return true
          }} />
      </div>
    )
  }
}

export default FileManage;