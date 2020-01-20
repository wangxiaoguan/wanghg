import React, { Component } from 'react';
import { Card, Button, Modal, Spin } from 'antd';
import { createTdItem } from '@/utils/AntdUtil';

class EnterpriseDataInfo extends Component<any, any> {
  render() {
    const { data = {}, loading } = this.props;
    return (
      <Modal
        visible={this.props.visible}
        onCancel={this.props.clearModal}
        style={{ minWidth: '1280px' }}
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={this.props.clearModal}>
            关闭
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <Card
            title={
              <span>
                <span>工商企业数据</span>
              </span>
            }
          >
            <table className="InfoTable">
              <thead>
                <tr>
                  <th colSpan={6}>机构详情</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {[
                    createTdItem('统一社会信用代码', `${data.decTyshxydm || '---'}`),
                    createTdItem('机构名称', `${data.decDwmc || '---'}`),
                    createTdItem('国别(地区)', `${data.gjName || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('企业类型', `${data.qylxName || '---'}`),
                    createTdItem('行业代码', `${data.decHydm || '---'}/${data.hydmName || ''}`),
                    createTdItem('注册号', `${data.decYyzzzch || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('经营范围', `${data.decJyfw || '---'}`),
                    createTdItem('注册资本', `${data.decZczb || '---'}`),
                    createTdItem('币种', `${data.bzName || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('成立日期', `${data.decClrq || '---'}`),
                    createTdItem('经营期限起', `${data.decYyqxz || '---'}`),
                    createTdItem('经营期限至', `${data.decYyqxzto || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('法定代表人', `${data.decFddbrhfzr || '---'}`),
                    createTdItem('证件类型(法人)', `${data.frZjlxName || '---'}`),
                    createTdItem('证件号码(法人)', `${data.decFrzjhm || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('固定电话(法人)', `${data.decFrgddh || '---'}`),
                    createTdItem('移动电话(法人)', `${data.decFrsjdh || '---'}`),
                    createTdItem('电子邮箱(法人)', `${data.decFrdzyx || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('所属区域', `${data.decGxqy || '---'}`),
                    createTdItem('经营状态', `${data.jyztName || '---'}`),
                    createTdItem('生产经营地', `${data.decScjyd || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('生产经营地所在行政区划', `${data.decScjydszxzqh || '---'}`),
                    createTdItem('邮政编码', `${data.decYzbm || '---'}`),
                    createTdItem('姓名(财务负责人)', `${data.decCwxm || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('证件类型(财务负责人)', `${data.cwZjlxName || '---'}`),
                    createTdItem('证件号码(财务负责人)', `${data.decCwzjhm || '---'}`),
                    createTdItem('固定电话(财务负责人)', `${data.decCwgddh || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('移动电话(财务负责人)', `${data.decCwyddh || '---'}`),
                    createTdItem('电子邮箱(财务负责人)', `${data.decCwdzyx || '---'}`),
                    createTdItem('姓名(联络员)', `${data.decLxr || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('证件类型(联络员)', `${data.llrZjlxName || '---'}`),
                    createTdItem('证件号码(联络员)', `${data.decLlrzjhm || '---'}`),
                    createTdItem('固定电话(联络员)', `${data.decDwdh || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('移动电话(联络员)', `${data.decLxrdh || '---'}`),
                    createTdItem('电子邮箱(联络员)', `${data.decLlrdzyx || '---'}`),
                    createTdItem('业务类型', `${data.ywlxName || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('核准日期', `${data.decHzrq || '---'}`),
                    createTdItem('登记机关', `${data.decDjjg || '---'}`),
                    createTdItem('上报标记', `${data.dflag === 0 ? '未上报' : '已上报'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('数据更新时间', `${data.decZhxgsj || '---'}`),
                    createTdItem('数据接收时间', `${data.dataTime || '---'}`),
                    createTdItem('', `${data.x || '---'}`),
                  ]}
                </tr>
              </tbody>
            </table>
          </Card>
        </Spin>
      </Modal>
    );
  }
}

export default EnterpriseDataInfo;
