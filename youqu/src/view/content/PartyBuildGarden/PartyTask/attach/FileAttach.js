import React, { Component } from 'react';
import { Form, Button,Row,Col,Select,Modal ,Input,Message,InputNumber,Upload } from 'antd';
import { connect } from 'react-redux';
import { BEGIN ,setFileAdd,setFileData} from '../../../../../redux-root/action';
import ServiceApi ,{masterUrl,PictrueUrl,UploadUrl,ChooseUrl,FileUrl,API_FILE_VIEW_INNER} from '../../../../content/apiprefix';
import './attach.less';
// let uploadFile = ServiceApi + 'services/attachment/file/upload/AttachmentUpload';
let uploadFile
if(ChooseUrl===2){
  uploadFile = FileUrl;
}else{
  uploadFile = UploadUrl + "/paty";
}
const Option = Select.Option;
@connect(state => ({
      getArticleAdd:state.articleAdd,
      getActivityAdd:state.activityAdd,

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
      flowData:this.props.flowData,
    }
  }
  componentDidMount(){
    // if(this.props.flowData){//不为空
    //   this.dealData(this.props.flowData);
    // }
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
        console.log('initialValuef',data);
        let fileArr=this.state.fileArr;
        let result=this.state.result;
        let fileData=this.state.fileData;
        let display=this.state.display;
        if(data&&data.length>0){//有数据 即为 上一步
          data.map((item,index)=>{
            this.setState({addId:index},()=>{
              fileArr.push({key:index});
              result.push({
                key: this.state.addId,name:item.name, url:item.url,size:item.size,

              });
              fileData.push({key:index,
                data:[{
                  uid:'-'+index,
                  name: item.name,
                  status: 'done',
                  url:item.url,
                }]});
              display.push(
                  {
                    key: index,
                    data:{url:item.url,display:true}
                  });
            });
          });

          this.setState({fileArr,result});
          this.props.setFileData(result);
          this.props.setFileAdd(fileArr); //向缓存中放数据
        }

  }
  //添加文件
  addFile=(e)=>{
      let fileArr=this.state.fileArr;
      let addId=this.state.addId+1;
      fileArr.push({key:addId});
     let all=[...this.props.getArticleAdd,...this.props.getActivityAdd,...fileArr];
     console.log('all',all,this.props.getArticleAdd,this.props.getActivityAdd,fileArr);
     if(all.length>5){
       Message.error('任务附件不能大于5个');
       return;
     }
     this.setState({addId,fileArr,addId});
      this.props.setFileAdd(fileArr);

  }
  //删除文件
  delFile=(e,key)=>{
    let fileArr=this.state.fileArr;
    let  result=this.state. result;
    console.log('删除前fileArr',fileArr);
    console.log('删除前 result', result);
     fileArr=fileArr.filter((item,index)=>{
      return item.key!=key;
    });
    result= result.filter((item,index)=>{
      return item&&item.key!=key;
    });
    console.log('删除后fileArr',fileArr);
    console.log('删除后 result', result);
    this.setState({fileArr, result},()=>{
      //往缓存中放数据
      this.props.setFileData( result);
      this.props.setFileAdd(fileArr);
    });
  }
  //文件上传之前    [jpg,jpeg,bmp,png,doc,docx,xls,xlsx,ppt,pptx,pdf]
  beforeUpload=(file,fileList,key)=>{
    const isPic=file.type === 'image/jpeg'||file.type === 'image/png'||file.type === 'image/bmp';
    const isDoc= file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'||file.type === 'application/msword';
    const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const isPPT=file.type==='application/vnd.openxmlformats-officedocument.presentationml.presentation'||file.type==='application/vnd.ms-powerpoint'
    const idPdf=file.type==='application/pdf'
    const isFile=isPic||isDoc||isExcel||isPPT||idPdf;
    if(!isFile){
      Message.error('文件类型不支持');
    }
    return isFile;
  }
  //上传过程中的变化过程
  handleChange=(info,fileList,key)=>{
    console.log("info222",info);
    const status=info.file.status;//文件的状态  有：uploading done error removed
    let fileData=this.state.fileData;
    let result=this.state.result;
    let display=this.state.display;//是否有下载预览按钮
    fileData= fileData.filter((item,index)=>{
      return item&&item.key!=key;
    });
    fileData.push({key:key,data:info.fileList.slice(-1)});
    this.setState({ fileData});
  if(status=='uploading'){
    }
    if(status=='done'){   //1、添加信息到 fileData中  2、向缓存中放数据 （data）
     
      console.log("info-done",info);
      if (info.file.response!=='') { //返回值为空  -----------------------------------------------------------
       console.log('88888');
        let temp=info.fileList.slice(-1);//返回的需要放在数据库中的值
        //删除重复的
        result= result.filter((item,index)=>{
          return item&&item.key!=key;
        });
        result.push(
            {
              key: key,name: temp[0].name, 
              url: PictrueUrl+masterUrl + '/' + temp[0].response.entity[0].filePath,
              size:Math.ceil(temp[0].size/1024),
              type:temp[0].response.entity[0].fileName.split('.')[1]=='jpg'||temp[0].response.entity[0].fileName.split('.')[1]=='jpeg'||temp[0].response.entity[0].fileName.split('.')[1]=='bmp'||temp[0].response.entity[0].fileName.split('.')[1]=='png'?3:5
            });
        //删除重复的
        display= display.filter((item,index)=>{
          return item&&item.key!=key;
        });
        display.push(
            {
              key: key,data:{url: masterUrl + '/' + temp[0].response.entity[0].filePath,display:true}
            });

        this.setState({result,display},()=>{
          this.props.setFileData(this.state.result);
        });
        Message.success(`${info.file.name}上传成功`);
      }else{
        Message.error('请检查接口状态！');
      }
    }
    if(status=='error'){
      console.log("info-error",info);
      Message.error(`${info.file.name} 上传失败`);
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
          </Button>
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

              console.log('show',show)
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
                 {ChooseUrl===2?<a href={show?API_FILE_VIEW_INNER + show.url:''} style={{display:show&&show.display?'inline-block':'none'}}  target="_blank">下载预览</a>:
                 <a href={show?PictrueUrl + show.url:''} style={{display:show&&show.display?'inline-block':'none'}}  target="_blank">下载预览</a>
                 }
                <Button onClick={(e)=>this.delFile(e,item.key)} disabled={disabled}>删除</Button>
              </div>
            })
          }
        </div>
    );
  }
}