import React, { Component } from 'react';
import { Card, Form, Button, message, Modal, Input } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import HSelect from '@/components/Antd/HSelect';
import { filterOb } from '@/utils/utils';
import { createSearchString, isEmptyArray } from '@/utils/SystemUtil';
import ExamingStatusOthersEnum from '@/Enums/ExamingStatusOthersEnum';
import { createSelectOptions } from '@/utils/AntdUtil';
import DepartStatusEnum from '@/Enums/DepartStatusEnum';
import CheckModal from './CheckModal';
const { TextArea } = Input;


const TITLE = '能力表';
const FormItem = Form.Item;

const StatusEnum = [
  '',
  '全部参数',
  '部分参数',
]

/**
 * 人员信息
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['－－－/remove']),
}))
class DepartCheckAbilityList extends Component<IDispatchInterface, any> {

  constructor(props) {
    super(props)
    this.state = {
      visable:false,
      checkReason:'',
      modalType:'0',
      selectID:'0'
    }
  }


  private COLUMNS: any[] = [

    {
      title: '检测机构名称',
      dataIndex: 'orgName',
    },
    {
      title: '证书名称',
      dataIndex: 'certificateName',
    },
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
      render:(text) =>{
        return `${StatusEnum[parseInt(text) || 0]}`
      }
    },
    {
      title: '审核状态',
      dataIndex: 'checkStatus',
      render: (_, record) => {
        return ExamingStatusOthersEnum.toString(record.checkStatus);
      }
    },
    {
      title: '操作',
      dataIndex: '',
      width: 150,
      render: (_, record) => {
        return (
          <span className="controlsContainer">
            <a onClick={() => {
              // this.update({ id: record.id, checkStatus: '1' })
              this.setState({
                visable:true,
                modalType:'1',
                selectID:record.id
              })
            }}>通过</a>
            <a onClick={() => {
              // this.update({ id: record.id, checkStatus: '2' })
              this.setState({
                visable:true,
                modalType:'2',
                selectID:record.id
              })
            }}>不通过</a>
          </span>
        );
      }
    }];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: '－－－/remove',
        payLoad: id,
        callBack: () => {
          this.props.refresh();
        }
      }
    );
  }

  update = (payLoad) => {
    this.props.dispatch(
      {
        type: 'DepartCheckAbilityList/updateCheckStatus',
        payLoad,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    const data = filterOb(values)
    return `/services/exam/fhexamcapacity/list/${current}/${pageSize}/${createSearchString(data)}`;
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
        <Modal
          title="请输入原因"
          visible={this.state.visable}
          onOk={()=>{
            this.update({ id: this.state.selectID, checkStatus: this.state.modalType,comment:this.state.checkReason })//需确定原因字段
            this.setState({
              visable:false,
              modalType:'0'
            })
          }}
          onCancel={()=>{
            this.setState({
              visable:false,
              modalType:'0'
            })
          }}
        >
          <TextArea rows={4} onChange={(e)=>{
            // console.log(e.target.value)
            this.setState({
              checkReason:e.target.value
            })
          }} />
        </Modal>
      </Card>
    );
  }
}


@connect(({ loading }) => ({
}))
class SearchForm extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      status: '1',
    }
  }

  onOk = (comments) => {
    if (!comments || comments.length === 0) {
      message.error('请填写审核意见')
      return
    }
    this.batchUpdate(this.props.selectedRowKeys, this.state.status, comments);
  }

  private modal: CheckModal;

  batchUpdate = (selectedRowKeys, checkStatus, comments) => {
    let arr = []
    for (const id of selectedRowKeys) {
      arr.push({ id, checkStatus, comments })
    }
    this.props.dispatch(
      {
        type: 'DepartCheckAbilityList/updateBatchCheckStatus',
        payLoad: arr,
        callBack: () => {
          this.props.refresh();
          this.modal.close();
        }
      }
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '检测机构名称',
        content: getFieldDecorator('orgName')(<HInput />),
      },
      {
        label: '证书名称',
        content: getFieldDecorator('certificateName')(<HInput />),
      },
      {
        label: '审核状态',
        content: getFieldDecorator('checkStatus')(
          <HSelect>
            {
              createSelectOptions(ExamingStatusOthersEnum.ALL_LIST, ExamingStatusOthersEnum.toString)
            }
          </HSelect>),
      }
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
          <Button type="primary"
            disabled={isEmptyArray(this.props.selectedRows)}
            onClick={() => {
              this.setState({ status: '1' }, () => {
                this.modal.show()
              })
            }}
          >审核通过</Button>
          <Button type="danger"
            disabled={isEmptyArray(this.props.selectedRows)}
            onClick={() => {
              this.setState({ status: '2' }, () => {
                this.modal.show()
              })
            }}
          >审核不通过</Button>
        </div>
        <CheckModal getInstance={(target) => this.modal = target} onOk={this.onOk} />
      </div>
    );
  }
}

export default DepartCheckAbilityList; 