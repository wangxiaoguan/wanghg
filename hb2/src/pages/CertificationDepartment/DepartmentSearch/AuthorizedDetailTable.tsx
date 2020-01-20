import React, { Component } from 'react';
import { createTdItem } from '@/utils/AntdUtil';
import EducationDegreeEnum from '@/Enums/EducationDegreeEnum';


interface IAuthorizedTableProps {
  data?: any;
}

class AuthorizedDetailTable extends Component<IAuthorizedTableProps, any> {
  render() {
    const data = this.props.data || {};

    const showYesOrNo = text => text === '1' ? '是' : '否'
    const showSex = text => '1' ? '男' : '女'
 
    return (
      <div>
        <table className="InfoTable">
          <thead>
            <tr>
              <th colSpan={8}>基本信息</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {createTdItem('检测机构名称', data.orgName, 1, 7)}
            </tr>
            <tr>
              {createTdItem('授权签字人姓名', data.signatioyName, 1, 7)}
            </tr>
            <tr>
              {createTdItem('性别', showSex(data.sex), 1, 7)}
            </tr>
            <tr>
              {createTdItem('出生年月', data.birth, 1, 7)}
            </tr>
            <tr>
              {createTdItem('职务', data.duty, 1, 7)}
            </tr>
            <tr>
              {createTdItem('职称', data.title, 1, 7)}
            </tr>
            <tr>
              {createTdItem('文化程度', EducationDegreeEnum.toString(data.eduDegree), 1, 7)}
            </tr>
            <tr>
              {createTdItem('毕业院校及专业', data.graduateSchool, 1, 7)}
            </tr>
            <tr>
              {createTdItem('授权签字人领域', data.authorizedOfficer, 1, 7)}
            </tr>
          </tbody>
        </table>
      
        <table className="InfoTable">
          <thead>
            <tr>
              <th colSpan={8}>评价情况</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {createTdItem('是否具备相应工作经历', showYesOrNo(data.isExperienced), 1, 7)}
            </tr>
            <tr>
              {createTdItem('具备相应的职责权利', showYesOrNo(data.isHaveDuty), 1, 7)}
            </tr>
            <tr>
              {createTdItem('熟悉或掌握检测技术及实验室体系管理程序', showYesOrNo(data.isGraspDetecting), 1, 7)}
            </tr>
            <tr>
              {createTdItem('熟悉或掌握所承担签字领域的相应技术标准方法', showYesOrNo(data.isStanmethod), 1, 7)}
            </tr>
            <tr>
              {createTdItem('熟悉检测报告审核签发程序', showYesOrNo(data.isAudit), 1, 7)}
            </tr>
            <tr>
              {createTdItem('对检测结果做出相应评价的判断能力', showYesOrNo(data.isJudgmenTability), 1, 7)}
            </tr>
            <tr>
              {createTdItem('熟悉《实验室资质认定评审准则》、《食品检测机构资质认定评审准则》及其相关法律法规要求', showYesOrNo(data.isLawregulat), 1, 7)}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default AuthorizedDetailTable;