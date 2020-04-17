import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Col, Card, Button } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import { createSelectOptions } from '@/utils/AntdUtil';
import FormRefreshButton from '@/components/FormRefreshButton';
import HSelect from '@/components/Antd/HSelect';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createSearchString } from '@/utils/SystemUtil';
import ExportFieldsModal from './ExportFieldsModal/ExportFieldsModal'
import IndividualDataInfo from './IndividualDataInfo';
import HCascader from '@/components/Antd/HCascader';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['individualData/remove']),
  loadingQuery: Boolean(loading.effects['individualData/search']),
}))
class IndividualData extends Component<any, any> {

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
      dataIndex: 'uniscid',
    },
    {
      title: '机构名称',
      dataIndex: 'traname',
    },
    {
      title: '核准日期',
      dataIndex: 'apprdate',
    },
    // {
    //   title: '业务类型',
    //   dataIndex: 'infoactiontype',
    //   render: (_, record) => {
    //     return DecBusinessTypeEnum.toString(record.infoactiontype);
    //   }
    // },
    {
      title: '登记机关',
      dataIndex: 'regorg',
    },
    {
      title: '负责人',
      dataIndex: 'name',
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
            <a onClick={() => this.requestData(record.fid)} >详情</a>
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'individualData/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  requestData = (id) => {
    this.setState({visible:true});
    this.props.dispatch(
      {
        type: 'individualData/search',
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
    if (data.regorg && data.regorg.length > 0) {
      data.regorg = data.regorg[data.regorg.length - 1]
    }
    this.setState({searchData:data})
    return `/services/code/selfemployedinfo/list/${current}/${pageSize}${createSearchString(data)}`;
  }

  render() {
    return (
      <Card title='工商个体'>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          formProps={{ layout: 'horizontal' }}
          formItemsProps={{searchData:this.state.searchData}}
          searchCreater={this.searchCreater}
          selectedAble
        />
        <IndividualDataInfo visible={this.state.visible} clearModal={this.clearModal} data={this.state.tableData} loading={this.props.loadingQuery} />
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
    }
  }

  componentDidMount() {
    //登记机关
    this.props.dispatch(
      {
        type: 'individualData/searchRegDic',
        payLoad: { type: '3', code: '420000' },
        callBack: (res) => {
          this.setState({ regOptions: res.data })
        }
      }
    );
    //业务类型
    this.props.dispatch(
      {
        type: 'individualData/searchCommonDic',
        payLoad: '16',
        callBack: (res) => {
          this.setState({ busOptions: res.data })
        }
      }
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { regOptions, busOptions } = this.state
    const FORM_ITEMS = [
      {
        label: '统一社会信用代码',
        content: getFieldDecorator('uniscid')(<HInput />),
      },
      {
        label: '机构名称',
        content: getFieldDecorator('traname')(<HInput />),
      },
      {
        label: '法定代表人(负责人)',
        content: getFieldDecorator('name')(<HInput />),
      },
      {
        label: '登记机关',
        content: getFieldDecorator('regorg')(<HCascader changeOnSelect options={regOptions} fieldNames={{ label: 'name', value: 'code', children: 'childs' }} />),
      },
      {
        label: '业务类型',
        content: getFieldDecorator('infoactiontype')(
          <HSelect>
            {
              createSelectOptions(busOptions, item => item.name, item => item.code)
            }
          </HSelect>
        ),
      },
      // {
      //   label: '接收时间',
      //   content: getFieldDecorator('dataTime')(<HRangePicker />),
      // },
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
          nameSpace='individualData'
          getInstance={(target) => this.modal = target}
          searchData={this.props.searchData}
          // getInstance={(target) => this.ExportFieldsModal = target}
        />
      </div>
    );
  }
}

export default IndividualData;