import React, { Component } from 'react';
import { Form,  Input, Button, Checkbox,Select,Radio,InputNumber,message,Cascader,Row,Col} from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
import { postService, getService,GetQueryString} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
@Form.create()
class CommentDetail extends Component {
  constructor(props){
    super(props);
    this.state={
      commentId:GetQueryString(location.hash,['commentId']).commentId,//获取commentId，从前一个页面传递过来的
      targetType:GetQueryString(location.hash,['targetType']).targetType,//获取commentId，从前一个页面传递过来的
      detail:{},//详情中的具体数据
    }
  }
  componentDidMount(){
    console.log("this.state.commentId", GetQueryString(location.hash,['commentId','targetType']));
    //获取详情中的数据
    if(this.state.commentId){
      getService(API_PREFIX + `services/activity/comment/info/${this.state.targetType}/${this.state.commentId}`, data => {
        if (data.retCode === 1) {
          this.setState({ detail: data.root});
        }
      });
    }

  }
  //表单提交事件
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      console.log("this.state.detail:",this.state.detail);
      let body={
        commentType:this.state.detail.commentType,
        commentTypeId:this.state.detail.commentTypeId,
        targetId:this.state.detail.targetId,
        id:this.state.detail.id,
        content:this.state.detail.content,
        userId:this.state.detail.userId,
        revert:fieldsValue.replayId,
        replyComment:{
          commentType:this.state.detail.commentType,
          commentTypeId:this.state.detail.commentTypeId,
          targetId:this.state.detail.targetId,
          revert:fieldsValue.replayId,
          userId:window.sessionStorage.getItem('id'),//当前登录用户的id
        }


      }
      console.log("**********",body);
      postService(API_PREFIX + 'services/activity/comment/reply', body, data => {
        if (data.retCode == 1) {
          history.back()
        } else {
          message.error(data.retMsg);
        }
      });

    });
  }
  render(){
    const formItemLayout = {
      labelCol: {
        xs: { span: 14 },
        sm: { span: 8},
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 8 },
      },
    };
    //获取数据
    const { getFieldDecorator } = this.props.form;
    const data=this.state.detail;
    return(
        <div>
              <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="评论人"
                >
                  {
                    getFieldDecorator('userName',{initialValue:data.userName})(
                        <Input disabled/>
                    )
                  }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="名称"
                >
                  {
                    getFieldDecorator('targetName',{initialValue:data.targetName})(
                        <Input disabled/>
                    )
                  }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="类型"
                >
                  {
                    getFieldDecorator('commentTypeId',{initialValue:data.commentTypeId})(
                        <Input disabled/>
                    )
                  }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="图片"
                >
                  {
                    getFieldDecorator('imageUrl',{initialValue:data.imageUrl})(
                        <Input disabled/>
                    )
                  }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="评论内容"
                >
                  {
                    getFieldDecorator('content',{initialValue:data.content})(
                        <Input disabled/>
                    )
                  }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="创建时间"
                >
                  {
                    getFieldDecorator('createDate',{initialValue:data.createDate})(
                        <Input disabled/>
                    )
                  }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="回复"
                >
                  {
                    getFieldDecorator('replayId')(
                        <TextArea  />
                    )
                  }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="回复列表"
                >
                  {

                        data.commentList&&data.commentList.map((item,index)=>{
                          return <div>
                            <FormItem
                                {...formItemLayout}
                                label="回复人"
                            >
                              {
                                    <Input value={item.userName} disabled/>
                              }

                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="回复内容"
                            >
                              {
                                    <Input value={item.content} disabled/>
                              }
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="回复时间"
                            >
                              {
                                    <Input value={item.createDate} disabled/>
                              }

                            </FormItem>
                          </div>
                        })

                  }
                </FormItem>
                <Row>
                  <Col span={12} style={{textAlign: 'right'}}>
                    <Button className="queryBtn" type="primary" htmlType="submit">保存</Button>
                  </Col>
                  <Col span={12} style={{textAlign: 'left'}}>
                    <Button className="resetBtn" onClick={()=>history.back()}>返回</Button>
                  </Col>
                </Row>

              </Form>
        </div>
    );
  }
}
export default CommentDetail;