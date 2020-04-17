import React, { Component } from 'react';
import { Card, Form, List } from 'antd';
import SearchTable from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import { Bar } from '@/components/Charts';
import FormRefreshButton from '@/components/FormRefreshButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import HSCodeWindow from '@/components/SelectedWindows/HSCodeWindow';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import { connect } from 'dva';
import HSelect from '@/components/Antd/HSelect';
import { createSelectOptions } from '@/utils/AntdUtil';

const classNames = require('./ExportValueOfOurProvince.less');


const TITLE = '我省出口额';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

interface IExportValueOfOurProvinceState {
  cityDataRangeDate: any[],
  cityData: any[],
}

/**
 * 表格页面的模板
 */
@connect(({ loading }) => ({
  loading
}))
class ExportValueOfOurProvince extends Component<IFormAndDvaInterface, IExportValueOfOurProvinceState> {
  private COLUMNS: any[] = [
    {
      title: '地区',
      dataIndex: 'exportCountry',
    },
    {
      title: 'HS编码',
      dataIndex: 'hsCode',
    },
    {
      title: '名称',
      dataIndex: 'hsName',
    },
    {
      title: '出口额（美元）',
      dataIndex: 'exportAmount',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      cityData: [],
      cityDataRangeDate: [],
    }
  }


  componentDidMount() {
    this.requestCityExportInfo();
  }

  requestCityExportInfo() {
    const { cityDataRangeDate } = this.state;
    this.props.dispatch(
      {
        type: 'ExportValueOfOurProvince/cityExportInfo',
        payLoad: {
          "beginYear": cityDataRangeDate[0] ? cityDataRangeDate[0].year() : '',
          "endYear": cityDataRangeDate[1] ? cityDataRangeDate[1].year() : ''
        },
        callBack: (res) => {
          let data = res.data.data;
          if (data) {
            data = data.map((item) => ({ x: item.divisionName, y: Number(item.exportAmount) }));
          }
          this.setState({ cityData: data });
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    console.log(values);
    return {
      method: 'post',
      url: `/services/wto/wtohbexportinfo/list/${current}/${pageSize}`,
      data: {
        "divisionCode": values.divisionCode,
        "hsCode": values.hsCode && values.hsCode.length ? values.hsCode[0].hsCode : '',
      }
    };
  }

  render() {
    return (
      <Card
        title={
          <div className={classNames.divCardTitle}>
            <div className={classNames.title}>{TITLE}</div>
            <Form layout='inline'>
              <FormItem label='统计时段'>
                <HRangePicker onChange={(props: []) => {
                  this.setState({ cityDataRangeDate: props }, this.requestCityExportInfo);
                }} />
              </FormItem>
            </Form>
          </div>
        }
      >
        <div className={classNames.divBarContainer}>
          <div className={classNames.bar}>
            <Bar
              height={250}
              title="各市出口额状况分析（美元）"
              data={this.state.cityData}
            />
          </div>
          <div style={{ width: 300 }}>
            <h4>
              出口排名
            </h4>
            <List dataSource={this.state.cityData.slice(0, 7)} renderItem={
              (item, index) => {
                return (
                  <div className={`${classNames.listItem} ${index < 3 ? classNames.listItemLight : ''}`}>
                    <span className={classNames.index}>{index + 1}</span>
                    <span className={classNames.name}>{item.x}</span>
                    <span className={classNames.value}>{item.y}</span>
                  </div>
                );
              }}
            />
          </div>
        </div>

        <SearchTable
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
        />
      </Card>
    );
  }
}
@connect(({ loading, global }) => ({
  loading,
  global
}))
class SearchForm extends Component<any>  {
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '行政区划',
        content: getFieldDecorator('divisionCode')(
          <HSelect>
            {
              createSelectOptions(this.props.global.hbCitys, (item) => item.divisionName, item => Number(item.divisionCode))
            }
          </HSelect>
        ),
      },
      {
        label: 'HS码',
        content: getFieldDecorator('hsCode')(<HSCodeWindow maxSelectCount={1} />),
      },
    ];
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return (
                <FormItem key={item.label} {...FormItemLayout} label={item.label}>{item.content}</FormItem>
              );
            })
          }
          <FormItem>
            <FormRefreshButton />
            <FormResetButton />
          </FormItem>
        </div>
      </div>
    );
  }
}

export default ExportValueOfOurProvince;