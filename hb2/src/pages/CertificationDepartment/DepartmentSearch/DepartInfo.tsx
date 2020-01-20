import React, { Component } from 'react';
import { Card, Tabs, Table } from 'antd';
import BackButton from '@/components/BackButton';
import DepartInfoTable from '../Components/DepartInfoTable';
import { getPropsParams } from '@/utils/SystemUtil';
import { connect } from 'dva';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import SearchTable from '@/components/SearchTable';
import BusinessTypeEnum from '@/Enums/BusinessTypeEnum';
import ExamingStatusOthersEnum from '@/Enums/ExamingStatusOthersEnum';
import SexEnum from '@/Enums/SexEnum';
import CheckStatusEnum from '@/Enums/CheckStatusEnum';
import HistoryTypeEnum from '@/Enums/HistoryTypeEnum';
import { createSearchString } from '@/utils/SystemUtil';

const classNames = require('./DepartInfo.less');

const AuthorizerDetail_HASH = '#/DepartmentSearch/DepartmentList/DepartInfo/AuthorizerDetail/'
const CertificateDetail_HASH = '#/DepartmentSearch/DepartmentList/DepartInfo/CertificateDetail/'
const EquipmentDetail_HASH = '#/DepartmentSearch/DepartmentList/DepartInfo/EquipmentDetail/'
const MemberDetail_HASH = '#/DepartmentSearch/DepartmentList/DepartInfo/MemberDetail/'
// const AuthorizerEdit_HASH = '#/DepartmentSearch/DepartmentList/DepartInfo/AuthorizerEdit/'


const historyUrl = {
  '0':'#/DepartmentSearch/DepartmentList/DepartInfo/DepartInfoLogDetail/',
  '1':'#/DepartmentSearch/DepartmentList/DepartInfo/AuthorizerLogDetail/',
  '2':'#/DepartmentSearch/DepartmentList/DepartInfo/EquipmentLogDetailList/',
  '3':'#/DepartmentSearch/DepartmentList/DepartInfo/MemberLogDetailList/',
}

const BUSINESS_STATUS = ['新增', '修改'];
const CHECK_STATUS = ['审核中', '审核通过', '审核不通过', '未审核'];
const DEGREE_TYPE = [
  '',
  '文盲',
  '半文盲',
  '小学',
  '初中',
  '高中',
  '技工学校',
  '中专',
  '大专',
  '本科',
  '硕士',
];

interface IDepartInfoState {
  /**
   * 基本信息
   */
  baseInfo: any;
}

@connect(({ loading }) => ({
  loading,
}))
class DepartInfo extends Component<IFormAndDvaInterface, IDepartInfoState> {
  constructor(props) {
    super(props);
    this.state = {
      baseInfo: {},
    };
  }

  componentDidMount() {
    this.requestData();
  }

  requestData() {
    let id = getPropsParams(this.props).id;
    if (id) {
      this.props.dispatch({
        type: 'Department/search',
        payLoad: id,
        callBack: res => {
          console.log(res);
          this.setState({ baseInfo: res.data });
        },
      });
    }
  }

  createItem(label, content, spanLabel = 1, spanContent = 1) {
    return [
      <td key={label} colSpan={spanLabel} className={classNames.tdLabel}>
        {label}
      </td>,
      <td key={content} colSpan={spanContent}>
        {content}
      </td>,
    ];
  }

