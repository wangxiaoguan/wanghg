import { NormalCallRequest } from '@/utils/SystemUtil';
import { remove, update, add, search, searchCommonDic, searchRegDic, updateStatus, updateAllStatus } from '@/services/society/rowData/reReportingApi';

export default {
    namespace: 'reReporting',
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
        *searchCommonDic(data, funs) {
            yield NormalCallRequest(data, funs, searchCommonDic);
        },
        *searchRegDic(data, funs) {
            yield NormalCallRequest(data, funs, searchRegDic);
        },
        *updateStatus(data, funs) {
            yield NormalCallRequest(data, funs, updateStatus);
        },
        *updateAllStatus(data, funs) {
            yield NormalCallRequest(data, funs, updateAllStatus);
        }
    },
    reducers: {

    },
}