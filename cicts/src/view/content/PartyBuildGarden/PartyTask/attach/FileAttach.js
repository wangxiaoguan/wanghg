import React, { Component } from 'react';
import { Form, Button,Row,Col,Select,Modal ,Input,message,InputNumber,Upload } from 'antd';
import { connect } from 'react-redux';
import { BEGIN } from '../../../../../redux-root/action/table/table';
import API_PREFIX ,{masterUrl,API_FILE_VIEW,API_FILE_UPLOAD,API_CHOOSE_SERVICE,API_FILE_UPLOAD_INNER,API_FILE_VIEW_INNER} from '../../../../content/apiprefix';
import {setFileAdd,setFileData} from '../../../../../redux-root/action/attach/attach';
import './attach.less';
// let uploadFile = API_PREFIX + 'services/attachment/file/upload/AttachmentUpload';
let uploadFile
if(API_CHOOSE_SERVICE===2){
  uploadFile = API_FILE_UPLOAD_INNER;
}else{
  uploadFile = API_FILE_UPLOAD + "/paty";
}
const Option = Select.Option;
@connect(state => ({
      getArticleAdd:state.attach.articleAdd,
      getActivityAdd:state.attach.activityAdd,

    }),
    dispatch => ({
      setTableData: n => dispatch(BEGIN(n)),
      setFileData:n=>dispatch(setFileData(n)),
      setFileAdd:n=>dispatch(setFileAdd(n)),
    }))
