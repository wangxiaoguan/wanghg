import React,{Component} from 'react'
import { Tabs,message,Popconfirm,Divider,Spin,Modal,InputNumber,Input,Form,Row,Col,Button} from 'antd';
import { BEGIN,getPageData } from '../../../../redux-root/action/table/table';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {checkPointNumber} from '../../../../utils/checkForm';
import { postService } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import {connect} from 'react-redux';
const TabPane=Tabs.TabPane;
const FormItem = Form.Item;
const TextArea = Input.TextArea;


@connect(
    state => ({
        powers: state.powers,
        pageData: state.table.pageData,
    }),
    dispatch => ({
        getData: n => dispatch(BEGIN(n)),
        getPageData: n => dispatch(getPageData(n)),
    })
)
class PointRule extends Component{
    constructor(props){
        super(props);
        this.state={
            tabValue:'1',
            AddModal:false,
            isEdit:false,
            editData:{},
            updateKey1:0,
            updateKey2:0,
            updateKey3:0,
            updateKey4:0,
        };
    }

    onChange = value => {
        this.setState({tabValue:value})
        if(value==='1'){
            this.setState({updateKey1:this.state.updateKey1+1});
        }else if(value==='2'){
            this.setState({updateKey2:this.state.updateKey2+1});
        }else if(value==='3'){
            this.setState({updateKey3:this.state.updateKey3+1});
        }else{
            this.setState({updateKey4:this.state.updateKey4+1});
        }
    }

    editData = data => {
        this.setState({editData:data,AddModal:true,isEdit:true})
    }

    closeModal = () => {
        this.setState({AddModal:false,editData:{}})
    }

    getData = () => {
        const tabValue = this.state.tabValue;
        console.log(this.props)
        if(tabValue === '1'){
            this.props.getData(API_PREFIX+`services/web/point/level/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}`)
        }else if(tabValue === '2'){
            this.props.getData(API_PREFIX+`services/web/weight/info/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=type=1`)
        }else if(tabValue === '3'){
            this.props.getData(API_PREFIX+`services/web/weight/info/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=type=2`)
        }else{
            this.props.getData(API_PREFIX+`services/web/weight/info/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=type=3`)
        }
    }

