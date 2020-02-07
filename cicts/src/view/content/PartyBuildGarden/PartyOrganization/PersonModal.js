import React, { Component } from 'react';
import { Modal, Button, message } from 'antd';
import TableAndSearch from './TableAndSearch';
import { getService, postService } from '../../myFetch';
import API_PREFIX from '../../apiprefix';

class PersonModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            selectedRowKeys: [],
            userData: [],
            dutieCounts: {},
            selectedKeys: []
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

    show(postid, userData) {
        this.setState({ visible: true });
        this.postid = postid
        this.setState({userData})
    }

    close = () => {
        this.setState({ visible: false });
    }

    addPerson = () => {
        const list = this.state.selectedRowKeys
        if(list.length == 0) {
            message.error('请选择人员')
            return
        }
        const arr = this.state.selectedKeys
        let userData = this.state.userData
        // let addMum = []
        // list.forEach(item => {
        //   addMum.push({dutieId:this.postid, userId: item.userId, partyId: this.props.orgId})
        // })
        // postService( API_PREFIX + `services/system/partyOrganization/addMemPost`, addMum, data => {
        //   console.log('------------', data)
        // });
        let dutieCounts = this.props.dutieCounts
        for(var i = 0; i < list.length; i++) {
            let item = list[i]
            let num = 0
            userData.forEach(v => {
                if(v.userId == item.userId) {
                    num++
                }
            })
            if(!num) {
                if(dutieCounts[item.userId] == undefined) {
                    if(item.duties >= 5) {
                        message.error(`${item.memName} 添加的职务大于5个了`)
                        return
                    }
                    dutieCounts[item.userId] = item.duties + 1
                }else {
                    let str = ''
                    list.forEach(value => {
                        if(value.userId == item.userId) str = value.memName
                    })
                    if(dutieCounts[item.userId] >= 5) {
                        message.error(`${str} 添加的职务大于5个了`)
                        return
                    }
                    dutieCounts[item.userId] += 1
                }
            }
        }
        this.props.getDutieInfo(this.postid, list, arr)
        let memberData = this.props.memberData
        userData.forEach(item => {
            let sum = 0
            memberData[this.postid].forEach(v => {
                if(v.userId == item.userId) {
                    sum++
                }
            })
            if(!sum) {
                if(dutieCounts[item.userId] == undefined) {
                    dutieCounts[item.userId] = item.duties - 1
                }else {
                    dutieCounts[item.userId] -= 1
                }
            }
        })
        console.log('----DC----', dutieCounts)
        this.setState({ visible: false });
        this.setState({selectedRowKeys:[], userData: []})
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    onGetSelectKeys = (selectedKeys) => {
        console.log('selectedKeys changed: ', selectedKeys);
        this.setState({ selectedKeys });
    }
    render() {
        const columns = [
            {
              title: '姓名',
              key: 'userName',
              dataIndex: 'userName',
              width: 100,
            }, {
              title: '员工号',
              key: 'userNo',
              dataIndex: 'userNo',
              width: 150,
              
            },{
              title: '所属党组织',
              key: 'fullName',
              dataIndex: 'fullName',
            },{
              title: '职务',
              key: 'postName',
              dataIndex: 'postName',  
            }
        ];
        const search = [
            {
                key: 'userName',
                label: '姓名',
                qFilter: 'Q=userName',
                type: 'input',
            },
        ];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            // onChange: this.onSelectChange,
        };
        return (
            <Modal
                visible={this.state.visible}
                width="50%"
                onCancel={this.close}
                onOk={this.addPerson}
                destroyOnClose
            >
                <TableAndSearch
                    userDatas={this.state.userData}
                    rowkey='id'
                    columns={columns}
                    search={search}
                    // rowSelection={rowSelection}
                    getSelectRow={this.onSelectChange}
                    getSelectKey={this.onGetSelectKeys}
                    url={`services/web/party/partyUser/getFullList/-1`}
                    urlfilter={'Q=state=1,2'}
                />
            </Modal>
        )
    }
}

export default PersonModal