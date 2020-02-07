import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { InputNumber,Message } from 'antd';
import { connect } from 'react-redux';
import { postService } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';


let count =0;
// const InputNumWarpper = props => {
//   return <InputNumber min={0} onChange={props.onChange} onClick={props.onClick}/>;
// };
@connect(state => ({
  selectRowsData: state.table.selectRowsData,
}))
export default class QuestionsModal extends Component {
  constructor(props) {
    super(props);
    this.state={
      selectRowsData: this.props.selectRowsData,
      maxsingleSelectCount:'',
      maxmultiSelectCount:'',
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.selectRowsData !== prevState.selectRowsData) {
      return { selectRowsData: nextProps.selectRowsData};
    }
    return  null;
  }
  choose = key => {
    const {selectRowsData} = this.state;
    if(selectRowsData.length === 0){
        Message.error('请选择题库');
        return;
    }
    let EDBList = [];

  console.log("selectRowsDataselectRowsData",selectRowsData);


    selectRowsData.map(item=>{
      EDBList.push({
        'activityId': this.props.activityId,
        'examDbId': item.id,
        'examDbName': item.name,
        'multiSelectCount': item.multiSelectCount||0,
        'showIndex': item.showIndex||0,
        'singleSelectCount': item.singleSelectCount||0,
      });
    });


    let body = { EDBList };
    postService(API_PREFIX +'services/activity/examActivity/insertActivityEDB',body,data=>{
    // postService(API_PREFIX +'services/activity/examActivity/updateActivityEDB',body,data=>{
      console.log('data222222222222=>',data);
      if (data.status===1) {
        Message.success('添加成功');
        this.props.onCancel();
      }
    });
  };

  getInputValue = (val,record, key) => {
    const { selectRowsData} = this.state;
    let value = val.target.value; 
    if(selectRowsData.length === 0){
      Message.error('请选择题库后设置题目个数');
      // console.log(record)
      // console.log(value);
        let arr=[];
         arr.push(record);
        arr.map(item=>{
          if (item.id===record.id) {
            item[key] = value;
          }
        })
      this.setState({ selectRowsData:[...arr]},()=>{
        console.log("this.state.selectRowsData",this.state.selectRowsData)       
            });
      ///// return false;
    }
    if(key==='singleSelectCount'){
      if(value > record.maxSingleSelectCount){
        Message.error('设置题目个数不能超出题库题目个数!');
        return false;
      }
    }
    if(key==='multiSelectCount'){
      if(value > record.maxMultiSelectCount){
        Message.error('设置题目个数不能超出题库题目个数!');
        return false;
      }
    }
    selectRowsData.map(item=>{
      if (item.id===record.id) {
        item[key] = value;
      }
    });
    this.setState({ selectRowsData});
  }



   
  render() {
    // const{maxmultiSelectCount,maxsingleSelectCount} = this.state;
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
        dataIndex: 'singleSelectCount',
        key: 'singleSelectCount',
        render: (text,record) =>
        {return  (<InputNumber defaultValue={record.singleSelectCount} max={record.maxSingleSelectCount} min={0}  onBlur={ (e) =>  this.getInputValue(e, record, 'singleSelectCount')}/>)}  
      },
      {
        title: '多选题个数',
        dataIndex: 'multiSelectCount',
        key: 'multiSelectCount',
        render: (text,record) =>
        { return (<InputNumber defaultValue={record.multiSelectCount} min={0} max={record.maxMultiSelectCount}  onBlur={ (e) => this.getInputValue(e, record, 'multiSelectCount')} onClick={(e)=>this.getrecord(e,record)} />)},
      },
      // {
      //   title: '显示顺序',
      //   dataIndex: 'showIndex',
      //   key: 'showIndex',
      //   render: (text,record) => (
      //     <InputNumber defaultValue={0} min={0} onChange={e => this.getInputValue(e, record.id, 'showIndex')} onClick={e => { e.stopPropagation(); }}/>
      //   ),
      // },
    ];
    const search = [
      { key: 'name', label: '题库名称', type: 'input', qFilter: 'Q=name_S_LK' },
    ];

    return (
      <TableAndSearch
        columns={columns}
        search={search}
        url={'services/activity/examDB/getExamList'}
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