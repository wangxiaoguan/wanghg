import React, { Component } from 'react';
import { Card, Button, message } from 'antd';
import { createTdItem } from '@/utils/AntdUtil';
import BackButton from '@/components/BackButton';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import { getPropsParams } from '@/utils/SystemUtil';
import SexEnum from '@/Enums/SexEnum';
import BusinessTypeEnum from '@/Enums/BusinessTypeEnum';
import CheckModal from './CheckModal';
import ProfessionalTitleEnum from '@/Enums/ProfessionalTitleEnum'

@connect(({ loading }) => (
  {
    loading
  }
))
class DepartCheckUserInfo extends Component<IDispatchInterface, any> {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      status: '1',

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
          type: 'DepartCheckUser/search',
          payLoad: params.id,
          callBack: (res) => {
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
        type: 'DepartCheckUser/updateCheckStatus',
        payLoad: params,
        callBack: () => {
          window.history.back()
        }
      }
    );
  }

  private modal: CheckModal;

  render() {
    const data = this.state.data || {};
    return (
      <Card title='检测机构人员详情'>
        <table className="InfoTable">
          <thead>
            <tr><th colSpan={2}>检测机构人员详情</th></tr>
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
                createTdItem('姓名', data.name)
              }
            </tr>
            <tr>
              {
                createTdItem('性别', SexEnum.toString(data.sex))
              }
            </tr>
            <tr>
              {
                createTdItem('年龄', data.age)
              }
            </tr>
            <tr>
              {
                createTdItem('职称', ProfessionalTitleEnum.toString(data.title))
              }
            </tr>
            <tr>
              {
                createTdItem('所学专业', data.major)
              }
            </tr>
            <tr>
              {
                createTdItem('从事技术领域年限', data.majorAge)
              }
            </tr>
            <tr>
              {
                createTdItem('现在部门岗位', data.station)
              }
            </tr>
            <tr>
              {
                createTdItem('本岗位年限', data.stationAge)
              }
            </tr>
            <tr>
              {
                createTdItem('备注', data.remark)
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

export default DepartCheckUserInfo;