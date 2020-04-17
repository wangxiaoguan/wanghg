import React, { Component } from 'react';
import DepartInfoTable from '../Components/DepartInfoTable';
import { Card, Button, Modal, Input } from 'antd';
import BackButton from '@/components/BackButton';
import { connect } from 'dva';
import { getPropsParams } from '@/utils/SystemUtil';
const { TextArea } = Input;

@connect(({ loading }) => ({
  // loadingDelete: Boolean(loading.effects['－－－/remove']),
}))
class DepartCheckInfo extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      data: {},
      visable:false,
      checkReason:'',
      modalType:'0',
    }
  }

  componentDidMount() {
    this.requestData()
  }

  private requestData = () => {
    const params = getPropsParams(this.props)
    if (!params.id) { return }
    this.props.dispatch(
      {
        type: 'Department/search',
        payLoad: params.id,
        callBack: (res) => {
          console.log('requestData', res)
          if (!res.data) { return }
          this.setState({
            data: res.data,
          });
        }
      }
    );
  }


  update = (payLoad) => {
    this.props.dispatch(
      {
        type: 'Department/update',
        payLoad,
        callBack: () => {
          window.history.back()
        }
      }
    );
  }


  render() {
    return (
      <Card title="机构审核">
        <DepartInfoTable data={this.state.data} />
        <div className="divAreaContainer controlsContainer">
          <Button type="primary" onClick={() => {
            // this.update({ id: getPropsParams(this.props).id, checkStatus: '1' })
            this.setState({
              visable:true,
              modalType:'1'
            })
          }}>审核通过</Button>
          <Button type="primary" onClick={() => {
            // this.update({ id: getPropsParams(this.props).id, checkStatus: '2' })
            this.setState({
              visable:true,
              modalType:'2'
            })
          }}>审核不通过</Button>
          <BackButton />
        </div>
        <Modal
          title="请输入原因"
          visible={this.state.visable}
          onOk={()=>{
            this.update({ id: getPropsParams(this.props).id, checkStatus: this.state.modalType,comment:this.state.checkReason })//需确定原因字段
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

export default DepartCheckInfo;