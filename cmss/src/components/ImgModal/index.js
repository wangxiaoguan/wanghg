import React, { Component } from 'react';
// import Link from 'umi/link';
// import { Modal } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import commenConfig from '../../../config/commenConfig';

@connect(({ global }) => ({
  global,
}))
class ImageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  openImg = e => {
    const { dispatch, url } = this.props;
    let newUrl = '';
    if (url.indexOf('http') !== -1) {
      newUrl = `${url}`;
    } else {
      newUrl = `${commenConfig.downPath}/${url}`;
    }
    dispatch({ type: 'global/saveImgUrl', payload: `${newUrl}` });
    e.stopPropagation();
    e.preventDefault(); // 阻止事件冒泡即可
  };

  render() {
    const { url } = this.props;
    let newUrl = '';
    if (url.indexOf('http') !== -1) {
      newUrl = `${url}`;
    } else {
      newUrl = `${commenConfig.downPath}/${url}`;
    }
    return (
      <span className={styles.main}>
        <span
          style={{ backgroundImage: `url(${newUrl})` }}
          onClick={e => {
            this.openImg(e);
          }}
          className={styles.img}
        />
      </span>
    );
  }
}

export default ImageModal;
