import React, { Component } from 'react';
import { Card } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { orgId, createSearchString, getPropsParams } from '@/utils/SystemUtil';
import { connect } from 'dva';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import EducationDegreeEnum from '@/Enums/EducationDegreeEnum';
import AuthorizedCheckStatusEnum from '@/Enums/AuthorizedCheckStatusEnum'

const Detail_HASH = '#/Verify/UserBackStage/AuthorizerList/AuthorizerDetail';

@connect(({ loading }) => ({ loading }))
class AuthorizerLogDetail extends Component<IFormAndDvaInterface, any> {
  private table: SearchTableClass;

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/exam/fhexamsignatoryhistory/getById/${getPropsParams(this.props).id}/${current}/${pageSize}`
  }

  render() {
    return (
      <Card title="授权签字人维护记录">
        <SearchTable
          getInstance={(target) => this.table = target}
          searchCreater={this.searchCreater}
          columns={
            [
              {
                title: '授权签字人姓名',
                dataIndex: 'signatioyName',
              },
              {
                title: '职称',
                dataIndex: 'title',
              },
              {
                title: '文化程度',
                dataIndex: 'eduDegree',
                render: (text) => <span>{EducationDegreeEnum.toString(text)}</span>
              },
              {
                title: '毕业院校及专业',
                dataIndex: 'graduateSchool',
              },
              {
                title: '授权签字人领域',
                dataIndex: 'authorizedOfficer',
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
                      <a href={`${Detail_HASH}/${record.id}`}>详情</a>
                    </div>
                  );
                }
              },
            ]
          }
        />
      </Card>
    );
  }
}

export default AuthorizerLogDetail;