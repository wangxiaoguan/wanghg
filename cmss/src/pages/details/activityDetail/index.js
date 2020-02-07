import React, { Component } from 'react';
import styles from './index.less';
import ExamOnline from '../examOnline/examOnlineWait';
import Comment from '../comment';
import { connect } from 'dva'
import ApplyActivity from '../applyActivity'
import VoteActivity from '../voteActvity'
import ExamActivity from '../examActivity'
import QuestionnaireActivity from '../questionnaireActivity'
import { storage } from '../../../utils/utils';
import BreadCrumbDetail from '../../../components/BreadCrumbDetail';
import Viewer from 'react-viewer';
import router from 'umi/router';

@connect(({ activityDetailModel, loading }) => ({
  activityDetailModel
}))
class ActiveDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.getType();
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const userDetail = {
      userId: userInfo.id,
      msgId: 'APP216',
      department: userInfo.orgid,
      activityId: id,
    };
    dispatch({
      type: 'activityDetailModel/getActivityDetail',
      payload: {
        text: JSON.stringify(userDetail)
      },
      error: () => {
        router.replace('/404');
      }
    })
    this.contentImgViewer();
  }

  contentImgViewer = () => {
    document.getElementById('content').addEventListener('click', event => {
      const { target = {} } = event;
      const imgs = document.getElementById('content').getElementsByTagName('img');

      if (target.tagName === 'IMG') {
        const {
          src = ''
        } = target;
        // const { contentImages = [] } = this.props.activityDetailModel.activityDetail;
        let imgList = []
        let imgListTmp = []
        for (let i = 0; i < imgs.length; i++) {
          const img = imgs[i];
          imgList.push({
            src: img.src,
            alt: '',
            descrip: '',
          })
          imgListTmp.push(img.src)
        }

        let index = imgListTmp.indexOf(src);
        event.stopImmediatePropagation();
        event.preventDefault();
        this.setState({
          visible: true,
          index: index > -1 ? index : 0,
          imgList
        })
      }
    },
      true
    );
  }

  getType = () => {
    const {
      location
    } = this.props;
    let objectType = 0,
      type = 0,
      id = 0;
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

  getContent = () => {
    /**
     objectType: 1资讯，2活劫，3悠祝，4杂志的文章，5杂志
     活动类型:报名(1无报名信息,2有报名信息〉，4投票，5问卷, 6考试，7订购
     */
    const {
      objectType,
      type,
      id
    } = this.getType();
    const { activityDetail } = this.props.activityDetailModel;
    if (objectType === '2') {
      // 活动
      switch (type) {
        case '1':
        case '2':
          // return '2有报名信息';
          return <ApplyActivity activityDetail={activityDetail} activityNewsId={id} />
        case '4': // 投票活动
          return <VoteActivity activityNewsId={id} {...this.props} />;
        case '5':
          //   return '5问卷';
          return <QuestionnaireActivity {...this.props} activityNewsId={id} />
        case '6': // 考试活动
          return <ExamActivity {...this.props} activityNewsId={id} />;
        case '7':
          //   return '7订购';
          break
        default:
          // break;
          return <ExamOnline {...this.props} />;
      }

    }
  };

  render() {
    const {
      objectType,
      type,
      id
    } = this.getType();
    const {
      visible,
      index,
      imgList
    } = this.state;
    const {
      activityDetail
    } = this.props.activityDetailModel;
    const {
      activityInfo = {}
    } = activityDetail;
    const {
      iscomment = 'true'
    } = activityInfo;
    return <div className={styles.newDetail} >
      <BreadCrumbDetail {...this.props} />
      {
        this.getContent()
      }
      <Comment iscomment={iscomment === 'false' ? false : true}
        type={type}
        title={''}
        activityId={id}
        favoritesId={0}
        isVote={activityDetail.isVote}
        objectType={objectType} />
      <Viewer
        visible={visible}
        onClose={() => { this.setState({ visible: false }) }}
        images={imgList}
        activeIndex={index}
        noImgDetails />
    </div>;
  }
}

export default ActiveDetail;
