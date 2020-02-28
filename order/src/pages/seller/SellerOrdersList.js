import Taro, {Component} from '@tarojs/taro'
import {View, Text,ScrollView} from "@tarojs/components"
import {AtAvatar, AtDivider} from 'taro-ui'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'

// var mescroll;
export default class SellerOrdersList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderList: [],
      token: this.$router.params.token,
      searchValue: '',
      mescroll: {},
    }
  }

  componentDidMount() {
    this.initMescroll('mescroll')
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const defaultValue = this.props.searchValue;
    console.log(nextProps)
    const newValue = nextProps.searchValue;
    if( newValue !== undefined){
      this.setState({
        searchValue: newValue
      },()=>{
        this.state.mescroll.setPageNum(1)
        this.state.mescroll.triggerDownScroll()
      })
    }
  }

  navigateToDetail(id){
    Taro.navigateTo({url:`/pages/seller/SellerOrderDetail?token=${this.state.token}&orderId=${id}&hideTitle=true`})
  }
  renderList() {
    return this.state.orderList.map((item, index) => {
      return (
        <View key={index} style={{display: 'flex', flexDirection: 'column'}} onClick={()=>this.navigateToDetail(item.id)}>
          <View className='orderItemHead'>
            <Text className='text_666_12'>{'订单编号:' + item.id}</Text>
            <Text className='text_FF8A01_12' style={{ color: this.getStatus(item.status).color}}>{this.getStatus(item.status).status}</Text>
          </View>
          <View className='margin_12'>
            <AtDivider lineColor='#E6E6E6' height={1}  />
          </View>
          <View className='orderItemHead'>
            <View style={{ display: 'flex', flexDirection: 'row'}}>
              {/*<AtAvatar image='https://jdc.jd.com/img/200' customStyle={{height: '22px', width: '22px'}} />*/}
              <Text className='text_999_12' style={{ marginLeft: '10px'}}>{item.userName}</Text>
            </View>
            <Text className='text_999_12'>{item.createDate}</Text>
          </View>
          {
            this.renderGoods(item.orderDetailList)
          }
          <View className='margin_12'>
            <AtDivider lineColor='#E6E6E6' height={1}  />
          </View>
          <View className='order_total_price'>
            <Text className='text_999_12' style={{fontSize: '14px',marginRight: '10px'}}>总价:</Text>
            <Text style={{ color: '#d70000',fontSize:'20px'}}>{'¥ ' + item.totalAmount}</Text>
          </View>
          <View style={{ height: '10px',background:'#f5f5f5'}} />
        </View>)
    })
  }

  renderGoods(list) {
    return list.map(item => {
      return <View key={item.id} className='orderItemHead' style={{height: '47px'}}>
        <View className='order_goods_name' style={{ flex: 3}}>
          <Text className='order_detail_good_name'>{item.productName}</Text>
          <Text className='text_999_12'>{item.remark}</Text>
        </View>
        <View style={{flex: 1, textAlign: 'center',color: '#999',fontSize: '14px'}}>{'x ' + item.productAmount}</View>
        <View style={{color: '#d70000',fontSize: '16px', flex: 2, textAlign: 'end'}}>{'¥' + item.discountPrice}</View>
      </View>
    })
  }


  render() {
    // const height1 = window.innerHeight;
    // const { windowHeight } = Taro.getSystemInfoSync();
    return <View className='mescroll' id='mescroll' /*style={{ height: `${windowHeight-80}px`}}*/ >
      <View id='clearEmptyId'>
        {this.renderList()}
      </View>
      {/*<Text id="empty">暂未数据</Text>*/}
    </View>

  }

  getStatus(code){
    // 1创建、2接单、3配送、4取消、5完成、6爽约
    switch (code) {
      case 1:
        return {status: '已创建',color: '#333'};
      case 2:
        return {status: '已接单',color: '#333'};
      case 3:
        return {status: '配送中',color: '#0078FF'};
      case 4:
        return {status: '已取消',color: '#D70000'};
      case 5:
        return {status: '已完成',color: '#0078FF'};
      case 6:
        return {status: '已爽约',color: '#D70000'};
      default:
        return {status: '',color: ''};
    }
  }


  /**
   * 模拟获取数据
   */
  getData(page) {
    let { orderList,searchValue} = this.state;
    Taro.showLoading({ title: '加载中'});
    // const merchantId = '1199528678550786048'
    // const token = 'E0vOO1PUUSKNapZrjGojY54CouRxlczqtc%2BOMF%2BB4K%2BEmdNUYo%2B0iku8tAzQcsu9'
    const token = this.$router.params.token;
    let origin = location.origin;
    // origin = 'http://10.128.151.139:30930'
    const merchantId = this.$router.params.merchantId;
    // const merchantId = '1209294017231568896';
    let url = `${origin}/app/merchant/order/getList/${merchantId}/${page}/20`;
    if(searchValue){
      url += `?Q=receiverName=${searchValue}`
    }
    Taro.request({
      url,
      header: {
        'content-type': 'application/json',
        'YQ-Token': token
      }
    })
      .then(res => {
        Taro.hideLoading();
        if(res.data && res.data.status === 1){
          // 成功
          if(page === 1){
            orderList = []
          }
          console.log(orderList)
          orderList = orderList.concat(res.data.root && res.data.root.list || [])
          console.log(orderList)
          this.state.mescroll.endBySize(res.data.root.list.length,res.data.root.totalNum)
          this.setState({
            orderList
          })
        } else {
          if(page === 1){
            this.state.mescroll.endSuccess(0)
          } else {
            this.state.mescroll.endErr()
          }
          Taro.hideLoading()
        }
      }).catch(e=>{
        if(page === 1){
          this.state.mescroll.endSuccess(0)
        } else {
          this.state.mescroll.endErr()
        }
        Taro.hideLoading()
      })
  }

  initMescroll = (mescrollId) => {
    const mescroll = new MeScroll(mescrollId, {
      //上拉加载的配置项
      up: {
        callback: (page)=>this.upCallBack(page),
        isBounce: false,
        empty: {
          icon: require('../../img/rights_empty.png'), //图标,默认null
          tip: "暂无数据~", //提示
          warpId: 'clearEmptyId'
        },
        // clearEmptyId: 'clearEmptyId',
        lazyLoad: {
          use: true // 是否开启懒加载,默认false
        }
      },
    });
    this.setState({
      mescroll
    },()=>{
      this.state.mescroll.triggerDownScroll()
    })
  }

  upCallBack=(page)=>{
    const {num} = page;
    this.getData(num)
  }
}
