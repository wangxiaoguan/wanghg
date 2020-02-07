import React, { Component } from 'react';
import { Row, Col, Upload, Button, Message } from 'antd';
import API_PREFIX from '../../content/apiprefix';
import { connect } from 'react-redux';
import reqwest from 'reqwest';
import {
  BEGIN,
} from '../../../redux-root/action/table/table';
@connect(
  state => ({
    pageData: state.table.pageData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class ImportPart1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileState: false,
      fileList: [],
      uploading: false,
    };
  }

  componentDidMount() {
    console.log("wwwwww", this.props);
    this.props.onRef(this)
  }

  // 上传文件的方法
  UploadChange = () => {
    const { fileList } = this.state;
    if (fileList.length == 0) {
      message.error("请选择上传文件")
      return false;
    }
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });

    this.setState({
      uploading: true,
    });
    reqwest({
      url: API_PREFIX + this.props.importUrl,
      method: 'post',
      processData: false,
      data: formData,
      success: file => {
        if (file.sucess == true) {
          let name = fileList[0] ? fileList[0].name : ''
          if (file.entity.error > 0) {
            Message.success(`[${name}] 导入完成！新增${file.entity.success},失败${file.entity.error}条,失败数据将导出，请更正后重试`);
            let a = document.createElement('a');
            a.href = file.entity.path;
            let fileName = "不合格题目导出";
            if (fileName == null) {
              fileName = 'default_excel_name';
            }
            a.download = fileName + '.xls';
            if (document.all) {
              a.click();
            } else {
              let evt = document.createEvent('MouseEvents');
              evt.initEvent('click', true, true);
              a.dispatchEvent(evt);
            }
          } else {
            Message.success(`[${name}] 导入完成！新增${file.entity.success}条`, 3)
          }
          this.props.getSuccessResult(file.entity.successResult)
        } else {
          Message.error("导出失败")
        }

        this.setState({
          fileList: [],
          uploading: false,
        });
      },
      error: err => {
        Message.error('导入失败')
        console.log('哈哈哈哈哈哈哈哈哈哈哈哈', err)
      }
    });
  };

  //文件导入之前的校验函数
  beforeUpload = (file) => {
    console.log("file", file);
    // const isExcel = file.type === 'application/vnd.ms-excel'|| file.type ==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    // if (!isExcel) {
    //   console.log('isExcel',isExcel);
    //   Message.error('文件格式有误，必须为Excel文件');
    // }
    // 20181219 彭元军  苹果电脑上传时，type为空 故修改判断方式
    const suffix = file.name.substr(file.name.lastIndexOf("."));
    if (suffix !== ".xls" && suffix !== ".xlsx") {
      //console.log('suffix', suffix);
      Message.error('文件格式有误，必须为Excel文件');
    }
    return true;

    // return isExcel ;
  }
  //
  //文件导入的  onChange处理函数
  handleChange = (info) => {
    console.log('Changeinfo', info);

    if (info.file.status === 'uploading') {
      // this.setState(
      //     {
      //       showBeforeImortIcon:true
      //     }
      // )
      console.log('uploading-----------');
    }
    if (info.file.response) {
      if (info.file.response.entity.success >= 1 && info.file.response.entity.error == 0) {
        Message.success(info.file.name + ' 上传成功。', 3);
        if (this.props.listurl) {
          this.props.getData(`${this.props.listurl}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
        }
        if (this.props.getSuccessResult) {
          this.props.getSuccessResult(info.file.response.entity.successResult);
        }
        this.props.hideModel();
      } else if (info.file.response.entity.error > 0) {
        // console.log("info.file.response.root",info.file.response.root);
        // var mess='';
        // console.log("info.file.response.root",info.file.response.root);
        // if(info.file.response.root.list!=undefined){
        //   info.file.response.root.list.map((item,index)=>{
        //     mess=mess+item;
        //   });
        // }else{
        //   mess=info.file.response.retMsg;
        // }
        // console.log("mess",mess);
        // Message.error('导入失败，' + '失败原因：' + mess, 0.5 );
        let mess = info.file.response.entity.error;
        Message.error('导入失败，' + '失败条数：' + mess, 0.5);
        Message.warning(info.file.name + '中不合格数据将会导出', 3);
        this.props.hideModel();
        this.setState({ fileState: false });
        let a = document.createElement('a');
        a.href = `${info.file.response.entity.path}`;
        //   a.click();
        //   a.download = fileName;
        if (document.all) {
          a.click();
        } else {
          let evt = document.createEvent('MouseEvents');
          evt.initEvent('click', true, true);
          a.dispatchEvent(evt);
        }

      }
    }
  }
  handleClick = (url) => {
    /*    var $eleForm = $("<form method='get'></form>");
    
        $eleForm.attr("action",url);
    
        $("#excel").append($eleForm);
    
        //提交表单，实现下载
        $eleForm.submit();*/
    console.log('this.props====>', this.props);
    let a = document.createElement('a');
    a.href = url;
    let fileName = this.props.fileName;
    if (fileName == null) {
      fileName = 'default_excel_name';
    }
    a.download = fileName + '.xls';
    if (document.all) {
      a.click();
    } else {
      let evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, true);
      a.dispatchEvent(evt);
    }
  }
  render() {
    const { fileList, uploading } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        if (fileList.length > 0) {
          Message.error("一次只能上传一个文件")
          return false;
        }
        const isExcel =
          file.type === 'application/vnd.ms-excel' ||
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isExcel) {
          console.log('isExcel', isExcel);
          message.error('文件格式有误，必须为Excel文件');
        }
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return isExcel;
      },
      fileList,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    };

    return (
      <Row>
        <Col span={10}>
          <span style={{ color: 'red' }}>*</span>请选择导入文件
        </Col>
        {/* <Col span={6}>
          <Upload
            name="file"
            action= {API_PREFIX+this.props.importUrl}
            accept="application/vnd.ms-excel"
            multiple= {false}
            data={null}
            showUploadList={false}
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
          >
            <Button disabled={this.state.fileState}>选择文件</Button>
          </Upload>
        </Col> */}

        <Col span={24} style={{ marginBottom: "40px" }}>
          <Col span={6}>
            <Upload {...props} name="file" accept=".xls,.xlsx">
              <Button>选择文件</Button>
            </Upload>
          </Col>
          {/* <Col span={6}>
              <Button
                style={{ marginLeft: 20 }}
                onClick={this.UploadChange}
                disabled={this.state.fileList.length === 0}
                loading={props.uploading}
              >
                确定
              </Button>
            </Col> */}
        </Col>

        <Col span={6}>
          <Button onClick={this.handleClick.bind(this, this.props.downlodUrl)} className="but-tab" icon="download" style={{ float: 'right', marginTop: '4px' }}><a id="excel" herf="javascript:void(0);" >模板下载</a></Button>
        </Col>
      </Row>
    );
  }
}