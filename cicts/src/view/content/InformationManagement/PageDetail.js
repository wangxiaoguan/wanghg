import React, { Component } from 'react';
import { Form,  Input, Button, Checkbox,Select,Radio,InputNumber,message,Cascader,Row,Col,Modal} from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
import { postService, getService,GetQueryString} from '../myFetch';
import API_PREFIX, {API_FILE_VIEW,API_CHOOSE_SERVICE,API_FILE_VIEW_INNER } from '../apiprefix';

@Form.create()
class PageDetail extends Component {
  constructor(props){
    super(props);
    this.state={
      commentId:GetQueryString(location.hash,['commentId']).commentId,//获取commentId，从前一个页面传递过来的
      type:GetQueryString(location.hash,['type']).type,
      infoId:GetQueryString(location.hash,['infoId']).infoId,
      detail:{},
      previewImage: '',
      previewVisible: false,
      images:[],
      previewVisible: false,
      hostUrl: '',
    }
  }
  componentDidMount(){
    let hostUrl=''
    if(API_CHOOSE_SERVICE==1){
      hostUrl=sessionStorage.getItem('ossViewPath') || API_FILE_VIEW
    }else{
      hostUrl=API_FILE_VIEW_INNER
    }
    this.setState({hostUrl})
    //获取详情
    if(this.state.commentId){
      getService(API_PREFIX + `services/web/news/article/getNewCommentById/${this.state.commentId}`, data => {
        if (data.status === 1) {
          this.setState({ detail: data.root.object});
        }
      });
    }
  }
  handleCancel = () => this.setState({ previewVisible: false })
  //表单提交事件
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      let body={
        objectId:this.state.infoId,
        objectType:"1",
        content:fieldsValue.replayContent,
        commentId:this.state.commentId,
        createUserId:window.sessionStorage.getItem('id'),
        createUserName:window.sessionStorage.getItem('userName'),
      }
      postService(API_PREFIX + 'services/web/news/article/replyComment', body, data => {
        if (data.status == 1) {
          message.success('回复成功')
          history.back()
        }else{
          message.error(data.errorMsg);
        }
      });

    });
  }

  handleCancel = () => this.setState({ previewVisible: false })
  drawingImage=()=>this.setState({ previewVisible: true })
  render(){
    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 8},
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 8 },
      },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 8},
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 8 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const data=this.state.detail;
    const { previewVisible} = this.state;
    return(
        <div>
              <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="评论人" >
                  {
                    getFieldDecorator('userName',{initialValue:data.createUserName})
                    ( <Input disabled/> )
                  }
                </FormItem>
                <FormItem {...formItemLayout} label="名称" >
                  {
                    getFieldDecorator('targetName',{initialValue:data.fullName})
                    ( <Input disabled/> )
                  }
                </FormItem>
                <FormItem {...formItemLayout} label="类型" >
                  {
                    getFieldDecorator('commentTypeId',{initialValue:data.commentType?'精彩评论':'普通评论'})
                    ( <Input disabled/> )
                  }
                </FormItem>
                <FormItem {...formItemLayout} label="图片" >
                  {
                    getFieldDecorator('commentTypeId',{initialValue:data.imageUrl})
                    ( 
                      <span>{this.state.detail.imageUrl?<img alt="example" style={{ width:'100px',cursor: 'pointer',}} src={this.state.hostUrl+this.state.detail.imageUrl} onClick={this.drawingImage} />:'无图片'}</span>
                    )
                  }  
                </FormItem>
                <FormItem {...formItemLayout} label="评论内容" >
                  {
                    getFieldDecorator('content',{initialValue:data.content})
                    (<TextArea style={{height:'170px'}} disabled /> )
                  }
                </FormItem>
                <FormItem {...formItemLayout} label="评论时间" >
                  {
                    getFieldDecorator('createDate',{initialValue:data.createDate})
                    ( <Input disabled/> )
                  }
                </FormItem>
                <FormItem {...formItemLayout} label="回复">
                  {
                    getFieldDecorator('replayContent',{
                      rules: [{
                        required: true,
                        whitespace: true,
                        validator: (rule, value, callback) => {
                          if(value.length>200){
                              callback('回复字数不得超过200字');
                          }else if(!value){
                              callback('请填写回复');
                          }else{
                              callback();
                          }
                        },
                      }],
                      initialValue:''
                    })(
                        <TextArea  />
                    )
                  }
                </FormItem>
                <FormItem {...formItemLayout} label="回复列表" >
                  {/* {
                        data.userComments&&data.userComments.map((item,index)=>{
                          return <div>
                            <FormItem {...formItemLayout1} label="回复人" >
                              {
                                <Input value={item.createUserName} disabled/>
                              }
                            </FormItem>
                            <FormItem {...formItemLayout1} label="回复内容" >
                              {
                                <TextArea value={item.content} disabled  />
                              }
                            </FormItem>
                            <FormItem {...formItemLayout1} label="回复时间" >
                              {
                                <Input value={item.createDate} disabled/>
                              }
                            </FormItem>
                          </div>
                        })
                  } */}
                  {
                        data.userComments&&data.userComments.map((item,index)=>{
                          return <div>
                            <p className='replyTop'><span className='replyTitle'>回复人：</span><span className='replySpan'>{item.createUserName}</span></p>
                            <p className='replyTop'><span className='replyTitle'>回复内容：</span><span className='replySpan replyKuang'><TextArea style={{height:'30px'}} value={item.content} disabled /></span></p>
                            <p className='replyTop'><span className='replyTitle'>回复时间：</span><span className='replySpan'>{item.createDate}</span></p>
                            {/* <FormItem {...formItemLayout1} label="回复人" >
                              {
                                <Input value={item.createUserName} disabled/>
                              }
                            </FormItem>
                            <FormItem {...formItemLayout1} label="回复内容" >
                              {
                                <TextArea value={item.content} disabled  />
                              }
                            </FormItem>
                            <FormItem {...formItemLayout1} label="回复时间" >
                              {
                                <Input value={item.createDate} disabled/>
                              }
                            </FormItem> */}
                          </div>
                        })
                  }
                </FormItem>

                <Row>
                  <Col span={12} style={{textAlign: 'right'}}>
                    <Button className="queryBtn" type="primary" htmlType="submit" onClick={this.handleSubmit}>保存</Button>
                  </Col>
                  <Col span={12} style={{textAlign: 'left'}}>
                    <Button className="resetBtn" onClick={()=>history.back()}>返回</Button>
                  </Col>
                </Row>
              </Form>
              <Modal
                visible={this.state.previewVisible}
                onCancel={() => this.setState({ previewVisible: false })}
                footer={null}
                destroyOnClose>
                <div className='imgsize'><img alt="example" src={this.state.hostUrl+this.state.detail.imageUrl} /></div>
              </Modal>
        </div>
    );
  }
}

export default PageDetail;