import React, { Component } from 'react';
import { Card, Col, Row, Button } from 'antd';
import { getPropsParams } from '@/utils/SystemUtil';
import { connect } from 'dva';
// import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import { createSearchString } from '@/utils/SystemUtil';
import BackButton from '@/components/BackButton';
// import { orgId } from '@/utils/SystemUtil'

// import SEX_ENUM from '@/Enums/SexEnum'

/**
 * 基本信息维护记录
 */

//基本信息
const BaseInfo = [
  { key: 'orgName', value: '', optionName: '检测机构名称' },
  { key: 'orgAddr', value: '', optionName: '检测机构地址' },
  { key: 'orgCode', value: '', optionName: '机构代码' },
  { key: 'orgDivide', value: '', optionName: '所属行政区域' },
  { key: 'postCode', value: '', optionName: '邮编' },
  { key: 'fax', value: '', optionName: '传真' },
  { key: 'email', value: '', optionName: 'Email' },
  { key: 'principal', value: '', optionName: '负责人' },
  { key: 'principalDuty', value: '', optionName: '负责人职务' },
  { key: 'principalTel', value: '', optionName: '负责人电话' },
  { key: 'principalPhone', value: '', optionName: '负责人手机' },
  { key: 'contact', value: '', optionName: '联络人' },
  { key: 'contactDuty', value: '', optionName: '联络人职务' },
  { key: 'contactTel', value: '', optionName: '联络人电话' },
  { key: 'contactPhone', value: '', optionName: '联络人手机' },
  { key: 'industry', value: '', optionName: '所属行业' },
  { key: 'rank', value: '', optionName: '机构级别' },
]
//单位信息
const UintInfo = [
  { key: 'unitName', value: '', optionName: '单位名称' },
  { key: 'unitAddr', value: '', optionName: '单位地址' },
  { key: 'unitDivide', value: '', optionName: '所属行政区域' },
  { key: 'unitPostcode', value: '', optionName: '单位邮编' },
  { key: 'unitFax', value: '', optionName: '单位传真' },
  { key: 'unitEmail', value: '', optionName: '单位EMail' },
  { key: 'unitPrincipal', value: '', optionName: '单位负责人' },
  { key: 'unitPrincipalDuty', value: '', optionName: '负责人职务' },
  { key: 'unitPrincipalPhone', value: '', optionName: '负责人电话' },
]
//部门信息
const DepartmentInfo = [
  { key: 'departmentName', value: '', optionName: '部门名称' },
  { key: 'departmentAddr', value: '', optionName: '部门地址' },
  { key: 'departmentDivide', value: '', optionName: '所属行政区域' },
  { key: 'departmentPostcode', value: '', optionName: '部门邮编' },
  { key: 'departmentFax', value: '', optionName: '部门传真' },
  { key: 'departmentEmail', value: '', optionName: '部门EMail' },
  { key: 'departmentPrincipal', value: '', optionName: '部门负责人' },
  { key: 'departmentPrincipalDuty', value: '', optionName: '负责人职务' },
  { key: 'departmentPrincipalPhone', value: '', optionName: '负责人电话' },
]

//检测机构info
const OrgInfo = [
  { key: 'labFeature', value: '', optionName: '检测机构设施特点' },
  { key: 'legalLab', value: '', optionName: '检测机构独立法人' },
  { key: 'labBelongTo', value: '', optionName: '检测机构所属法人' },
]

