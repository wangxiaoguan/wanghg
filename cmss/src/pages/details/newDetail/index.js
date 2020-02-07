import React, { Component } from 'react';
import BreadCrumb from '@/components/BreadCrumbDetail';
import styles from './index.less';
import Comment from '../comment';
import WordDetail from '../wordDetail';
import ImgDetail from '../imgDetail';
import { connect } from 'dva';
import WebDetail from '../webDetail';
import VideoNewsDetail from '../videoDetail/VedioNewsDetail';
import { storage } from '@/utils/utils';
import Progress from '../progress';
import { Button, Modal } from 'antd';
import router from 'umi/router';
import commenConfig from '../../../../config/commenConfig';
import Viewer from 'react-viewer';
import { parse } from 'qs';
const { confirm } = Modal;

@connect(({ detailModel, loading }) => ({
  detailModel,
  detailLoading: loading.effects['detailModel/getNewsDetail'],
}))
class NewDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objectType: 0,
      type: 0,
      visible: false,
      index: 0,
      imgList: [],
      showExamModalIsShow:false
    };
  }

  UNSAFE_componentWillMount() {
    // {"msgId":"APP009","objectId":"11313","opinion":0,"userId":"21274"}
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const { dispatch } = this.props;
    const { id } = this.getType();
    const param = {
      msgId: 'APP009',
      objectId: id,
      opinion: 0,
      userId: userInfo.id,
    };
    dispatch({
      type: 'detailModel/getNewsDetail',
      payload: {
        text: JSON.stringify(param),
      },
      error: ()=>{
        router.push('/exception/404');
      }
    });
  }

  componentDidMount() {
    document.getElementById('content').addEventListener(
      'click',
      event => {
        const { target = {} } = event;
        if (target.tagName === 'IMG') {
          const { src = '' } = target;
          const { contentImages = [] } = this.props.detailModel.detail;
          const imgList = contentImages.map(img => {
            return {
              src: img.url,
              alt: '',
              descrip: '',
            }
          })
          const imgListTmp = contentImages.map(img => img.url);
          let index = imgListTmp.indexOf(src);
          console.log(index)
          event.stopImmediatePropagation();
          event.preventDefault();
          this.setState({
            visible: true,
            index: index > -1 ? index : 0,
            imgList
          })
        }

        if (target.tagName === 'A') {
          const { href = '', search = '' } = target;
          if (
            href.indexOf('www.urlgenerator.com') !== -1 &&
            (search.indexOf('?') !== -1 || search.indexOf('&') !== -1)
          ) {
            const query = search.substr(1) || '';
            const params = parse(query);
            // console.log(JSON.stringify(params));
            const { objectType, type, id } = params;
            const {
              match: { url },
            } = this.props;
            const {
              location: {
                query: { id: actId, subType: actSubtype },
              },
            } = this.props;
            const newObjectType = objectType === '1' ? 'news' : 'activity';
            // 缓存当前资讯/活动信息以及跳转后咨询/活动的信息
            sessionStorage.setItem('oldObjectType', 'news');
            sessionStorage.setItem('oldId', `${actId}`);
            sessionStorage.setItem('oldSubtype', `${actSubtype}`);
            sessionStorage.setItem('newObjectType', `${newObjectType}`);
            sessionStorage.setItem('newId', `${id}`);
            sessionStorage.setItem('newSubtype', `${type}`);
            // ==========================================
            const urlArr = window.location.href.split('/');
            urlArr.pop();
            const newUrl = urlArr.join('/');
            // this.setState({ newsInfo: '' }, () => {
            //   router.replace({
            //     pathname: `${newUrl}/${newObjectType}`,
            //     query: {
            //       id,
            //       subType: type,
            //     },
            //   });
            // });
            window.open(`${newUrl}/${newObjectType}?id=${id}&subType=${type}`)
            event.stopImmediatePropagation();
            event.preventDefault();
          }
          // 普通网址 a标签会直接跳转
        }
      },
      true
    );

  }

  getContent = () => {
    /**
     objectType: 1资讯，2活劫，3悠祝，4杂志的文章，5杂志
     type:资讯类型: 1文字，2图片，3详情视频，4专题，5网页，6列表视频，7公告，10直播间
     活动类型:报名(1无报名信息,2有报名信息〉，4投票，5问卷, 6考试，7订购
     */
    const { objectType, type, id } = this.getType();

    const { detail } = this.props.detailModel;
    let detailTmp = detail;
    if (detail.newsInfo && detail.newsInfo.content) {
      const content = detail.newsInfo.content.replace(`<img style="max-width:100%;"`, `<img style="max-width:950px;"`)
      detailTmp.newsInfo.content = content;
    }
    if (objectType === '1') {
      // 资讯
      switch (type) {
        case '1':
          return <WordDetail detail={detailTmp} />;
        case '2':
          return <ImgDetail newsId={id} />;
        case '3':
          return <VideoNewsDetail detail={detailTmp} />;
        case '6':
          return <VideoNewsDetail detail={detailTmp} />;
        case '4':
          break;
        case '5':
          return <WebDetail detail={detailTmp} />;
        default:
          break;
      }

    } else if (objectType === 2) {
      // 活动
    }
  };

  getType = () => {
    const { location } = this.props;
    let objectType = 0, type = 0, id = 0;
    if (location && location.pathname) {
      let pathname = location.pathname;
      if (pathname.endsWith('news')) {
        // 资讯
        objectType = '1';
      } else if (pathname.endsWith('activity')) {
        // 活动
        objectType = '2';
      }
    }
    if (location && location.query) {
      type = location.query.subType;
      id = location.query.id;
    }
    // return this.getContent(objectType, type);
    return { objectType, type, id };
  };

  renderProgress = () => {
    const { detail,showConfirmExam } = this.props.detailModel;
    const { isStudyNews, isRelatedActivity, isExamed, totalStudyTime, newsInfo, relatedActivityId } = detail;
    const studytime = newsInfo && newsInfo.studytime;

    const percent = Math.floor((Number(totalStudyTime) / Number(studytime)) * 100);

    return isStudyNews === true ? (
      <div className={styles.studySpeed}>
        <Progress id={newsInfo.id}
          studyTime={Number(totalStudyTime)}
          totalTime={Number(studytime)}
          interval={Number(studytime) / 100} />
        {isRelatedActivity && (
          <Button
            disabled={isExamed || percent < 100}
            className={'btn-bordered'}
            onClick={this.gotoExam}
          >
            {isExamed ? '已完成' : '考试'}
          </Button>
        )}
        {
          isRelatedActivity && showConfirmExam === true && this.renderConfirmExam()
        }
      </div>
    ) : null;
  };

  gotoExam=()=>{
    const { detail } = this.props.detailModel;
    const { relatedActivityId } = detail;
    if (relatedActivityId && relatedActivityId.length > 0) {
      const { match } = this.props;
      const x = match.url.indexOf('news');
      router.push(`${match.url.slice(0, x)}activity?id=${relatedActivityId}&subType=6`);
    }
  }

  renderConfirmExam = ()=>{
    if(this.state.showExamModalIsShow) {
      return
    }
    const that = this
    this.setState({
      showExamModalIsShow: true
    },()=>{
      confirm({
        title: '提示',
        content: '你已学习完成,是否开始考试?',
        onOk() {
          console.log('OK');
          that.gotoExam()
        },
        onCancel() {
          console.log('Cancel');
        },
        okButtonProps: {
          className:'red-btn'
        },
        cancelButtonProps: {
          className:'btn-cancel'
        }
      });
    })

  }

  openFile = file => {
    const a = document.createElement('a');
    if (file.url && file.url.indexOf('http') !== -1) {
      a.href = `${file.url}`;
    } else {
      a.href = `${commenConfig.downPath}/${file.url}`;
    }
    a.click();
  };

  render() {
    const { objectType, type, id } = this.getType();
    const { detail } = this.props.detailModel;
    const { visible, index, imgList } = this.state;
    const { isVote, favoritesId, newsInfo = {}, attachFileList = [], contentImages = [], isStudyNews } = detail;
    const { iscomment = 'true' } = newsInfo;
    return (
      <div className={styles.newDetail}>
        <BreadCrumb {...this.props} />
        {/*<StudyProgress totalTime={100} studyTime={80}/>*/}
        <p className={styles.title}>{newsInfo.title}</p>
        {this.renderProgress()}
        {this.getContent()}
        {
          attachFileList.length > 0 &&
          <div className={styles.attach}>
            <p>附件</p>
            {attachFileList.length &&
              attachFileList.map(item => (
                <p><a onClick={() => this.openFile(item)} key={item.name}>
                  {item.name}
                </a></p>
              ))}
          </div>
        }
        <Comment type={type} title={newsInfo && newsInfo.title || ''} activityId={id} favoritesId={favoritesId}
          isVote={isVote} objectType={objectType} iscomment={iscomment === 'false' ? false : true} isStudyNews={isStudyNews} />

        <Viewer
          visible={visible}
          onClose={() => {
            this.setState({ visible: false });
          }}
          images={imgList}
          activeIndex={index}
          noImgDetails
        />
      </div>
    );
  }
}

export default NewDetail;
