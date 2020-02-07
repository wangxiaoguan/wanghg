import React, { Component } from 'react';
import { Tabs, message, Message, Divider, Spin, Popconfirm, Progress, Form, Row, Button, Collapse } from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { postService, getService, GetQueryString } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { Panel } = Collapse;
@connect((state) => ({
	powers: state.powers
}))
export default class StatisticalResults extends Component {
	constructor(props) {
		super(props);
		let activeKey = '0';
		this.state = {
			tabKey: String(activeKey),
			updateKeyOne: 0,
			updateKeyTwo: 0,
			updateKeyThree: 0,
			activeId: GetQueryString(location.hash, [ 'id' ]).id || '0',
			updateKeyFour: 0,
			loading: false,
			tenantId: window.sessionStorage.getItem('tenantId'),
			activeKey: String(activeKey),
			dataArr: []
		};
	}

	componentWillReceiveProps(nextProps) {
		let activeKey = GetQueryString(location.hash, [ 'id' ]).id || '0';
		activeKey = String(activeKey);
		if (this.state.activeKey !== activeKey) {
			this.setState({
				activeKey,
				tabKey: activeKey
			});
		}
	}

	componentDidMount() {
		this.getData();
	}
	//得到统计结果
	getData = () => {
		this.setState({
			loading: true
		});
		getService(
			API_PREFIX + `services/web/activity/exam/reportTwoOrgAvg/${this.state.tenantId}/${this.state.activeId}`,
			(data) => {
				this.setState({
					loading: false
				});
				if (data.status === 1) {
					this.setState(
						{
							dataArr: []
						},
						() => {
							data.root.object.length>0&&data.root.object.map((item,index)=>{
								item.orgId=item.orgId?item.orgId:"-1";
								item.average=item.average?item.average:"0";
								item.joinRate=item.joinRate?item.joinRate:"0";
						   })
							this.setState({ dataArr: data.root.object });
						}
					);
				}
			}
		);
	};

	//得到部门参与率
	getBuMenData = () => {
		this.setState({
			loading: true
		});
		getService(
			API_PREFIX + `services/web/activity/exam/reportTwoOrgRate/${this.state.tenantId}/${this.state.activeId}`,
			(data) => {
				if (data.status === 1) {
					this.setState(
						{
							dataArr: []
						},
						() => {
							data.root.object.length>0&&data.root.object.map((item,index)=>{
								item.orgId=item.orgId?item.orgId:"-1";
								item.average=item.average?item.average:"0";
								item.joinRate=item.joinRate?item.joinRate:"0";
						   })
							this.setState({ dataArr: data.root.object });
						}
					);
				}
				this.setState({
					loading: false
				});
			}
		);
	};

	//得到企业平均分
	getQiyeavageData = () => {
		this.setState({
			loading: true
		});
		getService(API_PREFIX + `services/web/activity/exam/reportCompanyAvg/${this.state.activeId}`, (data) => {
			if (data.status === 1) {
				this.setState(
					{
						dataArr: []
					},
					() => {
						data.root.object.length>0&&data.root.object.map((item,index)=>{
							item.orgId=item.orgId?item.orgId:"-1";
							item.average=item.average?item.average:"0";
							item.joinRate=item.joinRate?item.joinRate:"0";
					   })
						this.setState({ dataArr: data.root.object });
					}
				);
			}
			this.setState({
				loading: false
			});
		});
	};

	//得到企业参与率
	getQiyeCanyuData = () => {
		this.setState({
			loading: true
		});
		getService(API_PREFIX + `services//web/activity/exam/reportCompanyRate/${this.state.activeId}`, (data) => {
			if (data.status === 1) {
				this.setState(
					{
						dataArr: []
					},
					() => {
						data.root.object.length>0&&data.root.object.map((item,index)=>{
							item.orgId=item.orgId?item.orgId:"-1";
							item.average=item.average?item.average:"0";
							item.joinRate=item.joinRate?item.joinRate:"0";
					   })
						this.setState({ dataArr: data.root.object });
					}
				);
			}
			this.setState({
				loading: false
			});
		});
	};

