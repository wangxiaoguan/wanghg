import React, { Component } from 'react';
import { Card, Col, Row, Button,Input } from 'antd';
import { getPropsParams } from '@/utils/SystemUtil';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import { createSearchString } from '@/utils/SystemUtil';
import BackButton from '@/components/BackButton';
import SEX_ENUM from '@/Enums/SexEnum'
import { DOWNLOAD_API, UPLOAD_API } from '@/services/api';
import { renderAttatch } from '@/utils/AntdUtil';
const {TextArea} = Input
/**
 * 消费品查看
 */

//联系人信息
const ContactInfo = [
  { key: 'cname', value: '', optionName: '姓名' },
  { key: 'telephone', value: '', optionName: '联系方式' },
  { key: 'email', value: '', optionName: '邮件email' },
  { key: 'postNum', value: '', optionName: '邮政编码' },
  { key: 'addr', value: '', optionName: '地址' }
]
//使用者信息
const UserInfo = [
  { key: 'userName', value: '', optionName: '姓名' },
  { key: 'userSex', value: '', optionName: '性别' },
  { key: 'userAge', value: '', optionName: '年龄' },
]
//产品信息
const ProductInfo = [
  { key: 'pname', value: '', optionName: '产品名称' },
  { key: 'pmodel', value: '', optionName: '型号' },
  { key: 'factoryAddr', value: '', optionName: '生产地' },
  { key: 'productBrand', value: '', optionName: '产品商标' },
  { key: 'buyTime', value: '', optionName: '购买日期' },
  { key: 'unite', value: '', optionName: '类别' },
  { key: 'produceEnterprise', value: '', optionName: '生产企业' },
  { key: 'buyShop', value: '', optionName: '购买商店' },
  { key: 'buyAddr', value: '', optionName: '购买地址' },
  { key: 'problemDescription', value: '', optionName: '问题描述' },
  { key: 'img', value: '', optionName: '图片' },
]

@connect(({ loading }) => ({ loading }))
class ConsumerDetail extends Component<IDispatchInterface, any> {

  constructor(props) {
    super(props);
    this.state = {
      consumerProductData: {},
      handleTxt:''
    };
  }

  componentDidMount() {
    this.requestData()
  }

  private requestData = () => {
    let id = getPropsParams(this.props).id;
    if (id) {
      this.props.dispatch({
        type: 'consumerProduct/search',
        payLoad: id,
        callBack: (res) => {
          console.log('消费品详情 =>', res)
          this.setState({ consumerProductData: res.data || {} });
        }
      })
    }
  }

  update = (payLoad) => {
    const { dispatch } = this.props
    // const params = `${payLoad.id}/${payLoad.checkStatus}`
    dispatch({
      type: 'consumerProduct/update',
      payLoad,
      callBack: () => {
        window.history.back()
      }
    })
  }

  render() {
    const Item = ({ optionName, value, key}) => (
      <Col sm={24} lg={12} style={{ margin: '10px 0' }}>
        <h4 style={{ display: 'inline' }}>{optionName}</h4>&nbsp;:&nbsp;&nbsp;
        {optionName !== '图片' ? <span>{value}</span> :renderAttatch(value)}
      </Col>
    )

    const show = (item) => {
      let value = consumerProductData[item.key]
      const key = item.key
      if (item.key === 'userSex') {
        value = SEX_ENUM.toString(consumerProductData[item.key])
      }
      return { ...item, value, key }
    }

    const { consumerProductData } = this.state
    return (
      <div>
        <Card title={'联系人信息'}>
          <Row>
            {ContactInfo.map((item) => <Item {...show(item)} />)}
          </Row>
        </Card>
        <Card title={'使用者信息'}>
          <Row>
            {UserInfo.map((item) => <Item {...show(item)} />)}
          </Row>
        </Card>
        <Card title={'产品信息'}>
          <Row>
            {ProductInfo.map((item) => <Item {...show(item)} />)}
          </Row>
        </Card>
        <div className='textAreaContainer'>
          <span>处理说明：</span>
          <TextArea onChange={(event)=>this.setState({handleTxt:event.target.value})} rows={4}/>
        </div>
        <div className="divAreaContainer controlsContainer">
          <Button type="primary" onClick={() => {
            this.update({ id: getPropsParams(this.props).id, examineStatus: '1',result:this.state.handleTxt })
          }}>审核通过</Button>
          <Button type="primary" onClick={() => {
            this.update({ id: getPropsParams(this.props).id, examineStatus: '2',result:this.state.handleTxt })
          }}>审核不通过</Button>
          <BackButton />
        </div>
      </div>
    );
  }
}

export default ConsumerDetail;