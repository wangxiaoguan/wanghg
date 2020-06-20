
import React,{Component} from "react";
import { Icon,Button,Menu,DatePicker,TimePicker,LocaleProvider,Calendar,ConfigProvider,Form ,Spin,Input,Row,Col,message } from 'antd';
import store from '../redux/store'
import {setUser} from '../redux/action'
const FormItem=Form.Item
class Demo extends Component{
    constructor(props){
        super(props);
        this.state={
		  setUser:n =>store.dispatch(setUser(n)), 
		  loading:false
        }
    }
    componentDidMount(){
      this.state.setUser({isLogin:false})
    }


    handleSubmit = (e) => {
        e.preventDefault();
        let that = this;
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            this.setState({loading:true})
            fetch(`http://wanghg.top/php/html/login.php`, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(fieldsValue)
            }).then(function(res) {
                res.json().then(data=>{
                    if(data.code === 1){
                        message.success(data.msg)
                        that.state.setUser(fieldsValue.user)
                        window.sessionStorage.setItem('user',fieldsValue.user)
                        that.props.closeModal()
                        that.props.loginSuccess()
                    }else if(data.code === 2){
                        message.error(data.msg)
                        that.props.closeModal()
                    }else if(data.code === 3){
                        message.error(data.msg)
                        that.props.closeModal()
                    }
                    that.setState({loading:false})
                })
                
            }).catch(error=>{
                message.error('登录失败')
                that.setState({loading:false})
            });
            
        })
    }

    render(){
		const {loading} = this.state
		const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
        return(
            <div id='Login'> 
			<div className='middle'>
				<Spin spinning={loading}>
					<Form onSubmit={this.handleSubmit}  >
                    <FormItem  label='用户' {...formItemLayout}  >
                        {
                            getFieldDecorator('user',{
                                rules:[
                                    {
                                        type:'string',
                                        required: true, 
                                        whitespace: true,
                                        message: '用户为必填项',

                                    }
                                ],initialValue:'', 
                            })
                            (<Input  /> )
                        }
                    </FormItem>
                    <FormItem  label='密码' {...formItemLayout}  >
                        {
                            getFieldDecorator('password',{
                                rules:[
                                    {
                                        type:'string',
                                        required: true, 
                                        whitespace: true,
                                        message: '密码为必填项',

                                    }
                                ],initialValue:'', 
                            })
                            (<Input.Password  /> )
                        }
                    </FormItem>
                </Form>
                <Row>
					<Col offset={7} span={4}><Button onClick={()=>location.hash = '/common/List'}>取消</Button></Col>
                    <Col offset={2} span={4}><Button type='queryBtn' onClick={this.handleSubmit}>登录</Button></Col>
                </Row>
				</Spin>
				</div>
  	        </div>
    
        )
    }
} 
const Login=Form.create()(Demo)
export default Login;


