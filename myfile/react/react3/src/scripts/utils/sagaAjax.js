


import axios from 'axios';
import qs from 'qs';
// import store from '../weixin/store';
// axios 默认的Content-Type为 "application/json"
// 要使用 Content-Type: "application/x-www-form-urlencoded"
// 必须手动转换发送数据的数据格式 为 key=value&key=value字符串类型
// const baseURL = 'http://localhost:3000';

const baseURL = 'http://47.94.208.182:3000';

const ajax = axios.create({
	method: 'get',
	baseURL,
    transformRequest: [function (data) {
        return qs.stringify(data);
    }]
});

//添加一个请求拦截器
ajax.interceptors.request.use(function (config) {
	// 在发送请求之前做些什么
    // console.log("***********************")
	// console.log(config);
	const {data,headers} = config;
	return config;
}, function (error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});
export {baseURL};
export default ajax;