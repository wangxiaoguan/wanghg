// 权限判断页

import React,{Component} from "react";
import { Spin, message } from 'antd';
import {getService} from '../../common/fetch';
import { setUserInfo, setToken } from '../../utils/ProjectUtils';

export default class index extends Component{
    

    componentDidMount(){
        let userid = sessionStorage.getItem('userid')||8
        getService(`/workReport/auth/getToken/${userid}`, res => {
            if(res && res.flag && res.data){
              const { user, token } = res.data;
              setToken(token)
              setUserInfo(user)
              location.hash = '/InformationSubmit'
            }else{
                message.error('未知错误')
            }
          })
        
    }
    

    render(){
        
        return(
            <Spin spinning />
        )
    }
}





