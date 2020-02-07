import React, { Component } from 'react';
import { Row, Col, Upload, Button,Message} from 'antd';
import ServiceApi from '../../content/apiprefix';
import { connect } from 'react-redux';
import {BEGIN,} from '../../../redux-root/action';
import {exportExcelService} from '../../content/myFetch';
@connect(
  state => ({
    pageData: state.pageData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class ImportWrapper extends Component {
  handleClick=(e,path)=>{

    exportExcelService(ServiceApi+path, null, this.props.title); 
  }
  beforeUpload = (file) => {
    const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isExcel) {
      console.log('isExcel', isExcel);
      Message.error('文件格式有误，必须为Excel文件');
    }
    return isExcel;
  }
  //
  handleChange = (info) => {
    console.log('Changeinfo', info);
    if (info.file.status === 'uploading') {
      console.log('uploading-----------');
    }
    if (info.file.response) {
      if (info.file.response.retCode == 1) {
        Message.success(info.file.name + ' 上传成功。', 3);
        this.props.getData(ServiceApi +`services/activity/topic/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      } else if (info.file.response.retCode == 0) {
        console.log('info.file.response.root', info.file.response.root);
        let mess = '';
        console.log('info.file.response.root', info.file.response.root);
        if (info.file.response.root.list != undefined) {
          info.file.response.root.list.map((item, index) => {
            mess = mess + item;
          });
        } else {
          mess = info.file.response.retMsg;
        }
        console.log('mess', mess);
        Message.error('导入失败，' + '失败原因：' + mess, 5);
      }
    }
  }
  render(){
    return (<Row>
      <Col span={10}>
        <span style={{ color: 'red' }}>*</span>请选择导入文件
      </Col>
      <Col span={6}>
        <Upload
          name="file"
          action={ServiceApi + this.props.uploadUrl}
          accept="application/vnd.ms-excel"
          multiple={false}
          showUploadList={false}
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
        >
          <Button>选择文件</Button>
        </Upload>
      </Col>
      <Col span={6}>
        <Button onClick={(e)=>this.handleClick(e, this.props.downloadUrl)} className="but-tab" icon="download" style={{ float: 'right', marginTop: '4px' }}>模板下载</Button>
      </Col>
    </Row>);
  }
}