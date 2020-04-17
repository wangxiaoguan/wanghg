import React, { Component } from 'react';
import { Card, Col, Row } from 'antd';
import { getPropsParams } from '@/utils/SystemUtil';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import HandleStatusEnum from './HandleStatusEnum';
import BackButton from '@/components/BackButton';

const Info = [
  { key: 'enterpriseName', value: '', optionName: '企业名称' },
  { key: 'standardName', value: '', optionName: '标准名称' },
  { key: 'applyFormInfo', value: '', optionName: '申报表' },
  { key: 'compilationNotes', value: '', optionName: '编制说明' },
  { key: 'standardDraft', value: '', optionName: '标准草案' },
  { key: 'noveltySearchDelegateInfo', value: '', optionName: '查新报告委托单' },
];

@connect(({ loading }) => ({ loading }))
class EnterpriseDetail extends Component<IDispatchInterface, any> {
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

  cleanFileName = file => {
    if (file) {
      let fileNames: string = '';
      try {
        if (typeof file === 'string') {
          file = JSON.parse(file);
        }
        file.forEach((element, index) => {
          fileNames += index === file.length-1 ? element.name : `${element.name}、` ;
        });
        return fileNames;
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  render() {
    const Item = ({ optionName, value }) => (
      <Col sm={24} lg={24} style={{ margin: '10px 0' }}>
        <h4 style={{ display: 'inline' }}>{optionName}</h4>&nbsp;:&nbsp;&nbsp;<span>{value}</span>
      </Col>
    );

    const show = item => {
      let { key } = item;
      let value = consumerProductData[key];
      if (
        key === 'applyFormInfo' ||
        key === 'compilationNotes' ||
        key === 'standardDraft' ||
        key === 'noveltySearchDelegateInfo'
      ) {
        value = this.cleanFileName(value);
      }
      return { ...item, value };
    };

    const { consumerProductData } = this.state;
    return (
      <div>
        <Card title={'基本信息'}>
          <Row>
            {Info.map(item => (
              <Item {...show(item)} />
            ))}
          </Row>
        </Card>

        <Card title={`审核状态：${HandleStatusEnum.toString(consumerProductData.checkStatus)}`}>
          <p>{consumerProductData.checkMsg ? consumerProductData.checkMsg : ''}</p>
        </Card>
        <div className="divAreaContainer controlsContainer">
          <BackButton />
        </div>
      </div>
    );
  }
}

export default EnterpriseDetail;