    render(){
        let powers = this.props.powers;
        const hasAddPower = powers && powers['20010.24002.001']; 
        const hasDelPower = powers && powers['20010.24002.004'];
        const hasEditPower = powers && powers['20010.24002.002'];

        const {tabValue,isEdit} = this.state;

        const url1 = 'services/web/point/level/getList'
        const url2 = 'services/web/weight/info/getList'

        const columns1 = [
            {
                title: '等级',
                key: 'level',
                dataIndex: 'level',
                width: 150, 
                fixed: 'left',
            },
            {
                title: '等级名称',
                dataIndex: 'levelName',
                key: 'levelName',
                width: 160, 
            },
            {
                title: '经验值最小值',
                dataIndex: 'pointMin',
                key: 'pointMin',
                width:120
            },
            {
                title: '经验值最大值',
                dataIndex: 'pointMax',
                key: 'pointMax',
                width:120
            },
            {
                title: '创建时间',
                dataIndex: 'createDate',
                key: 'createDate',
            },
            {
                title: '最后更新时间',
                dataIndex: 'lastUpdateDate',
                key: 'lastUpdateDate',
            },
            {
                title: '操作',
                dataIndex: 'option',
                key: 'option',
                width:100,
                render:(_,record)=>{
                    return hasEditPower?<a onClick={()=>this.editData(record)}>编辑</a>:null
                }
            },
        ]
        const columns2 = [
            {
                title: '序号',
                key: 'sNum',
                dataIndex: 'sNum',
                width: 150, 
                fixed: 'left',
            },
            {
                title: '规则名称',
                dataIndex: 'title',
                key: 'title',
                width: 200, 
            },
            {
                title: '规则描述',
                dataIndex: 'desp',
                key: 'desp',
            },
            {
                title: '数值',
                dataIndex: 'value',
                key: 'value',
                width:80
            },
            {
                title: '每日上限数值',
                dataIndex: 'maxValue',
                key: 'maxValue',
                width:120
            },
            {
                title: '最后更新时间',
                dataIndex: 'lastUpdateDate',
                key: 'lastUpdateDate',
                width:160
            },
            {
                title: '操作',
                dataIndex: 'option',
                key: 'option',
                width:100,
                render:(_,record)=>{
                    return hasEditPower?<a onClick={()=>this.editData(record)}>编辑</a>:null
                }
            },
        ]

        return(
            <div>
                <Tabs type="card" onChange={this.onChange} defaultActiveKey={this.state.tabValue}>
                    <TabPane
                        tab="等级"
                        key="1"
                    >
                        <TableAndSearch
                            url={url1}
                            columns={columns1}
                            addBtn={hasAddPower?{order:1,OnEvent:()=>this.setState({AddModal:true,isEdit:false}) }:null }
                            deleteBtn={hasDelPower?{order:2,url:'services/web/point/level/delete'}:null}
                            scroll={{width:1200}} 
                            key={this.state.updateKey1}
                            
                        />
                    </TabPane>
                    <TabPane
                        tab="经验值"
                        key="2"
                    >
                        <TableAndSearch
                            url={url2}
                            columns={columns2}
                            addBtn={hasAddPower?{order:1,OnEvent:()=>this.setState({AddModal:true,isEdit:false}) }:null }
                            // deleteBtn={hasDelPower?{order:2,url:'services/web/weight/info/delete'}:null}
                            scroll={{width:1200}} 
                            urlfilter={`Q=type=1`}
                            key={this.state.updateKey2}
                        />
                    </TabPane>
                    <TabPane
                        tab="普通积分"
                        key="3"
                    >
                        <TableAndSearch
                            url={url2}
                            columns={columns2}
                            addBtn={hasAddPower?{order:1,OnEvent:()=>this.setState({AddModal:true,isEdit:false}) }:null }
                            // deleteBtn={hasDelPower?{order:2,url:'services/web/weight/info/delete'}:null}
                            scroll={{width:1200}} 
                            urlfilter={`Q=type=2`}
                            key={this.state.updateKey3}
                        />
                    </TabPane>
                    <TabPane
                        tab="党员荣誉积分"
                        key="4"
                    >
                        <TableAndSearch
                            url={url2}
                            columns={columns2}
                            addBtn={hasAddPower?{order:1,OnEvent:()=>this.setState({AddModal:true,isEdit:false}) }:null }
                            // deleteBtn={hasDelPower?{order:2,url:'services/web/weight/info/delete'}:null}
                            scroll={{width:1200}} 
                            urlfilter={`Q=type=3`}
                            key={this.state.updateKey4}
                        />
                    </TabPane>
                </Tabs>
                <Modal
                    width={800}
                    title={this.state.isEdit?tabValue==='1'?'等级':tabValue==='2'?'经验值':tabValue==='3'?'普通积分':'党员荣誉积分':'新建'}
                    visible={this.state.AddModal}
                    footer={null}
                    afterClose={()=>this.setState({AddModal:false})}
                    destroyOnClose={true}
                    onCancel={()=>this.setState({AddModal:false})}
                    >
                    <AddPoint 
                        tabValue={this.state.tabValue} 
                        editData={this.state.editData}
                        isEdit={this.state.isEdit}
                        closeModal={this.closeModal}
                        getData={this.getData}
                    />
                </Modal>
            </div>
        )
    }
}

