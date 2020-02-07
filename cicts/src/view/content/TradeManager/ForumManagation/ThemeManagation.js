import React, { Component } from 'react';
import { connect } from 'react-redux';
import TableAndSearch from '../../../component/table/TableAndSearch';

@connect(
    state => ({ powers: state.powers })
)

export default class CommonBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        //请求所属主题下拉框数据
    }
    render() {
        const { powers = {} } = this.props;
        let addPowers =powers && powers['20007.21702.001'];//新建
        let editPowers=powers && powers['20007.21702.002'];//修改
        const search = [
            {
                key: 'titleName',
                label: '主题名称:',
                qFilter: 'Q=name',
                type: 'input',
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
                title: '主题名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '帖子数',
                dataIndex: 'postNum',
                key: 'postNum',
            },
            {
                title: '显示顺序',
                dataIndex: 'showIndex',
                key: 'showIndex',
            },
            {
                title: '创建时间',
                dataIndex: 'createDate',
                key: 'createDate',
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                render(text, record) {
                    return (
                        <div>
                        <span><a style={{display:editPowers?'inline-block':'none'}} onClick={() => {
                            location.hash = `/TradeManager/ForumManagation/ThemeManagation/Edit?isEdit=true&id=${record.id}`;
                        }}>编辑</a></span>
                        </div>
                    );
                },
            },
        ];
        return (
            <div>
                <TableAndSearch
                    search={search}
                    url={'services/web/bbs/topic/getList'}
                    columns={columns}
                    rowkey={'id'}
                    addBtn={addPowers?{order:1,url:'/TradeManager/ForumManagation/ThemeManagation/Add'}:null }
                />
            </div>
        );
    }
}
