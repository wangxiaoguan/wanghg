import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Col, Card, Button } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createSearchString } from '@/utils/SystemUtil';
import { exportFileFromBlob } from '@/utils/SystemUtil';
import ExportFieldsModal from '../RawData/ExportFieldsModal/ExportFieldsModal'


import HCascader from '@/components/Antd/HCascader';
import UnifiedCodeBaseInfo from './UnifiedCodeBaseInfo';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const EDIT_HASH = '#/dataQuery/unifiedCodeBase/unifiedCodeBaseInfo';
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['unifiedCodeBase/remove']),
  loadingQuery: Boolean(loading.effects['unifiedCodeBase/search']),
}))
class UnifiedCodeBase extends Component<any, any> {

  constructor(props){
    super(props)
    this.state={
      searchData:null,
      visible:false,
      tableData:{},
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
      title: '机构状态',
      dataIndex: 'jyzt',
    },
    // {
    //   title: '业务类型',
    //   dataIndex: 'ywlx',
    //   render: (_, record) => {
    //     return DecBusinessTypeEnum.toString(record.decYwlx);
    //   }
    // },
    // {
    //   title: '登记机关',
    //   dataIndex: 'memo10',
    // },
    // {
    //   title: '数据来源',
    //   dataIndex: 'dataSource',
    //   render: (_, record) => {
    //     return DataSourceEnum.toString(record.dataSource);
    //   }
    // },
    // {
    //   title: '核准日期',
    //   dataIndex: 'hzrq',
    // },
    // {
    //   title: '接收时间',
    //   dataIndex: 'dataTime',
    // },
    {
      title: '最新登记日期',
      dataIndex: 'dataTime',
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a onClick={() => this.requestData(record.archId)} >详情</a>
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'unifiedCodeBase/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    console.log('search', values)
    const data = { ...values }
    data.memo10 = data.memo10 ? data.memo10[0] : '';
    if (data.decDjjg && data.decDjjg.length > 0) {
      data.decDjjg = data.decDjjg[data.decDjjg.length - 1]
    }
    if (data.decHydm && data.decHydm.length > 0) {
      data.decHydm = data.decHydm[data.decHydm.length - 1]
    }
    this.setState({searchData:data})
    return `/services/code/detailinfo/list/${current}/${pageSize}${createSearchString(data)}`;
  }

  requestData = (id) => {
    this.setState({visible:true});
    this.props.dispatch({
      type: 'unifiedCodeBase/search',
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

  clearModal = () => {
    this.setState({visible:false, tableData: {}})
  }

  render() {
    return (
      <Card title='统一社会信用代码库'>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          formProps={{ layout: 'horizontal' }}
          formItemsProps={{searchData:this.state.searchData}}
          searchCreater={this.searchCreater}
          selectedAble
        />
        <UnifiedCodeBaseInfo visible={this.state.visible} clearModal={this.clearModal} data={this.state.tableData} loading={this.props.loadingQuery} />
      </Card>
    );
  }
}

@connect(({ loading }) => ({}))
class SearchForm extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      regOptions: [],//登记机关
      busOptions: [],//业务类型
      stOptions: [],//企业状态
      indOptions: [],//经济行业
    }
  }

  componentDidMount() {
    //登记机关
    this.props.dispatch(
      {
        type: 'unifiedCodeBase/searchRegDic',
        payLoad: { type: '3', code: '420000' },
        callBack: (res) => {
          this.setState({ regOptions: res.data })
        }
      }
    );
    //业务类型
    // this.props.dispatch(
    //   {
    //     type: 'unifiedCodeBase/searchCommonDic',
    //     payLoad: '16',
    //     callBack: (res) => {
    //       this.setState({ busOptions: res.data })
    //     }
    //   }
    // );
    //企业状态
    // this.props.dispatch(
    //   {
    //     type: 'unifiedCodeBase/searchCommonDic',
    //     payLoad: '5',
    //     callBack: (res) => {
    //       this.setState({ stOptions: res.data })

    //     }
    //   }
    // );
    //经济行业
    // this.props.dispatch(
    //   {
    //     type: 'unifiedCodeBase/searchRegDic',
    //     payLoad: { type: '12', code: '0' },
    //     callBack: (res) => {
    //       if (!res.data) { return }
    //       const indOptions = res.data.map(item => (
    //         {
    //           value: item.code,
    //           label: item.name,
    //           isLeaf: false,
    //         }
    //       ))
    //       this.setState({ indOptions })
    //     }
    //   }
    // );
  }

  exportExcel = () => {
    console.log('exportExcel')
    this.props.dispatch(
      {
        type: 'unifiedCodeBase/exportFieldDownLoad',
        payLoad: {
          exportParams:this.props.searchData
        },
        callBack: (res) => {
          exportFileFromBlob(res, `unifiedCodeBase.xls`);
        }
      }
    );
  }


  loadData = (selectedOptions) => {
    console.log('selectedOptions', selectedOptions)
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // targetOption.loading = true;
    this.props.dispatch(
      {
        type: 'unifiedCodeBase/searchRegDic',
        payLoad: { type: '12', code: targetOption.value },
        callBack: (res) => {
          // targetOption.loading = false;
          if (!res.data || res.data.length === 0) { return }
          targetOption.children = res.data.map(item => (
            {
              value: item.code,
              label: item.name,
              isLeaf: false,
            }
          ))
          this.setState({
            indOptions: [...this.state.indOptions],
          });
        }
      }
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { regOptions, busOptions, stOptions, indOptions } = this.state
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
        label: '法定代表人(负责人)',
        content: getFieldDecorator('fddbr')(<HInput />),
      },
      {
        label: '登记机关',
        content: getFieldDecorator('memo10')(<HCascader changeOnSelect options={regOptions} fieldNames={{ label: 'name', value: 'code', children: 'childs' }} />),
      },
      {
        label: '机构状态',
        content: getFieldDecorator('jyzt')(<HInput />),
      },
      // {
      //   label: '企业状态',
      //   content: getFieldDecorator('jyzt')(
      //     <HSelect>
      //       {
      //         createSelectOptions(stOptions, item => item.name, item => item.code)
      //       }
      //     </HSelect>
      //   ),
      // },
      // {
      //   label: '业务类型',
      //   content: getFieldDecorator('ywlx')(
      //     <HSelect>
      //       {
      //         createSelectOptions(busOptions, item => item.name, item => item.code)
      //       }
      //     </HSelect>
      //   ),
      // },
      // {
      //   label: '经济行业',
      //   content: getFieldDecorator('jjhy2011')(
      //     <HCascader
      //       options={indOptions}
      //       changeOnSelect
      //       loadData={this.loadData}
      //     />
      //   ),
      // },
      {
        label: '接收时间',
        content: getFieldDecorator('dataTime')(<HRangePicker />),
      },
      {
        label: '经营范围',
        content: getFieldDecorator('jyfw')(<HInput />),
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
              <Button type='primary' onClick={()=>{this.modal.show()}} >导出</Button>
            </FormItem>
          </Col>
        </div>
        {/* <div className='divAreaContainer controlsContainer'>
          <Button type="primary" onClick={() => this.exportExcel()}>导出</Button>
        </div> */}
        <ExportFieldsModal 
          ref='modal'
          nameSpace='unifiedCodeBase'
          getInstance={(target) => this.modal = target}
          searchData={this.props.searchData}
          // getInstance={(target) => this.ExportFieldsModal = target}
        />
      </div>
    );
  }
}

export default UnifiedCodeBase;