	tabChange = (tabKey) => {
		sessionStorage.setItem('TabsKey', tabKey);
		console.log('点击进入');
		if (tabKey === '0') {
			this.getData();
			this.setState({
				tabKey,
				activeKey: tabKey,
				updateKeyOne: this.state.updateKeyOne + 1
			});
		} else if (tabKey === '1') {
			this.getBuMenData();
			this.setState({
				tabKey,
				activeKey: tabKey,
				updateKeyTwo: this.state.updateKeyTwo + 1
			});
		} else if (tabKey === '2') {
			this.getQiyeavageData();
			this.setState({
				tabKey,
				activeKey: tabKey,
				updateKeyThree: this.state.updateKeyThree + 1
			});
		} else if (tabKey === '3') {
			this.getQiyeCanyuData();
			this.setState({
				tabKey,
				activeKey: tabKey,
				updateKeyFour: this.state.updateKeyFour + 1
			});
		}
	};
	render() {
		return (
			<Spin spinning={this.state.loading}>
				<Tabs type="card" defaultActiveKey={'0'} onChange={this.tabChange} className="tabCommon">
					<TabPane tab="部门平均分" key="0">
						<p style={{ marginTop: 50 }}>部门平均分</p>
						<ProgressList rate={this.state.dataArr} type="0" />
						<Row style={{ textAlign: 'center' }}>
							<Button
								type="primary"
								style={{ marginLeft: '0px', marginTop: '30px' }}
								className="resetBtn"
								onClick={() => {
									history.go(-1);
								}}
							>
								返回
							</Button>
						</Row>
					</TabPane>
					<TabPane tab="部门参与率" key="1">
						<p style={{ marginTop: 20 }}>部门参与率</p>
						<ProgressList rate={this.state.dataArr} type="1" />
						<Row style={{ textAlign: 'center' }}>
							<Button
								type="primary"
								style={{ marginLeft: '0px', marginTop: '30px' }}
								className="resetBtn"
								onClick={() => {
									history.go(-1);
								}}
							>
								返回
							</Button>
						</Row>
					</TabPane>
					<TabPane tab="企业平均分" key="2">
						<p style={{ marginTop: 20 }}>企业平均分</p>
						<ProgressList rate={this.state.dataArr} type="2" />
						<Row style={{ textAlign: 'center' }}>
							<Button
								type="primary"
								style={{ marginLeft: '0px', marginTop: '30px' }}
								className="resetBtn"
								onClick={() => {
									history.go(-1);
								}}
							>
								返回
							</Button>
						</Row>
					</TabPane>
					<TabPane tab="企业参与率" key="3">
						<p style={{ marginTop: 20 }}>企业参与率</p>
						<ProgressList rate={this.state.dataArr} type="3" />
						<Row style={{ textAlign: 'center' }}>
							<Button
								type="primary"
								style={{ marginLeft: '0px', marginTop: '30px' }}
								className="resetBtn"
								onClick={() => {
									history.go(-1);
								}}
							>
								返回
							</Button>
						</Row>
					</TabPane>
				</Tabs>
			</Spin>
		);
	}
}

