import React, { Component } from 'react';
import { Popconfirm, Modal, Input, Button, Message, Divider,Spin} from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { postService } from '../../../myFetch';
import ServiceApi from '../../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN } from '../../../../../redux-root/action';
@connect(
  state => ({
    pageData: state.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class Bank extends Component {
  constructor(props) {
    super(props);
    this.state = { modal_visible: false, newExamDB: '', loading:false };
  }
  refresh = () => {
    this.props.getData(
      ServiceApi +
        `services/activity/examDB/list/${this.props.pageData.currentPage}/${
          this.props.pageData.pageSize
        }?${this.props.pageData.query}`
    );
  };
  updateStatus = (id, status) => {
    console.log('获取id', id);
    let body = {
      id,
      status,
    };
    postService(ServiceApi + 'services/activity/examDB/update', body, data => {
      if (data.retCode === 1) {
        Message.success(status === 1 ? '启用成功!' : '停用成功!');
        this.refresh();
      } else {
        Message.error(data.retMsg);
      }
    });
  };
  exam = () => {
    this.setState({loading:true});
    const { modal_visible, newExamDB } = this.state;
    let url = modal_visible === 'add' ? 'insert' : 'update';
    let body =
      modal_visible !== 'add'
        ? { name: newExamDB, id: modal_visible }
        : { name: newExamDB };

    postService(ServiceApi + `services/activity/examDB/${url}`, body, data => {
      if (data.retCode === 1) {
        Message.success(modal_visible === 'add' ? '新建成功!' : '更新成功!');
        this.setState({ modal_visible: null,loading:false });
        this.refresh();
      } else {
        Message.error(data.retMsg);
        this.setState({ modal_visible: null });
      }
    });
  };
  render() {
    let powers = this.props.powers;
    let createPowers = powers && powers['20002.22003.001'];
    let updatePowers = powers && powers['20002.22003.002'];
    let readPowers = powers && powers['20002.22003.003'];
    let deletePowers = powers && powers['20002.22003.002'];
    let offLinePowers = powers && powers['20002.22003.002'];
    let onLinePowers = powers && powers['20002.22003.002'];
    let exportPowers = powers && powers['20002.22003.202']; 
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '题库名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '题目数量',
        dataIndex: 'selectCount',
        key: 'selectCount',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          return record.status === 1 ? '已启用' : '已停用';
        },
      },
      {
        title: '操作',
        key: 'x',
        render: (text, record, index) => {
          console.log("record00==>",record)
          return (
            <div>
              <a className="operation" onClick={() => this.setState({ modal_visible: record.id,newExamDB:record.name })}
                style={{ display: updatePowers ? 'inline-block' : 'none' }}>
                编辑
              </a><Divider type="vertical" />
              {record.status === 1 ? (
                <Popconfirm
                  title="确定停用该题库吗？"
                  onConfirm={this.updateStatus.bind(null, record.id, 0)}
                  okText="确定"
                  cancelText="取消"
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <a className="operation" 
                    style={{ display: offLinePowers ? 'inline-block' : 'none' }}>停用</a>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title="确定启用该题库吗？"
                  onConfirm={this.updateStatus.bind(null, record.id, 1)}
                  okText="确定"
                  cancelText="取消"
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <a
                    style={{ display: onLinePowers ? 'inline-block' : 'none' }}>启用</a>
                </Popconfirm>
              )}
              <Divider type="vertical" />
              <a
                className="operation" 
                href={`#/EventManagement/Examination/QuestionsManagement?id=${
                  record.id
                }`}
              >
                题目管理
              </a>
            </div>
          );
        },
      },
    ];
    const search = [
      {
        key: 'name',
        label: '题库名称',
        qFilter: 'Q=name_S_LK',
        type: 'input',
      },
      {
        key: 'status',
        label: '状态',
        qFilter: 'Q=status_I_EQ',
        type: 'select',
        option: [
          { key: '', value: '全部' },
          { key: '1', value: '已启用' },
          { key: '0', value: '已停用' },
        ],
      },
    ];
    return (
      <div>
        <Spin spinning={this.state.loading}>
          <TableAndSearch
            columns={columns}
            url={'services/activity/examDB/list'}
            search={search}
            addBtn={createPowers?{
              order: 2,
              OnEvent: () => {
                this.setState({ modal_visible: 'add' });
              },
            }:null}
            deleteBtn={deletePowers ? { order: 5, url:'services/activity/examDB/deleteTopic' }:null}
          />
          <Modal
            className="modal"
            title="新建题库"
            maskClosable={false}
            footer={null}
            visible={this.state.modal_visible ? true : false}
            onCancel={() => this.setState({ modal_visible: null })}
            key={'examDbModal'}
            destroyOnClose={true}
          >
            <span>题库名称:</span>
            <Input onChange={e => this.setState({ newExamDB: e.target.value })} value={this.state.newExamDB} />
            <Button className="resetBtn" style={{marginLeft:"166px",marginTop:"10px"}} onClick={() => this.setState({ modal_visible: null })}>
              取消
            </Button>
            <Button className="queryBtn" onClick={this.exam} loading={this.state.loading}>确定</Button>
          </Modal>
        </Spin> 
      </div>
    );
  }
}

