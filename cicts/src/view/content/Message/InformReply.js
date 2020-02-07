import React, { Component } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { getService, postService } from '../myFetch';
import API_PREFIX, { API_FILE_VIEW, API_CHOOSE_SERVICE, API_FILE_VIEW_INNER } from '../apiprefix';
import Zmage from 'react-zmage';

import './InformReply.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const FormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const FormItemLayoutBmobile = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
/**
 * 举报管理处理窗口
 * id--举报消息id
 * replyHandler--处理成功后，回调的函数
 */
class InformReply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      reply:'',
    };
  }

  requestData() {
    if (this.props.id) {
      getService(API_PREFIX + `services/message/report/reportInfo/get/${this.props.id}/${this.props.targetId}`, (res) => {
        this.setState({ data: res.root.object, reply: null });
      });
    }
  }

  requestReply() {
    if (this.props.id) {
      //解决处理批注无法识别特殊字符问题 wkjj 2019.1.29
      const body = {postil:this.state.reply};
      postService(API_PREFIX + `services/message/report/updateDispose/${this.props.id}`, body, (res) => {
        this.afterDeal(res);
        if (res.retCode === 1) {
          this.setState({ reply:'' });  
        }
      });
    }
  }

  requestIgnore() {
    if (this.props.id) {
      const values = {postil:this.state.reply};
      postService(API_PREFIX + `services/message/report/updateNeglect/${this.props.id}`, values, (res) => {
        this.afterDeal(res);
        if (res.retCode === 1) {
          this.setState({ reply:'' });  
        }
      });
    }
  }

  afterDeal(res) {
    if (res.retCode === 1) {
      message.success('操作成功');
      this.close();
      if (this.props.replyHandler) {
        this.props.replyHandler();
      }
    }
    else {
      message.error(res.retMsg);
    }
  }

  show = () => {
    this.setState({ visible: true });
    this.requestData();
  }

  close = () => {
    this.setState({ visible: false });
    this.setState({ data: {} });
  }

  saveReply = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.close();
      this.setState({ loading: false });
    }, 1000);
  }

  render() {
    let { data } = this.state;
    let imgUrl = [];
    console.log('data==>',data)
    let ossViewPath = sessionStorage.getItem('ossViewPath') || API_FILE_VIEW
    if (!data) {
      data = {};
    }else if(JSON.stringify(data)!="{}"){
      console.log("data的值+++++++++",data)
      imgUrl=data.imageUrl&&JSON.parse(data.imageUrl)
    }
    console.log('imgUrl',imgUrl)
    return (
      <Modal className="InformReply" title="回复" visible={this.state.visible} onCancel={this.close} onOk={this.saveReply} confirmLoading={this.state.loading}
        footer={
          <div>
            <Button onClick={() => { this.close(); }}>返回</Button>
            <Button type="danger" onClick={() => {
              this.requestIgnore();
            }}>忽略</Button>
            <Button type="primary" onClick={() => {
              this.requestReply();
            }}>接受并处理</Button>
          </div>
        }
      >
        <Form>
          <FormItem label="被举报人" {...FormItemLayout}>
            <span>{data.bname}</span>
          </FormItem>
          <FormItem label="被举报人手机号" {...FormItemLayoutBmobile}>
            <span>{data.bmobile}</span>
          </FormItem>
          <FormItem label="举报人" {...FormItemLayout}>
            <span>{data.jname}</span>
          </FormItem>
          <FormItem label="举报人手机号" {...FormItemLayout}>
            <span>{data.jmobile}</span>
          </FormItem>
          <FormItem label="举报原因" {...FormItemLayout}>
            <span>{data.reason}</span>
          </FormItem>
          <FormItem label="举报描述" {...FormItemLayout}>
            <span>{data.describle}</span>
          </FormItem>
          
          {data.contenttype&&data.contenttype ==1?
            <FormItem label="举报内容" {...FormItemLayout}>
            <span>{data.content}</span>
          </FormItem>:null
          }
          <FormItem className="itemImage" label="举报图片" {...FormItemLayout}>
            {
              imgUrl && imgUrl.length > 0 ?
                imgUrl.map((item) => {
                  return (
                    <span>
                      {/* {
                        API_CHOOSE_SERVICE === 1 ? <Zmage src={ossViewPath + item} alt="" /> : <Zmage src={API_FILE_VIEW_INNER + item} alt="" />
                      } */}
                      <Zmage src={ossViewPath+item} alt="" />
                    </span>
                  );
                }) : <span>无图片</span>
            }
            {/* <Zmage src='http://yq-fiberhome-test.img-cn-hangzhou.aliyuncs.com/comment/activity/20181110091634952979.jpg' alt='' />> */}
          </FormItem>
          <FormItem label="处理批注" {...FormItemLayout}>
            <TextArea value={this.state.reply} maxLength={150} style={{ resize: 'none', height: 100 }} onChange={(event) => {
              this.setState({ reply: event.target.value.substr(0, 200) });
            }} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default InformReply;