import React, { Component } from 'react';
import { Card, Col, Button, Layout, Form, message } from 'antd';
import { getPropsParams, exportFileFromBlob } from '@/utils/SystemUtil';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import BackButton from '@/components/BackButton';
import handleSearchNewStatus from '@/Enums/handleSearchNewStatus';
import HInput from '@/components/Antd/HInput';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import GlobalEnum from '@/Enums/GlobalEnum';
import { getAttatchStr, createDefaultUploadFile } from '@/utils/AntdUtil';
import moment from 'moment';
import { DOWNLOAD_API } from '@/services/api';

const styles = require('./MemberDetail.less');

const ContactInfo = [
  { key: 'acceptanceNo', value: '', optionName: '受理号' },
  { key: 'enterpriseName', value: '', optionName: '企业名称' },
  { key: 'standardName', value: '', optionName: '标准名称' },
  { key: 'createUserId', value: '', optionName: '提交人账号' },
  { key: 'createDate', value: '', optionName: '提交时间' },
  { key: 'acceptanceTime', value: '', optionName: '受理时间' },
  { key: 'noveltySearchSource', value: '', optionName: '查新来源' },
];

const Tables = [
  { key: 'applyFormInfo', value: '', optionName: '1.申报表' },
  { key: 'compilationNotes', value: '', optionName: '2.编制说明' },
  { key: 'standardDraft', value: '', optionName: '3.标准草案' },
  { key: 'noveltySearchDelegateInfo', value: '', optionName: '4.查新报告委托单' },
];

const report = [{ key: 'reportUploadInfo', value: '', optionName: '1.查新报告' }];

@connect(({ loading, global }) => ({ loading, global }))
class CarDetail extends Component<IDispatchInterface, any> {
  constructor(props) {
    super(props);
    this.state = {
      consumerProductData: {},
    };
  }

  componentDidMount() {
    this.requestData();
  }

  private requestData = () => {
    let id = getPropsParams(this.props).id;
    if (id) {
      this.props.dispatch({
        type: 'searchNew/search',
        payLoad: id,
        callBack: res => {
          this.setState({ consumerProductData: res.data || {} });
        },
      });
    }
  };

  private cleanFileName = file => {
    if (file) {
      let fileNames: string = '';
      try {
        if (typeof file === 'string') {
          file = JSON.parse(file);
        }
        file.forEach((element, index) => {
          fileNames += index === file.length - 1 ? element.name : `${element.name}、`;
        });
        return fileNames;
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  private handleUpdate = type => {
    const checkMsg = this.props.form.getFieldValue('checkMsg');
    if (!checkMsg) {
      message.warning('请输入审批意见');
    } else {
      const info = {
        checkMsg,
        id: getPropsParams(this.props).id,
      };
      if (type === 'update') {
        this.update(info);
      } else {
        this.refuse(info);
      }
    }
  };

  private update = payLoad => {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchNew/update',
      payLoad,
      callBack: () => {
        this.requestData();
      },
    });
  };
  private refuse = payLoad => {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchNew/refuse',
      payLoad,
      callBack: () => {
        window.history.back();
      },
    });
  };

  private handleUploadReport = value => {
    if (value && value.length) {
      value = getAttatchStr(value);
      const { user } = this.props.global;
      this.props.dispatch({
        type: 'searchNew/renew',
        payLoad: {
          id: getPropsParams(this.props).id,
          reportUploadInfo: value,
          reportUploadPerson: user ? user.workerName : '',
          reportUploadTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        },
        callBack: () => {
          this.requestData();
        },
      });
    }
  };

  downFile = (optionName, value) => {
    if(value){
      let fileList = null;
      if (typeof value === 'string') {
        fileList = JSON.parse(value);
      }
      if(fileList.length){
        fileList.forEach(item => {
          this.props.dispatch({
            type: 'searchNew/download',
            payLoad: item.id,
            callBack: res => {
              exportFileFromBlob(res, item.name)
            },
          })
        });
      }else{
        message.warning('暂无文件');
      }
    }else{
      message.warning('暂无文件');
    }
  }

  render() {
    const { consumerProductData } = this.state;
    const { getFieldDecorator } = this.props.form;

    const Item = ({ optionName, value }) => (
      <Col sm={24} lg={24} style={{ margin: '10px 0' }}>
        <h4 style={{ display: 'inline' }}>{optionName}</h4>&nbsp;:&nbsp;&nbsp;<span>{value}</span>
      </Col>
    );

    const DownloadItem = ({ optionName, value }) => (
      <div className={styles.downloadItem}>
        <span>
          <h4 style={{ display: 'inline' }}>{optionName}</h4>&nbsp;:&nbsp;&nbsp;<span>{this.cleanFileName(value)}</span>
        </span>
        <a onClick={() => {this.downFile(optionName, value);}}>下载</a>
      </div>
    );

    const show = item => {
      let { key } = item;
      let value = consumerProductData[key];
      if (key === 'noveltySearchSource') {
        value = consumerProductData[key] === '1' ? '外部' : '内部';
      }
      return { ...item, value };
    };

    const checkStatus: boolean =
      consumerProductData.checkStatus === '1' || consumerProductData.checkStatus === '2';

    const isUploadReport =
      consumerProductData.reportUploadPerson && consumerProductData.reportUploadInfo;

    return (
      <div className={styles.memberDetail}>
        <Card title={'查看'}>
          <Layout>
            <Layout.Sider style={{ backgroundColor: '#eee' }}>
              <Card style={{ backgroundColor: '#eee' }} title={'查新基本信息'}>
                {ContactInfo.map(item => (
                  <Item {...show(item)} />
                ))}
              </Card>
            </Layout.Sider>
            <Layout.Content>
              <Card title="文档审核">
                {Tables.map(item => (
                  <DownloadItem {...show(item)} />
                ))}
              </Card>
              <Card
                title={`审核状态：${handleSearchNewStatus.toString(
                  consumerProductData.checkStatus
                )}`}
              >
                {getFieldDecorator('checkMsg', {
                  initialValue: consumerProductData.checkMsg ? consumerProductData.checkMsg : '',
                })(
                  <HInput
                    placeholder="此处填写通过原因，或者退回原因，字数限制为70字"
                    disabled={checkStatus}
                    allowClear={!checkStatus}
                  />
                )}
              </Card>
              {consumerProductData.checkStatus === '1' && isUploadReport ? (
                <Card title="查新报告">
                  {report.map(item => (
                    <DownloadItem {...show(item)} />
                  ))}
                </Card>
              ) : (
                ''
              )}
            </Layout.Content>
          </Layout>
        </Card>

        <div className="divAreaContainer controlsContainer">
          {checkStatus ? (
            consumerProductData.checkStatus === '1' && !isUploadReport ? (
              <LimitUpload
                uploadElement={'上传查新报告'}
                type={LimiteTypeEnum.NORMAL}
                accept={GlobalEnum.UPLOAD_FILE_ACCEPTS}
                onChange={this.handleUploadReport}
              />
            ) : (
              ''
            )
          ) : (
            <div>
              <Button
                type="primary"
                style={{ marginRight: '20px' }}
                onClick={() => {
                  this.handleUpdate('update');
                }}
              >
                通过
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  this.handleUpdate('refuse');
                }}
              >
                退回
              </Button>
            </div>
          )}
          <BackButton />
        </div>
      </div>
    );
  }
}

export default Form.create()(CarDetail);
