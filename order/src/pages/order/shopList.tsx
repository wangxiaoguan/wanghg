import Taro, { Component, Config } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtIcon, AtMessage } from "taro-ui";
import { setIp, setToken } from "../redux/action";
import Store from "../redux/store";
import "./shopList.scss";
import { baseUrl, imgUrl } from "../../../config/config";

export default class ShopList extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      height: "auto",
      shopList: [],
      IP: "",
      YQToken: "",
      activityId: "",
      userId: ""
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
    navigationBarTitleText: "商品列表"
  };
  componentWillMount() {
    // let userId = "1193815038429872128";
    // let IP = "http://10.110.200.62:443";
    // let activityId = "1207168203686588416";
    // let YQToken =
    //   "NrDlumVeUrgwDvBJoRqvAObb5gUtW4KKgqL3S8U1Z6x%2FrY3UAAUuAABjPdEH5ngD";

    let params = window.location.search.split('&')
    let paramsList = params.map(item=>{
        return item.split('=')[1]
    })
    let userId = paramsList[0];
    let activityId = paramsList[1];
    let YQToken = paramsList[2];
    let IP = location.origin;
    Store.dispatch(setIp({ ip: IP }));
    Store.dispatch(setToken({ token: YQToken }));
    this.setState({ IP, YQToken, activityId, userId });
  }
  componentDidShow() {
    this.getHeight();
    this.getShopList();
  }

  getHeight = () => {
    const height = window.innerHeight + "px";
    this.setState({
      height
    });
  };

  getShopList = () => {
    // const YQToken = "oQ%2FXHE7oHO08hgdXx3qZLc36Hqw1Gz8C34bycgfVyRc%3D";
    // const activityId = "1204936785973858304";
    let { YQToken, activityId, IP } = this.state;
    fetch(`${IP}/services/app/buyerUser/getProductList/${activityId}`, {
      method: "GET",
      mode: "cors",
      cache: "default",
      headers: { "Content-Type": "application/json", "YQ-Token": YQToken }
    })
      .then(resp => {
        resp.json().then(data => {
          if (Number(data.status) === 1) {
            this.setState({
              shopList: data.root.activityProductRels
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
          message: "获取商品列表失败，请稍后重试！",
          type: "error"
        });
      });
  };

  backUp = () => {
    window.history.back(-1);
  };

  getDetails = id => {
    sessionStorage.removeItem("productId");
    sessionStorage.setItem("productId", id);
    Taro.navigateTo({ url: "/pages/order/shopDetail" });
  };

  render() {
    const { height, shopList } = this.state;
    return (
      <View className="shop_lsit" style={`min-height:${height}`}>
        <AtMessage />
        <div className="top_title">
          {/* <span className="back_up">
            <AtIcon
              value="chevron-left"
              size="18"
              color="#333"
              onClick={() => this.backUp()}
            />
          </span> */}
          商品列表
        </div>
        <View className="shop_content">
          {shopList.length > 0 &&
            shopList.map((v, k) =>
              <div className="shop_main" key={k + 1}>
                <p className="busin_name">
                  {v.merchantName}
                </p>
                <div className="busin_wares">
                  <ul>
                    <li>
                      <View className="li_row">
                        <View
                          className="left_img"
                          onClick={() => this.getDetails(v.productId)}
                        >
                          <img src={`${imgUrl}${v.images}`} alt="" />
                        </View>
                        <View
                          className="right_content"
                          onClick={() => this.getDetails(v.productId)}
                        >
                          <View className="busin_name at-article__h3">
                            {v.productName}
                          </View>
                          <View className="busin_time at-article__p">
                            销量:<span>{v.sales}</span>库存:<span>{v.productStock}</span>
                          </View>
                          <View className="busin_price at-article__h3">
                            {`￥${v.productPrice}`}
                          </View>
                        </View>
                      </View>
                    </li>
                  </ul>
                </div>
              </div>
            )}
        </View>
        {/* <Button onClick={() => Taro.navigateTo({ url: "/" })}>返回首页</Button> */}
      </View>
    );
  }
}
