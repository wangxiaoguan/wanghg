//数据核查统计
import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Col, Card, Button } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HCascader from '@/components/Antd/HCascader';
import HRangePicker from '@/components/Antd/HRangePicker';
import { connect } from 'dva';
import { splitTimes, filterOb } from '@/utils/utils';
import { exportFileFromBlob } from '@/utils/SystemUtil';

import styles from './index.less';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['verificationStatistics/remove']),
}))
class VerificationStatistics extends Component<any, any> {

  constructor(props){
    super(props)
    this.state={
      searchData:null
    }
  }

  private COLUMNS = [
    {
      title: '地区',
      dataIndex: 'divide',
      width: 95,
    },
    {
      title: '机构编制',
      key: 'jgbz',
      children: [{
        title: '数据量',
        dataIndex: 'jgbz1',
        key: 'jgbz1',
      },
      {
        title: '问题数',
        dataIndex: 'jgbz2',
        key: 'jgbz2',
      },
      {
        title: '不合格率',
        dataIndex: 'jgbz3',
        key: 'jgbz3',
        render: (_, record) => {
          if (record.jgbz3) {
            let jgbz3 = record.jgbz3.length > 5 ?
              record.jgbz3.substr(0, 5) : record.jgbz3
            return `${(parseFloat(jgbz3) * 100).toFixed(2)}%`;
          } else {
            return '0%'
          }
        }
      }]
    },
    {
      title: '工商',
      key: 'gs',
      children: [{
        title: '数据量',
        dataIndex: 'gs1',
        key: 'gs1',
      },
      {
        title: '问题数',
        dataIndex: 'gs2',
        key: 'gs2',
      },
      {
        title: '不合格率',
        dataIndex: 'gs3',
        key: 'gs3',
        render: (_, record) => {
          if (record.gs3) {
            let gs3 = record.gs3.length > 5 ?
              record.gs3.substr(0, 5) : record.gs3
            return `${(parseFloat(gs3) * 100).toFixed(2)}%`;
          } else {
            return '0%'
          }
        }
      }]
    },
    {
      title: '其他',
      key: 'other',
      children: [{
        title: '数据量',
        dataIndex: 'other1',
        key: 'other1',
      },
      {
        title: '问题数',
        dataIndex: 'other2',
        key: 'other2',
      },
      {
        title: '不合格率',
        dataIndex: 'other3',
        key: 'other3',
        render: (_, record) => {
          if (record.other3) {
            let other3 = record.other3.length > 5 ?
              record.other3.substr(0, 5) : record.other3

            return `${(parseFloat(other3) * 100).toFixed(2)}%`;
          } else {
            return '0%'
          }
        }
      }]
    },
    // {
    //   title: '机构代码库',
    //   key: 'jgdmk',
    //   children: [{
    //     title: '数据量',
    //     dataIndex: 'jgdmk1',
    //     key: 'jgdmk1',
    //   },
    //   {
    //     title: '问题数',
    //     dataIndex: 'jgdmk2',
    //     key: 'jgdmk2',
    //   },
    //   {
    //     title: '不合格率',
    //     dataIndex: 'jgdmk3',
    //     key: 'jgdmk3',
    //     render: (_, record) => {
    //       if (record.jgdmk3) {
    //         let jgdmk3 = record.jgdmk3.length > 5 ?
    //           record.jgdmk3.substr(0, 5) : record.jgdmk3
    //         return `${(parseFloat(jgdmk3) * 100).toFixed(2)}%`;
    //       } else {
    //         return ''
    //       }
    //     }
    //   }]
    // },
    {
      title: '外交',
      key: 'wj',
      children: [{
        title: '数据量',
        dataIndex: 'wj1',
        key: 'wj1',
      },
      {
        title: '问题数',
        dataIndex: 'wj2',
        key: 'wj2',
      },
      {
        title: '不合格率',
        dataIndex: 'wj3',
        key: 'wj3',
        render: (_, record) => {
          if (record.wj3) {
            let wj3 = record.wj3.length > 5 ?
              record.wj3.substr(0, 5) : record.wj3
            return `${(parseFloat(wj3) * 100).toFixed(2)}%`;
          } else {
            return '0%'
          }
        }
      }]
    },
    {
      title: '司法行政',
      key: 'sfxz',
      children: [{
        title: '数据量',
        dataIndex: 'sfxz1',
        key: 'sfxz1',
      },
      {
        title: '问题数',
        dataIndex: 'sfxz2',
        key: 'sfxz2',
      },
      {
        title: '不合格率',
        dataIndex: 'sfxz3',
        key: 'sfxz3',
        render: (_, record) => {
          if (record.sfxz3) {
            let sfxz3 = record.sfxz3.length > 5 ?
              record.sfxz3.substr(0, 5) : record.sfxz3
            return `${(parseFloat(sfxz3) * 100).toFixed(2)}%`;
          } else {
            return '0%'
          }
        }
      }]
    },
    {
      title: '文化',
      key: 'wh',
      children: [{
        title: '数据量',
        dataIndex: 'wh1',
        key: 'wh1',
      },
      {
        title: '问题数',
        dataIndex: 'wh2',
        key: 'wh2',
      },
      {
        title: '不合格率',
        dataIndex: 'wh3',
        key: 'wh3',
        render: (_, record) => {
          if (record.wh3) {
            let wh3 = record.wh3.length > 5 ?
              record.wh3.substr(0, 5) : record.wh3
            return `${(parseFloat(wh3) * 100).toFixed(2)}%`;
          } else {
            return '0%'
          }
        }
      }]
    },
    {
      title: '民政',
      key: 'mz',
      children: [{
        title: '数据量',
        dataIndex: 'mz1',
        key: 'mz1',
      },
      {
        title: '问题数',
        dataIndex: 'mz2',
        key: 'mz2',
      },
      {
        title: '不合格率',
        dataIndex: 'mz3',
        key: 'mz3',
        render: (_, record) => {
          if (record.mz3) {
            let mz3 = record.mz3.length > 5 ?
              record.mz3.substr(0, 5) : record.mz3
            return `${(parseFloat(mz3) * 100).toFixed(2)}%`;
          } else {
            return '0%'
          }
        }
      }]
    },
    {
      title: '旅游',
      key: 'ly',
      children: [{
        title: '数据量',
        dataIndex: 'ly1',
        key: 'ly1',
      },
      {
        title: '问题数',
        dataIndex: 'ly2',
        key: 'ly2',
      },
      {
        title: '不合格率',
        dataIndex: 'ly3',
        key: 'ly3',
        render: (_, record) => {
          if (record.ly3) {
            let ly3 = record.ly3.length > 5 ?
              record.ly3.substr(0, 5) : record.ly3
            return `${(parseFloat(ly3) * 100).toFixed(2)}%`;
          } else {
            return '0%'
          }
        }
      }]
    },
    {
      title: '宗教',
      key: 'zj',
      children: [{
        title: '数据量',
        dataIndex: 'zj1',
        key: 'zj1',
      },
      {
        title: '问题数',
        dataIndex: 'zj2',
        key: 'zj2',
      },
      {
        title: '不合格率',
        dataIndex: 'zj3',
        key: 'zj3',
        render: (_, record) => {
          if (record.zj3) {
            let zj3 = record.zj3.length > 5 ?
              record.zj3.substr(0, 5) : record.zj3
            return `${(parseFloat(zj3) * 100).toFixed(2)}%`;
          } else {
            return '0%'
          }
        }
      }]
    },
    {
      title: '工会',
      key: 'gh',
      children: [{
        title: '数据量',
        dataIndex: 'gh1',
        key: 'gh1',
      },
      {
        title: '问题数',
        dataIndex: 'gh2',
        key: 'gh2',
      },
      {
        title: '不合格率',
        dataIndex: 'gh3',
        key: 'gh3',
        render: (_, record) => {
          if (record.gh3) {
            let gh3 = record.gh3.length > 5 ?
              record.gh3.substr(0, 5) : record.gh3
            return `${(parseFloat(gh3) * 100).toFixed(2)}%`;
          } else {
            return '0%'
          }
        }
      }]
    },
    {
      title: '中央军委改革和编制办公室',
      key: 'zy',
      children: [{
        title: '数据量',
        dataIndex: 'zy1',
        key: 'zy1',
      },
      {
        title: '问题数',
        dataIndex: 'zy2',
        key: 'zy2',
      },
      {
        title: '不合格率',
        dataIndex: 'zy3',
        key: 'zy3',
        render: (_, record) => {
          if (record.zy3) {
            let zy3 = record.zy3.length > 5 ?
              record.zy3.substr(0, 5) : record.zy3
            return `${(parseFloat(zy3) * 100).toFixed(2)}%`;
          } else {
            return '0%'
          }
        }
      }]
    },
    {
      title: '农业',
      key: 'ny',
      children: [{
        title: '数据量',
        dataIndex: 'ny1',
        key: 'ny1',
      },
      {
        title: '问题数',
        dataIndex: 'ny2',
        key: 'ny2',
      },
      {
        title: '不合格率',
        dataIndex: 'ny3',
        key: 'ny3',
        render: (_, record) => {
          if (record.ny3) {
            let ny3 = record.ny3.length > 5 ?
              record.ny3.substr(0, 5) : record.ny3
            return `${(parseFloat(ny3) * 100).toFixed(2)}%`;
          } else {
            return '0%'
          }
        }
      }]
    },
    {
      title: '统计',
      key:'total',
      children: [
        {
          title: '数据量统计',
          dataIndex: 'total1',
        },
        {
          title: '问题数统计',
          dataIndex: 'total2',
        },
        {
          title: '不合格率统计',
          dataIndex: 'total3',
          render: (_, record) => {
            return <span>{`${(record.total3 * 100).toFixed(2)}%`}</span>
            }
        }
    ]
    },
  ];

