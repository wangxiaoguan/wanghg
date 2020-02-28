import Taro, {Component} from '@tarojs/taro'
import {View, Image, ScrollView, Text, RichText} from "@tarojs/components";
import {AtDivider} from "taro-ui";
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'
import {imgUrl} from "../../../config/config";

export default class SellerGoodsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      token: this.$router.params.token,
      searchValue: '',
      goodMescroll:{}
    }
  }

  componentDidMount() {
    // this.getData()
    this.initMescroll('goodMescroll');

  }

  componentWillReceiveProps(nextProps, nextContext) {
    const defaultValue = this.props.searchValue;
    console.log(nextProps)
    const newValue = nextProps.searchValue;
    if( newValue !== undefined){
      this.setState({
        searchValue: newValue
      },()=>{
        this.state.goodMescroll.setPageNum(1)
        this.state.goodMescroll.triggerDownScroll()
      })
    }
  }

  gotoDetail(id){
    Taro.navigateTo({url:`/pages/seller/SellerGoodDetail?id=${id}&hideTitle=true`})
  }

  render() {
    return <View className='mescroll' id='goodMescroll' /*style={{ height: `${windowHeight-80}px`}}*/ >
      <View id='goods-empty'>
      {
        this.state.list.map(item => {
          return <View style={{display: "flex", flexDirection: "column"}} key={item.id} onClick={()=>this.gotoDetail(item.id)}>
            <View style={{display: 'flex', flexDirection: 'row' , paddingLeft:'12px',paddingTop: '16px',paddingBottom:'16px'}}>
              <Image src={this.getImageUrl(item.images)} style={{height: '74px', width: '117px'}} />
              <View style={{display: "flex", flexDirection: "column",marginLeft: '12px', flex: 1}}>
                <Text style={{color: '#333', fontSize: '16px'}}>{item.name}</Text>
                {/*<RichText className='text_999_12' nodes={item.description} />*/}
                <View style={{ display: 'flex',flexDirection: 'row'}}>
                  <Text className='text_666_12'>{'销量 '+item.sales || 0 +'份'}</Text>
                  <Text className='text_666_12' style={{ marginLeft: '10px'}}>{'库存 '+item.productStock || 0 + '份'}</Text>
                </View>
                <View style={{ flex: 1}} />
                <Text style={{color: '#D70000', fontSize: '20px'}}>{'¥ '+item.productPrice}</Text>
              </View>
            </View>
            <AtDivider height='1px' lineColor='#e6e6e6' />
          </View>
        })

      }
      </View>
    </View>
  }

  getImageUrl(url){
    if(url){
      return imgUrl+url;
    }else {
      // return require('../../img/shop_goods.png')
    }
  }

  /**
   * 模拟获取数据
   */
  getData(page) {
    let { list,searchValue,goodMescroll } = this.state;
    Taro.showLoading({ title: '加载中'});
    // const merchantId = '1199528678550786048'
    // const token = 'E0vOO1PUUSKNapZrjGojY54CouRxlczqtc%2BOMF%2BB4K%2BEmdNUYo%2B0iku8tAzQcsu9'
    const token = this.state.token;
    const merchantId = this.$router.params.merchantId;
    // const merchantId = '1209294017231568896';
    let origin = location.origin;
    // origin = 'http://10.128.151.139:30930'
    let url = `${origin}/app/merchant/product/getList/${merchantId}/${page}/20`;
    if(searchValue){
      url+=`?Q=search=${searchValue}`
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
           list = []
          }
          list = list.concat(res.data.root && res.data.root.list || [])
          this.setState({
            list
          })
          // goodMescroll.endSuccess(list.length)
          goodMescroll.endBySize(res.data.root.list.length,res.data.root.totalNum)
        } else {
          if(page === 1){
            goodMescroll.endSuccess(0)
          } else {
            goodMescroll.endErr()
          }
          Taro.hideLoading()
        }
      }).catch(e=>{
        console.error("SellerGoodsList",e)
        if(page === 1){
          goodMescroll.endSuccess(0)
        }else {
          goodMescroll.endErr()
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
        lazyLoad: {
          use: true // 是否开启懒加载,默认false
        },
        empty: {
          icon: require('../../img/rights_empty.png'), //图标,默认null
          tip: "暂无数据~", //提示
          warpId: 'goods-empty'
        },
        // clearEmptyId: 'goods-empty'
      },
    });
    this.setState({
      goodMescroll: mescroll
    },()=>{
      this.state.goodMescroll.triggerDownScroll()
    })
  }

  upCallBack=(page)=>{
    const {num} = page;
    this.getData(num)
  }

}



