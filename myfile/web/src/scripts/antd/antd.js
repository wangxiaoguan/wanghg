

// var a = [1,2,3];
// console.log(a.concat(4,5));


// var arr = new Array(3)
// arr[0] = "George"
// arr[1] = "John"
// arr[2] = "Thomas"

// var arr2 = new Array(3)
// arr2[0] = "James"
// arr2[1] = "Adrew"
// arr2[2] = "Martin"

// console.log(arr.concat(arr2))
// import React, { Component } from 'react';
import { Icon,Spin,Alert,Pagination,Rate,Divider,BackTop,DatePicker,message, notification} from 'antd';
import React,{Component} from 'react'
const { MonthPicker, RangePicker } = DatePicker;
import moment from 'moment';
const myDate = new Date();
export default   class DemoLearn extends Component {
    constructor(props){
        super(props);
        this.state={
           
        }
    }
  
   
 componentWillMount(){
    //  console.log(this.props)
 } 
 componentDidUpdate(){
    // console.log(this.props)
 }
 disabledRangeTime=(value, type) => {
    let hour;
    let hour2;
    if (value) {
      if (value.length) {
        hour = moment(value[0]).format('HH').toString();
        hour2 = moment(value[1]).format('HH').toString();
      }
    }
    return {
      disabledHours: () => {
        const result = [];
        for (let i = 0; i < 8; i++) {
          result.push(i);
        }
        if (type === 'start') {
          result.push(22, 23, 24);
        } else if (type === 'end') {
          result.push(23, 24);
        }
        return result;
      },
      disabledMinutes: () => {
        const result = [];
        for (let i = 1; i < 60; i++) {
          if (i != 30) {
            result.push(i);
          }
        }
        if (type === 'end') {
          if (hour2 === '22') {
            for (let i = 1; i < 60; i++) {
              result.push(i);
            }
          }
        }
        return result;
      },
    };
  }
  // 不可选的日期
  disabledDate=(current) => {
    const today = moment(Date.parse(new Date()) + 3*86400000).hour(0).minute(0).second(0); // 获取当天日期并转换成时间戳格式

    // 时间戳后一天为today+60*60*24*1000
    return (current && current.locale('zh-cn').valueOf() <= today.locale('zh-cn').valueOf());
    // return current && current.valueOf() < Date.now()- 86400000;
  }
  onChange=(date, dateString) => {
    if (moment(date[0]).date() !== moment(date[1]).date()) {
      notification.error({
        message: <div><p style={{ color: '#C30000', lineHeight: 3 }}>{dateString[0]}~{dateString[1]}</p>申请时间选择有误</div>,
        description: '申请场地的使用时间必须是同一天。',
      });
    }
    if (moment(date[1]).minute() != 0 && moment(date[1]).minute() != 30) {
      notification.error({
        message: <div><p style={{ color: '#C30000', lineHeight: 3 }}>{dateString[0]}~{dateString[1]}</p>申请时间选择有误</div>,
        description: '场地正式活动使用时间以每半天为一个单位场次，选择分钟以半小时为单位，请选择00或30',
      });
      return 0;
    }
    if (moment(date[0]).hour() >= 22) {
      notification.error({
        message: <div><p style={{ color: '#C30000', lineHeight: 3 }}>{dateString[0]}~{dateString[1]}</p>申请时间选择有误</div>,
        description: '场地正式活动使用时间以每半天为一个单位场次，分别为：8：30-12：00、12：00-17：00、17：00-22：00。',
      });
    }
  }
// 添加时间
onOk=(value) => {

    if (moment(value[0]).date() !== moment(value[1]).date()) {
      message.error("选择时间有误，请重新选择！");
    }
    // if (moment(value[0]).hour() < 12 && ((moment(value[1]).hour() === 12 && moment(value[1]).minute() > 0) || moment(value[1]).hour() > 12)) {
    //   message.error("选择时间有误，请重新选择！");
    // }
    // else if (moment(value[0]).hour() >= 12 && moment(value[0]).hour() < 14) {
    //   message.error("选择时间有误，请重新选择！");
    // }
    // else if (moment(value[0]).hour() < 17 && ((moment(value[1]).hour() === 17 && moment(value[1]).minute() > 0) || moment(value[1]).hour() > 17)) {
    //   message.error("选择时间有误，请重新选择！");
    // }
    // else if (moment(value[0]).hour() >= 17 && moment(value[0]).hour() < 19) {
    //   message.error("选择时间有误，请重新选择！");
    // }
    // else if (moment(value[0]).hour() < 19 && ((moment(value[1]).hour() === 19 && moment(value[1]).minute() > 0) || moment(value[1]).hour() > 22)) {
    //   message.error("选择时间有误，请重新选择！");
    // }
    else if (Date.parse(moment(value[0])) === Date.parse(moment(value[1]))) {
      message.error("开始时间和结束时间不能一样");
    }
    else {
      const getStartDetail = JSON.parse(JSON.stringify(this.props.record));
      if (!getStartDetail.activity_time) {
        getStartDetail.activity_time = [];
      }
      const time = this.state.time;
      const time_list = this.state.time_list;
      const time_parse = this.state.time_parse;
      let can_time = true;
      const value_start = value[0].format('YYYY-MM-DD HH:mm');
      const value_end = value[1].format('YYYY-MM-DD HH:mm');

      if (this.state.time.length === 0) {
        time.push(`${value_start}~${value_end}`);
        getStartDetail.activity_time.push({
          start: value_start,
          end: value_end,
        });
        time_parse.push({
          start: Date.parse(value_start),
          end: Date.parse(value_end),
        });
      } else {
        for (let i = 0; i < time_parse.length; i++) {
          if ((Date.parse(value_start) > time_parse[i].end && Date.parse(value_end) > time_parse[i].end) ||
            (Date.parse(value_start) < time_parse[i].start && Date.parse(value_end) < time_parse[i].start)) {
          } else {
            can_time = false;
          }
        }
        if (can_time === false) {
          message.info("当前所选时间与前面所选时间重复，请重新选择！");
        } else {
          time.push(`${value_start}~${value_end}`);
          getStartDetail.activity_time.push({
            start: value_start,
            end: value_end,
          });
          time_parse.push({
            start: Date.parse(value_start),
            end: Date.parse(value_end),
          });
        }
      }
      this.setState({
        time,
        time_list,
      });
      this.props.dispatch({ type: 'location/save', payload: { getStartDetail: getStartDetail } });
      const place = this.props.record.apply_times_list;

      if (place) {
        setTimeout(()=> {
          if (this.props.record.activity_time && this.props.record.activity_time.length) {
            this.props.callBackParent(place.place_id, place.place_name, this.props.record.activity_time);
          } else {

          }
        }, 10);

      }
    }
  }

