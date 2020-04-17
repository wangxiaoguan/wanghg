import React, { Component } from 'react';
import { Card, Button, message } from 'antd';
import { createTdItem,renderAttatch } from '@/utils/AntdUtil';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import { connect } from 'dva';
import { getPropsParams } from '@/utils/SystemUtil';
import BusinessTypeEnum from '@/Enums/BusinessTypeEnum';
import BackButton from '@/components/BackButton';
import { getUrlFromPath } from '@/utils/utils';
import CheckModal from './CheckModal';
 
@connect(({ loading }) => (
  {
    loading
  }
))
class DepartCheckInstrumentInfo extends Component<IDispatchInterface, any> {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      status: '1',

    }
  }

  componentDidMount() {
    this.requestData();
  }

  requestData() {
    const params = getPropsParams(this.props);
    if (params.id) {
      this.props.dispatch(
        {
          type: 'DepartCheckInstrument/search',
          payLoad: params.id,
          callBack: (res) => {
            this.setState({ data: res.data });
          }
        }
      );
    }
  }

  onOk = (comments) => {
    if (!comments || comments.length === 0) {
      message.error('请填写审核意见')
      return
    }
    const payLoad = {
      id: getPropsParams(this.props).id,
      checkStatus: this.state.status,
      comments
    }
    this.update(payLoad);
  }


  update = (payLoad) => {
    const params = `${payLoad.id}/${payLoad.checkStatus}/${payLoad.comments}`
    this.props.dispatch(
      {
        type: 'DepartCheckInstrument/updateCheckStatus',
        payLoad: params,
        callBack: () => {
          window.history.back()
        }
      }
    );
  }

  private modal: CheckModal;


  render() {
    const data = this.state.data || {};
    return (
      <Card title='设备仪器详情'>
        <table className="InfoTable">
          <thead>
            <tr><th colSpan={2}>设备一览表详情</th></tr>
          </thead>
          <tbody>
            <tr>
              {
                createTdItem('业务类型', BusinessTypeEnum.toString(data.businessType))
              }
            </tr>
            <tr>
              {
                createTdItem('检测机构名称', data.orgName || '')
              }
            </tr>
            <tr>
              {
                createTdItem('仪器设备名称', data.apparatusName || '')
              }
            </tr>
            <tr>
              {
                createTdItem('标准编号', data.standardNumber || '')
              }
            </tr>
            <tr>
              {
                createTdItem('型号/规格', data.model || '')
              }
            </tr>
            <tr>
              {
                createTdItem('有效截止日期', data.validTime || '')
              }
            </tr>
            <tr>
              {
                createTdItem('证书附件',renderAttatch(data.attachInfo))
              }
            </tr>
          </tbody>
        </table>
        <div className="divAreaContainer controlsContainer">
          <Button type="primary" onClick={() => {
            this.setState({ status: '1' }, () => {
              this.modal.show()
            })
          }}>审核通过</Button>
          <Button type="primary" onClick={() => {
            this.setState({ status: '2' }, () => {
              this.modal.show()
            })
          }}>审核不通过</Button>
          <BackButton />
        </div>
        <CheckModal getInstance={(target) => this.modal = target} onOk={this.onOk} />
      </Card>
    );
  }
}

export default DepartCheckInstrumentInfo;