import React, { Component } from 'react';
import { Card } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { getPropsParams } from '@/utils/SystemUtil';
import { connect } from 'dva';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import AuthorizedCheckStatusEnum from '@/Enums/AuthorizedCheckStatusEnum'


const EDIT_HASH = '#/Verify/UserBackStage/EquipmentList/EquipmentEdit';

@connect(({ loading }) => ({ loading }))
class EquipmentLogDetailList extends Component<IFormAndDvaInterface, any> {
  private table: SearchTableClass;

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/exam/fhexamapparatushistory/getById/${getPropsParams(this.props).id}/${current}/${pageSize}`
  }

  render() {
    return (
      <Card title="设备仪器信息维护记录">

        <div>

          <SearchTable
            getInstance={(target) => this.table = target}
            searchCreater={this.searchCreater}
            columns={[
              {
                title: '序号',
                dataIndex: 'index',
                render: (text, record, index) => <span>{`${index + 1}`}</span>
              },
              {
                title: '仪器设备名称',
                dataIndex: 'apparatusName',
              },
              {
                title: '型号/规格',
                dataIndex: 'model',
              },
              {
                title: '有效截止日期',
                dataIndex: 'validTime',
              },
              {
                title: '审核状态',
                dataIndex: 'checkStatus',
                render: (text) => <span>{AuthorizedCheckStatusEnum.toString(text)}</span>
              },
              {
                title: '操作',
                width: 200,
                render: (_, record) => {
                  return (
                    <div className='controlsContainer'>
                      <a href={`${EDIT_HASH}/${record.id}`}>详情</a>
                    </div>
                  );
                }
              },
            ]}
          />
        </div>

      </Card>
    );
  }
}

export default EquipmentLogDetailList;