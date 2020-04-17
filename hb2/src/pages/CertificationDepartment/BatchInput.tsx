import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Input, Form, Radio,Button } from 'antd';
import RichEditor from '@/components/RichEditor';
import LimitUpload from '@/components/LimitUpload'
import { connect } from 'dva';
import { createFormRules } from '@/utils/SystemUtil'
import { DOWNLOAD_API } from '@/services/api';

@connect(({ loading }) => ({
  loading
}))
class BatchInput extends DefaultEditView {
  constructor(props) {
    super(props, 'TechnicalAdvisory', '批量录入能力表');
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '所属检测机构名称',
        content: getFieldDecorator('question', { initialValue: orgData.question })(<Input disabled />),
      },

      {
        label: '所属证书名称',
        content: getFieldDecorator('questisson', { initialValue: orgData.question })(<Input disabled />),
      },
      {
        label: '所属证书编号',
        content: getFieldDecorator('quest信息isson', { initialValue: orgData.question })(<Input disabled />),
      },
      {
        label: '导入状况',
        content: getFieldDecorator('certificateFlag', { initialValue: orgData.certificateFlag, rules: createFormRules(true, null) })(
          <Radio.Group options={[{ label: '首次', value: '1' }, { label: '扩充', value: '2' }, { label: '复查', value: '3' }, { label: '其他', value: '4' }]} />
        ),
      },
      {
        label: '上传导入文件',
        content: getFieldDecorator('certificateAccessory', { initialValue: orgData.certificateAccessory, rules: createFormRules(false, null) })(
          <LimitUpload />
        ),
      },
      {
        label: '导入模板下载',
        content: getFieldDecorator('certificateAccessory', { initialValue: orgData.certificateAccessory, rules: createFormRules(false, null) })(
          <Button type="dashed" onClick={()=>{
            // let type = `TechnicalAdvisory/download`;
            // this.props.dispatch(
            //   {
            //     type,
            //     payLoad:{
            //       id:5568
            //     },
            //     callBack: () => {
            //       // window.history.back();
            //     }
            //   }
            // );
            window.location.href = DOWNLOAD_API(5568);
          }}>点击下载</Button>
        ),
      },
    ];
  }

}

export default Form.create()(BatchInput);