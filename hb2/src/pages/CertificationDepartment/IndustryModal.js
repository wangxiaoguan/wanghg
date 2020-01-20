import React, { Component } from 'react';

import { Modal, List, Input, Button } from 'antd'
import { connect } from 'dva';
import styles from './IndustryModal.less'
/**
 * 
 */
@connect(({ loading }) => ({ loading }))
class IndustryModal extends Component {

  state = {
    list: [],
    industryString: ''
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'Department/getAllIndustry',
      payLoad: null,
      callBack: (res) => {
        console.log(res)
        this.setState({list: res.data})
      }
    })
  }

  industrySelected = (industry) => {
    const {industryString} = this.state
    if (industryString) {
      this.setState({industryString: industryString + '、' + industry})
    } else {
      this.setState({industryString: industry})
    }
  }

  inputChange = (e) => {
    console.log(e.target.value)
    this.setState({industryString: e.target.value})
  }

  render() {
    const { visible, close, industryInput } = this.props
    const { list, industryString } = this.state
    return (
      <Modal
        className={styles.myModal}
        visible={visible}
        title="选择行业"
        maskClosable
        onCancel={() => { close() }}
        footer={null}
      >
        <Input style={{width: '84%'}} onChange={this.inputChange} value={industryString} />
        <Button type="primary" style={{float:'right'}} onClick={() => industryInput(industryString)}>确定</Button>
        <List
          dataSource={list}
          renderItem={(item) => {
            return (
              <List.Item actions={[<a onClick={() => {this.industrySelected(item)}}>选择</a>]}>
                <List.Item.Meta title={item} />
              </List.Item>
            )
          }}
        />
      </Modal>
    );
  }
}

export default IndustryModal;