import React, { Component } from 'react';
import { Card,message } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { getPropsParams } from '@/utils/SystemUtil';
import { connect } from 'dva';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import EducationDegreeEnum from "@/Enums/EducationDegreeEnum";
import AuthorizedCheckStatusEnum from '@/Enums/AuthorizedCheckStatusEnum'
import TITLE_Enum from '@/Enums/ProfessionalTitleEnum'

const EDIT_HASH = '#/Verify/UserBackStage/MemberList/MemberEdit';

@connect(({ loading }) => ({
  loading
}))
class MemberList extends Component<IFormAndDvaInterface, any> {
  private table: SearchTableClass;

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/exam/fhexampersonhistory/getById/${getPropsParams(this.props).id}/${current}/${pageSize}`
  }
  edit = (record) => {
    if (record.checkStatus === AuthorizedCheckStatusEnum.CHECKING) {
      message.info('正在审核中的数据不能编辑')
    }
    window.location.hash = `${EDIT_HASH}/${record.id}`
  }
  render() {
    return (
      <Card title="资料信息">

        <div>
          
          <SearchTable
            getInstance={(target) => this.table = target}
            searchCreater={this.searchCreater}
            columns={[
              {
                title: '序号',
                dataIndex: 'serialNumber',
                render: (text, record, index) => `${index + 1}`
              },
              {
                title: '姓名',
                dataIndex: 'name',
              },
              {
                title: '文化程度',
                dataIndex: 'degree',
                render: text => `${EducationDegreeEnum.toString(text)}`
              },
              {
                title: '职称',
                dataIndex: 'title',
                render: text => `${TITLE_Enum.toString(text)}`
              },
              {
                title: '所学专业',
                dataIndex: 'major',
              },
              {
                title: '年限',
                dataIndex: 'majorAge',
              },
              {
                title: '现在部门岗位',
                dataIndex: 'station',
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
                      <a onClick={() => this.edit(record)}>详情</a>
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

export default MemberList;