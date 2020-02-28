import Taro, { Component, Config } from "@tarojs/taro";
import { View, Swiper, SwiperItem, Image,RichText  } from "@tarojs/components";
import { AtIcon, AtButton, AtBadge, AtMessage } from "taro-ui";
import "./shopDetail.scss";
import { baseUrl, imgUrl } from "../../../config/config";
import Store from "../redux/store";
let isClick = 0;
export default class ShopList extends Component<any, any> {
  constructor(props) {
    super(props);
    const id = sessionStorage.getItem("productId");
    const productId = id !== undefined && id !== null ? String(id) : "";
    this.state = {
      tabsActive: 0,
      len: "auto",
      productId,
      details: undefined,
      IP: "",
      YQToken: "",
      activityId: "",
      isJoin: true,
      shopList:[],
      carList:[],
    };
  }
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "商品详情"
  };
  componentWillMount() {
    let store = Store.getState()
    let list = window.location.search.substring(1).split('&');
    let params = {};
    list.map(item=>{
         let arr = item.split('=')
         params[arr[0]] = arr[1]
    })
    let IP = location.origin;
    let activityId = params.activityId;
    let YQToken = params.YQToken;


    // let IP = "http://10.110.200.62:443";
    // let activityId = "1207932908185866240";
    // let YQToken = "NrDlumVeUrgwDvBJoRqvAObb5gUtW4KKgqL3S8U1Z6x%2FrY3UAAUuAABjPdEH5ngD";
    // let IP = "http://10.110.200.62:443";
    // let activityId = "1211826485099044864";
    // let YQToken = "GLI%2BMHOFuq4PktU8GSWbiSbTPr8dMmA6gOtKnYpD2fQ%3D";
    this.setState({ IP, YQToken, activityId });
  }
  componentDidShow() {
    this.getHeight();
    this.getDetalis();
    // this.judgeType();
    this.getShopList()
  }
  getShopList = () => {
    let { YQToken, activityId, IP,} = this.state;
    fetch(`${IP}/services/app/buyerUser/getProductList/${activityId}`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", "YQ-Token": YQToken }
    }).then(resp => {
        resp.json().then(data => {
          if (data.status === 1) {
            let list = data.root.orderCarts;
            let arr = []
            list.map(item=>{
              item.orderCartList.map(e=>{
                arr.push(e)
              })
            })
            this.setState({shopList: data.root.activityProductRels,carList:arr})
            }
          })
        })
  }
  judgeType = () => {
    let { activityId, YQToken, IP } = this.state;
    fetch(`${IP}/services/app/activity/getActivityById/${activityId}`, {
      method: "GET",
      mode: "cors",
      cache: "default",
      headers: { "Content-Type": "application/json", "YQ-Token": YQToken }
    })
      .then(resp => {
        resp.json().then(data => {
          if (Number(data.status) === 1) {
            if (data.root.joinCount === 0) {
              this.setState({
                isJoin: true
              });
            }else{
              this.setState({
                isJoin: false
              });
            }
          }
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  getDetalis = () => {
    let { productId, YQToken, IP } = this.state;
    if (productId !== "") {
      fetch(`${IP}/services/app/buyerUser/getProductDetail/${productId}`, {
        method: "GET",
        mode: "cors",
        cache: "default",
        headers: { "Content-Type": "application/json", "YQ-Token": YQToken }
      })
        .then(resp => {
          resp.json().then(data => {
            if (Number(data.status) === 1) {
              this.setState({
                details: data.root.object
              });
            } else {
              Taro.atMessage({
                message: data.errorMsg,
                type: "error"
              });
            }
          });
        })
        .catch(e => {
          Taro.atMessage({
            message: "获取商品详情失败，请稍后重试！",
            type: "error"
          });
        });
    } else {
      Taro.atMessage({
        message: "请先选择商品！",
        type: "error"
      });
    }
  };

  getHeight = () => {
    const height = window.innerHeight + "px";
    this.setState({
      len: height
    });
  };

  backUp = () => {
    window.history.back(-1);
  };

  tabsClick = value => {
    this.setState({
      tabsActive: value
    });
  };

  addMuch = list => {
    isClick++;
    setTimeout(function () {
      isClick = 0;
      
    }, 500);
    if(isClick === 1){
      let { activityId,carList } = this.state;
      console.log('0000000000000000000000000000000000',list,carList)
      if (Number(list.productStock) > 0) {
        let isFlag = true
        carList.map(item=>{
          if(item.productId === list.id){
            if(item.productAmount+1>list.productStock){
              isFlag=false
            }
          }
          
        })
        const payload = {
          merchantId: list.merchantId,
          merchantName: list.merchantName,
          productId: list.id,
          productName: list.name,
          productImages: list.images || "",
          productAmount: 1,
          productPrice: list.productPrice,
          discountPrice: list.discountPrice,
          activityId
        };
        let { YQToken, IP } = this.state;
        if(isFlag){
          fetch(`${IP}/services/app/buyerUser/addProductIntoCart`, {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json", "YQ-Token": YQToken }
          })
            .then(resp => {
              resp.json().then(data => {
                this.getShopList()
                if (Number(data.status) === 1) {
                  Taro.atMessage({
                    message: "加入购物车成功！",
                    type: "success"
                  });
                  this.getDetalis();
                } else {
                  Taro.atMessage({
                    message: data.errorMsg,
                    type: "error"
                  });
                }
              });
            })
            .catch(e => {
              Taro.atMessage({
                message: "加入购物车失败，请稍后重试！",
                type: "error"
              });
            });
        }else{
          Taro.atMessage({
            message: "该商品购物车数量不得超过存库",
            type: "error"
          });
        }
  
      }
    }

  };

  render() {
    const { len, details, isJoin } = this.state;
    return (
      <View className="shop_details" style={`height:${len}`}>
        <AtMessage />
        {/* <div className="top_title">
          <span className="back_up">
            <AtIcon
              value="chevron-left"
              size="18"
              color="#333"
              onClick={() => this.backUp()}
            />
          </span>
          商品详情
        </div> */}
        <View className="shop_content">
          {details &&
            details.images !== "" &&
            <Swiper
              className="content_img"
              indicatorColor="#999"
              indicatorActiveColor="#333"
              // vertical
              // circular
              indicatorDots
            >
              <SwiperItem style="width:100%">
                <Image
                  style="width:100%;height:auto"
                  src={`${imgUrl}${details.images}`}
                />
              </SwiperItem>
            </Swiper>}
        </View>
        <View className="shop_bottom">
          <View className="shop_row">
            <View className="shop_title">
              {(details && details.name) || ""}
            </View>
            <View className="shop_name">
              {(details && details.merchantName) || ""}
            </View>
          </View>
          <View className="shop_much">
            销量: <span>{(details && details.sales) || 0}份</span> 库存:{" "}
            <span>{(details && details.productStock) || 0}份</span>
          </View>
          <View className="at-row shop_add">
            <View className="at-col at-col-6 shop_price">
              {details && details.productPrice
                ? `￥${details.productPrice}`
                : "暂无"}
            </View>
            {details &&
              Number(details.productStock) > 0 &&
              <View className="at-col at-col-6 shop_name">
                {isJoin === true
                  ? <AtButton
                      type="primary"
                      className={`${details && Number(details.productStock) > 0
                        ? "add_shop"
                        : "no_shop"}`}
                      onClick={() => this.addMuch(details)}
                    >
                      加入购物车
                    </AtButton>
                  : <AtButton
                      type="primary"
                      className="no_shop"
                      // onClick={() => this.addMuch(details)}
                    >
                      加入购物车
                    </AtButton>}
              </View>}
          </View>
          <View className="at-article">
            <View className="at-article__content">
              <View className="at-article__section">
                <View className="at-article__h3">商品详情</View>
                <View className="at-article__p">
                  {details && details.description
                    ?<RichText className='text' nodes={details.description} />
                    : "暂无详情"}
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* <View className="bottom_tabs">
          <View className="at-row">
            <View className="at-col at-col-8">
              <AtBadge value={1} maxValue={99}>
                <span className="shopCar_img">
                  <img src={shopCar} alt="" />
                </span>
              </AtBadge>
              <span className="shopCar_price">￥25</span>
            </View>
            <View
              className="at-col at-col-4"
              style={`background:${details && Number(details.productStock) > 0
                ? "rgba(223, 41, 41, 1)"
                : "rgba(179,179,179,1)"}`}
            >
              下单
            </View>
          </View>
        </View> */}
        {/* <AtTabBar
          fixed
          tabList={[
            { title: "待办事项", iconType: "bullet-list", },
            { title: "拍照", iconType: "camera" },
          ]}
          onClick={value => this.tabsClick(value)}
          current={tabsActive}
        /> */}
        {/* <Button onClick={() => Taro.navigateTo({ url: "/" })}>返回首页</Button> */}
      </View>
    );
  }
}
