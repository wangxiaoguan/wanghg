
import React,{Component} from "react";
import './array.scss'
export default class Array10 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='array10'>
<pre>{`
    var date = new Date ();                         返回当日的日期和时间
    var year = date.getFullYear();                  返回年份
    var month = date.getMonth();                    返回月份 (0 ~ 11)
    var day = date.getDate();                       返回一个月中的某一天 (1 ~ 31)
    var week = data.getDay();                       返回周几(0 ~ 6)
    var hour = date.getHours();                     返回小时 (0 ~ 23
    var minute = date.getMinutes();                 返回分钟 (0 ~ 59)
    var second = date.getSeconds();                 返回秒数 (0 ~ 59)
    var Millis = data.getMilliseconds();            返回毫秒(0 ~ 999) 
    
    setFullYear()           设置年份
    setMonth()              设置月份 (0 ~ 11)
    setDate()               设置天 (1 ~ 31)
    setHours()              设置小时 (0 ~ 23)。
    setMinutes()            设置分钟 (0 ~ 59)。
    setSeconds()            设置秒钟 (0 ~ 59)。
    setMilliseconds()       设置毫秒 (0 ~ 999)。
    
    getTime()               返回毫秒数。
    parse()                 返回毫秒数。

    设置时间
    new Date(2018, 5, 18);              //实际中国时间2018-6-18
    new Date(2018, 5, 31);              //实际中国时间2018-7-1
    new Date(2018, 5, 0);               //实际中国时间2018-5-31
    new Date("2018-05-31");             //实际中国时间2018-5-31
    new Date("05/16/2018");             //实际中国时间2018-5-16
    new Date("2018/05/16");             //实际中国时间2018-5-16
    new Date("2016-08-03 00:00:00");    //Wed Aug 03 2016 00:00:00

    时间转时间戳:
    1.(new Date()).valueOf();           //结果：1477808630404 
    2.new Date().getTime();             //结果：1477808630404
    3.Number(new Date());               //结果：1477808630404 
    4.Date.parse(new Date());           //结果：1477808630000
    
    时间戳转时间
    new Date(1472048779952);

    设置当天时间0点
    new Date(new Date().toLocaleDateString());
`}</pre>
            </div>
        )
    }
}


