import React, { Component } from 'react';
import { Row, Col, Tabs,Input,Select,Button, Form, Table , Spin, message , Popconfirm} from 'antd';
import API_PREFIX from '../../apiprefix';
import{getService,postService} from '../../myFetch';
import {connect} from 'react-redux';
import './MyExport.less';
const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

//配置导出按钮权限
@connect(
  state => ({
    powers: state.powers,
  })
)
@Form.create()
class MyExport extends Component{
    constructor(props){
        super(props);
        this.state={
            spinning: false,
            total: 0,
            pageSize: 10,
            currentPage: 1,
            query: '',
            selectedRowKeys: [],
            selectedRows:[],
            tabKey: 1,
            data: [],
            isProhibit:false,
        };
 
    }
    componentWillMount(){
        this.requestData();
    }
    requestData = () => { //封装发送查询、分页请求
        this.setState({spinning: true});
        let {currentPage, pageSize, query, tabKey} = this.state;
        console.log('currentPage', currentPage);
        console.log('pageSize', pageSize);
        console.log('query', query);
        console.log('tabKey', tabKey);
        let path = '';
        if(tabKey == 1) {//未完成
            path = `${API_PREFIX}services/web/personal/userInfo/list/${currentPage}/${pageSize}?Q=isPulish=2${query?`${query}`:''}`;
        }else {//已完成
            path = `${API_PREFIX}services/web/personal/userInfo/list/${currentPage}/${pageSize}?Q=isPulish=1${query?`${query}`:''}`;
        }
        getService(path, data => {
            if(data.status ===1) {
                data.root.list&&data.root.list.forEach((item, i) => {
                item['key'] = i + 1+(currentPage-1)*pageSize;
                });
                this.setState({
                data: data.root.list,
                total: data.root.totalNum,
                spinning: false,
                selectedRowKeys:[],
                });
            }else{
                this.setState({
                data: [],
                total: data.root.totalNum,
                spinning: false,
                selectedRowKeys:[],
                });
                message.error(data.errorMsg);
            } 
        });
    }
    querySubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err) {
                let query='';
                if(this.state.tabKey=='1'){
                    let fileName= values.fileName===''||values.fileName===undefined?'':`&Q=reportTitle=${values.fileName}`;
                        query=`${fileName}`;
                }else if(this.state.tabKey=='2'){
                    let fileName= values.fileName===''||values.fileName===undefined?'':`&Q=reportTitle=${values.fileName}`;
                    let status=values.status===''||values.status===undefined?'':`&Q=status=${values.status}`;
                        query=`${fileName}${status}`;
                }
                console.log('111111111111111111', query);
                this.setState({
                    currentPage: 1,
                    query,
                    selectedRowKeys:[],
                }, () => {
                    console.log('111111111111');
                    this.requestData(); //请求数据
                });
            }
        });
    }
    reset = () => {
        this.props.form.resetFields();
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({
             selectedRowKeys,
         });
    }
    change = (page,pageSize) => { //页码改变，发送请求获取数据
        this.setState({ 
          currentPage: page,
          pageSize: pageSize,
        }, () => {this.requestData();});
    }
    pageSizeChange = (current, size) => {
        this.setState({
          currentPage: 1,
          pageSize: size,
        }, () => {this.requestData();});
        
    }
    keyChange = (key) => {
        this.reset();
        this.setState({
            tabKey: key,
            query: '',
            currentPage: 1,
            pageSize: 10,
        }, () => this.requestData());
    }

    handleVisibleChange=()=>{
        let {selectedRowKeys}=this.state;
        if(selectedRowKeys.length===0){
            this.setState({
                isProhibit:false,
              });
        }else{
            this.setState({
                isProhibit:true,
              });
        }
    }

    Popcancel=()=>{
        this.setState({ isProhibit: false });
      }

    delete = () => {
        console.log('删除数据',this.state.selectedRowKeys);
        let ids = this.state.selectedRowKeys;
        // 发请求删除数据
        postService(API_PREFIX+'services/web/personal/userInfo/deleteReports',ids,data=>{
            if(data.status===1){
                if(data.root.object!==0){
                    message.success('删除成功');
                    this.setState({isProhibit: false});
                    this.requestData();
                }
            }else{
                message.error(data.errorMsg);
            }
        });
    }

    //重新生成
    renewal=(record)=>{
        getService(API_PREFIX+record.execUrl+`&Q=taskId=${record.id}&Q=renewal=1`,data=>{
            if(data.status===1){
                this.requestData();

            }else{
                message.error(data.errorMsg);
            }
        });
    }

    detailData = () => {
        const columns1=[
            {
            title:'序号',
            dataIndex:'key',
            key:'key',
            },
            {
            title:'文件名称',
            dataIndex:'reportTitle',
            key:'reportTitle',
            },
            {
            title:'创建时间',
            dataIndex:'createDate',
            key:'createDate',
            },
            {
            title:'状态',
            dataIndex:'status',
            render: (text, record) => {
                if(record.status===0){
                    return (<span style={{color:'#666'}}>排队中</span>);
                }else if(record.status===1){
                    return (<span style={{color:'#007aff'}}>生成中</span>);
                }
            },
            },
        ];
        const columns2=[
            {
            title:'序号',
            dataIndex:'key',
            key:'key',
            },
            {
            title:'文件名称',
            dataIndex:'reportTitle',
            key:'reportTitle',
            },
            {
            title:'完成时间',
            dataIndex:'endDate',
            key:'endDate',
            },
            {
            title:'状态',
            dataIndex:'status',
            render: (text, record) => {
                if(record.status===2){
                    return (<span>成功</span>);
                }else if(record.status===3){
                    return (<span>失败</span>);
                }
                
            },
            },
            {
            title:'操作',
            dataIndex:'used',
            key:'used',
            render: (text, record) => {
                if(record.status===2){
                    return (<a style={{color:'#007aff',cursor: 'pointer'}} href={`${record.ossPath}`}>下载</a>);
                }else if(record.status===3){
                    return (<span onClick={()=>this.renewal(record)} style={{color:'#007aff',cursor: 'pointer'}}>重新生成</span>);
                }
                
            },
            },
        ];
        const { selectedRowKeys, tabKey } = this.state;
        let disabled = selectedRowKeys.length == 0 ? true : false;
        console.log('禁用了========', disabled);
        let powers = this.props.powers;
        let deletePower = powers && powers['20008.21801.004'];//删除
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: '6' }, wrapperCol: { span: '18' } };
        const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
        };
        let pagination = {
            showSizeChanger: true,
            showQuickJumper: true,
            total: this.state.total,
            current: this.state.currentPage,
            pageSize: this.state.pageSize,
            onChange: this.change,
            onShowSizeChange: this.pageSizeChange,
            showTotal: total => `共 ${total} 条`,
        };
        return (
            // <Spin size='large' spinning={this.state.spinning}>
            <div className='myExport'>
                <div className='formTop'>
                    <Form onSubmit={this.querySubmit}>
                        <Row>
                        <Col span='8'> 
                        <FormItem {...formItemLayout} label='文件名称'>
                            {
                            getFieldDecorator('fileName')(
                                <Input style={{width: 280}} placeholder="请输入" />
                            )
                            } 
                        </FormItem>
                        </Col>

                        {
                                this.state.tabKey==='2'?(
                                    <Col span='8'>
                                    <FormItem {...formItemLayout} label='状态'>
                                        {
                                           getFieldDecorator('status',{
                                            initialValue:'',
                                           })(
                                            <Select>
                                                <Option value=''>全部</Option>
                                                <Option value='2'>成功</Option>
                                                <Option value='3'>失败</Option>
                                            </Select>
                                           ) 
                                        }
                                    </FormItem>
                                    </Col>
                                ):null
                            }
                        
                        </Row>
                        <Row>
                        <Col>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button onClick={this.reset}>重置</Button>
                        </Col>
                        </Row>
                    </Form>
                </div>
                {deletePower ? (
                    
                <Popconfirm
                placement="top"
                title={'确定删除所选项吗？'}
                onConfirm={this.delete}
                okText="确定"
                cancelText="取消"
                visible={this.state.isProhibit}
                onVisibleChange={this.handleVisibleChange}
                onCancel={this.Popcancel}
              >
                <Button 
                className='excel'
                type="danger"
                disabled={disabled}
                >删除</Button>
                </Popconfirm>
                )
                : null}
                     
                <Table 
                id='tableExcel' 
                rowKey='id' 
                rowSelection={rowSelection} 
                columns={tabKey == 1 ? columns1 : columns2} 
                dataSource={this.state.data} 
                bordered={true} 
                pagination={pagination}
                onRow={(record)=>{
                    return{
                        onClick:(e)=>{
                            if(e.target.tagName!== 'TD'){
                              return;
                            }
                            let selectedRows = this.state.selectedRows;
                            let selectedRowKeys=this.state.selectedRowKeys;
                            if(selectedRows.some(item=>{item['id']===record.id;})
                            ){
                                selectedRows.filter(item=>{item['id']!==record.id;});
                            }else{
                                selectedRows.push(record.id);
                            }
                            if(selectedRowKeys.indexOf(record.id)>-1){
                                selectedRowKeys = selectedRowKeys.filter(_ => _ !== record.id);
                            }else{
                                selectedRowKeys = [...this.state.selectedRowKeys, record.id];
                            }
                            this.setState({selectedRowKeys});
                        },
                    };
                }}
                />
              
            </div>
            // </Spin>
        );
    }
    render(){
        return(
            <Tabs defaultActiveKey="1" onChange={this.keyChange}>
                <TabPane tab="未完成" key="1">
                    {this.state.tabKey == 1 ? this.detailData() : null}
                </TabPane>
                <TabPane tab="已完成" key="2">
                    {this.state.tabKey == 2 ?this.detailData() : null}
                </TabPane>
            </Tabs>
        );
    }
}
export default MyExport;