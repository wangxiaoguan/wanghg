import Taro, {Component} from '@tarojs/taro'
import {ScrollView, Text, View} from "@tarojs/components";
import {AtDivider, AtNavBar} from "taro-ui";
import './SellerList.scss'

export default class SellerOrderDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      detail: {}
    }
  }

  componentWillMount() {
    document.title='订单详情'
  }

  componentDidMount() {
    this.getData()
  }

  // goBack() {
  //   Taro.navigateBack();
  // }

  render() {
    const { windowHeight } = Taro.getSystemInfoSync();
    const {detail} = this.state;
    return <ScrollView style={{height: windowHeight, display:"flex",flexDirection:"column"}}>
        <View className='orderItemHead'>
          <Text className='text_666_12'>{'订单编号:' + detail.id}</Text>
        </View>

        <View className='margin_12'>
          <AtDivider lineColor='#E6E6E6' height={1}  />
        </View>

        <Text style={{ color: '#666', fontSize: '14px', margin: '12px'}}>{detail.merchantName}</Text>

        {
          this.renderGoods(detail.orderDetailList)
        }
        <View className='margin_12'>
          <AtDivider lineColor='#E6E6E6' height={1}  />
        </View>

        <View className='order_total_price'>
          <Text className='text_999_12' style={{fontSize: '14px', marginRight: '10px'}}>总价:</Text>
          <Text style={{color: '#d70000', fontSize: '20px'}}>{'¥ ' + detail.totalAmount}</Text>
        </View>

        <View style={{ height: '10px',background: '#f5f5f5'}} />

        <Text style={{ color: '#999',fontSize: '16px',marginTop: '12px',marginBottom: '12px' }} className='margin_12' >配送信息</Text>

        <AtDivider lineColor='#f5f5f5' height={1} />

        <View style={{ display: 'flex',flexDirection: "row", height: '56px', paddingLeft: '12px',paddingRight: '12px', alignItems: 'center',justifyContent: 'space-between'}}>
          <Text style={{ color: '#333', fontSize: '16px'}}>{detail.receiverName ||''}</Text>
          <Text style={{ color: '#999', fontSize: '14px'}}>{detail.userNo || ''}</Text>
          <Text style={{ color: '#999', fontSize: '14px'}}>{detail.receiverPhone || ''}</Text>
        </View>

        <View style={{display: 'flex',flexDirection: "column", height: '68px', paddingLeft: '12px',paddingRight: '12px',justifyItems: 'center'}}>
          <Text style={{ color: '#999', fontSize: '14px'}}>取货地址</Text>
          <Text style={{ color: '#333', fontSize: '16px'}}>{detail.receiverAddress }</Text>
        </View>
        <View style={{display: 'flex',flexDirection: "column", height: '68px', paddingLeft: '12px',paddingRight: '12px',justifyItems: 'center'}}>
          <Text style={{ color: '#999', fontSize: '14px'}}>取货时间</Text>
          <Text style={{ color: '#333', fontSize: '16px'}}>{detail.sendDate + ' ~ ' +  detail.endDate}</Text>
        </View>
        <View style={{ flex: 1, background: '#f5f5f5'}} />

      </ScrollView>
  }

  renderGoods(list) {
    if(!list) return null;
    return list.map(item => {
      return <View key={item.id} className='orderItemHead' style={{height: '47px'}}>
        <View className='order_goods_name'>
          <View className='order_detail_good_name'>{item.productName}</View>
          <View className='text_999_12'>{item.categoryName}</View>
        </View>
        <View className='order_goods_num'>
          {'x ' + item.productAmount}
        </View>
        <View className='order_goods_price'>
          {'¥ ' + item.discountPrice}
        </View>
      </View>
    })
  }

  getData = () => {
    Taro.showLoading({ title: '加载中'});
    let origin = location.origin;
    const id = this.$router.params.orderId;
    const token = this.$router.params.token;
    // const token = 'E0vOO1PUUSKNapZrjGojY54CouRxlczqtc%2BOMF%2BB4K%2BEmdNUYo%2B0iku8tAzQcsu9'
    Taro.request({
      url: `${origin}/app/order/detail/getById/${id}`,
      header: {
        'content-type': 'application/json',
        'YQ-Token': token
      }
    })
      .then(res => {
        Taro.hideLoading();
        console.log(res.data)
        if(res.data && res.data.status === 1){
          // 成功
          this.setState({
            detail: res.data.root && res.data.root.object ||{}
          })
        }
      })
  }
}
