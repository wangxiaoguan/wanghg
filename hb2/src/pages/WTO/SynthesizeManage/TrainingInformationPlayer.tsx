import React from 'react';
import RefModal from '@/components/RefModal';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';

/**
 * 报名人员列表
 * props-trainId活动id
 */
class TrainingInformationPlayer extends RefModal {
  private table: SearchTableClass;
  constructor(props) {
    super(props, {
      footer: null,
    });
  }

  show() {
    if (this.table) {
      this.table.refresh();
    }
    super.show();
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/wtotrainenrolment/getTrainEnrollList/${this.props.trainId}/${current}/${pageSize}`
  }

  transData = (res) => {
    return {
      data: res.data.data,
      total: res.data.length,
    };
  }

  renderChildren() {
    return (
      <SearchTable
        getInstance={(target) => {
          console.log("get instance", target);
          this.table = target;
        }
        }
        formItems={null}
        searchCreater={this.searchCreater}
        transData={this.transData}
        columns={[
          {
            title: '人员姓名',
            dataIndex: 'contactPerson',
          },
          {
            title: '单位',
            dataIndex: 'companyName',
          },
          {
            title: '报名时间',
            dataIndex: 'createDate',
          },
        ]}
      />
    );
  }
}

export default TrainingInformationPlayer;