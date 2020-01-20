import {Button, Card, Form, Upload, Cascader,Option} from 'antd';
import React, {Component} from 'react';

import RichEditor from '@/components/RichEditor';
import {connect} from 'dva';
import {getPropsParams} from '@/utils/SystemUtil';
import {UPLOAD_API} from '@/services/api';
import BackButton from '@/components/BackButton';
import HSelect from '@/components/Antd/HSelect';
import HInput from '@/components/Antd/HInput';
import LimitUpload from '@/components/LimitUpload';
import {createDefaultUploadFile, getAttatchStr,createFormRules,createSelectOptions} from '@/utils/AntdUtil';
import HCascader from '@/components/Antd/HCascader';
import HbCitysEnum from '@/Enums/HbCitysEnum'
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: {span: 3},
  wrapperCol: {span: 21},
};
/**
 * 新闻编辑
 * props
 * newsData--新闻数据，如果是编辑已有的新闻，此属性表示要编辑的新闻
 */
@connect(({loading, newsCategory,global}) => (
  {
    loading,
    newsCategory,
    global,
  }
))
@Form.create()
class NewsEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 原始数据
      orgData: props.newsData,
      // 编辑后的数据
      editData: null,

      // 类别数据
      categoryData: null,
    };
  }

  requestOrgData() {
    const params = getPropsParams(this.props);
    if (params.id) {
      this.props.dispatch(
        {
          type: 'news/search',
          payLoad: params.id,
          callBack: (res) => {
            this.setState({orgData: res.data});
          },
        }
      );
    }
  }

  componentDidMount() {
    this.requestCategoryData();
    this.requestOrgData();
  }

  componentDidUpdate(prevProps) {
    const preParams = getPropsParams(prevProps);
    const params = getPropsParams(this.props);
    if (params.id && params.id !== preParams.id) {
      this.requestOrgData();
    }
  }

  requestCategoryData() {
    this.props.dispatch(
      {
        type: 'newsCategory/searchAllEnable',
        callBack: (res) => {
          this.props.form.resetFields();
          this.setState({categoryData: res.data});
        }
      }
    );
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({editData: values}, this.saveNews);
      }
    });
  }

  saveNews = () => {
    const newsData = {...this.state.editData};

    const categoryList = this.state.editData.category;
    // 表单中的类别转换成后端需要的属性
    delete newsData.category;
    newsData.type = categoryList[0];
    newsData.item = categoryList[1];
    newsData.itemProperties = categoryList[2];
    newsData.fileId = getAttatchStr(newsData.fileId);

    // 根据后端要求额外添加的属性
    newsData.module = 'index';

    let type = 'news/add';

    if (this.state.orgData) {
      newsData.id = this.state.orgData.id;
      type = 'news/update'
    }
    this.props.dispatch(
      {
        type,
        payLoad: newsData,
        callBack: () => {
          window.location.hash = 'news/list';
        }
      }
    );
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const detail = getPropsParams(this.props).detail?true:false;
    const orgNews = this.state.orgData || {};
    const FORM_ITEMS = [
      {
        label: '标题',
        content: getFieldDecorator('title', {rules: createFormRules(false,50),initialValue: orgNews.title})(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '所属类别',
        content: getFieldDecorator('category', {initialValue: [orgNews.type, orgNews.item, orgNews.itemProperties]})(<HCascader disabled={detail} options={this.state.categoryData} fieldNames={{label: 'name', value: 'id', children: 'childItem'}} />),
      },
      {
        label: '简介',
        content: getFieldDecorator('summary', {initialValue: orgNews.summary})(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '作者',
        content: getFieldDecorator('author', {initialValue: orgNews.author})(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '行政区划',
        content: getFieldDecorator('areaId', {initialValue: orgNews.areaId})(<HSelect disabled={detail}>{
          createSelectOptions(HbCitysEnum.ALL_LIST, HbCitysEnum.toString)
        }</HSelect>),
      },
      {
        label: '附件上传',
        content: getFieldDecorator('fileId', {initialValue: createDefaultUploadFile(orgNews.fileId)})(<LimitUpload disabled={detail} />),
      },
      {
        label: '内容',
        content: (
          getFieldDecorator('content', {initialValue: orgNews.content})(<RichEditor disabled={detail} uploadImgServer={UPLOAD_API} />)
        ),
      },
      {
        label: '所属单位',
        content: getFieldDecorator('newsSource', {initialValue: orgNews.newsSource})(<HInput disabled={detail} allowClear={!detail} />),
      },
    ];
    return (
      <Card title={detail?'内容预览':'内容编辑'}>
        <Form onSubmit={this.onSubmit}>
          {
            FORM_ITEMS.map((item) => {
              return (
                <FormItem key={item.label} {...FormItemLayout} label={item.label}>{item.content}</FormItem>
              );
            })
          }
          <FormItem wrapperCol={{offset: 3}}>
            {
              !detail&&<Button type="primary" htmlType='submit'>保存</Button>
            }
            <BackButton />
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default NewsEdit;