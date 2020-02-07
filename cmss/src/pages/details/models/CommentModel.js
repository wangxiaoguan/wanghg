import * as commentServices from '../../../services/comment';
import * as learnNoteServices from '../../../services/learnNote';
import {
  message
} from 'antd';
import { stat } from 'fs';

export default {
  namespace: 'comment',
  state: {
    pviews: 0, // 浏览数量
    commentCount: 0, // 评论数量
    voteCount: 0, // 点赞数量
    favoritesId: undefined, //收藏id，不为空则为已经收藏，为空未收藏
    commentList: [], // 评论列表
    niceCommentList: [], // 精彩评论
    commentTotal: 0, // 评论总数
    currentPage: 1, // 评论分页
    // active: false, // 正文是否点赞了
    activityId: '', // 正文id
    type: '1', // 子类型
    objectType: '1', // 大类型
    title: '1', // 标题
    isVote: false, // 正文是否已赞
    noteVisible: false, // 学习笔记显示
    noteInfo: undefined, // 学习笔记内容
    allFiles: [],
  },

  effects: {
    /**
     * 获取点赞数 订阅数 评论数
     */
    * getNewsCountDetail({ payload }, { call, put }) {
      const response = yield call(commentServices.getnewsActivityList, payload);
      if (response && JSON.stringify(response) !== '{}' && response.code === '0') {
        if (response.resultMap) {
          let pview = response.resultMap.viewCount;
          let commentTotal = response.resultMap.commentCount;
          let voteCount = response.resultMap.voteCount;
          yield put({
            type: 'saveState',
            payload: {
              pview,
              commentTotal,
              voteCount,
            },
          });
        }
      } else {
        // message.error(response && response.message || '获取评论数量出错')
        console.error(response && response.message || '获取评论数量出错');
      }
    },

    /**
     * 资讯点赞
     */
    * informationLike({ payload }, { call, put }) {
      const response = yield call(commentServices.getnewsActivityList, payload);
      if (response && JSON.stringify(response) !== '{}') {
        const resultMap = response.resultMap;
        if (response.code === '0') {
          const voteCount = resultMap && resultMap.voteCount;
          yield put({
            type: 'saveState',
            payload: {
              voteCount,
              isVote: true
            },
          });
          message.success('点赞成功');
        } else {
          message.error((response && response.message) || '点赞失败');
        }
      } else {
        message.error((response && response.message) || '点赞失败');
      }
    },

    /**
     * 活动点赞
     */
    * activeLike({ payload }, { call, put }) {
      console.log('activeLike');
      const response = yield call(commentServices.activeLike, payload);
      if (response && JSON.stringify(response) !== '{}') {
        if (response.code === '0') {
          yield put({
            type: 'activityVoteCountUp',
          });
          yield put({
            type: 'saveState',
            payload: {
              isVote: true
            },
          });
          message.success('点赞成功');
        } else {
          message.error((response && response.message) || '点赞失败');
        }

        // callBack(response);
      }
    },

    /**
     * 收藏文章
     */
    * addFavorites({ payload }, { call, put }) {
      const response = yield call(commentServices.favorites, payload);
      if (response && JSON.stringify(response) !== '{}') {
        const resultMap = response.resultMap;
        if (response.code === '0') {
          yield put({
            type: 'saveState',
            payload: {
              favoritesId: resultMap && resultMap.id,
            },
          });
          message.success('收藏成功');
        } else {
          message.error((response && response.message) || '收藏失败');
        }
      }
    },

    /**
     * 取消收藏文章
     */
    * cancelFavorites({ payload }, { call, put }) {
      const response = yield call(commentServices.favorites, payload);
      if (response && JSON.stringify(response) !== '{}') {
        if (response.code === '0') {
          yield put({
            type: 'saveState',
            payload: {
              favoritesId: '',
            },
          });
          message.success('取消收藏成功');
        } else {
          message.error((response && response.message) || '点赞失败');
        }
      }
    },
    /**
     * 发表评论
     */
    * submitComment({
      payload,
      callBack
    }, {
      call
    }) {
      console.log("submitComment")
      const response = yield call(commentServices.activeLike, payload);
      if (response && JSON.stringify(response) !== '{}' && callBack) {
        callBack(response);
      }
    },
    /**
     * 评论点赞
     */
    * setLike({ payload, callBack }, { call }) {
      const response = yield call(commentServices.activeLike, payload);
      if (response && JSON.stringify(response) !== '{}' && callBack) {
        callBack(response);
      }
    },
    /**
     * 删除评论
     */
    * deleteComment({ payload, callBack }, { call }) {
      const response = yield call(commentServices.activeLike, payload);
      if (response && JSON.stringify(response) !== '{}' && callBack) {
        callBack(response);
      }
    },

    /**
     * 获取评论列表
     */
    * getCommentList({ payload }, { call, put }) {
      const response = yield call(commentServices.activeLike, payload);
      if (response && JSON.stringify(response) !== '{}') {
        let commentList = [];
        let commentCount = 0;
        let niceCommentList = [];
        if (response.code === '0' && response.resultMap) {
          if (response.resultMap.objList) {
            for (let i = 0; i < response.resultMap.objList.length; i += 1) {
              const item = response.resultMap.objList[i];
              const isNice = item.commentType === 1 || item.commentType === '1'
              if (isNice) {
                niceCommentList.push(item);
              } else {
                commentList.push(item);
              }
              for (let j = 0; j < item.replyList.length; j += 1) {
                item.replyList[j].isReply = true;
                item.replyList[j].index = j;
                item.replyList[j].parentId = item.id;
                if (j === item.replyList.length - 1) {
                  item.replyList[j].isReplyLast = true;
                }
                if (j === 0) {
                  item.replyList[j].replyCount = item.replyList.length;
                }
                if (isNice) {
                  niceCommentList.push(item.replyList[j]);
                } else {
                  commentList.push(item.replyList[j]);
                }
              }
            }
            commentCount = response.resultMap.count || 0;
          }

          yield put({
            type: 'saveState',
            payload: {
              commentTotal: commentCount,
              commentList,
              niceCommentList
            }
          })
        } else {
          console.error(response && response.message || "获取评论列表失败")
        }
      }
    },

    /**
     * 获取用户层级
     */
    *getUserLevel({ payload, callBack }, { call }) {
      const response = yield call(commentServices.politicalActiveTask, payload);
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        // 对数据进行处理
        const postList = [];
        for (let i = 0; i < response.resultMap.postInfo.length; i++) {
          const item = response.resultMap.postInfo[i];
          postList.push({
            value: item.partyId,
            label: `${item.fullName}${item.postName}`,
            level: item.level,
            subLevel: item.subLevel !== undefined ? item.subLevel : '',
            index: i + 1,
            totalName: item.totalName,
          });
        }
        callBack(postList);
      }
    },
    // 学习笔记
    // 新增修改学习笔记
    * addOrUpdateNote({ payload }, { call, put }) {
      const resp = yield call(learnNoteServices.addNote, payload);
      if (resp && resp.code === '0') {
        message.success('保存笔记成功');
        yield put({
          type: 'saveState',
          payload: {
            noteVisible: false
          }
        })
      } else {
        message.error(resp && resp.message || '系统错误')
      }
    },

    // 查询学习笔记
    * getNote({ payload, noteVisible = false }, { call, put }) {
      const resp = yield call(learnNoteServices.getNote, payload);
      if (resp && resp.code === '0') {
        let noteInfo = undefined;
        if (resp.resultMap && resp.resultMap.reasonList && resp.resultMap.reasonList.length > 0) {
          noteInfo = resp.resultMap.reasonList[0];
        }
        let allFiles = [];
        if (noteInfo) {
          allFiles = noteInfo.noteAttachList;
        }
        yield put({
          type: 'saveState',
          payload: {
            noteInfo,
            noteVisible,
            allFiles,
          }
        })
      } else {
        message.error(resp && resp.message || '系统错误')
      }
    },

    * uploadFile({ payload, fileName, fileType }, { call, put }) {
      const resp = yield call(learnNoteServices.upload, payload);
      if (resp && resp.sucess === true && JSON.stringify(resp) !== '{}') {
        const fileUrl = resp.entity[0].filePath;
        let param = {
          height: 0,
          newsActivity: {
            fileName: fileName,
            fileUrl: fileUrl,
            categoryID: 0,
            commentCount: 0,
            commentNum: 0,
            content: "{\"h\":960,\"height\":0,\"w\":600,\"width\":0}",
            count: 0,
            imageType: 0,
            isAtlas: false,
            isComment: false,
            isLive: false,
            isPulish: false,
            isRequired: 0,
            isView: false,
            isVote: false,
            isatlas: false,
            iscomment: false,
            isinnershare: false,
            islive: false,
            isnick: false,
            isshare: false,
            layout: 0,
            objectType: 0,
            participant: 0,
            position: 0,
            pviews: 0,
            studytime: 0,
            type: 0,
            videoSize: 0,
            videoTime: 0,
            voteCount: 0
          },
          type: fileType,
          width: 0
        }
        yield put({
          type: 'addFile',
          payload: param
        })
      } else {
        message.error('上传失败');
      }
    }
  },

  reducers: {
    saveState(state, {
      payload
    }) {
      return {
        ...state,
        ...payload,
      };
    },
    activityVoteCountUp(state) {
      let voteCount = state.voteCount;
      return {
        ...state,
        voteCount: voteCount + 1,
      };
    },

    addFile(state, { payload }) {
      let { allFiles } = state;
      allFiles.push(payload);
      return {
        ...state,
        allFiles
      }
    },

    deleteFile(state, { payload }) {
      let { allFiles } = state;
      allFiles.splice(payload, 1);
      return {
        ...state,
        allFiles
      }
    },

    getAllReply(state, { payload }) {
      const {
        commentList,
        niceCommentList
      } = state;
      const {
        item,
        isNice
      } = payload;
      const list = isNice ? niceCommentList : commentList

      for (let i = 0; i < list.length; i += 1) {
        for (let j = 0; j < list[i].replyList.length; j += 1) {
          if (item.id === list[i].replyList[j].id) {
            list[i].replyList[j].replyCount = 0;
            for (let k = 0; k < list[i].replyList.length; k += 1) {
              list[i].replyList[k].index = 0;
            }
          }
        }
      }
      if (isNice) {
        return {
          ...state,
          niceCommentList: list
        }
      } else {
        return {
          ...state,
          commentList: list
        }
      }
    }
  }
}