const orgSourceInfo = [
  { key: 'total', value: '', optionName: '总人数' },
  { key: 'manager', value: '', optionName: '管理人员' },
  { key: 'advanced', value: '', optionName: '高级专业技术职称人数' },
  { key: 'advancedPercent', value: '', optionName: '高级专业技术职称占比' },
  { key: 'intermediate', value: '', optionName: '中级专业技术职称人数' },
  { key: 'intermediatePercent', value: '', optionName: '中级专业技术职称占比' },
  { key: 'primaryCount', value: '', optionName: '初级专业技术职称人数' },
  { key: 'primaryPercent', value: '', optionName: '初级专业技术职称占比' },
  { key: 'otherNumber', value: '', optionName: '其他人员人数' },
  { key: 'otherPercent', value: '', optionName: '其他人员占比' },
  { key: 'graduateStudent', value: '', optionName: '研究生以上学历' },
  { key: 'regularCollegeCourse', value: '', optionName: '大学本科' },
  { key: 'juniorCollege', value: '', optionName: '专科及以下学历' },
  { key: 'fixedAssets', value: '', optionName: '固定资产原有值' },
  { key: 'equipmentSum', value: '', optionName: '仪器设备总数' },
  { key: 'entranceNum', value: '', optionName: '进口仪器设备' },
  { key: 'assetCondition', value: '', optionName: '产权状况' },
  { key: 'assetConditionPercent', value: '', optionName: '产权状况占有比例' },
]

const otherInfo = [
  { key: 'totalArea', value: '', optionName: '检测机构总面积' },
  { key: 'examRoomArea', value: '', optionName: '检测室面积' },
  { key: 'thermostatRoom', value: '', optionName: '温恒面积' },
  { key: 'outExamFloorSpace', value: '', optionName: '户外检验场地面积' },
  { key: 'reportNum', value: '', optionName: '报告数量' },
  { key: 'applyForTime', value: '', optionName: '申请通过时间' },
  { key: 'endTime', value: '', optionName: '最后更新时间' },
  { key: 'status', value: '', optionName: '检测机构状态' },
  { key: 'checkStatus', value: '', optionName: '审核状态' },
  { key: 'reason', value: '', optionName: '理由' },
]

@connect(({ loading }) => ({ loading }))
class BaseInfoDetail extends Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      baseInfoData: {},
    };
  }

  componentDidMount() {
    this.requestData()
  }

  private requestData = () => {
    let id = getPropsParams(this.props).id;
    if (id) {
      this.props.dispatch({
        type: 'UserBackStage_BaseInfo/logSearch',
        payLoad: this.props.match.params.id,
        callBack: (res) => {
          this.setState({ baseInfoData: res.data || {} });
        }
      })
    }
  }

  render() {
    const { baseInfoData } = this.state

    const Item = ({ optionName, value }) => (
      <Col sm={24} lg={12} style={{ margin: '10px 0' }}>
        <h4 style={{ display: 'inline' }}>{optionName}</h4>&nbsp;:&nbsp;&nbsp;<span>{value}</span>
      </Col>
    )

    const show = (item) => {
      let value = baseInfoData[item.key]
      // if (item.key === 'userSex') {
      //   value = SEX_ENUM.toString(consumerProductData[item.key])
      // }
      return { ...item, value }
    }

    return (
      <div>
        <Card title={'联系人信息'}>
          <Row>
            {BaseInfo.map((item) => <Item {...show(item)} />)}
          </Row>
        </Card>
        <Card title={'使用者信息'}>
          <Row>
            {UintInfo.map((item) => <Item {...show(item)} />)}
          </Row>
        </Card>
        <Card title={'产品信息'}>
          <Row>
            {DepartmentInfo.map((item) => <Item {...show(item)} />)}
          </Row>
        </Card>
        <Card title={'类别及特点'}>
          <Row>
            {OrgInfo.map((item) => <Item {...show(item)} />)}
          </Row>
        </Card>
        <Card title={'检测机构资源信息'}>
          <Row>
            {orgSourceInfo.map((item) => <Item {...show(item)} />)}
          </Row>
        </Card>
        <Card title={'其他信息'}>
          <Row>
            {otherInfo.map((item) => <Item {...show(item)} />)}
          </Row>
        </Card>
        <div className="divAreaContainer controlsContainer">
          <BackButton />
        </div>
      </div>
    );
  }
}

export default BaseInfoDetail;