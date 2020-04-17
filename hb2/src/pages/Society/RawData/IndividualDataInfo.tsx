import React, { Component } from 'react';
import { Card, Modal, Button, Spin } from 'antd';
import { createTdItem } from '@/utils/AntdUtil';

class IndividualDataInfo extends Component<any, any> {
  render() {
    const { data = {}, loading } = this.props;
    return (
      <Modal
        visible={this.props.visible}
        onCancel={this.props.clearModal}
        style={{ minWidth: '1280px' }}
        footer={[
          <Button key="back" onClick={this.props.clearModal}>
            关闭
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <Card title={<span>工商个体数据</span>}>
            <table className="InfoTable">
              <thead>
                <tr>
                  <th colSpan={6}>机构详情</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {[
                    createTdItem('统一社会信用代码', `${data.uniscid || '---'}`),
                    createTdItem('机构名称', `${data.traname || '---'}`),
                    createTdItem('法定代表人', `${data.name || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('类型', `${data.enttype || '---'}`),
                    createTdItem('组织形式', `${this.getCompform(data.compform) || '---'}`),
                    createTdItem('经营场所地址', `${data.oploc || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('注册号', `${data.zch || '---'}`),
                    createTdItem('经营范围', `${data.opscope || '---'}`),
                    createTdItem('业务类型', `${data.ywlxName || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('核准日期', `${data.apprdate || '---'}`),
                    createTdItem('登记机关', `${data.regorg || '---'}`),
                    createTdItem('上报标记', `${data.dflag === 0 ? '未上报' : '已上报'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('数据更新时间', `${data.updatetime || '---'}`),
                    createTdItem('数据接收时间', `${data.dataTime || '---'}`),
                    createTdItem('---', `${data.x || '---'}`),
                  ]}
                </tr>
              </tbody>
            </table>
          </Card>
        </Spin>
      </Modal>
    );
  }

  private getCompform(type: string) {
    switch (type) {
      case '1':
        return '个人经营';
      case '2':
        return '家庭经营';
      default:
        return '未知';
    }
  }
}

export default IndividualDataInfo;
