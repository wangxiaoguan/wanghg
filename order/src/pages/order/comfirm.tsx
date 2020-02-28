import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text,Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import Pay from "../../img/pay.png";
import './index.scss'

export default class Submit extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '确认订单',
 
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <div className='comfirmOrder'>
          <header>
              <AtIcon value='chevron-left' size='26' color='#666' onClick={()=>Taro.navigateTo({url: '/pages/order/orderList'})}></AtIcon>
              <div className='Htitle'>确认订单</div>
          </header>
          <div className='content'>
              <img src={Pay} alt=''/>
              <h3>取货号</h3>
              <p>1564879611546121</p>
          </div>
      </div>
    )
  }
}