export default class FileAttach extends  Component {
  constructor(props){
    super(props);
    this.state={
      fileArr:[],//添加文件的arr
      addId:0,
      fileData:[],//添加完成后的数据  {key:addId,name:filename,url:fileUrl}
      all:[],//全部的附件信息，用于判断附件是否已经是5个
      result:[],
      initialValue:this.props.initialValue,
      display:[],//是否有下载预览按钮，
      flowData:[],
      ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW, //根据登陆人员来获取oss地址
    }
  }
  componentDidMount(){
  }
  componentDidUpdate(){
    if (this.props.initialValue&&this.props.initialValue !== this.state.initialValue) {
      this.setState({initialValue: this.props.initialValue}, () => {
        //总的数据，返回上一步，父组件传入的 initialValue
        let initialValue = this.state.initialValue;
        //页面相关的数据处理
        this.dealData(initialValue);
      });
    }
    if (this.props.flowData&&this.props.flowData !== this.state.flowData) {
      this.setState({flowData: this.props.flowData}, () => {
        //总的数据，返回上一步，父组件传入的 initialValue
        let flowData = this.state.flowData;
        //页面相关的数据处理
        this.dealData(flowData);
      });
    }

  }
  dealData=(data)=>{
    if(this.props.fileAttachFlag) {
        return
    }
        let fileArr=this.state.fileArr;
        let result=this.state.result;
        let fileData=this.state.fileData;
        let display=this.state.display;
        if(data&&data.length>0){//有数据 即为 上一步
          data.map((item,index)=>{
              if(item.attachType != 1 && item.attachType != 2) {
                fileArr.push({key:index});
                result.push({
                  key: index,
                  name:item.fileName,
                  url:item.attachUrl,
                  size:item.fileSize,
                  type:item.attachType
                });
                fileData.push({key:index,
                  data:[{
                    uid:'-'+index,
                    name: item.fileName,
                    status: 'done',
                    url:item.attachUrl,
                  }]});
                display.push(
                  {
                    key: index,
                    data:{url:item.attachUrl,display:true}
                  });
              }
          });
          this.setState({fileArr,result,addId:(data.length)-1});
          this.props.setFileData(result);
          this.props.setFileAdd(fileArr); //向缓存中放数据
        }

  }
  //添加文件
  addFile=(e)=>{
      let fileArr=this.state.fileArr;
      let addId=this.state.addId+1;
      if(fileArr.length>4){
        message.error('任务附件不能大于5个');
        return;
      }else{
        fileArr.push({key:addId});
      }

     let all=[...this.props.getArticleAdd,...this.props.getActivityAdd,...fileArr];
    //  if(all.length>=5){
    //    message.error('任务附件不能大于5个');
    //    return;
    //  }
     this.setState({addId,fileArr,addId});
      this.props.setFileAdd(fileArr);

  }
  //删除文件
  delFile=(e,key)=>{
    let fileArr=this.state.fileArr;
    let  result=this.state. result;
     fileArr=fileArr.filter((item,index)=>{
      return item.key!=key;
    });
    result= result.filter((item,index)=>{
      return item&&item.key!=key;
    });
    this.setState({fileArr, result},()=>{
      //往缓存中放数据
      this.props.setFileData( result);
      this.props.setFileAdd(fileArr);
    });
  }
  //文件上传之前    [jpg,jpeg,bmp,png,doc,docx,xls,xlsx,ppt,pptx,pdf]
  beforeUpload=(file,fileList,key)=>{
    const fileNameArr = file.name.split('.');
    const fileName = fileNameArr[fileNameArr.length-1].toUpperCase();
    const isSuffix = fileName==='JPG' || fileName==='JPEG' || fileName==='BMP' || fileName==='PNG' || fileName==='DOC' || fileName==='DOCX' ||fileName==='XLS' || fileName==='XLSX' || fileName==='PPT' || fileName==='PPTX' || fileName==='PDF';

    const isPic=file.type === 'image/jpeg'||file.type === 'image/png'||file.type === 'image/bmp';
    const isDoc= file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'||file.type === 'application/msword';
    const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const isPPT=file.type==='application/vnd.openxmlformats-officedocument.presentationml.presentation'||file.type==='application/vnd.ms-powerpoint'
    const idPdf=file.type==='application/pdf'
    const isFile=isPic||isDoc||isExcel||isPPT||idPdf||isSuffix;
    if(!isFile){
      message.error('文件类型不支持');
    }
    return isFile;
  }
  //上传过程中的变化过程
  handleChange=(info,fileList,key)=>{
    const status=info.file.status;//文件的状态  有：uploading done error removed
    let fileData=this.state.fileData;
    let result=this.state.result;
    let display=this.state.display;//是否有下载预览按钮
    fileData= fileData.filter((item,index)=>{
      return item&&item.key!=key;
    });
    fileData.push({key:key,data:info.fileList.slice(-1)});
    this.setState({ fileData});
    console.log('豪机构据我估计我饿哦及工务局哦感觉', info)
  if(status=='uploading'){
    }
    if(status=='done'){   //1、添加信息到 fileData中  2、向缓存中放数据 （data）
      if (info.file.response!=='') { //返回值为空  -----------------------------------------------------------
        if(info.file.response.status == 1) {
          message.success(`${info.file.name}上传成功`);
          let temp=info.fileList.slice(-1);//返回的需要放在数据库中的值
          //删除重复的
          result= result.filter((item,index)=>{
            return item&&item.key!=key;
          });
          result.push(
              {
                key: key,name: temp[0].name, 
                url: `${temp[0].response.root.object[0].filePath}`, //yelu 修改，无用的masterUrl, 导致路径多了个/
                size:temp[0].size/1024,
                type:temp[0].response.root.object[0].fileName.split('.')[1]=='jpg'||temp[0].response.root.object[0].fileName.split('.')[1]=='jpeg'||temp[0].response.root.object[0].fileName.split('.')[1]=='bmp'||temp[0].response.root.object[0].fileName.split('.')[1]=='png'?3:5
              });
          //删除重复的
          display= display.filter((item,index)=>{
            return item&&item.key!=key;
          });
          display.push(
              {
              //   key: key,data:{url: masterUrl + '/' + temp[0].response.root.object[0].filePath,display:true,size:temp[0].size/1024}
                  key: key,data:{url: temp[0].response.root.object[0].filePath,display:true,size:temp[0].size/1024}  //yelu 修改，无用的masterUrl, 导致路径多了个/
              });

          this.setState({result,display},()=>{
            this.props.setFileData(this.state.result);
          });
          // info.fileList = info.fileList.map(item => {
          //   item.url = this.state.ossViewPath + item.response.root.object[0].filePath
          // })
        }else {
          message.error(info.file.response.errorMsg)
        }
      }else{
        message.error('请检查接口状态！');
      }
    }
    if(status=='error'){
      message.error(`${info.file.name} 上传失败`);
    }
    if(status=='removed'){  //1、将文件信息从 fileData中移除   2、删除对应的组件（同delete） 3、向缓存中放数据（add,data）
      this.delFile('',key);
    }

  }
  render(){
    const {fileArr,fileData,display}=this.state;
   const {disabled}=this.props;
    return(
        <div className="FileAttch">
          <Button onClick={this.addFile}  disabled={disabled}>
            添加文件
          </Button> <span>可以支持的类型：jpg,jpeg,bmp,png,doc,docx,xls,xlsx,ppt,pptx,pdf</span>
          {
            fileArr&&fileArr.map((item,index)=> {
              let list;
              fileData&&fileData.map((m)=>{
                if(m.key==item.key){
                  list=m.data
                }
              })
              let show;
              display&&display.map((i)=>{
                if(i.key==item.key){
                  show=i.data;
                }
              });
              return <div key={item.key} className="attach-main">
                 <Upload
                     key={'upload' + item.key}
                     name='file'
                     action={uploadFile}
                     beforeUpload= {(file)=>this.beforeUpload(file,[],item.key)}
                     onChange={(info)=>this.handleChange(info,[],item.key)}
                     fileList={list}

                 >
                     <Button style={{width:100}} disabled={disabled}>浏览...</Button>
                 </Upload>
                 {console.log(show)}
                 {API_CHOOSE_SERVICE===1?<a href={show?show.url.indexOf('http')>-1?show.url:this.state.ossViewPath + show.url:''} style={{display:show&&show.display?'inline-block':'none'}}  target="_blank">下载预览</a>:
                 <a href={show?show.url.indexOf('http')>-1?show.url:API_FILE_VIEW_INNER + show.url:''} style={{display:show&&show.display?'inline-block':'none'}}  target="_blank">下载预览</a>
                 }
                <Button onClick={(e)=>this.delFile(e,item.key)} disabled={disabled}>删除</Button>
              </div>
            })
          }
        </div>
    );
  }
}