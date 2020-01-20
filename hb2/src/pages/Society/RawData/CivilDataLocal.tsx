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
import DepartStatusEnum from '@/Enums/DepartStatusEnum';
import ExportFieldsModal from './ExportFieldsModal/ExportFieldsModal'

import HCascader from '@/components/Antd/HCascader';
import CivilDataLocalInfo from './CivilDataLocalInfo';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['civilDataLocal/remove']),
  loadingQuery: Boolean(loading.effects['civilDataLocal/search']),
}))
class CivilDataLocal extends Component<any, any> {

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
      dataIndex: 'aaae0027',
    },
    {
      title: '机构名称',
      dataIndex: 'aaae0002',
    },
    {
      title: '机构状态',
      dataIndex: 'aaax0032',
      render: (_, record) => {
        return DepartStatusEnum.toString(record.aaax0032);
      }
    },
    // {
    //   title: '核准日期',
    //   dataIndex: 'aaax0019',
    // },
    // {
    //   title: '业务类型',
    //   dataIndex: 'infoactiontype',
    //   render: (_, record) => {
    //     return DecBusinessTypeEnum.toString(record.infoactiontype);
    //   }
    // },
    // {
    //   title: '登记机关',
    //   dataIndex: 'aaae0003',
    // }, 
    // {
    //   title: '负责人',
    //   dataIndex: 'aaae0008',
    // }, 
    {
      title: '最新登记时间',
      dataIndex: 'aaax0031',
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a onClick={() => this.requestData(record.axxx0001)} >详情</a>
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'civilDataLocal/remove',
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
    if (data.aaae0003 && data.aaae0003.length > 0) {
      data.aaae0003 = data.aaae0003[data.aaae0003.length - 1]
    }
    this.setState({searchData:data})
    return `/services/code/civilinfo/list/${current}/${pageSize}${createSearchString(data)}`;
  }
  
  requestData = (id) => {
    this.setState({visible:true});
    this.props.dispatch({
      type: 'civilDataLocal/search',
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
        <CivilDataLocalInfo visible={this.state.visible} clearModal={this.clearModal} data={this.state.tableData} loading={this.props.loadingQuery}/>
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
        type: 'civilDataLocal/searchRegDic',
        payLoad: { type: '3', code: '420000' },
        callBack: (res) => {
          this.setState({ regOptions: res.data })
        }
      }
    );
    //业务类型
    this.props.dispatch(
      {
        type: 'civilDataLocal/searchCommonDic',
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
        content: getFieldDecorator('aaae0027')(<HInput />),
      },
      {
        label: '机构名称',
        content: getFieldDecorator('aaae0002')(<HInput />),
      },
      {
        label: '法定代表人',
        content: getFieldDecorator('aaae0008')(<HInput />),
      },
      {
        label: '登记机关',
        content: getFieldDecorator('aaae0003')(<HCascader changeOnSelect options={regOptions} fieldNames={{ label: 'name', value: 'code', children: 'childs' }} />),
      },
      {
        label: '机构状态',
        content: getFieldDecorator('aaax0032')(
          <HSelect>
            {
              createSelectOptions(DepartStatusEnum.ALL_LIST, DepartStatusEnum.toString)

            }
          </HSelect>
        ),
      },
      {
        label: '接收时间',
        content: getFieldDecorator('dataTime')(<HRangePicker />),
      },
      //FIXME:民政本地经营范围？
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
          nameSpace='civilDataLocal'
          getInstance={(target) => this.modal = target}
          searchData={this.props.searchData}
          // getInstance={(target) => this.ExportFieldsModal = target}
        />
      </div>
    );
  }
}

export default CivilDataLocal;