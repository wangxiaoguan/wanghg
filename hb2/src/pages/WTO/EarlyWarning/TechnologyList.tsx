import React, { Component } from 'react';
import { Card, Form } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import DeleteLink from '@/components/DeleteLink';
import EditButton from '@/components/EditButton';
import { createSearchString, hsCodeSearchStr } from '@/utils/SystemUtil';
import HSCodeWindow from '@/components/SelectedWindows/HSCodeWindow';
import { renderAttatch } from '@/utils/AntdUtil';

const TITLE = '技术法规管理';
const FormItem = Form.Item;
const EDIT_HASH = '#/earlyWarning/TechnologyList/TechnologyEdit';
/**
 * 技术法规管理
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['Technology/remove']),
}))
class TechnologyList extends Component<any, any> {
  private COLUMNS: any[] = [
    {
      title: '法规名称',
      dataIndex: 'lawTitle',
      render: (_, record) => {
        if (record.lawQueryUrl) {
          return <a href={record.lawQueryUrl} target="_blank">{record.lawTitle}</a>
        }
        else {
          return record.lawTitle;
        }
      }
    },
    {
      title: '发布国家',
      dataIndex: 'lawPublishCountry',
    },
    {
      title: '发布机构',
      dataIndex: 'orgName',
    },
    {
      title: '附件下载',
      dataIndex: 'lawDownloadUrl',
      render: (_, record) => {
        // return <a href={record.lawDownloadUrl} target="_blank">下载</a>
        return renderAttatch(record.attachInfo);
      }

    },
    {
      title: '操作',
      width: 160,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>修改</a>
            <DeleteLink target={this} record={record} />
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'Technology/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/wtolawinfo/list/${current}/${pageSize}${createSearchString(values, (params, key) => {
      switch (key) {
        case 'hsCode':
          return hsCodeSearchStr(params.hsCode);
        default:
          return null;
      }
    })}`;
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
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
        label: '法规名称',
        content: getFieldDecorator('lawTitle')(<HInput />),
      },
      {
        label: 'HS码',
        content: getFieldDecorator('hsCode')(
          <HSCodeWindow />
        ),
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
        </div>
      </div>
    );
  }
}

export default TechnologyList;