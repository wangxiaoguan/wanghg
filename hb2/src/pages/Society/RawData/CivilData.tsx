import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Col, Card, Button } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createSearchString } from '@/utils/SystemUtil';
import ExportFieldsModal from './ExportFieldsModal/ExportFieldsModal'
import DepartStatusEnum from '@/Enums/DepartStatusEnum';
import HSelect from '@/components/Antd/HSelect';
import { createSelectOptions } from '@/utils/AntdUtil';

import HCascader from '@/components/Antd/HCascader';
import CivilDataInfo from './CivilDataInfo';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};


@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['civilData/remove']),
  loadingQuery: Boolean(loading.effects['civilData/search']),
}))
class CivilData extends Component<any, any> {

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
      render: (_, record) => {
        return DepartStatusEnum.toString(record.jyzt);
      }
    },
    // {
    //   title: '核准日期',
    //   dataIndex: 'hzrq',
    // },
    // {
    //   title: '业务类型',
    //   dataIndex: 'ywlx',
    //   render: (_, record) => {
    //     return DecBusinessTypeEnum.toString(record.ywlx);
    //   }
    // },
    // {
    //   title: '登记机关',
    //   dataIndex: 'memo10',
    // },
    // {
    //   title: '负责人',
    //   dataIndex: 'fddbr',
    // },
    //FIXME:字段名称？
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
        type: 'civilData/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  requestData = (id) => {
    this.setState({visible:true});
    this.props.dispatch({
      type: 'civilData/search',
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

  searchCreater = (values: any, pageSize: number, current: number) => {
    console.log('search', values)
    const data = { type: 5, ...values }
    if (data.memo10 && data.memo10.length > 0) {
      data.memo10 = data.memo10[data.memo10.length - 1]
    }
    this.setState({searchData:data})
    return `/services/code/centerinfo/list/${current}/${pageSize}${createSearchString(data)}`;
  }

  render() {
    return (
      <Card title='民政数据(中心)'>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          formProps={{ layout: 'horizontal' }}
          formItemsProps={{searchData:this.state.searchData}}
          searchCreater={this.searchCreater}
          selectedAble
        />
        <CivilDataInfo visible={this.state.visible} clearModal={this.clearModal} data={this.state.tableData} loading={this.props.loadingQuery} />
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
        type: 'civilData/searchRegDic',
        payLoad: { type: '3', code: '420000' },
        callBack: (res) => {
          this.setState({ regOptions: res.data })
        }
      }
    );
    //业务类型
    this.props.dispatch(
      {
        type: 'civilData/searchCommonDic',
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
        content: getFieldDecorator('jyzt')(
          <HSelect>
            {
              createSelectOptions(DepartStatusEnum.ALL_LIST, DepartStatusEnum.toString)
            }
          </HSelect>
          ),
      },
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
        <ExportFieldsModal 
          ref='modal'
          nameSpace='civilData'
          getInstance={(target) => this.modal = target}
          searchData={this.props.searchData}
          // getInstance={(target) => this.ExportFieldsModal = target}
        />
      </div>
    );
  }
}

export default CivilData;