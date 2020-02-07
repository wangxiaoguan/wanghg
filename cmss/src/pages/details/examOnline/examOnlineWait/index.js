/* eslint-disable no-unused-expressions */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Button, Spin, Tooltip, Avatar, message, Modal, Form, Input, Radio } from 'antd';
import { parse } from 'qs';
import BreadCrumbDetail from '@/components/BreadCrumbDetail';
import router from 'umi/router';
import { storage, getNowFormatDate } from '@/utils/utils';
import { connect } from 'dva';
import ActivityMemberModal from '../../modal/ActivityMemberModal';
import QuestionnaireModal from '../../modal/QuestionnaireModal';
import VoteResultModal from '../../modal/VoteResultModal';
import DepartmentJoinRateModal from '../../modal/DepartmentJoinRateModal';
import DepartmentScoreModal from '../../modal/DepartmentScoreModal';
import StudyRateModal from '../../modal/StudyRateModal';
import MyFont from '../../../../utils/myIcon';
import styles from './index.less';
import commenConfig from '../../../../../config/commenConfig';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@connect(({ onlineExam, loading }) => ({
  onlineExam,
  loading: loading.effects['onlineExam/getonlineExam'],
  loading1: loading.effects['onlineExam/getActivityMenmbers'],
  loading2: loading.effects['onlineExam/getQuestionnaire'],
  loading3: loading.effects['onlineExam/getDepartmentJoinRate'],
  loading4: loading.effects['onlineExam/getDepartmentScore'],
  loading5: loading.effects['onlineExam/getStudyRank'],
  loading6: loading.effects['onlineExam/getActivityUserInfo'],
  loading7: loading.effects['onlineExam/getVoteResult'],
}))
@Form.create()
class ExamOnlineWait extends Component {
  state = {
    activityInfo: '',
    isJoin: false,
    isCan: false,
    userInfo: JSON.parse(storage.getLocal('userInfo')),
    userinfolist: [],
    requestData: {},
    activityNewsId: '', // 当前活动id
    activityType: 2, // 资讯类型 活动类默认写死为 2
    activityTitle: '', // 当前活动名
    activityFavoritesId: '', // 是否收藏
    activityIsVote: '', // 是否点赞
    // file: null,
    isMore: false,
    begintime: '', // 考试开始时间
    endtime: '', // 考试结束时间
    reason: '',
    status: '', // 活动状态  0发布;1未发布;2取消
    selectcount: '',
    joincount: '',
    isIframe: false, // 是否悠视资讯
    iframeSrc: '', // 悠视资讯src
    // initUrl: '',
    // initId: '',
    currentUrl: '',
    showModal: false,
    editModal: false,
    visible: '',
    userRankList: [],
    JionRateList: [],
    voteResult: { list: [], titleList: [] },
    questionnaireList: [],
    scoreList: [],
    membersList: [],
  };

  componentDidMount() {
    document.getElementById('content').addEventListener(
      'click',
      event => {
        const { target = {} } = event;
        const { dispatch } = this.props;
        if (target.tagName === 'IMG') {
          const { src = '' } = target;
          dispatch({ type: 'global/saveImgUrl', payload: src });
          event.stopImmediatePropagation();
          event.preventDefault();
        }
        if (target.tagName === 'A') {
          const { href = '', search = '' } = target;
          if (
            href.indexOf('www.urlgenerator.com') !== -1 &&
            (search.indexOf('?') !== -1 || search.indexOf('&') !== -1)
          ) {
            const query = search.substr(1) || '';
            const params = parse(query);
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

            const arr = url.split('/');
            if (arr[arr.length - 1] === 'news' || arr[arr.length - 1] === 'activity') {
              arr.pop();
            }
            const newUrl = arr.join('/');
            // 资讯 视频(type === '3' || type === '6')  资讯嵌入的网页(type === '5') 其它是普通资讯
            this.setState(
              () => {
                // 缓存当前资讯/活动信息以及跳转后咨询/活动的信息
                sessionStorage.setItem('oldObjectType', 'activity');
                sessionStorage.setItem('oldId', `${actId}`);
                sessionStorage.setItem('oldSubtype', `${actSubtype}`);
                sessionStorage.setItem('newObjectType', `${newObjectType}`);
                sessionStorage.setItem('newId', `${id}`);
                sessionStorage.setItem('newSubtype', `${type}`);
                // ==========================================
                return { activityTitle: '' };
              },
              () => {
                router.replace({
                  pathname: `${newUrl}/${newObjectType}`,
                  query: {
                    id,
                    subType: type,
                  },
                });
              }
            );
            event.stopImmediatePropagation();
            event.preventDefault();
          }

          // 普通网址 a标签会直接跳转
        }
      },
      true
    );
    const { location } = this.props;
    const currentUrl = `${location.pathname}?${location.search}`;

    // initId和initUrl确保跳转被删除的附属活动能成功返回
    this.setState({ currentUrl }, () => {
      this.getActivityDetail();
    });
    //--------------
  }

