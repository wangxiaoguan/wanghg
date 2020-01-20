import React, { Component } from 'react';
import { Card, Form, Button } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import { filterOb } from '@/utils/utils';
import { createSearchString } from '@/utils/SystemUtil';
import EditButton from '@/components/EditButton';
const TITLE = '标准研制';
const FormItem = Form.Item;

const EDIT_HASH = '#/StandardDevelop/ProjectEdit';
const TASK_HASH = '#/StandardDevelop/TaskManage';

@connect(({ loading }) => ({
  loading,
}))

class ProjectManege extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [

    // {
    //   title: '项目编号',
    //   dataIndex: 'projectCode',
    // },
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '项目来源',
      dataIndex: 'projectSource',
    },
    {
      title: '项目类型',
      dataIndex: 'projectType',
    },
    {
      title: '标准类型',
      dataIndex: 'standardType',
    },
    {
      title: '负责人',
      dataIndex: 'head',
    },
    {
      title: '项目周期',
      dataIndex: 'projectCycle',
    },
    {
      title: '项目金额',
      dataIndex: 'projectAmonut',
    },
    {
      title: '项目状态',
      dataIndex: 'projectStatus',
    },
    {
      title: '操作',
      width: 200,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a onClick={() => {
              this.remove({ id: record.id })
            }}>删除 </a>
            <a href={`${TASK_HASH}/${record.id}`}>进入流程</a>
            <a href={`${EDIT_HASH}/${record.id}`}>编辑</a>
          </span>
        );
      }
    },
  ];

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'ProjectManage/remove',
        payLoad: id,
        callBack: () => {
          this.props.refresh();
        }
      }
    );
  }

  private table: SearchTableClass;

  searchCreater = (values: any, pageSize: number, current: number) => {
    const data = { ...filterOb(values) }
    return `/services/standard/fhstd/list/${current}/${pageSize}/${createSearchString(data)}`;
  }

  transData = (response: any) => {
    return {
      data: response.data.data,
      total: response.data.length,
    }
  }

  update = (payLoad) => {
    this.props.dispatch(
      {
        type: 'ProjectManage/update',
        payLoad,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          transData={this.transData}
        />
      </Card>
    );
  }

}

class SearchForm extends Component<any>  {
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '项目名称',
        content: getFieldDecorator('projectName')(<HInput />),
      },
      {
        label: '项目来源',
        content: getFieldDecorator('projectSource')(<HInput />),
      },
      {
        label: '项目类型',
        content: getFieldDecorator('projectType')(<HInput />),
      },
      {
        label: '标准类型',
        content: getFieldDecorator('standardType')(<HInput />),
      },
      {
        label: '负责人',
        content: getFieldDecorator('head')(<HInput />),
      },
      {
        label: '项目周期',
        content: getFieldDecorator('projectCycle')(<HInput />),
      },
      {
        label: '项目状态',
        content: getFieldDecorator('projectStatus')(<HInput />),
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
          {/* <div style={{marginTop:20}}>
            <Button type="primary" onClick={() => {}}>新建</Button>
          </div> */}
          <div className='divAreaContainer controlsContainer'>
            <EditButton hash={EDIT_HASH} />
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectManege;