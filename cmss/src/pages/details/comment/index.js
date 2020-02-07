// eslint-disable-next-line
/* eslint-disable */
import React, { Component } from 'react';
import {
  Button,
  Spin,
  Icon,
  Form,
  Input,
  message,
  List,
  Avatar,
  Pagination,
} from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { storage } from '@/utils/utils';
import moment from 'moment';
import styles from './index.less';
import ImageModal from '../../../components/ImgModal/index';
import commenConfig from '../../../../config/commenConfig';
import NoteModal from '../modal/NoteModal'

const FormItem = Form.Item;
const { TextArea } = Input;
// 避免重复点赞或者收藏
let setFlag = 1;

/**
 * 类型常量
 */
const ObjectType_Activity = '2'; // 活动
const ObjectType_News = '1'; // 资讯
@Form.create()
@connect(({ comment, loading }) => ({
  comment,
  loading: loading.effects['comment/activeLike'],
  loading2: loading.effects['comment/setLike'],
  loading3: loading.effects['comment/deleteComment'],
  loading4: loading.effects['comment/getCommentList'],
  submiting: loading.effects['comment/comment'], // 提交评论
  articleVoting: loading.effects['comment/informationLike'] || loading.effects['comment/activeLike'], // 正文点赞中
  articleFavoriting: loading.effects['comment/cancelFavorites'] || loading.effects['comment/addFavorites'], // 正文收藏中
  getNoteLoading: loading.effects['comment/getNote']
}))
class Comment extends Component {
  static propTypes = {
    activityId: PropTypes.string,// 正文的id
    type: PropTypes.string,
    objectType: PropTypes.string,
    title: PropTypes.string, // 正文标题
    favoritesId: PropTypes.number, // 收藏id，已收藏不为空
    isVote: PropTypes.bool, // 是否已经点赞
    iscomment: PropTypes.bool, // 是否显示评论
    isStudyNews: PropTypes.bool,//是否是学习
  };

  static defaultProps = {
    activityId: 0,
    type: 0,
    objectType: 0,
    title: '',
    favoritesId: 0,
    isVote: false,
    iscomment: true,
    isStudyNews: false,
  };

  constructor(props) {
    super(props);
    this.userInfo = JSON.parse(storage.getLocal('userInfo'));
    this.state = {
      active: false,
      commentList: [],
      commentTotal: 0,
      currentPage: 1,
      replyItem: {},
      replyNice: false,
      favoritesId: '',
      replyLoading: false,
      currentId: 0,
      polishLoading: false,
      activityId: '',
    };
  }

  componentDidMount() {
    const { activityId, type, objectType, title, favoritesId, isVote } = this.props;
    this.refresh(activityId);
    // 将props信息保存到model
    const { dispatch } = this.props;
    dispatch({
      type: 'comment/saveState',
      payload: {
        activityId,
        type,
        objectType,
        title,
        favoritesId,
        isVote,
      },
    });
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const userId = userInfo.id;
    dispatch({
      type: 'comment/getNote',
      payload: {
        text: JSON.stringify({
          msgId: "LEARNIN_NOTE_LIST_USERID_ACTIVITID",
          newsId: activityId,
          userId: userId
        })
      }
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    // 获取到最终点赞和收藏得值
    const { type, objectType, title, favoritesId, isVote } = nextProps;
    const { activityId } = this.state;
    const { isVote: isVote1, favoritesId: favoritesId1 } = this.props;
    if (isVote !== isVote1 || favoritesId !== favoritesId1) {
      this.setState({
        favoritesId,
        activityId,
        active: isVote,
      });
    }
    if (nextProps.activityId !== activityId && activityId !== '') {
      this.refresh(nextProps.activityId);
    }
  }

  refresh = activityId => {
    const { objectType, dispatch, favoritesId, isVote } = this.props;
    const { currentPage } = this.state;
    this.setState({
      favoritesId,
      activityId,
      active: isVote,
    });
    // 接口原因1资讯，2活动
    // const newType = objectType === '1' ? '2' : '1';
    const newType = objectType;
    const formData = {
      objectId: activityId,
      objectType: newType,
      msgId: 'QRY_VCV_COUNT',
    };
    dispatch({
      type: 'comment/getNewsCountDetail',
      payload: {
        text: JSON.stringify(formData),
      },
    });
    this.getCommentList(currentPage, activityId);
  };

  // 正文的点赞
  giveLikes = () => {
    // 1资讯，2活动
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const userId = userInfo.id;
    const { dispatch, articleVoting } = this.props;
    const { objectType, activityId } = this.props.comment;
    if (articleVoting) {  // 点赞执行中
      return;
    }
    if (objectType === '1') {
      // 资讯点赞
      const formData = {
        msgId: 'APP010',
        objectId: activityId,
        opinion: 0,
        // userId: userInfo.id,
        userId: userId,
      };
      dispatch({
        type: 'comment/informationLike',
        payload: {
          text: JSON.stringify(formData),
        },
      });
    } else if (objectType === '2') {
      // 活动
      const formData = {
        activityId,
        msgId: 'APP017',
        // userId: userInfo.id,
        userId: userId,
      };
      dispatch({
        type: 'comment/activeLike',
        payload: {
          text: JSON.stringify(formData),
        },
      });
    }
  };

  setFavorites = () => {
    const { dispatch, articleFavoriting } = this.props;
    const { objectType, type, activityId, title, favoritesId } = this.props.comment;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const userId = userInfo.id;

    if (articleFavoriting) {
      return
    }

    let formData;
    if (favoritesId) {
      formData = {
        id: favoritesId,
        msgId: 'FAVORITES_DELETE',
        // userId: userInfo.id,
        userId: userId,
      };
      dispatch({
        type: 'comment/cancelFavorites',
        payload: {
          text: JSON.stringify(formData),
        },
      });
    } else {
      console.warn(this.props)
      let temp = objectType;
      // if (objectType === '1') {
      //   temp = '2';
      // }
      if (objectType === '2' && JSON.stringify(type) === '3') {
        temp = 5;
      }
      formData = {
        msgId: 'FAVORITES_ADD',
        targetId: activityId,
        title,
        type: temp,
        // userId: userInfo.id,
        userId: userId,
      };
      dispatch({
        type: 'comment/addFavorites',
        payload: {
          text: JSON.stringify(formData),
        },
      });
    }
  };

  getCommentList = (currentPage, activityId) => {
    const { dispatch } = this.props;
    const { objectType } = this.props;
    // const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const userId = userInfo.id;
    const formData = {
      index: `${(currentPage - 1) * 20}`,
      msgId: 'APP040',
      pagesize: 20,
      targetId: activityId,
      targetType: objectType === '1' ? '2' : '1',
      // userId: userInfo.id,
      userId: userId,
    };
    dispatch({
      type: 'comment/getCommentList',
      payload: {
        text: JSON.stringify(formData),
      }
    });
  };

  /**
   * 展开所有的回复
   */
  getAllReply = (item, isNice) => {
    // const { commentList } = this.state;
    // for (let i = 0; i < commentList.length; i += 1) {
    //   for (let j = 0; j < commentList[i].replyList.length; j += 1) {
    //     if (item.id === commentList[i].replyList[j].id) {
    //       commentList[i].replyList[j].replyCount = 0;
    //       for (let k = 0; k < commentList[i].replyList.length; k += 1) {
    //         commentList[i].replyList[k].index = 0;
    //       }
    //     }
    //   }
    // }
    // this.setState({
    //   commentList,
    // });

    const { dispatch } = this.props;
    dispatch({
      type: 'comment/getAllReply',
      payload: {
        item,
        isNice
      }
    })

  };

  /**
   * 提交评论
   * */
  onSumbit = (content, field, typeFlag) => {
    const { objectType, activityId, dispatch, form } = this.props;
    const { replyItem } = this.state;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const userId = userInfo.id;
    // let typeTmp = '';
    // if (type === '1' || type === '3' || type === '5') {
    //   typeTmp = '2';
    // } else {
    //   typeTmp = '1';
    // }
    if (content) {
      if (typeFlag === 'polish') {
        this.setState({ polishLoading: true });
      } else {
        this.setState({ replyLoading: true });
      }
      const formData = {
        content,
        imageUrl: [],
        msgId: 'APP039',
        targetId: activityId,
        targetType: objectType === '1' || objectType === 1 ? '2' : '1',
        // userId: userInfo.id,
        userId: userId,
      };
      if (replyItem && replyItem.id) {
        formData.commentId = replyItem.parentId
          ? replyItem.parentId
          : replyItem.id;
        formData.replyId = replyItem.userId;
      }
      dispatch({
        type: 'comment/submitComment',
        payload: {
          text: JSON.stringify(formData),
        },
        callBack: res => {
          this.setState({ polishLoading: false, replyLoading: false });
          if (res.code === '0') {
            // const comment = commentCount + 1;
            // this.setState({
            //   commentCount: comment,
            // });
            const messageCom = replyItem.id ? '回复成功' : '评论成功';
            message.success(messageCom);
            form.setFieldsValue({
              [field]: '',
            });
            if (replyItem.id) {
              this.setState({
                replyItem: {},
              });
              this.refresh(activityId);
            } else {
              this.setState(
                {
                  currentPage: 1,
                },
                () => {
                  this.refresh(activityId);
                },
              );
            }
          }
        },
      });
    } else {
      message.info('请填写评论');
    }
  };

  handleSubmit = e => {
    // 提交表单
    const { form } = this.props;
    e.preventDefault();
    form.validateFields(['content'], (err, values) => {
      if (values) {
        this.onSumbit(values.content, 'content', 'polish');
      }
    });
  };

  handleReply = e => {
    // 提交表单
    const { form } = this.props;
    e.preventDefault();
    form.validateFields(['reply'], (err, values) => {
      if (values) {
        this.onSumbit(values.reply, 'reply', '');
      }
    });
  };

  showNoteModal = () => {
    const { dispatch, activityId } = this.props;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const userId = userInfo.id;
    dispatch({
      type: 'comment/getNote',
      payload: {
        text: JSON.stringify({
          msgId: "LEARNIN_NOTE_LIST_USERID_ACTIVITID",
          newsId: activityId,
          userId: userId
        })
      },
      noteVisible: true
    })

    // dispatch({
    //   type: 'comment/saveState',
    //   payload: {
    //     noteVisible: true
    //   }
    // })
  }

  setCommentReply = (item, isNice) => {
    this.setState({
      replyItem: item,
      replyNice: isNice
    });
  };

  /**
   * 评论点赞
   * */
  setLike = item => {
    const { dispatch, activityId } = this.props;
    const { currentPage } = this.state;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    if (setFlag) {
      setFlag = 0;
    } else {
      return;
    }
    this.setState({ currentId: item.id });
    const formData = {
      commentId: item.id,
      msgId: 'COMMENT_LIKE',
      userId: userInfo.id,
    };
    dispatch({
      type: 'comment/setLike',
      payload: {
        text: JSON.stringify(formData),
      },
      callBack: res => {
        setFlag = 1;
        if (res.code === '0') {
          message.success('点赞成功');
          this.getCommentList(currentPage, activityId);
        }
      },
    });
  };

  deleteItem = item => {
    const { dispatch, activityId } = this.props;
    const { currentPage } = this.state;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const userId = userInfo.id;
    const formData = {
      commentId: item.id,
      msgId: 'APP054',
      // userId: userInfo.id,
      userId: userId,
    };
    this.setState({ currentId: item.id });
    dispatch({
      type: 'comment/deleteComment',
      payload: {
        text: JSON.stringify(formData),
      },
      callBack: res => {
        if (res.code === '0') {
          message.success('删除成功');
          this.getCommentList(currentPage, activityId);
        }
      },
    });
  };

  getImageList = item => {
    if (item.imageUrl.length > 0) {
      return (
        <div>
          {item.imageUrl.map(img => {
            let url = '';
            if (img.indexOf('http') !== -1) {
              url = `${img}`;
            } else {
              url = `${commenConfig.downPath}/${img}`;
            }
            return <ImageModal url={url} {...this.props} />;
          })}
        </div>
      );
    }
    return null;
  };

  getDescription = (item, isNice) => (
    <div>
      <div>{item.content}</div>
      {this.getImageList(item)}
      {item.replyCount > 1 &&
        <a
          onClick={() => this.getAllReply(item, isNice)}
          className={styles.replyCount}
        >
          查看全部{item.replyCount}条评论 {[<span key="1">&gt;</span>]}
        </a>}
    </div>
  );

  cancelReply = () => {
    this.setState({
      replyItem: {},
    });
  };

  // 判断浏览器类型
  getBroswer = () => {
    const sys = {};
    const ua = navigator.userAgent.toLowerCase();
    let s;
    if (ua.match(/edge\/([\d.]+)/)) {
      s = ua.match(/edge\/([\d.]+)/);
      const [edge] = s;
      sys.edge = edge;
    } else if (ua.match(/rv:([\d.]+)\) like gecko/)) {
      s = ua.match(/rv:([\d.]+)\) like gecko/);
      const [ie] = s;
      sys.ie = ie;
    } else if (ua.match(/msie ([\d.]+)/)) {
      s = ua.match(/msie ([\d.]+)/);
      const [ie] = s;
      sys.ie = ie;
    } else if (ua.match(/firefox\/([\d.]+)/)) {
      s = ua.match(/firefox\/([\d.]+)/);
      const [firefox] = s;
      sys.firefox = firefox;
    } else if (ua.match(/chrome\/([\d.]+)/)) {
      s = ua.match(/chrome\/([\d.]+)/);
      const [chrome] = s;
      sys.chrome = chrome;
    } else if (ua.match(/version\/([\d.]+).*safari/)) {
      s = ua.match(/version\/([\d.]+).*safari/);
      const [safari] = s;
      sys.safari = safari;
    }

    if (sys.edge) return { broswer: 'Edge' };
    if (sys.ie) return { broswer: 'IE' };
    if (sys.firefox) return { broswer: 'Firefox' };
    if (sys.chrome) return { broswer: 'Chrome' };
    if (sys.opera) return { broswer: 'Opera' };
    if (sys.safari) return { broswer: 'Safari' };
    return { broswer: '' };
  };

