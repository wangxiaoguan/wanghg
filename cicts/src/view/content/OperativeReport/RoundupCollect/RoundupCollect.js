import React, { Component } from 'react';
import { Row, Col,Input,DatePicker,Button, Form,  Spin, message,Icon  } from 'antd';
import API_PREFIX from '../../apiprefix';
import{getService, postService} from '../../myFetch';
// import TableAndSearch from '../../component/table/TableAndSearch';
import {connect} from 'react-redux';
import moment from 'moment';
import '../oprativereport.less';
const FormItem = Form.Item;

//配置导出按钮权限
@connect(
  state => ({
    powers: state.powers,
  })
)

@Form.create()
class RoundupCollect extends Component{
    constructor(props){
        super(props);
        this.state={
            spinning: false,
            query: '',
            dataSource: {},
            reportExcel: false,//导出按钮可点击
        };
 
    }
    componentWillMount(){
        let startDate = moment().subtract( 30, 'days').format('YYYY-MM-DD 00:00:00');
        let endDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59');
        let query = `Q=startDate=${startDate}&Q=endDate=${endDate}`;
        console.log('111111111111111111', query);
        this.setState({
            query,
        }, () => {
            this.requestData(); //请求数据
        });
    }
    requestData = () => {
        console.log('发送了请求');
        this.setState({spinning:true});
        getService(API_PREFIX + `services/web/report/business/summaryInfo/get?${this.state.query}`, data => {
            if (data.status === 1) {
                this.setState({ dataSource: data.root.object,spinning: false });
            }else{
                message.error(data.errorMsg);
                this.setState({ spinning: false });
            }
        });
    }
    querySubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err) {
                let startDate = moment(values.startDate).format('YYYY-MM-DD 00:00:00');
                let endDate =moment(values.endDate).format('YYYY-MM-DD 23:59:59');
                let query = `Q=startDate=${startDate}&Q=endDate=${endDate}`;
                console.log('111111111111111111', query);
                this.setState({
                    query,
                    reportExcel: false,
                }, () => {
                    this.requestData(); //请求数据
                });
            }
        });
    }
    reset = () => {
        this.props.form.resetFields();
    }
    exportExcel = () => {
        this.setState({reportExcel: true});//点击后置灰
        getService(API_PREFIX + `services/web/report/business/summaryInfo/export?${this.state.query}`, res => {
            if(res.status === 1) {

            }else {
                message.error(res.errorMsg);
            }
        });
    }

    //导出excel进入到我的导出页面
    myExport=()=>{
        location.hash='/PersonalWork/MyExport';
    }
    render(){
        let powers = this.props.powers;
        let exportExcelPower = powers && powers['20009.21906.202'];//导出
        let data = this.state.dataSource;
        const { getFieldDecorator } = this.props.form;
            return(
                <Spin size='large' spinning={this.state.spinning}>
                <div className='roundupCollect'>
                    <div className='formTop'>
                    <Form onSubmit={this.querySubmit}>
                        <Row>
                        <Col>
                            <div>
                            <FormItem>
                                <label>选择时间：</label>
                                {getFieldDecorator('startDate', {
                                initialValue:moment(moment().subtract(30, 'days'), 'YYYY-MM-DD'),
                                })(
                                <DatePicker format={'YYYY-MM-DD'} />
                                )}
                            <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                                {getFieldDecorator('endDate', {
                                initialValue: moment(new Date(), 'YYYY-MM-DD'),
                                })(
                                <DatePicker  format={'YYYY-MM-DD'} />
                                )}
                            </FormItem>
                            </div>
                        </Col>
                        </Row>
                        <Row>
                        <Col>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button onClick={this.reset}>重置</Button>
                            {exportExcelPower ? <Button disabled={this.state.reportExcel} onClick={this.exportExcel}>导出Excel</Button> : null}
                            {this.state.reportExcel?<span><Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>导出文件已加入队列，请在<b style={{color:'#007aff',cursor:'pointer'}} onClick={this.myExport}>我的导出</b>查看</span>:null}
                        </Col>
                        </Row>
                    </Form>
                    </div>
                    <div>
                  {/* <Table id='tableExcel' rowSelection={rowSelection} columns={columns} dataSource={this.state.data} bordered={true} pagination={pagination} /> */}
                  <table className='tableContent' cellSpacing='0' border='1'>
                      <thead>
                          <tr>
                              <th>分类</th>
                              <th>指标</th>
                              <th>数值</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td rowSpan='3'>内容</td>
                              <td>资讯数</td>
                              <td>{data && data.countOfNews}</td>
                          </tr>
                          <tr>
                              <td>活动数</td>
                              <td>{data && data.countOfActivities}</td>
                          </tr>
                          <tr>
                              <td>视频数</td>
                              <td>{data && data.countOfVideos}</td>
                          </tr>
                          <tr>
                              <td rowSpan='2'>用户</td>
                              <td>活跃用户数</td>
                              <td>{data && data.countOfActive}</td>
                          </tr>
                          <tr>
                              <td>用户活跃率</td>
                              <td>{data && data.rateOfActive}</td>
                          </tr>
                          {/* <tr>
                              <td>新增用户量</td>
                              <td>{data && data.countNewLoginUsers}</td>
                          </tr>
                          <tr>
                              <td>总注册用户数</td>
                              <td>{data && data.sumLoginUsers}</td>
                          </tr>
                          <tr>
                              <td>公司员工注册用户</td>
                              <td>{data && data.regCount}</td>
                          </tr> */}
                          <tr>
                              <td rowSpan='7'>行为</td>
                              <td>发布内容（实际）浏览量</td>
                              <td>{data && data.sumOfView}</td>
                          </tr>
                          <tr>
                              <td>阅读人数</td>
                              <td>{data && data.countOfView}</td>
                          </tr>
                          <tr>
                              <td>签到人数</td>
                              <td>{data && data.countOfSign}</td>
                          </tr>
                          <tr>
                              <td>圈聊人数</td>
                              <td>{data && data.countOfChat}</td>
                          </tr>
                          <tr>
                              <td>阅读率</td>
                              <td>{data && data.rateOfView}</td>
                          </tr>
                          <tr>
                              <td>签到率</td>
                              <td>{data && data.rateOfSign}</td>
                          </tr>
                          <tr>
                              <td>圈聊率</td>
                              <td>{data && data.rateOfChat}</td>
                          </tr>
                          <tr>
                              <td rowSpan='4'>财富</td>
                              <td>积分增加</td>
                              <td>{data && data.sumOfAddPoint}</td>
                          </tr>
                          <tr>
                              <td>积分减少</td>
                              <td>{data && data.sumOfSubPoint}</td>
                          </tr>
                          <tr>
                              <td>经验增加</td>
                              <td>{data && data.sumOfAddExp}</td>
                          </tr>
                          <tr>
                              <td>经验减少</td>
                              <td>{data && data.sumOfSubExp}</td>
                          </tr>
                      </tbody>
                  </table>
                </div>
                </div>
                </Spin>
        );
    }
}
export default RoundupCollect;