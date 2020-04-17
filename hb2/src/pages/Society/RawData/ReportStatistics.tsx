import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Col, Card } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import { connect } from 'dva';

import HCascader from '@/components/Antd/HCascader';

const FormItem = Form.Item;
const FormItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};

@connect(({ loading }) => ({
	loadingDelete: Boolean(loading.effects['reportStatistics/remove']),
}))
class ReportStatistics extends Component<any, any> {


	private COLUMNS = [
		{
			title: '数据来源',
			dataIndex: 'name',
		},
		{
			title: '接收条数',
			dataIndex: 'total',
		},
		{
			title: '上报条数',
			dataIndex: 'reportCount',
		},
		{
			title: '上报率',
			dataIndex: 'percentage',
			render: (_, record) => {
				if (record.percentage) {
					let percentage = record.percentage.length > 5 ?
						record.percentage.substr(0, 5) : record.percentage
					return `${(parseFloat(percentage) * 100).toFixed(2)}%`;
				} else {
					return ''
				}
			}
		},
		{
			title: '最后上报时间',
			dataIndex: 'exporttime',
		},
	];

	private table: SearchTableClass;

	remove = (id) => {
		this.props.dispatch(
			{
				type: 'reportStatistics/remove',
				payLoad: id,
				callBack: () => {
					this.table.refresh();
				}
			}
		);
	}

	transData(response) {
		return {
			data: response.data,
			total: response.data.length,
		};
	}

	searchCreater = (values: any, pageSize: number, current: number) => {
		return { url: `/services/code/dataStatistics/reportStatistics` }
	}

	render() {
		return (
			<Card title='上报统计'>
				<SearchTable
					getInstance={(target) => this.table = target}
					columns={this.COLUMNS}
					formItems={null}
					formProps={{ layout: 'horizontal' }}
					searchCreater={this.searchCreater}
					transData={this.transData}
					tableProps={{ pagination: {} }}
				/>
			</Card>
		);
	}
}


export default ReportStatistics;