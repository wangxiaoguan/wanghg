import React, { Component } from 'react';
import { Card, Form, Row, Col, Input, Upload, Button,Radio } from 'antd';
import RadioGroup from 'antd/lib/radio/group';
import FormItem from 'antd/lib/form/FormItem';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import { createFormRules,createDefaultUploadFile,getAttatchStr} from '@/utils/AntdUtil';
import GlobalEnum from '@/Enums/GlobalEnum';
import BackButton from '@/components/BackButton'
import { getPropsParams } from "@/utils/SystemUtil";
import LimitUpload from '@/components/LimitUpload'
import { DOWNLOAD_API, UPLOAD_API } from '@/services/api';

const FormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const problemPartRadio = [
  {label:'车身',value:'1'},
  {label:'传动系统',value:'1'},
  {label:'电气设备',value:'1'},
  {label:'发动机',value:'1'},
  {label:'车轮和轮胎',value:'1'},
  {label:'气囊和安全带',value:'1'},
  {label:'悬架系统',value:'1'},
  {label:'制动系统',value:'1'},
  {label:'转向系统',value:'1'},
  {label:'附加设备',value:'1'},
]

@connect(({ loading }) => ({
  loading
}))
class CarThreeGuaranteesEdit extends Component<IFormAndDvaInterface, any> {
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
  }
  componentWillMount(){
    const edit = getPropsParams(this.props).detail;
    console.log(edit)
  }
  componentDidMount() {
    const id = getPropsParams(this.props).id
    if (id) { this.requestData() }
  }
  requestData() {
    this.props.dispatch({
      type: 'carThreeCompany/search',
      payLoad: getPropsParams(this.props).id,
      callBack: (res) => {
        this.setState({ data: res.data })
        this.props.form.resetFields();
      }
    })
  }
  renderFormItem(label, content) {
    let lg = 12
    if (label === '争议描述'
      || label === '故障部位'
      || label === '凭证'
      || label === '专家介入') {
      lg = 24
    }
    return (
      <Col sm={24} lg={lg} key={label}>
        <FormItem label={label} {...FormItemLayout}>
          {content}
        </FormItem>
      </Col>
    );
  }
  render() {
    const { getFieldDecorator,validateFields } = this.props.form;
    const disabled = getPropsParams(this.props).detail==='false'||getPropsParams(this.props).detail===undefined?true:false;
    const {
      name, identityCardNum, carHolder, telephone, email, postNum, addrProvince, addrCity, addr,
      enName, enTelephone, uniteCreditCode, enAddrProvince, enAddrCity, enAddr,
      requestReason, plateNum, brand, model, buyTime, vinNum, problemPart, disputeDescription, certificateImg, needExpert,resultOpinions,img
    } = this.state.data
    const { detail } = this.state
    const CONTACTS_INFO = [
      { label: '公司名称', content: getFieldDecorator('enterprise-name',{ initialValue: enName })(<HInput disabled={!disabled} allowClear={disabled} />), },
      { label: '联系方式', content: getFieldDecorator('enterprise-telephone', { initialValue: enTelephone, rules: createFormRules(null, null, GlobalEnum.REG_MOBILE_PHONE) })(<HInput disabled={!disabled} allowClear={disabled} />), },
      { label: '电子邮箱', content: getFieldDecorator('customer-email', { initialValue: email,rules: createFormRules(null, null, GlobalEnum.REG_EMAIL)  })(<HInput disabled={!disabled} allowClear={disabled} />), },
      { label: '邮政编码', content: getFieldDecorator('customer-postNum', { initialValue: postNum,rules: createFormRules(null, null, GlobalEnum.REG_POSTAL) })(<HInput disabled={!disabled} allowClear={disabled} />), },
      { label: '省份', content: getFieldDecorator('enterprise-addrProvince', { initialValue: enAddrProvince })(<HInput disabled={!disabled} allowClear={disabled} />), },
      { label: '地市', content: getFieldDecorator('enterprise-addrCity', { initialValue: enAddrCity })(<HInput disabled={!disabled} allowClear={disabled} />), },
      { label: '联系地址', content: getFieldDecorator('enterprise-addr', { initialValue: enAddr })(<HInput disabled={!disabled} allowClear={disabled} />) },
    ]
    const COMPLAIN_INFO = [
      { label: '联系人姓名', content: getFieldDecorator('customer-name', { initialValue: name })(<HInput disabled={!disabled} allowClear={disabled} />) },
      { label: '联系方式', content: getFieldDecorator('customer-telephone', { initialValue: telephone, rules: createFormRules(null, null, GlobalEnum.REG_MOBILE_PHONE) })(<HInput disabled={!disabled} allowClear={disabled} />) },
      { label: '省份', content: getFieldDecorator('customer-addrProvince', { initialValue: addrProvince })(<HInput disabled={!disabled} allowClear={disabled} />), },
      { label: '地市', content: getFieldDecorator('customer-addrCity', { initialValue: addrCity })(<HInput disabled={!disabled} allowClear={disabled} />), },
      { label: '联系地址', content: getFieldDecorator('customer-addr', { initialValue: addr })(<HInput disabled={!disabled} allowClear={disabled} />), },
    ]
    const CAR_INFO = [
      { label: '申请事项', content: getFieldDecorator('car-requestReason', { initialValue: requestReason })(<HInput disabled={!disabled} allowClear={disabled} />) },
      { label: '车牌号', content: getFieldDecorator('car-plateNum', { initialValue: plateNum, rules: createFormRules(null, null) })(<HInput disabled={!disabled} allowClear={disabled} />) },
      { label: '车辆品牌', content: getFieldDecorator('car-brand', { initialValue: brand })(<HInput disabled={!disabled} allowClear={disabled} />) },
      { label: '车辆型号', content: getFieldDecorator('car-model', { initialValue: model })(<HInput disabled={!disabled} allowClear={disabled} />), },
      { label: '购买日期', content: getFieldDecorator('car-buyTime', { initialValue: buyTime })(<HInput disabled={!disabled} allowClear={disabled} />), },
      { label: '车架号', content: getFieldDecorator('car-vinNum', { initialValue: vinNum })(<HInput disabled={!disabled} allowClear={disabled} />), },
      { label: '争议描述', content: getFieldDecorator('car-problemPart', { initialValue: problemPart })(<Input.TextArea autosize={{ minRows: 4, maxRows: 8 }} disabled={!disabled} allowClear={disabled} />), },
      { label: '故障部位', content: getFieldDecorator('carThreeGuarantees-disputeDescription', { initialValue: disputeDescription })(
        <Radio.Group disabled={!disabled} >
          {problemPartRadio.map((item)=>{
            return <Radio value={item.label}>{item.label}</Radio>
          })}
      </Radio.Group>
      ), },
      { label: '凭证', content: getFieldDecorator('carThreeGuarantees-certificateImg', { initialValue: createDefaultUploadFile(certificateImg) })(<LimitUpload disabled={!disabled} allowClear={disabled} />) },
      { label: '专家介入', content: getFieldDecorator('carThreeGuarantees-needExpert', { initialValue: needExpert })(<RadioGroup disabled={!disabled} options={[{ label: '需要', value: '1' }, { label: '不需要', value: '2' }]} />) },
    ]

    const DEAL_RESUTL = [
      {
        label: '处理意见',
        content: getFieldDecorator('carThreeGuarantees-resultOpinions', { initialValue: resultOpinions })(<HInput.TextArea disabled={!disabled} />),
      }
    ];

    const submit = () => {
      const { carId, customerId, enterpriseId } = this.state.data
      validateFields((error, values) => {
        if (error) {
          return
        }
        let certificateImg = values['carThreeGuarantees-certificateImg'];
        const id = getPropsParams(this.props).id
        if (id) {//update
          this.props.dispatch({
            type: 'carThreeCompany/update',
            payLoad: { ...values, id,'carThreeGuarantees-certificateImg':getAttatchStr(certificateImg), 'carThreeGuarantees-id': id,'enterprise-id': enterpriseId, 'car-id': carId, "customer-id": customerId },
            callBack: () => { window.history.back() }
          })
        } else {
          this.props.dispatch({
            type: 'carThreeCompany/add',
            payLoad: { ...values},
            callBack: () => { window.history.back() }
          })
        }
        
      })
    }

    return (
      <Card title="汽车三包">
        <Form>
          <Row>
            <h1>联系人信息</h1>
            {CONTACTS_INFO.map((item) => this.renderFormItem(item.label, item.content))}
          </Row>
          <Row>
            <h1>被投诉方信息</h1>
            {COMPLAIN_INFO.map((item) => this.renderFormItem(item.label, item.content))}
          </Row>
          <Row>
            <h1>车辆信息</h1>
            {CAR_INFO.map((item) => this.renderFormItem(item.label, item.content))}
          </Row>
          {
            getPropsParams(this.props).detail===undefined?null:
            <Row>
              <h1>处理结果</h1>
              {DEAL_RESUTL.map((item) => this.renderFormItem(item.label, item.content))}
            </Row>
          }
          <FormItem wrapperCol={{ offset: FormItemLayout.labelCol.span || 3 }}>
            {
              disabled?<Button type="primary" onClick={() => { submit() }}>确定</Button>:null
            }
            <BackButton />
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(CarThreeGuaranteesEdit);