import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Input, Form } from 'antd';
import { connect } from 'dva';
import { createFormRules, createDefaultUploadFile, getAttatchStr } from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';
import HSelect from '@/components/Antd/HSelect';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import GlobalEnum from '@/Enums/GlobalEnum';
import BusineseScopeEnum from '@/Enums/BusineseScopeEnum'
import { createSelectOptions } from '@/utils/AntdUtil';
import { getPropsParams } from '@/utils/SystemUtil';

// let paramType = {}

@connect(({ loading, global }) => ({
  loading,
  global
}))
class FaultProductEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'companyRecord', '缺陷产品编辑');
    // this.setState({
    //   detail:false
    // })
    // this.state = {
    //   detail:false
    // }
  }

  componentDidUpdate(prevProps) {
    // console.log(prevProps)
    let prevParam = getPropsParams(prevProps);
    let paramType = getPropsParams(this.props);
    // console.log(paramType)
    if (paramType.type && this.state.detail === false ) {
      console.log(1)
      this.setState({
        detail:true
      })
    }
    // if (param.id && param.id !== prevParam.id) {
    //   this.getOrgData();
    // }
  }

  transFormValue(formValues) {
    const result = { ...formValues };
    result.licenceImg = getAttatchStr(result.licenceImg);

    /**
     *  TODO: 营业执照去掉暂时是好的
     */
    // delete result.licenceImg
    return result;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const {detail} = this.state
    const orgData = this.state.orgData || {};
    return [
      {
        label: '企业名称',
        content: getFieldDecorator('name', { rules: createFormRules(true), initialValue: orgData.name })(<Input disabled={detail}/>),
      },
      {
        label: '经济行业',
        content: getFieldDecorator('busineseScope', { rules: createFormRules(true), initialValue: orgData.busineseScope })(<HSelect disabled={detail}>
          {
            createSelectOptions(BusineseScopeEnum.ALL_LIST, BusineseScopeEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '省份',
        content: getFieldDecorator('addrProvince', { rules: createFormRules(true), initialValue: orgData.addrProvince })(<HInput  disabled={detail}/>),
      },
      {
        label: '地区',
        content: getFieldDecorator('addrCity', { rules: createFormRules(true), initialValue: orgData.addrCity })(<HInput  disabled={detail}/>),
      },
      {
        label: '区县',
        content: getFieldDecorator('addrCounty', { rules: createFormRules(true), initialValue: orgData.addrCounty })(<HInput  disabled={detail}/>),
      },
      {
        label: '详细地址',
        content: getFieldDecorator('addr', { initialValue: orgData.addr })(<HInput  disabled={detail}/>),
      },
      {
        label: '组织机构代码',
        content: getFieldDecorator('uniteCreditCode', { initialValue: orgData.uniteCreditCode })(<HInput  disabled={detail}/>),
      },
      {
        label: '产品执行标准',
        content: getFieldDecorator('executiveStandard', { initialValue: orgData.executiveStandard })(<HInput  disabled={detail}/>),
      },
      {
        label: '法人代表',
        content: getFieldDecorator('representative', { initialValue: orgData.representative })(<HInput  disabled={detail}/>),
      },
      {
        label: '公司网址',
        content: getFieldDecorator('companyNetAddr', { initialValue: orgData.companyNetAddr })(<HInput  disabled={detail}/>),
      },
      {
        label: '经营产品种类',
        content: getFieldDecorator('productCategory', { initialValue: orgData.productCategory })(<HInput  disabled={detail}/>),
      },
      {
        label: '职务',
        content: getFieldDecorator('duties', { initialValue: orgData.duties })(<HInput  disabled={detail}/>),
      },
      {
        label: '公司邮箱',
        content: getFieldDecorator('companyEmail', { initialValue: orgData.companyEmail })(<HInput  disabled={detail}/>),
      },
      {
        label: '传真',
        content: getFieldDecorator('fax', { initialValue: orgData.fax })(<HInput  disabled={detail}/>),
      },
      {
        label: '质量负责人',
        content: getFieldDecorator('qaManager', { initialValue: orgData.qaManager })(<HInput  disabled={detail}/>),
      },
      {
        label: '电子邮箱',
        content: getFieldDecorator('email', { rules: createFormRules(false, null, GlobalEnum.REG_EMAIL), initialValue: orgData.email })(<HInput  disabled={detail}/>),
      },
      {
        label: '电话',
        content: getFieldDecorator('telephone', { rules: createFormRules(false, null, GlobalEnum.REG_PHONE), initialValue: orgData.telephone })(<HInput  disabled={detail}/>),
      },
      {
        label: '手机',
        content: getFieldDecorator('mobelPhone', { rules: createFormRules(false, null, GlobalEnum.REG_MOBILE_PHONE), initialValue: orgData.mobelPhone })(<HInput  disabled={detail}/>),
      },
      {
        label: '营业执照',
        content: getFieldDecorator('licenceImg', { initialValue: createDefaultUploadFile(orgData.licenceImg) })(<LimitUpload type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS}  disabled={detail}/>),
      },
    ];
  }

}

export default Form.create()(FaultProductEdit);