import React, { Component } from 'react';
import { Card, Form, Spin,Modal,Input } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import TrainingInformationPlayer from './TrainingInformationPlayer';
import HRangeTime from '@/components/Antd/HRangeTime';
import { createSearchString } from '@/utils/SystemUtil';
import { connect } from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { confirmDelete, createSelectOptions } from '@/utils/AntdUtil';
import HSelect from '@/components/Antd/HSelect';
import LeaveMessageEnum from '@/Enums/LeaveMessageEnum';
const { TextArea } = Input;
const TITLE = '留言管理';
const FormItem = Form.Item;
const classNames = require('./LeaveMessageList.less');
/**
 * 培训信息管理
 */
@connect(({ loading }) => (
  {
    loadingDelete: Boolean(loading.effects['leaveMessage/remove']),
    loading: loading.effects['leaveMessage/reply'],
    loadingGet: Boolean(loading.effects['leaveMessage/search']),
  }
))
class LeaveMessageList extends Component<any, any> {
  private playerModal: TrainingInformationPlayer;
  private table: SearchTableClass;

  private COLUMNS: any[] = [
    {
      title: '群组留言',
      dataIndex: 'message',
    },
    {
      title: '留言时间',
      dataIndex: 'messageDate',
      width:200,
    },
    {
      title: '是否回复',
      dataIndex: 'replyMark',
      width:100,
      render:(_, record)=>{
        return(<span>{record.replyMark==='1'?'是':'否'}</span>)
      }
    },
    {
      title: '操作',
      width: 230,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            {
              record.replyMark==='1'?
              <span>
                <a onClick={()=>this.setState({lookvisible:true,detail:record})} >查看回复</a>　　<a onClick={()=>this.setState({revisevisible:true,detail:record,replyTxt:record.reply})} >回复修改</a>
              </span>:
              <a onClick={()=>this.setState({visible:true,detail:record})} >回复</a>
            }
            <Spin spinning={this.props.loadingDelete}>
              <a onClick={() => {
                confirmDelete(() => this.remove(record.id));
              }}>删除</a>
            </Spin>
          </span>
        );
      }
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      lookvisible:false,
      revisevisible:false,
      detail:{},
      officialTxt:'',
      replyTxt:'',
    };
  }

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'leaveMessage/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
    this.table.refresh();
  }

  InputOfficialTxt=(e)=>{
    this.setState({txt:e.target.value.slice(0,200)})
  }
  setMsg=(id)=>{
    const officialTxt = this.state.officialTxt;
    this.props.dispatch(
      {
        type: 'leaveMessage/reply',
        payLoad:{
          id,
          reply:officialTxt,
          replyDate:moment(new Date(),'YYYY-MM-DD HH:mm:ss')
        },
        callBack: () => {
          this.setState({visible:false,officialTxt:''})
          this.table.refresh();
        }
      }
    );
  }
  reviseMsg=(id)=>{
    const replyTxt = this.state.replyTxt;
    this.props.dispatch(
      {
        type: 'leaveMessage/reply',
        payLoad:{
          id,
          reply:replyTxt,
          replyDate:moment(new Date(),'YYYY-MM-DD HH:mm:ss')
        },
        callBack: () => {
          this.setState({revisevisible:false,replyTxt:''})
          this.table.refresh();
        }
      }
    );

  }
  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/indexManage/officialWebBoard/getList/${current}/${pageSize}${createSearchString(values)}`
  }

  transData = (response: any) => {
    return {
      data: response.data.data,
      total: response.data.length,
    };
  }

  render() {
    const {detail} = this.state;
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          transData={this.transData}
        />
          <Modal
            title="回复留言"
            visible={this.state.visible}
            onCancel={()=>this.setState({visible:false})}
            afterClose={()=>this.setState({visible:false})}
            width={640}
            okText='提交'
            cancelText='取消'
            onOk={()=>this.setMsg(detail.id)}
          >
            <div className={classNames.antTable}>
              <table>
                <tbody>
                  <tr>
                    <td>群众留言:</td>
                    <td><div style={{width:500}}>{detail.message}<br/><span className={classNames.messageDate}>{detail.messageDate}</span></div></td>
                  </tr>
                  <tr>
                    <td>官方回复:</td>
                    <td>
                      <TextArea className={classNames.textArea} value={this.state.officialTxt} placeholder='字数限制在200字' onChange={event=>this.setState({officialTxt:event.target.value.slice(0,200)})} rows={4}/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Modal>
          <Modal
            title="回复修改"
            visible={this.state.revisevisible}
            onCancel={()=>this.setState({revisevisible:false})}
            afterClose={()=>this.setState({revisevisible:false})}
            width={640}
            okText='修改'
            cancelText='取消'
            onOk={()=>this.reviseMsg(detail.id)}
          >
            <div className={classNames.antTable}>
              <table>
                <tbody>
                  <tr>
                    <td>群众留言:</td>
                    <td><div>{detail.message}<br/><span className={classNames.messageDate}>{detail.messageDate}</span></div></td>
                  </tr>
                  <tr>
                    <td>回复修改:</td>
                    <td>
                      <TextArea className={classNames.textArea} value={this.state.replyTxt} placeholder='字数限制在200字' onChange={event=>this.setState({replyTxt:event.target.value.slice(0,200)})} rows={4}/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Modal>
          <Modal
            title="查看留言"
            visible={this.state.lookvisible}
            footer={null}
            onCancel={()=>this.setState({lookvisible:false})}
            afterClose={()=>this.setState({lookvisible:false})}
            width={640}
          >
            <div className={classNames.antTable}>
              <table>
                <tbody>
                  <tr>
                    <td>群众留言:</td>
                    <td><div>{detail.message}<br/><span className={classNames.messageDate}>{detail.messageDate}</span></div></td>
                  </tr>
                  <tr>
                    <td>官方回复:</td>
                    <td><div>{detail.reply}<br/><span className={classNames.messageDate}>{detail.replyDate}</span></div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Modal>
          
      </Card>
    );
  }
}

class SearchForm extends Component<any>  {
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '留言时间',
        content: getFieldDecorator('messageDate')(<HRangeTime />),
      },
      {
        label: '是否回复',
        content: getFieldDecorator('replyMark')(<HSelect>
          {
            createSelectOptions(LeaveMessageEnum.ALL_LIST, LeaveMessageEnum.toString)
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
                <FormItem key={item.label} label={item.label}>{item.content}</FormItem>
              );
            })
          }
          <FormItem>
            <FormRefreshButton />
            <FormResetButton />
          </FormItem>
        </div>
      </div>
    );
  }
}

export default LeaveMessageList;