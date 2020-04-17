import React, { Component } from 'react';
import { Card, Form, Button, Tabs,Modal } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HSelect from '@/components/Antd/HSelect';
import { isEmptyArray, createSearchString} from '@/utils/SystemUtil';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';
import DeleteLink from '@/components/DeleteLink';
import { connect } from 'dva';
import { confirmDelete, createSelectOptions, htmlToText,renderAttatch } from '@/utils/AntdUtil';
import CheckCommentEnum from '@/Enums/CheckCommentEnum';
const classNames = require('./DiscussionCheckList.less')
const TITLE = '评议活动审核';
const FormItem = Form.Item;

/**
 * 评议审核
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['NoticeDiscussionCheck/remove'])||Boolean(loading.effects['DiscussionCheck/remove']),loading
}))
class NoticeDiscussionCheck extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      detail:{},
    };
  }
  componentWillMount(){
    this.props.loading.tabsCommentType ='1';
  }
  private COLUMNS: any[] = [
    {
      title: '通报号',
      dataIndex: 'bulletinCode',
    },
    {
      title: '评议时间',
      dataIndex: 'createDate',
    },
    {
      title: '评议内容',
      dataIndex: 'commentContent',
      render: (text, record) => {
        return htmlToText(record.commentContent);
      }
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
  private SPECIALCOLUMNS: any[] = [
    {
      title: '通报号',
      dataIndex: 'relatedBulletin',
    },
    {
      title: '评议人',
      dataIndex: 'expectName',
    },
    {
      title: '评议时间',
      dataIndex: 'appriseDate',
    },
    {
      title: '评议内容',
      dataIndex: 'attach',
      render: (text, record) => {
        return renderAttatch(record.attach);
      }
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
    switch(this.props.loading.tabsCommentType){
      case '1':
        this.props.dispatch(
          {
            type: 'NoticeDiscussionCheck/remove',
            payLoad: Array.of(id),
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
      break
      case '2':
        this.props.dispatch(
          {
            type: 'DiscussionCheck/remove',
            payLoad: Array.of(id),
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
      break
    }
    
  }
  searchNormalCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/wtoofficialcomment/getOrdinaryCommentList/${current}/${pageSize}${createSearchString(values)}`;
  }
  searchProCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/wtoofficialcomment/getBulletinListCommentByOfficial/${current}/${pageSize}${createSearchString(values)}`;
  }
  tabsChange=(e)=>{
    this.props.loading.tabsCommentType =e;
  }
  render() {
    const {detail} = this.state;
    return (
      <Card title={TITLE}>
        <Tabs onChange={this.tabsChange}>
          <Tabs.TabPane key='1' tab="普通评议">
            <SearchTable
              getInstance={(target) => this.normalTable = target}
              columns={this.COLUMNS}
              formItems={SearchForm}
              searchCreater={this.searchNormalCreater}
              selectedAble
            />
          </Tabs.TabPane>
          <Tabs.TabPane key='2' tab="专家评议">
            <SearchTable
              getInstance={(target) => this.proTable = target}
              columns={this.SPECIALCOLUMNS}
              formItems={SearchForm}
              searchCreater={this.searchProCreater}
              selectedAble
            />
          </Tabs.TabPane>
        </Tabs>
        <Modal
            title="查看详情"
            visible={this.state.visible}
            footer={null}
            onCancel={()=>this.setState({visible:false})}
            afterClose={()=>this.setState({visible:false})}
            width={640}
          >
            <div className={classNames.CommentTable}>
              <table>
                <tbody>
                  <tr>
                    <td >通报号</td>
                    <td>{detail.bulletinCode?detail.bulletinCode:detail.relatedBulletin}</td>
                  </tr>
                  {
                    detail.expectName&&
                    <tr>
                      <td >评议人</td>
                      <td>{detail.expectName}</td>
                    </tr>
                  }
                  
                  <tr>
                    <td >评议内容</td>
                    <td>{detail.commentContent?detail.commentContent:renderAttatch(detail.attach)}</td>
                  </tr>
                  <tr>
                    <td >审核状态</td>
                    <td>{detail.checkStatus==='0'?'未审核':detail.checkStatus==='1'?'审核成功':'审核失败'}</td>
                  </tr>
                  <tr>
                    <td >评议时间</td>
                    <td><span style={{fontSize:10,color:'#aaa'}}>{detail.createDate?detail.createDate:detail.appriseDate}</span></td>
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
  loadingDelete: Boolean(loading.effects['NoticeDiscussionCheck/remove'])||Boolean(loading.effects['NoticeDiscussionCheck/remove']),
  loadingCheckStatus: Boolean(loading.effects['NoticeDiscussionCheck/updateCheckStatus'])||Boolean(loading.effects['DiscussionCheck/updateCheckStatus']),
  loading
}))
class SearchForm extends Component<any>  {
  updateCheckStatus(idList: string[], isCheck: boolean) {
    let params = {};
    params.idList = idList;
    params.isCheck = isCheck;
    switch(this.props.loading.tabsCommentType){
      case '1':
        this.props.dispatch(
          {
            type: 'NoticeDiscussionCheck/updateCheckStatus',
            payLoad: params,
            callBack: () => {
              this.props.refresh();
            }
          }
        );
      break;
      case '2':
        this.props.dispatch(
          {
            type: 'DiscussionCheck/updateCheckStatus',
            payLoad: params,
            callBack: () => {
              this.props.refresh();
            }
          }
        );
      break;
    }
  }

  remove = (id) => {
    switch(this.props.loading.tabsCommentType){
      case '1':
        this.props.dispatch(
          {
            type: 'NoticeDiscussionCheck/remove',
            payLoad: id,
            callBack: () => {
              this.props.refresh();
            }
          }
        );
      break
      case '2':
        this.props.dispatch(
          {
            type: 'DiscussionCheck/remove',
            payLoad: id,
            callBack: () => {
              this.props.refresh();
            }
          }
        );
      break
    }
    
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS =this.props.loading.tabsCommentType==='1'?
    [
      {
        label: '通报号',
        content: getFieldDecorator('bulletinCode')(<HInput />),
      },
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
    ]:
    [
      {
        label: '通报号',
        content: getFieldDecorator('relatedBulletin')(<HInput />),
      },
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
        content: getFieldDecorator('appriaseDate')(<HRangePicker />),
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

export default NoticeDiscussionCheck;