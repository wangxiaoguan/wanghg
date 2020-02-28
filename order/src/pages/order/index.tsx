import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text,Button } from '@tarojs/components'

import './index.scss'

export default class Order extends Component {
  constructor (props) {
    super (props)
   
    this.state = {
     newTodo: ''
    }
   }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '订购',
 
  }

  componentWillMount () {
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>订购首页</Text>
        <Button onClick={()=>Taro.navigateTo({url: '/'})}>返回首页</Button>
      </View>
    )
  }
}
// export default connect (
//   store => ({
//    todos: store
//   }), 
//   dispatch => ({
//     // setSelectData:n=>dispatch(setSelectData(n)),
//     // setCheckData:n=>dispatch(setCheckData(n)),
//     setChangeData(n){dispatch(setChangeData(n))},
   
//   }))(Order)
