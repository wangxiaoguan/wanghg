import React, { Fragment } from 'react';
import { Row, Col, Icon, Popover, Button, Modal, Upload, Spin, message } from 'antd';
import { connect } from 'dva';
import Viewer from 'react-viewer';
import classNames from 'classnames';
import commenConfig from '../../../config/commenConfig';
import styles from './index.less';
import $ from 'jquery'
import uploadFile from './uploadForm'
const iconImage = path => {
  const IconMap = {
    bmp: styles['icon-bmp'],
    doc: styles['icon-doc'],
    docx: styles['icon-docx'],
    gif: styles['icon-gif'],
    jpeg: styles['icon-jpeg'],
    jpg: styles['icon-jpg'],
    mp4: styles['icon-mp4'],
    pdf: styles['icon-pdf'],
    png: styles['icon-png'],
    ppt: styles['icon-ppt'],
    pptx: styles['icon-pptx'],
    txt: styles['icon-txt'],
    xls: styles['icon-xls'],
    xlsx: styles['icon-xlsx'],
  };
  let ext = '';
  if (path && path.length) {
    ext = 'unknown';
  } else {
    ext = path && path.url && path.url.indexOf('.') > -1 ? path.url.split('.').pop() : '';
  }
  return IconMap[ext];
};

class FileListItem extends React.Component {
  render() {
    const { file, disabled, remove, openFile } = this.props;
    return (
      <Col span={5}>
        {file !== '' ? (
          <div className={styles.item}>
            <div
              className={classNames(styles.image, iconImage(file))}
              onClick={() => openFile(file)}
            />
            <Popover content={`${file && file.name}`}>
              <div className={styles.text}>{`${file && file.name}`}</div>
            </Popover>
            {disabled || <Icon type="close" className={styles.close} />}
            <span onClick={() => remove(file)} className={styles.removeIcon}>
              <Icon type="close-circle" theme="filled" style={{ color: '#d60d0d', fontSize: 20 }} />
            </span>
          </div>
        ) : null}
      </Col>
    );
  }
}

