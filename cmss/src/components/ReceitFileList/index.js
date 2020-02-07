import React from 'react';
import { Row, Col, Popover, Modal, Button, Typography } from 'antd';
import Viewer from 'react-viewer';
import classNames from 'classnames';
import { connect } from 'dva';
import commenConfig from '../../../config/commenConfig';
import styles from './index.less';

const { Paragraph } = Typography;
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
    unknown: styles['icon-pic'],
  };
  let ext = '';
  if (path && path.length) {
    ext = 'unknown';
  } else {
    ext = path && path.url && path.url.indexOf('.') > -1 ? path.url.split('.').pop() : 'unknown';
  }
  return IconMap[ext] || IconMap.unknown;
};

// {`${fileName && fileName.fileName}`}
@connect(({ global }) => ({
  global,
}))
class ReceitFileListItem extends React.PureComponent {
  render() {
    const { item, openFile } = this.props;
    return (
      <Col span={4} style={{ padding: 0 }}>
        <div className={styles.item}>
          <div
            className={classNames(styles.image, iconImage(item))}
            onClick={() => openFile(item)}
          />
        </div>
        {item && item.fileName ? (
          <Popover content={`${item && item.fileName}`}>
            <Paragraph ellipsis={{ rows: 2, expandable: false }} className={styles.text}>
              {`${item && item.fileName}`}
            </Paragraph>
            {/* <div className={styles.text}>{`${item && item.fileName}`}</div> */}
          </Popover>
        ) : null}
      </Col>
    );
  }
}

// eslint-disable-next-line
class ReceitFileList extends React.PureComponent {
  state = {
    visible: false,
    currentFile: {},
    imgList: [],
    imgVisible: false,
  };

  openFile = file => {
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

  getImageUrl = () => {
    const { currentFile } = this.state;
    if (currentFile.url && currentFile.url.indexOf('http') === -1) {
      return `${commenConfig.downPath}/${currentFile.url}`;
    }
    if (currentFile.url && currentFile.url.indexOf('http') !== -1) {
      return `${currentFile.url}`;
    }
    return '';
  };

  lookFile = () => {
    const { currentFile } = this.state;
    if (currentFile.url && currentFile.url.indexOf('http') === -1) {
      const url = `${commenConfig.downPath}/${currentFile.url}`;
      window.open(url, '_blank');
    } else if (currentFile.url && currentFile.url.indexOf('http') !== -1) {
      const url = `${currentFile.url}`;
      window.open(url, '_blank');
    }
  };

  downLoad = () => {
    const { currentFile } = this.state;
    const $a = document.createElement('a');
    $a.href = `${commenConfig.downPath}/${currentFile.url}`;
    if (navigator.userAgent.indexOf('Firefox') > 0) {
      // 火狐浏览器
      $a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    } else {
      // 其他浏览器
      $a.click();
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

  render() {
    const { visible, currentFile, imgVisible, imgList } = this.state;
    const { value, disabled } = this.props;
    const classes = disabled ? classNames(styles.container, styles.disabled) : styles.container;
    // console.log(imgVisible, imgList);
    return (
      <div className={classes}>
        <Row gutter={40}>
          {value &&
            value.map(item => (
              <ReceitFileListItem
                key={item}
                item={item}
                disabled={disabled}
                openFile={this.openFile}
              />
            ))}
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
              <span>{currentFile.fileName}</span>
            </div>
            <Button style={{ margin: '10px 50px' }} onClick={this.downLoad}>
              下载
            </Button>
            {this.getIsPreview() ? null : <Button onClick={this.lookFile}>在线查看</Button>}
          </div>
        </Modal>
      </div>
    );
  }
}

export default ReceitFileList;
