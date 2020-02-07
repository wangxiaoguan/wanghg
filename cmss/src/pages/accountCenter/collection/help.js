import moment from 'moment';
import commentConfig from '../../../../config/commenConfig';

export const loadData = datas =>
  datas.map(info => ({
    objectType: info.objectType,
    type: info.type,
    id: info.id,
    title: info.title,
    titleImage:
      info.titleImage && info.titleImage[0] && `${commentConfig.downPath}/${info.titleImage[0]}`,
    digest: info.digest,
    source: info.source || '',
    isView: info.isView || '0',
    pviews: info.pviews || '0',
    isComment: info.isComment,
    commentCount: info.commentCount || '0',
    collectCount: info.collectCount || '0',
    selfCollect: true,
    updateTime: moment(info.createDate).format('YYYY-MM-DD'),
  }));

export default {
  loadData,
};
