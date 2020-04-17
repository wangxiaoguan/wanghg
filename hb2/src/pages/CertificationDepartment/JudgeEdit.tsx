import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { connect } from 'dva';
import HSelect from '@/components/Antd/HSelect';
import { Form, DatePicker } from 'antd';
import HInput from '@/components/Antd/HInput';
import { createFormRules, createSelectOptions, createNationList, createPoliticalList, createDefaultUploadFile, createEducationList, createDegreeList, createAcademicianTypeList, createProficiencyList, getAttatchStr } from '@/utils/AntdUtil';
import RadioGroup from 'antd/lib/radio/group';
import GlobalEnum from '@/Enums/GlobalEnum';
import UnitPropertyEnum from '@/Enums/UnitPropertyEnum';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import SexEnum from '@/Enums/SexEnum';

const moment = require('moment');

@connect(({ loading }) => ({
  loading
}))
class JudgeEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'Judge', '评审员新增');
    // if(this.state.orgData) {
    //   this._title = '评审员编辑'
    // }
    // console.log(this._title)
  }

  componentDidUpdate() {
    if (this.state.orgData) {
      this._title = '评审员编辑'
    }
  }

  transFormValue(value){
    console.log('value', value);
    value.photo = value.photo ? getAttatchStr(value.photo) : '';
    return value;
  }

  createFormItemList() {
    const disabled = this.readOnly === '1'
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '维护部门',
        content: getFieldDecorator('maintenanceDepartmentId')(<HSelect disabled={disabled} >
          {
            createSelectOptions(['湖北省市场监督管理局','湖北省标准化与质量研究院'])
          }
        </HSelect>),
      },
      {
        label: '姓名',
        content: getFieldDecorator('name', { rules: createFormRules(true), initialValue: orgData.name })(<HInput disabled={disabled} />),
      },
      {
        label: '性别',
        content: getFieldDecorator('sex', { initialValue: orgData.sex })(
          <RadioGroup disabled={disabled} options={SexEnum.ALL_LIST.map((item) => ({ value: item, label: SexEnum.toString(item) }))} />
        ),
      },
      {
        label: '身份证号',
        content: getFieldDecorator('idNumber', { initialValue: orgData.idNumber, rules: createFormRules(false, null, GlobalEnum.REG_IDENTITY_CARD) })(<HInput disabled={disabled} />),
      },
      {
        label: '出生年月',
        content: getFieldDecorator('birth', { initialValue: moment(orgData.birth) })(<DatePicker disabled={disabled} />),
      },
      {
        label: '民族',
        content: getFieldDecorator('nation', { initialValue: orgData.nation })(<HSelect disabled={disabled}>
          {
            createSelectOptions(createNationList())
          }
        </HSelect>),
      },
      {
        label: '政治面貌',
        content: getFieldDecorator('politicalStatus', { initialValue: orgData.politicalStatus })(<HSelect disabled={disabled}>
          {
            createSelectOptions(createPoliticalList())
          }
        </HSelect>),
      },
      {
        label: '办公电话',
        content: getFieldDecorator('telPhone', { initialValue: orgData.telPhone, rules: createFormRules(null, null, GlobalEnum.REG_PHONE) })(<HInput disabled={disabled} />),
      },
      {
        label: '移动电话',
        content: getFieldDecorator('phone', { initialValue: orgData.phone, rules: createFormRules(null, null, GlobalEnum.REG_MOBILE_PHONE) })(<HInput disabled={disabled} />),
      },
      {
        label: '电子信箱',
        content: getFieldDecorator('email', { initialValue: orgData.email, rules: createFormRules(null, null, GlobalEnum.REG_EMAIL) })(<HInput disabled={disabled} />),
      },
      {
        label: '传真',
        content: getFieldDecorator('fax', { initialValue: orgData.fax, rules: createFormRules(null, null, GlobalEnum.REG_PHONE) })(<HInput disabled={disabled} />),
      },
      {
        label: '外语语种',
        content: getFieldDecorator('language', { initialValue: orgData.language })(<HInput disabled={disabled} />),
      },
      {
        label: '熟练程度',
        content: getFieldDecorator('qualification', { initialValue: orgData.qualification })(<HSelect disabled={disabled}>
          {
            createSelectOptions(createProficiencyList())
          }
        </HSelect>),
      },
      {
        label: '参加社团及职务',
        content: getFieldDecorator('collegeJob', { initialValue: orgData.collegeJob })(<HInput disabled={disabled} />),
      },
      {
        label: '通信地址',
        content: getFieldDecorator('address', { initialValue: orgData.address })(<HInput disabled={disabled} />),
      },
      {
        label: '邮编',
        content: getFieldDecorator('postCode', { initialValue: orgData.postCode })(<HInput disabled={disabled} />),
      },
      {
        label: '学历',
        content: getFieldDecorator('education', { initialValue: orgData.education })(<HSelect disabled={disabled}>
          {
            createSelectOptions(createEducationList())
          }
        </HSelect>),
      },
      {
        label: '学位',
        content: getFieldDecorator('degree', { initialValue: orgData.degree })(<HSelect disabled={disabled}>
          {
            createSelectOptions(createDegreeList())
          }
        </HSelect>),
      },
      {
        label: '毕业年月',
        content: getFieldDecorator('graduationDate', { initialValue: moment(orgData.graduationDate) })(<DatePicker disabled={disabled} />),
      },
      {
        label: '毕业院校',
        content: getFieldDecorator('graduateSchool', { initialValue: orgData.graduateSchool })(<HInput disabled={disabled} />),
      },
      {
        label: '所学专业',
        content: getFieldDecorator('major', { initialValue: orgData.major })(<HInput disabled={disabled} />),
      },
      {
        label: '工作简历',
        content: getFieldDecorator('resume', { initialValue: orgData.resume })(<HInput.TextArea disabled={disabled} placeholder='（任职时间、工作单位及工作内容）' />),
      },
      {
        label: '检验检测行业',
        content: getFieldDecorator('examIndustry', { initialValue: orgData.examIndustry })(<HInput.TextArea disabled={disabled} placeholder='（参与检验检测行业项目及主要职责、科研、科研、管理、试验评估等）' />),
      },
      {
        label: '论文',
        content: getFieldDecorator('inventPublish', { initialValue: orgData.inventPublish })(<HInput.TextArea disabled={disabled} placeholder='发明、著作、学术论文、发表时间、发表刊物名称' />),
      },
      {
        label: '所获荣誉及专业奖项',
        content: getFieldDecorator('honorPrize', { initialValue: orgData.honorPrize })(<HInput.TextArea disabled={disabled} />),
      },
      {
        label: '工作单位',
        content: getFieldDecorator('workUnit', { initialValue: orgData.workUnit })(<HInput disabled={disabled} />),
      },
      {
        label: '主管部门',
        content: getFieldDecorator('department', { initialValue: orgData.department })(<HInput disabled={disabled} />),
      },
      {
        label: '单位性质',
        content: getFieldDecorator('unitProperty', { initialValue: orgData.unitProperty })(<HSelect disabled={disabled} >
          {
            createSelectOptions(UnitPropertyEnum.ALL_TYPES,UnitPropertyEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '行政职务',
        content: getFieldDecorator('adminDuty', { initialValue: orgData.adminDuty })(<HInput disabled={disabled} />),
      },
      {
        label: '从事专业',
        content: getFieldDecorator('workMajor', { initialValue: orgData.workMajor })(<HInput disabled={disabled} />),
      },
      {
        label: '技术职称',
        content: getFieldDecorator('technicalTitle', { initialValue: orgData.technicalTitle })(<HInput disabled={disabled} />),
      },
      {
        label: '聘任时间',
        content: getFieldDecorator('engage', { initialValue: moment(orgData.engage) })(<DatePicker disabled={disabled} />),
      },
      {
        label: '院士填写',
        content: getFieldDecorator('academician', { initialValue: orgData.academician })(<HSelect disabled={disabled}>
          {
            createSelectOptions(createAcademicianTypeList())
          }
        </HSelect>),
      },
      {
        label: '照片',
        content: getFieldDecorator('photo', { initialValue: createDefaultUploadFile(orgData.photo) })(<LimitUpload type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS} disabled={disabled} />),
      },
    ];
  }
}

export default Form.create()(JudgeEdit);