  componentWillReceiveProps(nextProps) {
    const { currentUrl } = this.state;
    const newUrl = `${nextProps.location.pathname}?${nextProps.location.search}`;
    if (currentUrl !== newUrl) {
      this.setState({ currentUrl: newUrl }, () => {
        this.getActivityDetail();
      });
    }
  }

  componentWillUnmount() {
    const { storageFlag } = this.state;
    setTimeout(() => {
      if (storageFlag) {
        sessionStorage.setItem('oldObjectType', '');
        sessionStorage.setItem('oldId', '');
        sessionStorage.setItem('oldSubtype', '');
      }
    }, 3000);
    // 清连接跳转的缓存
  }

  // 查看考试
  viewExam = () => {
    const { match } = this.props;
    const { activityNewsId } = this.state;
    router.push(`${match.url}/viewExam?id=${activityNewsId}`);
  };

  getForItemLayout = (x, y) => ({
    labelCol: {
      span: x,
    },
    wrapperCol: {
      span: y,
    },
  });

  // 参加考试
  joinExam = () => {
    const { match, location } = this.props;
    const { activityNewsId, requestData } = this.state;
    if (requestData.relatedNewsInfo) {
      const studyUrl = `${location.pathname.slice(0, 1)}accountCenter/study/news?id=${
        requestData.relatedNewsInfo.newsid
        }&subType=${requestData.relatedNewsInfo.type}`;
      const falg = window.confirm('还未完成学习，不能参加考试，是否前往学习？');
      if (falg) {
        router.push(studyUrl);
      }
    } else {
      router.push(`${match.url}/joinExam?activityId=${activityNewsId}`);
    }
  };

  getActivityDetail = () => {
    const {
      dispatch,
      location: {
        query: { id = '' },
      },
      location,
    } = this.props;
    const { userInfo } = this.state;
    this.setState({ activityNewsId: id });
    const that = this;
    const userDetail = {
      userId: userInfo.id,
      msgId: 'APP216',
      department: userInfo.orgid,
      activityId: id,
    };
    dispatch({
      type: 'onlineExam/getonlineExam',
      payload: {
        text: JSON.stringify(userDetail),
      },
      callBack: item => {
        console.log("onlineExam::", item)
        if (item.code === '0') {
          if (`${item.resultMap.objectType}` === '3' || `${item.resultMap.objectType}` === '6') {
            const { newsContent } = item.resultMap;
            this.setState({
              isIframe: true,
              iframeSrc: newsContent,
            });
            // isIframe: false, // 是否悠视资讯
            // iframeSrc: '', // 悠视资讯src
          } else {
            const { activityInfo, titleImage, isJoin, isCan, reason } = item.resultMap;
            const requestInfoData = item.resultMap;
            that.setState({
              activityInfo,
              titleImage,
              isJoin,
              isCan,
              reason,
              requestData: requestInfoData,
              activityTitle: item.resultMap.activityInfo.name,
              activityFavoritesId: item.resultMap.favoritesId,
              activityIsVote: item.resultMap.isVote,
              begintime: item.resultMap.activityInfo.begintime,
              endtime: item.resultMap.activityInfo.endtime,
              status: item.resultMap.activityInfo.status,
              selectcount: item.resultMap.activityInfo.selectcount,
              joincount: item.resultMap.joincount,
            });
            document.getElementById('content').innerHTML = activityInfo.content;
          }
        } else if (item.code === '1') {
          message.error('活动已被删除!');
          const nextId = sessionStorage.getItem('oldId');
          const nextObjectType = sessionStorage.getItem('oldObjectType');
          const nextSubtype = sessionStorage.getItem('oldSubtype');
          if (
            nextId &&
            nextObjectType &&
            nextSubtype &&
            nextId !== '' &&
            nextObjectType !== '' &&
            nextSubtype !== ''
          ) {
            const arr = location.pathname.split('/');
            arr.pop();
            const newUrl = arr.join('/');
            router.replace({
              pathname: `${newUrl}/${nextObjectType}`,
              query: {
                id: nextId,
                subType: nextSubtype,
              },
            });
          } else {
            router.go(-1);
          }
        } else {
          message.error(item.message);
          const requestInfoData = item.resultMap;
          that.setState({
            requestData: requestInfoData,
          });
        }
      },
    });
  };

