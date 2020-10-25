
import React,{Component} from "react";
import {Input,Button,message,Form,Select} from 'antd'
import store from '../redux/store'
import {setUser} from '../redux/action'
import Editor from '../antd/richTexteditor/braftEditor'
import './app.scss'
const FormItem=Form.Item;
const Option = Select.Option;
@Form.create()
class Demo extends Component{
    constructor(props){
        super(props);
        this.state={
            setUser:n =>store.dispatch(setUser(n)),
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
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            let body = {
                id:String(new Date().getTime()),
                title:fieldsValue.title,
                type:fieldsValue.type,
                content:escape(fieldsValue.content),
            }
            fetch(`http://wanghg.top/php/html/add.php`, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(body)
            }).then(function(response) {
                message.success('新增成功')
                location.hash = '/common/list'
                
            }).catch(error=>{
                console.log(error)
            });
            
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 2 }, wrapperCol: { span: 20 } };
        console.log(this.state)
        const {typeList} = this.state
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
                                ],initialValue:'', 
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
                                ],initialValue:'html', 
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
                                ],initialValue: '', 
                            })
                            (<Editor content={''} getContent={this.getContent}/> )
                        }
                    </FormItem>
                </Form>
                <div className='footer-btn'>
                    <Button onClick={()=>location.hash = '/common/list'}>取消</Button>　
                    <Button type='primary' onClick={this.handleSubmit}>保存</Button>
                </div>
            </div>
        )
    }
}
// const Add=Form.create()(Demo)

export default Demo;