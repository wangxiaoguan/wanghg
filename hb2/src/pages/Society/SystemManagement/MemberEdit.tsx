import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Input, Form, Radio, Checkbox, Select } from 'antd';
import { connect } from 'dva';
import { createFormRules, createSelectOptions } from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';
import RegonEnum from '@/Enums/RegonEnum';
import HSelect from '@/components/Antd/HSelect';
import { getPropsParams } from '@/utils/SystemUtil';

@connect(({ loading }) => ({
  loading
}))
class MemberEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'memberManagement', '人员编辑');
  }

  // componentDidMount() {
  //   super.componentDidMount()
  //   this.props.dispatch(
  //     {
  //       type: 'memberManagement/getRoleInfoList',
  //       callBack: (res) => {
  //         console.log(res)
  //         this.setState({
  //           orgData: {
  //             ...this.state.orgData,
  //             roleList:res.data,
  //             // roleList:res.data.map((item)=>{
  //             //   return {
  //             //     label:item.roleName,
  //             //     value:item.id,
  //             //   }
  //             // }),
  //           }
  //         });
  //         // this.props.form.resetFields();
  //       }
  //     }
  //   );
  // }

  getOrgData() {
    let param = getPropsParams(this.props);
    if (param.id) {
      this.props.dispatch(
        {
          type: 'memberManagement/search',
          payLoad: param.id,
          callBack: (res) => {
            this.setState({
              orgData: {
                ...res.data,
                roleList: []
              }
            });
            this.props.form.resetFields();
            this.props.dispatch(
              {
                type: 'memberManagement/getRoleInfoList',
                callBack: (res1) => {
                  // console.log(res1)
                  this.setState({
                    orgData: {
                      ...this.state.orgData,
                      roleList: res1.data,
                    }
                  });
                }
              }
            );
          }
        }
      );
    } else {
      this.props.dispatch(
        {
          type: 'memberManagement/getRoleInfoList',
          callBack: (res1) => {
            // console.log(res1)
            this.setState({
              orgData: {
                ...this.state.orgData,
                roleList: res1.data,
              }
            });
          }
        }
      );
    }
  }

  transFormValue(formValues) {
    const values = formValues
    formValues.dataSource = JSON.stringify(values.dataSource)
    return formValues;
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('userPwd')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  save() {
    // super.save()
    let param = getPropsParams(this.props);
    this.props.form.validateFields((errors, values) => {
      let img: any = {};
      if (values.img && window.location.hash.indexOf('#/SynthesizeManage/TrainingInformationList/TrainingInformationEdit') > -1) {
        if (Array.isArray(values.img)) {
          img.name = values.img[0].name;
          img.id = values.img[0].response.entity[0].id;
          values.img = JSON.stringify([img])
        }
      }
      if (!errors) {
        let type = `${this._nameSpace}/add`;
        let payLoad = this.transFormValue(values);
        if (!!param.id) {
          type = `${this._nameSpace}/update`;
          payLoad.id = this.state.orgData.id;
        }

        this.props.dispatch(
          {
            type,
            payLoad,
            callBack: () => {
              window.history.back();
            }
          }
        );
      }
    });
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    let param = getPropsParams(this.props);
    const options = [
      { label: '机构编制', value: '1' },
      { label: '外交', value: '2' },
      { label: '司法行政', value: '3' },
      { label: '文化', value: '4' },
      { label: '民政', value: '5' },
      { label: '旅游', value: '6' },
      { label: '宗教', value: '7' },
      { label: '工会', value: '8' },
      { label: '工商', value: '9' },
      // { label: '工商(企业 )', value: '91' },
      // { label: '工商(个体)', value: '92' },
      { label: '农业', value: 'N' },
      { label: '其他', value: 'Y' },
    ];
    return !!param.id ? [
      {
        label: '所属区划',
        content: getFieldDecorator('divisionCode', { rules: createFormRules(true), initialValue: orgData.divisionCode })(<HSelect>
          {
            createSelectOptions(RegonEnum.ALL_LIST, RegonEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '登录名',
        content: getFieldDecorator('userAccount', { rules: createFormRules(true), initialValue: orgData.userAccount })(<Input disabled={!!orgData.userAccount} />),
      },
      {
        label: '真实姓名',
        content: getFieldDecorator('realName', { rules: createFormRules(true), initialValue: orgData.realName })(<HInput />),
      },
      // {
      //   label: '密码',
      //   content: getFieldDecorator('userPwd', { rules: createFormRules(true), initialValue: orgData.userPwd })(<Input.Password />),
      // },
      // {
      //   label: '重复密码',
      //   content: getFieldDecorator('userPwdAgain', { rules: [
      //     {
      //       required: true,
      //       message: 'Please confirm your password!',
      //     },
      //     {
      //       validator: this.compareToFirstPassword,
      //     },
      //   ], initialValue: orgData.userPwd })(<Input.Password />),
      // },
      // {
      //   label: '邮编',
      //   content: getFieldDecorator('problemCount', { rules: createFormRules(true), initialValue: orgData.problemCount })(<HInput />),
      // },
      // {
      //   label: '邮箱',
      //   content: getFieldDecorator('statisticsDate', { rules: createFormRules(true), initialValue: orgData.statisticsDate })(<Input />),
      // },
      {
        label: '电话',
        content: getFieldDecorator('phone', { rules: createFormRules(true), initialValue: orgData.phone })(<Input />),
      },
      // {
      //   label: '手机',
      //   content: getFieldDecorator('problemCount', { rules: createFormRules(true), initialValue: orgData.problemCount })(<HInput />),
      // },
      // {
      //   label: '传真',
      //   content: getFieldDecorator('statisticsDate', { rules: createFormRules(true), initialValue: orgData.statisticsDate })(<Input />),
      // },
      {
        label: '划分角色',
        content: getFieldDecorator('roleId', { rules: createFormRules(true), initialValue: orgData.roleId })(
          <Select >
            {orgData.roleList && orgData.roleList.map((item) => {
              return (
                <Select.Option key={item.id} value={item.id}>{item.roleName}</Select.Option>
              )
            })}
          </Select>
        ),
      },
      {
        label: '是否锁定该用户',
        content: getFieldDecorator('userStatus', { rules: createFormRules(true), initialValue: orgData.userStatus || '1' })(
          <Radio.Group >
            <Radio value={'1'}>正常</Radio>
            <Radio value={'2'}>锁定</Radio>
          </Radio.Group>
        ),
      },
      {
        label: '数据来源',
        content: getFieldDecorator('dataSource', { rules: createFormRules(true, null, null, null), initialValue: orgData.dataSource ? JSON.parse(orgData.dataSource) : [] })(
          <Checkbox.Group
            options={options}
          />
        ),
      },
      // {
      //   label: '核查错误率',
      //   content: getFieldDecorator('', { rules: createFormRules(true), initialValue: orgData.linkman })(<HInput />),
      // },
    ] : [
        {
          label: '所属区划',
          content: getFieldDecorator('divisionCode', { rules: createFormRules(true), initialValue: orgData.divisionCode })(<HSelect>
            {
              createSelectOptions(RegonEnum.ALL_LIST, RegonEnum.toString)
            }
          </HSelect>),
        },
        {
          label: '登录名',
          content: getFieldDecorator('userAccount', { rules: createFormRules(true), initialValue: orgData.userAccount })(<Input disabled={!!orgData.userAccount} />),
        },
        {
          label: '真实姓名',
          content: getFieldDecorator('realName', { rules: createFormRules(true), initialValue: orgData.realName })(<HInput />),
        },
        {
          label: '密码',
          content: getFieldDecorator('userPwd', { rules: createFormRules(true), initialValue: orgData.userPwd })(<Input.Password />),
        },
        {
          label: '重复密码',
          content: getFieldDecorator('userPwdAgain', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ], initialValue: orgData.userPwd
          })(<Input.Password />),
        },
        // {
        //   label: '邮编',
        //   content: getFieldDecorator('problemCount', { rules: createFormRules(true), initialValue: orgData.problemCount })(<HInput />),
        // },
        // {
        //   label: '邮箱',
        //   content: getFieldDecorator('statisticsDate', { rules: createFormRules(true), initialValue: orgData.statisticsDate })(<Input />),
        // },
        {
          label: '电话',
          content: getFieldDecorator('phone', { rules: createFormRules(true), initialValue: orgData.phone })(<Input />),
        },
        // {
        //   label: '手机',
        //   content: getFieldDecorator('problemCount', { rules: createFormRules(true), initialValue: orgData.problemCount })(<HInput />),
        // },
        // {
        //   label: '传真',
        //   content: getFieldDecorator('statisticsDate', { rules: createFormRules(true), initialValue: orgData.statisticsDate })(<Input />),
        // },
        {
          label: '划分角色',
          content: getFieldDecorator('roleId', { rules: createFormRules(true), initialValue: orgData.roleId })(
            <Select >
              {orgData.roleList && orgData.roleList.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.id}>{item.roleName}</Select.Option>
                )
              })}
            </Select>
          ),
        },
        {
          label: '是否锁定该用户',
          content: getFieldDecorator('userStatus', { rules: createFormRules(true), initialValue: orgData.userStatus || '1' })(
            <Radio.Group >
              <Radio value={'1'}>正常</Radio>
              <Radio value={'2'}>锁定</Radio>
            </Radio.Group>
          ),
        },
        {
          label: '数据来源',
          content: getFieldDecorator('dataSource', { rules: createFormRules(true, null, null, null), initialValue: orgData.dataSource && orgData.dataSource.split(',') })(
            <Checkbox.Group
              options={options}
            />
          ),
        },
        // {
        //   label: '核查错误率',
        //   content: getFieldDecorator('', { rules: createFormRules(true), initialValue: orgData.linkman })(<HInput />),
        // },
      ];
  }

}

export default Form.create()(MemberEdit);