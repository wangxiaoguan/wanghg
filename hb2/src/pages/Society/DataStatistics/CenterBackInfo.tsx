import React, { Component } from 'react';
import { Card, Button, Modal, Spin } from 'antd';
import { createTdItem } from '@/utils/AntdUtil';

class CenterBackInfo extends Component<any, any> {
  constructor(props) {
    super(props);
  }

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
          <Card
            title={
              <span>
                <span>中心返回问题数据</span>
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
                    createTdItem('接收时间', `${data.dataTime || '---'}`),
                    createTdItem('统一社会信用代码', `${data.tyshxydm || '---'}`),
                    createTdItem('机构名称', `${data.jgmc || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('组织机构代码', `${data.jgdm || '---'}`),
                    createTdItem('业务类型', `${data.ywlx || '---'}`),
                    createTdItem('注册号', `${data.zch || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('问题标记', `${data.dflag || '---'}`),
                    createTdItem('发证机构编号', `${data.dptcode || '---'}`),
                    createTdItem('问题大类', `${data.eflag || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('问题小类', `${data.enums || '---'}`),
                    createTdItem('大类问题描述', `${data.emsg || '---'}`),
                    createTdItem('小类问题描述', `${data.nummsg || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('二次校核步骤', `${data.fstep || '---'}`),
                    createTdItem('二次校和标记', `${data.ftwo || '---'}`),
                    createTdItem('核准日期', `${data.hzrq || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('接收日期', `${data.inputdate || '---'}`),
                    createTdItem('人工审核标记', `${data.isperson || '---'}`),
                    createTdItem('经营期限起', `${data.jyqxs || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('原机构', `${data.oarch_id || '---'}`),
                    createTdItem('原业务类型', `${data.oarchkind_id || '---'}`),
                    createTdItem('原机构代码', `${data.ojgdm || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('原机构名称', `${data.ojgmc || '---'}`),
                    createTdItem('原统一社会信用代码', `${data.otyshxydm || '---'}`),
                    createTdItem('原注册号', `${data.ozch || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('赋码行政区划', `${data.pcenterid || '---'}`),
                    createTdItem('', ``),
                    createTdItem('', ``),
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

export default CenterBackInfo;
