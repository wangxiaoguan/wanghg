import React, { Component } from 'react';
import { Card, Button, Modal, Spin } from 'antd';
import { createTdItem } from '@/utils/AntdUtil';
import DepartStatusEnum from '@/Enums/DepartStatusEnum';

class CivilDataLocalInfo extends Component<any, any> {

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
          <Card title={<span>民政数据(本地)</span>}>
            <table className="InfoTable">
              <thead>
                <tr>
                  <th colSpan={6}>机构详情</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {[
                    createTdItem('统一社会信用代码', `${data.aaae0027 || '---'}`),
                    createTdItem('机构名称', `${data.aaae0002 || '---'}`),
                    createTdItem('法人姓名', `${data.aaae0008 || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('法人身份证号码', `${data.aaae0009 || '---'}`),
                    createTdItem('成立日期', `${data.aaax0019 || '---'}`),
                    createTdItem('开办资金', `${data.aaax0011 || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('行业类别', `${data.hylbName || '---'}`),
                    createTdItem('业务范围', `${data.aaax0018 || '---'}`),
                    createTdItem('住所', `${data.aaae0015 || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('登记证号', `${data.aaax0007 || '---'}`),
                    createTdItem('有效期起始日期', `${data.aaax0028 || '---'}`),
                    createTdItem('有效截止日期', `${data.aaax0029 || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('业务主管机构名称', `${data.aaae0004 || '---'}`),
                    createTdItem('联系人姓名', `${data.aaax0020 || '---'}`),
                    createTdItem('联系人电话号码', `${data.aaae0021 || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('最新登记日期', `${data.aaax0031 || '---'}`),
                    createTdItem(
                      '机构状态',
                      `${data.aaax0032 ? DepartStatusEnum.toString(data.aaax0032) : '---'}`
                    ),
                    createTdItem('发证机关', `${data.aaae0003 || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('登记机关', `${data.djjgName || '---'}`),
                    createTdItem('社会组织编号', `${data.axxx0001 || '---'}`),
                    createTdItem('更新时间', `${data.modifyDate || '---'}`),
                  ]}
                </tr>
                <tr>
                  {[
                    createTdItem('数据接收时间', `${data.dataTime || '---'}`),
                    createTdItem('---', `${data.x || '---'}`),
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
}

export default CivilDataLocalInfo;
