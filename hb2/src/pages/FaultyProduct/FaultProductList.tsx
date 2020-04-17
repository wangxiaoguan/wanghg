import React, { Component } from 'react';
import { Card, Form, Button } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import HSelect from '@/components/Antd/HSelect';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import AptitudeEnum from '@/Enums/AptitudeEnum'
import { createSearchString, isEmptyArray, exportFileFromBlob } from '@/utils/SystemUtil';
import { createSelectOptions, confirmDelete } from '@/utils/AntdUtil';

const TITLE = '检测机构数据管理';
const FormItem = Form.Item;

const EDIT_HASH = '#/FaultProductList/FaultProductEdit';
const DETAIL_HASH = '#/FaultProductList/FaultProductDetail/1';
/**
 * 缺陷产品后台数据
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['faultyProduct/remove']),
}))
class FaultProductList extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [

    {
      title: '机构名称',
      dataIndex: 'name',
    },
    {
      title: '检测资质',
      dataIndex: 'aptitude',
      render: (_, record) => {
        return AptitudeEnum.toString(record.aptitude);
      }
    },
    {
      title: '检测范围',
      dataIndex: 'checkReason',
    },
    {
      title: '联系人',
      dataIndex: 'linkman',
    },
    {
      title: '地址',
      dataIndex: 'addr',
    },
    {
      title: '联系方式',
      dataIndex: 'telephone',
    },
    {
      title: '操作',
      width: 200,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${DETAIL_HASH}/${record.id}`}>查看</a>
            <a href={`${EDIT_HASH}/${record.id}`}>编辑</a>
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
        type: 'faultyProduct/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/dpac/defectfeelermechanism/list/${current}/${pageSize}${createSearchString({ ...values, deleteStatus: 1 })}`;
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
}))
class SearchForm extends Component<any>  {
  exportExcel() {
    const params = {
      name:'',// 机构名称
      aptitude:'',// 机构资质
      checkReason:'',// 检测范围
    }
    this.props.dispatch(
      {
        type: 'faultyProduct/exportExcel',
        payLoad: params,
        callBack: (res) => {
          exportFileFromBlob(res, '检测机构管理.xlsx');
        }
      }
    );
  }
  remove = (selectedRowKeys) => {
    let ids = ''
    for (const id of selectedRowKeys) {
      ids += `${id},`
    }
    this.props.dispatch(
      {
        type: 'faultyProduct/remove',
        payLoad: ids.substring(0, ids.length - 1),
        callBack: () => {
          this.props.refresh();
        }
      }
    );
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '机构名称',
        content: getFieldDecorator('name')(<HInput />),
      },
      {
        label: '检测资质',
        content: getFieldDecorator('aptitude')(
          <HSelect>
            {
              createSelectOptions(AptitudeEnum.ALL_LIST, AptitudeEnum.toString)
            }
          </HSelect>
        ),
      },
      {
        label: '检测范围',
        content: getFieldDecorator('checkReason')(<HInput />),
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
          <Button type="primary" onClick={() => this.exportExcel()}>导出</Button>
          <Button type="danger" disabled={isEmptyArray(this.props.selectedRows)} onClick={() => {
            confirmDelete(() => {
              this.remove(this.props.selectedRowKeys);
            })
          }}>批量删除</Button>
        </div>
      </div>
    );
  }
}

export default FaultProductList;