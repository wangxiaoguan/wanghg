import { Button, Col, Form, Upload, Card, Switch,message } from 'antd';
import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Pie } from '@/components/Charts';
import { connect } from 'dva';
import HSelect from '@/components/Antd/HSelect';
import HInput from '@/components/Antd/HInput';
import EditButton from '@/components/EditButton';
import { createSearchString, exportFileFromBlob, isEmptyArray, createExportParams } from '@/utils/SystemUtil';
import FormRefreshButton from '@/components/FormRefreshButton';
import FormResetButton from '@/components/FormResetButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import HRangePicker from '@/components/Antd/HRangePicker';
import CheckStatusEnum from '@/Enums/CheckStatusEnum';
import { createSelectOptions } from '@/utils/AntdUtil';
import UpholdEnum from '@/Enums/UpholdEnum';
import ExamineStatusEnum from '@/Enums/ExamineStatusEnum';
import ProfessionLevelStatusEnum from '@/Enums/ProfessionLevelStatusEnum';
import ProfessionNumStatusEnum from '@/Enums/ProfessionNumStatusEnum';

const classNames = require('./ExpertDatabaseList.less');

const FormItem = Form.Item;

const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '#/expertDatabase/ExpertDatabaseList/ExpertDatabaseEdit';


/**
 * 专家库管理
 */
@connect(({ loading, global }) => ({
  loading, global
}))
class ExpertDatabaseList extends Component<IDispatchInterface, any> {
  constructor(props) {
    super(props);
    this.state = {
      // 表格数据
      data: [],

      // 当前页码
      page: 1,
      pageSize: 20,
      // 查询条件
      searchParams: null,
      majoranalysisData: null,
      titlelevelanalysisData: null,
    };
  }

