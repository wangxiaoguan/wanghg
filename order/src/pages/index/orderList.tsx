import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text,Button } from '@tarojs/components'
import { AtIcon,AtMessage  } from 'taro-ui'
import { setIp,setToken } from "../redux/action";
import Store from '../redux/store'
import {imgUrl } from "../../../config/config";
import '../order/index.scss'

export default class Index extends Component<any,any> {
  constructor (props) {
    super (props)
   
    this.state = {
     newTodo: '',
     data:[],
     IP:'',
     YQToken:'',
    }
   }


  config: Config = {
    navigationBarTitleText: '订单列表',
 
  }

  componentWillMount () {
    // let IP = "http://10.110.200.62:443";
    // let YQToken = "GLI%2BMHOFuq4PktU8GSWbiSbTPr8dMmA6gOtKnYpD2fQ%3D";
    let list = window.location.search.substring(1).split('&');
    let params = {};
    list.map(item=>{
         let arr = item.split('=')
         params[arr[0]] = arr[1]
    })
    let IP = location.origin;
    let YQToken = params.YQToken;
    Store.dispatch(setIp({ip:IP}))
    Store.dispatch(setToken({token:YQToken}))
    this.setState({IP,YQToken})
   }

  componentDidMount () { 
    const {IP,YQToken} = this.state
    fetch(`${IP}/services/app/buyerUser/getOrderList`,
    {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
        headers: {'Content-Type': 'application/json','YQ-Token':YQToken},
    }).then(response=>{
       response.json().then(data=>{
          console.log(data)
          if(data.status === 1){
            if(data.root.list.length){
              this.setState({data:data.root.list})
            }else{
              Taro.atMessage({
                'message': '你的订单为空，请添加订单',
                'type': 'success',
              })
            }
            
          }else{
            Taro.atMessage({
              'message': data.errorMsg,
              'type': 'error',
            })
          }
       })
      }).catch(e => {
        Taro.atMessage({
          message: "获取订单列表失败",
          type: "error"
        });
      });
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  setStatus = e => {
    if(e === 1){
      return '订单待接受'
    }else if(e === 2){
      return '订单已接单'
    }else if(e === 3){
      return '订单配送中'
    }else if(e === 4){
      return '订单取消'
    }else if(e === 5){
      return '订单完成'
    }else if(e === 6){
      return '订单爽约'
    }else{
      return ''
    }
  }

  total = data => {
    console.log('订单总列表------------------->',data)
    let num = 0;
    data.map(item=>{
      num = Number(num)+(Number(item.productPrice))*(Number(item.productAmount))
    })
    return String(Math.round(num*100)/100)
  }
  goDetail = (id) => {
    window.sessionStorage.setItem('orderId',id)
    Taro.navigateTo({url: `/pages/order/orderDetail`})
  }
  render () {
    const {data} = this.state
    return (
      <div className='orderList'>
        {/* <header>
            <AtIcon value='chevron-left' size='26' color='#666' onClick={()=>this.goBack()}></AtIcon>
            <div className='Htitle'>订单</div>
        </header> */}
        <ul>
          {
            data.map(item=>{
              return  <li>
                  <div className='name commonPad'>
                    <span className='left'>{item.merchantName}</span>
                    <span className='right'>{this.setStatus(item.status)}</span>
                  </div>
                  <div className='number commonPad'>
                    <span className='left'>订单编号：</span>
                    <span className='middle'>{item.id}</span>
                  </div>
                  {
                    item.orderDetailList.map(e=>{
                        return <div className='content commonPad' onClick={()=>this.goDetail(e.orderId)}>
                        <span className='left'><img src={`${imgUrl}${e.productImages}`}/></span>
                        <span className='middle'>{e.productName}<br/>X{e.productAmount}</span>
                        <span className='right'>￥{e.discountPrice}</span>
                      </div>
                    })
                    
                  }
                  <div className='total commonPad'>
                    {/* <span className='right'>总价：{this.total(item.orderDetailList)}</span> */}
                    <span className='right'>总价：{item.totalAmount}</span>
                  </div>
                </li>
            })
          }

        </ul>
        <AtMessage />
      </div>
    )
  }
}
