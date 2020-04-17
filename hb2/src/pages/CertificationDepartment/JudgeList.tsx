import React, { Component } from 'react';
import { Card, Form, Button, Switch, Upload, message } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import HRangePicker from '@/components/Antd/HRangePicker';
import HSelect from '@/components/Antd/HSelect';
import SexEnum from '@/Enums/SexEnum';
import ExamingStatusOthersEnum from '@/Enums/ExamingStatusOthersEnum';
import { createSearchString, isEmptyArray, exportFileFromBlob } from '@/utils/SystemUtil';
import CheckStatusEnum from '@/Enums/CheckStatusEnum';
import ExamingStatusEnum from '@/Enums/ExamingStatusEnum';
import { createSelectOptions } from '@/utils/AntdUtil';
import { DOWNLOAD_API } from '@/services/api';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';

const TITLE = '评审员管理';
const FormItem = Form.Item;

const EDIT_HASH = '#/JudgeList/JudgeEdit';
/**
 * 评审员管理
 */
@connect(({ loading }) => ({
  loadingUpdate: Boolean(loading.effects['Judge/update']),
}))
class JudgeList extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: (_, record) => {
        return SexEnum.toString(record.sex);
      }
    },
    {
      title: '移动电话',
      dataIndex: 'phone',
    },
    {
      title: '行政职务',
      dataIndex: 'adminDuty',
    },
    {
      title: '从事专业',
      dataIndex: 'workMajor',
    },
    {
      title: '申报时间',
      dataIndex: 'createDate',
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
    },
    // {
    //   title: '审核状态',
    //   dataIndex: 'status',
    //   render: (_, record) => {
    //     return ExamingStatusEnum.toString(record.status);
    //   }
    // },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}/1`}>查看</a>
            <a href={`${EDIT_HASH}/${record.id}`}>修改</a>
            {/* <Switch loading={this.props.loadingUpdate} unCheckedChildren="隐藏" checkedChildren="显示" checked={record.hidden === '0'} onChange={(checked) => {
              this.updateHide(record.id, !checked)
            }} /> */}
            {
              record.status === CheckStatusEnum.UNSUBMIT &&
              <a onClick={() => this.updateCheckStatus(record.id)}>提交审核</a>
            }
          </span>
        );
      }
    },
  ];

  updateCheckStatus(id) {
    this.props.dispatch(
      {
        type: 'Judge/update',
        payLoad: {
          id,
          status: CheckStatusEnum.PASS,
        },
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  updateHide = (id, isHidden: boolean) => {
    this.props.dispatch(
      {
        type: 'Judge/update',
        payLoad: {
          id,
          hidden: isHidden ? '1' : '0',
        },
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  private table: SearchTableClass;


  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/exam/fhexamreviewer/selectAll/${current}/${pageSize}${createSearchString(values)}`;
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          selectedAble
        />
      </Card>
    );
  }
}

@connect(({ loading }) => ({
  loadingUpdate: Boolean(loading.effects['Judge/updateCheckStatus']),
}))
class SearchForm extends Component<IFormAndDvaInterface, any>  {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
    };
  }


  submitCheck(ids) {
    if (ids) {
      this.props.dispatch(
        {
          type: 'Judge/updateCheckStatus',
          payLoad: ids,
          callBack: (res) => {
            this.props.refresh();
          }
        }
      )
    }
  }

  exportExcel() {
    const filedValues: any = this.props.form.getFieldsValue();
    const params: any = {
      flag: 1,
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
        type: 'Judge/exportExcel',
        payLoad: '?' + Object.keys(params).filter((key) => params[key]).map((key) => `${key}=${params[key]}`).join('&'),
        callBack: (res) => {
          exportFileFromBlob(res, '评审员.xlsx');
        }
      }
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '姓名',
        content: getFieldDecorator('name')(<HInput />),
      },
      {
        label: '申报时间',
        content: getFieldDecorator('createDate')(<HRangePicker />),
      },
      {
        label: '审核状态',
        content: getFieldDecorator('status')(<HSelect>
          {
            createSelectOptions(ExamingStatusOthersEnum.ALL_LIST, ExamingStatusOthersEnum.toString)
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
                <FormItem key={item.label} label={item.label}>{item.content}</FormItem>
              );
            })
          }
          <FormItem>
            <FormRefreshButton />
            <FormResetButton />
          </FormItem>
        </div>
        <div className='divAreaContainer controlsContainer'>
          <EditButton hash={EDIT_HASH} />
          <Upload action='/services/exam/file/upload3/uploadExcel3' showUploadList={false} onChange={(arg) => {
            const { file } = arg;
            if (file.status === 'done') {
              this.setState({ uploading: false });
              if (file.response.sucess) {
                message.success('导入成功');
                this.props.refresh();
              }
              else {
                message.error(file.response.entity);
              }
            }
            else if (file.status === 'error') {
              this.setState({ uploading: false });
              if (file.response && file.response.entity) {
                message.error(file.response.entity);
              }
              else {
                message.error('未知错误');
              }
            }
            else {
              this.setState({ uploading: true });
            }
          }}><Button type="primary" loading={this.state.uploading}>导入</Button></Upload>
          <Button type="primary" onClick={() => this.exportExcel()}>导出</Button>
          <a href={DOWNLOAD_API(1840)} target="_blank">下载模板</a>
          {/* <Button type="danger" disabled={isEmptyArray(this.props.selectedRowKeys)} onClick={() => this.submitCheck(this.props.selectedRowKeys)}>提交审核</Button> */}
        </div>
      </div >
    );
  }
}

export default JudgeList;