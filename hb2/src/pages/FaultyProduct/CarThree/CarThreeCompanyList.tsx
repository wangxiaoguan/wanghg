import React, { Component } from 'react';
import { Card, Form, Col, Button, Switch } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import HSelect from '@/components/Antd/HSelect';
import HandleResultEnum from '@/Enums/HandleResultEnum';
import ProblemPartEnum from '@/Enums/ProblemPartEnum';
import { createSearchString, exportFileFromBlob } from '@/utils/SystemUtil';
import { createSelectOptions } from '@/utils/AntdUtil';

const TITLE = '汽车三包管理';
const FormItem = Form.Item;

const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '#/CarThreeGuarantees/CarThreeCompanyList/CarThreeCompanyEdit';
/**
 * 汽车三包管理
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['carThreeCompany/remove']),
}))
class CarThreeGuaranteesList extends Component<IDispatchInterface, any> {

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
      title: '被投诉公司名称',
      dataIndex: 'enName',
    },
    {
      title: '投诉人',
      dataIndex: 'name',
    },
    {
      title: '投诉人联系方式',
      dataIndex: 'telephone',
    },
    // {
    //   title: '被投诉人',
    //   dataIndex: 'enName',
    // },
    {
      title: '被投诉人联系方式',
      dataIndex: 'enTelephone',
    },
    {
      title: '故障部位',
      dataIndex: 'problemPart',
      render: (_, record) => {
        return ProblemPartEnum.toString(record.problemPart);
      }
    },
    {
      title: '提交时间',
      dataIndex: 'createTime',
    },
    {
      title: '处理时间',
      dataIndex: 'updateTime',
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
            <a href={`${EDIT_HASH}/${record.id}/true`}>查看</a>
            <a href={`${EDIT_HASH}/${record.id}/false`}>编辑</a>
            <DeleteLink target={this} record={record} />
            <Switch checked={record.hidden === '1'} checkedChildren="已公示" unCheckedChildren="未公示" onChange={(checked) => {
              this.props.dispatch(
                {
                  type: 'carThreeCompany/updateStatus',
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
        type: 'carThreeCompany/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }
  searchCreater = (values: any, pageSize: number, current: number) => {
    this.setState({searchData:values})
    return `/services/dpac/defectcarthreeguarantees/selectAll2/1/${current}/${pageSize}${createSearchString(values)}`;
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
    const filedValues: any = this.props.form.getFieldsValue();
    const params: any = {
      flag: 8,
    };
    if (filedValues.name) {
      params.name = filedValues.name;
    }
    if (filedValues.createDate && filedValues.createDate.length >= 2) {
      params.startDate = filedValues.createDate[0].format('YYYY-MM-DD');
      params.endDate = filedValues.createDate[1].format('YYYY-MM-DD');
    }
    if (filedValues.status) {
      params.status = filedValues.status;
    }
    this.props.dispatch(
      {
        type: 'carThreeCompany/exportExcel',
        payLoad: this.props.searchData,
        callBack: (res) => {
          exportFileFromBlob(res, '企业三包.xlsx');
        }
      }
    );
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
        label: '处理状态',
        content: getFieldDecorator('result')(
          <HSelect>
            {
              createSelectOptions(HandleResultEnum.ALL_LIST, HandleResultEnum.toString)
            }
          </HSelect>),
      },
      {
        label: '故障部位',
        content: getFieldDecorator('problemPart')(
          <HSelect>
            {
              createSelectOptions(ProblemPartEnum.ALL_LIST, ProblemPartEnum.toString)
            }
          </HSelect>),
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
          <EditButton hash={EDIT_HASH} />
          <Button type="primary" onClick={() => this.exportExcel()}>导出</Button>
        </div>
      </div>
    );
  }
}

export default CarThreeGuaranteesList;