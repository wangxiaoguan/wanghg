/**
 * Created by xhw on 2019/4/30 15:49
 */
import { getRemindsListData } from '@/services/accountCenter';
import { getDAesString } from '@/utils/utils';

export default {
  namespace: 'remind',
  state: {
    totalCount: 0, // 数据总量
    eventReminds: [], // 事项提醒数据
  },

  effects: {
    *getRemindsList({ payload }, { call, put }) {
      const resp = yield call(getRemindsListData, payload);
      const payloadItem = JSON.parse(payload.text);
      if (resp && resp.code === '0' && resp.resultMap) {
        const totalCount = resp.resultMap.count || 0;
        const reminds = resp.resultMap.objList || [];
        const eventReminds = [];
        for (let i = 0; i < reminds.length; i += 1) {
          const item = reminds[i];
          const deContent =
            getDAesString(
              item.content.replace(/\r/g, '').replace(/\n/g, ''),
              'youquqwertyuiopa',
              '12I9OPQjaC5FlFIl'
            ) || '{}';
          let content = '';
          let contentLink = '';
          let contentUrl = '';
          if (`${item.contenttype}` === '1') {
            // 纯文本
            content = deContent;
          } else if (`${item.contenttype}` === '13') {
            // 资讯
            const jsonContent = JSON.parse(deContent);

            content = jsonContent.title;
            contentLink = jsonContent.content;

            const targetId = (jsonContent && jsonContent.targetId) || '';
            const targetType = (jsonContent && jsonContent.targetType) || 0;
            const info = (jsonContent && jsonContent.info) || {};

            if (info && JSON.stringify(info) !== '{}') {
              if (`${targetType}` === '1' || `${targetType}` === '2') {
                contentUrl = `${
                  `${targetType}` === '2' ? 'activity' : 'news'
                }?id=${targetId}&subType=${info.type}`;
              }
            } else if (`${targetType}` === '3') {
              // 链接 ok
              contentUrl = jsonContent.url;
              if (contentUrl.indexOf('http') === -1) {
                contentUrl = `http://${contentUrl}`;
              }
            } else if (`${targetType}` === '4') {
              // 杂志 暂无
            }
          } else if (`${item.contenttype}` === '15') {
            // 任务 ok
            const jsonContent = JSON.parse(deContent);
            // console.log('jsonContent==', jsonContent);
            content = jsonContent.taskname;
            contentLink = jsonContent.content;
            contentUrl = `${jsonContent.topicid}/${jsonContent.taskid}/${jsonContent.partyid}/${
              jsonContent.issend ? 1 : 0
            }/detail`;
          } else if (`${item.contenttype}` === '26') {
            // 党费 ok
            const jsonContent = JSON.parse(deContent);
            content = jsonContent.title;
            contentLink = jsonContent.content;
          }

          eventReminds.push({
            index: i + 1 + payloadItem.index,
            content,
            contentLink,
            contentType: item.contenttype,
            time: item.createdate,
            contentUrl,
          });
        }
        yield put({
          type: 'updateState',
          payload: {
            eventReminds,
            totalCount,
          },
        });
      }
    },
  },

  reducers: {
    // 更新state中的数据
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