  render() {

    const {
      currentId,
      replyLoading,
      replyItem,
      replyNice,
      polishLoading,
      currentPage,
    } = this.state;
    const {
      commentList,
      commentTotal,
      isVote,
      favoritesId,
      pview,
      voteCount,
      noteInfo,
      niceCommentList
    } = this.props.comment;

    const { form, loading2, loading3, activityId, getNoteLoading, loading4, articleVoting, isStudyNews, iscomment } = this.props;

    const { getFieldDecorator, getFieldValue } = form;
    const pagination = {
      total: commentTotal,
      showTotal: totalNum =>
        `共 ${totalNum} 条记录 第 ${currentPage} / ${Math.ceil(totalNum / 20)} 页`,
      pageSize: 20,
      defaultCurrent: 1,
      onChange: page => {
        this.setState({
          currentPage: page,
        });
        this.getCommentList(page, activityId);
      },
    };

    const antIcon = (
      <Icon type="loading" style={{ fontSize: 14, color: '#d60d0d' }} spin />
    );
    const antIcon2 = (
      <Icon type="loading" style={{ fontSize: 14, color: '#40a9ff' }} spin />
    );

    return (
      <div className={styles.commentContent}>
        <div className={styles.commentCount}>
          <div className={styles.commentCountLeft}>
            <span className={styles.commentCountIcon}>
              <Icon type="eye" /> {pview}
            </span>
            <span className={styles.commentCountIcon} style={{ display: iscomment ? null : 'none' }}>
              <Icon type="message" /> {commentTotal}
            </span>
            <span className={styles.commentCountIcon}>
              <Icon type="like" /> {voteCount}
            </span>
          </div>
          <div className={styles.commentCountRight}>
            {isStudyNews &&
              <Button
                onClick={this.showNoteModal}
                className={'btn-vote'}
                loading={getNoteLoading}
                style={{ marginRight: '10px' }}
              >{noteInfo ? '查看学习心得' : '添加学习心得'}</Button>
            }
            <Button
              icon="like"
              disabled={this.state.active || isVote}
              onClick={this.giveLikes}
              className={'btn-vote'}
              loading={articleVoting}
            >
              {this.state.active || isVote ? '已赞' : '点赞'}
            </Button>
            {
              /**
              <div className={favoritesId ? styles.hate : styles.Favorite}>
                <Button
                  icon="star-o"
                  onClick={this.setFavorites}
                  className={favoritesId ? styles['global-btn-Favorite'] : styles['global-btn']}
                  loading={articleFavoriting}
                >
                  {favoritesId ? '取消收藏' : '收藏'}
                </Button>
              </div>
               **/
            }

          </div>
        </div>
        <div className={styles.commentDetail} style={{ display: iscomment ? null : 'none' }}>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <FormItem
              label={<span className={styles.commentDetailIcon} />}
              style={{ width: '100%' }}
            >
              {getFieldDecorator('content', {
                initialValue: '',
                rules: [{ max: 200, message: '评论字数不要超过200' }],
              })(<TextArea className={styles.commentDetailText} />)}
            </FormItem>
            <div className={styles.textSuffix}>
              {getFieldValue('content').length <= 200
                ? `${getFieldValue('content').length}/200`
                : `-${getFieldValue('content').length - 200}`}
            </div>
          </Form>
          <Button
            className={'red-btn'}
            style={{ marginLeft: '45px' }}
            onClick={this.handleSubmit}
            loading={polishLoading}
          >
            发表评论
          </Button>
        </div>
        <Spin spinning={loading4}>
          <div className={styles.commentList} style={{ display: iscomment ? null : 'none' }}>
            <div className={styles.commentCat}><div className={styles.commentCatPre} /><span>{'精彩评论'}</span></div>
            <List
              itemLayout="horizontal"
              dataSource={niceCommentList}
              locale={{ emptyText: '暂无精彩评论' }}
              renderItem={(item, index) => {
                let actions = [];
                // 只有每一楼第一次可以点赞
                if (item.replyName === '') {
                  actions.push(<a
                    onClick={item.isLike ? null : () => this.setLike(item)}
                    style={{ color: item.isLike ? '#D60D0D' : '#333333' }}
                  >
                    {loading2 &&
                      currentId === item.id &&
                      <Spin indicator={antIcon2} />}
                    <Icon type="like" style={{ marginRight: 5, color: item.isLike ? '#D60D0D' : '#999' }} />
                    {/* // )} */}
                    {item.likeNum}
                  </a>)
                }
                actions.push(
                  <a
                    onClick={() => this.setCommentReply(item, true)}
                    style={{ color: '#333333' }}
                  >
                    <Icon type="message" style={{ marginRight: 5, color: '#999' }} />
                    回复
                    </a>,
                );
                if (`${item.userId}` === this.userInfo.id) {
                  actions.push(
                    <a
                      onClick={() => this.deleteItem(item)}
                      style={{ color: '#d60d0d' }}
                    >
                      {loading3 &&
                        currentId === item.id &&
                        <Spin indicator={antIcon} />}
                      删除
                    </a>,
                  );
                }
                return (
                  <div
                    className={`${item.isReply ? styles.isReply : ''} ${replyItem.id === item.id && replyNice ? styles.replyContent : ''} ${index === 0 ? styles.first : ''} ${index === commentList.length - 1 ? styles.last : ''} ${item.isReplyLast ? styles.isReplyLast : ''} ${item.replyCount > 1 ? styles.replyCountItem : ''} ${item.index && item.index > 0 ? styles.hiddenItem : ''}`}
                  >
                    <List.Item actions={actions}>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            size="36px"
                            style={{
                              backgroundColor: '#BA621B',
                              color: '#fff',
                              verticalAlign: 'middle',
                            }}
                          >
                            {item.name.length >= 2
                              ? item.name.slice(-2)
                              : item.name}
                          </Avatar>
                        }
                        title={
                          <div style={{ display: 'flex' }}>
                            {/* <a className={styles.nameStyle}>{item.name}</a> */}
                            {item.isReply
                              ? <div>
                                <a>{item.name}</a>
                                <span className={styles.replayText}>回复</span>
                                <a>{item.replyName}</a>
                              </div>
                              : <a>{item.name}</a>}
                            {this.getBroswer().broswer === 'Chrome'
                              ? <span className={styles.createDateText}>
                                {moment(new Date(item.createDate)).format(
                                  'YYYY-MM-DD HH:mm',
                                )}
                              </span>
                              : <span className={styles.createDateText}>
                                {moment(
                                  new Date(moment(item.createDate)),
                                ).format('YYYY/MM/DD HH:mm')}
                              </span>}
                            {item.replyName === ''
                              ? <span className={styles.floor}>
                                {item.floor}楼
                                </span>
                              : null}
                          </div>
                        }
                        // description={item.content}
                        description={this.getDescription(item, true)}
                      />
                      {/* {item.replyCount > 1 && (
                      <a onClick={() => this.getAllReply(item)} className={styles.replyCount}>
                        查看全部{item.replyCount}条评论 {[<span key="1">&gt;</span>]}
                      </a>
                    )} */}
                    </List.Item>
                    {replyItem.id === item.id && replyNice &&
                      <div className={styles.commentReply}>
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                          <FormItem style={{ width: '100%', marginBottom: 8 }}>
                            {getFieldDecorator('reply', {
                              initialValue: '',
                              rules: [{ max: 200, message: '评论字数不要超过200' }],
                            })(
                              <TextArea className={styles.commentDetailText} />,
                            )}
                          </FormItem>
                          <div
                            className={
                              item.replyName === ''
                                ? styles.textSuffix2
                                : styles.textSuffix3
                            }
                          >
                            {getFieldValue('reply').length <= 200
                              ? `${getFieldValue('reply').length}/200`
                              : `-${getFieldValue('reply').length - 200}`}
                          </div>
                        </Form>
                        <Button
                          className={'red-btn'}
                          onClick={this.handleReply}
                          loading={replyLoading}
                        >
                          回复
                      </Button>
                        <Button
                          className={'btn-cancel'}
                          onClick={this.cancelReply}
                          style={{ marginLeft: '10px' }}
                        >
                          取消
                      </Button>
                      </div>}
                  </div>
                );
              }}
            />
            <div className={styles.commentCatLine} />
            <div className={styles.commentCat}><div className={styles.commentCatPre} /><span>{'普通评论'}</span></div>
            <List
              itemLayout="horizontal"
              dataSource={commentList}
              locale={{ emptyText: '暂无评论' }}
              renderItem={(item, index) => {
                let actions = [];
                // 只有每一楼第一次可以点赞
                if (item.replyName === '') {
                  actions.push(<a
                    onClick={item.isLike ? null : () => this.setLike(item)}
                    style={{ color: item.isLike ? '#D60D0D' : '#333333' }}
                  >
                    {loading2 &&
                      currentId === item.id &&
                      <Spin indicator={antIcon2} />}
                    <Icon type="like" style={{ marginRight: 5, color: item.isLike ? '#D60D0D' : '#999' }} />
                    {/* // )} */}
                    {item.likeNum}
                  </a>)
                }
                actions.push(
                  <a
                    onClick={() => this.setCommentReply(item, false)}
                    style={{ color: '#333333' }}
                  >
                    <Icon type="message" style={{ marginRight: 5, color: '#999' }} />
                    回复
                    </a>,
                );
                if (`${item.userId}` === this.userInfo.id) {
                  actions.push(
                    <a
                      onClick={() => this.deleteItem(item)}
                      style={{ color: '#d60d0d' }}
                    >
                      {loading3 &&
                        currentId === item.id &&
                        <Spin indicator={antIcon} />}
                      删除
                    </a>,
                  );
                }
                return (
                  <div
                    className={`${item.isReply ? styles.isReply : ''} ${replyItem.id === item.id && !replyNice ? styles.replyContent : ''} ${index === 0 ? styles.first : ''} ${index === commentList.length - 1 ? styles.last : ''} ${item.isReplyLast ? styles.isReplyLast : ''} ${item.replyCount > 1 ? styles.replyCountItem : ''} ${item.index && item.index > 0 ? styles.hiddenItem : ''}`}
                  >
                    <List.Item actions={actions}>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            size="36px"
                            style={{
                              backgroundColor: '#BA621B',
                              color: '#fff',
                              verticalAlign: 'middle',
                            }}
                          >
                            {item.name.length >= 2
                              ? item.name.slice(-2)
                              : item.name}
                          </Avatar>
                        }
                        title={
                          <div style={{ display: 'flex' }}>
                            {/* <a className={styles.nameStyle}>{item.name}</a> */}
                            {item.isReply
                              ? <div>
                                <a>{item.name}</a>
                                <span className={styles.replayText}>回复</span>
                                <a>{item.replyName}</a>
                              </div>
                              : <a>{item.name}</a>}
                            {this.getBroswer().broswer === 'Chrome'
                              ? <span className={styles.createDateText}>
                                {moment(new Date(item.createDate)).format(
                                  'YYYY-MM-DD HH:mm',
                                )}
                              </span>
                              : <span className={styles.createDateText}>
                                {moment(
                                  new Date(moment(item.createDate)),
                                ).format('YYYY/MM/DD HH:mm')}
                              </span>}
                            {item.replyName === ''
                              ? <span className={styles.floor}>
                                {item.floor}楼
                                </span>
                              : null}
                          </div>
                        }
                        // description={item.content}
                        description={this.getDescription(item, false)}
                      />
                      {/* {item.replyCount > 1 && (
                      <a onClick={() => this.getAllReply(item)} className={styles.replyCount}>
                        查看全部{item.replyCount}条评论 {[<span key="1">&gt;</span>]}
                      </a>
                    )} */}
                    </List.Item>
                    {replyItem.id === item.id && !replyNice &&
                      <div className={styles.commentReply}>
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                          <FormItem style={{ width: '100%', marginBottom: 8 }}>
                            {getFieldDecorator('reply', {
                              initialValue: '',
                              rules: [{ max: 200, message: '评论字数不要超过200' }],
                            })(
                              <TextArea className={styles.commentDetailText} />,
                            )}
                          </FormItem>
                          <div
                            className={
                              item.replyName === ''
                                ? styles.textSuffix2
                                : styles.textSuffix3
                            }
                          >
                            {getFieldValue('reply').length <= 200
                              ? `${getFieldValue('reply').length}/200`
                              : `-${getFieldValue('reply').length - 200}`}
                          </div>
                        </Form>
                        <Button
                          className={'red-btn'}
                          onClick={this.handleReply}
                          loading={replyLoading}
                        >
                          回复
                      </Button>
                        <Button
                          className={'btn-cancel'}
                          onClick={this.cancelReply}
                          style={{ marginLeft: '10px' }}
                        >
                          取消
                      </Button>
                      </div>}
                  </div>
                );
              }}
            />
            {commentTotal ? <Pagination {...pagination} /> : null}
          </div>
        </Spin>

        {this.props.comment.noteVisible && <NoteModal newsId={activityId} />}
      </div>
    );
  }
}

export default Comment;
