import React, { Component } from 'react';
import { Card, Form, Button, List, Col, Modal, Radio, message } from 'antd';
import HInput from '@/components/Antd/HInput';
import HSelect from '@/components/Antd/HSelect';
import { createTdItem, confirmDelete, createSelectOptions } from '@/utils/AntdUtil';
import { connect } from 'dva';
import { createSearchString } from '@/utils/SystemUtil';
import InstitutionalStatusEnum from '@/Enums/InstitutionalStatusEnum';
import DepartStatusEnum from '@/Enums/DepartStatusEnum';
import ExamingStatusEnum from '@/Enums/ExamingStatusEnum';
import BlackEnum from '@/Enums/BlackEnum';
import CertificateEnum from '@/Enums/CertificateEnum';
import RegonEnum from '@/Enums/RegonEnum';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';

const EDIT_HASH = '#/DepartmentInfoList/DepartmentInfoEdit';
const UPDATE_HASH = '#/DepartmentInfoList/DepartmentInfoUpdate';

const FormItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
};
const FormItem = Form.Item;

@connect(({ loading }) => ({
  // loadingDelete: Boolean(loading.effects['－－－/remove']),
}))
class DepartmentInfoList extends Component<IDispatchInterface, any>{

  constructor(props) {
    super(props)
    this.state = {
      // 当前页码，从1开始
      current: 1,
      pageSize: 5,
      // 是否网络请求中
      dataSource: [],
      // 数据总条数
      total: 0,
      values: {},
      modalVisible: false,
      selectedItemId: null
    }
  }

  componentDidMount() {
    this.requestData()
  }

  createSearch = (values) => {
    let str = [];
    // tslint:disable-next-line: forin
    for(const item in values){
      const word = values[item];

      if(word !== undefined && word !== '' ){
        if(item === 'cid'){
          if(word === CertificateEnum.HAS){
            str.push(`Q=cid_NN`)
          }else{
            str.push(`Q=cid_NL`)
          }
        }else{
          str.push(`Q=${item}_LK=${word}`)
        }
      }
    }
    console.log('str', str);
    if (str.length) {
      console.log('str', str);
      return `?${str.join('&&')}`;
    }
    return '';
  }

