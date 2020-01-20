import React, { Component } from 'react';
import { Card, Form, Col, Button, Switch,Radio } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import HSelect from '@/components/Antd/HSelect';
import HRangePicker from '@/components/Antd/HRangePicker';
import ArgueStatusEnum from '@/Enums/ArgueStatusEnum';
import HandleResultEnum from '@/Enums/HandleResultEnum';
import NoticeStatusEnum from '@/Enums/NoticeStatusEnum';
import HandleSelectEnum from '@/Enums/HandleSelectEnum';
import NeedExpertEnum from '@/Enums/NeedExpertEnum';
import ProblemPartEnum from '@/Enums/ProblemPartEnum';
import { createSearchString, exportFileFromBlob } from '@/utils/SystemUtil';
import { createSelectOptions } from '@/utils/AntdUtil';


const TITLE = '汽车三包管理';
const FormItem = Form.Item;

const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '#/CarThreeGuarantees/CarThreeConsumerList/CarThreeConsumerEdit';
const DETAIL_HASH = '#/CarThreeGuarantees/CarThreeConsumerList/CarThreeConsumerDetail/1';
/**
 * 汽车三包管理
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['carThreeConsumer/remove']),
}))
class CarThreeConsumerList extends Component<IDispatchInterface, any> {

  constructor(props){
    super(props)
    this.state={
      searchData:null
    }
  }

  private COLUMNS: any[] = [

    {
      title: '车辆品牌',
      dataIndex: 'brand',
    },
    {
      title: '车辆型号',
      dataIndex: 'model',
    },
    {
      title: '车辆号',
      dataIndex: 'plateNum',
    },
    {
      title: '车主姓名',
      dataIndex: 'name',
    },
    {
      title: '联系方式',
      dataIndex: 'telephone',
    },
    {
      title: '被投诉公司名称',
      dataIndex: 'enTelephone',
    },
    {
      title: '被投诉公司联系方式',
      dataIndex: 'enTelephone',
    },
    {
      title: '故障部位',
      dataIndex: 'disputeDescription',
      render: (_, record) => {
        return ProblemPartEnum.toString(record.disputeDescription);
      }
    },
    {
      title: '专家介入',
      dataIndex: 'needExpert',
      render: (_, record) => {
        return NeedExpertEnum.toString(record.needExpert);
      }
    },
    {
      title: '处理结果',
      dataIndex: 'result',
      render: (_, record) => {
        return HandleResultEnum.toString(record.result);
      }
    },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/detail/${record.id}`}>查看</a>
            <a href={`${EDIT_HASH}/edit/${record.id}`}>编辑</a>
            <DeleteLink target={this} record={record} />
            <Switch checked={record.hidden === '1'} checkedChildren="已公示" unCheckedChildren="未公示" onChange={(checked) => {
              this.props.dispatch(
                {
                  type: 'carThreeConsumer/updateStatus',
                  payLoad: {
                    id: record.id,
                    hidden: checked ? 1 : 0
                  },
                  callBack: () => {
                    this.table.refresh();
                  }
                }
              );
            }} />
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'carThreeConsumer/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }


  searchCreater = (values: any, pageSize: number, current: number) => {
    this.setState({searchData:values})
    return `/services/dpac/defectcarthreeguarantees/selectAll2/0/${current}/${pageSize}${createSearchString(values)}`;
  }


  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          formProps={{ layout: 'horizontal' }}
          formItemsProps={{searchData:this.state.searchData}}
          selectedAble
        />
      </Card>
    );
  }
}

@connect(({ loading }) => ({
}))
class SearchForm extends Component<any>  {
  exportExcel() {
    // const filedValues: any = this.props.form.getFieldsValue();
    // const params: any = {
    //   flag: 7,
    // };
    // if (filedValues.name) {
    //   params.name = filedValues.name;
    // }
    // if (filedValues.createDate && filedValues.createDate.length >= 2) {
    //   params.startDate = filedValues.createDate[0].format('YYYY-MM-DD');
    //   params.endDate = filedValues.createDate[1].format('YYYY-MM-DD');
    // }
    // if (filedValues.status) {
    //   params.status = filedValues.status;
    // }
    // this.props.dispatch(
    //   {
    //     type: 'carThreeConsumer/exportExcel',
    //     payLoad: '?' + Object.keys(params).filter((key) => { return params[key] }).map((key) => `${key}=${params[key]}`).join('&'),
    //     callBack: (res) => {
    //       exportFileFromBlob(res, '消费者.xlsx');
    //     }
    //   }
    // );
    this.props.dispatch({
      type: 'carThreeConsumer/exportExcel',
      payLoad: this.props.searchData,
      callBack: (res) => {
        exportFileFromBlob(res, '消费者.xlsx');
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '车辆品牌',
        content: getFieldDecorator('brand')(<HInput />),
      },
      {
        label: '车辆型号',
        content: getFieldDecorator('model')(<HInput />),
      },
      {
        label: '车辆号',
        content: getFieldDecorator('plateNum')(<HInput />),
      },
      {
        label: '车主姓名',
        content: getFieldDecorator('name')(<HInput />),
      },
      {
        label: '联系方式',
        content: getFieldDecorator('telephone')(<HInput />),
      },
      {
        label: '被投诉公司名称',
        content: getFieldDecorator('enName')(<HInput />),
      },
      {
        label: '被投诉公司联系方式',
        content: getFieldDecorator('enTelephone')(<HInput />),
      },
      {
        label: '故障部位',
        content: getFieldDecorator('disputeDescription')(<HSelect>{createSelectOptions(ProblemPartEnum.ALL_LIST, ProblemPartEnum.toString)}</HSelect>),
      },
      {
        label: '专家介入',
        content: getFieldDecorator('needExpert')(<HSelect>{createSelectOptions(NeedExpertEnum.ALL_LIST, NeedExpertEnum.toString)}</HSelect>),
      },
      {
        label: '公示状态',
        content: getFieldDecorator('hidden')(<HSelect>{createSelectOptions(NoticeStatusEnum.ALL_LIST, NoticeStatusEnum.toString)}</HSelect>),
      },
      {
        label: '处理结果',
        content: getFieldDecorator('result')(<HSelect>{createSelectOptions(HandleSelectEnum.ALL_LIST, HandleSelectEnum.toString)}</HSelect>),
      },
      {
        label: '诉求',
        content: getFieldDecorator('requestReason')(<HSelect>{createSelectOptions(ArgueStatusEnum.ALL_LIST, ArgueStatusEnum.toString)}</HSelect>),
      },
      {
        label: '投诉时间段查询',
        content: getFieldDecorator('createDate')(<HRangePicker />),
      },
    ];
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return (
                <Col key={item.label} span={8}>
                  <FormItem  {...FormItemLayout} label={item.label}>{item.content}</FormItem>
                </Col>
              );
            })
          }
          <Col span={8}>
            <FormItem wrapperCol={{ offset: 7 }}>
              <FormRefreshButton />
              <FormResetButton />
            </FormItem>
          </Col>
        </div>
        <div className='divAreaContainer controlsContainer'>
          <EditButton hash={`${EDIT_HASH}/add`} />
          <Button type="primary" onClick={() => this.exportExcel()}>导出</Button>
        </div>
      </div>
    );
  }
}

export default CarThreeConsumerList;