import React, { Component } from 'react';
import { connect } from 'react-redux';
import { message, Spin, Row, Col, Input  } from 'antd';
import API_PREFIX from '../../apiprefix';
import { getService, GetQueryString } from '../../myFetch';

const { TextArea } = Input

@connect(
    state => ({ powers: state.powers })
)

export default class CommonBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: GetQueryString(location.hash, ['id']).id || '',
            detailData: {}, //详情数据
        }
    }

    componentDidMount() {
        getService(`${API_PREFIX}services/web/union/apply/getApplyDetail/${this.state.id}`, (data) => {
            if (data.status == 1) {//success
                this.setState({
                    detailData: data.root.object,
                });
            } else {
                message.error(data.errorMsg);
            }
        });
    }
    render() {
        //console.log('this.props', this.props);
        const { powers = {} } = this.props;
        const { detailData } = this.state;
        return (
            <div style={{padding: '50px 26px'}}>
                <div>
                    <Row style={{height: 26,fontSize: 15}}>
                        <Col span='8'>发信人：{detailData.createUserName ? detailData.createUserName : ''}</Col>
                        <Col span='8'>评论数：{detailData.commentNum ? detailData.commentNum : ''}</Col>
                    </Row>
                    <Row style={{height: 26,fontSize: 15}}>
                        <Col span='8'>员工号：{detailData.createUserNo ? detailData.createUserNo : ''}</Col>
                        <Col span='8'>创建时间：{detailData.createDate ? detailData.createDate : ''}</Col>
                    </Row>
                    <Row style={{height: 26,fontSize: 15}}>主&nbsp;&nbsp;&nbsp;&nbsp;题：{detailData.unionName ? detailData.unionName : ''}</Row>
                    <TextArea style={{marginTop: 5}} disabled autosize={{ minRows: 4, maxRows: 12 }} value={detailData.applyContent ? detailData.applyContent : ''}></TextArea>
                </div>
            </div>
        );
    }
}