  private COLUMNS: any[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: (text) => text === 1 ? '男' : '女'
    },
    {
      title: '手机',
      dataIndex: 'phone',
    },
    {
      title: '职称序列',
      dataIndex: 'titleId',
      render: (text, record) => {
        return ProfessionNumStatusEnum.toString(record.titleId);
      }
    },
    {
      title: '职称级别',
      dataIndex: 'titleLevel',
      render: (text, record) => {
        return ProfessionLevelStatusEnum.toString(record.titleLevel);
      }
    },
    {
      title: '申报时间',
      dataIndex: 'createDate',
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      render: (text, record) => {
        return ExamineStatusEnum.toString(record.auditStatus);
      }
    },
    {
      title: '操作',
      dataIndex: '',
      render: (text, record) => {
        const checkEnable = record.auditStatus === '1'
        return (
          <span className="controlsContainer">
            <a href={`${EDIT_HASH}/detail/${record.id}`}>查看</a>
            <a className={this.props.global.user.workerDeptId !== record.uphold ? classNames.reviseData : null} href={`${EDIT_HASH}/edit/${record.id}`}>修改</a>
            <Switch
              loading={this.props.loadingIsShow}
              checkedChildren='显示'
              unCheckedChildren='隐藏'
              checked={record.isHidden === '1'}
              onChange={(enable) => {
                this.update({ id: record.id, isHidden: enable ? '1' : '0' })
              }}
            />
            <a className={this.props.global.user.workerDeptId!==record.uphold?classNames.reviseData:null} onClick={() => {this.update({ id: record.id, auditStatus: '1' })}}>审核通过</a>
            <a className={this.props.global.user.workerDeptId!==record.uphold?classNames.reviseData:null} onClick={() => {this.update({ id: record.id, auditStatus: '0' })}}>审核拒绝</a>
          </span>
        );
      },
    },
  ];

  private table: SearchTableClass;

  update = (payLoad) => {
    /** 
    *废弃之前的提交审核功能,新增审核通过与审核失败功能（需要后端给接口）
    **/
    // this.props.dispatch(
    //   {
    //     type: 'expertDataBase/update',
    //     payLoad,
    //     callBack: () => {
    //       this.table.refresh();
    //     }
    //   }
    // );
  }

  componentDidMount() {
    this.requestMajoranalysis();
    this.requestTitlelevelanalysis();
  }

  requestMajoranalysis() {
    this.props.dispatch(
      {
        type: 'expertDataBase/majoranalysis',
        payLoad: null,
        callBack: (res) => {
          //转换成pie组件需要的格式{x,y}
          let data = res.data;
          if (data) {
            data = data.map((item) => {
              return { x: item.major || '未知', y: item.num };
            });
          }
          this.setState({ majoranalysisData: data });
        },
      }
    );
  }

  requestTitlelevelanalysis() {
    this.props.dispatch(
      {
        type: 'expertDataBase/titlelevelanalysis',
        payLoad: null,
        callBack: (res) => {
          //转换成pie组件需要的格式{x,y}
          let data = res.data;
          if (data) {
            data = data.map((item) => {
              return { x: item.titleLevel || '未知', y: item.num };
            });
          }
          this.setState({ titlelevelanalysisData: data });
        },
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/experts/base/getAll/${current}/${pageSize}${createSearchString(values)}`;
  }

  transData = (response: any) => {
    return {
      data: response.data.data,
      total: response.data.length,
    }
  }

  render() {
    return (
      <Card title='专家库管理'>
        <div className={`divAreaContainer ${classNames.chartContainer}`}>
          <Pie
            hasLegend
            subTitle="技术资格分类"
            data={this.state.titlelevelanalysisData}
            total={() => (
              <span
                dangerouslySetInnerHTML={{
                  __html: this.state.titlelevelanalysisData ? this.state.titlelevelanalysisData.reduce((pre, now) => now.y + pre, 0).toString() : '--',
                }}
              />
            )}
          />
          <Pie
            hasLegend
            subTitle="总专业数"
            data={this.state.majoranalysisData}
            total={() => (
              <span
                dangerouslySetInnerHTML={{
                  __html: this.state.majoranalysisData ? this.state.majoranalysisData.reduce((pre, now) => now.y + pre, 0).toString() : '--',
                }}
              />
            )}
          />
        </div>
        <SearchTable
          getInstance={(target) => this.table = target}
          formItems={SearchForm}
          columns={this.COLUMNS}
          searchCreater={this.searchCreater}
          transData={this.transData}
          formProps={{ layout: 'horizontal' }}
          selectedAble
        />
      </Card>
    );
  }
}

@connect(({ loading,global }) => ({
  loadingExoprt: Boolean(loading.effects['expertDataBase/exportExcel']),
  updateAuditStatus: Boolean(loading.effects['expertDataBase/updateAuditStatus']),
  global,
}))
class SearchForm extends Component<any>  {
  requestExportExcel = () => {
    const filedValues: any = this.props.form.getFieldsValue();
    this.props.dispatch(
      {
        type: 'expertDataBase/exportExcel',
        payLoad: filedValues,
        callBack: (res) => {
          exportFileFromBlob(res, '专家导出.xls');
        }
      }
    );
  }

  updateAuditStatus(ltems,idList) {
    if(!isEmptyArray(ltems)){
      let isFlag = ltems.every(item=>{return item.uphold===this.props.global.user.workerDeptId})
      if(!isFlag){
        message.warning('不可对其他部门人员进行审核！')
        return
      }
    }
    if (!isEmptyArray(idList)) {
      let payLoad = idList.map((item) => {
        return { id: item }
      })
    /** 
    *废弃之前的提交审核功能,新增审核通过与审核失败功能（需要后端给接口）
    **/
      // this.props.dispatch(
      //   {
      //     type: 'expertDataBase/updateAuditStatus',
      //     payLoad,
      //     callBack: () => {
      //       this.props.refresh();
      //     }
      //   }
      // );
    }
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
        label: '职称序列',
        content: getFieldDecorator('titleId')(<HSelect>
          {
            createSelectOptions(ProfessionNumStatusEnum.ALL, ProfessionNumStatusEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '职称级别',
        content: getFieldDecorator('titleLevel')(<HSelect>
          {
            createSelectOptions(ProfessionLevelStatusEnum.ALL, ProfessionLevelStatusEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '审核状态',
        content: getFieldDecorator('auditStatus')(<HSelect>
          {
            createSelectOptions(ExamineStatusEnum.ALL_LIST, ExamineStatusEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '部门来源',
        content: getFieldDecorator('uphold')(<HSelect>
          {
            createSelectOptions(UpholdEnum.ALL, UpholdEnum.toString)
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
                <Col span={8} key={item.label}>
                  <FormItem {...FormItemLayout} label={item.label}>{item.content}</FormItem>
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
        </div >
        <div className='divAreaContainer controlsContainer'>
          <EditButton hash={`${EDIT_HASH}/add`} />
          <Upload
            action='/services/experts/base/import'
            showUploadList={false}
            onChange={(info) => {
              console.log(info);
            }}
          >
            <Button icon='upload' type="primary">导入</Button>
          </Upload>
          <Button loading={this.props.loadingExoprt} type="primary" onClick={() => this.requestExportExcel()}>导出</Button>
          <a href='/services/indexManage/file/download/6324' download={'模板.xls'} target='_blank'>下载导入模板</a>
          <Button disabled={isEmptyArray(this.props.selectedRowKeys)} loading={this.props.updateAuditStatus} type="primary" onClick={() => {
            console.log(this.props);
            this.updateAuditStatus(this.props.selectedRows,this.props.selectedRowKeys)
          }}>审核通过</Button>
          <Button disabled={isEmptyArray(this.props.selectedRowKeys)} loading={this.props.updateAuditStatus} type="primary" onClick={() => {
            console.log(this.props);
            this.updateAuditStatus(this.props.selectedRows,this.props.selectedRowKeys)
          }}>审核拒绝</Button>
        </div>
      </div >
    );
  }
}

export default Form.create()(ExpertDatabaseList);
