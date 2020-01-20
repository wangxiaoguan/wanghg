import React, { Component } from 'react';
import { Form, Card, Col, Radio, message, Button, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import { connect } from 'dva';
import HInput from '@/components/Antd/HInput';
import CountryWindow from '@/components/SelectedWindows/CountryWindow';
import ICSCodeWindow from '@/components/SelectedWindows/ICSCodeWindow';
import HSCodeWindow from '@/components/SelectedWindows/HSCodeWindow';
import TagWindow from '@/components/SelectedWindows/TagWindow';
import RadioGroup from 'antd/lib/radio/group';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { getPropsParams, isEmptyArray } from '@/utils/SystemUtil';
import Axios from 'axios';

const FORM_LAYOUT = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

interface IInfoRelationState {
  selectedType: string;
  selectedRelatedID: string[];
  selectedUnRelatedID: string[];
  searchParams?: any;
}
const ARTICLE_TYPES = {
  '1': {
    name: '通报',
    listUrl: '/services/wto/wtobulletin/listAll',
    controlUrl: '/services/wto/wtobulletin/updateStatus',
  },
  '2': {
    name: '预警',
    listUrl: '/services/wto/warninfo/listAll',
    controlUrl: '/services/wto/warninfo/updateStatus',
  },
  '3': {
    name: '新闻',
    listUrl: '/services/wto/marketdynamics/listAll',
    controlUrl: '/services/wto/marketdynamics/updateStatus',
  },
  '4': {
    name: '法规',
    listUrl: '/services/wto/wtolawinfo/listAll',
    controlUrl: '/services/wto/wtolawinfo/updateStatus',
  },
  '5': {
    name: '合格评定程序',
    listUrl: '/services/wto/authentication/listAll',
    controlUrl: '/services/wto/authentication/updateStatus',
  },
};

@connect(({ loading }) => (
  {
    loading
  }
))
class InfoRelation extends Component<IFormAndDvaInterface, IInfoRelationState> {
  private tableRelated: SearchTableClass;
  private tableUnrelated: SearchTableClass;
  constructor(props) {
    super(props);
    this.state = {
      selectedType: '1',
      selectedRelatedID: [],
      selectedUnRelatedID: [],
    };
  }

  getColumns(): any[] {
    switch (this.state.selectedType) {
      case "1":
        return [
          {
            title: '通报号',
            dataIndex: 'bulletinCode',
          },
          {
            title: '标题',
            dataIndex: 'bulletinTitle',
          },
        ];
      case "2":
        return [
          {
            title: '预警标题',
            dataIndex: 'warnTitle',
          },
        ];
      case "3":
        return [
          {
            title: '新闻标题',
            dataIndex: 'title',
          },
        ];
      case "4":
        return [
          {
            title: '法规标题',
            dataIndex: 'lawTitle',
          },
        ];
      case "5":
        return [
          {
            title: '合格评定程序名称',
            dataIndex: 'auName'
          },
        ];
      default:
        return [];
    }
  }

  searchRelatedCreater = (values: any, pageSize: number, current: number) => {
    return this.createSearch(values, pageSize, current, true);
  }

  searchUnRelatedCreater = (values: any, pageSize: number, current: number) => {
    return this.createSearch(values, pageSize, current, false);
  }

  createSearch(values: any, pageSize: number, current: number, isRelated: boolean) {
    let searchParams: any = {};
    if (this.state.searchParams) {
      searchParams = { ...this.state.searchParams };
      if (searchParams.countryName) {
        searchParams.countryName = searchParams.countryName.map((item) => item.countryName).join();
      }
      if (searchParams.countryTag) {
        searchParams.countryTag = searchParams.countryTag.map((item) => item.countryName).join();
      }
      if (searchParams.hsCode) {
        searchParams.hsCode = searchParams.hsCode.map((item) => item.hsCode).join();
      }
      if (searchParams.icsCode) {
        searchParams.icsCode = searchParams.icsCode.map((item) => item.icsCode).join();
      }
      if (searchParams.productTag) {
        searchParams.productTag = searchParams.productTag.map((item) => item.labelId).join();
      }
      if (searchParams.otherTag) {
        searchParams.otherTag = searchParams.otherTag.map((item) => item.labelId).join();
      }
    }
    console.log(this.state.searchParams, searchParams);
    return {
      method: 'post',
      url: ARTICLE_TYPES[this.state.selectedType].listUrl,
      data: {
        page: current,
        pageSize,
        isRelated,
        tradeSubjectId: this.tradeSubjectId,
        ...searchParams,
      }
    }
  }

  get tradeSubjectId() {
    const params = getPropsParams(this.props);
    return params.tradeProgramaId;
  }

  updateStatus = (listID: string[], isRelated: boolean) => {
    Axios.request({
      method: 'PUT',
      url: ARTICLE_TYPES[this.state.selectedType].controlUrl,
      data: listID.map((id) => {
        return {
          "id": id,
          "tradeSubjectId": isRelated ? this.tradeSubjectId : '0',
        }
      }),
    })
      .then(() => {
        this.tableRelated.refresh();
        this.tableUnrelated.refresh();
      })
      .catch((error) => {
        message.error(error);
      });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '查询方式',
        content: getFieldDecorator('queryType', { initialValue: 'or' })(<RadioGroup>
          <Radio value="or">OR查询</Radio>
          <Radio value="and">AND查询</Radio>
        </RadioGroup>),
      },
      {
        label: '通报号',
        content: getFieldDecorator('bulletinCode')(<HInput />),
      },
      {
        label: '标题',
        content: getFieldDecorator('title')(<HInput />),
      },
      {
        label: '国家',
        content: getFieldDecorator('countryName')(<CountryWindow />),
      },
      {
        label: 'ICS码',
        content: getFieldDecorator('icsCode')(<ICSCodeWindow />),
      },
      {
        label: 'HS码',
        content: getFieldDecorator('hsCode')(<HSCodeWindow />),
      },
      {
        label: '产品标签',
        content: getFieldDecorator('productTag')(<TagWindow />),
      },
      {
        label: '国家标签',
        content: getFieldDecorator('countryTag')(<CountryWindow />),
      },
      {
        label: '其它标签',
        content: getFieldDecorator('otherTag')(<TagWindow />),
      },
    ];
    return (
      <Card title="信息关联">
        <Form>
          <Row>
            {
              FORM_ITEMS.map((item) => {
                return (
                  <Col key={item.label} span={8}>
                    <FormItem {...FORM_LAYOUT} label={item.label}>
                      {
                        item.content
                      }
                    </FormItem>
                  </Col>
                );
              })
            }
            <Col span={8}>
              <FormItem {...FORM_LAYOUT} wrapperCol={{ offset: 7 }}>
                <Button type="primary" onClick={() => {
                  this.props.form.validateFields((errors, values) => {
                    this.setState({ searchParams: values });
                    this.tableRelated.resetForm();
                    this.tableUnrelated.resetForm();
                  });
                }}>查询</Button>
                <Button onClick={() => {
                  this.props.form.resetFields();
                  this.setState({ searchParams: null }, () => {
                    this.tableRelated.resetForm();
                    this.tableUnrelated.resetForm();
                  });

                }}>重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <hr />
        <Row>
          <Col>
            {
              <RadioGroup buttonStyle="solid" onChange={(event) => {
                this.setState({ selectedType: event.target.value }, () => {
                  this.tableRelated.refresh();
                  this.tableUnrelated.refresh();
                });
              }}>
                {
                  Object.keys(ARTICLE_TYPES).map((key) => {
                    return <Radio.Button key={key} value={key}>{ARTICLE_TYPES[key].name}</Radio.Button>
                  })
                }
              </RadioGroup>
            }
          </Col>
        </Row>
        <div className='divAreaContainer controlsContainer'>
          <h1 style={{ marginBottom: 0 }}>已关联</h1>
          <Button disabled={isEmptyArray(this.state.selectedRelatedID)} onClick={() => this.updateStatus(this.state.selectedRelatedID, false)}>取消关联</Button>
        </div>
        <SearchTable
          getInstance={(target) => this.tableRelated = target}
          searchCreater={this.searchRelatedCreater}
          clearSelectedAfterRequest={true}
          selectedAble={true}
          onSelectChange={(selectedRowKeys, selectedRows) => {
            this.setState({ selectedRelatedID: selectedRowKeys })
          }}
          columns={this.getColumns().concat([{
            title: '操作',
            width: 100,
            render: (_, record) => {
              return <a
                onClick={() => {
                  this.updateStatus([record.id], false);
                }}>取消关联</a>
            }
          }])}
        />

        <div className='divAreaContainer controlsContainer'>
          <h1 style={{ marginBottom: 0 }}>未关联</h1>
          <Button disabled={isEmptyArray(this.state.selectedUnRelatedID)} onClick={() => this.updateStatus(this.state.selectedUnRelatedID, true)}>关联</Button>
        </div>
        <SearchTable
          getInstance={(target) => this.tableUnrelated = target}
          clearSelectedAfterRequest
          searchCreater={this.searchUnRelatedCreater}
          selectedAble={true}
          onSelectChange={(selectedRowKeys, selectedRows) => {
            this.setState({ selectedUnRelatedID: selectedRowKeys })
          }}
          columns={this.getColumns().concat([{
            title: '操作',
            width: 100,
            render: (_, record) => {
              return <a
                onClick={() => {
                  this.updateStatus([record.id], true);
                }}>关联</a>
            }
          }])}
        />
      </Card >
    );
  }
}

export default Form.create()(InfoRelation);