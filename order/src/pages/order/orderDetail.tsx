import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text,Button } from '@tarojs/components'
import { AtIcon,AtTag,AtTabs, AtTabsPane,AtTimeline,AtButton,AtMessage} from 'taro-ui'
import {GetQueryString} from './myFetch'
import Store from '../redux/store'
import QRCode from 'qrcode'
import moment from 'moment';
import './index.scss'

export default class OrderDetail extends Component<any,any> {
  constructor (props) {
    super(props)
    this.state = {
      current:0,
      isQrcode:false,
      data:{orderDetailList:[]},
      orderId:'',
      IP:'',
      YQToken:'',
      endTime:'',
      freeTimes:0,
    }
   }


  config: Config = {
    navigationBarTitleText: '订购详情',
 
  }

  componentWillMount () {
    // let userId = "12657";
    // let IP = "http://10.110.200.62:443";
    // let activityId = "1211826485099044864";
    // let YQToken = "GLI%2BMHOFuq4PktU8GSWbiSbTPr8dMmA6gOtKnYpD2fQ%3D";

    let orderId = window.sessionStorage.getItem('orderId');
    let list = window.location.search.substring(1).split('&');
    let params = {};
    list.map(item=>{
         let arr = item.split('=')
         params[arr[0]] = arr[1]
    })
    let IP = location.origin;
    let activityId = params.activityId;
    let YQToken = params.YQToken;
    this.setState({ IP, YQToken, activityId,orderId });
    this.getDeatil( YQToken, activityId, IP )
    this.getFreeTimes(YQToken, IP)
   }
   getFreeTimes = (YQToken, IP) => {
    // let { YQToken, IP } = this.state;
    fetch(`${IP}/services/app/buyerUser/getFreeTimes`, {
      method: "GET",
      mode: "cors",
      cache: "default",
      headers: { "Content-Type": "application/json", "YQ-Token": YQToken }
    }).then(resp => {
      resp.json().then(data => {
        if (data.status === 1) {
          this.setState({freeTimes:data.root.object})
        }
      });
    }).catch(e => {
      Taro.atMessage({
        message: "请求失败",
        type: "error"
      });
    });
   }
   getDeatil = ( YQToken, activityId, IP ) => {
    // let { YQToken, activityId, IP } = this.state;
    fetch(`${IP}/services/app/activity/getActivityById/${activityId}`, {
      method: "GET",
      mode: "cors",
      cache: "default",
      headers: { "Content-Type": "application/json", "YQ-Token": YQToken }
    }).then(resp => {
      resp.json().then(data => {
        if (data.status === 1) {
          this.setState({endTime:data.root.object.endTime})
        }
      });
    }).catch(e => {
      Taro.atMessage({
        message: "请求失败",
        type: "error"
      });
    });
  };
  componentDidMount () { 
    const {IP,YQToken,orderId} = this.state
    fetch(`${IP}/app/order/detail/getById/${orderId}`,
    {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
        headers: {'Content-Type': 'application/json','YQ-Token':YQToken},
    }).then(response=>{
       response.json().then(data=>{
          console.log(data)
          if(data.status === 1){
            this.setState({data:data.root.object})
          }else{
            Taro.atMessage({
              'message': data.errorMsg,
              'type': 'error',
            })
          }
       })
      }).catch(e => {
        Taro.atMessage({
          message: "获取详情失败",
          type: "error"
        });
      });

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

   handleClick =(value) => {
    this.setState({
      current: value
    })
  }
  setQrcode = () => {
    const {data} = this.state
    this.setState({isQrcode:true},()=>{
      let canvas = document.getElementById('myQrcode')
      QRCode.toCanvas(canvas, data.id, function (error) {
        if (error) console.error(error)
        console.log('success!');
      })
    })
    
  }
  total = data => {
    console.log('订单详情------------------->',data)
    let num = 0;
    data.map(item=>{
      num = Number(num)+(Number(item.productPrice))*(Number(item.productAmount))
    })
    return Math.round(num*100)/100
  }
  cancelOrder = () => {
    const {IP,YQToken,orderId} = this.state
    // let IP = 'http://10.110.200.62:443';
    // let YQToken = 'NrDlumVeUrgwDvBJoRqvAObb5gUtW4KKgqL3S8U1Z6x%2FrY3UAAUuAABjPdEH5ngD'
    fetch(`${IP}/services/app/buyerUser/cancelOrder/${orderId}`,
    {
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        headers: {'Content-Type': 'application/json','YQ-Token':YQToken},
        body: JSON.stringify({orderId:orderId}),
    }).then(response=>{
       response.json().then(data=>{
          console.log(data)
          if(data.status === 1){
            // this.setState({data:data.root.object})
            Taro.atMessage({
              'message': '订单取消成功',
              'type': 'success',
            })
            setTimeout(function(){
              Taro.navigateTo({url: '/pages/order/orderList'})
            },800)
          }else{
            Taro.atMessage({
              'message': data.errorMsg,
              'type': 'error',
            })
          }
       })
      }).catch(e => {
        Taro.atMessage({
          message: "订单取消失败",
          type: "error"
        });
      });
  }
  goBack = () => {
    window.history.back(-1)
    if(location.search.indexOf('finish=true')===-1){
      location.search = location.search + '&finish=true'
    }
    
  }
  render () {
    const {isQrcode,data,endTime,freeTimes} = this.state
    let text = ''
    if(freeTimes === 1){
      text = '未能如期领取商品，系统判定你有爽约责任。提醒你近2单再次爽约将被禁止下单半个月哦。'
    }else if(freeTimes === 2){
      text = '未能如期领取商品，系统判定你有爽约责任。提醒你近1单再次爽约将被禁止下单半个月哦。'
    }else if(freeTimes === 3){
      text = '未能如期领取商品，系统判定你有爽约责任。提醒你已爽约三次，禁止下单半个月。'
    }
    console.log(this.state)
    let list = [];
    if(data.status === 1){
        list = [
          { title: <div className='at-head-content'><span className='left redColor'>订单已提交</span><span className='right'>今天08:00</span></div>, content: ['请耐心等待商家确认哦'], icon: 'check-circle',color:'#999999' }
        ]
    }else if(data.status === 2){
        list = [
          { title: <div className='at-head-content'><span className='left'>订单已提交</span><span className='right'>{moment(data.createDate).format("MM-DD HH:mm")}</span></div>, content: ['请耐心等待商家确认哦'], icon: 'check-circle',color:'#999999' }, 
          { title: <div className='at-head-content'><span className='left redColor'>商家已接单</span><span className='right'>{moment(data.receiveDate).format("MM-DD HH:mm")}</span></div>, content: [<div style={{width:'80%'}}>商品准备中<br/><span style={{color:'#FA8E65'}}>取货时间：{data.sendDate}-{data.endDate}</span></div>], icon: 'check-circle' }, 
        ]
    }else if(data.status === 3){
        list = [
          { title: <div className='at-head-content'><span className='left'>订单已提交</span><span className='right'>{moment(data.createDate).format("MM-DD HH:mm")}</span></div>, content: ['请耐心等待商家确认哦'], icon: 'check-circle',color:'#999999' }, 
          { title: <div className='at-head-content'><span className='left'>商家已接单</span><span className='right'>{moment(data.receiveDate).format("MM-DD HH:mm")}</span></div>, content: ['商品准备中'], icon: 'check-circle' },
          { title: <div className='at-head-content'><span className='left redColor'>商家已出货</span><span className='right'>{moment(data.sendDate).format("MM-DD HH:mm")}</span></div>, content: [<div style={{width:'80%'}}>商品正在配送中，按照约定时间点不见不散哦<br/><span style={{color:'#FA8E65'}}>取货时间：{data.sendDate}-{data.endDate}</span></div>], icon: 'check-circle' },
        ]
    }else if(data.status === 4){
        list = [
          { title: <div className='at-head-content'><span className='left'>订单已提交</span><span className='right'>{moment(data.createDate).format("MM-DD HH:mm")}</span></div>, content: ['请耐心等待商家确认哦'], icon: 'check-circle',color:'#999999' }, 
          { title: <div className='at-head-content'><span className='left'>商家已接单</span><span className='right'>{moment(data.receiveDate).format("MM-DD HH:mm")}</span></div>, content: ['商品准备中'], icon: 'check-circle' },
          { title: <div className='at-head-content'><span className='left redColor'>订单取消</span><span className='right'>{moment(data.lastUpdateDate).format("MM-DD HH:mm")}</span></div>, content: [<div style={{width:'80%',color:'#D70000'}}>你取消该订单。</div>], icon: 'check-circle' }
        ]
    }else if(data.status === 5){
        list = [
          { title: <div className='at-head-content'><span className='left'>订单已提交</span><span className='right'>{moment(data.createDate).format("MM-DD HH:mm")}</span></div>, content: ['请耐心等待商家确认哦'], icon: 'check-circle',color:'#999999' }, 
          { title: <div className='at-head-content'><span className='left'>商家已接单</span><span className='right'>{moment(data.receiveDate).format("MM-DD HH:mm")}</span></div>, content: ['商品准备中'], icon: 'check-circle' },
          { title: <div className='at-head-content'><span className='left'>商家已出货</span><span className='right'>{moment(data.sendDate).format("MM-DD HH:mm")}</span></div>, content: ['商品正在配送中，按照约定时间地点不见不散哦'], icon: 'check-circle' },
          { title: <div className='at-head-content'><span className='left redColor'>订单完成</span><span className='right'>{moment(data.finishDate).format("MM-DD HH:mm")}</span></div>, content: [<div style={{width:'80%',color:'#D70000'}}>订单已完成，欢迎下次活动继续订购</div>], icon: 'check-circle' }
        ]
    }else if(data.status === 6){
        list = [
          { title: <div className='at-head-content'><span className='left'>订单已提交</span><span className='right'>{moment(data.createDate).format("MM-DD HH:mm")}</span></div>, content: ['请耐心等待商家确认哦'], icon: 'check-circle',color:'#999999' }, 
          { title: <div className='at-head-content'><span className='left'>商家已接单</span><span className='right'>{moment(data.receiveDate).format("MM-DD HH:mm")}</span></div>, content: ['商品准备中'], icon: 'check-circle' },
          { title: <div className='at-head-content'><span className='left'>商家已出货</span><span className='right'>{moment(data.sendDate).format("MM-DD HH:mm")}</span></div>, content: ['商品正在配送中，按照约定时间地点不见不散哦'], icon: 'check-circle' },
          { title: <div className='at-head-content'><span className='left redColor'>订单爽约</span><span className='right'>{moment(data.endDate).format("MM-DD HH:mm")}</span></div>, content: [<div style={{width:'80%',color:'#D70000'}}>{text}</div>], icon: 'check-circle' }
        ]
    }
    return (
      <div className='orderDetail'>
          {/* <header>
              <AtIcon value='chevron-left' size='26' color='#666' onClick={()=>this.goBack()}></AtIcon>
              <div className='Htitle'>订单详情</div>
          </header> */}
          <AtTabs
            current={this.state.current}
            tabList={[
              { title: '订单状态' },
              { title: '订单详情' },
              
            ]}
            onClick={this.handleClick}>
            <AtTabsPane current={this.state.current} index={0}>
              <div className='orderStatus'>
                <AtTimeline 
                  pending 
                  items={list}
                >
                </AtTimeline>
                {
                  data.status<3?
                  <div className='footer'>
                      <div className='descripe'><AtIcon value='alert-circle' size='14' color='#D70000'></AtIcon>截至{endTime?moment(endTime).format("MM-DD HH:mm"):null}，可取消订单</div>
                      <div className='footer-btn'><AtButton type='primary' onClick={()=>this.cancelOrder()}>取消订单</AtButton></div>
                  </div>:data.status === 3?
                  <div className='footer'>
                      <div className='descripe'><AtIcon value='alert-circle' size='14' color='#D70000'></AtIcon>取货时，打开取货凭证给工作人员扫一扫！</div>
                      <div className='footer-btn'><AtButton type='primary' onClick={()=>this.setQrcode()}>取货凭证</AtButton></div>
                  </div>:null
                }

                
              </div>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <div className='orderDetails'>
                  <div className='number commonPad'>
                    <span className='left'>订单编号：</span>
                    <span className='middle'>{data.id}</span>
                  </div>
                  <div className='content commonPad'>
                    <div className='storeName'>{data.merchantName}</div>
                    <table>
                      {
                        data.orderDetailList.map(item=>{
                            return <tr className='list-tr'>
                            <td className='shopName'>{item.productName}<br/><span className='shopTime'>{moment(data.sendDate).format("HH:mm")}取餐</span></td>
                            <td className='shopNum'>X{item.productAmount}</td>
                            <td className='shopPrice'>￥{item.discountPrice}</td>
                          </tr>
                        })
                      }
                      {/* <tr className='list-tr'>
                        <td className='shopName'>爆炒羊肉<br/><span className='shopTime'>11：40取餐</span></td>
                        <td className='shopNum'>X2</td>
                        <td className='shopPrice'>￥50</td>
                      </tr>
                      <tr className='list-tr'>
                        <td className='shopName'>回锅肉<br/><span  className='shopTime'>11：40取餐</span></td>
                        <td className='shopNum'>X2</td>
                        <td className='shopPrice'>￥50</td>
                      </tr> */}
                      <tr>
                        {/* <td colSpan={2} className='shopTotal'>合计：<span>￥{String(this.total(data.orderDetailList))}</span></td> */}
                        <td colSpan={2} className='shopTotal'>合计：<span>￥{data.totalAmount}</span></td>
                      </tr>
                    </table>
                  </div>
                  <div className='orderAddress'>
                    <div className='message'>配送信息</div>
                    <table>
                        <tr>
                          <td className='takeName'>{data.userName}</td>
                          <td className='takeNo'>{data.userNo}</td>
                          <td className='takePhone'>{data.userPhone}</td>
                        </tr>
                        <tr>
                          <td colSpan={3} className='getAddress'>取货地址<br/><span  className='address'>{data.address}</span></td>
                        </tr>
                        <tr>
                          <td colSpan={3} className='getTime'>取货时间<br/><span  className='time'>{data.sendDate}-{data.endDate}</span></td>
                        </tr>
                      </table>
                  </div>
              </div>
            </AtTabsPane>
          </AtTabs>
          {/* <Button onClick={()=>Taro.navigateTo({url: '/'})}>返回首页</Button> */}
          {
            isQrcode?
            <div className='backQrcode' onClick={()=>this.setState({isQrcode:false})}>
                <div className='qrcodeBox'>
                  <canvas id="myQrcode"></canvas>
                  <h3>取货号:{data.id}</h3>
                  <p>取货时，打开取货凭证给工作人员扫一扫！</p>
                </div>
          </div>:null
          }
          <AtMessage />
      </div>

        
    )
  }
}
