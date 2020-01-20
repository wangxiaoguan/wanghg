import { Form, DatePicker, InputNumber } from 'antd';
import React from 'react';
import { connect } from 'dva';
import HInput from '@/components/Antd/HInput';
import HSelect from '@/components/Antd/HSelect';
import DefaultEditView from '@/components/DefaultEditView';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import RadioGroup from 'antd/lib/radio/group';
import HInputNumber from '@/components/Antd/HInputNumber';
import GlobalEnum from '@/Enums/GlobalEnum';
import MajorAreaEnum from '@/Enums/MajorAreaEnum';
import SexEnum from '@/Enums/SexEnum';
import { getAttatchStr,createFormRules, createSelectOptions, createNationList, createPoliticalList, createDefaultUploadFile, createEducationList, createDegreeList } from '@/utils/AntdUtil';
import lodash from 'lodash';
import UpholdEnum from '@/Enums/UpholdEnum';
import ProfessionLevelStatusEnum from '@/Enums/ProfessionLevelStatusEnum';
import ProfessionNumStatusEnum from '@/Enums/ProfessionNumStatusEnum';
import { getPropsParams } from '@/utils/SystemUtil';
const classNames = require('./ExpertDatabaseEdit.less');
const moment = require('moment');
/**
 * 专家库
 */
@connect(({ loading }) => (
  {
    loading,
  }
))
class ExpertDatabaseEdit extends DefaultEditView {
  constructor(props) {
    super(props, "expertDataBase", "专家库编辑");
  }

  transFormValue(formValues) {
    const values = { ...formValues }
    const majorAreas = values.majorArea
    const keys = ['majorArea1', 'majorArea2', 'majorArea3', 'majorArea4', 'majorArea5']
    if (lodash.isArray(majorAreas) && majorAreas.length > 0) {
      for (let i = 0; i < majorAreas.length; i++) {
        values[keys[i]] = majorAreas[i]
      }
      delete values.majorArea;
    }
    values.imageId = getAttatchStr(formValues.imageId)
    return values;
  }

  getClassName() {
    return classNames.expertDatabaseEdit;
  }

  createFormItemList() {
    let detail = getPropsParams(this.props).type==='detail'?true:false;
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '维护部门',
        content: getFieldDecorator('uphold', { initialValue: orgData.uphold})(<HSelect disabled={detail} allowClear={!detail}>
          {
            createSelectOptions(UpholdEnum.ALL, UpholdEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '姓名',
        content: getFieldDecorator('name', { initialValue: orgData.name, rules: createFormRules(true) })(<HInput disabled={detail} allowClear={!detail}/>),
      },
      {
        label: '性别',
        content: getFieldDecorator('sex', { initialValue: String(orgData.sex) })(
          <RadioGroup disabled={detail} options={SexEnum.ALL_LIST.map((item) => ({ value: item, label: SexEnum.toString(item) }))} />
        ),
      },
      {
        label: '年龄',
        content: getFieldDecorator('age', { initialValue: orgData.age })(<HInputNumber disabled={detail} max={200} />),
      },
      {
        label: '身份证号',
        content: getFieldDecorator('idCard', { initialValue: orgData.idCard, rules: createFormRules(false, null, GlobalEnum.REG_IDENTITY_CARD) })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '出生年月',
        content: getFieldDecorator('birth', { initialValue: moment(orgData.birth) })(<DatePicker disabled={detail} allowClear={!detail} />),
      },
      {
        label: '民族',
        content: getFieldDecorator('national', { initialValue: orgData.national })(<HSelect disabled={detail} allowClear={!detail}>
          {
            createSelectOptions(createNationList())
          }
        </HSelect>),
      },
      {
        label: '政治面貌',
        content: getFieldDecorator('party', { initialValue: orgData.party })(<HSelect disabled={detail} allowClear={!detail}>
          {
            createSelectOptions(createPoliticalList())
          }
        </HSelect>),
      },
      {
        label: '办公电话',
        content: getFieldDecorator('tel', { initialValue: orgData.tel, rules: createFormRules(false, null, GlobalEnum.REG_PHONE) })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '手机',
        content: getFieldDecorator('phone', { initialValue: orgData.phone, rules: createFormRules(false, null, GlobalEnum.REG_MOBILE_PHONE) })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '邮箱',
        content: getFieldDecorator('mail', { initialValue: orgData.mail, rules: createFormRules(false, null, GlobalEnum.REG_EMAIL) })(<HInput disabled={detail} allowClear={!detail}/>),
      },
      {
        label: '通讯地址',
        content: getFieldDecorator('address', { initialValue: orgData.address })(<HInput.TextArea disabled={detail} />),
      },
      {
        label: '学历',
        content: getFieldDecorator('qualifications', { initialValue: orgData.qualifications })(<HSelect disabled={detail} allowClear={!detail}>
          {
            createSelectOptions(createEducationList())
          }
        </HSelect>),
      },
      {
        label: '学位',
        content: getFieldDecorator('degree', { initialValue: orgData.degree })(<HSelect disabled={detail} allowClear={!detail}>
          {
            createSelectOptions(createDegreeList())
          }
        </HSelect>),
      },
      {
        label: '专业',
        content: getFieldDecorator('major', { initialValue: orgData.major })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '职称序列',
        content: getFieldDecorator('titleId', { initialValue: orgData.titleId })(<HSelect disabled={detail} allowClear={!detail}>
          {
            createSelectOptions(ProfessionNumStatusEnum.ALL, ProfessionNumStatusEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '职称级别',
        content: getFieldDecorator('titleLevel', { initialValue: orgData.titleLevel })(<HSelect disabled={detail} allowClear={!detail}>
          {
            createSelectOptions(ProfessionLevelStatusEnum.ALL, ProfessionLevelStatusEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '专业技术职务工作年限',
        content: getFieldDecorator('majorAge', { initialValue: orgData.majorAge })(<InputNumber disabled={detail} />),
      },
      {
        label: '专业相关任职经历',
        content: getFieldDecorator('majorExperience', { initialValue: orgData.majorExperience })(<HInput.TextArea disabled={detail} />),
      },
      {
        label: '专业技术行业',
        content: getFieldDecorator('officialTechTrade', { initialValue: orgData.officialTechTrade })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '专业相关荣誉奖励',
        content: getFieldDecorator('majorReword', { initialValue: orgData.majorReword })(<HInput.TextArea disabled={detail}/>),
      },
      {
        label: '工作单位',
        content: getFieldDecorator('orgName', { initialValue: orgData.orgName })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '单位性质',
        content: getFieldDecorator('orgType', { initialValue: orgData.orgType })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '行政职务',
        content: getFieldDecorator('duty', { initialValue: orgData.duty })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '评审领域',
        content: getFieldDecorator('majorArea', { initialValue: orgData.majorArea1 })(
          <HSelect disabled={detail} allowClear={!detail}
            tokenSeparators={[',']}
            mode="tags"
          >
            {
              createSelectOptions(MajorAreaEnum.ALL_LIST, MajorAreaEnum.toString)
            }
          </HSelect>),
      },
      {
        label: '专家数据采集来源',
        content: getFieldDecorator('dataSource', { initialValue: orgData.majorArea1 })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '照片',
        content: getFieldDecorator('imageId', { initialValue: createDefaultUploadFile(orgData.imageId) })(<LimitUpload disabled={detail} type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS} />),
      },
    ];
  }
}

export default Form.create()(ExpertDatabaseEdit);
