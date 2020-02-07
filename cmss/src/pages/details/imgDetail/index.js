import * as React from 'react';
import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';
import { connect } from 'dva';
import styles from './index.less';
import PropTypes from 'prop-types';
import commenConfig from '../../../../config/commenConfig';
import { storage } from '@/utils/utils';

@connect(({ detailModel }) => ({
  detail: detailModel,
}))
class ImageList extends React.Component {
  static propTypes = {
    newsId: PropTypes.string,
    // detail: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      imgList: [],
      index: 0,
      isatlas: '', // 是否为图集
    };
  }

  componentWillMount() {
    const { newsId, dispatch } = this.props;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));

    const info = {
      msgId: 'APP180',
      newsId,
      userId: userInfo.id,
    };
    dispatch({
      type: 'detailModel/getImgList',
      payload: {
        text: JSON.stringify(info),
      },
      callBack: data => {
        if (data.code === '0') {
          const { attachList } = data.resultMap;
          const temp = attachList.map(item => ({
            src: `${commenConfig.downPath}/${item.url}`,
            alt: item.descrip,
            descrip: item.descrip,
          }));
          this.setState({ imgList: temp, isatlas: data.resultMap.newsInfo.isatlas });
        }
      },
    });
  }

  changeState = index1 => {
    const { visible, isatlas } = this.state;
    if (isatlas === 'true') {
      // 是图集
      this.setState({ visible: !visible });
    } else if (isatlas === 'false') {
      // 不是图集
      this.setState({ visible: !visible, index: index1 });
    }
  };

  getImg = () => {
    const { imgList, isatlas } = this.state;
    if (imgList && imgList.length) {
      if (isatlas === 'false') {
        // 不是图集
        return imgList.map((items, index1) => (
          <div>
            <img
              src={items.src}
              alt=""
              key={items.src}
              onClick={this.changeState.bind(this, index1)}
              className={styles.cover}
            />
            <p>{items.descrip}</p>
          </div>
        ));
      }
      if (isatlas === 'true') {
        // 是图集
        return (
          <div>
            <div className={styles.coveratlasDiv}>
              <img
                src={imgList[0].src}
                alt=""
                onClick={this.changeState}
                className={styles.coveratlas}
              />
              <p className={styles.atlas}>图集</p>
            </div>
            <p>{imgList[0].descrip}</p>
          </div>
        );
      }
    }
    return null;
  };

  render() {
    const { imgList, visible, index } = this.state;
    // let cover;
    // if (imgList.length) {
    //     cover = (
    //       <img src={imgList[0].src} alt="" onClick={this.changeState} className={styles.cover} />
    //     );
    // }
    const { newsInfo = {} } = this.props.detail;
    let content = '';
    if (newsInfo) {
      content = newsInfo.content;
    }
    return (
      <div className={styles.imgBox}>
        <Viewer
          visible={visible}
          onClose={() => {
            this.setState({ visible: false });
          }}
          images={imgList && imgList.length > 0 ? imgList : []}
          activeIndex={index}
          noImgDetails
        />
        {this.getImg()}
        <div dangerouslySetInnerHTML={{ __html: content }} id={'content'} />
      </div>
    );
  }
}

export default ImageList;
