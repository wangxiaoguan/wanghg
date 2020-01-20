import React from 'react';
import moment from 'moment'
import DefaultEditView from '@/components/DefaultEditView';
import { Form, Input, Upload, Radio, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import { createFormRules } from '@/utils/SystemUtil';
import GlobalEnum from '@/Enums/GlobalEnum';
import { createSelectOptions } from '@/utils/AntdUtil';
import EducationDegreeEnum from '@/Enums/EducationDegreeEnum';
import ProfessionalTitleEnum from '@/Enums/ProfessionalTitleEnum'
import HRangePicker from '@/components/Antd/HRangePicker'
import { orgId } from '@/utils/SystemUtil'


@connect(({ loading }) => ({
  loading
}))
class AuthorizerEdit extends DefaultEditView {
  constructor(props) {
    super(props, "AuthorizerDetial", '授权签字人信息', {
      labelCol: { span: 24 },
      wrapperCol: { span: 18 },
    });
  }

  //

  transFormValue(formValues) {
    console.log(formValues.birth)
    return { ...formValues, orgId: orgId(), birth: formValues.birth.toDate() }
  }

  createFormItemList() {
    const getFieldDecorator = this.props.form.getFieldDecorator;
    const {
      signatioyName, sex, birth, duty, title, eduDegree, graduateSchool, authorizedOfficer,
      isExperienced, isHaveDuty, isGraspDetecting, isStanmethod, isAudit, isJudgmenTability, isLawregulat
    } = this.state.orgData || {}
    return [
      {
        label: '授权签字人姓名',
        content: getFieldDecorator('signatioyName', { initialValue: signatioyName, rules: createFormRules(true, null) })(<Input />),
      },
      {
        label: '性别',
        content: getFieldDecorator('sex', { initialValue: sex, rules: createFormRules(false, null) })(
          <Radio.Group options={[{ label: '男', value: '1' }, { label: '女', value: '2' }]} />
        ),
      },
      {
        label: '出生年月',
        content: getFieldDecorator('birth', { initialValue: moment(birth), rules: createFormRules(true, null) })(<DatePicker />),
      },
      {
        label: '职务',
        content: getFieldDecorator('duty', { initialValue: duty, rules: createFormRules(true, null) })(<Input />),
      },
      {
        label: '职称',
        content: getFieldDecorator('title', { initialValue: title, rules: createFormRules(true, null) })(
          <Select>{createSelectOptions(ProfessionalTitleEnum.ALL_LIST, ProfessionalTitleEnum.toString)}</Select>
        ),
      },
      {
        label: ' 文化程度',
        content: getFieldDecorator('eduDegree', { initialValue: eduDegree, rules: createFormRules(false, null) })(
          <Select>{createSelectOptions(EducationDegreeEnum.ALL_LIST, EducationDegreeEnum.toString)}</Select>
        ),
      },
      {
        label: '毕业院校及专业',
        content: getFieldDecorator('graduateSchool', { initialValue: graduateSchool, rules: createFormRules(true, null) })(<Input />),
      },
      {
        label: '授权签字人领域',
        content: getFieldDecorator('authorizedOfficer', { initialValue: authorizedOfficer, rules: createFormRules(true, null) })(<Input />),
      },
      {
        label: '具备相应的工作经历',
        content: getFieldDecorator('isExperienced', { initialValue: isExperienced, rules: createFormRules(false, null) })(
          <Radio.Group options={[{ label: '是', value: '1' }, { label: '否', value: '2' }]} />
        ),
      },
      {
        label: '具备相应的职责权利',
        content: getFieldDecorator('isHaveDuty', { initialValue: isHaveDuty, rules: createFormRules(false, null) })(
          <Radio.Group options={[{ label: '是', value: '1' }, { label: '否', value: '2' }]} />
        ),
      },
      {
        label: '熟悉或掌握检测技术及实验室体系管理程序',
        content: getFieldDecorator('isGraspDetecting', { initialValue: isGraspDetecting, rules: createFormRules(false, null) })(
          <Radio.Group options={[{ label: '是', value: '1' }, { label: '否', value: '2' }]} />
        ),
      },
      {
        label: '熟悉或掌握所承担签字领域的相应技术标准方法',
        content: getFieldDecorator('isStanmethod', { initialValue: isStanmethod, rules: createFormRules(false, null) })(
          <Radio.Group options={[{ label: '是', value: '1' }, { label: '否', value: '2' }]} />
        ),
      },
      {
        label: '熟悉检测报告审核签发程序',
        content: getFieldDecorator('isAudit', { initialValue: isAudit, rules: createFormRules(false, null) })(
          <Radio.Group options={[{ label: '是', value: '1' }, { label: '否', value: '2' }]} />
        ),
      },
      {
        label: '对检测结果做出相应评价的判断能力',
        content: getFieldDecorator('isJudgmenTability', { initialValue: isJudgmenTability, rules: createFormRules(false, null) })(
          <Radio.Group options={[{ label: '是', value: '1' }, { label: '否', value: '2' }]} />
        ),
      },
      {
        label: '熟悉《实验室资质认定评审准则》、《食品检测机构资质认定评审准则》及其相关法律法规要求',
        content: getFieldDecorator('isLawregulat', { initialValue: isLawregulat, rules: createFormRules(false, null) })(
          <Radio.Group options={[{ label: '是', value: '1' }, { label: '否', value: '2' }]} />
        ),
      },
    ];
  }
}

export default Form.create()(AuthorizerEdit);