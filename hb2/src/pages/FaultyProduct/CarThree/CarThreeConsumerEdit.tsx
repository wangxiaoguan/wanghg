import React, { Component } from 'react';
import { Card, Form, Row, Col, Input, Upload, Button,Radio } from 'antd';
import RadioGroup from 'antd/lib/radio/group';
import FormItem from 'antd/lib/form/FormItem';
import HInput from '@/components/Antd/HInput';
import HSelect from '@/components/Antd/HSelect';
import HRangeTime from '@/components/Antd/HRangeTime';
import HDatePicker from '@/components/Antd/HDatePicker';
import LimitUpload from '@/components/LimitUpload'
import { DOWNLOAD_API, UPLOAD_API } from '@/services/api';
import { connect } from 'dva';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import { createFormRules,getAttatchStr,createDefaultUploadFile,createSelectOptions } from '@/utils/AntdUtil';
import GlobalEnum from '@/Enums/GlobalEnum';
import HbCitysEnum  from '@/Enums/HbCitysEnum';
import ArgueStatusEnum from '@/Enums/ArgueStatusEnum';
import BackButton from '@/components/BackButton'
import { getPropsParams } from "@/utils/SystemUtil";
import moment from 'moment'
const FormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const problemPartRadio = [
  {label:'车身',key:'1'},
  {label:'传动系统',key:'2'},
  {label:'电气设备',key:'3'},
  {label:'发动机',key:'4'},
  {label:'车轮和轮胎',key:'5'},
  {label:'气囊和安全带',key:'6'},
  {label:'悬架系统',key:'7'},
  {label:'制动系统',key:'8'},
  {label:'转向系统',key:'9'},
  {label:'附加设备',key:'10'},
]

