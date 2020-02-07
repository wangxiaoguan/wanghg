/**
 * Created by xhw on 2018/11/20 15:46
 */
import React from 'react'
import {Form, Input, Button} from 'antd'
import Zmage from 'react-zmage';
import {API_FILE_VIEW, API_FILE_VIEW_INNER, API_CHOOSE_SERVICE} from '../../apiprefix';
import './index.less'

// const logo_WC = require('../../../../styles/images/login/suggest.png');
// 'http://yq-fiberhome-test.img-cn-hangzhou.aliyuncs.com//suggestion/20181116213335812982.jpeg'

const SuggestDetail = ({
  form: {
    getFieldDecorator,
    validateFields,
  },
  ...modalProps
}) => {
  const {onOk, onCancel, detailData, onReply, onTransfer, isReply, replyPower} = modalProps
  console.log("=== detailData ===", JSON.stringify(detailData))
  let imgs
  if (detailData.imageUrl) {
    imgs = JSON.parse(detailData.imageUrl);
  }

  const handleOk = () => {
    validateFields((error, value) => {
      if (error) {
        return
      }
      let userId = window.sessionStorage.getItem('id');
      onOk({
        id: detailData.id,
        replyContent: value.content,
        replyId: userId
      })
    })
  }

  return (
    <div className="container">
      <div className="twoCol">
        <div className="left">
          <span>{'用户名：'}</span>
          <span>{detailData.name}</span>
        </div>
        <div>
          <span>{'手机号：'}</span>
          <span>{detailData.phoneNumber}</span>
        </div>
      </div>
      <div className="twoCol">
        <div className="left">
          <span>{'建言类型：'}</span>
          <span>{detailData.suggestStatusDesp}</span>
        </div>
        <div>
          <span>{'建言时间：'}</span>
          <span>{detailData.createDateString}</span>
        </div>
      </div>
      <div className="desp">
        <span>{'意见描述：'}</span>
        <span>{detailData.suggestContent}</span>
      </div>
      <div className="twoCol" style={{paddingBottom: 10}}>
        <span>{'图片：'}</span>
        {imgs && imgs.length > 0 && imgs.map((item, index) =>
          <div className="suggestImg" key={`suggest_${index}`}>
            {API_CHOOSE_SERVICE === 1 ?
              <Zmage className="img" key={index} src={item} alt=""/> :
              <Zmage className="img" key={index} src={item} alt=""/>
            }
          </div>
        )}
      </div>
      {detailData.replyName && <div className="desp">
        <span>{'回复人：'}</span>
        <span>{detailData.replyName}</span>
      </div>}
      {detailData.replyContent && <div className="desp">
        <span>{'回复：'}</span>
        <span>{detailData.replyContent}</span>
      </div>}
      {detailData.suggestStatus === "2" && !(detailData.replyContent && detailData.replyName) &&
      <div className="footer" style={{marginBottom: 28}}>
        <Button className="button" style={{color: '#B2B3BE'}} disabled={!replyPower} onClick={onReply}>回复</Button>
        <Button className="button" style={{marginLeft: 26, color: '#B2B3BE'}} disabled={!replyPower} onClick={() => onTransfer(detailData.id)}>转发主席</Button>
      </div>}
      {(detailData.suggestStatus === '1' || (detailData.suggestStatus === '2' && isReply)) && !(detailData.replyContent && detailData.replyName) &&
      <div>
        <div className="twoCol">
          <span>{'回复：'}</span>
          <Form layout="vertical" className="reply">
            <Form.Item >
              {getFieldDecorator('content', {
                rules: [
                  {
                    message: '请输入您的回复',
                    required: true,
                    whitespace: true
                  }
                ]
              })(
                <Input.TextArea className="reply" rows={4} autosize={{minRows: 4, maxRows: 4}}
                                maxLength={'250'} placeholder="请输入..."/>
              )}
            </Form.Item>
          </Form>
        </div>
        <div className="footer">
          <Button className="button" style={{color: '#B2B3BE'}} onClick={onCancel}>取消</Button>
          <Button className="button" style={{marginLeft: 26}} type="primary" disabled={!replyPower}
                  onClick={handleOk}>{detailData.suggestStatus === "2" ? '提交' : '回复'}</Button>
        </div>
      </div>}
    </div>
  )
}

export default Form.create()(SuggestDetail)
// 服务器把图片url存死了 ip:port/.../xxx/suggestion/imgName.jpg
// src={API_FILE_VIEW + 'suggestion/' + item}
// src={API_FILE_VIEW_INNER + 'suggestion/' + item}