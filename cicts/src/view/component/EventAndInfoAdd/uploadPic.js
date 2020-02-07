import React, { Component } from 'react';
import { Upload, Message, Icon, Button, Modal, Input,Popconfirm} from'antd';
import API_PREFIX,{API_FILE_VIEW,API_FILE_UPLOAD,API_CHOOSE_SERVICE,API_FILE_UPLOAD_INNER,API_FILE_VIEW_INNER} from '../../content/apiprefix';
import { setUploadPicture, setUploadContentPicture} from '../../../redux-root/action/upload/uploadPicture';
const Dragger = Upload.Dragger;
import {exportExcelService} from '../.././content/myFetch';
import './addStyle.less';
import { connect } from 'react-redux';
@connect(
  state => ({
    uploadData: state.uploadPicture.uploadPictureData,
  }),
  dispatch => ({
    setUploadPicture: n => dispatch(setUploadPicture(n)),
    setUploadContentPicture: n => dispatch(setUploadContentPicture(n)),
  })
)
export default class UploadWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentList: [],
      img_review: false,
      img_array: [],
      img_preview:[],
      img_previewName:[],
      addKey: 0,
      uploadTitleList: [],
      totalList:[],
      current: '',
      currentName:'',
      currentInput: [],
      initialValue: [],
      isRadio:false,//是否是视频
      isIamge:false,//是否是图片
      isAttach:false,
      fileName:'',//下载时的文件名
      ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW, //根据登陆人员来获取oss地址
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.initialValue !== state.initialValue) {
      return { initialValue: props.initialValue };
    }
    return null;
  }
  //下载
  onDownLoad(url){
    exportExcelService(url, null,this.state.fileName);
  }
  setUploadTitle = (e) => {
    let {uploadTitleList,totalList} = this.state;
    if(e===3){
      this.setState({uploadTitleList:totalList})
    }else{
      this.setState({uploadTitleList:totalList.slice(0,1)})
    }
  }
  dealFiles = files =>{
    let data = [];
    if(Array.isArray(files)){
      files && files.map((item, index) => {
        // if (item.type == '4') {
          // data.push({ response: { root: {object:[{ filePath: item.url, fileName:item.name }] }}, describe: item.desp,id:item.id});
        // } else if (item.type == '3') {
          data.push({size:item.size,type:item.type, response: { root: {object:[{ filePath: item.url,fileName:item.name }] }}, describe: item.desp, id: item.id });
        // }
      });
      return data;
    }else{
      return files;
    }
    
  }
  componentDidMount() {
    const props = this.props;
    window.setUploadTitle = this.setUploadTitle

    if(API_CHOOSE_SERVICE==1){
      if(this.props.modal=='event'){
        this.setState({
            uploadPicture:API_FILE_UPLOAD + '/activity',
        });
      }else{
          this.setState({
              uploadPicture:API_FILE_UPLOAD + '/news',
          });
      }
    }else{
      if(this.props.modal=='event'){
        this.setState({
            uploadPicture:API_FILE_UPLOAD_INNER,
        });
      }else{
          this.setState({
              uploadPicture:API_FILE_UPLOAD_INNER ,
          });
      }
    }

    let { initialValue } = this.state;
    if(props.keys === 'contentImage'&&props.modal === 'information'&&props.style ==='add'){
      initialValue =this.dealFiles(initialValue);
    }
    if (initialValue && Array.isArray(initialValue)&&initialValue.length>0) {
      /**
       * 处理拖拽图片
       */

      if(API_CHOOSE_SERVICE==1){
        if (this.props.type === 'uploadPicture_drop') {
          let titleimage=initialValue[0];
          if(titleimage.indexOf(';')>0){
            initialValue=titleimage.split(';');
          }
          let defaultList = [];
          initialValue.map((item, index) => {
            defaultList.push({
              uid: index,
              url: this.state.ossViewPath + item,
            });
          });
          this.setState({
            uploadTitleList: defaultList,totalList:defaultList
          });
        }
  
        /**
         * 处理按钮图片
         */
        else{
          let currentInput = [];
          let content = [];
          let img_preview = [];
          let img_previewName = [];
          console.log("initialValue",initialValue);
          initialValue.map((item,index) => {
            if(Array.isArray(item)){
              item[0].id = index;
              if (item[0].describe) {
                currentInput[index] = item[0].describe;
              }
              this.setState({fileName:item[0].response.root.object[0].fileName});
              content[index] = [{ name: item[0].response.root.object[0].fileName, uid: index, response:item[0].response}];
              // content[index]=item[0].response.root.object[0].fileName
              img_preview[index] = item[0].response.root.object[0].filePath;
              img_previewName[index] = item[0].response.root.object[0].fileName;

            }else{
              item.id = index;
              if (item.describe) {
                currentInput[index] = item.describe;
              }
              
              console.log("2222222",item.response.root);
              if(item.response.root){
                this.setState({fileName:item.response.root.object[0].fileName});
              content[index] = [{ name: item.response.root.object[0].fileName, uid: index, response:item.response}];
              // content[index]=item.response.root.object[0].fileName
              img_preview[index] = item.response.root.object[0].filePath;
              img_previewName[index] = item.response.root.object[0].fileName;
              }else{
                this.setState({fileName:item.response.object[0].fileName});
                content[index] = [{ name: item.response.object[0].fileName, uid: index, response:item.response}];
                // content[index]=item.response.root.object[0].fileName
                img_preview[index] = item.response.object[0].filePath;
                img_previewName[index] = item.response.object[0].fileName;
              }
            }
          });



          this.setState({ img_array: initialValue, currentInput, contentList: content, img_preview,addKey:content.length,img_previewName });
        }
      }else{
        if (this.props.type === 'uploadPicture_drop') {
          let defaultList = [];
          initialValue.map((item, index) => {
            defaultList.push({
              uid: index,
              url: API_FILE_VIEW_INNER + item,
            });
          });
          this.setState({
            uploadTitleList: defaultList,totalList:defaultList
          });
        }
  
        /**
         * 处理按钮图片
         */
        else{
          let currentInput = [];
          let content = [];
          let img_preview = [];
          let img_previewName= [];
          initialValue.map((item,index) => {
            item.id = index;
            if (item.describe) {
              currentInput[index] = item.describe;
            }
            this.setState({fileName:item.response.root.object[0].fileName});
            content[index] = [{ name: item.response.root.object[0].fileName, uid: index, response:item.response}];
            // content[index]=item.response.root.object[0].fileName
            img_preview[index] = item.response.root.object[0].filePath;
            img_previewName[index] = item.response.root.object[0].fileName;
          });
          this.setState({ img_array: initialValue, currentInput, contentList: content, img_preview,addKey:content.length,img_previewName });
        }
      }
    }
  }
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  addImg = () => {
    const { img_array, addKey } = this.state;
    if(this.props.datatype=='partylearn'){
      if(img_array.length>4){
              Message.error('上传的文件不能超过5个');
              return;
          }
    }
    if(this.props.datatype=='video'){
      if(img_array.length>0){
              Message.error('内容图片为1张');
              return;
          }
    }
    if(this.props.Magazinetype&&this.props.Magazinetype==="MagazineManagementArticle"){
      if(img_array.length>0){
        Message.error('首页图片为1张');
        return;
    }
    }
    if(this.props.datatype=='votepicture'){
      if(this.state.img_array.length>50){
        Message.error('添加图片最多为50张');
        return false;
      }
    }
    this.setState({ addKey: addKey + 1 });
    img_array.push({ id: addKey });
    this.setState({ img_array });
  };
  handleCancel = () => this.setState({ previewVisible: false })
  describeChange = (e, key) => {
    let content = this.state.contentList;
    let img_array= this.state.img_array;
    if(e.target.value.length>100){
      Message.warning('描述字数不得超过100');
    }
    if (content[key]) {
      content[key][0].describe = e.target.value.substring(0,100);
    }else{
      content = [{ [key]: [{ describe: e.target.value.substring(0,100)}]}];
    }
    let currentInput = this.state.currentInput;
    currentInput[key] = e.target.value.substring(0,100);
    this.setState({ currentInput, contentList: content });
    this.props.setUploadContentPicture({key,content:content[key][0],type:this.props.keys});
    for(let i=0;i<img_array.length;i++){
      if(img_array[i].id==key){
        img_array[i].describe=e.target.value.substring(0,100);
      }
    }
    content = content.filter(item=>Array.isArray(item));
    for(let i=0;i<img_array.length;i++){
      if(!(img_array[i].response)){
        img_array[i]['response']=content[i][0].response;
      }
    }
    this.setState({img_array});
    this.props.editpicUrl && this.props.editpicUrl(img_array); // yelu 过滤没有传editpicUrl函数的页码报错
  };
  componentWillUnmount(){
    this.props.setUploadPicture([]);
    this.props.setUploadContentPicture({});
  }
  deleteImg = key => {
    const { contentList, img_preview, currentInput,img_previewName } = this.state;
    let img_array = [...this.state.img_array];
    img_array = img_array.filter(item=>item.id !==key);
    delete img_preview[key];
    delete img_previewName[key];
    delete contentList[key];
    delete currentInput[key];
    let content = [...contentList];
    this.props.setUploadContentPicture({ key: key, content: content[key], type: this.props.keys });
    this.setState({ contentList, img_preview, currentInput,img_previewName});
    content = content.filter(item=>Array.isArray(item));
    for(let i=0;i<img_array.length;i++){
      if(!(img_array[i].response)){
        img_array[i]['response']=content[i]&&content[i][0].response;
      }
    }
    this.setState({img_array});
    this.props.getpicUrl && this.props.getpicUrl(img_array);// yelu 过滤没有传getpicUrl函数的页码报错
    this.props.editpicUrl && this.props.editpicUrl(img_array);// yelu 过滤没有传editpicUrl函数的页码报错
  };
  getUploadURL = content => {
    return content.map(item => {
      return (item[0] = item[0].response.root.object[0].filePath);
    });
  };
  beforeUpload = (file) => {
    if(file.size>20*1024*1024){
      Message.error('上传文件的大小不能超过20M');
      return false;
    }
    //压缩格式7z rar  类型为空
    let  zipReg=/^(zip|rar|7z)$/ig;
    let isZip;
    if(!file.type){
      let zip=file.name.split('.')[1];
      isZip =zipReg.test(zip);
    }
    // const isZip=file
    const isPic=file.type === 'image/jpeg'||file.type === 'image/png'||file.type === 'image/bmp'||file.type === 'image/gif';
    const isDoc= file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'||file.type === 'application/msword';
    const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const isPPT=file.type==='application/vnd.openxmlformats-officedocument.presentationml.presentation'||file.type==='application/vnd.ms-powerpoint';
    const idPdf=file.type==='application/pdf';
    const isVideo = file.type === 'video/mp4';
    let limit=isPic||isDoc||isExcel||isPPT||idPdf||isVideo;
    if (this.props.mode ==='视频上传') {
          if (!limit) {
            Message.error('仅支持上传MP4格式视频文件!');
            return false;
          }
        } else if (this.props.mode === '上传附件') {
          // if(!limit){
          //   Message.error('文件类型不支持');
          //   return false;
          // }
      
        }else if(this.props.mode === '学习附件'){
          // if(!limit){
          //   Message.error('文件类型不支持');
          //   return false;
          // }
        }else{
         
          if (!isPic) {
            Message.error('仅支持上传JPG/JPEG/PNG/GIF格式图片!');
          }
          // const isLt2M = file.size / 1024 / 1024 < 2;
          // if (!isLt2M) {
          //   Message.error('图片尺寸大小必须小于2MB!');
          // }
        }

        // if(!limit){
        //   Message.error('文件类型不支持');
        //   return false;
        // }
    
    

  
    
    
    // return isFile;
  
    // const isJPG = file.type === 'image/jpeg';
    // const isPNG = file.type === 'image/png';
    // const isGIF = file.type === 'image/gif';
    // const isVideo = file.type === 'video/mp4';
    // let limit=true;
    // if (this.props.mode ==='视频上传') {

    //   limit = isVideo;
    //   if (!isVideo) {
    //     Message.error('仅支持上传MP4格式视频文件!');
    //   }
    // } else if (this.props.mode === '上传附件') {
    //   limit = true;
    // }else if(this.props.mode === '学习附件'){
    //   limit = true;
    // }else{
    //   limit = (isPic)&& isLt2M;
    //   if (!isPic) {
    //     Message.error('仅支持上传JPG/JPEG/PNG/GIF格式图片!');
    //   }
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!isLt2M) {
    //     Message.error('图片尺寸大小必须小于2MB!');
    //   }
    // }
    // return limit;
  }
  render() {
    const {
      uploadTitleList,
      contentList,
      currentInput,
      previewVisible,
      previewImage,
      img_preview,
      img_previewName,
      ossViewPath,
    } = this.state;
    const { initialValue, flowData, uploadData, describe, isAttach,isRadio,isIamge } = this.props;
    let isUpload =
      (uploadData[this.props.keys] && uploadData[this.props.keys].length > 0) ||
      (initialValue && initialValue.length > 0) ||
      (flowData && flowData.length > 0);
    let defaultValue = uploadData[this.props.keys]
      ? uploadData[this.props.keys]
      : initialValue
        ? this.state.current
        : '';
    const props = {
      accept:'image/*',
      key: 'dropUpload',
      name: 'file',
      multiple: true,
      action: this.state.uploadPicture,
      listType: 'picture-card',
      fileList: this.state.uploadTitleList,
      onPreview: this.handlePreview,
      beforeUpload: this.beforeUpload,
      // showUploadList:false,
      onChange: info => {
        console.log('888888888888888888888888888888888888888888888888888888888888', info)
        if(info.fileList.length>=4){
          Message.error('标题图片最多3张');
          return;
        }
        if(info.file.size>1024*1024*2){
          Message.error('图片大小不得超过2M');
          return;
        }
        const status = info.file.status;
        let fileList = [...info.fileList];
        if(this.props.RadioValue!==3){
          fileList = fileList.slice(-1);
        }
        this.setState({ uploadTitleList: fileList,totalList:fileList });
        if (!status) {
          fileList.slice(0);
          fileList.splice(fileList.length-1,1);
          this.setState({ uploadTitleList: fileList,totalList:fileList });
        }
        if (status === 'uploading') {
          //
          if (info.file.response === '') {
            Message.error('请检查接口状态！');
          }
        }
        if (status === 'removed') {
          delete uploadTitleList[0];
          let content = [...uploadTitleList];
          this.props.setUploadPicture({[this.props.keys]: fileList});
        }
        if (status === 'done') {
          if (info.file.response!=='') {
            if(info.file.response.status == 1) {
              Message.success(`${info.file.name}上传成功。`);
              this.setState({ uploadTitleList: fileList,totalList:fileList});
              this.props.setUploadPicture({
                [this.props.keys]: fileList,
              });
            }else {
              Message.error(info.file.response.errorMsg);
              this.setState({ uploadTitleList: [],totalList:[] });
            }
          }else{
            Message.error('请检查接口状态！');
            this.setState({ uploadTitleList: [],totalList:[] });
          }
        } else if (status === 'error') {
          Message.error(`${info.file.name} 上传失败。`);
        }
      },
    };

    return (
      <div>
        {this.props.type === 'uploadPicture_drop' ? 
        (this.props.disabled?
        <Button
          onClick={() =>{
            this.setState({ img_review: isIamge?true:false,isAttach:isAttach?true:false,isRadio:isRadio?true:false,current: this.props.titleimage });
          }}
        >
          查看</Button>:
          (
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text" style={{textDecoration: 'underline'}}>{'点击或拖拽上传文件'}</p>
              {this.props.magazineType&&this.props.magazineType==='magazine'?<p className="ant-upload-text" style={{color:'#aaa',fontSize:'12px'}}>{'图片建议尺寸420*570像素'}</p>:null}
              {this.props.magazineType&&this.props.magazineType==='magazine1'?<p className="ant-upload-text" style={{color:'#aaa',fontSize:'12px'}}>{'图片建议尺寸570*420像素'}</p>:null}
            </Dragger>
          )
        )
         : this.props.type === 'uploadPicture_button' ? (
          <div>
            {(this.props.disabled||this.props.activeKey==1||this.props.activeKey==2)?null:
              <Button onClick={this.addImg}>
                {describe ? '添加图片' : '添加文件'}
              </Button>
            }
            {describe ? '' :this.props.datatype=='partylearn'? '可以支持的类型：jpeg,jpg,png,bmp,gif,doc,docx,xls,xlsx,ppt,pptx,pdf':this.props.datatype=='video'? '可以支持的类型：jpeg,jpg,png,bmp,gif':
            this.props.Magazinetype==="MagazineManagementArticle"?'可以支持的类型：jpg、jpeg、png、gif':'可以支持的类型：jpeg,jpg,png,bmp,gif,doc,docx,xls,xlsx,ppt,pptx,pdf,txt'
          }

            {this.state.img_array.map(item => {
              return (
                <div key={item.id} style={{ display: 'flex' }}>
                  <Upload
                    accept={this.props.mode ==='视频上传'?'video/*':this.props.mode === '上传附件'||this.props.mode === '学习附件'?'txt/*':'image/*'}
                    key={'upload' + item.id}
                    name="file"
                    multiple={true}
                    action={this.state.uploadPicture}
                    fileList={contentList[item.id]}
                    beforeUpload= {this.beforeUpload}
                    onChange={info => {
                      /**
                       * 朱劲松 2018-12-11
                       * 修改‘党建学习管理，学习附件上传.xls不支持’ BUG 2066
                       */
    const fileNameArr = info.file.name.split('.');
    const fileName = fileNameArr[fileNameArr.length-1].toUpperCase();
    const isSuffix = fileName==='JPG' || fileName==='JPEG' || fileName==='BMP' || fileName==='PNG' || fileName==='DOC' || fileName==='DOCX' ||fileName==='XLS' || fileName==='XLSX' || fileName==='PPT' || fileName==='PPTX' || fileName==='PDF';

                      const isPic=info.file.type === 'image/jpeg'||info.file.type === 'image/png'||info.file.type === 'image/bmp'||info.file.type === 'image/gif';
                      const isDoc= info.file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'||info.file.type === 'application/msword';
                      const isExcel = info.file.type === 'application/vnd.ms-excel' || info.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                      const isPPT=info.file.type==='application/vnd.openxmlformats-officedocument.presentationml.presentation'||info.file.type==='application/vnd.ms-powerpoint';
                      const idPdf=info.file.type==='application/pdf';
                      const isTxt=info.file.type==='text/plain';
                      const isVideo = info.file.type === 'video/mp4';
                      
                      let limit=isPic||isDoc||isExcel||isPPT||idPdf||isVideo||isTxt||isSuffix; //新增判断
                      let limit2=isPic||isDoc||isExcel||isPPT||idPdf||isSuffix;//党建学习 新增判断
                      if(this.props.datatype=='partylearn'&&!limit2){
                        Message.error('文件类型不支持');
                        return ;
                      }
                      if(!limit){
                        Message.error('文件类型不支持');
                        return ;
                      }
                      const status = info.file.status;
                      let fileList = [...info.fileList];
                      fileList = fileList.slice(-1);
                      if (currentInput[item.id]) {
                        fileList[0] = {
                          ...fileList[0],
                          ...{ describe: currentInput[item.id] },
                        };
                        contentList[item.id] = fileList;
                      } else {
                        contentList[item.id] = [...fileList];
                      }
                      if (status === 'removed') {
                        delete contentList[item.id];
                        delete img_preview[item.id];
                        delete img_previewName[item.id];
                        delete currentInput[item.id];
                        this.deleteImg(item.id);
                        let content = [...contentList];
                        this.props.setUploadContentPicture({ key: item.id, content: content[item.id], type: this.props.keys});
                      }
                      this.setState({ contentList });
                      if (status === 'uploading') {
                        //
                        if (info.file.response === '') {
                          Message.error('请检查接口状态！');
                        }
                      }
                      if (status === 'done') {
                        if (info.file.response !== '') {
                          Message.success(`${info.file.name}上传成功。`);
                          this.setState({fileName:info.file.name});
                          if (currentInput[item.id]) {
                            fileList[0] = {
                              ...fileList[0],
                              ...{ describe: currentInput[item.id] },
                              ...{id:item.id},
                            };
                            contentList[item.id] = fileList;
                          } else {
                            fileList[0] = {
                              ...fileList[0],
                              ...{ id: item.id },
                            };
                            contentList[item.id] = fileList;
                          }
                          let content = contentList;
                          this.props.setUploadContentPicture({ key: item.id, content: content[item.id][0], type: this.props.keys});
                          if(this.props.onChange){
                            this.props.onChange(this.props.keys,content);
                          }
                          img_preview[item.id]= content[item.id][0].response.root.object[0].filePath;
                          img_previewName[item.id] = content[item.id][0].response.root.object[0].fileName;
                          this.setState({ contentList, img_preview,img_previewName });
                        }else{
                          Message.error('请检查接口状态！');
                          this.setState({ contentList: [] });
                        }
                      } else if (status === 'error') {
                        Message.error(`${info.file.name} 上传失败。`);
                      }
                    }}
                  >
                    {
                      contentList[item.id] ?null:
                        <Button>
                          <Icon type="upload" />{' '}
                          {'选择文件'}
                        </Button>
                    }
                  </Upload>
                  {contentList[item.id] ? (
                    <div>
                      <Button className='lookBtn'
                        onClick={() =>{
                          this.setState({ img_review: isIamge?true:false,isAttach:isAttach?true:false,isRadio:isRadio?true:false,current: img_preview[item.id],currentName:img_previewName[item.id] });
                        }}
                      >
                        查看
                      </Button>
                    </div>
                  ) : null}
                  <div style={{ display: describe ? 'inline-block' : 'none' }}>
                    <span>描述</span>　
                    <Input className='describeInput' disabled={(this.props.disabled||this.props.activeKey==1||this.props.activeKey==2)?true:contentList[item.id]?false:true}
                      onChange={e => this.describeChange(e, item.id)}
                      style={{ width: '300px' }}
                      value={currentInput[item.id]}
                    />
                  </div>　
                  {this.props.disabled||this.props.lookDetail?null:<Button className='deleteFile' onClick={() => this.deleteImg(item.id)}>删除</Button>}
                  
                </div>
              );
            })}
          </div>
        ) : null}

        <span style={{display:this.props.isRadio?'inline-block':'none',color:'red'}}>在线预览仅支持H264编码格式的mp4视频文件</span>
        
        <Modal
          className="img-review-modal"
          visible={this.state.img_review}
          onCancel={() => this.setState({ img_review: false })}
          footer={null}
          destroyOnClose
        >
        {
          this.state.current&&this.state.current.length==1||((typeof this.state.current)=='string')?API_CHOOSE_SERVICE==1?<div className='imgsize'><img src={ossViewPath + this.state.current} /></div>:<div className='imgsize'><img src={API_FILE_VIEW_INNER + this.state.current}/></div>
          :API_CHOOSE_SERVICE==1?
            <div className='imgsize'>
              <img src={ossViewPath + this.state.current[0]}/>
              <img src={ossViewPath + this.state.current[1]}/>
              <img src={ossViewPath + this.state.current[2]}/>
            </div>
            :<div className='imgsize'>
              <img src={API_FILE_VIEW_INNER + this.state.current[0]}/>
              <img src={API_FILE_VIEW_INNER + this.state.current[1]}/>
              <img src={API_FILE_VIEW_INNER + this.state.current[2]}/>
             </div>
          
        }
        </Modal>
        <Modal
          className="img-review-modal"
          visible={this.state.isRadio}
          onCancel={() => this.setState({ isRadio: false })}
          footer={null}
          destroyOnClose
        >
          <video id="my-player" className="video-js" controls preload="auto" poster="" data-setup="{}">
            <source src={this.state.current} type="video/mp4" />
          </video>
        </Modal>
        <Modal

          className="img-review-modal"
          visible={this.state.isAttach}
          onCancel={() => this.setState({ isAttach: false })}
          footer={null}
          destroyOnClose
        >
          {API_CHOOSE_SERVICE==1?<a  className="attach" href={ossViewPath+this.state.current} download={ossViewPath+this.state.current}>{this.state.currentName}</a>:
            <a  className="attach" href={API_FILE_VIEW_INNER + this.state.current} download={API_FILE_VIEW_INNER + this.state.current}>{this.state.currentName}</a>
          }
          
        </Modal>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <div className='imgsize'><img alt="example" src={ previewImage} /></div>
        </Modal>
      </div>
    );
  }
}