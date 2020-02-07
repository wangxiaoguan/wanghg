import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { InputNumber,Message } from 'antd';
import { connect } from 'react-redux';
import { postService } from '../../../myFetch';
import ServiceApi from '../../../apiprefix';
const InputNumWarpper = props => {
  if(props.style==='singleSize'){
    return <InputNumber max={props.maxsingleSize} defaultValue={0} min={0} onChange={props.onChange} onClick={props.onClick}/>;
  }else{
    return <InputNumber max={props.maxmultipleSize} defaultValue={0} min={0} onChange={props.onChange} onClick={props.onClick}/>;
  }
  
};
@connect(state => ({
  selectRowsData: state.selectRowsData,
}))
export default class QuestionsModal extends Component {
  constructor(props) {
    super(props);
    this.state={
      selectRowsData: this.props.selectRowsData,
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.selectRowsData !== prevState.selectRowsData) {
      return { selectRowsData: nextProps.selectRowsData};
    }
    return  null;
  }

  choose = key => {
    const {  selectRowsData} = this.state;
    console.log('测试获取值',selectRowsData);
    let EDBList = [];
    selectRowsData.map(item=>{
      EDBList.push({
        'activityId': this.props.activityId,
        'examDbId': item.id,
        'examDbName': item.name,
        'multipleSize': item.multipleSize||0,
        'showIndex': item.showIndex||0,
        'singleSize': item.singleSize||0,
      });
    });
    let body = { EDBList };
    console.log(body)
    postService(ServiceApi +'services/activity/examActivity/insertActivityEDB',body,data=>{
      if (data.retCode===1) {
        Message.success('添加成功');
        this.props.onCancel();
      }
    });
  };

  getInputValue = (value,id, key) => {
    const { selectRowsData} = this.state;
    console.log('selectRowsData==>',selectRowsData)
    console.log('获取值', value, id, key);
    if(selectRowsData.length===0){
      Message.success('请先选择题库！');
    }else{
      selectRowsData.map(item=>{
        if (item.id===id) {
          item[key] = value;
        }
      });
  
      console.log('selectRowsData==>',selectRowsData)
      // console.log('props.selectRowsData==>',this.props.selectRowsData)
      // this.props.selectRowsData=selectRowsData
      this.setState({ selectRowsData});
    }
  };

  render() {
    // console.log('selectRowsData', this.props.selectRowsData);
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
        title: '单选题个数',
        dataIndex: 'singleSize',
        key: 'singleSize',
        render: (text,record) => (
          <InputNumWarpper maxsingleSize={record.maxsingleSize} style='singleSize' onChange={e => { this.getInputValue(e, record.id, 'singleSize'); }} onClick={e => { e.stopPropagation();}}/>
        ),
      },
      {
        title: '多选题个数',
        dataIndex: 'multipleSize',
        key: 'multipleSize',
        render: (text,record) => (
          <InputNumWarpper maxmultipleSize={record.maxmultipleSize} style='multipleSize' onChange={e => this.getInputValue(e, record.id, 'multipleSize')} onClick={e => { e.stopPropagation(); }}/>
        ),
      },
      {
        title: '显示顺序',
        dataIndex: 'showIndex',
        key: 'showIndex',
        render: (text,record) => (
          <InputNumWarpper onChange={e => this.getInputValue(e, record.id, 'showIndex')} onClick={e => { e.stopPropagation(); }}/>
        ),
      },
    ];
    const search = [
      { key: 'name', label: '题库名称', type: 'input', qFilter: 'Q=name_S_LK' },
    ];

    return (
      <TableAndSearch
        columns={columns}
        search={search}
        url={'services/activity/examDB/list'}
        urlfilter={'Q=status_I_EQ=1'}
        type={'radio'}
        customBtn={{
          order: 2,
          label: '确定',
          onClick: n => this.choose(n),
          className: 'queryBtn',
        }}
      />
    );
  }
}