  private requestData = () => {
    const { current, pageSize, values } = this.state;

    const params = `/${current}/${pageSize}/${this.createSearch(values)}`
    this.props.dispatch(
      {
        type: 'Department/formSearch',
        payLoad: params,
        callBack: (res) => {
          console.log('requestData', res)
          this.setState({
            dataSource: res.data.data,
            total: res.data.length,
          });
        }
      }
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('values', values)
      if (err) { return }
      this.setState({
        values
      }, this.requestData)
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.setState({
      values: {}
    }, this.requestData)
  }


  update = (payLoad) => {
    this.props.dispatch(
      {
        type: 'Department/update',
        payLoad,
        callBack: () => {
          this.requestData()
        }
      }
    );
  }

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'Department/remove',
        payLoad: id,
        callBack: () => {
          this.requestData();
        }
      }
    );
  }

  revoke = (id) => {
    this.props.dispatch(
      {
        type: 'Department/revoke',
        payLoad: id,
        callBack: () => {
          this.requestData();
        }
      }
    );
  }

  protected level: string = ''

  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '检测机构名称',
        content: getFieldDecorator('orgName')(<HInput />),
      },
      {
        label: '机构检测状态',
        content: getFieldDecorator('status')(<HSelect>
          {
            createSelectOptions(InstitutionalStatusEnum.ALL_LIST, InstitutionalStatusEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '有无证书',
        content: getFieldDecorator('cid')(<HSelect>
          {
            createSelectOptions(CertificateEnum.ALL_LIST, CertificateEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '所属行政区划',
        content: getFieldDecorator('orgDivide')(<HSelect>
          {
            createSelectOptions(RegonEnum.ALL_LIST, RegonEnum.toString)
          }
        </HSelect>),
      },
    ];
    const { modalVisible, selectedItemId } = this.state
    const showModal = (id) => {
      this.setState({ selectedItemId: id }, () => { this.setState({ modalVisible: true }) })
    }
    const onCancel = () => {
      this.setState({ modalVisible: false })
      this.level = ''
    }
    const levelChange = (e) => {
      this.level = e.target.value
    }
    const onOk = () => {
      if (this.level === '') {
        message.warning('请选择一个级别')
        return
      }
      
      this.props.dispatch({
        type: 'Department/update',
        payLoad: { rank: this.level, id: selectedItemId },
        callBack: () => {
          this.setState({
            modalVisible: false
          })
          this.requestData()
        }
      })
    }

    return (
      <Card title="机构基本信息">
        <div className="divAreaContainer">
          <Form layout="inline">
            {
              FORM_ITEMS.map((item) => {
                return (
                  <Col key={item.label} span={8}>
                    <FormItem  {...FormItemLayout} label={item.label}>{item.content}</FormItem>
                  </Col>
                );
              })
            }
            <FormItem>
              <Button type="primary" onClick={this.handleSubmit}>查询</Button>
              <Button onClick={this.handleReset}>重置</Button>
            </FormItem>
          </Form>
        </div>

        <List rowKey="id" dataSource={this.state.dataSource} pagination={
          Object.assign(
            {
              pageSize: this.state.pageSize,
              current: this.state.current,
              total: this.state.total,
              showQuickJumper: true,
              showTotal: (total, range) => {
                return `共${this.state.total}条记录`;
              },
              onChange: (page) => {
                this.setState({ current: page }, this.requestData);
              },
            },
          )
        } renderItem={(item) => {
          return (
            <div>
              <table className="InfoTable">
                <thead>
                  <tr>
                    <th colSpan={5}>{`检测机构名称: ${item.orgName || ''}`}</th>
                    <th><a href={`${EDIT_HASH}/${item.id}`}>详情</a></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {
                      [
                        createTdItem('行政区划', `${item.orgDivide || ''}`),
                        createTdItem('负责人', `${item.principal || ''}`),
                        createTdItem('联络人', `${item.contact || ''}`),
                      ]
                    }
                  </tr>
                  <tr>
                    {
                      [
                        createTdItem('所属行业', `${item.industry || ''}`),
                        createTdItem('固定资产（万元', `${item.fixedAssets || ''}`),
                        createTdItem('最后更新时间', `${item.endTime || ''}`),
                      ]
                    }
                  </tr>
                  <tr>
                    {
                      [

                        createTdItem('检测机构状态', `${DepartStatusEnum.toString(item.status)}`),
                        createTdItem('审核状态', `${ExamingStatusEnum.toString(item.status)}`),
                        createTdItem('是否黑名单', `${BlackEnum.toString(item.isBlack)}`),
                      ]
                    }
                  </tr>
                  <tr>
                    {
                      [
                        createTdItem('评级', `${item.rank || ''}`),
                        createTdItem('', ''),
                        createTdItem('', ''),
                      ]
                    }
                  </tr>
                </tbody>
              </table>
              <div className="divMeanContainer">
                <div style={{ overflow: 'hidden' }} className='divAreaContainer controlsContainer'>
                  <Button
                    onClick={() => {
                      window.location.hash = `/DepartmentCheck/DepartDatumList/${item.orgName}`
                    }}>资料信息</Button>
                  <Button
                    onClick={() => {
                      window.location.hash = `/DepartmentCheck/AuhorizedSignatureList/${item.orgName}`
                    }}>授权人签字</Button>
                  <Button
                    onClick={() => {
                      window.location.hash = `/DepartmentCheck/DepartCheckCertificateList/${item.orgName}`
                    }}>资质证书信息</Button>
                  <Button
                    onClick={() => {
                      window.location.hash = `/DepartmentCheck/DepartCheckInstrumentList/${item.orgName}`
                    }}>设备仪器信息</Button>
                  <Button
                    onClick={() => {
                      window.location.hash = `/DepartmentCheck/DepartCheckUserList/${item.orgName}`
                    }}>人员信息</Button>
                  <Button
                    onClick={() => {
                      window.location.hash = `/DepartmentInfoList/HistoricalInfo`
                    }}>历史信息</Button>
                </div>
                <span className='controlsContainer'>
                  <a onClick={() => { showModal(item.id) }}>评级</a>
                  {item.isBlack === '0' ? <a onClick={() => {
                    this.update({ id: item.id, isBlack: '1' })
                  }}>加入黑名单</a> : null}
                  <a href={`${UPDATE_HASH}/${item.id}`}>编辑</a>
                  <a onClick={() => {
                    item.status === '2' ?
                      this.revoke(item.id) :
                      confirmDelete(() => {
                        this.remove(item.id);
                      })
                  }}>{item.status === '2' ? '恢复' : '注销'}</a>
                  <a href={`${EDIT_HASH}/${item.id}`}>详情</a>
                </span>
              </div>
            </div>
          );
        }} />

        <Modal
          visible={modalVisible}
          onCancel={onCancel}
          maskClosable
          title="评级选择"
          onOk={onOk}
          destroyOnClose
        >
          <Radio.Group onChange={levelChange}>
            <Radio value={'A'}>A级</Radio>
            <Radio value={'B'}>B级</Radio>
            <Radio value={'C'}>C级</Radio>
          </Radio.Group>
        </Modal>
      </Card>
    );
  }
}

const Wrapper = Form.create({ name: 'DepartCheckInfoList' })(DepartmentInfoList);

export default Wrapper;