import React, { Component } from 'react';
import { Card, Form, Button, Tabs,Modal } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HSelect from '@/components/Antd/HSelect';
import { isEmptyArray, createSearchString, getPropsParams } from '@/utils/SystemUtil';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';
import DeleteLink from '@/components/DeleteLink';
import { connect } from 'dva';
import { confirmDelete, createSelectOptions, htmlToText } from '@/utils/AntdUtil';
import CheckCommentEnum from '@/Enums/CheckCommentEnum';

const TITLE = '普通评议审核';
const FormItem = Form.Item;

/**
 * 单个通报的普通评议审核
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['NoticeDiscussionCheck/remove']),
}))
class CommonCheckList extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      detail:{},
    };
  }
  private COLUMNS: any[] = [
    {
      title: '评议内容',
      dataIndex: 'commentContent',
      render: (text, record) => {
        return htmlToText(record.commentContent);
      }
    },
    {
      title: '评议时间',
      dataIndex: 'createDate',
    },
    {
      title: '审核状态',
      dataIndex: 'checkStatus',
      render: (_, record) => {
        return <span>{record.checkStatus==='0'?'未审核':record.checkStatus==='1'?'审核成功':'审核失败'}</span>;
      }
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <DeleteLink record={record} target={this} />
            <a onClick={()=>this.setState({visible:true,detail:record})}>查看</a>
          </span>
        );
      }
    },
  ];

  private normalTable: SearchTableClass;
  private proTable: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'NoticeDiscussionCheck/remove',
        payLoad:Array.of(id),
        callBack: () => {
          if (this.normalTable) {
            this.normalTable.refresh();
          }
          if (this.proTable) {
            this.proTable.refresh();
          }
        }
      }
    );
  }

  searchNormalCreater = (values: any, pageSize: number, current: number) => {
    let bulletinId = getPropsParams(this.props).discussionID;
    return `/services/wto/wtoofficialcomment/getBulletinCommentList/${bulletinId}/${current}/${pageSize}${createSearchString(values)}`
  }

  render() {
    const {detail} = this.state
    return (
      <Card title={TITLE}>
        <SearchTable
              getInstance={(target) => this.normalTable = target}
              columns={this.COLUMNS}
              formItems={SearchForm}
              searchCreater={this.searchNormalCreater}
              selectedAble
            />
        <Modal
            title="查看详情"
            visible={this.state.visible}
            footer={null}
            onCancel={()=>this.setState({visible:false})}
            afterClose={()=>this.setState({visible:false})}
            width={640}
          >
            <div>
              <table>
                <tbody>
                  <tr>
                    <td style={{width:80,verticalAlign:'top'}}>评议内容</td>
                    <td>{detail.commentContent}</td>
                  </tr>
                  <tr>
                    <td style={{width:80,verticalAlign:'top'}}>审核状态</td>
                    <td>{detail.checkStatus==='0'?'未审核':detail.checkStatus==='1'?'审核成功':'审核失败'}</td>
                  </tr>
                  <tr>
                    <td style={{width:80,verticalAlign:'top'}}>评议时间</td>
                    <td><span style={{fontSize:10,color:'#aaa'}}>{detail.createDate}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Modal>
      </Card>
    );
  }
}

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['NoticeDiscussionCheck/remove']),
}))
class SearchForm extends Component<any>  {
  updateCheckStatus(idList: string[], isCheck: boolean) {
    let params = {};
    params.idList = idList;
    params.isCheck = isCheck;
    this.props.dispatch(
      {
        type: 'NoticeDiscussionCheck/updateCheckStatus',
        payLoad: params,
        callBack: () => {
          this.props.refresh();
        }
      }
    );
  }

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'NoticeDiscussionCheck/remove',
        payLoad: id,
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
        label: '审核状态',
        content: getFieldDecorator('checkStatus')(<HSelect>
          {
            createSelectOptions(CheckCommentEnum.ALL_LIST, CheckCommentEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '评议时间',
        content: getFieldDecorator('createDate')(<HRangePicker />),
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
          <Button
            type="primary"
            disabled={isEmptyArray(this.props.selectedRows)}
            onClick={() => {
              this.updateCheckStatus(this.props.selectedRowKeys, true);
            }}
          >
            审核
            </Button>
          <Button
            type="primary"
            disabled={isEmptyArray(this.props.selectedRows)}
            onClick={() => {
              this.updateCheckStatus(this.props.selectedRowKeys, false);
            }}
          >
            取消审核
          </Button>
          <Button
            type="danger"
            disabled={isEmptyArray(this.props.selectedRows)}
            onClick={() => {
              confirmDelete(() => {
                this.remove(this.props.selectedRowKeys);
              });
            }}
          >
            批量删除
          </Button>
        </div>
      </div>
    );
  }
}

export default CommonCheckList;