  render() {
      
    return (
        <div>
            <RangePicker
                  disabledTime={this.disabledRangeTime}
                  disabledDate={this.disabledDate}
                  showTime={{
                    format: 'HH:mm',
                    hideDisabledOptions: true,
                    defaultValue: [moment(Date.now(), 'YYYY-MM-DD HH:mm:ss'), moment(Date.now(), 'YYYY-MM-DD HH:mm:ss')],
                  }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['开始时间', '结束时间']}
                  onChange={this.onChange}
                  onOk={this.onOk}
                  allowClear={false}
                  renderExtraFooter={() => '半个小时为最小单位'}
                />

            {/* <div className="icons-list">
                <Icon type="home" />
                <Icon type="setting" theme="filled" />
                <Icon type="smile" theme="outlined" />
                <Icon type="sync" spin />
                <Icon type="loading" />
                <Icon type="smile" theme="twoTone" />
                <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />
                <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
            </div>
            <div>
                <Spin tip="Loading..."/>
            </div>
            <div>
            <Spin tip="Loading...">
                <Alert
                message="中国梦世界梦"
                description="你好吗"
                type="info"
                />
            </Spin>
            </div>
            <div>
            <Pagination defaultCurrent={6} total={500} />
            </div>
            <div>
            <Pagination showSizeChanger  defaultCurrent={3} total={500} />
            </div>
            <div>
            <Pagination showQuickJumper defaultCurrent={2} total={500}  />
            </div>
            <div>
            <span>
                <Rate  allowHalf value={3} />
                {3 && <span className="ant-rate-text">{3} stars</span>}
            </span>
            </div>
            <div>
                Text
                <Divider type="vertical" />
                <a href="#">Link</a>
                <Divider type="vertical" />
                <a href="#">Link</a>
            </div>
            <div>
                <BackTop />
                Scroll down to see the bottom-right
                <strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}> gray </strong>
                button.
            </div> */}
        </div>
        
     
    );
  }
}