  joinActivity = type => {
    const { activityInfo, isJoin, /* requestData, */ activityNewsId } = this.state;
    const { dispatch, match } = this.props;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const userDetail = {
      activityId: activityNewsId,
      msgId: 'APP018',
      userId: userInfo.id,
      userInfoList: [],
    };
    const exitDetail = {
      activityId: activityNewsId,
      msgId: 'APP019',
      userId: userInfo.id,
    };

    const {
      location: {
        query: { id = '', subType = '' },
      },
    } = this.props;
    if (isJoin && activityInfo.typeid !== '4') {
      dispatch({
        type: 'onlineExam/exitActivity',
        payload: {
          text: JSON.stringify(exitDetail),
        },
        callBack: res => {
          if (res.code === '0') {
            message.success('您已成功退出活动');
          } else {
            message.error('退出失败');
          }
          this.getActivityDetail();
        },
      });
    } else if (activityInfo.typeid === '1') {
      dispatch({
        type: 'onlineExam/joinActivity',
        payload: {
          text: JSON.stringify(userDetail),
        },
        callBack: res => {
          if (res.code === '0') {
            message.success('您已成功参加活动');
          } else {
            message.error('参加失败');
          }
          this.getActivityDetail();
        },
      });
    } else if (activityInfo.typeid === '2') {
      this.showModal();
    } else {
      router.push({
        pathname: `${match.url}/joinExam`,
        query: {
          activityId: id,
          subType,
        },
      });
    }
  };

  joinClick = () => {
    this.joinActivity(1);
  };

