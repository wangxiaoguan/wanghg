import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text,Button } from '@tarojs/components'
import { AtIcon,AtMessage  } from 'taro-ui'
import Store from '../redux/store'
import {imgUrl } from "../../../config/config";
import './index.scss'

export default class Submit extends Component<any,any> {
  constructor (props) {
    super (props)
   
    this.state = {
     newTodo: '',
     data:[],
     IP:'',
     YQToken:'',
     activityId:'',
    }
   }


  config: Config = {
    navigationBarTitleText: '订单列表',
 
  }

  componentWillMount () {
    // let IP = "http://10.110.200.62:443";
    // let activityId = "1210164334725152768";
    // let YQToken = "K%2FF8tyEqMCG14uuYxspHvCAQnKsOMLWnoeK8p4sntaVnado4rHGgBrLLKoyowbu%2B";
    let list = window.location.search.substring(1).split('&');
    let params = {};
    list.map(item=>{
         let arr = item.split('=')
         params[arr[0]] = arr[1]
    })
    let IP = location.origin;
    let activityId = params.activityId;
    let YQToken = params.YQToken;
    this.setState({IP,YQToken,activityId})
   }

  componentDidMount () { 
    const {IP,YQToken,activityId} = this.state
    fetch(`${IP}/services/app/buyerUser/getOrderListOfActivity/${activityId}`,
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
      })

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
    console.log('订单列表------------------->',data)
    let num = 0;
    data.map(item=>{
      num = Number(num)+(Number(item.productPrice))*(Number(item.productAmount))
    })
    return Math.round(num*100)/100
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
            <AtIcon value='chevron-left' size='26' color='#666' onClick={()=>Taro.navigateTo({url: '/pages/order/orderList'})}></AtIcon>
            <div className='Htitle'>订单列表</div>
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
                  {/* <div className='content commonPad' onClick={()=>Taro.navigateTo({url: '/pages/order/orderDetail'})}>
                    <span className='left'><img src='http://wanghg.top/images/img5.jpg'/></span>
                    <span className='middle'>商品名称</span>
                    <span className='right'>￥600</span>
                  </div> */}
                  <div className='total commonPad'>
                    {/* <span className='right'>总价：{String(this.total(item.orderDetailList))}</span> */}
                    <span className='right'>总价：{item.totalAmount}</span>
                  </div>
                </li>
            })
          }
          {/* <li>
            <div className='name commonPad'>
              <span className='left'>牛肉面</span>
              <span className='right'>制作配送中</span>
            </div>
            <div className='number commonPad'>
              <span className='left'>订单编号：</span>
              <span className='middle'>201909050000001</span>
            </div>
            <div className='content commonPad' onClick={()=>Taro.navigateTo({url: '/pages/order/orderDetail'})}>
              <span className='left'><img src='http://wanghg.top/images/img5.jpg'/></span>
              <span className='middle'>商品名称</span>
              <span className='right'>￥600</span>
            </div>
            <div className='content commonPad' onClick={()=>Taro.navigateTo({url: '/pages/order/orderDetail'})}>
              <span className='left'><img src='http://wanghg.top/images/img5.jpg'/></span>
              <span className='middle'>商品名称</span>
              <span className='right'>￥600</span>
            </div>
            <div className='total commonPad'>
              <span className='right'>总价：600</span>
            </div>
          </li> */}
        </ul>

        {/* <Button onClick={()=>Taro.navigateTo({url: '/'})}>返回首页</Button> */}
        <AtMessage />
      </div>
    )
  }
}