  render() {
    const { baseInfo } = this.state;
    let id = getPropsParams(this.props).id;
    let index = getPropsParams(this.props).index;
    if (!id) {
      return <div>页面参数错误，缺少id</div>;
    }
    return (
      <Card
        title={
          <span>
            <span>机构详情</span>
            <BackButton type="primary" style={{ float: 'right' }} />
          </span>
        }
        className={classNames.DepartInfo}
      >
        <Tabs defaultActiveKey = {index}>
          <Tabs.TabPane key="1" tab="基本信息">
            <DepartInfoTable data={baseInfo} />
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab="资料信息">
            <SearchTable
              searchCreater={(_, pageSize, current) =>
                `/services/exam/fhexamdatum/getByOrgId/${id}/${current}/${pageSize}`
              }
              columns={[
                {
                  title: '附件名称',
                  dataIndex: 'name',
                },
                {
                  title: '上传时间',
                  dataIndex: 'uploadTime',
                },
                {
                  title: '业务类型',
                  dataIndex: 'businessType',
                  render: text => {
                    return `${BUSINESS_STATUS[parseInt(text)]}`;
                  },
                },
                {
                  title: '审核状态',
                  dataIndex: 'checkStatus',
                  render: (_, record) => {
                    return ExamingStatusOthersEnum.toString(record.checkStatus);
                  }
                  // render: text => {
                  //   return `${CHECK_STATUS[parseInt(text)]}`;
                  // },
                },
                {
                  title: '操作',
                  dataIndex: '',
                  render: (_, record) => {
                    return <a onClick={()=>{
                      window.location.href=`/services/attachment/file/download/AttachmentDownload?id=${record.fileId}`
                    }}>下载</a>;
                  },
                },
              ]}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="3" tab="授权人签字信息">
            <SearchTable
              searchCreater={(_, pageSize, current) =>
                `/services/exam/fhexamsignatory/getByOrgId/${id}/${current}/${pageSize}`
              }
              columns={[
                {
                  title: '授权签字人姓名',
                  dataIndex: 'signatioyName',
                },
                {
                  title: '性别',
                  dataIndex: '',
                  render: (_, record) => {
                    return SexEnum.toString(record.sex);
                  },
                },
                {
                  title: '状态',
                  dataIndex: '',
                  render: (_, record) => {
                    return CHECK_STATUS[record.checkStatus] || '未知';
                  },
                },
                {
                  title: '业务类型',
                  render: (_, record) => {
                    return BusinessTypeEnum.toString(record.businessType);
                  },
                },
                {
                  title: '操作',
                  render: (_, record) => {
                    return <a href={`${AuthorizerDetail_HASH}${record.id}`}>详情</a>;
                  },
                },
              ]}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="4" tab="资质证书信息">
            <SearchTable
              searchCreater={(_, pageSize, current) =>
                `/services/exam/fhexamcertificate/getByOrgId/${id}/${current}/${pageSize}`
              }
              columns={[
                {
                  title: '证书编号',
                  dataIndex: 'certificateNumber',
                },
                {
                  title: '证书名称',
                  dataIndex: 'certificateName',
                },
                {
                  title: '有效时间',
                  dataIndex: 'endTimes',
                },
                {
                  title: '审核状态',
                  dataIndex: 'checkStatus',
                  render: (_, record) => {
                    return CHECK_STATUS[record.checkStatus] || '未知';
                  },
                },
                {
                  title: '业务类型',
                  dataIndex: 'businessType',
                  render: (_, record) => {
                    return BusinessTypeEnum.toString(record.businessType);
                  },
                },
                {
                  title: '操作',
                  render: (_, record) => {
                    return <a href={`${CertificateDetail_HASH}${record.id}`}>详情</a>;
                  },
                },
              ]}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="5" tab="设备仪器信息">
            <SearchTable
              searchCreater={(_, pageSize, current) =>
                `/services/exam/fhexamapparatus/getByOrgId/${id}/${current}/${pageSize}`
              }
              columns={[
                {
                  title: '仪器设备名称',
                  dataIndex: 'apparatusName',
                },
                {
                  title: '型号/规格',
                  dataIndex: 'model',
                },
                {
                  title: '有效截止日期',
                  dataIndex: 'validTime',
                },
                {
                  title: '状态',
                  render: (_, record) => {
                    return CHECK_STATUS[record.checkStatus] || '未知';
                  },
                },
                {
                  title: '业务类型',
                  render: (_, record) => {
                    return BusinessTypeEnum.toString(record.businessType);
                  },
                },
                {
                  title: '操作',
                  render: (_, record) => {
                    return <a href={`${EquipmentDetail_HASH}${record.id}`}>详情</a>;
                  },
                },
              ]}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="6" tab="人员信息">
            <SearchTable
              searchCreater={(_, pageSize, current) =>
                `/services/exam/fhexamperson/getByOrgId/${id}/${current}/${pageSize}`
              }
              columns={[
                {
                  title: '姓名',
                  dataIndex: 'name',
                },
                {
                  title: '文化程度',
                  render: (_, record) => {
                    return DEGREE_TYPE[record.degree] || '未知';
                  },
                },
                {
                  title: '职称',
                  dataIndex: 'title',
                },
                {
                  title: '业务类型',
                  render: (_, record) => {
                    return BusinessTypeEnum.toString(record.businessType);
                  },
                },
                {
                  title: '操作',
                  render: (_, record) => {
                    return <a href={`${MemberDetail_HASH}${record.id}`}>详情</a>;
                  },
                },
              ]}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="7" tab="历史信息">
            <SearchTable
              searchCreater={(_, pageSize, current) =>
                `/services/exam/fhexamhistory/list/${current}/${pageSize}${createSearchString({orgId:id})}`
              }
              columns={[
                {
                  title: '机构名称',
                  dataIndex: 'orgName',
                },
                // {
                //   title: '操作类型',
                //   dataIndex: '',
                // },
                {
                  title: '操作对象',
                  dataIndex: 'type',
                  render:((text)=>{
                    return HistoryTypeEnum.toString(text)
                  })
                },
                {
                  title: '审核状态',
                  dataIndex: 'checkStatus',
                  render:((text)=>{
                    return CheckStatusEnum.toString(text)
                  })
                },
                {
                  title: '更新时间',
                  dataIndex: 'lastUpdateDate',
                },
                {
                  title: '操作',
                  render: (_, record) => {
                    return <a href={`${historyUrl[record.type]}${record.cid}`}>详情</a>;
                  },
                },
              ]}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default DepartInfo;
