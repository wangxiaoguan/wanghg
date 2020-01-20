import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Col, Card, Button, Spin } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import { createSelectOptions } from '@/utils/AntdUtil';
import FormRefreshButton from '@/components/FormRefreshButton';
import HSelect from '@/components/Antd/HSelect';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createSearchString } from '@/utils/SystemUtil';
import DataSourceEnum from '@/Enums/DataSourceEnum';
import { exportFileFromBlob } from '@/utils/SystemUtil';
import HCascader from '@/components/Antd/HCascader';
import CenterBackInfo from './CenterBackInfo';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['centerBack/remove']),
  requestLoading: Boolean(loading.effects['centerBack/search']),
}))
class CenterBack extends Component<any, any> {

  constructor(props){
    super(props)
    this.state={
      searchData:null,
      tableData:{},
      visible:false,
    }
  }


  private COLUMNS = [
    {
      title: '统一社会信用代码',
      dataIndex: 'tyshxydm',
    },
    {
      title: '机构名称',
      dataIndex: 'jgmc',
    },
    {
      title: '核准日期',
      dataIndex: 'hzrq',
    },
    {
      title: '数据来源',
      dataIndex: 'dptcode',
      render: (_, record) => {
        return DataSourceEnum.toString(record.dptcode);
      }
    },
    {
      title: '问题大类',
      dataIndex: 'dCwlxName',
      // render: (_, record) => {
      //   return ProblemEnum.toString(record.eflag);
      // }
    },
    {
      title: '问题小类',
      dataIndex: 'xCwlxName',
    },
    {
      title: '问题下发时间',
      dataIndex: 'jyqxs',
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a onClick={() => this.requestData(record.id)} >详情</a>
          </span>
        );
      }
    },
  ];

  requestData = (id) => {
      this.setState({visible:true});
      this.props.dispatch({
        type: 'centerBack/search',
        payLoad: id,
        callBack: res => {
          if(res.code === '10001'){
            this.setState({ tableData: res.data });
          }else{
            this.clearModal();
          }
        },
      });
    };


  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'centerBack/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  clearModal = () => {
    this.setState({visible:false, tableData: {}})
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    console.log('search', values)
    const data = { ...values }
    if (data.pcenterid) {
      data.pcenterid = data.pcenterid[0];
    }
    this.setState({searchData:data})
    return `/services/code/errorinfo/list/${current}/${pageSize}${createSearchString(data)}`;
  }

  render() {
    const {visible, tableData} = this.state;
    return (
      <Card title='中心返回问题数据'>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          formProps={{ layout: 'horizontal' }}
          formItemsProps={{searchData:this.state.searchData}}
          searchCreater={this.searchCreater}
          selectedAble
        />
        <CenterBackInfo visible={visible} clearModal={this.clearModal} data={tableData} loading={this.props.requestLoading} />  
      </Card>
    );
  }
}

@connect(({ loading }) => ({
  loading
}))
class SearchForm extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      regOptions: [],//登记机关
      busOptions: [],//业务类型
      problemType1: [], //问题一级分类
      problemType2: [], //问题二级分类
    }
  }


  componentDidMount() {
    //登记机关
    this.props.dispatch(
      {
        type: 'centerBack/searchRegDic',
        payLoad: { type: '3', code: '420000' },
        callBack: (res) => {
          this.setState({ regOptions: res.data })
        }
      }
    );
    //业务类型
    this.props.dispatch(
      {
        type: 'centerBack/searchCommonDic',
        payLoad: '16',
        callBack: (res) => {
          this.setState({ busOptions: res.data })
        }
      }
    );

    //一级问题分类
    this.props.dispatch(
      {
        type: 'centerBack/searchProblemType',
        callBack: (res) => {
          this.setState({ problemType1: res.data })
        }
      }
    );
  }

  requestProblemType2(parentCode) {
    this.props.dispatch(
      {
        type: 'centerBack/searchProblemType2',
        payLoad: parentCode,
        callBack: (res) => {
          this.setState({ problemType2: res.data })
        }
      }
    );
  }

  exportExcel = () => {
    console.log('exportExcel')
    this.props.dispatch(
      {
        type: 'centerBack/exportFieldDownLoad',
        payLoad: {
          exportParams:this.props.searchData
        },
        callBack: (res) => {
          exportFileFromBlob(res, `centerBack.xls`);
        }
      }
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { regOptions } = this.state
    const loading = this.props.loading;
    const FORM_ITEMS = [
      {
        label: '统一社会信用代码',
        content: getFieldDecorator('tyshxydm')(<HInput />),
      },
      {
        label: '机构名称',
        content: getFieldDecorator('jgmc')(<HInput />),
      },
      {
        label: '数据来源',
        content: getFieldDecorator('dptcode')(
          <HSelect>
            {
              createSelectOptions(DataSourceEnum.ALL_LIST, DataSourceEnum.toString)
            }
          </HSelect>
        ),
      },
      {
        label: '登记机关',
        content: getFieldDecorator('pcenterid')(<HCascader changeOnSelect options={regOptions} fieldNames={{ label: 'name', value: 'code', children: 'childs' }} />),
      },
      {
        label: '问题类型',
        content: getFieldDecorator('eflag')(
          <HSelect
            onChange={(value) => {
              console.log('onchange', value);
              this.requestProblemType2(value);
            }}
            loading={loading.effects['centerBack/searchProblemType']}
          >
            {
              createSelectOptions(this.state.problemType1, (item) => item.name, (item) => item.code)
            }
          </HSelect>
        ),
      },
      {
        label: '问题类型2',
        content: getFieldDecorator('enums')(
          <HSelect
            loading={loading.effects['centerBack/searchProblemType2']}
          >
            {
              createSelectOptions(this.state.problemType2, (item) => item.name, (item) => item.code)
            }
          </HSelect>
        ),
      },
      {
        label: '本地接收时间',
        content: getFieldDecorator('dataTime')(<HRangePicker />),
      },
      {
        label: '问题下发时间',
        content: getFieldDecorator('jyqxs')(<HRangePicker />),
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

export default CenterBack;