  // 获取当时时间格式为YYYY-MM-DD HH:MM:SS
  getNowFormatDate = () => {
    const date = new Date();
    const seperator1 = '-';
    const seperator2 = ':';
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = `0${month}`;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = `0${strDate}`;
    }
    const currentdate = `${date.getFullYear() +
      seperator1 +
      month +
      seperator1 +
      strDate} ${date.getHours()}${seperator2}${date.getMinutes()}${seperator2}${date.getSeconds()}`;
    return currentdate;
  };

  showModal = () => {
    this.setState({
      showModal: true,
    });
  };

  handleCancel = () => {
    this.setState({
      showModal: false,
      editModal: false,
    });
  };

  handleOk = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        // const { activityInfo } = this.state;
        const { dispatch } = this.props;
        const { activityNewsId, editModal } = this.state;
        const userInfo = JSON.parse(storage.getLocal('userInfo'));
        const userDetail = {
          activityId: activityNewsId,
          msgId: editModal ? 'APP044' : 'APP018',
          userId: userInfo.id,
          userInfoList: [values],
        };
        dispatch({
          type: 'onlineExam/joinActivity',
          payload: {
            text: JSON.stringify(userDetail),
          },
          callBack: res => {
            if (res.code === '0') {
              message.success(editModal ? '修改信息成功' : '您已成功参加活动');
              this.setState({
                showModal: false,
                editModal: false,
              });
            } else {
              message.error(editModal ? '修改失败' : '参加失败');
            }
            this.getActivityDetail();
          },
        });
      }
    });
  };

  // 活动参与人员
  getJionPersons = () => {
    const { dispatch } = this.props;
    const { activityNewsId } = this.state;
    const formdata = {
      activityId: activityNewsId,
      msgId: 'APP042',
      index: 0,
    };
    dispatch({
      type: 'onlineExam/getActivityMenmbers',
      payload: {
        text: JSON.stringify(formdata),
      },
      callBack: res => {
        if (res.code === '0') {
          const { objList } = res.resultMap;
          const data = [];
          for (let i = 0; objList && i < objList.length; i += 1) {
            data.push({
              avatar: `${commenConfig.downPath}/${objList[i].txpic}`,
              name: objList[i].name,
            });
          }
          this.setState({ visible: 'members', membersList: data });
        } else {
          message.error('获取失败');
        }
      },
    });
  };

  // 问卷统计
  getQuestionnaire = () => {
    const { dispatch } = this.props;
    const { activityNewsId } = this.state;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const formdata = {
      activityId: activityNewsId,
      msgId: 'APP048',
      index: 0,
      userId: userInfo.id,
      department: userInfo.orgid,
    };
    dispatch({
      type: 'onlineExam/getQuestionnaire',
      payload: {
        text: JSON.stringify(formdata),
      },
      callBack: res => {
        if (res.code === '0') {
          let topicList;
          if (res.resultMap.topicList) {
            topicList = res.resultMap;
          } else {
            topicList = [];
          }
          this.setState({ visible: 'quetion', questionnaireList: topicList });
        } else {
          message.error('获取失败');
        }
      },
    });
  };

  // 获取投票结果
  getVoteResult = () => {
    const { dispatch } = this.props;
    const { activityNewsId, requestData } = this.state;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const formdata = {
      activityId: activityNewsId,
      msgId: 'APP030',
      index: 0,
      userId: userInfo.id,
      mobile: userInfo.mobile,
    };
    dispatch({
      type: 'onlineExam/getVoteResult',
      payload: {
        text: JSON.stringify(formdata),
      },
      callBack: res => {
        if (res.code === '0') {
          let list = [];
          let totalVote = 0;
          const data = [];
          if (res.resultMap.optionList) {
            list = res.resultMap.optionList;
            totalVote = res.resultMap.voteCount;
          }
          for (let i = 0; i < list.length; i += 1) {
            data.push({
              percent: totalVote ? Math.round((Number(list[i].selectcount) * 100) / totalVote) : 0,
              content: list[i].content,
              url: list[i].url,
            });
          }
          this.setState({
            visible: 'vote',
            voteResult: { list: data, titleList: requestData.topicList },
          });
        } else {
          message.error('获取失败');
        }
      },
    });
  };

  // 获取组织参与率
  getDepartmentJoinRate = () => {
    const { dispatch } = this.props;
    const { activityNewsId, activityInfo } = this.state;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const formdata = {
      activityId: activityNewsId,
      msgId: activityInfo.typeid === '6' ? 'APP055' : 'APP047',
      index: 0,
      userId: userInfo.id,
      department: userInfo.orgid,
    };
    dispatch({
      type: 'onlineExam/getDepartmentJoinRate',
      payload: {
        text: JSON.stringify(formdata),
      },
      callBack: res => {
        if (res.code === '0') {
          const { statistics } = res.resultMap;
          const data = [];
          for (let i = 0; statistics && i < statistics.length; i += 1) {
            data.push({
              title: `${statistics[i].department}`,
              totalNum: statistics[i].totalNum,
              joinNum: statistics[i].joinNum,
              percent: statistics[i].totalNum
                ? Math.round((statistics[i].joinNum * 100) / statistics[i].totalNum)
                : 0,
            });
          }
          this.setState({ visible: 'jionRate', JionRateList: data });
        } else if (res.code === '1') {
          message.error(res.message);
        } else {
          message.error('获取失败');
        }
      },
    });
  };

  // 组织平均分
  getDepartmentScore = () => {
    const { dispatch } = this.props;
    const { activityNewsId } = this.state;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const formdata = {
      activityId: activityNewsId,
      msgId: 'APP046',
      index: 0,
      userId: userInfo.id,
      department: userInfo.orgid,
    };
    dispatch({
      type: 'onlineExam/getDepartmentScore',
      payload: {
        text: JSON.stringify(formdata),
      },
      callBack: res => {
        if (res.code === '0') {
          const { statistics } = res.resultMap;
          const data = [];
          for (let i = 0; statistics && i < statistics.length; i += 1) {
            data.push({
              title: `${statistics[i].department}`,
              number: statistics[i].joinNum,
              score: statistics[i].avgScore ? Number(statistics[i].avgScore.toFixed(1)) : 0,
            });
          }
          this.setState({ visible: 'score', scoreList: data });
        } else if (res.code === '1') {
          message.error(res.message);
        } else {
          message.error('获取失败');
        }
      },
    });
  };

  // 学霸排行榜
  getStudyRank = () => {
    const { dispatch } = this.props;
    const { activityNewsId } = this.state;
    const formdata = {
      activityId: activityNewsId,
      msgId: 'APP059',
      topNum: '10',
    };
    dispatch({
      type: 'onlineExam/getStudyRank',
      payload: {
        text: JSON.stringify(formdata),
      },
      callBack: res => {
        if (res.code === '0') {
          const { userRankInfos } = res.resultMap;
          const data = [];
          for (let i = 0; userRankInfos && i < userRankInfos.length; i += 1) {
            data.push({
              name: userRankInfos[i].name,
              rate: i + 1,
              score: userRankInfos[i].score,
              avatar: `${commenConfig.downPath}/${userRankInfos[i].txpic}`,
            });
          }
          this.setState({ visible: 'rank', userRankList: data });
        } else {
          message.error('获取失败');
        }
      },
    });
  };

  cancel = () => {
    this.setState({
      visible: '',
    });
  };

  editUserInfo = () => {
    const { dispatch } = this.props;
    const { activityNewsId, userInfo } = this.state;
    const formdata = {
      activityId: activityNewsId,
      msgId: 'APP043',
      userId: userInfo.id,
    };
    dispatch({
      type: 'onlineExam/getActivityUserInfo',
      payload: {
        text: JSON.stringify(formdata),
      },
      callBack: res => {
        if (res.code === '0') {
          let list = [];
          if (res.resultMap.userinfolist) {
            list = JSON.parse(res.resultMap.userinfolist);
          }
          this.setState({ editModal: true, userinfolist: list });
        } else {
          message.error('获取失败');
        }
      },
    });
  };

  getButtonTitle = activityInfo => {
    const {
      isJoin,
      isCan,
      reason,
      begintime,
      endtime,
      status,
      selectcount,
      joincount,
      requestData,
    } = this.state;
    const ButtonTitle = [];
    const { loading1, loading2, loading5, loading6, loading3, loading4, loading7 } = this.props;
    // 考试活动
    if (activityInfo.typeid === '6') {
      const isExpira = new Date(getNowFormatDate().replace(/-/g, '/')) > new Date(begintime.replace(/-/g, '/')) &&
        new Date(getNowFormatDate().replace(/-/g, '/')) < new Date(endtime.replace(/-/g, '/'));
      // 是否已经参加考试
      if (isJoin === true) {
        if (
          isExpira === false ||
          !isCan ||
          status === '2' ||
          selectcount === '0' ||
          joincount >= selectcount
        ) {
          <Button />;
        } else {
          ButtonTitle.push(
            <Button type="danger" className={styles.butttonJion} onClick={this.joinExam} key={'再次参加'}>
              再次参加
            </Button>
          );
        }
        ButtonTitle.push(
          <Button type="danger" className={styles.viewButtton} onClick={this.viewExam} key={'查看详情'}>
            查看详情
          </Button>
        );
      } else if (isExpira === false) {
        // 考试活动是否到期
        // 未到开始时间或已超过结束时间
        ButtonTitle.push(
          <Button type="primary" disabled key={reason}>
            {reason}
          </Button>
        );
      } else if (!isCan) {
        // 用户是否可参加
        // 不可参加
        ButtonTitle.push(
          <Button type="primary" disabled key={reason}>
            {reason}
          </Button>
        );
      } else if (status === '2') {
        ButtonTitle.push(
          <Button type="primary" disabled key={'活动已取消'}>
            活动已取消
          </Button>
        );
      } else {
        ButtonTitle.push(
          <Button type="danger" className={styles.butttonJion} onClick={this.joinExam} key={'我要参加考试'}>
            我要参加考试
          </Button>
        );
      }
      ButtonTitle.push(
        <Button
          type="danger"
          className={styles.buttton}
          onClick={this.getDepartmentScore}
          loading={loading4}
          key={'组织平均分'}
        >
          组织平均分
        </Button>
      );
      ButtonTitle.push(
        <Button
          type="danger"
          className={styles.buttton}
          onClick={this.getDepartmentJoinRate}
          loading={loading3}
          key={'组织参与率'}
        >
          组织参与率
        </Button>
      );
      ButtonTitle.push(
        <Button
          type="danger"
          className={styles.buttton}
          onClick={this.getStudyRank}
          loading={loading5}
          key={'学霸排行'}
        >
          学霸排行
        </Button>
      );
      return ButtonTitle;
    }
    // 投票活动
    if (activityInfo.typeid === '4') {
      let isExTime = false;
      if (new Date(getNowFormatDate().replace(/-/g, '/')) < new Date(endtime.replace(/-/g, '/'))) {
        isExTime = true;
      }
      ButtonTitle.push(
        requestData && JSON.stringify(requestData) !== '{}' ? (
          <Button
            type="danger"
            className={
              this.getActivityButton(activityInfo, isExTime).disable
                ? styles.butttonDisable
                : styles.buttton
            }
            onClick={this.joinClick}
            disabled={this.getActivityButton(activityInfo, isExTime).disable}
            key={'111'}
          >
            {this.getActivityButton(activityInfo, isExTime).name}
          </Button>
        ) : null
      );
      ButtonTitle.push(
        <Button
          type="danger"
          className={styles.buttton}
          onClick={this.getJionPersons}
          loading={loading1}
          key={'活动参与人员'}
        >
          活动参与人员
        </Button>
      );
      if (isExTime) {
        ButtonTitle.push(
          <Button
            type="danger"
            className={styles.buttton}
            onClick={this.getVoteResult}
            loading={loading7}
            key={'查看投票结果'}
          >
            查看投票结果
          </Button>
        );
      }
      return ButtonTitle;
    }
    // 报名活动 问卷活动
    if (activityInfo.typeid === '1' || activityInfo.typeid === '2' || activityInfo.typeid === '5') {
      // 活动时间是否截止
      let isExTime = false;
      if (
        new Date(getNowFormatDate().replace(/-/g, '/')) <
        new Date(activityInfo.endtime.replace(/-/g, '/'))
      ) {
        isExTime = true;
      }
      // 报名时间是否截止
      let joinExTime = false;
      if (
        new Date(getNowFormatDate().replace(/-/g, '/')) <
        new Date(activityInfo.applyend.replace(/-/g, '/'))
      ) {
        joinExTime = true;
      }
      ButtonTitle.push(
        requestData && JSON.stringify(requestData) !== '{}' ? (
          <Button
            type="danger"
            className={
              this.getActivityButton(activityInfo, isExTime).disable
                ? styles.butttonDisable
                : styles.buttton
            }
            onClick={this.joinClick}
            disabled={this.getActivityButton(activityInfo, isExTime).disable}
            key={'112312'}
          >
            {this.getActivityButton(activityInfo, isExTime).name}
          </Button>
        ) : null
      );
      ButtonTitle.push(
        <Button
          type="danger"
          className={styles.buttton}
          onClick={this.getJionPersons}
          loading={loading1}
          key={'活动参与人员'}
        >
          活动参与人员
        </Button>
      );
      if (activityInfo.typeid === '2') {
        if (requestData.isJoin && joinExTime) {
          ButtonTitle.push(
            <Button
              type="danger"
              className={styles.buttton}
              onClick={this.editUserInfo}
              loading={loading6}
              key={'修改报名信息'}
            >
              修改报名信息
            </Button>
          );
        }
      }
      if (activityInfo.typeid === '5') {
        ButtonTitle.push(
          <Button
            type="danger"
            className={styles.buttton}
            onClick={this.getQuestionnaire}
            loading={loading2}
            key={'问卷统计'}
          >
            问卷统计
          </Button>
        );
        ButtonTitle.push(
          <Button
            type="danger"
            className={styles.buttton}
            onClick={this.getDepartmentJoinRate}
            loading={loading3}
            key={'组织参与率'}
          >
            组织参与率
          </Button>
        );
      }
      return ButtonTitle;
    }
    return ButtonTitle;
  };

  // 控制第一个按钮(是否参加按钮)
  getActivityButton = (activityInfo, isExTime) => {
    const { requestData } = this.state;
    if (activityInfo.typeid === '1' || activityInfo.typeid === '2' || activityInfo.typeid === '5') {
      if (requestData.isJoin) {// 是否已参加
        if (activityInfo.typeid === '1' || activityInfo.typeid === '2') {
          return { name: '退出活动', disable: false };
        }
        return { name: '已参加', disable: true };
      }
      if (activityInfo.upperLimit && activityInfo.participant >= activityInfo.upperLimit) {
        return { name: '该活动参与人数已达上限', disable: true };
      }
      if (requestData.isCan) {
        return isExTime
          ? { name: '我要参加', disable: false }
          : { name: '该活动已结束', disable: true };
      }
    }
    if (activityInfo.typeid === '4') { // 投票
      if (requestData.isJoin) {
        let daynum = Number(activityInfo.daycount);
        if (activityInfo.daycount === undefined || activityInfo.daycount === '') {
          daynum = 1;
          if (requestData.joincount >= Number(daynum)) {
            return { name: '已参加', disable: true };
          }
        }
      }
      if (activityInfo.upperLimit && activityInfo.participant >= activityInfo.upperLimit) {
        return { name: '该活动参与人数已达上限', disable: true };
      }
      if (requestData.isCan) {
        if (isExTime) {
          return requestData.joincount === 0
            ? { name: '我要参加', disable: false }
            : { name: '再次投票', disable: false };
        }
        return { name: '该活动已结束', disable: true };
      }
    }
    return {
      name: requestData.btnName !== '' ? requestData.btnName : requestData.reason,
      disable: true,
    };
  };

  getInitValue = (list, item) => {
    if (item.type !== '选项') {
      return list[0][item.name];
    }
    return list[0][item.name];
  };

  getActivityTime = (start, end) => `${start.slice(0, 16)}--${end.slice(0, 16)}`;

  getDetailInfo = (title, content) => (
    <div className={styles.activityDetail}>
      <span className={styles.activityTitle}>{title}</span>
      <span className={styles.activityInfo}>{content}</span>
    </div>
  );

  render() {
    const {
      activityInfo,
      requestData,
      activityNewsId,
      showModal,
      isMore,
      isIframe,
      iframeSrc,
      questionnaireList,
      membersList,
      visible,
      JionRateList,
      scoreList,
      userRankList,
      editModal,
      userinfolist,
      voteResult,
    } = this.state;
    // console.log('userinfolist=', userinfolist);
    const { location, loading } = this.props;
    const { fieldList } = requestData;
    const { form } = this.props;
    const { getFieldDecorator, setFieldsValue } = form;
    // 后台原因，1活动，2资讯
    // let objectType = location && location.pathname.indexOf('/news') === -1 ? '1' : '2';
    // if (location.pathname.indexOf('/infopage') !== -1) {
    //   const arr = location.pathname.split('/');
    //   if (arr.length > 4) {
    //     objectType = `${arr[4]}` === '1' ? '2' : '1';
    //   }
    // }
    // 自定义校验方法， 输入框不能输入汉字
    const checkData = (rule, value, callback) => {
      if (value) {
        if (!/^\d+$|^\d+\.\d+$/g.test(value)) {
          callback(new Error('只可输入数字!'));
        } else {
          callback(
            setFieldsValue({
              // 自动转成大写
              refTable: `${Number(value)}`,
            })
          );
        }
      }
      callback();
    };

    const checkData2 = (rule, value, callback) => {
      callback(
        setFieldsValue({
          // 自动转成大写
          refTable: value,
        })
      );
    };

    // 活动包含的操作按钮
    // 比对当前时间是未开始还是已结束isExpira为true表示在考试时间内
    // typeid：活动类型：报名（1无报名信息,2有报名信息），4投票，5问卷，6考试，7订购
    const ButtonTitle = this.getButtonTitle(activityInfo);
    return (
      <div style={{ padding: 20 }}>
        <BreadCrumbDetail {...this.props} type={isMore ? '更多资讯' : '网上课堂'} />
        {isIframe ? (
          <div className={styles.iframeBox}>
            <iframe src={iframeSrc} frameBorder="0" title="iframe" className={styles.more} />
          </div>
        ) : (
            <div className={styles.waitTxt}>
              <p className={styles.title}>{activityInfo.name}</p>
              {activityInfo.name ? (
                <div className={styles.subTitle}>
                  {this.getDetailInfo(
                    '活动时间：',
                    this.getActivityTime(activityInfo.begintime, activityInfo.endtime)
                  )}
                  {activityInfo.typeid === '1' || activityInfo.typeid === '2'
                    ? this.getDetailInfo(
                      '报名时间：',
                      this.getActivityTime(activityInfo.applybegin, activityInfo.applyend)
                    )
                    : null}
                  {activityInfo.typeid === '1' || activityInfo.typeid === '2' ? (
                    <div className={styles.activityDetail}>
                      <span className={styles.activityTitleContacts}>活动联系人：</span>
                      <span className={styles.activityInfoContacts}>
                        <Avatar
                          size="36px"
                          style={{
                            backgroundColor: '#087edf',
                            color: '#fff',
                            marginRight: 8,
                            verticalAlign: 'middle',
                          }}
                        >
                          {activityInfo.linkman.length >= 2
                            ? activityInfo.linkman.slice(-2)
                            : activityInfo.linkman}
                        </Avatar>
                        <span style={{ marginRight: 40 }}>{`${activityInfo.linkman}`}</span>
                        <MyFont
                          type="icon-shouji"
                          style={{ fontSize: 16, color: 'black', marginRight: 6 }}
                        />
                        <span>{`${activityInfo.mobile}`}</span>
                      </span>
                    </div>
                  ) : null}

                  {activityInfo.typeid === '1' || activityInfo.typeid === '2'
                    ? this.getDetailInfo('活动地点：', activityInfo.address)
                    : null}

                  <div className={styles.activityDetail}>
                    <span className={styles.activityTitle}>活动安排：</span>
                  </div>
                </div>
              ) : null}
              <Spin spinning={loading}>
                <p className={styles.examTime} id="content" />
              </Spin>
              <div className={styles.joinExamBtn}>{ButtonTitle}</div>
            </div>
          )}
        <ActivityMemberModal
          visible={visible === 'members'}
          dataSource={membersList}
          onCancel={this.cancel}
        />
        <QuestionnaireModal
          visible={visible === 'quetion'}
          dataSource={questionnaireList.topicList || []}
          onCancel={this.cancel}
          activityNewsId={activityNewsId}
        />
        <VoteResultModal
          visible={visible === 'vote'}
          dataSource={voteResult}
          onCancel={this.cancel}
        />
        <DepartmentJoinRateModal
          visible={visible === 'jionRate'}
          dataSource={JionRateList}
          onCancel={this.cancel}
        />
        <DepartmentScoreModal
          visible={visible === 'score'}
          dataSource={scoreList}
          onCancel={this.cancel}
        />
        <StudyRateModal
          visible={visible === 'rank'}
          dataSource={userRankList}
          onCancel={this.cancel}
        />
        <Modal
          title={editModal ? '修改信息' : '报名信息'}
          visible={showModal || editModal}
          onOk={this.handleOk}
          width={600}
          destroyOnClose
          onCancel={this.handleCancel}
        >
          <Form
            layout="horizontal"
            className={styles.stepForm}
            onSubmit={this.handleSubmit}
            hideRequiredMark
          >
            {fieldList &&
              fieldList.map((item, index) => (
                <FormItem
                  key={index}
                  {...this.getForItemLayout(7, 15)}
                  label={
                    <Tooltip title={item.name}>
                      <span className={styles.toolTip}>{item.name}</span>
                    </Tooltip>
                  }
                >
                  {getFieldDecorator(item.name, {
                    initialValue:
                      editModal && userinfolist.length
                        ? this.getInitValue(userinfolist, item)
                        : null,
                    rules:
                      item.type !== '选项'
                        ? [
                          {
                            required: item.isrequired,
                            message: '请输入',
                          },
                          {
                            max: item.length,
                            message: `字数不要超过${item.length}`,
                          },
                          {
                            validator: item.type === '数字' ? checkData : checkData2,
                            trigger: 'blur',
                          },
                        ]
                        : [
                          {
                            required: item.isrequired,
                            message: '请选择',
                          },
                        ],
                  })(
                    item.type === '选项' ? (
                      <RadioGroup>
                        {item.options.map((itemOpt, index) => (
                          <Radio key={index} value={itemOpt}>
                            {itemOpt}
                          </Radio>
                        ))}
                      </RadioGroup>
                    ) : (
                        <Input placeholder={item.type === '数字' ? '请输入数字' : ''} />
                      )
                  )}
                </FormItem>
              ))}
            {activityInfo && activityInfo.attention && (
              <div>
                <span className={styles.attention}>报名须知：</span>
                <TextArea
                  disabled
                  className={styles.attentionContent}
                  defaultValue={activityInfo.attention}
                  autosize={{ minRows: 1, maxRows: 10 }}
                />
              </div>
            )}
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ExamOnlineWait;