@connect(({ partyTask }) => ({
  partyTask,
  // loading: loading.effects['partyTask/getSeekTableData'],
}))
// eslint-disable-next-line
class FileList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      currentFile: {},
      imgList: [],
      imgVisible: false,
    };
  }

  openFile = file => {
    console.log(file);
    let fileType = '';
    //判断是否为图片类型
    if (
      file.url.indexOf('.png') !== -1 ||
      file.url.indexOf('.jpg') !== -1 ||
      file.url.indexOf('.jpeg') !== -1
    ) {
      fileType = 'image';
    }
    if (fileType === 'image') {
      let newUrl = '';
      if (file.url && file.url.indexOf('http') === -1) {
        newUrl = `${commenConfig.downPath}/${file.url}`;
      }
      if (file.url && file.url.indexOf('http') !== -1) {
        newUrl = `${file.url}`;
      }
      if (newUrl !== '') {
        // console.log(file, newUrl);
        this.setState({
          imgVisible: true,
          imgList: [
            {
              src: newUrl,
              alt: file.fileName,
            },
          ],
        });
      }
    } else {
      this.setState(
        {
          currentFile: file,
        },
        () => {
          this.setState({ visible: true });
        }
      );
    }
  };

  // 是否为浏览器可预览文件
  getIsPreview = () => {
    const { currentFile } = this.state;
    if (currentFile.url) {
      if (currentFile.url.indexOf('.txt') !== -1 || currentFile.url.indexOf('.md') !== -1) {
        return false;
      }
      return true;
    }
    return true;
  };

  uploadBefore = file => {
    const { dispatch, addTaskAttachList, attachLength, setFileList, value } = this.props;
    if (value.length + attachLength >= 5) {
      message.warning('上传的附件数量不能超过五个！');
      return false;
    }
    const fileTypes = [
      'jpeg',
      'jpg',
      'png',
      'bmp',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'ppt',
      'pptx',
      'pdf',
      'mp4',
      'gif',
    ];
    const newArr = file.name.split('.');
    if (!fileTypes.includes(newArr[newArr.length - 1])) {
      message.warning('上传的文件类型不支持！');
      return false;
    }
    const formData = new FormData();
    formData.append('file', file, escape(file.name));
    this.setState({ loading: true });
    dispatch({
      type: 'partyTask/uploadFile',
      payload: formData,
      callBack: res => {
        // console.log('文件上传成功==', res);
        if (res.sucess) {
          const respFileName = unescape(res.entity[0].fileName);
          const fileObj = {
            uid: `${file.uid}`,
            name: respFileName,
            url: res.entity[0].filePath,
          };
          let newFile = {
            url: res.entity[0].filePath,
            uid: `${file.uid}`,
            fileName: respFileName,
          };
          if (file.type.indexOf('image') !== -1) {
            newFile.type = 3;
            newFile.content = '{"h":480,"height":0,"w":360,"width":0}';
          } else if (file.name.split('.')[1] === 'mp4') {
            newFile.type = 4;
          } else {
            newFile = {
              fileName: respFileName,
              type: 5,
              content: `{"length":"${Number(file.size / 1024).toFixed(
                2
              )}KB","name":"${respFileName}"}`,
              url: res.entity[0].filePath,
              fileSize: ` ${Number(file.size / 1024).toFixed(2)}KB`,
            };
          }
          this.setState({ file: fileObj });
          addTaskAttachList(newFile);
          setFileList(fileObj);
          message.success('上传成功');
          this.setState({ loading: false });
        } else {
          message.error('上传失败,请重新上传！');
          this.setState({ loading: false });
        }
      },
    });
    return false;
  };

  renderFileItem = () => {
    const { value, disabled, remove } = this.props;
    if (value && value.length) {
      return value.map((item,index) => (
        <FileListItem
          key={index}
          file={item}
          disabled={disabled}
          remove={remove}
          openFile={this.openFile}
        />
      ));
    }
    return null;
  };
  componentDidMount(){
    console.log(uploadFile)
  }
  onChange = () => {
    console.log(window)
  }

  uploadFile = () => {
    $('#imgUpload').click();
  }

  upload = () => {
    let that = this;
    that.setState({ loading: true });
    const { addTaskAttachList,attachLength, setFileList,value } = this.props;
    const fileTypes = ['jpeg','jpg','png','bmp','doc','docx','xls','xlsx','ppt','pptx','pdf','mp4','gif'];
    if (value.length + attachLength >= 5) {
      message.warning('上传的附件数量不能超过五个！');
      that.setState({ loading: false });
      return false;
    }
    let url = `${commenConfig.path}/bjdj02/app/upload/service.do?text={"msgId":"IE_UPLOAD_FILE"}`;
    let options = {
      url: url,
      type: 'POST',
      beforeSubmit: function(x, y, z) {
        console.log(x, y, z);
      },
      success: function(data,status) {
        console.log('成功回旋的数据=====>', data,status);
        // let data = `{"sucess":true,"entity":[{"fileName":"文档.doc","filePath":"web/15/14/37c5ea70-f96c-4a58-ba78-34197bf97d48_1.doc","fileSize":"2345","tenantId":"smartas"}]}`
        let res = JSON.parse(data)
        const respFileName = res.entity[0].fileName;
        const newArr = respFileName.split('.');
        let strSort = newArr[newArr.length-1].toLowerCase();
        if (!fileTypes.includes(newArr[newArr.length - 1])) {
          message.warning('上传的文件类型不支持！');
          that.setState({ loading: false });
          return false;
        }
          const fileObj = {
            uid: `file${new Date().getTime()}`,
            name: respFileName,
            url: res.entity[0].filePath,
          };
          let newFile = {
            url: res.entity[0].filePath,
            uid: `file${new Date().getTime()}`,
            fileName: respFileName,
          };

          if(fileTypes.indexOf(strSort)>-1&&fileTypes.indexOf(strSort)<4){
            newFile.type = 3;
            newFile.content = '{"h":480,"height":0,"w":360,"width":0}';
          }else if (fileTypes.indexOf(strSort)===11) {
            newFile.type = 4;
          } else {
            newFile = {
              fileName: respFileName,
              type: 5,
              content: `{"length":"${Number(res.entity[0].fileSize / 1024).toFixed(2)}KB","name":"${respFileName}"}`,
              // content: `{"length":"6666KB","name":"${respFileName}"}`,
              url: res.entity[0].filePath,
              fileSize: `${Number(res.entity[0].fileSize / 1024).toFixed(2)}KB`,
            };
          }
          that.setState({ file: fileObj });
          addTaskAttachList(newFile);
          setFileList(fileObj);
          message.success('上传成功');
          that.setState({ loading: false });

      },
      error: function(res) {
        message.error('上传失败,请重新上传！');
        that.setState({ loading: false });
      },
    };
    $('#ajaxForm').ajaxSubmit(options);
  }
  render() {
    let isIeVersion9 = false
    if(window.navigator.userAgent.indexOf("MSIE")>-1){
      let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
      reIE.test(window.navigator.userAgent);
      let fIEVersion = parseFloat(RegExp["$1"]);
      if(fIEVersion === 9){
        console.log('IE浏览器版本',fIEVersion)
        isIeVersion9 = true
      }
    }


    const { disabled } = this.props;
    const { loading, imgVisible, imgList, visible, currentFile } = this.state;
    // console.log('value', value, loading);
    const classes = disabled ? classNames(styles.container, styles.disabled) : styles.container;

    return (
      <Fragment>
        <Spin spinning={loading}>
          <Row gutter={40} style={{ marginRight: 0,marginTop: '10px' }}>
            {this.renderFileItem()}
            <Col span={5}>
              {
                isIeVersion9?
                // <iframe style={{border:0,width:130,height:130,}} onChange={this.onChange} src="http://47.111.139.92:8080/file.html"/>
                <div>
                  <div className={styles.upload} onClick={this.uploadFile}/>
                  <form id="ajaxForm" enctype="multipart/form-data">
                    <input type="file" name='uploadFile' id='imgUpload'  onChange={this.upload} style={{display:'none'}}/>
                  </form>
                </div>
                :
                 <div className={classes}>
                 <Upload
                   name="file"
                   fileList={[]}
                   beforeUpload={this.uploadBefore}
                   onPreview={this.openFile}
                   onRemove={this.removeFile}
                 >
                   <div className={styles.addFile}>
                     <img src={require('../../assets/add.png')} alt='' />
                   </div>

                 </Upload>
               </div>
              }

            </Col>
          </Row>
          <Viewer
            visible={imgVisible}
            onClose={() => {
              this.setState({ imgVisible: false });
            }}
            images={imgList}
            activeIndex={0}
            noImgDetails
          />
          <Modal
            visible={visible}
            footer={null}
            centered
            onCancel={() => {
              this.setState({ visible: false });
            }}
          >
            <div>
              <div style={{ margin: '10px 50px' }}>
                <span>文件名：</span>
                <span>{currentFile.fileName || currentFile.name}</span>
              </div>
              <Button style={{ margin: '10px 50px' }} onClick={this.downLoad}>
                下载
              </Button>
              {this.getIsPreview() ? null : <Button onClick={this.lookFile}>在线查看</Button>}
            </div>
          </Modal>
        </Spin>
      </Fragment>
    );
  }
}

export default FileList;
