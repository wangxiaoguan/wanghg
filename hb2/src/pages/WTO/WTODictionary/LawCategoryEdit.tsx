import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form, Radio } from 'antd';
import { connect } from 'dva';
import RadioGroup from 'antd/lib/radio/group';
import LawCategoryEnum from '@/Enums/LawCategoryEnum';
import HInput from '@/components/Antd/HInput';
import HInputNumber from '@/components/Antd/HInputNumber';
import HSCodeWindow, { HSCodeWindowClass } from '@/components/SelectedWindows/HSCodeWindow';
import CountryWindow, { CountryWindowClass } from '@/components/SelectedWindows/CountryWindow';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import { createDefaultUploadFile, getAttatchStr } from '@/utils/AntdUtil';
import GlobalEnum from '@/Enums/GlobalEnum';


@connect(({ loading }) => ({
  loading
}))
class LawCategoryEdit extends DefaultEditView {
  constructor(props) {
    super(props, "LawCategory", "法规分类");
  }

  transFormValue(values) {
    if (values.hsCode) {
      values.hsCode = values.hsCode.map((item) => item.hsCode).join();
    }
    if (values.countryCode) {
      values.countryCode = values.countryCode.map((item) => item.countryName).join();
    }
    if (values.attachInfo) {
      values.attachInfo = getAttatchStr(values.attachInfo);
    }
    return values;
  }


  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {
      type: LawCategoryEnum.PRODUCT,
      sortIndex: 1,
    };

    // 如果currentType未设置，则设置为orgData.type
    if (!this.state.currentType) {
      this.setState({ currentType: orgData.type })
    }

    let codeItem = {};
    if (this.state.currentType === LawCategoryEnum.PRODUCT) {
      codeItem = {
        label: '产品编码',
        content: getFieldDecorator('hsCode', { initialValue: HSCodeWindowClass.valueStrToState(orgData.hsCode) })(<HSCodeWindow />),
      }
    }
    else {
      codeItem = {
        label: '所属洲(或组织)',
        content: getFieldDecorator('countryCode', { initialValue: CountryWindowClass.valueStrToState(orgData.continent) })(<CountryWindow />),
      };
    }

    return [
      {
        label: '分类',
        content: getFieldDecorator('type', { initialValue: orgData.type })(
          <RadioGroup
            onChange={(event) => {
              this.setState({ currentType: event.target.value });
            }}
          >
            {
              LawCategoryEnum.ALL.map((item) => {
                return <Radio key={item} value={item}>{LawCategoryEnum.toString(item)}</Radio>
              })
            }
          </RadioGroup>),
      },
      {
        label: '类别名称',
        content: getFieldDecorator('classificationName', { initialValue: orgData.classificationName })(<HInput />)
      },
      {
        label: '排序',
        content: getFieldDecorator('sortNum', { initialValue: orgData.sortNum })(<HInputNumber />)
      },
      codeItem,
      {
        label: '附件',
        content: getFieldDecorator('attachInfo', { initialValue: createDefaultUploadFile(orgData.attachInfo) })(<LimitUpload type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS} />)
      },
    ];
  }
}
export default Form.create()(LawCategoryEdit);