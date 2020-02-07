import React, { Component } from 'react';
import { message, Divider, Spin, Modal, Form, Input, InputNumber, Button, Radio, Popconfirm } from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { postService, getService, GetQueryString } from '../../../myFetch';
import API_PREFIX, { API_FILE_VIEW_INNER, API_FILE_VIEW,API_FILE_MALLVIEW } from '../../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN, getDataSource } from '../../../../../redux-root/action/table/table';
import './MerchantDetail.less';
@connect(
	(state) => ({
		pageData: state.table.pageData,
		powers: state.powers
	}),
	(dispatch) => ({
		getData: (n) => dispatch(BEGIN(n)),
		retSetData: (n) => dispatch(getDataSource(n))
	})
)
@Form.create()
export default class MerchantDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW,
			ossViewPath: API_FILE_MALLVIEW,
			orderDetail: null,
			id: GetQueryString(location.hash, [ 'id' ]).id || '0'
		};
	}

	componentDidMount() {
		getService(API_PREFIX + `services/web/mall/order/getById/${this.state.id}`, (res) => {
			console.log('res==>', res);
			if (res.status == 1) {
				this.setState({ orderDetail: res.root.object });
			} else {
				message.error(res.errorMsg);
			}
		});
	}

	render() {
    const { orderDetail, ossViewPath } = this.state;
		let statusText = '';
		if (orderDetail&&orderDetail.status) {
			switch (orderDetail.status) {
				case 1:
					statusText = '创建';
					break;
				case 2:
					statusText = '接单';
					break;
				case 3:
					statusText = '配送';
					break;
				case 4:
					statusText = '取消';
					break;
				case 5:
					statusText = '完成';
					break;
				case 6:
					statusText = '爽约';
          break;
        default :
          statusText = '创建';
        break;
			}
		}
		return (
			<div>
				{orderDetail ? (
					<div>
						<div className="baseInfo">
							<div className="infotitle">基本信息</div>
							<table>
								<tr>
									<td>订单状态</td>
									<td>{statusText}</td>
								</tr>
								<tr>
									<td>订单编号</td>
									<td>{orderDetail.id}</td>
								</tr>
								<tr>
									<td>收货人</td>
									<td>{orderDetail.receiverName}</td>
								</tr>
								<tr>
									<td>联系方式</td>
									<td>{orderDetail.receiverPhone}</td>
								</tr>
								<tr>
									<td>收货地址</td>
									<td>{orderDetail.address}</td>
								</tr>
								<tr>
									<td>下单时间</td>
									<td>{orderDetail.createDate}</td>
								</tr>
							</table>
						</div>

						<div className="baseInfo">
							<div className="infotitle">订单信息</div>
							<table>
								<tr>
									<th>商品图片</th>
									<th>商品名称</th>
									<th>分类</th>
									<th>价格</th>
									<th>数量</th>
									<th>实付金额</th>
								</tr>
								{orderDetail.orderDetailList && orderDetail.orderDetailList.length > 0 ? (
									orderDetail.orderDetailList.map((item, index) => {
										return (
							        				<tr>
												<td>
													<img
														src={`${ossViewPath}${item.productImages}`}
														style={{ width: '100px',height:"100px" }}
													/>
												</td>
												<td>{item.productName}</td>
												<td>{item.categoryName}</td>
												<td>{item.discountPrice}</td>
												<td>{item.productAmount}</td>
												<td>{(item.discountPrice*item.productAmount).toFixed(2)}</td>
											</tr>
										);
									})
								) : null}
							</table>
						</div>
					</div>
				) : null}
				<div className="returnBtn">
					<Button
						style={{ marginLeft: '460px', marginTop: '30px', marginBottom: '20px' }}
						className="resetBtn"
						type="primary"
						onClick={() => history.back()}
					>
						返回
					</Button>
				</div>
			</div>
		);
	}
}
