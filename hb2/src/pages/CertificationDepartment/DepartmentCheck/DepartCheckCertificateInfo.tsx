import React, { Component } from 'react';
import { Card, Button, message } from 'antd';
import { createTdItem } from '@/utils/AntdUtil';
import { connect } from 'dva';
import { getPropsParams } from '@/utils/SystemUtil';
import BackButton from '@/components/BackButton';
import CertificateStatusEnum from '@/Enums/CertificateStatusEnum';
import CertificateFlagEnum from '@/Enums/CertificateFlagEnum';
import BusinessTypeEnum from '@/Enums/BusinessTypeEnum';
import { getUrlFromPath } from '@/utils/utils';
import CheckModal from './CheckModal';


@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['－－－/remove']),
}))

class DepartCheckCertificateInfo extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      data: {},
      status: '1',
    }
  }

  componentDidMount() {
    this.requestData()
  }

  private modal: CheckModal;

  private requestData = () => {
    const { id } = getPropsParams(this.props)
    if (!id) { return }
    this.props.dispatch(
      {
        type: 'DepartCheckCertificateList/search',
        payLoad: id,
        callBack: (res) => {
          console.log('res=', res)
          this.setState({ data: res.data })
        }
      }
    );
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
    //方便使用开始都用批量修改
    let arr = [{ ...payLoad }]
    this.props.dispatch(
      {
        type: 'DepartCheckCertificateList/updateCheckStatus',
        payLoad: arr,
        callBack: () => {
          window.history.back()
        }
      }
    );
  }

  render() {
    const { data = {} } = this.state
    return (
      <Card title={<span><span>证书详情</span><Button onClick={() => {
        window.history.back();
      }} type="primary" style={{ float: 'right' }}>返回</Button></span>}>
        <table className="InfoTable">
          <thead>
            <tr><th colSpan={2}>资质认定证书详情</th></tr>
          </thead>
          <tbody>
            <tr>
              {
                createTdItem('业务类型', `${BusinessTypeEnum.toString(data.businessType)}`)
              }
            </tr>
            <tr>
              {
                createTdItem('检测机构名称', `${data.orgName || ''}`)
              }
            </tr>
            <tr>
              {
                createTdItem('证书编号', `${data.certificateNumber || ''}`)
              }
            </tr>
            <tr>
              {
                createTdItem('证书名称', `${data.certificateName || ''}`)
              }
            </tr>
            <tr>
              {
                createTdItem('证书类型', `${data.certificateClass || ''}`)
              }
            </tr>
            <tr>
              {
                createTdItem('证书状况', `${CertificateFlagEnum.toString(data.certificateFlag)}`)
              }
            </tr>
            <tr>
              {
                createTdItem('产品数量', `${data.productCount || ''}`)
              }
            </tr>
            <tr>
              {
                createTdItem('参数数量', `${data.parameterCount || ''}`)
              }
            </tr>
            <tr>
              {
                createTdItem('证书颁发时间', `${data.issueTime || ''}`)
              }
            </tr>
            <tr>
              {
                createTdItem('有效截止日期', `${data.endTimes || ''}`)
              }
            </tr>
            <tr>
              {
                createTdItem('证书状态', `${CertificateStatusEnum.toString(data.certificateStatus)}`)
              }
            </tr>
            <tr>
              {
                createTdItem('证书附件',
                  <a href={getUrlFromPath(data.path)} download={data.certificateAccessory}>
                    {`${data.certificateAccessory || ''}`}
                  </a>
                )
              }
            </tr>
            <tr>
              {
                createTdItem('审核意见', `${data.x || ''}`)
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

export default DepartCheckCertificateInfo;