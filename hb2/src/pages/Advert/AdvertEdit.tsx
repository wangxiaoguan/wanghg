import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import AdvertEnum from '@/Enums/AdvertEnum';
import RadioGroup from 'antd/lib/radio/group';
import { Radio, Form, Switch } from 'antd';
import { connect } from 'dva';
import { getAttatchStr, createDefaultUploadFile } from '@/utils/AntdUtil';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import GlobalEnum from '@/Enums/GlobalEnum';
import HInput from '@/components/Antd/HInput';
import HInputNumber from '@/components/Antd/HInputNumber';
import NewsWindow from '@/components/SelectedWindows/NewsWindow';

const classNames = require('./AdvertEdit.less');

@connect(({ loading }) => ({
  loading
}))
class AdvertEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'advert', "轮播图编辑");
  }

  transFormValue(values) {
    const result = { ...values };
    result.isShow = values.isShow ? '1' : '0';
    result.imgId = getAttatchStr(result.imgId);
    result.module = 'index';
    //如果是文章链接，存文章id
    if (result.associateType === AdvertEnum.NEWS_AD) {
      result.newsId = result.skipUrl ? result.skipUrl[0].id : '';
      delete result.skipUrl;
    }
    return result;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {
      isShow: 1,
      priority: 1,
    };
    const associateType = this.state.associateType || orgData.associateType || AdvertEnum.URL_AD;

    return [
      {
        label: '关联类型',
        content: getFieldDecorator('associateType', { initialValue: associateType })(
          <RadioGroup
            onChange={(event) => {
              this.setState({ associateType: event.target.value });
              this.props.form.setFieldsValue({ skipUrl: null });
            }}
          >
            {
              [AdvertEnum.NEWS_AD, AdvertEnum.URL_AD].map((item) => <Radio key={item} value={item}>{AdvertEnum.toString(item)}</Radio>)
            }
          </RadioGroup>
        ),
      },
      {
        label: '跳转到',
        content: getFieldDecorator('skipUrl', { initialValue: associateType === AdvertEnum.URL_AD ? orgData.skipUrl : NewsWindow.valueStrToState(orgData.newsId) })(
          associateType === AdvertEnum.URL_AD ? <HInput placeholder='外站地址请加http或https' /> : <NewsWindow />
        )
      },
      {
        label: '图片',
        content: getFieldDecorator('imgId', { initialValue: createDefaultUploadFile(orgData.imgId) })(
          <LimitUpload type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS} />
        )
      },
      {
        label: '显示顺序',
        content: getFieldDecorator('priority', { initialValue: orgData.priority })(<HInputNumber />)
      },
      {
        label: '是否启用',
        content: getFieldDecorator('isShow', { valuePropName: 'checked', initialValue: orgData.isShow === 1 })(<Switch />),
      }
    ];
  }
}

export default Form.create()(AdvertEdit);