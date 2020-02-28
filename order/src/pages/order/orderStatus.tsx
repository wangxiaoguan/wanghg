import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text,Button } from '@tarojs/components'
import { AtIcon,AtMessage  } from 'taro-ui'
import './index.scss'

export default class Status extends Component {

  config: Config = {
    navigationBarTitleText: '订单状态',
 
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>订单状态</Text>
        <Button onClick={()=>Taro.navigateTo({url: '/'})}>返回首页</Button>
      </View>
    )
  }
}