  transData(response) {
    console.log('response', response);
    const {data} = response;
    const length = data.length;
    const obj = {
      gh1: 0,
      gh2: 0,
      gh3: 0,
      gs1: 0,
      gs2: 0,
      gs3: 0,
      jgbz1: 0,
      jgbz2: 0,
      jgbz3: 0,
      ly1: 0,
      ly2: 0,
      ly3: 0,
      mz1: 0,
      mz2: 0,
      mz3: 0,
      ny1: 0,
      ny2: 0,
      ny3: 0,
      other1: 0,
      other2: 0,
      other3: 0,
      sfxz1: 0,
      sfxz2: 0,
      sfxz3: 0,
      wh1: 0,
      wh2: 0,
      wh3: 0,
      wj1: 0,
      wj2: 0,
      wj3: 0,
      zj1: 0,
      zj2: 0,
      zj3: 0,
      zy1: 0,
      zy2: 0,
      zy3: 0,
      total1: 0,
      total2: 0,
      total3: 0,
      divide: `合计：${length}`,
    };
    data.forEach(record => {
      record.total1 = record.jgbz1 + record.gs1 + record.other1 + record.wj1 + record.sfxz1 + record.wh1 + record.mz1 + record.ly1 + record.zj1 + record.gh1 + record.zy1 + record.ny1;
      record.total2 = record.jgbz2 + record.gs2 + record.other2 + record.wj2 + record.sfxz2 + record.wh2 + record.mz2 + record.ly2 + record.zj2 + record.gh2 + record.zy2 + record.ny2;
      record.total3 = ((record.jgbz3 + record.gs3 + record.other3 + record.wj3 + record.sfxz3 + record.wh3 + record.mz3 + record.ly3 + record.zj3 + record.gh3 + record.zy3 + record.ny3)/12);
      obj.gh1 += record.gh1;
      obj.gh2 += record.gh2;
      obj.gh3 += record.gh3;
      obj.gs1 += record.gs1;
      obj.gs2 += record.gs2;
      obj.gs3 += record.gs3;
      obj.ly1 += record.ly1;
      obj.ly2 += record.ly2;
      obj.ly3 += record.ly3;
      obj.mz1 += record.mz1;
      obj.mz2 += record.mz2;
      obj.mz3 += record.mz3;
      obj.ny1 += record.ny1;
      obj.ny2 += record.ny2;
      obj.ny3 += record.ny3;
      obj.other1 += record.other1;
      obj.other2 += record.other2;
      obj.other3 += record.other3;
      obj.sfxz1 += record.sfxz1;
      obj.sfxz2 += record.sfxz2;
      obj.sfxz3 += record.sfxz3;
      obj.wh1 += record.wh1;
      obj.wh2 += record.wh2;
      obj.wh3 += record.wh3;
      obj.wj1 += record.wj1;
      obj.wj2 += record.wj2;
      obj.wj3 += record.wj3;
      obj.zj1 += record.zj1;
      obj.zj2 += record.zj2;
      obj.zj3 += record.zj3;
      obj.zy1 += record.zy1;
      obj.zy2 += record.zy2;
      obj.zy3 += record.zy3;
      obj.total1 += record.total1;
      obj.total2 += record.total2;
      obj.total3 += record.total3;
    })
    
    obj.gh3 = (obj.gh3/length);
    obj.gs3 = (obj.gs3/length);
    obj.ly3 = (obj.ly3/length);
    obj.mz3 = (obj.mz3/length);
    obj.ny3 = (obj.ny3/length);
    obj.other3 = (obj.other3/length);
    obj.sfxz3 = (obj.sfxz3/length);
    obj.wh3 = (obj.wh3/length);
    obj.wj3 = (obj.wj3/length);
    obj.zj3 = (obj.zj3/length);
    obj.zy3 = (obj.zy3/length);
    obj.total3 = (obj.total3/length);
    
    data.push(obj);
    return {
      data: response.data,
      total: response.data.length,
    };
  }

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'verificationStatistics/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    console.log('search', values)
    const { dataTime, ...others } = values
    // tslint:disable-next-line: prefer-conditional-expression
    if (others.divide && others.divide.length > 0) {
      others.divide = others.divide[others.divide.length - 1]
    } else {
      others.divide = ''
    }
    const times = splitTimes(dataTime, 'beginTime', 'endTime')
    others.beginTime = ''
    others.endTime = ''
    const data = filterOb({
      ...others, ...times
    })
    this.setState({searchData:data})
    // console.log(this.state.searchData)
    return {
      method: 'post',
      url: `/services/code/dataStatistics/checkStatistics`,
      data
    }
  }

  render() {
    return (
      <Card title='数据核查统计' className={styles.dataTotal}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          formProps={{ layout: 'horizontal' }}
          formItemsProps={{searchData:this.state.searchData}}
          searchCreater={this.searchCreater}
          tableProps={{ bordered: true, scroll: { x: true } }}
          transData={this.transData}
          pageSize={10000}
        />
      </Card>
    );
  }
}

