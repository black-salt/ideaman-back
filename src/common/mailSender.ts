import nodemailer from 'nodemailer';
import { mailConfig } from '../config'


export const mailSender = (mailAddress: string, subject: string, content: string) => {
    
  const transporter = nodemailer.createTransport({
    host: mailConfig.mailHost,
    auth: {
      user: mailConfig.mailFrom,
      pass: mailConfig.mailPassWord //授权码,通过QQ获取
    }
  });
    
  const mailOptions = {
    from: mailConfig.mailFrom, // 发送者
    to: mailAddress, // 接受者
    subject: subject, // 标题
    text: content //内容error
  };
    
  return transporter.sendMail(mailOptions) //返回promise
}