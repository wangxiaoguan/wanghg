import React, { Component } from 'react';
import { Form,  Input, Button, Checkbox,Select,Radio,InputNumber,message} from 'antd';
const FormItem = Form.Item;
@Form.create()
class NewArticle extends  Component{
constructor(props){
  super(props);
  this.state={
    newsTypeOptions:[],//文章类型(lookup字典中)
    showAuthorModal:false,//是否显示作者列表的modal
    keyAuthorModal:1,//否显示作者列表的modal,对应的key
  }
}
  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
  }
  dealData=()=>{
    //文章类型   lookup字典中的数据
    getService(API_PREFIX+'services/lookup/init/newsType',data=>{
      //返回数据处理
      this.dealLookup(data);
      this.setState({newsTypeOptions:data},()=>{
        console.log("newsTypeOptions",this.state.newsTypeOptions);
      });
    });

  }
  //处理lookup字典中的数据
  dealLookup(data){
    data.map((item,index)=>{
      item.key=item.code;
      item.value=item.desp;
    });
  }
  //添加作者:显示modal，获取到选择的内容，并设置给input输入框
  addAuthor=()=>{
    this.setState({
      showAuthorModal:true,
      keyAuthorModal:this.state.keyAuthorModal+1,
    });
    //获取
    let value=''
    //设置
    this.props.form.setFieldsValue({
      'author':value
    })
  }
//删除作者  将input框清空
  deleteAuthor=()=>{
    this.props.form.setFieldsValue({
      'author':'',  //置空
    })
}

render(){
  //设置formItem的格式
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 2 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };
  //获取数据
  const { getFieldDecorator } = this.props.form;
  //必填规则
  //设置表单中各个字段的要求
  const requiredConfig={
    type:{
      rules:[
        { required: true,
          message: '必填',
        },

      ],
    },
  };
  return(
      <div>
        <Form>
          <FormItem
              {...formItemLayout}
              label="资讯类型"
          >
            {
              getFieldDecorator('type',{...requiredConfig})
              (
                  <Select >
                    {
                      this.state.newsTypeOptions.map((item,index)=>{
                        return <Option key={index} value={item.code}>{item.desp}</Option>
                      })
                    }
                  </Select>
              )
            }

          </FormItem>
          <FormItem
              {...formItemLayout}
              label="文章标题"
          >
            {
              getFieldDecorator('title',{...requiredConfig})(
                  <Input />
              )
            }
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="文章摘要"
          >
            {
              getFieldDecorator('digest')(
                  <Input />
              )
            }
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="作者"
          >
            {
              getFieldDecorator('author')(
                 <div>
                   <Input />
                   <Button onClick={this.addAuthor()}>添加作者</Button>
                   <Button onClick={this.deleteAuthor()}>删除作者</Button>
                 </div>
              )
            }
          </FormItem>
        </Form>
        {/*<Modal>*/}
          {/**/}
        {/*</Modal>*/}
      </div>
  );

}

}
export default NewArticle;