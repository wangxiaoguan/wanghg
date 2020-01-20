import React, { Component } from 'react';
import { Card, Button, message, Modal, Input } from 'antd';
import { createTdItem } from '@/utils/AntdUtil';
import BackButton from '@/components/BackButton';
import { getPropsParams } from '@/utils/SystemUtil';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import { connect } from 'dva';
import BusinessTypeEnum from '@/Enums/BusinessTypeEnum';
import CheckModal from './CheckModal';

// import SexEnum from '@/Enums/SexEnum';
import SexEnum from '@/Enums/SexEnum';
import EducationDegreeEnum from '@/Enums/EducationDegreeEnum';
import moment from 'moment'

@connect(({ loading }) => (
  {
    // loading
  }
))
class AuhorizedSignatureInfo extends Component<IDispatchInterface, any> {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      status: '1',
      visable:false,
      checkReason:'',
      modalType:'0',
    }
  }


  componentDidMount() {
    this.requestData();
  }

  requestData() {
    const params = getPropsParams(this.props);
    if (params.id) {
      this.props.dispatch(
        {
          type: 'AuhorizedSignature/search',
          payLoad: params.id,
          callBack: (res) => {
            if (!res.data) { return }
            this.setState({ data: res.data });
          }
        }
      );
    }
  }

  onOk = (comments) => {
    if (!comments || comments.length === 0) {
      message.error('请填写审核意见')
      return
    }
    const payLoad = {
      id: getPropsParams(this.props).id,
      checkStatus: this.state.status,
      comments
    }
    this.update(payLoad);
  }

  update = (payLoad) => {
    const params = `${payLoad.id}/${payLoad.checkStatus}/${payLoad.comments}`
    this.props.dispatch(
      {
        type: 'AuhorizedSignature/updateCheckStatus',
        payLoad: params,
        callBack: () => {
          window.history.back()
        }
      }
    );
  }

  private modal: CheckModal;
  showYesOrNo =(text) => text === '1' ? '是':'否'

  render() {
    const data = this.state.data || {};
    return (
      <Card title="授权人签字审核">
        <table className="InfoTable">
          <thead>
            <tr>
              <th colSpan={2}>授权人签字详情</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                createTdItem('业务类型', BusinessTypeEnum.toString(data.businessType))
              }
            </tr>
            <tr>
              {
                createTdItem('检测机构名称', data.orgName)
              }
            </tr>
            <tr>
              {
                createTdItem('授权签字人姓名', data.signatioyName)
              }
            </tr>
            <tr>
              {
                createTdItem('性别', SexEnum.toString(data.sex))
              }
            </tr>
            <tr>
              {
                createTdItem('出生年月', moment(data.birth).format('YYYY-MM-DD'))
              }
            </tr>
            <tr>
              {
                createTdItem('职务', data.duty)
              }
            </tr>
            <tr>
              {
                createTdItem('职称', data.title)
              }
            </tr>
            <tr>
              {
                createTdItem('文化程度', EducationDegreeEnum.toString(data.eduDegree))
              }
            </tr>
            <tr>
              {
                createTdItem('毕业院校及专业', data.graduateSchool)
              }
            </tr>
            <tr>
              {
                createTdItem('授权签字人领域', data.authorizedOfficer)
              }
            </tr>
          </tbody>
        </table>
        <table className="InfoTable">
          <thead>
            <tr>
              <th colSpan={4}>评价情况</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                [
                  createTdItem('是否具备相应的工作经历', this.showYesOrNo(data.isExperienced)),
                  createTdItem('是否具备相应的职责权利', this.showYesOrNo(data.isHaveDuty))
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('是否熟悉或掌握检测技术及实验室体系管理程序', this.showYesOrNo(data.isGraspDetecting)),
                  createTdItem('是否熟悉或掌握所承担签字领域的相应技术标准方法', this.showYesOrNo(data.isStanmethod))
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('是否熟悉检测报告审核签发程序', this.showYesOrNo(data.isAudit)),
                  createTdItem('是否对检测结果做出相应评价的判断能力', this.showYesOrNo(data.isJudgmenTability))
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('是否熟悉《实验室资质认定评审准则》、《食品检验机构资质认定评审准则》及其相关法律法规要求', this.showYesOrNo(data.isLawregulat)),
                  createTdItem('', '')
                ]
              }
            </tr>
          </tbody>
        </table>
        <div className="divAreaContainer controlsContainer">
          <Button type="primary" onClick={() => {
            this.setState({ status: '1' }, () => {
              this.modal.show()
            })
          }}>审核通过</Button>
          <Button type="primary" onClick={() => {
            this.setState({ status: '2' }, () => {
              this.modal.show()
            })
          }}>审核不通过</Button>
          <BackButton />
        </div>
        <CheckModal getInstance={(target) => this.modal = target} onOk={this.onOk} />
      </Card>
    );
  }
}

export default AuhorizedSignatureInfo;