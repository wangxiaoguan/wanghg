import React, { Component } from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';

import TableAndSearch from '../../../component/table/TableAndSearch';

import API_PREFIX from '../../apiprefix';
import { getService, arrayForCascade } from '../../myFetch';

// partyOrgState    "0",则默认只取出正在使用的公会组织
//                  "1" 则取出所有的公会组织
const partyOrgState = 0;

@connect(
    state => ({ powers: state.powers })
)

export default class CommonBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organizations: [], //树状工会组织数据
        };
    }

    componentDidMount() {
        //请求树状工会组织结构数据
        getService(`${API_PREFIX}services/web/union/org/getUnionOrgList/${partyOrgState}`, (data) => {
            if (data.status == 1) {//success
                const organizations = arrayForCascade(data.root.object, 'id', 'name', 'unionOrgList');
                this.setState({
                    organizations,
                });
            } else {
                message.error(data.errorMsg);
            }
        });
    }
    render() {
        //console.log('this.props', this.props);
        const { powers = {} } = this.props;
        const { organizations } = this.state;
        const statuOption = [
            {key: '', value: '全部'},
            {key: '1', value: '已回复'},
            {key: '0', value: '未回复'},
        ];
        const search = [
            {
                key: 'applyUserName',
                label: '用户姓名:',
                qFilter: 'Q=applyUserName',
                type: 'input',
            },
            {
                key: 'applyUserNo',
                label: '员工号:',
                qFilter: 'Q=applyUserNo',
                type: 'input',
            },
            {
                key: 'unionTreePath',
                label: '所属工会:',
                qFilter: 'Q=unionTreePath',
                type: 'cascader',
                option: organizations,
            },
            {
                key: 'replyStatus',
                label: '状态:',
                qFilter: 'Q=replyStatus',
                type: 'select',
                option: statuOption,
            },
            {
                key: 'startTime',
                label: '创建时间:',
                qFilter: 'Q=startTime',
                type: 'rangePicker',
            },
        ];
        const columns = [
            {
                title: '用户姓名',
                dataIndex: 'applyUserName',
                key: 'applyUserName',
            },
            {
                title: '员工号',
                dataIndex: 'applyUserNo',
                key: 'applyUserNo',
            },
            {
                title: '所属工会',
                dataIndex: 'unionName',
                key: 'unionName',
            },
            {
                title: '内容',
                dataIndex: 'applyContent',
                key: 'applyContent',
                render: (text, record) => {
                    if(record.applyContent && record.applyContent.length > 30) {
                        return `${record.applyContent.substr(0, 30)}...`
                    }else {
                        return record.applyContent
                    }
                }
            },
            {
                title: '状态',
                dataIndex: 'replyStatus',
                key: 'replyStatus',
                render: (text, record) => {
                    if(record.replyStatus == '1') {
                        return '已回复';
                    }else {
                        return '未回复';
                    }
                },
            },
            {
                title: '回复内容',
                dataIndex: 'replyContent',
                key: 'replyContent',
                render: (text, record) => {
                    if(record.replyContent && record.replyContent.length > 30) {
                        return `${record.replyContent.substr(0, 30)}...`
                    }else {
                        return record.replyContent
                    }
                }
            },
            {
                title: '处理人',
                dataIndex: 'replyUserName',
                key: 'replyUserName',
            },
            {
                title: '创建时间',
                dataIndex: 'createDate',
                key: 'createDate',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render(text, record) {
                    return (
                        <a onClick={() => {
                            location.hash = `/TradeManager/ChairmanBox/CommonBox/Detail?id=${record.id}&type=ChairCommon`;
                        }}>查看详情</a>
                    );
                },
            },
        ];
        const showExport = powers['20007.21703.202'];//导出
        const exportBtnProps = {
            order: 3,
            url: 'services/web/union/chairman/common/export',
            type: '主席信箱普通信件',
        };
        return (
            <div>
                <TableAndSearch
                    search={search}
                    url={'services/web/union/chairman/common/getList'}
                    columns={columns}
                    exportBtn={showExport ? {exportBtnProps,type:'tradeLetter'} : null}
                    rowkey={'id'}
                />
            </div>
        );
    }
}
