
import React,{Component} from "react";
import {Input,Button,Row,Col,Table,Spin,message,Divider,Form,Select} from 'antd'
import Editor from '../antd/richTexteditor/braftEditor'
import store from '../redux/store'
import {setTimePushData} from '../redux/action'
import './app.scss'
import $ from 'jquery'
const FormItem=Form.Item;
const Option = Select.Option;
class Demo extends Component{
    constructor(props){
        super(props);
        this.state={
            detailData:{},
            setTimePushData:n =>store.dispatch(setTimePushData(n)),
            id:'',
            typeList:[
                {type:'html',name:'html'},
                {type:'css',name:'css'},
                {type:'js',name:'js'},
                {type:'node',name:'node'},
                {type:'react',name:'react'},
            ]
        }
    }

    componentDidMount(){
        let params = this.props.match.params
        this.getDetail(params.id)
        this.setState({id:params.id})
        this.state.setTimePushData(true)
    }
    getDetail = id => {
        this.setState({loading:true})
        fetch(`http://wanghg.top/php/html/detail.php?id=${id}`).then(res=>{
            res.json().then(data=>{
                this.setState({detailData:data,loading:false})
            })
        }).catch(error=>{
            message.error('获取详情失败')
            this.setState({loading:false})
        })
    }
    
    getContent = html => {
        if(html === '<p></p>'){
            this.props.form.setFieldsValue({content:''})
        }else{
            this.props.form.setFieldsValue({content:html})
        }
        
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {id} = this.state
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            let body = {
                id:id,
                title:fieldsValue.title,
                type:fieldsValue.type,
                content:fieldsValue.content,
            }
            fetch(`http://wanghg.top/php/html/edit.php`, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(body)
            }).then(res => {
                message.success('编辑成功')
                location.hash = '/common/list/0'
                this.setState({loading:false})
            }).catch(error=>{
                message.error('编辑失败')
                this.setState({loading:false})
            });
            
        })
    }
    render(){
        const {detailData,typeList} = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };
        return(
            <div id='Add'>
                <Form onSubmit={this.handleSubmit}  >
                    <FormItem  label='标题' {...formItemLayout}  >
                        {
                            getFieldDecorator('title',{
                                rules:[
                                    {
                                        type:'string',
                                        required: true, 
                                        whitespace: true,
                                        message: '标题为必填项',

                                    }
                                ],initialValue:detailData.title||'', 
                            })
                            (<Input  /> )
                        }
                    </FormItem>
                    <FormItem  label='类型' {...formItemLayout}  >
                        {
                            getFieldDecorator('type',{
                                rules:[
                                    {
                                        type:'string',
                                        required: true, 
                                        whitespace: true,
                                        message: '类型为必填项',

                                    }
                                ],initialValue:detailData.type||'html', 
                            })
                            (
                                <Select style={{width:'50%'}}>
                                    {typeList.map(e=><Option value={e.type} key={e.type} >{e.name}</Option>)}
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem  label='内容' {...formItemLayout}  >
                        {
                            getFieldDecorator('content',{
                                rules:[
                                    {   
                                        type:'string',
                                        required: true, 
                                        whitespace: true,
                                        message: '内容为必填项',
                                    }
                                ],initialValue: detailData.content||'', 
                            })
                            (<Editor content={detailData.content||''} getContent={this.getContent}/> )
                        }
                    </FormItem>
                </Form>
                <Row>
                    <Col offset={10} span={2}><Button onClick={()=>location.hash = `/common/list/0`}>取消</Button></Col>
                    <Col offset={2} span={2}><Button type='queryBtn' onClick={this.handleSubmit}>保存</Button></Col>
                </Row>
                
            </div>
        )
    }
}
const Edit=Form.create()(Demo)

export default Edit;