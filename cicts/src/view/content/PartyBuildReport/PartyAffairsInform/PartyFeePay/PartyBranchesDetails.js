import React, { Component } from 'react';
import { Form, Button, Input, DatePicker, Table, Spin, Row, Col, Select ,message} from 'antd';
import { getService, exportExcelService1 } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import './PartyBranchesDetails.less'
import { connect } from 'react-redux';
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';

// Excel表导出权限码配置
@connect(
    state => ({
        powers: state.powers,
        partyId: state.head.headPartyIdData,
    })
)

@Form.create()
class PartyBranchesDetails extends Component {
    constructor(props) {
        super(props);
        let oldPartyId = Number(sessionStorage.getItem('partyid')) || nextProps.partyId;
        let listId = props.location.search.split("&")[0].substr(4)
        let startValue = JSON.parse(sessionStorage.getItem('time')).sTime//** */
        let endValue = JSON.parse(sessionStorage.getItem('time')).eTime//** */
        this.state = {
            PageSize: 10, //每页十条数据
            current: 1, //当前页
            total: 0,//查询的总数量
            loading: false,
            spinning:false,
            data: [],
            id: listId,
            query: '',
            startTime: startValue,
            endTime: endValue,
            partyId: '',
            oldPartyId,
            reportExcel:false
        };
        this.columns = [
            {
                title: "序号",
                dataIndex: 'xuhao',
                width: 71,
                render: (text, record, index) => {
                    return  <div>
                        <span>{(this.state.current-1)*(this.state.PageSize) + index + 1}</span>
                    </div>
                }
            },
            {
                title: "姓名",
                dataIndex: 'name',
                width: 353
            },
            {
                title: "员工号",
                dataIndex: 'userNo',
                width: 264
            },
            {
                title: "应缴年月",
                dataIndex: 'shouldPayDate',
                width: 275,
                render: (text, record) => {
                    return `${(record.shouldPayDate).substring(0, 7)}`
                }
            },
            {
                title: "缴费金额",
                dataIndex: 'money',
                width: 333
            },
            {
                title: "缴费状态",
                dataIndex: 'isPay',
                width: 193
            },
        ];
    };

    //接口请求的函数封装
    commonServer = (id, current, pageSize, query) => {
        this.setState({ spinning: true })
        // let queryAll = query ? `${query}` : ''
        let queryAll = `Q=startTime=${this.state.startTime}&Q=endTime=${this.state.endTime}&Q=id=${id}${query ? query : ''}`
        getService(`${API_PREFIX}services/web/party/fee/payMemberList/${current}/${pageSize}?${queryAll}`, data => {
            if (data.status === 1) {
                this.setState({
                    data: data.root.list || [],
                    total: data.root.totalNum,
                    spinning: false
                })
            } else if (data.status === 0) {
                this.setState({ spinning: false })
                message.error(data.errorMsg);
            }
        })
    }

    //点击进入详情页初始化渲染
    componentWillMount() {
        this.commonServer(this.state.id, this.state.current, this.state.PageSize)
    }

    //当props改变时触发
    componentWillReceiveProps(nextProps) {
        let partyId = Number(sessionStorage.getItem('partyid')) || nextProps.partyId;
        if (partyId !=this.state.oldPartyId) {
            window.location.href = `#/PartyBuildReport/PartyAffairsInform/PartyFeePay`;
            this.setState({partyId:nextProps.partyId},()=>{
                this.commonServer(this.state.partyId, this.state.current, this.state.PageSize)
            })
        }
    }

    goback = () => {
        history.go(-1)
    }

    submitSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (!err) {
                let dangName = fieldsValue.name ? `&Q=userName=${fieldsValue.name}` : ''
                let danguserNo = fieldsValue.userno ? `&Q=userNo=${fieldsValue.userno}` : ''
                let dangshoulddate = fieldsValue.shoulddate ? `&Q=shouldPayDate=${fieldsValue.shoulddate.format('YYYY-MM')}` : ''
                let dangIspay = fieldsValue.ispay == '2' ? '' : `&Q=isPay=${fieldsValue.ispay}`
                let query = `${dangName}${danguserNo}${dangshoulddate}${dangIspay}`
                this.setState({
                    current: 1,
                    PageSize: 10,
                    query
                })
                this.commonServer(this.state.id, 1, 10, query)
            }
        })
    }
    //跳转对应的第几页触发的事件
    changePage = (page, pageSize) => {
        this.setState({
            current: page,
            PageSize: pageSize
        })
        this.commonServer(this.state.id, page, pageSize, this.state.query)
    }

    //页面大小改变触发
    onPageSizeChange = (current, pageSize) => {
        let query = this.state.query ? `${this.state.query}` : ''
        this.commonServer(this.state.id, 1, pageSize, query)
        this.setState({
            current: 1,
            PageSize: pageSize
        })
    }

    //Excel表单导出
    ExportExcel = () => {
        this.setState({reportExcel: true})//点击后置灰
        let queryname = this.state.query ? `${this.state.query}` : ''
        // let path= `${API_PREFIX}services/partybuildingreport/partyfee/PartyFeeDetailsExcel?id=${this.state.id}&page=${this.state.current}&pageSize=${this.state.PageSize}${queryname}`
        let path = `${API_PREFIX}services/web/party/fee/partyFeeDetailsExcel?Q=startTime=${this.state.startTime}&Q=endTime=${this.state.endTime}&Q=id=${this.state.id}${queryname}`
        exportExcelService1(path, '党员党费详细缴纳统计').then(data=>{
            this.setState({reportExcel:data})
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const Option = Select.Option;
        const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
        let userJsonStr = sessionStorage.getItem('time');
        let userEntity = JSON.parse(userJsonStr);
        let userEntitySTime = userEntity.sTime.substring(0, 4) + "年" + userEntity.sTime.substring(5, 7) + "月"
        let userEntityETime = userEntity.eTime.substring(0, 4) + "年" + userEntity.eTime.substring(5, 7) + "月"
        let powers = this.props.powers;
        let exportExcelPower = powers && powers['20011.25005.202']
        return (
            <div className="PartyBranchesDetails">
                <Spin size='large' spinning={this.state.spinning}>
                    <p className="header">{userEntitySTime} - {userEntityETime}</p>
                    <Form layout="inline" className="form" onSubmit={this.submitSearch}>
                        <Row>
                            <Col span={4} style={{marginLeft:'20px'}}>
                                <FormItem label="姓名" {...formItemLayout}>
                                        {
                                            getFieldDecorator('name')(<Input placeholder="请输入" className="nameInput" />)
                                        }
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="员工号" {...formItemLayout}>
                                        {
                                            getFieldDecorator('userno')(<Input placeholder="请输入" className="usernoInput" />)
                                        }
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="应缴年月" {...formItemLayout}>
                                    {getFieldDecorator('shoulddate', { initialValue: '' })(

                                        <MonthPicker style={{marginLeft:'6px'}} format={monthFormat} allowClear={false} disabledDate={this.disabledStartDate} placeholder="请选择" />

                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="缴费状态" {...formItemLayout}>
                                    {getFieldDecorator('ispay', {
                                        initialValue: '2'
                                    })(
                                        <Select style={{ width: '168px',height:'24px',marginLeft:'10px' }} className="selectDetail">
                                            <Option value="2">全部</Option>
                                            <Option value="1">已缴费</Option>
                                            <Option value="0">未缴费</Option>
                                        </Select>
                                    )}

                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="allBtn">
                            <FormItem >
                                {/* <Button className="queryBtn" onClick={this.submitSearch}>查询</Button> */}
                                <Button className="queryBtn" type="primary" htmlType="submit">查询</Button>
                                <Button className="resetBtn" onClick={() => {
                                    this.props.form.resetFields();
                                }}>重置</Button>
                            </FormItem>
                        </Row>
                    </Form>
                    <div className="ExportExcelDivDetail">
                        {exportExcelPower ? (<Button className="resetBtn ExportExcel " onClick={this.ExportExcel} disabled={this.state.reportExcel}>导出Excel</Button>) : ''}
                        {/* <Button className="resetBtn ExportExcel " onClick={this.ExportExcel} disabled={(exportExcelPower ? false:true)||this.state.reportExcel} >导出Excel</Button> */}
                    </div>
                    <Table
                        className="table"
                        rowKey={(record, index) => `complete${record.id}${index}`}
                        bordered
                        pagination={{
                            pageSize: this.state.PageSize,
                            current: this.state.current,
                            total: this.state.total,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            onShowSizeChange: this.onPageSizeChange,
                            pageSizeOptions: ['10', "20", "30", "40"],
                            onChange: this.changePage,
                            showTotal: total => `共 ${total} 条`
                        }}
                        columns={this.columns}
                        dataSource={this.state.data}
                    />
                    <div className="goback">
                        <Button className="resetBtn" onClick={this.goback}>返回</Button>
                    </div>
                </Spin>
            </div>
        )

    }
}

export default PartyBranchesDetails;