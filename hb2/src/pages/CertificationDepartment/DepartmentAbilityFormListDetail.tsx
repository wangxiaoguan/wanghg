import React, { Component } from 'react';
import { Card, Tabs } from 'antd';
import SearchTable from '@/components/SearchTable';
import BackButton from '@/components/BackButton';
import CertificateStatusEnum from '@/Enums/CertificateStatusEnum';
import CertificateFlagEnum from '@/Enums/CertificateFlagEnum';
import CheckCaseEnum from '@/Enums/CheckCaseEnum';
import StandardStatusEnum from '@/Enums/StandardStatusEnum';
import { getPropsParams } from '@/utils/SystemUtil';
import { createTdItem } from '@/utils/AntdUtil';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import { createSearchString } from '@/utils/SystemUtil';
import { getUrlFromPath } from '@/utils/utils';

const TITLE = '检测机构能力表详情';

const TAB_PARAMS = [
  {
    key: '1',
    title: '全部',
    search: {

    }
  },
  {
    key: '2',
    title: '检测产品',
    search: {
      checkType: '1'
    }
  },
  {
    key: '3',
    title: '检测参数',
    search: {
      checkType: '2'
    }
  }
]

// const EDIT_HASH = '－－－';
/**
 * 检测机构能力查询
 */
@connect(({ loading }) => ({
  loading
}))
class DepartmentAbilityFormListDetail extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [
    {
      title: '检测项目类别',
      dataIndex: 'proType',
    },
    {
      title: '检测项目名称',
      dataIndex: 'preName',
    },
    {
      title: '检测参数名称',
      dataIndex: 'parName',
    },
    {
      title: '标准名称及编号(含年代号)',
      render: (_, record) => {
        const standardName = record.standardName ? `<<${record.standardName}>>` : ''
        return (
          <a>{`${standardName} ${record.standardNum || ''}`}</a>
        );
      }
    },
    {
      title: '限制范围或说明',
      dataIndex: 'bound',
    },
    {
      title: '检查情况',
      dataIndex: 'checkCase',
      render: (text, record) => {
        return CheckCaseEnum.toString(record.checkCase);
      }
    },
    {
      title: '标准状态',
      dataIndex: 'state',
      render: (text, record) => {
        return StandardStatusEnum.toString(record.state);
      }
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      certificateData: {},
    };
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
            this.setState({ certificateData: res.data || {} });
          }
        }
      )
    }
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    console.log('searchCreater', values)
    return `/services/exam/fhexamcapacity/list/${current}/${pageSize}/${createSearchString(values)}`;
  }

  render() {
    const { certificateData } = this.state
    let id = getPropsParams(this.props).id;
    return (
      <Card title={
        <span>
            <span>{TITLE}</span>
            <BackButton type="primary" style={{ float: 'right' }} />
          </span>
      }>
        <table className="InfoTable">
          <thead>
            <tr>
              <th colSpan={8}>证书信息</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                createTdItem('检测机构名称', `${certificateData.orgName || ''}`, 1, 7)
              }
            </tr>
            <tr>
              {
                createTdItem('检测机构地址', `${certificateData.orgAddr || ''}`, 1, 7)
              }
            </tr>
            <tr>
              {
                createTdItem('证书编号', `${certificateData.certificateNumber || ''}`, 1, 7)
              }
            </tr>
            <tr>
              {
                createTdItem('证书名称', `${certificateData.certificateName || ''}`, 1, 7)
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
                  )
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
        <Tabs>
          {TAB_PARAMS.map(item => {
            return <Tabs.TabPane key={item.key} tab={item.title}>
              <div>
                <Card title={'扩项能力表信息'}>
                  <SearchTable
                    pageSize={5}
                    columns={this.COLUMNS}
                    searchCreater={
                      (values: any, pageSize: number, current: number) =>
                        this.searchCreater({ isExpanItem: 0,certifId: id, ...item.search, ...values }, pageSize, current)
                    }
                    formProps={{ layout: 'inline' }}
                  />
                </Card>
                <Card title={'全部能力表基本信息'}>
                  <SearchTable
                    pageSize={5}
                    columns={this.COLUMNS}
                    searchCreater={
                      (values: any, pageSize: number, current: number) =>
                        this.searchCreater({ certifId:id,...item.search, ...values }, pageSize, current)
                    }
                    formProps={{ layout: 'inline' }}
                  />
                </Card>
              </div>
            </Tabs.TabPane>
          })}
        </Tabs>
      </Card>
    );
  }
}

export default DepartmentAbilityFormListDetail;