@Form.create()
class AddPoint extends Component {
    constructor(props){
        super(props);
        this.state={

        }
    }
    componentDidMount(){
        const {isEdit,editData,tabValue} = this.props;
        if(isEdit){
            if(tabValue === '1'){
                this.props.form.setFieldsValue({
                    level:editData.level,
                    levelName:editData.levelName,
                    pointMin:editData.pointMin,
                    pointMax:editData.pointMax
                })
            }else{
                this.props.form.setFieldsValue({
                    desp:editData.desp,
                    value:editData.value,
                    maxValue:editData.maxValue
                })
            }

        }

    }
    handleSubmit = e => {
        e.preventDefault();
        const {tabValue,isEdit,editData} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
                if(isEdit){
                    if(tabValue === '1'){
                        let body = {...editData,...values}
                        postService(API_PREFIX+'services/web/point/level/update',body,data=>{
                            if(data.status === 1){
                                message.success('编辑成功')
                                this.props.getData()
                                this.props.closeModal()
                            }else{
                                message.error(data.errorMsg)
                                this.props.closeModal()
                            }
                        })

                    }else if(tabValue === '2'){
                        let body = {...editData,...values}
                        postService(API_PREFIX+'services/web/weight/info/update',body,data=>{
                            if(data.status === 1){
                                message.success('编辑成功')
                                this.props.getData()
                                this.props.closeModal()
                            }else{
                                message.error(data.errorMsg)
                                this.props.closeModal()
                            }
                        })

                    }else if(tabValue === '3'){
                        let body = {...editData,...values}
                        postService(API_PREFIX+'services/web/weight/info/update',body,data=>{
                            if(data.status === 1){
                                message.success('编辑成功')
                                this.props.getData()
                                this.props.closeModal()
                            }else{
                                message.error(data.errorMsg)
                                this.props.closeModal()
                            }
                        })

                    }else{
                        let body = {...editData,...values}
                        postService(API_PREFIX+'services/web/weight/info/update',body,data=>{
                            if(data.status === 1){
                                message.success('编辑成功')
                                this.props.getData()
                                this.props.closeModal()
                            }else{
                                message.error(data.errorMsg)
                                this.props.closeModal()
                            }
                        })

                    }

                }else{
                    if(tabValue === '1'){
                        postService(API_PREFIX+'services/web/point/level/add',values,data=>{
                            if(data.status === 1){
                                message.success('新增成功')
                                this.props.getData()
                                this.props.closeModal()
                            }else{
                                message.error(data.errorMsg)
                                this.props.closeModal()
                            }
                        })

                    }else if(tabValue === '2'){
                        values.type = 1
                        postService(API_PREFIX+'services/web/weight/info/add',values,data=>{
                            if(data.status === 1){
                                message.success('新增成功')
                                this.props.getData()
                                this.props.closeModal()
                            }else{
                                message.error(data.errorMsg)
                                this.props.closeModal()
                            }
                        })

                    }else if(tabValue === '3'){
                        values.type = 2
                        postService(API_PREFIX+'services/web/weight/info/add',values,data=>{
                            if(data.status === 1){
                                message.success('新增成功')
                                this.props.getData()
                                this.props.closeModal()
                            }else{
                                message.error(data.errorMsg)
                                this.props.closeModal()
                            }
                        })

                    }else{
                        values.type = 3
                        postService(API_PREFIX+'services/web/weight/info/add',values,data=>{
                            if(data.status === 1){
                                message.success('新增成功')
                                this.props.getData()
                                this.props.closeModal()
                            }else{
                                message.error(data.errorMsg)
                                this.props.closeModal()
                            }
                        })
                        
                    }
                }

            }
        })

    }

    render(){
        const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 11 } };
        const { form: { getFieldDecorator },tabValue,isEdit} = this.props;
        return(
            <div>
                {
                    !isEdit?tabValue === '1'?
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout} label="等级" >
                            {
                                getFieldDecorator('level', {
                                    rules: [
                                        {
                                            type:'number',
                                            required: true,
                                            whitespace: true,
                                            validator: (rule, value, callback) => checkPointNumber(rule, value, callback,'等级'),
                                        },
                                    ],
                                })
                                (<InputNumber className="input1"/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="等级名称" >
                            {
                                getFieldDecorator('levelName', {
                                    rules: [
                                        {
                                            type:'string',
                                            required: true,
                                            whitespace: true,
                                            message: `等级名称为必填项`,
                                        },
                                    ],
                                })
                                (<Input className="input1"/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="最小经验值" >
                            {
                                getFieldDecorator('pointMin', {
                                    rules: [
                                        {
                                            type:'number',
                                            required: true,
                                            whitespace: true,
                                            validator: (rule, value, callback) => checkPointNumber(rule, value, callback,'最小经验值'),
                                        },
                                    ],
                                })
                                (<InputNumber className="input1"/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="最大经验值" >
                            {
                                getFieldDecorator('pointMax', {
                                    rules: [
                                        {
                                            type:'number',
                                            required: true,
                                            whitespace: true,
                                            validator: (rule, value, callback) => checkPointNumber(rule, value, callback,'最大经验值'),
                                        },
                                    ],
                                })
                                (<InputNumber className="input1"/>)
                            }
                        </FormItem>
                        <Row>
                            <Col offset={8} span={4}><Button className="resetBtn" onClick={() =>this.props.closeModal()}>取消</Button></Col>
                            <Col offset={2} span={4}><Button htmlType="submit" className="queryBtn" type="primary">保存</Button></Col>
                        </Row>
                    </Form>:
                    <Form onSubmit={this.handleSubmit}>
                    
                        <FormItem {...formItemLayout} label="规则名称" >
                            {
                                getFieldDecorator('title', {
                                    rules: [
                                        {
                                            type:'string',
                                            required: true,
                                            whitespace: true,
                                            message: `规则名称为必填项`,
                                        },
                                    ],
                                })
                                (<Input className="input1" />)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="规则描述" >
                            {
                                getFieldDecorator('desp', {
                                    rules: [
                                        {
                                            type:'string',
                                            required: true,
                                            whitespace: true,
                                            message: `规则描述为必填项`,
                                        },
                                    ],
                                })
                                (<Input className="input1"/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="数值" >
                            {
                                getFieldDecorator('value', {
                                    rules: [
                                        {
                                            type:'number',
                                            required: true,
                                            whitespace: true,
                                            validator: (rule, value, callback) => checkPointNumber(rule, value, callback,'数值'),
                                        },
                                    ],
                                })
                                (<InputNumber className="input1"/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="每日上限数值" >
                            {
                                getFieldDecorator('maxValue', {
                                    rules: [
                                        {
                                            type:'number',
                                            required: true,
                                            whitespace: true,
                                            validator: (rule, value, callback) => checkPointNumber(rule, value, callback,'每日上限数值'),
                                        },
                                    ],
                                })
                                (<InputNumber className="input1"/>)
                            }
                        </FormItem>
                        <Row>
                            <Col offset={8} span={4}><Button className="resetBtn" onClick={() =>this.props.closeModal()}>取消</Button></Col>
                            <Col offset={2} span={4}><Button htmlType="submit" className="queryBtn" type="primary">保存</Button></Col>
                        </Row>
                    </Form>:tabValue === '1'?
                    <Form onSubmit={this.handleSubmit}>
                    
                        <FormItem {...formItemLayout} label="等级" >
                            {
                                getFieldDecorator('level', {
                                    rules: [
                                        {
                                            type:'number',
                                            required: true,
                                            whitespace: true,
                                            validator: (rule, value, callback) => checkPointNumber(rule, value, callback,'等级'),
                                        },
                                    ],
                                })
                                (<InputNumber className="input1"/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="等级名称" >
                            {
                                getFieldDecorator('levelName', {
                                    rules: [
                                        {
                                            type:'string',
                                            required: true,
                                            whitespace: true,
                                            message: `等级名称为必填项`,
                                        },
                                    ],
                                })
                                (<Input className="input1"/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="最小经验值" >
                            {
                                getFieldDecorator('pointMin', {
                                    rules: [
                                        {
                                            type:'number',
                                            required: true,
                                            whitespace: true,
                                            validator: (rule, value, callback) => checkPointNumber(rule, value, callback,'最小经验值'),
                                        },
                                    ],
                                })
                                (<InputNumber className="input1"/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="最大经验值" >
                            {
                                getFieldDecorator('pointMax', {
                                    rules: [
                                        {
                                            type:'number',
                                            required: true,
                                            whitespace: true,
                                            validator: (rule, value, callback) => checkPointNumber(rule, value, callback,'最大经验值'),
                                        },
                                    ],
                                })
                                (<InputNumber className="input1"/>)
                            }
                        </FormItem>
                        <Row>
                            <Col offset={8} span={4}><Button className="resetBtn" onClick={() =>this.props.closeModal()}>取消</Button></Col>
                            <Col offset={2} span={4}><Button htmlType="submit" className="queryBtn" type="primary">保存</Button></Col>
                        </Row>
                    </Form>:
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout} label="规则描述" >
                            {
                                getFieldDecorator('desp', {
                                    rules: [
                                        {
                                            type:'string',
                                            required: true,
                                            whitespace: true,
                                            message: `规则描述为必填项`,
                                        },
                                    ],
                                })
                                (<TextArea rows={4} />)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="数值" >
                            {
                                getFieldDecorator('value', {
                                    rules: [
                                        {
                                            type:'number',
                                            required: true,
                                            whitespace: true,
                                            validator: (rule, value, callback) => checkPointNumber(rule, value, callback,'数值'),
                                        },
                                    ],
                                })
                                (<InputNumber className="input1"/>)
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="每日上限数值" >
                            {
                                getFieldDecorator('maxValue', {
                                    rules: [
                                        {
                                            type:'number',
                                            required: true,
                                            whitespace: true,
                                            validator: (rule, value, callback) => checkPointNumber(rule, value, callback,'每日上限数值'),
                                        },
                                    ],
                                })
                                (<InputNumber className="input1"/>)
                            }
                        </FormItem>
                        <Row>
                            <Col offset={8} span={4}><Button className="resetBtn" onClick={() =>this.props.closeModal()}>取消</Button></Col>
                            <Col offset={2} span={4}><Button htmlType="submit" className="queryBtn" type="primary">保存</Button></Col>
                        </Row>
                    </Form>
                }
                
            </div>
        )
    }
}
export default PointRule;