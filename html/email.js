'use strict';
 
const nodemailer = require('nodemailer');
 
let transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    user: '这里写上你的邮箱',//你的邮箱
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: '这里写上你的授权码',
  }
});
let mailOptions = {
  from: '"晨之曦" <1870096555@qq.com>', // 这里写上你自己的邮箱
  to: '974013984@qq.com', // 这里写上要发送到的邮箱
  subject: '热寂验证码', // Subject line
  html: '<b>验证码为：456786 5分钟内有效</b>' // html body
};
 
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
});