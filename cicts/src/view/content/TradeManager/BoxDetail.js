import React, { Component } from 'react';
import { connect } from 'react-redux';
import { message, Spin, Row, Col, Input,Button  } from 'antd';
import moment from 'moment';

import TableAndSearch from '../../component/table/TableAndSearch';

import Zmage from 'react-zmage';
import API_PREFIX, {API_FILE_VIEW} from '../apiprefix';
import { getService, GetQueryString } from '../myFetch';

const { TextArea } = Input;
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
            id: GetQueryString(location.hash, ['id']).id || '',
            type:GetQueryString(location.hash, ['type']).type,//判断是哪一个类型
            detailData: {}, //详情数据
        };
    }

    componentDidMount() {
        if(this.state.type==='ChairCommon'){//主席信箱普通信件
            getService(`${API_PREFIX}services/web/union/chairman/common/getApplyDetail/${this.state.id}`, (data) => {
                if (data.status == 1) {//success
                    this.setState({
                        detailData: data.root.object,
                    });
                } else {
                    message.error(data.errorMsg);
                }
            });
        }else if(this.state.type==='ChairReport'){//主席信箱上报信件
            getService(`${API_PREFIX}services/web/union/chairman/report/getApplyDetail/${this.state.id}`, (data) => {
                if (data.status == 1) {//success
                    this.setState({
                        detailData: data.root.object,
                    });
                } else {
                    message.error(data.errorMsg);
                }
            });
        }else if(this.state.type==='DiffcultyCommon'){//困难帮扶普通信件
            getService(`${API_PREFIX}services/web/union/troubleHelp/common/getApplyDetail/${this.state.id}`, (data) => {
                if (data.status == 1) {//success
                    this.setState({
                        detailData: data.root.object,
                    });
                } else {
                    message.error(data.errorMsg);
                }
            });
        }else if(this.state.type==='DiffcultyReport'){//困难帮扶上报信件
            getService(`${API_PREFIX}services/web/union/troubleHelp/report/getApplyDetail/${this.state.id}`, (data) => {
                if (data.status == 1) {//success
                    this.setState({
                        detailData: data.root.object,
                    });
                } else {
                    message.error(data.errorMsg);
                }
            });
        }else if(this.state.type==='PowerCommon'){//维权管理普通信件
            getService(`${API_PREFIX}services/web/union/protectRight/common/getApplyDetail/${this.state.id}`, (data) => {
                if (data.status == 1) {//success
                    this.setState({
                        detailData: data.root.object,
                    });
                } else {
                    message.error(data.errorMsg);
                }
            });
        }else if(this.state.type==='PowerReport'){//维权管理上报信件
            getService(`${API_PREFIX}services/web/union/protectRight/report/getApplyDetail/${this.state.id}`, (data) => {
                if (data.status == 1) {//success
                    this.setState({
                        detailData: data.root.object,
                    });
                } else {
                    message.error(data.errorMsg);
                }
            });
        }
      
    }
    render() {
        //console.log('this.props', this.props);
        const { powers = {} } = this.props;
        const { detailData } = this.state;
        let images = []
        if(detailData.applyAttach) {
            if(detailData.applyAttach.indexOf(',') > -1) {
                images = detailData.applyAttach.split(',')
            }else {
                images.push(detailData.applyAttach)
            }
        }
        return (
            <div style={{padding: '50px 26px'}}>
                <div>
                    <Row style={{height: 26,fontSize: 15}}>
                        <Col span='8'>发信人：{detailData.applyUserName ? detailData.applyUserName : ''}</Col>
                        <Col span='8'>创建时间：{detailData.createDate ? detailData.createDate : ''}</Col>
                    </Row>
                    <Row style={{height: 26,fontSize: 15}}>员工号：{detailData.applyUserNo ? detailData.applyUserNo : ''}</Row>
                    <Row style={{height: 26,fontSize: 15}}>工&nbsp;&nbsp;&nbsp;&nbsp;会：{detailData.unionName ? detailData.unionName : ''}</Row>
                    <TextArea style={{marginTop: 5,marginBottom: 5}} disabled autosize={{ minRows: 4, maxRows: 12 }} value={detailData.applyContent ? detailData.applyContent : ''} />
                    {
                        images.length ? 
                            images.map((item, index) => {
                                return (
                                <span style={{marginRight: 5}}>
                                    <Zmage style={{width: '60px', height: '60px'}} key={index} src={`${sessionStorage.getItem('ossViewPath') || API_FILE_VIEW}${item}`} alt='' />
                                </span>
                                );
                            }) : null
                    }
                </div>
                <div style={{marginTop: 50}}>
                    <Row style={{height: 26,fontSize: 15}}>
                        <Col span='8'>处理人：{detailData.lastUpdateUserName ? detailData.lastUpdateUserName : ''}</Col>
                        <Col span='8'>处理时间：{detailData.lastUpdateDate ? detailData.lastUpdateDate : ''}</Col>
                    </Row>
                    <Row style={{height: 26,fontSize: 15}}>状&nbsp;&nbsp;&nbsp;&nbsp;态：{(detailData.replyStatus == '1' ? '已回复' : '未回复')}</Row>
                    <TextArea style={{marginTop: 5}} disabled autosize={{ minRows: 4, maxRows: 12 }} value={detailData.replyContent ? detailData.replyContent : ''} />
                </div>
                <div style={{marginTop: '50px', textAlign: 'center'}}>
                    <Button style={{borderRadius: '10px'}} onClick={() => history.back()}>返回</Button>
                </div>
            </div>
        );
    }
}
