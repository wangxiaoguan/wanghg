import React, { Component } from 'react';
import { createTdItem } from '@/utils/AntdUtil';

interface IDepartInfoTableProps {
  data?: any;
}

const AREA_FEATURE = ['', '固定', '临时', '可移动', '多场所'];
const DEPART_STATUS = ['','正常运行','注销','删除']
const ASSET_CONDITION = ['','自有','租用','合资']

class DepartInfoTable extends Component<IDepartInfoTableProps, any> {
  render() {
    const data = this.props.data || {};
    return (
      <div>
        <table className="InfoTable">
          <thead>
            <tr>
              <th colSpan={8}>检测机构基本信息</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                createTdItem('检测机构名称', data.orgName, 1, 7)
              }
            </tr>
            <tr>
              {
                createTdItem('检测机构地址', `${data.orgAddr || ''}`, 1, 7)
              }
            </tr>
            <tr>
              {
                createTdItem('机构代码', data.orgCode, 1, 7)
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('所属行政区划', data.orgDivide),
                  createTdItem('邮编', data.postCode),
                  createTdItem('传真', data.fax),
                  createTdItem('EMai', data.email)
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('负责人', data.principal),
                  createTdItem('负责人职务', data.principalDuty),
                  createTdItem('负责人电话', data.principalPhone),
                  createTdItem('负责人手机', data.principalTel)
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('联络人', data.contact),
                  createTdItem('联络人职务', data.contactDuty),
                  createTdItem('联络人电话', data.contactPhone),
                  createTdItem('联络人手机', data.contactTel)
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('所属行业', data.industry, 1, 3),
                  createTdItem('级别', data.rank, 1, 3)
                ]
              }
            </tr>
          </tbody>
        </table>
        {/* 法人单位信息 */}
        <table className="InfoTable">
          <thead>
            <tr>
              <th colSpan={6}>所属法人单位信息</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                createTdItem('单位名称', data.unitName, 1, 5)
              }
            </tr>
            <tr>
              {
                createTdItem('单位地址', data.unitAddr, 1, 5)
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('单位邮编', data.unitPostcode),
                  createTdItem('单位传真', data.unitFax),
                  createTdItem('单位Email', data.unitEmail),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('单位负责人', data.unitPrincipal),
                  createTdItem('单位负责人职务', data.unitPrincipalDuty),
                  createTdItem('单位负责人电话', data.unitPrincipalPhone),
                ]
              }
            </tr>
          </tbody>
        </table>

        {/* 主管部门信息 */}
        <table className="InfoTable">
          <thead>
            <tr>
              <th colSpan={6}>主管部门信息</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                createTdItem('部门名称', data.departmentName, 1, 5)
              }
            </tr>
            <tr>
              {
                createTdItem('部门地址', data.departmentAddr, 1, 5)
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('部门邮编', data.departmentPostcode),
                  createTdItem('部门传真', data.departmentFax),
                  createTdItem('部门EMail', data.departmentEmail),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('部门负责人', data.departmentPrincipal),
                  createTdItem('部门负责人职务', data.departmentPrincipalDuty),
                  createTdItem('部门负责人电话', data.departmentPrincipalPhone),
                ]
              }
            </tr>
          </tbody>
        </table>

        {/* 检测机构设施特点 */}
        <table className="InfoTable">
          <thead>
            <tr>
              <th>检测机构设施特点</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{AREA_FEATURE[data.labFeature]}</td>
            </tr>
          </tbody>
        </table>
        {/* 法人类别 */}
        <table className="InfoTable">
          <thead>
            <tr>
              <th colSpan={4}>法人类别</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                [
                  createTdItem('独立法人检测机构', ['', '社团法人', '事业法人', '企业法人', '其他'][data.legalLab]),
                  createTdItem('检测机构所属法人', ['', '社团法人', '事业法人', '企业法人', '其他'][data.labBelongTo]),
                ]
              }
            </tr>
          </tbody>
        </table>
        <table className="InfoTable">
          <thead>
            <tr>
              <th colSpan={4}>检测机构资源</th>
            </tr>
          </thead>
          <tbody>
            {/* 检测机构资源 */}
            <tr>
              <th colSpan={4}>检测机构总数情况</th>
            </tr>
            <tr>
              {
                [
                  createTdItem('总人数', data.total),
                  createTdItem('管理人员', data.manager),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('技术检测人员', data.technologyPerson),
                  createTdItem('研究生以上学历', data.graduateStudent),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('大学本科', data.regularCollegeCourse),
                  createTdItem('专科及以下学历', data.juniorCollege),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('高级专业技术职称人数', data.advanced),
                  createTdItem('高级专业技术职称占比', data.advancedPercent),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('中级专业技术职称人数', data.intermediate),
                  createTdItem('中级专业技术职称占比', data.intermediatePercent),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('初级专业技术职称人数', data.primaryCount),
                  createTdItem('初级专业技术职称占比', data.primaryPercent),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('其他人员人数', data.other),
                  createTdItem('其他人员占比', data.otherPercent),
                ]
              }
            </tr>
            <tr>
              <th colSpan={4}>固定资产情况</th>
            </tr>
            <tr>
              {
                createTdItem('固定资产原有值', data.fixedAssets, 1, 3)
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('仪器设备总数', data.equipmentSum),
                  createTdItem('进口仪器设备', data.entranceNum),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('产权状况', ASSET_CONDITION[parseInt(data.assetCondition)]),
                  createTdItem('产权状况占有比率', data.assetConditionPercent),
                ]
              }
            </tr>
            <tr>
              <th colSpan={4}>其他信息</th>
            </tr>
            <tr>
              {
                [
                  createTdItem('检测机构总面积', data.totalArea),
                  createTdItem('检验室面积', data.examRoomArea),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('温恒面积', data.thermostatRoom),
                  createTdItem('户外检验场地面积', data.outExamFloorSpace),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('报告数量', data.reportCount),
                  createTdItem('检测机构状态', DEPART_STATUS[parseInt(data.status)]),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('申请通过时间', data.applyForTime),
                  createTdItem('最后更新时间', data.endTime),
                ]
              }
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default DepartInfoTable;