import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form } from 'antd';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createFormRules } from '@/utils/AntdUtil';
import HSelect from '@/components/Antd/HSelect';
import ContinentEnum from '@/Enums/ContinentEnum';

const { Option } = HSelect;

@connect(({ loading }) => ({
  loading
}))
class CountryInfoEdit extends DefaultEditView {
  constructor(props) {
    super(props, "CountryInfo", "国家及地区信息管理");
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {
      sortNum: 1,
    };
    return [
      {
        label: '国家名称',
        content: getFieldDecorator('countryName', { rules: createFormRules(true), initialValue: orgData.countryName })(<HInput />),
      },
      {
        label: '所属洲(或组织)',
        content: getFieldDecorator('continent', { initialValue: ContinentEnum.getValueByCountryCode(orgData.countryCode) })(
          <HSelect>
            {
              ContinentEnum.ALL.map(item => {
                return <Option key={item.toString()} value={item}>{ContinentEnum.toString(item)}</Option>
              })
            }
          </HSelect>
        ),
      },
    ];
  }
}
export default Form.create()(CountryInfoEdit);