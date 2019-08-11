
export const AJAX_SEND = "ajax_send";
// export const AJAX_SUCCESS = "ajax_success";
// export const AJAX_FAILED = "ajax_failed";
// export const AJAX_ERROR = "ajax_error";
/***
 * 配置action参考
 * @param loading 是否需要加载中动画
 * @param config 具体的ajax请求配置
 * @param success ajax成功处理回调
 * @param failed ajax失败处理回调
 * @param error ajax错误处理回调
 * @returns {{type: string, loading: *, config: {}, success: *, failed: *}}
 */
export const ajaxSend=({loading=true,config={},success,failed,error})=>{
    return{
        type:AJAX_SEND,
        loading,
        config,
        success,
        failed,
        error
    }
}


import axios from "axios";
axios.defaults.baseURL = "http://47.94.208.182:3000/"

export const changeTitle = title =>{
    return {
        type:"changeTitle",
        title
    }
}


export const changeData = ({url}) => (
    axios.get(url)
    .then(res=>{
        return {
            type:"changeData_succ",
            data:res.data
        }
    })
)

export const get_mv = ({url}) =>{
    return axios.get(url)
        .then(res=>{
            return {
                type:"get_mv_succ",
                data:res.data
            }
        })
}

export const getmovie = (data) => {
    return {
        type:"getmovie",
        data
    }
}