@connect(({ loading }) => ({
  loading
}))
class CarThreeGuaranteesEdit extends Component<IFormAndDvaInterface, any> {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      detail: false,
      Reason:'',
    }
  }
  componentDidMount() {
    const id = getPropsParams(this.props).id
    const detail = getPropsParams(this.props).detail
    if(detail==='detail'){
      this.setState({detail: true})
    }
    if (id) { this.requestData() }
  }

  // componentDidUpdate() {
  //   const detail = getPropsParams(this.props).detail
  //   if(detail==='detail'){
  //     this.setState({detail: true})
  //   }
  // }

  requestData() {
    this.props.dispatch({
      type: 'carThreeConsumer/search',
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
        <FormItem key={label} label={label} {...FormItemLayout}>
          {content}
        </FormItem>
      </Col>
    );
  }
  render() {
    const { getFieldDecorator, validateFields } = this.props.form;
    const {
      name, identityCardNum, carHolder, telephone, email, postNum, addrProvince, addrCity, addr,
      enName, enTelephone, uniteCreditCode, enAddrProvince, enAddrCity, enAddr,
      requestReason, plateNum, brand, model, buyTime, vinNum, problemPart, disputeDescription, certificateImg, needExpert,
      resultOpinions,img
    } = this.state.data
    const { detail,Reason } = this.state
    const CONTACTS_INFO = [
      { label: '车主姓名', content: getFieldDecorator('customer-name', { initialValue: name,rules: createFormRules(true)  })(<HInput disabled={detail} allowClear={!detail} />) },
      { label: '联系方式', content: getFieldDecorator('customer-telephone', { initialValue: telephone, rules: createFormRules(true, null,GlobalEnum.REG_MOBILE_PHONE) })(<HInput disabled={detail} allowClear={!detail} />) },
      { label: '电子邮箱', content: getFieldDecorator('customer-email', { initialValue: email,rules: createFormRules(true, null, GlobalEnum.REG_EMAIL) })(<HInput disabled={detail} allowClear={!detail} />), },
      { label: '省份', content: getFieldDecorator('customer-addrProvince', { initialValue: addrProvince })(<HInput disabled={detail} allowClear={!detail} />), },
      { label: '地市', content: getFieldDecorator('customer-addrCity', { initialValue: addrCity })(<HInput disabled={detail} allowClear={!detail} />), },
      { label: '联系地址', content: getFieldDecorator('customer-addr', { initialValue: addr })(<HInput disabled={detail} allowClear={!detail} />) },
    ]
    const COMPLAIN_COMPANNY_INFO = [
      { label: '公司名称', content: getFieldDecorator('enterprise-name', { initialValue: enName,rules:createFormRules(true) })(<HInput disabled={detail} allowClear={!detail} />) },
      { label: '联系方式', content: getFieldDecorator('enterprise-telephone', { initialValue: enTelephone, rules: createFormRules(true, null, GlobalEnum.REG_MOBILE_PHONE) })(<HInput disabled={detail} allowClear={!detail} />) },
      { label: '省份', content: getFieldDecorator('enterprise-addrProvince', { initialValue: '湖北省',rules:createFormRules(true)  })(<HInput disabled allowClear={false}/>), },
      { label: '地市', content: getFieldDecorator('enterprise-addrCity', { initialValue: enAddrCity,rules:createFormRules(true)  })(<HSelect disabled={detail} allowClear={!detail}>{
        createSelectOptions(HbCitysEnum.ALL_LIST, HbCitysEnum.toString)
      }</HSelect>)},
      { label: '联系地址', content: getFieldDecorator('enterprise-addr', { initialValue: enAddr,rules:createFormRules(true)  })(<HInput disabled={detail} allowClear={!detail} />), },
    ]
    const CAR_INFO = [
      { label: '争议诉求', content: getFieldDecorator('car-requestReason', { initialValue: requestReason,rules:createFormRules(true) })(<HSelect onChange={e=>this.setState({Reason:e})}>{
        createSelectOptions(ArgueStatusEnum.ALL_LIST, ArgueStatusEnum.toString)
      }</HSelect>)},
      { label: '车牌号', content: getFieldDecorator('car-plateNum', { initialValue: plateNum, rules: createFormRules(true) })(<HInput disabled={detail} allowClear={!detail} />) },
      { label: '车辆品牌', content: getFieldDecorator('car-brand', { initialValue: brand,rules:createFormRules(true) })(<HInput disabled={detail} allowClear={!detail} />) },
      { label: '车辆型号', content: getFieldDecorator('car-model', { initialValue: model,rules:createFormRules(true) })(<HInput disabled={detail} allowClear={!detail} />), },
      { label: '购买日期', content: getFieldDecorator('car-buyTime', { initialValue: moment(buyTime),rules:createFormRules(true,null) })(<HDatePicker />), },
      { label: '车架号', content: getFieldDecorator('car-vinNum', { initialValue: vinNum,rules:createFormRules(true) })(<HInput disabled={detail} allowClear={!detail} />), },
      { label: '故障部位', content: getFieldDecorator('carThreeGuarantees-disputeDescription', { initialValue: disputeDescription||'1',rules:createFormRules(true) })(
        <Radio.Group disabled={detail}>
            {problemPartRadio.map((item)=>{
              return <Radio value={item.key}>{item.label}</Radio>
            })}
        </Radio.Group>
        ), },
      { label: '凭证', content: getFieldDecorator('certificateImg', { initialValue:createDefaultUploadFile(certificateImg)})(<LimitUpload disabled={detail} />) },
      { label: '专家介入', content: getFieldDecorator('carThreeGuarantees-needExpert', { initialValue: needExpert,rules:createFormRules(true) })(<RadioGroup options={[{ label: '是', value: '1' }, { label: '否', value: '2' }]} disabled={detail}/>) },
    ];
    if(Reason==='OTHERS'||requestReason==='OTHERS'){
      let item = { label: '争议描述', content: getFieldDecorator('car-problemPart', { initialValue: problemPart,rules:createFormRules(true) })(<Input.TextArea placeholder='列如：车辆何时在何地维修，存在的何种争议(简述请在30字内)' maxLength={30} autosize={{ minRows: 4, maxRows: 8 }} />), };
      CAR_INFO.splice(6,0,item)
    }
    const DEAL_RESUTL = [
      {
        label: '处理意见',
        content: getFieldDecorator('carThreeGuarantees-resultOpinions', { initialValue: resultOpinions })(<HInput.TextArea  disabled={detail}/>),
      }
    ];

    const submit = () => {
      const { carId, customerId, enterpriseId } = this.state.data
      validateFields((error, values) => {
        if (error) {
          return
        }
        if(values['car-requestReason']!=='OTHERS'){
          values['car-problemPart'] = '';
        }
        let certificateImg = values['certificateImg'];
        const id = getPropsParams(this.props).id
        if (id) {//update
          this.props.dispatch({
            type: 'carThreeConsumer/update',
            payLoad: { ...values, 'certificateImg':getAttatchStr(certificateImg), id, 'carThreeGuarantees-id': id, 'car-id': carId, "customer-id": customerId,"enterprise-id":enterpriseId },
            callBack: () => { window.history.back() }
          })
        } else {
          this.props.dispatch({
            type: 'carThreeConsumer/add',
            payLoad: { ...values, 'certificateImg': getAttatchStr(certificateImg) },
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
            <h1>被投诉公司信息</h1>
            {COMPLAIN_COMPANNY_INFO.map((item) => this.renderFormItem(item.label, item.content))}
          </Row>
          <Row>
            <h1>车辆信息</h1>
            {CAR_INFO.map((item) => this.renderFormItem(item.label, item.content))}
          </Row>
          {
            getPropsParams(this.props).detail!=='add'&&
            <Row>
            <h1>处理结果</h1>
            {DEAL_RESUTL.map((item) => this.renderFormItem(item.label, item.content))}
          </Row>
          }
          
          {/* {detail || <FormItem wrapperCol={{ offset: FormItemLayout.labelCol.span || 3 }}>
          {
            getPropsParams(this.props).detail!=='detail'&&<Button type="primary" onClick={() => { submit() }}>确定</Button>
          }
          </FormItem>}
          <BackButton /> */}
          <FormItem wrapperCol={{ offset: FormItemLayout.labelCol.span || 3 }}>
            {
              getPropsParams(this.props).detail!=='detail'&&<Button type="primary" onClick={() => { submit() }}>确定</Button>
            }
            <BackButton />
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(CarThreeGuaranteesEdit);