@Form.create()
class ProgressList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeId: GetQueryString(location.hash, [ 'id' ]).id || '0',
			bumenArr: [],
			loading: false,
			oldId: 0,
			type: null
		};
	}
	callback = (key) => {
		console.log(key);
	};

	componentWillReceiveProps(nextProps) {
		if (this.state.type !== nextProps.type) {
			this.setState({ oldId: 0, type: nextProps.type });
		}
	}

	getNextData = (orgId, type) => {
		if (orgId == this.state.oldId) {
			return false;
		} else {
			this.setState({ oldId: orgId, loading: true });
			getService(
				API_PREFIX +
					`services/web/activity/exam/${type == 0
						? 'reportThreeOrgAvg'
						: 'reportThreeOrgRate'}/${orgId}/${this.state.activeId}`,
				(data) => {
					if (data.status === 1) {
						this.setState({ bumenArr: [] }, () => {
							data.root.object.length>0&&data.root.object.map((item,index)=>{
								item.orgId=item.orgId?item.orgId:"-1";
								item.average=item.average?item.average:"0";
								item.joinRate=item.joinRate?item.joinRate:"0";
						   })
							this.setState({ bumenArr: data.root.object });
						});
					}
					this.setState({
						loading: false
					});
				}
			);
		}
	};

	render() {
		const { type, rate } = this.props;
		const { bumenArr } = this.state;

		let maxValue = null;
		let childMaxValue =null;
		if ((type == 0 || type == 2) && rate.length > 0) {
			maxValue = Math.max.apply(
				Math,
				rate.map(function(o) {
					return Number(o.average);
				})
			);
		}
		if ((type == 0 || type == 2) && bumenArr.length > 0) {
			childMaxValue = Math.max.apply(
				Math,
				rate.map(function(o) {
					return Number(o.average);
				})
			);
		}

		console.log('maxValue===>', maxValue);

		return (
			<Spin spinning={this.state.loading}>
				{type == 0 || type == 2 ?	<div>
						{rate && rate.length > 0 && (type == 0 || type == 1) ? (
							<Collapse destroyInactivePanel accordion>
								{rate.map((item, index) => {
									return (
										<Panel
											showArrow={false}
											header={
												<div onClick={() => this.getNextData(item.orgId, type)}>
													<span>
														{index + 1}、{item.orgName}(总人数:{item.orgUserNum},参与人数:{item.joinNum})
													</span>
													<Progress
                            strokeLinecap="square"
														percent={
															maxValue == 0 ?0:(Number(item.average)/maxValue)*100
                            }
                            strokeColor={{
                              from: '#108ee9',
                              to: '#108ee9',
                            }}
														format={(percent) => `${item.average}`}
														strokeWidth={15}
													/>
												</div>
											}
											key={index}
											style={{ width: 800, marginLeft: 150 }}
										>
											{bumenArr.length > 0 ? (
												bumenArr.map((list, _index) => {
													return (
														<div style={{ marginLeft: '20px' }}>
															<span>
																{list.orgName}(总人数:{list.orgUserNum},参与人数:{list.joinNum}):
															</span>
															<Progress
                                strokeLinecap="square"
                                strokeColor={{
                                  from: '#108ee9',
                                  to: '#108ee9',
                                }}
																percent={
																 childMaxValue == 0 ?0:(Number(list.average)/childMaxValue)*100
																}
																format={(percent) => `${list.average}`}
																strokeWidth={15}
															/>
														</div>
													);
												})
											) : null}
										</Panel>
									);
								})}
							</Collapse>
						) : rate && rate.length > 0 && (type == 2 || type == 3) ? (
							rate.map((item, index) => {
								return (
									<div style={{ width: '800px', marginLeft: '150px' }}>
										<span>
											{item.orgName}(总人数:{item.orgUserNum},参与人数:{item.joinNum})
										</span>
										<Progress
                      strokeLinecap="square"
                      strokeColor={{
                        from: '#108ee9',
                        to: '#108ee9',
                      }}
											percent={
                        maxValue == 0 ?0:(Number(item.average)/maxValue)*100
                      }
											format={(percent) => `${item.average}`}
											strokeWidth={15}
										/>
									</div>
								);
							})
						) : null}
					</div>: (
					<div>
						{rate && rate.length > 0 && (type == 0 || type == 1) ? (
							<Collapse destroyInactivePanel accordion>
								{rate.map((item, index) => {
									return (
										<Panel
											showArrow={false}
											header={
												<div onClick={() => this.getNextData(item.orgId, type)}>
													<span>
														{index + 1}、{item.orgName}(总人数:{item.orgUserNum},参与人数:{item.joinNum})
													</span>
													<Progress
                            strokeLinecap="square"
                            strokeColor={{
                              from: '#108ee9',
                              to: '#108ee9',
                            }}
														percent={Number(item.joinRate.replace('%', ''))}
														format={(percent) => `${item.joinRate}`}
														strokeWidth={15}
													/>
												</div>
											}
											key={index}
											style={{ width: 800, marginLeft: 150 }}
										>
											{bumenArr.length > 0 ? (
												bumenArr.map((list, _index) => {
													return (
														<div style={{ marginLeft: '20px' }}>
															<span>
																{list.orgName}(总人数:{list.orgUserNum},参与人数:{list.joinNum}):
															</span>
															<Progress
                                strokeLinecap="square"
                                strokeColor={{
                                  from: '#108ee9',
                                  to: '#108ee9',
                                }}
																percent={Number(list.joinRate.replace('%', ''))}
																format={(percent) => `${list.joinRate}`}
																strokeWidth={15}
															/>
														</div>
													);
												})
											) : null}
										</Panel>
									);
								})}
							</Collapse>
						) : rate && rate.length > 0 && (type == 2 || type == 3) ? (
							rate.map((item, index) => {
								return (
									<div style={{ width: '800px', marginLeft: '150px' }}>
										<span>
											{item.orgName}(总人数:{item.orgUserNum},参与人数:{item.joinNum})
										</span>
										<Progress
											strokeLinecap="square"
											percent={Number(item.joinRate.replace('%', ''))}
											format={(percent) => `${item.joinRate}`}
											strokeWidth={15}
										/>
									</div>
								);
							})
						) : null}
					</div>
				)}
			</Spin>
		);
	}
}
