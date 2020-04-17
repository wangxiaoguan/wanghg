import {NormalCallRequest} from '@/utils/SystemUtil';
import {remove, update, add, search, updateCheckStatus} from '@/services/wto/tbt/discussionCheckApi';

export default {
  namespace: 'DiscussionCheck',
  state: {
  },
  effects: {
    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },
    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },
    *add(data, funs) {
      yield NormalCallRequest(data, funs, add);
    },
    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },
    *updateCheckStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateCheckStatus);
    }
  },
  reducers: {

  },
}
