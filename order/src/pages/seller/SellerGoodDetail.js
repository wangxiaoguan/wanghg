import Taro, { Component } from "@tarojs/taro";
import {ScrollView, View, Image, Text, RichText} from "@tarojs/components";
import {AtDivider} from "taro-ui";
import {imgUrl} from "../../../config/config";

export default class SellerGoodDetail extends Component{

  constructor(props){
    super(props)
    this.state={
      detail:{}
    }
  }
  componentWillMount() {
    document.title='商品详情';
  }

  componentDidMount() {
    this.getDetail();
  }

  render() {
    const { windowHeight } = Taro.getSystemInfoSync();
    const { detail } = this.state;
    return <ScrollView style={{ height: windowHeight+'px', width: '100%'}}>
      <Image src={`${imgUrl}${detail.images}`} style={{ height: '188px',width: '100%' }} />
      <View style={{ display: "flex",flexDirection:"row", paddingRight: '12px',paddingLeft: '12px', marginTop: '10px', justifyContent:"space-between",alignItems:"center"}}>
        <Text style={{ fontSize: '18px',color: '#333'}}>{detail.name}</Text>
        <Text style={{ fontSize: '14px',color: '#999'}}>{detail.merchantName}</Text>
      </View>

      <View style={{ display: "flex",flexDirection:"row", paddingRight: '12px',paddingLeft: '12px', marginTop: '10px' }}>
        <Text style={{ fontSize: '12px',color: '#999'}}>{`销售: ${detail.sales}份`}</Text>
        <Text style={{ fontSize: '12px',color: '#999', marginLeft: '10px'}}>{`库存: ${detail.productStock}份`}</Text>
      </View>

      <Text style={{ color: '#D70000', fontSize: '20px', marginLeft: '12px',marginRight:'12px' }}>{`¥${detail.productPrice}`}</Text>

      <AtDivider height='1px' lineColor='#eee' customStyle={{ marginTop: '10px',marginBottom: '10px'}} />

      <Text style={{ fontSize: '16px', color: '#333', marginLeft: '12px'}}>商品详情</Text>

      <RichText nodes={detail.description} style={{ marginTop: '10px',marginLeft: '12px',marginRight: '12px', color: '#999',fontSize:'14px' }} />

    </ScrollView>
  }

  getDetail(){
    // const id = '1209297461517594624'
    const id = this.$router.params.id;
    let origin = location.origin;
    const url = `${origin}/app/merchant/product/getById/${id}`
    Taro.showLoading();
    Taro.request({
      url
    }).then(res=>{
      Taro.hideLoading()
      if(res.data && res.data.status === 1){
        this.setState({
          detail: res.data.root.object
        });
      }
    }).catch(()=>{
      Taro.hideLoading()
    })
  }

}
