import {NormalCallRequest} from '@/utils/SystemUtil';

import {TotalData, FLoderList, FileList, FileUpload, FileDelete, FileEditCheck, FileDetailGet} from '../../services/StandardDevelop/TaskManageApi';

export default {
  namespace: 'TaskManage',
  state: {
  },
  effects: {
    *TotalData(data, funs) {
      // console.log(JSON.stringify(data))
      yield NormalCallRequest(data, funs, TotalData);
    },

    *FLoderList(data, funs) {
      // console.log(JSON.stringify(data))
      yield NormalCallRequest(data, funs, FLoderList);
    },

    *FileList(data, funs) {
      // console.log(JSON.stringify(data))
      yield NormalCallRequest(data, funs, FileList);
    },

    *FileUpload(data, funs) {
      // console.log(JSON.stringify(data))
      yield NormalCallRequest(data, funs, FileUpload);
    },

    *FileDelete(data, funs) {
      // console.log(JSON.stringify(data))
      yield NormalCallRequest(data, funs, FileDelete);
    },

    *FileEditCheck(data, funs) {
      // console.log(JSON.stringify(data))
      yield NormalCallRequest(data, funs, FileEditCheck);
    },

    *FileDetailGet(data, funs) {
      // console.log(JSON.stringify(data))
      yield NormalCallRequest(data, funs, FileDetailGet);
    },

    // *refuse(data, funs) {
    //   yield NormalCallRequest(data, funs, refuse);
    // },

    // *search(data, funs) {
    //   yield NormalCallRequest(data, funs, search);
    // },

    // *update(data, funs) {
    //   yield NormalCallRequest(data, funs, update);
    // },

    // *remove(data, funs) {
    //   yield NormalCallRequest(data, funs, remove);
    // },

    
  },
  reducers: {

  },
}