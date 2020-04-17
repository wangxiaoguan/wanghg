import React, { Component } from 'react';
import { Modal, message, Form, Spin, Input, Checkbox } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { connect } from 'dva';
import { createFormRules, exportFileFromBlob } from '@/utils/SystemUtil';
// import { Context } from '@/components/SearchTable';

// const {FormItem} = Form

interface ILoginPageState {
  visible: boolean;
  loading: boolean;
  fieldsArr: Array;
  checkAll: boolean;
  resData: object;
  // model: string;
}

/**
 * 建议用ref方式控制打开、关闭的Modal
 * + getInstance--获取当前modal实例，格式为fun(instance)
 * + Modal组件的props
 */

const FORMITEM_LAYOUT = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
};

// @Form.create()
@connect(({ loading }) => ({}))
class ExportFieldsModal extends Component<any, ILoginPageState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: true,
      fieldsArr: [],
      resData: {},
      checkAll: false,
      // model: 'login'
    };
    if (this.props.getInstance) {
      this.props.getInstance(this);
    }
  }

  // static contextType = Context;

  public show = () => {
    this.setState({ visible: true });
    console.log(this.props.nameSpace);
    // console.log(this.context)
    this.props.dispatch({
      type: `${(this.props.nameSpace)}/exportField`,
      // payLoad: { type: '3', code: '420000' },
      callBack: res => {
        console.log(res);
        const obj = res.data;
        const fieldsArr = [];
        Object.keys(obj).forEach(key => {
          // console.log(key)
          fieldsArr.push({ label: obj[key], value: key });
        });
        this.setState({
          loading: false,
          resData: obj,
          fieldsArr,
        });
        // this.setState({ regOptions: res.data })
      },
    });
  };

  close = () => {
    this.setState({ visible: false });
  };

  ok = () => {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        // console.log(values)
        const { resData } = this.state;
        const fields = values.fields;
        const exportFields = {};
        for (let i = 0; i < fields.length; i++) {
          exportFields[fields[i]] = resData[fields[i]];
        }
        this.setState({
          loading: true,
        });
        // console.log(exportFields)
        this.props.dispatch({
          type: `${this.props.nameSpace}/exportFieldDownLoad`,
          payLoad: {
            exportFields,
            exportParams: this.props.searchData
          },
          callBack: res => {
            exportFileFromBlob(res, `${this.props.nameSpace}.xls`);
            this.setState({
              visible: false,
              loading: false,
            });
          },
        });
      }
    });
  };

  onCheckAllChange = e => {
    const { checked } = e.target;
    let values = []
    if(checked){
      const { fieldsArr } = this.state;
      values = fieldsArr.map(item => item.value )
    }
    this.props.form.setFieldsValue({
      fields : values,
    })
    this.setState({checkAll: checked});
  }

  onChange = checkedList  => {
    const { fieldsArr } = this.state;
    if(fieldsArr.length === checkedList.length){
      this.setState({checkAll: true})
    }else{
      this.setState({checkAll: false})
    }
  }

  /**
   * 使用此组件为父类时，可用此方法给modal创建子元素
   */
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, fieldsArr } = this.state;

    // const detailForm=()=>{
    //   const { getFieldDecorator } = this.props.form;
    //   return (<Form>
    //     <FormItem label="帐号" {...FORMITEM_LAYOUT}>
    //       {getFieldDecorator('userAccount')(<Input />)}
    //     </FormItem>
    //   </Form>)
    // }

    

    return (
      <Modal
        visible={this.state.visible}
        onCancel={() => this.close()}
        closable={false}
        title={'选择导出字段'}
        destroyOnClose
        onOk={() => {
          this.ok();
        }}
        width='680px'
      >
        <Spin size="large" spinning={loading}>
          <Form hideRequiredMark>
            <FormItem colon={false} label="" {...FORMITEM_LAYOUT}>
              {getFieldDecorator('fields', {
                rules: createFormRules(true, null, null, '请选择需要导出的字段'),
              })(
                <Checkbox.Group
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}
                  options={fieldsArr}
                  onChange={this.onChange}
                />
              )}
            </FormItem>
          </Form>
        </Spin>
        <div>
          <Checkbox
              onChange={this.onCheckAllChange}
              checked={this.state.checkAll}
            >
              全选
            </Checkbox>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(ExportFieldsModal);
