import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Col, Card, Button } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import { createSelectOptions } from '@/utils/AntdUtil';
import FormRefreshButton from '@/components/FormRefreshButton';
import HSelect from '@/components/Antd/HSelect';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createSearchString } from '@/utils/SystemUtil';
import DecBusinessTypeEnum from '@/Enums/DecBusinessTypeEnum';
import ExportFieldsModal from './ExportFieldsModal/ExportFieldsModal'
import EnterpriseDataInfo from './EnterpriseDataInfo';
import HCascader from '@/components/Antd/HCascader';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['enterpriseData/remove']),
  loadingQuery: Boolean(loading.effects['enterpriseData/search']),
}))
class EnterpriseData extends Component<any, any> {

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
      dataIndex: 'decTyshxydm',
    },
    {
      title: '机构名称',
      dataIndex: 'decDwmc',
    },
    {
      title: '业务类型',
      dataIndex: 'ywlxName',
      // render: (_, record) => {
      //   return DecBusinessTypeEnum.toString(record.decYwlx);
      // }
    },
    {
      title: '登记机关',
      dataIndex: 'djjgName',
    }, {
      title: '核准日期',
      dataIndex: 'decHzrq',
    },
    {
      title: '接收时间',
      dataIndex: 'dataTime',
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

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'enterpriseData/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  requestData = (id) => {
    this.setState({visible: true})
    this.props.dispatch(
      {
        type: 'enterpriseData/search',
        payLoad: id,
        callBack: res => {
          if(res.code === '10001'){
            this.setState({ tableData: res.data });
          }else{
            this.clearModal();
          }
        },
      }
    );
  }

  clearModal = () => {
    this.setState({visible:false, tableData: {}})
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    console.log('search', values)
    const data = { ...values }
    if (data.decDjjg && data.decDjjg.length > 0) {
      data.decDjjg = data.decDjjg[data.decDjjg.length - 1]
    }
    if (data.decHydm && data.decHydm.length > 0) {
      data.decHydm = data.decHydm[data.decHydm.length - 1]
    }
    this.setState({searchData:data})
    return `/services/code/enterpriceinfo/list/${current}/${pageSize}${createSearchString(data)}`;
  }

  render() {
    return (
      <Card title='工商企业'>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          formProps={{ layout: 'horizontal' }}
          formItemsProps={{searchData:this.state.searchData}}
          searchCreater={this.searchCreater}
          selectedAble
        />
        <EnterpriseDataInfo data={this.state.tableData} visible={this.state.visible} clearModal={this.clearModal} loading={this.props.loadingQuery} />
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
    // this.ExportFieldsModal
  }

  // private modal: ExportFieldsModal;

  componentDidMount() {
    //登记机关
    this.props.dispatch(
      {
        type: 'enterpriseData/searchRegDic',
        payLoad: { type: '3', code: '420000' },
        callBack: (res) => {
          this.setState({ regOptions: res.data })
        }
      }
    );
    //业务类型
    this.props.dispatch(
      {
        type: 'enterpriseData/searchCommonDic',
        payLoad: '16',
        callBack: (res) => {
          this.setState({ busOptions: res.data })
        }
      }
    );
    //企业状态
    this.props.dispatch(
      {
        type: 'enterpriseData/searchCommonDic',
        payLoad: '5',
        callBack: (res) => {
          this.setState({ stOptions: res.data })

        }
      }
    );
    //经济行业
    this.props.dispatch(
      {
        type: 'enterpriseData/searchRegDic',
        payLoad: { type: '12', code: '0' },
        callBack: (res) => {
          if (!res.data) { return }
          const indOptions = res.data.map(item => (
            {
              value: item.code,
              label: item.name,
              isLeaf: false,
            }
          ))
          this.setState({ indOptions })
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
        type: 'enterpriseData/searchRegDic',
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
        content: getFieldDecorator('decTyshxydm')(<HInput />),
      },
      {
        label: '机构名称',
        content: getFieldDecorator('decDwmc')(<HInput />),
      },
      {
        label: '法定代表人',
        content: getFieldDecorator('decFddbrhfzr')(<HInput />),
      },
      {
        label: '登记机关',
        content: getFieldDecorator('decDjjg')(<HCascader changeOnSelect options={regOptions} fieldNames={{ label: 'name', value: 'code', children: 'childs' }} />),
      },
      {
        label: '企业状态',
        content: getFieldDecorator('decJyzt')(
          <HSelect>
            {
              createSelectOptions(stOptions, item => item.name, item => item.code)
            }
          </HSelect>
        ),
      },
      //FIXME:这里要调用经济类型的接口进行替换  decQylx
      {
        label: '业务类型',
        content: getFieldDecorator('decYwlx')(
          <HSelect>
            {
              createSelectOptions(busOptions, item => item.name, item => item.code)
            }
          </HSelect>
        ),
      },
      {
        label: '经济行业',
        content: getFieldDecorator('decHydm')(
          <HCascader
            options={indOptions}
            changeOnSelect
            loadData={this.loadData}
          />
        ),
      },
      {
        label: '接收时间',
        content: getFieldDecorator('dataTime')(<HRangePicker />),
      },
      {
        label: '经营范围',
        content: getFieldDecorator('decJyfw')(<HInput />),
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
        <ExportFieldsModal 
          ref='modal'
          nameSpace='enterpriseData'
          getInstance={(target) => this.modal = target}
          searchData={this.props.searchData}
          // getInstance={(target) => this.ExportFieldsModal = target}
        />
      </div>
    );
  }
}

export default EnterpriseData;