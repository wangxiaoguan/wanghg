import React, { Component } from 'react';
import { Card, Button, Input, Form, Select } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import BackButton from '@/components/BackButton';
import FormRefreshButton from '@/components/FormRefreshButton'
import FormResetButton from '@/components/FormResetButton'
import { createSearchString, isEmptyArray } from '@/utils/SystemUtil';
import { createSelectOptions } from '@/utils/AntdUtil'
import { connect } from 'dva';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import ExamingStatusEnum from '@/Enums/ExamingStatusEnum';
import ExamingStatusOthersEnum from '@/Enums/ExamingStatusOthersEnum';
import DeleteLink from '@/components/DeleteLink';
import AuditStatusEnum from '@/Enums/AuditStatusEnum'
import { getPropsParams } from '@/utils/SystemUtil';
import { confirmDelete } from '@/utils/AntdUtil';



const EDIT_HASH = '#/DepartmentAbilityFormList/DepartmentAbilityFormExtension'

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['UserBackStage_ExportBlock/remove']),
}))
class MaintenanceCapabilityList extends Component<IFormAndDvaInterface, any> {
  private table: SearchTableClass;

  // ${createSearchString({ deleteStatus: '1' })}
  searchCreater = (values: any, pageSize: number, current: number) => {
    let param = getPropsParams(this.props);
    const data = {
      certifId: param.id,
      deleteStatus: '1'
    }
    return `/services/exam/fhexamcapacity/list/${current}/${pageSize}/${createSearchString(data)}`
  }

  remove(id) {
    this.props.dispatch({
      type: 'DepartCheckAbilityList/remove',
      payLoad: id,
      callBack: () => {
        this.table.refresh();
      },
    });
  }


  render() {
    console.log(this.props)
    return (
      <Card title={
        <span>
          <span>维护能力</span>
          <BackButton type="primary" style={{ float: 'right' }} />
        </span>
      }>
        <SearchTable
          getInstance={(target) => this.table = target}
          searchCreater={this.searchCreater}
          selectedAble
          columns={[
            {
              title: '检测产品序号',
              dataIndex: 'proNum',
            },
            {
              title: '检测产品/项目类别',
              dataIndex: 'proType',
            },
            {
              title: '检测产品/项目',
              dataIndex: 'preName',
            },
            {
              title: '检测参数序号',
              dataIndex: 'parNum',
            },
            {
              title: '检测参数名称',
              dataIndex: 'parName',
            },
            {
              title: '是否全部参数',
              dataIndex: 'isParamType',
            },
            {
              title: '审核状态',
              dataIndex: 'checkStatus',
              render: text => `${ExamingStatusOthersEnum.toString(text)}`
            },
            {
              title: '操作',
              width: 150,
              render: (_, record) => {
                return (
                  <div className='controlsContainer'>
                    <a href={`${EDIT_HASH}/${record.certifId}+${record.id}`}>修改</a>
                    {/* <a onClick={() => this.remove(record.id)}>删除</a> */}
                    <DeleteLink target={this} record={record} />
                  </div>
                );
              }
            },
          ]}
          formItems={SearchForm}
          formItemsProps={{ certifId: getPropsParams(this.props).id }}
        />
      </Card>
    );
  }
}

export default MaintenanceCapabilityList

@connect(({ loading }) => ({ loading }))
class SearchForm extends Component<any>  {

  remove = (selectedRowKeys) => {
    let ids = ''
    for (const id of selectedRowKeys) {
      ids += `${id},`
    }
    this.props.dispatch({
      type: 'DepartCheckAbilityList/remove',
      payLoad: ids,
      callBack: () => {
        this.props.refresh();
      },
    });
  }

  //全部删除
  removeAll = () => {
    this.props.dispatch({
      type: 'DepartCheckAbilityList/removeAll',
      payLoad: this.props.certifId,//certifId
      callBack: () => {
        this.props.refresh()
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    console.log('this', this)
    const FORM_ITEMS = [
      {
        label: '审核状态',
        content: getFieldDecorator('title')(<Select style={{ width: 150 }}>{createSelectOptions(ExamingStatusOthersEnum.ALL_LIST, ExamingStatusOthersEnum.toString)}</Select>),
        span: 4
      },
    ];
    const { selectedRows } = this.props
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return <Form.Item key={item.label} label={item.label}>{item.content}</Form.Item>
            })
          }
          <Form.Item>
            <FormRefreshButton />
            <FormResetButton />
          </Form.Item>
        </div>
        <div className='divAreaContainer controlsContainer'>
          <Button type="danger" disabled={isEmptyArray(selectedRows)} onClick={() => {
            confirmDelete(() => {
              this.remove(this.props.selectedRowKeys);
            })
          }}>批量删除</Button>

          <Button type="danger" onClick={() => {
            confirmDelete(() => {
              this.removeAll();
            })
          }}>全部删除</Button>
        </div>
      </div>
    );
  }
}