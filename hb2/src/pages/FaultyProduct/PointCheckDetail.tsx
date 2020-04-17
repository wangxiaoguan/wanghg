import React, { Component } from 'react';
import { Card, Col, Row, Button } from 'antd';
import { getPropsParams } from '@/utils/SystemUtil';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import BackButton from '@/components/BackButton';
import { renderAttatch} from '@/utils/AntdUtil';
const styleImgH4 = {
  display:'inline-block',
  verticalAlign: 'top',
}
const styleH4 = {
  display:'inline',
}
/**
 * 你点我检查看
 */

//联系人信息
const ContactInfo = [
  { key: 'contactsName', value: '', optionName: '姓名' },
  { key: 'contactsTelephone', value: '', optionName: '手机号码' },
  { key: 'contactsEmail', value: '', optionName: '电子邮箱' },
]

//消费品信息
const ConsumerGoodsInfo = [
  { key: 'productName', value: '', optionName: '产品名称' },
  { key: 'problemDescription', value: '', optionName: '产品问题' },
  { key: 'manufacturer', value: '', optionName: '生产厂家' },
  { key: 'productBatch', value: '', optionName: '生产批次' },
  { key: 'factoryAddr', value: '', optionName: '生产地址' },
  { key: 'brand', value: '', optionName: '品牌' },
  { key: 'productModel', value: '', optionName: '产品型号' },
  { key: 'productImg', value: '', optionName: '产品图片' },
]

@connect(({ loading }) => ({ loading }))
class CarDetail extends Component<IDispatchInterface, any> {

  constructor(props) {
    super(props);
    this.state = {
      consumerProductData: {},
    };
  }

  componentDidMount() {
    this.requestData()
  }

  private requestData = () => {
    let id = getPropsParams(this.props).id;
    if (id) {
      this.props.dispatch({
        type: 'pointCheck/search',
        payLoad: id,
        callBack: (res) => {
          console.log('你点我检 =>', res)
          this.setState({ consumerProductData: res.data || {} });
        }
      })
    }
  }

  update = (payLoad) => {
    const { dispatch } = this.props
    const params = `${payLoad.id}/${payLoad.checkStatus}`
    dispatch({
      type: 'consumerProduct/updateBatchCheckStatus',
      payLoad: params,
      callBack: () => {
        window.history.back()
      }
    })
  }

  render() {
    const Item = ({ optionName, value }) => (
      <Col sm={24} lg={12} style={{ margin: '10px 0' }}>
        <h4 style={optionName==='产品图片'?styleImgH4:styleH4}>{optionName}：</h4><span>{optionName==='产品图片'?renderAttatch(value):value}</span>
      </Col>
    )

    const { consumerProductData } = this.state
    return (
      <div>
        <Card title={'联系人信息'}>
          <Row>
            {ContactInfo.map((item) => <Item {...{...item, value: consumerProductData[item.key] }} />)}
          </Row>
        </Card>

        <Card title={'车辆信息'}>
          <Row>
            {ConsumerGoodsInfo.map((item) => <Item {...{...item, value: consumerProductData[item.key] }} />)}
          </Row>
        </Card>
        <div className="divAreaContainer controlsContainer">
          <BackButton />
        </div>
      </div>
    );
  }
}

export default CarDetail;