import React, {Component} from 'react';
import { message, Row, Col, Button, Upload } from 'antd';
import API_PREFIX from '../../apiprefix';
import {BEGIN} from '../../../../redux-root/action/table/table';
import { connect } from 'react-redux';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData: state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)


export default class ImportMember extends Component {

  //文件导入之前的校验函数
  beforeUpload = (file) => {

    //const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const suffix  = file.name.substr(file.name.lastIndexOf("."));
    if (suffix !== ".xls" && suffix !== ".xlsx"){
        //console.log('suffix', suffix);
        message.error('文件格式有误，必须为Excel文件');
    }
    return true;
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
      //console.log('uploading-----------');
    }
    if (info.file.response) {
      if(this.props.refreshScreen){
        this.props.refreshScreen();
      }
      if (info.file.response.status === 1 && info.file.response.root.object) {//导入文件成功
        let obj = info.file.response.root.object
        if(!obj.path&&obj.error == 0){//全部导入成功
          // message.success(info.file.name + ' 上传成功。', 3);
          message.success(`[${nmae}] 导入完成！新增${obj.success}条`, 3)
          this.props.getData(API_PREFIX + `${this.props.listurl}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
        }else if(obj.path&&obj.error > 0){//部分导入成功，不成功的导出
          // message.warning(info.file.name+'中不合格用户将会导出',8);
          message.warning(`[${info.file.name}] 导入完成！新增${obj.success}条,失败${obj.error}条,失败数据将导出，请更正后重试`, 8);
          let a = document.createElement('a');
          a.href=`${obj.path}`;
          // a.click();
          if (document.all) {
            a.click();
          } else {
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('click', true, true);
            a.dispatchEvent(evt);
          }
          this.props.getData(API_PREFIX + `${this.props.listurl}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`); 
        }
        
      } else if(info.file.response.status === 0) {
        message.error(info.file.response.errorMsg);
      }
    }

  }
  handleClick = (url, fileName) => {
    let a = document.createElement('a');
    a.href = url;
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
    return (
      <Row>
        <Col span={10}>
          <span style={{ color: 'red' }}>*</span>请选择导入文件
        </Col>
        <Col span={6}>
          <Upload
            name="file"
            action={API_PREFIX + this.props.importUrl}
            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            multiple={false}
            data={null}
            showUploadList={false}
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
          >
            <Button>选择文件</Button>
          </Upload>
        </Col>
        <Col span={6}>
          <Button onClick={this.handleClick.bind(this, this.props.downlodUrl, this.props.fileName)} className="but-tab" icon="download" style={{ float: 'right', marginTop: '4px' }}><a id="excel" herf="javascript:void(0);" >模板下载</a></Button>
        </Col>
      </Row>
    );
  }
}
