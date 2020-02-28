import Taro, { Component, Config } from "@tarojs/taro";
import "taro-ui/dist/style/index.scss"; // 全局引入一次即可
import Index from "./pages/index";

import "./app.scss";
// const store = Store.getState()
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      "pages/index/index",
      "pages/index/orderList",
      "pages/index/shopCar",
      "pages/index/shopList",
      "pages/order/index",
      "pages/order/shopList",
      "pages/order/shopDetail",
      "pages/order/shopCar",
      "pages/order/orderList",
      "pages/order/orderDetail",
      "pages/order/orderStatus",
      "pages/order/orderSubmit",
      "pages/order/comfirm",
      "pages/seller/SellerList",
      "pages/seller/SellerOrderDetail",
      "pages/seller/SellerGoodDetail",
      "pages/seller/SellerPickUpStatus"
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "black"
    }
  };

  componentDidMount() {
    // console.log(store)
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      // <Provider store={store}>
      <Index />
      // {/* </Provider>  */}
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
