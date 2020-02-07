import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString, postService, getService } from '../../../myFetch';
import { Button, Modal, Form, Input, Radio, Message, Icon, DatePicker } from 'antd';
import './OrderInformation.less';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import { BEGIN, getDataSource, getPageData } from '../../../../../redux-root/action/table/table';
import { connect } from 'react-redux';
import API_PREFIX from '../../../apiprefix';
const { RangePicker } = DatePicker;
let uuid = 0;
@connect(
	(state) => ({
		dataSource: state.table.tableData,
		pageData: state.table.pageData
	}),
	(dispatch) => ({
		getData: (n) => dispatch(BEGIN(n))
	})
)
class OrderInformation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activityId: GetQueryString(location.hash, [ 'id' ]).id,
			orderAddress: '',
			visible: false,
			key: 10013134,
			keys: []
		};
	}
	componentDidMount() {
		// getService(API_PREFIX + `services/lookup/init/orderState`, data => {
		//   data.map((item,index) => {
		//     item.key = item.code
		//     item.value = item.desp
		//   })
		//   data.splice(0, 0, {key:'',value:"全部"});
		//   this.setState({
		//     orderState:data
		//   })
		// });
		// getService(API_PREFIX + `services/lookup/init/orderAddress`, data => {
		//   data.map((item,index) => {
		//     item.key = item.code
		//     item.value = item.desp
		//   })
		//   data.splice(0, 0, {key:'',value:"全部"});
		//   this.setState({
		//     orderAddress:data
		//   })
		// });
	}
	getData = async (url) => {
		await this.props.getData(API_PREFIX + `${url}`);
	};
	showModal = () => {
		this.setState({
			visible: true,
			flag: false,
			key: this.state.key + 1
		});
	};
	handleOk = (e) => {
		console.log(e);
		this.setState({
			visible: false
		});
	};
	handleCancel = (e) => {
		console.log(e);
		this.setState({
			visible: false,
			key: this.state.key + 1
		});
	};
	getSelectKey = (key) => {
		this.setState({
			keys: key
		});
	};
	hideModal = () => {
		this.setState({ visible: false });
	};
	render() {
		const columns = [
			{
				title: '序号',
				key: 'sNum',
				dataIndex: 'sNum'
			},
			{
				title: '订单号',
				dataIndex: 'id',
				key: 'id'
			},
			{
				title: '收货地址',
				dataIndex: 'address',
				key: 'address'
			},
			{
				title: '用户手机号',
				dataIndex: 'userPhone',
				key: 'userPhone'
			},
			{
				title: '用户名',
				dataIndex: 'userName',
				key: 'userName'
			},
			{
				title: '下单时间',
				dataIndex: 'createDate',
				key: 'createDate'
			},
			{
				title: '收货人',
				dataIndex: 'receiverName',
				key: 'receiverName'
			},
			{
				title: '商品件数',
				dataIndex: 'productCount',
				key: 'productCount'
			},
			{
				title: '总价',
				dataIndex: 'totalAmount',
				key: 'totalAmount'
			},
			{
				title: '订单状态',
				dataIndex: 'status',
				key: 'status',
				render: (data, record) => {
					let statusText = '';
					switch (record.status) {
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
						default:
							statusText = '创建';
							break;
					}
					return statusText;
				}
			},
			{
				title: '操作',
				dataIndex: 'stateDesp',
				key: 'stateDesp',
				render: (data, record) => {
					return (
						<div>
							<a
								className="operation"
								onClick={() =>
									(location.hash = `/EventManagement/Order/MerchantDetail?id=${record.id}`)}
							>
								详情
							</a>
						</div>
					);
				}
			}
		];

		const orderState = [
			{
				key: '1',
				value: '创建'
			},
			{
				key: '2',
				value: '接单'
			},
			{
				key: '3',
				value: '配送'
			},
			{
				key: '4',
				value: '取消'
			},
			{
				key: '5',
				value: '完成'
			},
			{
				key: '6',
				value: '爽约'
			}
		];

		const search = [
			{ key: 'userName', label: '用户名', qFilter: 'Q=userName', type: 'input' },
			{ key: 'mobile', label: '手机号', qFilter: 'Q=mobile', type: 'input' },
			{ key: 'activityName',label: '取货地址',  qFilter: 'Q=address',type: 'input'},
			{ key: 'status', label: '状态', qFilter: 'Q=status', option: orderState, type: 'select' }
		];
		return (
			<div>
				<TableAndSearch
					search={search}
					columns={columns}
					getSelectKey={this.getSelectKey}
					url={'services/web/mall/order/getList'}
					urlfilter={`Q=activityId=${this.state.activityId}`}
					query={'Q=activityId=' + this.state.activityId}
					goBackBtn={{ order: 2, label: '返回', type: '返回', url: '' }}
					exportBtn={{
						order: 2,
						url: 'services/web/mall/order/export',
						type: '订购信息',
						label: '导出订购信息'
					}}
					delUrl={'services/activity/orderActivity/order/delete'}
				/>
				<Modal
					title="发送订购信息"
					maskClosable={false} //点击蒙层是否关闭
					footer={null}
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					key={this.state.key}
				>
					<WrappedNormalLoginForm
						hideModal={this.hideModal}
						keys={this.state.keys}
						handleCancel={this.handleCancel}
					/>
				</Modal>
			</div>
		);
	}
}
class NormalLoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 1
		};
	}
	onChange1 = (e) => {
		console.log('radio checked', e.target.value);
		this.setState({
			value: e.target.value
		});
	};
	remove = (k) => {
		const { form } = this.props;
		// can use data-binding to get
		const keys = form.getFieldValue('keys');
		// We need at least one passenger
		/*if (keys.length === 1) {
      return;
    }*/

		// can use data-binding to set
		form.setFieldsValue({
			keys: keys.filter((key) => key !== k)
		});
	};

	add = () => {
		const { form } = this.props;
		// can use data-binding to get
		const keys = form.getFieldValue('keys');
		const nextKeys = keys.concat(uuid);
		uuid++;
		// can use data-binding to set
		// important! notify form to detect changes
		form.setFieldsValue({
			keys: nextKeys
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			console.log(values);
			console.log('1234', this.props.keys);
			var address = values.addresses;
			if (values.names) {
				var names = values.names;
			} else {
				var names = [];
			}
			//订购活动发送订购信息过滤为空的邮箱参数 wkjj 2019.1.15
			let address1 = [];
			Array.of(address, ...names).map((item) => {
				if (item !== undefined) {
					address1.push(item);
				}
			});
			const data = {
				orderIds: this.props.keys,
				addresses: address1
			};
			if (!err) {
				if (this.state.value == 1) {
					postService(API_PREFIX + `services/activity/orderActivity/order/email`, data, (data) => {
						if (data.retCode == 1) {
							/* Message.success("新增成功!")
                location.hash='EventManagement/Order/Commodity'*/
							Message.success(data.retMsg);
							this.props.hideModal();
						} else {
							Message.error(data.retMsg);
						}
					});
				} else {
					(data.cronDate = values.cronDate),
						(data.taskName = '测试youjian任务'),
						(data.operateType = 1),
						(data.queryType = 'post'),
						(data.queryUrl = API_PREFIX + `services/activity/orderActivity/order/email`),
						/*   this.props.keys.map((item) => {
            item = item.toString()
           }),
           address = address.toString(),
           names.map((item) => {
            item = item.toString()
           })*/
						(data.queryValue = {
							orderIds: this.props.keys,
							addresses: [ address, ...names ]
						});
					data.queryContentType = 'application/json';
					delete data.orderIds,
						delete data.addresses,
						postService(API_PREFIX + `services/automation/job/add`, data, (data) => {
							if (data.retCode == 1) {
								/* Message.success("新增成功!")
                location.hash='EventManagement/Order/Commodity'*/
								Message.success(data.retMsg);
								this.props.hideModal();
							} else {
								Message.error(data.retMsg);
							}
						});
				}
			}
		});
	};
	render() {
		const { getFieldDecorator, getFieldValue } = this.props.form;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 4 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 20 }
			}
		};
		const formItemLayoutTime = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 6 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 18 }
			}
		};
		const formItemLayoutCronDate = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 6 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 18 }
			}
		};
		const formItemLayoutWithOutLabel = {
			wrapperCol: {
				xs: { span: 24, offset: 0 },
				sm: { span: 20, offset: 4 }
			}
		};
		getFieldDecorator('keys', { initialValue: [] });
		const keys = getFieldValue('keys');
		const formItems = keys.map((k, index) => {
			return (
				<FormItem {...formItemLayoutWithOutLabel} label={''} required={false} key={k}>
					{getFieldDecorator(`names[${k}]`, {
						validateTrigger: [ 'onChange', 'onBlur' ],
						rules: [
							{
								required: true,
								whitespace: true,
								message: '请输入邮箱地址'
							}
						]
					})(<Input placeholder="请输入邮箱地址" style={{ width: '60%', marginRight: 8 }} />)}
					{keys.length >= 1 ? (
						<Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => this.remove(k)} />
					) : null}
				</FormItem>
			);
		});
		return (
			<Form onSubmit={this.handleSubmit}>
				<FormItem label="收件人" {...formItemLayout}>
					{getFieldDecorator('addresses', {
						rules: [ { type: 'email', required: true, message: '请输入邮箱地址', max: 20 } ]
					})(<Input placeholder="请输入邮箱地址" />)}
				</FormItem>
				{formItems}
				<FormItem {...formItemLayoutWithOutLabel}>
					<Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
						添加收件人
					</Button>
				</FormItem>
				<FormItem label="设置发送时间" {...formItemLayoutTime}>
					{getFieldDecorator('time', {
						rules: [ { required: true, message: '请设置发送时间' } ],
						initialValue: 1
					})(
						<RadioGroup onChange={this.onChange1}>
							<Radio value={1}>现在发送</Radio>
							<Radio value={2}>定时发送</Radio>
						</RadioGroup>
					)}
				</FormItem>
				{this.state.value == 2 ? (
					<FormItem label="定时发送时间" {...formItemLayoutCronDate}>
						{getFieldDecorator('cronDate', {
							rules: [ { required: true, message: '请设置发送时间' } ]
						})(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="请选择定时发送时间" />)}
					</FormItem>
				) : (
					<span />
				)}
				<FormItem {...formItemLayoutWithOutLabel}>
					<Button
						style={{ marginLeft: '145px' }}
						type="primary"
						className="resetBtn"
						onClick={this.props.handleCancel}
					>
						返回
					</Button>
					<Button type="primary" htmlType="submit" className="queryBtn">
						发送
					</Button>
				</FormItem>
			</Form>
		);
	}
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
export default OrderInformation;
