import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text,Button} from '@tarojs/components'
import { AtIcon,AtButton,AtMessage,AtModal,AtModalContent,AtModalHeader,AtCheckbox,AtRadio,AtActivityIndicator  } from 'taro-ui';
import moment from 'moment';
import Store from '../redux/store'
import './index.scss'

export default class Submit extends Component<any,any> {
  constructor () {
    super(...arguments)
    this.state = {
      data:[{orderDetailList:[]}],
      IP:'',
      YQToken:'',
      isOpened:false,
      value:'',
      shopCarLoad:false,
      address:[{ label: '', value: '' }]
    }
   }

  config: Config = {
    navigationBarTitleText: '提交订单',
 
  }

  componentWillMount () {
    let store = Store.getState()
    console.log(store)
    this.setState({IP:store.ip.ip,YQToken:store.token.token})
  }

  componentDidMount () {
    let store = Store.getState()
    console.log(store)
    let order = store.order;
    let detail = store.detail;

    let address = []
    detail.pickupAddress.map(item=>{
      address.push({ label: item.addressName, value: item.id })
    })
    let arr = []
    order.map(item=>{
      let total = 0;
      let list = item.orderDetailList.filter(e=>{
        if(e.isStockEnough){
          total = Number(total) + Number(e.productPrice)
        }
        return e.isStockEnough === true
      })
      item.orderDetailList = list
      item.totalAmount = total
      item.payAmount = total
      if(total){
        arr.push({...item})
      }
    })

    this.setState({data:arr,address,value:address[0].value})
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  submitOrder = () => {
    const {IP,YQToken,data} = this.state
    this.setState({shopCarLoad:true})
    fetch(`${IP}/services/app/buyerUser/submitOrder`,
    {
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        headers: {'Content-Type': 'application/json','YQ-Token':YQToken},
        body: JSON.stringify(data),
    }).then(response=>{
       response.json().then(data=>{
          console.log(data)
          this.setState({shopCarLoad:false})
          if(data.status === 1){
            Taro.navigateTo({url:'/pages/order/orderList'})
          }else{
            Taro.atMessage({
              'message': data.errorMsg,
              'type': 'error',
            })
          }
       })
      }).catch(e => {
        Taro.atMessage({
          message: "提交订单失败",
          type: "error"
        });
      })
      
  }
  total = data => {
    console.log('------------------->',data)
    let num = 0;
    data.map(item=>{
      num = Number(num)+(Number(item.productPrice))*(Number(item.productAmount))
    })
    return Math.round(num*100)/100
  }

  setAddress = item => {
    let {data,address} = this.state;
    let arr = address.filter(e=>{
      return e.value === item
    })
    data.map(e=>{
      e.receiverAddress = arr[0].label;
      e.address = arr[0].label;
    })
    
    console.log(item,arr,data)
    this.setState({data,isOpened:false,value:item})
  }

  render () {
    const {isOpened,address,data,shopCarLoad} = this.state
    console.log('提交订单----------->',data)
    let totalAmount = 0;
    data.map(item=>{
      totalAmount =  Number(totalAmount) + Number(item.totalAmount)
    })
    return (
      <div className='orderSubmit'>
      {/* <header>
          <AtIcon value='chevron-left' size='26' color='#666' onClick={()=>window.history.back(-1)}></AtIcon>
          <div className='Htitle'>提交订单</div>
      </header> */}
      <ul className='orderName'>
        <li className='takeName'>{data[0].userName}</li>
        <li className='takeNo'>{data[0].userNo}</li>
        <li className='takePhone'>{data[0].userPhone}</li>
      </ul>
      <div className='orderAddress'>
          <table>
              <tr>
                <td colSpan={2} className='getAddress'>取货地址<br/><span id='address'  className='address'>{data[0].receiverAddress}</span></td>
                <td className='setAddress'><AtIcon value='chevron-right' size='26' color='#aaa' onClick={()=>this.setState({isOpened:true})}></AtIcon></td>
              </tr>
              <tr>
                <td colSpan={3} className='getTime'>取货时间<br/><span  className='time'>{moment(data[0].sendDate).format("MM-DD HH:mm")} - {moment(data[0].endDate).format("MM-DD HH:mm")}</span></td>
              </tr>
            </table>
      </div>
      <ul className='content'>
          {
            data.map(item=>{
              return <li className='content-order'>
              <table>
                <tr className='content-order-name'>
                <td colSpan={2}>{item.merchantName}</td>
                </tr>
                  {
                    item.orderDetailList.map(e=>{
                      return <tr className='content-order-list'>
                      <td>{e.productName}<br/><span>x{e.productAmount}</span></td>
                      <td>￥{e.discountPrice}</td>
                    </tr>
                    })
                  }
              </table>
          </li>
            })
          }
          {/* <li className='content-order'>
              <table>
                <tr className='content-order-name'>
                  <td colSpan={2}>商家名称</td>
                </tr>
                {
                  data.orderDetailList.map(item=>{
                    return <tr className='content-order-list'>
                    <td>{item.productName}<br/><span>x{item.productAmount}</span></td>
                    <td>￥{item.productPrice}</td>
                  </tr>
                  })
                }
              </table>
          </li> */}
          {/* <li className='content-order'>
              <table>
                <tr className='content-order-name'>
                  <td colSpan={2}>商家名称</td>
                </tr>
                <tr className='content-order-list'>
                  <td>爆炒狼心狗肺<br/><span>x2</span></td>
                  <td>￥25</td>
                </tr>
                <tr className='content-order-list'>
                  <td>爆炒龙肝凤胆<br/><span>x2</span></td>
                  <td>￥60</td>
                </tr>
              </table>
          </li> */}
      </ul>
      <div className='footer'>
          <div className='descripe'><AtIcon value='alert-circle' size='14' color='#D70000'></AtIcon>凭姓名+二维码到指定窗口取货哦~</div>
          <div className='footer-btn'>
        <div className='total'>合计：<span>￥{String(Math.round(totalAmount*100)/100)}</span></div>
            <div className='submitBtn' onClick={this.submitOrder}>提交订单</div>
          </div>
      </div>
      <AtMessage />
        <AtModal isOpened={isOpened} closeOnClickOverlay>
          <AtModalContent>
              <AtRadio
                options={address}
                value={this.state.value}
                onClick={this.setAddress}
              />
          </AtModalContent>
        </AtModal>
        {
          shopCarLoad?<div className='shopCar_load'>
          <AtActivityIndicator size={100}  mode='center'></AtActivityIndicator>
        </div>:null
        }
      </div>

    )
  }
}