@connect(({ loading }) => ({

}))
class SearchForm extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      regOptions: [],//登记机关
    }
  }
  componentDidMount() {
    //登记机关
    this.props.dispatch(
      {
        type: 'questionStatistics/searchRegDic',
        payLoad: { type: '1', code: '420000' },
        callBack: (res) => {
          this.setState({ regOptions: res.data })
        }
      }
    );
  }

  exportExcel = () => {
    console.log('exportExcel')
    this.props.dispatch(
      {
        type: 'verificationStatistics/exportFieldDownLoad',
        payLoad: {
          exportParams:this.props.searchData
        },
        callBack: (res) => {
          exportFileFromBlob(res, `verificationStatistics.xls`);
        }
      }
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { regOptions } = this.state
    const FORM_ITEMS = [
      {
        label: '登记机关',
        content: getFieldDecorator('divide')(<HCascader changeOnSelect options={regOptions} fieldNames={{ label: 'name', value: 'code', children: 'childs' }} />),
      },
      {
        label: '接收时间',
        content: getFieldDecorator('dataTime')(<HRangePicker />),
      },
    ];

    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return (
                <Col key={item.label} span={8}>
                  <FormItem {...FormItemLayout} label={item.label}>{item.content}</FormItem>
                </Col>

              );
            })
          }
          <Col span={8}>
            <FormItem wrapperCol={{ offset: 7 }}>
              <FormRefreshButton />
              <FormResetButton />
              {/* <Button type="primary" onClick={() => this.exportExcel()}>导出</Button> */}
            </FormItem>
          </Col>
        </div>
        <div className='divAreaContainer controlsContainer'>
          <Button type="primary" onClick={() => this.exportExcel()}>导出</Button>
        </div>
      </div>
    );
  }
}

export default VerificationStatistics;