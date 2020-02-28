import Taro,{Component} from '@tarojs/taro'
import {Image, Text, View} from "@tarojs/components";


export default class SellerPickUpStatus extends Component{



  constructor(props){
    super(props)
    this.state={

    }
  }

  componentWillMount() {
    document.title='订单确认'
  }


  render() {
    const { windowHeight } = Taro.getSystemInfoSync();
    const id = this.$router.params.orderId;
    return <View style={{ height: windowHeight, display: 'flex',flexDirection: "column", alignItems: 'center', background: '#fff' }}>
          <Image src={require('../../img/status_ok.png')} style={{ height: '72px',width: '72px', marginTop: '76px' }} />

          <Text style={{ color: '#333', fontsize: '20px', marginTop: '26px'}}>取货号</Text>
          <Text style={{ color: '#333', fontsize: '20px', marginTop: '5px'}}>{id || ''}</Text>


    </View>
  }


}
