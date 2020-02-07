import React, {Component} from 'react';
import {message,Popover,Modal,Spin,} from 'antd';
import {postService, getService, putService} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
import TableAndSearch from '../../../component/table/TableAndSearch';
import SuggestDetail from './SuggestDetail';

const suggestUpdateUrl = API_PREFIX+`services/unionmanager/suggest/updateSuggest`

import {setSelectTreeData, setCheckTreeData,} from '../../../../redux-root/action/tree/tree';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData: state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    setSelectData: n => dispatch(setSelectTreeData(n)),
    setCheckData: n => dispatch(setCheckTreeData(n)),
  })
)
class Suggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modalVisible: false, // 详情 modal
      detailData: {},
      dataSource: {},
      listIndex: 0,
      isReply: false, // 主席建议类型 是否回复
    }
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  // 详情
  _suggestDetail(record, index) {
    this.setState({ loading: true })
    getService(API_PREFIX+`services/unionmanager/suggest/getSuggestById/${record.id}`,data=>{
      //返回数据处理
      if(data.retCode === 1 && data.root) {
        this.setState({
          detailData: data.root.object,
          loading: false,
          listIndex: index,
          modalVisible: true
        });
      } else {
        message.error('详情获取失败，请稍后再试');
        this.setState({ loading: false })
      }
    });
  }

  // 回复
  _detailOk=(params)=>{
    this.setState({
      isReply: false,
      modalVisible:false
    })
    putService(suggestUpdateUrl, params, data=>{
      if(data.retCode === 1) {
        message.success('回复成功');
        let replyName=window.sessionStorage.getItem('lastname');
        const newData = this.props.dataSource
        newData.root.list[this.state.listIndex].replyContent = params.replyContent
        newData.root.list[this.state.listIndex].replyName = replyName
        this.setState({ dataSource: newData })
      } else {
        message.error('回复失败，请稍后再试');
      }
    });
  }

  // 详情关闭、取消回复
  _detailCancel=()=>{
    this.setState({
      isReply: false,
      modalVisible:false
    })
  }

  // 主席建议类型 打开/关闭回复
  _detailReply=()=>{
    this.setState({ isReply: !this.state.isReply })
  }

  // 转发主席
  _detailTransfer=(id)=>{
    putService(suggestUpdateUrl, { id, suggestStatus: 3 }, data=>{
      if(data.retCode === 1) {
        message.success('转发成功');
        this.ts.getData(`${this.ts.props.url}/1/10?${this.ts.state.query}`);
      } else {
        message.error('转发失败，请稍后再试');
      }
      this.setState({ modalVisible:false })
    });
  }

  render() {
    let powers = this.props.powers;

    let hasUpdatePower = powers && powers['20030.20031.002'];
    let hasSearchPower = powers && powers['20030.20031.003'];
    let hasDelPower = powers && powers['20030.20031.004'];
    let hasExportPower = powers && powers['20030.20031.202'];

    const search = [
      {
        key: 'suggestStatus',
        label: '建言类型',
        qFilter: 'Q=suggestStatus_S_EQ',
        type: 'select',
        option: [
          {key: '', value: '全部'},
          {key: '1', value: '普通建议'},
          {key: '2', value: '主席建议'},
          {key: '3', value: '主席亲阅'}
        ]
      },
      {
        key: 'name',
        label: '用户名',
        qFilter: 'Q=name_S_LK',
        type: 'input'
      },
      {
        key: 'createDate',
        label: '选择日期',
        type: 'rangePicker'
      },
    ];
    const operate = {
      exportUrl: {
        url: 'services/unionmanager/suggest/exportSuggest',
        type: 'suggestions',
      },
      delUrl: {
        url: 'services/unionmanager/suggest/deleteFlag/',
        type: 'suggestion',
      }
    };
    const allRecord = (record, width) =>
      <div style={{ width }}>
        <span >{record}</span>
      </div>

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        fixed: 'left'
      },
      {
        title: '手机号',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        width: 100,
      },
      {
        title: '建言类型',
        dataIndex: 'suggestStatusDesp',
        key: 'suggestStatusDesp',
        width: 80,
      },
      {
        title: '建言内容',
        dataIndex: 'suggestContent',
        key: 'suggestContent',
        render: record =>
          record && record.length > 35 ?
            <Popover title={null} content={allRecord(record, 500)}>
              <span >{`${record.substring(0, 35)}...`}</span>
            </Popover> : <span >{record}</span>
      },
      {
        title: '回复人',
        dataIndex: 'replyName',
        key: 'replyName',
        width: 100,
      },
      {
        title: '回复内容',
        dataIndex: 'replyContent',
        key: 'replyContent',
        width: 360,
        render: record =>
          record && record.length > 25 ?
            <Popover title={null} content={allRecord(record, 300)}>
              <span >{`${record.substring(0, 25)}...`}</span>
            </Popover> : <span >{record}</span>
      },
      {
        title: '创建时间',
        dataIndex: 'createDateString',
        key: 'createDateString',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 100,
        fixed: 'right',
        render: (data, record, index) => (
          <div>
            <span>
              <a
                className='operation'
                disabled={!hasSearchPower}
                onClick={() => this._suggestDetail(record, index)}>详情</a>
            </span>
          </div>
        )
      }
    ];

    return (
      <Spin spinning={this.state.loading}>
        <div>
          <TableAndSearch
            tsRef={(e) => {this.ts = e}}
            dataSource={this.state.dataSource}
            url={'services/unionmanager/suggest/getSuggestListPage'}
            columns={columns}
            search={search}
            exportBtn={hasExportPower ? {
              url: operate.exportUrl.url,
              type: operate.exportUrl.type
            } : null}
            deleteBtn={hasDelPower ? {
              url: operate.delUrl.url,
              type: operate.delUrl.type
            } : null}
            scroll={{width: 1600}}>
          </TableAndSearch>
          <Modal
            width={630}
            title={'建言详情'}
            cancelText={'取消'}
            okText={'回复'}
            footer={null}
            visible={this.state.modalVisible}
            destroyOnClose={true}
            onCancel={this._detailCancel}
          >
            <SuggestDetail
              onOk={this._detailOk}
              onCancel={this._detailCancel}
              detailData={this.state.detailData}
              isReply={this.state.isReply}
              onReply={this._detailReply}
              onTransfer={this._detailTransfer}
              replyPower={hasUpdatePower}
            />
          </Modal>
        </div>
      </Spin>
    );
  }
}

export default Suggestions;