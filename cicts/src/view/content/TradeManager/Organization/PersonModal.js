import React, { Component } from 'react';
import { Modal, Button, message } from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { getService, postService } from '../../myFetch';
import API_PREFIX from '../../apiprefix';

class PersonModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            selectedRowKeys: [],
        };
        this.postid = ""
        // console.log(2234)
        // this.selectedRowKeys
    }

    initProps(props, inited = true) {
        if (props.wrappedRef) {
            props.wrappedRef(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.initProps(nextProps, true);
    }

    show(postid) {
        this.setState({ visible: true });
        this.postid = postid
    }

    close = () => {
        this.setState({ visible: false });
    }

    afterChangedData(res) {
        if (res.status === 1) {
            this.close()
            this.props.successCallback && this.props.successCallback()
        } else {
            message.error(res.retMsg);
        }
    }

    addPerson = () => {
        const list = this.state.selectedRowKeys
        let values = []
       console.log("list==>",list)
        postService(
            API_PREFIX + `services/web/union/org/insertOrgPost`,
            list.map((user) => { return { unionUserId: user.id, unionId: this.props.orgId, postId: this.postid } }),
            (res) => { this.afterChangedData(res) });
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    render() {
        const columns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                width: 100,
            },
            {
                title: '员工号',
                dataIndex: 'userNo',
                key: 'userNo',
                width: 150,
            },
            {
                title: '所属工会组织',
                dataIndex: 'fullName',
                key: 'fullName',
                //width:100,
            },
            {
                title: '职务',
                dataIndex: 'postName',
                key: 'postName',
                width: 100,
            },
        ];
        const search = [
            {
                key: 'name',
                label: '姓名',
                qFilter: 'Q=name',
                type: 'input',
            },
        ];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <Modal
                visible={this.state.visible}
                width="50%"
                onCancel={this.close}
                onOk={this.addPerson}
                title={"选择人员"}
                destroyOnClose
            >
                <TableAndSearch
                    columns={columns}
                    search={search}
                    // rowSelection={rowSelection}
                    getSelectRow={this.onSelectChange}
                    url={'services/web/union/user/getList'}
                    urlfilter={'Q=union_id=' + `${this.props.orgId}`}
                />
            </Modal>
        )
    }
}

export default PersonModal