import React, { Component } from 'react';
import { Card } from 'antd';
import BackButton from '@/components/BackButton';
import { createTdItem } from '@/utils/AntdUtil';
import { getPropsParams } from '@/utils/SystemUtil';
import { connect } from 'dva';
import CertificateStatusEnum from '@/Enums/CertificateStatusEnum';
import CertificateFlagEnum from '@/Enums/CertificateFlagEnum';
import { getUrlFromPath } from '@/utils/utils';

interface IDepartInfoTableState {
  departmentData?: any;
  certificateData?: any
}

@connect(({ loading }) => ({
  // loadingDelete: Boolean(loading.effects['－－－/remove']),
}))
class CertificateInfo extends Component<any, IDepartInfoTableState> {

  constructor(props) {
    super(props);
    this.state = {
      departmentData: {},
      certificateData: {},
    }
  }

  componentDidMount() {
    this.requestData()
  }

  private requestData = () => {
    let id = getPropsParams(this.props).id;
    if (id) {
      this.props.dispatch(
        {
          type: 'DepartCheckCertificateList/search',
          payLoad: id,
          callBack: (res) => {
            console.log(res);
            this.setState({ certificateData: res.data || {} });
            if (res.data.id) {
              this.props.dispatch(
                {
                  type: 'DepartCheckCertificateList/orgSearch',
                  payLoad: res.data.orgId,
                  callBack: (res) => {
                    console.log(res);
                    this.setState({ departmentData: res.data || {} });
                  }
                }
              )
            }
          }
        }
      )
    }
  }

  render() {
    const { certificateData, departmentData } = this.state
    return (
      <Card title={<span><span>证书详情</span><BackButton type="primary" style={{ float: 'right' }} /></span>}>
        <table className="InfoTable">
          <thead>
            <tr>
              <th colSpan={8}>检测机构基本信息</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                createTdItem('检测机构名称', `${departmentData.orgName || ''}`, 1, 7)
              }
            </tr>
            <tr>
              {
                createTdItem('检测机构地址', `${departmentData.orgAddr || ''}`, 1, 7)
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('所属行政区划', `${departmentData.orgDivide || ''}`),
                  createTdItem('邮编', `${departmentData.postCode || ''}`),
                  createTdItem('传真', `${departmentData.fax || ''}`),
                  createTdItem('EMail', `${departmentData.email || ''}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('负责人', `${departmentData.principal || ''}`),
                  createTdItem('负责人职务', `${departmentData.principalDuty || ''}`),
                  createTdItem('负责人电话', `${departmentData.principalTel || ''}`),
                  createTdItem('负责人手机', `${departmentData.principalPhone || ''}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('联络人', `${departmentData.contact || ''}`),
                  createTdItem('联络人职务', `${departmentData.contactDuty || ''}`),
                  createTdItem('联络人电话', `${departmentData.contactTel || ''}`),
                  createTdItem('联络人手机', `${departmentData.contactPhone || ''}`),
                ]
              }
            </tr>
          </tbody>
        </table>
        {/* 证书信息 */}
        <table className="InfoTable">
          <thead>
            <tr>
              <th colSpan={8}>证书信息</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                createTdItem('证书编号', `${certificateData.certificateNumber || ''}`, 1, 5)
              }
            </tr>
            <tr>
              {
                createTdItem('证书名称', `${certificateData.certificateName || ''}`, 1, 5)
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('证书类型', `${certificateData.certificateClass || ''}`),
                  createTdItem('证书状况', `${CertificateFlagEnum.toString(certificateData.certificateFlag)}`),
                  createTdItem('证书颁发时间', `${certificateData.issueTime || ''}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('产品数量', `${certificateData.productCount || ''}`),
                  createTdItem('参数数量', `${certificateData.parameterCount || ''}`),
                  createTdItem('证书附件',
                    <a href={getUrlFromPath(certificateData.path)} download={certificateData.certificateAccessory}>
                      {`${certificateData.certificateAccessory || ''}`}
                    </a>
                  ),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('有效截止时间', `${certificateData.endTimes}`),
                  createTdItem('证书状态', `${CertificateStatusEnum.toString(certificateData.certificateStatus)}`),
                  createTdItem('', ''),
                ]
              }
            </tr>
          </tbody>
        </table>
      </Card>
    );
  }
}

export default CertificateInfo;