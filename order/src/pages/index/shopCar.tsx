import Taro, { Component, Config } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtIcon, AtBadge, AtMessage, AtFloatLayout,AtModal, AtModalHeader, AtModalContent, AtModalAction,AtButton,AtActivityIndicator } from "taro-ui";
import addImg from "../../img/plus.png";
import cutImg from "../../img/cut.png";
import shopCar from "../../img/shop_car.png";
import emptyCar from "../../img/empty_car.png";
import delImg from "../../img/delete.png";
import {
  setOrder,
  setActivity,
  setUser,
  setIp,
  setToken,
  setDetail
} from "../redux/action";
import Store from "../redux/store";
import { imgUrl } from "../../../config/config";
import "../order/shopCar.scss";
let isTwoClick = 0;
export default class ShopCar extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      height: "auto",
      shopList: [],
      carList: [],
      visible: false,
      price: "",
      IP: "",
      YQToken: "",
      activityId: "",
      userId: "",
      mum: 0,
      isOpened:false,
      shopListNum:0,
      shopCarLoad:false,
      isAdd:true,

    };
  }

  config: Config = {
    navigationBarTitleText: "商品列表"
  };
  componentWillMount() {
    // let userId = "21310";
    // let IP = "http://10.110.200.62:443";
    // let activityId = "1218724105482362880";
    // let YQToken = "3MFiM4YOiLdq1%2B26kqgibfhK8SS9YPFg0QLbyP8AeW0%3D";
  
    let list = window.location.search.substring(1).split("&");
    let params = {};
    list.map(item => {
      let arr = item.split("=");
      params[arr[0]] = arr[1];
    });
    let userId = params.userId;
    let IP = location.origin;
    let activityId = params.activityId;
    let YQToken = params.YQToken;
    Store.dispatch(setIp({ ip: IP }));
    Store.dispatch(setToken({ token: YQToken }));
    this.setState({ IP, YQToken, activityId, userId });
  }
  componentDidShow() {
    this.getHeight();
    this.getShopList();
    this.getUserData();
    this.getDeatil();
  }
  getDeatil = () => {
    let { YQToken, activityId, IP } = this.state;
    fetch(`${IP}/services/app/activity/getActivityById/${activityId}`, {
      method: "GET",
      mode: "cors",
      cache: "default",
      headers: { "Content-Type": "application/json", "YQ-Token": YQToken }
    }).then(resp => {
      resp.json().then(data => {
        if (data.status === 1) {
          Store.dispatch(setDetail(data.root.object));
        }else{
          Taro.atMessage({
            message: data.errorMsg,
            type: "error"
          });
        }
      });
    }).catch(e => {
      Taro.atMessage({
        message: "请求失败",
        type: "error"
      });
    });
  };
  getUserData = () => {
    let { YQToken, userId, IP } = this.state;
    fetch(`${IP}/app/system/dept/getUserDetail/${userId}`, {
      method: "GET",
      mode: "cors",
      cache: "default",
      headers: { "Content-Type": "application/json", "YQ-Token": YQToken }
    }).then(resp => {
      resp.json().then(data => {
        if (data.status === 1) {
          Store.dispatch(setUser(data.root.userInfo));
        }else{
          Taro.atMessage({
            message: data.errorMsg,
            type: "error"
          });
        }
      });
    }).catch(e => {
      Taro.atMessage({
        message: "请求失败",
        type: "error"
      });
    });
  };
  getShopList = () => {
    let { YQToken, activityId, IP,} = this.state;
    fetch(`${IP}/services/app/buyerUser/getProductList/${activityId}`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", "YQ-Token": YQToken }
    })
      .then(resp => {
        resp.json().then(data => {
          if (Number(data.status) === 1) {
            Store.dispatch(setActivity(data.root));
            const obj = this.getMuch(data.root.orderCarts);
            this.setState(
              {
                shopList: data.root.activityProductRels,
                carList: data.root.orderCarts,
                price: obj.price,
                num: obj.num
              },
              () => {
                const { shopList, carList} = this.state;
                if (carList.length > 0) {
                  for (let i = 0; i < carList.length; i++) {
                    const car = carList[i];
                    for (let j = 0; j < shopList.length; j++) {
                      if (car.merchantId === shopList[j].merchantId) {
                        if (car.orderCartList && car.orderCartList.length > 0) {
                          for (let m = 0; m < car.orderCartList.length; m++) {
                            if (
                              shopList[j].productId ===
                              car.orderCartList[m].productId
                            ) {
                              document.getElementById(
                                `setMuch${j + 1}`
                              ).innerHTML =
                                car.orderCartList[m].productAmount;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            );
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

  getHeight = () => {
    const height = window.innerHeight + "px";
    this.setState({
      height
    });
  };

  backUp = () => {
    window.history.back(-1);
  };

  addMuch = (id, count, list) => {
    isTwoClick++;
    setTimeout(function () {
      isTwoClick = 0;
      
    }, 500);
    this.getShopList();
    if (isTwoClick === 1) {
      let { activityId } = this.state;
      let much = Number(document.getElementById(id).innerText);
      if (much < Number(count)) {
        much += 1;
        const payload = {
          merchantId: list.merchantId,
          merchantName: list.merchantName,
          productId: list.productId,
          productName: list.productName,
          productImages: list.images || "",
          productAmount: 1,
          productPrice: list.productPrice,
          discountPrice: list.discountPrice,
          categoryId: list.categoryId,
          categoryName: list.categoryName,
          activityId
        };
        let { YQToken, IP } = this.state;
        fetch(`${IP}/services/app/buyerUser/addProductIntoCart`, {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json", "YQ-Token": YQToken }
        })
          .then(resp => {
            resp.json().then(data => {
              if (Number(data.status) === 1) {
                document.getElementById(id).innerHTML = much;
                this.setCarMuch(list, "add");
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
      }

    }

  };

  cutMuch = (id, list) => {
      isTwoClick++;
      setTimeout(function () {
        isTwoClick = 0;
        
      }, 500);
      if (isTwoClick === 1) {
        this.getShopList();
        let much = Number(document.getElementById(id).innerText);
        const { activityId } = this.state;
        if (much >= 1) {
          much -= 1;
          const payload = {
            merchantId: list.merchantId,
            merchantName: list.merchantName,
            productId: list.productId,
            productName: list.productName,
            productImages: list.images || "",
            productAmount: -1,
            productPrice: list.productPrice,
            discountPrice: list.discountPrice,
            categoryId: list.categoryId,
            categoryName: list.categoryName,
            activityId
          };
          let { YQToken, IP } = this.state;
    
          fetch(`${IP}/services/app/buyerUser/addProductIntoCart`, {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json", "YQ-Token": YQToken }
          })
            .then(resp => {
              resp.json().then(data => {
                if (Number(data.status) === 1) {
                  much = much<0?0:much
                  document.getElementById(id).innerHTML = much;
                  this.setCarMuch(list, "cut");
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
        }
      }


  };

  setCarMuch = (list, source) => {
    this.getShopList();
    let { carList } = this.state;
    let code = false;
    for (let i = 0; i < carList.length; i++) {
      if (carList[i].merchantId === list.merchantId) {
        code = true;
        let obj = carList[i].orderCartList;
        let type = false;
        for (let j = 0; j < obj.length; j++) {
          if (obj[j].productId === list.productId) {
            type = true;
            if (source === "add") {
              carList[i].orderCartList[j].productAmount =
                Number(carList[i].orderCartList[j].productAmount) + 1;
            } else {
              carList[i].orderCartList[j].productAmount =
                Number(carList[i].orderCartList[j].productAmount) - 1;
            }
            let obj = this.getMuch(carList);
            this.setState({
              carList,
              price: obj.price,
              num: obj.num
            });
          }
        }
        if (type === false) {
          carList[i].orderCartList.push({
            discountPrice: list.discountPrice,
            merchantId: list.merchantId,
            merchantName: list.merchantName,
            productAmount: 1,
            productId: list.productId,
            productImages: list.images,
            productName: list.productName,
            productPrice: list.productPrice,
            categoryId: list.categoryId,
            categoryName: list.categoryName
          });
          let obj = this.getMuch(carList);
          this.setState({
            carList,
            price: obj.price,
            num: obj.num
          });
        }
      }
    }
    if (code === false) {
      carList.push({
        merchantId: list.merchantId,
        merchantName: list.merchantName,
        orderCartList: [
          {
            discountPrice: list.discountPrice,
            merchantId: list.merchantId,
            merchantName: list.merchantName,
            productAmount: 1,
            productId: list.productId,
            productImages: list.images,
            productName: list.productName,
            productPrice: list.productPrice,
            categoryId: list.categoryId,
            categoryName: list.categoryName
          }
        ]
      });
      let obj = this.getMuch(carList);
      this.setState({
        carList,
        price: obj.price,
        num: obj.num
      });
    }
  };

  getDetails = id => {
    sessionStorage.removeItem("productId");
    sessionStorage.setItem("productId", id);
    Taro.navigateTo({ url: "/pages/order/shopDetail" });
  };

  setShop = () => {
    this.setState({
      visible: !this.state.visible
    });
  };

  getMuch = list => {
    let price = 0;
    let num = 0;
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < list[i].orderCartList.length; j++) {
        price +=
          Number(list[i].orderCartList[j].productAmount) *
          Number(
            list[i].orderCartList[j].discountPrice
              ? list[i].orderCartList[j].discountPrice
              : list[i].orderCartList[j].productPrice
          );
        num += Number(list[i].orderCartList[j].productAmount);
      }
    }
    const obj = {
      price: price === 0 ? "" : `￥${price.toFixed(2)}`,
      num
    };
    return obj;
  };

  editCar = (a, b, list, source) => {
    isTwoClick++;
    setTimeout(function () {
      isTwoClick = 0;
    }, 500);
    if (isTwoClick === 1) {
      const { carList, shopList } = this.state;
      const { activityId } = this.state;
      for (let i = 0; i < shopList.length; i++) {
        if (shopList[i].productId === list.productId) {
          if (source === "add") {
            if (Number(list.productAmount) < Number(shopList[i].productStock)) {
              const payload = {
                merchantId: list.merchantId,
                merchantName: list.merchantName,
                productId: list.productId,
                productName: list.productName,
                productImages: list.productImages || "",
                productAmount: 1,
                productPrice: list.productPrice,
                discountPrice: list.discountPrice,
                categoryId: list.categoryId,
                categoryName: list.categoryName,
                activityId
              };
              let { YQToken, IP } = this.state;
              fetch(`${IP}/services/app/buyerUser/addProductIntoCart`, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(payload),
                headers: {
                  "Content-Type": "application/json",
                  "YQ-Token": YQToken
                }
              })
                .then(resp => {
                  resp.json().then(data => {
                    if (Number(data.status) === 1) {
                      const count = Number(list.productAmount) + 1;
  
                      document.getElementById(
                        `setMuch${i + 1}`
                      ).innerHTML = count;
                      carList[a].orderCartList[b].productAmount = count;
                      const obj = this.getMuch(carList);
                      this.setState({
                        carList,
                        price: obj.price,
                        num: obj.num
                      },()=>this.getShopList());
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
            }
          } else {
            if (Number(list.productAmount) > 0) {
              const payload = {
                merchantId: list.merchantId,
                merchantName: list.merchantName,
                productId: list.productId,
                productName: list.productName,
                productImages: list.productImages || "",
                productAmount: -1,
                productPrice: list.productPrice,
                discountPrice: list.discountPrice,
                categoryId: list.categoryId,
                categoryName: list.categoryName,
                activityId
              };
              let { YQToken, IP } = this.state;
              fetch(`${IP}/services/app/buyerUser/addProductIntoCart`, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(payload),
                headers: {
                  "Content-Type": "application/json",
                  "YQ-Token": YQToken
                }
              })
                .then(resp => {
                  resp.json().then(data => {
                    if (Number(data.status) === 1) {
                      let count = Number(list.productAmount) - 1;
                      count = count<0?0:count
                      document.getElementById(
                        `setMuch${i + 1}`
                      ).innerHTML = count;
                      carList[a].orderCartList[b].productAmount = count;
                      const obj = this.getMuch(carList);
                      this.setState({
                        carList,
                        price: obj.price,
                        num: obj.num
                      },()=>this.getShopList());
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
            }
          }
        }
      }
    }

  };

  handleClose = () => {
    this.setState({
      visible: !this.state.visible
    });
    this.getShopList();
  };

  placeOrder = () => {
    const { carList, price,YQToken, IP } = this.state;
    if(!carList.length){
      return;
    }
    this.setState({shopCarLoad:true})
    let store = Store.getState()
    let order = store.order;
    let activity = store.activity.activityProductRels;
    let user = store.user;
    let detail = store.detail;

    let address = []
    detail.pickupAddress.map(item=>{
      address.push({ label: item.addressName, value: item.id })
    })
    let body = [];
    let list = []
    carList.map(item=>{
      list.push(item.orderCartList)
    })
    // let arr = [].concat.apply([],list)
    // let totalAmount = 0,payAmount=0;
    // arr.map(item=>{
    //   totalAmount = totalAmount + item.productPrice*item.productAmount
    //   payAmount = payAmount + item.productPrice*item.productAmount
    // })
    let shopListNum = 0
    carList.map(item=>{
      let str = [];
      item.orderCartList.map(e=>{
        if(e.productAmount>0){
          str.push({...e,discountPrice:e.productPrice,productPrice:Math.round(e.productPrice*e.productAmount*100)/100})
          shopListNum = shopListNum + 1;
        }
      })
      let totalAmount = 0,payAmount=0;
      str.map(item=>{
        totalAmount = totalAmount + item.productPrice;
        payAmount = payAmount + item.productPrice;
      })
      totalAmount = Math.round(totalAmount*100)/100
      payAmount = Math.round(payAmount*100)/100
      if(str.length>0){
        body.push({
          "activityId": activity[0].activityId,
          "userName": user.name,
          "userNo": user.userNo,
          "userPhone": user.mobile,
          "address": address[0].label,
          "totalAmount": totalAmount,
          "payAmount": payAmount,
          "receiverId": user.id,
          "receiverName": user.name,
          "receiverPhone": user.mobile,
          "receiverAddress": address[0].label,
          "merchantId": item.merchantId,
          "merchantName": item.merchantName,
          "receiveDate": new Date(),
          "sendDate": detail.applyBegin,
          "finishDate": 0,
          "endDate": detail.applyEnd,
          "orderDetailList":str,
        })
      }

    })
    if (price !== "") {
      fetch(`${IP}/services/app/buyerUser/checkStock`,
      {
          method: 'POST',
          mode: 'cors',
          cache: 'default',
          headers: {'Content-Type': 'application/json','YQ-Token':YQToken},
          body: JSON.stringify(body),
      }).then(response=>{
         response.json().then(data=>{
            this.setState({shopCarLoad:false})
            if(data.status === 1){
              let list = data.root.object;
              Store.dispatch(setOrder(list));
              let isStock = list.filter(item=>{
                return item.isStockEnough===false
              })
              if(isStock.length === list.length){
                Taro.atMessage({
                  'message': '你所选中的商品库存不足',
                  'type': 'error',
                })
              }else if(isStock.length>0&&isStock.length<list.length){
                this.setState({isOpened:true,shopListNum})
              }else{
                Taro.navigateTo({ url: "/pages/order/orderSubmit" });
              }
            }else{
              Taro.atMessage({
                'message': data.errorMsg,
                'type': 'error',
              })
            }
         })
        }).catch(e => {
          Taro.atMessage({
            message: "请求失败",
            type: "error"
          });
        });
      // Store.dispatch(setOrder(carList));
      // Taro.navigateTo({ url: "/pages/order/orderSubmit" });
    }
  };

  delCars = () => {
    let { YQToken, IP, activityId, shopList } = this.state;
    fetch(`${IP}/services/app/buyerUser/emptyCart/${activityId}`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json", "YQ-Token": YQToken }
    })
      .then(resp => {
        resp.json().then(data => {
          if (Number(data.status) === 1) {

            
            this.setState({visible: false},() => {
              let spanHtmlList = document.getElementsByClassName('middle_shopNum')
              for (let i = 0; i < spanHtmlList.length; i++) {
                // document.getElementById(`setMuch${i + 1}`).innerHTML = 0;
                spanHtmlList[i].innerHTML = 0;
              };
              this.getShopList();});
            
            Taro.atMessage({
              message: "购物车已清空",
              type: "success"
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
          message: "清空购物车失败，请稍后重试！",
          type: "error"
        });
      });
  };
  define = () => {
    this.setState({isOpened:false})
    Taro.navigateTo({ url: "/pages/order/orderSubmit" });
  }
  cancel = () => {
    this.setState({isOpened:false})
    this.getShopList();
  }
  render() {
    const { height, shopList, carList, visible, price, num ,isOpened,shopListNum,shopCarLoad,isAdd} = this.state;
    let shopType = 0 ;//商品种类
    carList.map(item=>{
      shopType = shopType + item.orderCartList.length
    })
    return (
      <View className="shop_lsit" style={`height:${height}`}>
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
          商品列表
        </div> */}
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
                        {
                          Number(v.productStock) > 0 ?
                          <View className="right_set">
                            <img src={addImg} alt="" onClick={() => this.addMuch( `setMuch${k + 1}`, v.productStock, v )}/>
                            <span className='middle_shopNum' id={`setMuch${k + 1}`}>0</span>
                            <img src={cutImg} alt="" onClick={() => this.cutMuch(`setMuch${k + 1}`, v)} />
                          </View>:
                          <View className="right_set">
                            <img src={addImg} alt="" onClick={() => this.addMuch( `setMuch${k + 1}`, v.productStock, v )}/>
                            <span className='middle_shopNum' id={`setMuch${k + 1}`}>0</span>
                            <img src={cutImg} alt="" onClick={() => this.cutMuch(`setMuch${k + 1}`, v)} />
                          </View>
                        }
                      </View>
                    </li>
                  </ul>
                </div>
              </div>
            )}
        </View>
        <View className="bottom_tabs">
          <View className="at-row">
            {shopType > 0
              ? <View
                  className="at-col at-col-8"
                  onClick={() => this.setShop()}
                >
                  <AtBadge value={shopType} maxValue={99}>
                    <span className="shopCar_img">
                      <img src={shopCar} alt="" />
                    </span>
                  </AtBadge>
                  <span className="shopCar_price">
                    {price}
                  </span>
                </View>
              : <View className="at-col at-col-8">
                  <span className="shopCar_img">
                    <img src={emptyCar} alt="" />
                  </span>
                </View>}
            <View
              className="at-col at-col-4"
              style={`background:${carList.length > 0
                ? "rgba(223, 41, 41, 1)"
                : "rgba(179,179,179,1)"}`}
              onClick={() => this.placeOrder()}
            >
              下单
            </View>
          </View>
        </View>
        <AtFloatLayout
          isOpened={visible}
          title="购物车"
          onClose={this.handleClose.bind(this)}
        >
          <View className="del_car" onClick={() => this.delCars()}>
            <img src={delImg} alt="" />
            <span>清空</span>
          </View>
          <View className="shop_content">
            {carList.length > 0 &&
              carList.map((v, k) =>
                <div className="shop_main" key={k + 1}>
                  <p className="busin_name">
                    {v.merchantName}
                  </p>
                  <div className="busin_wares">
                    <ul>
                      {v.orderCartList &&
                        v.orderCartList.map((v1, k1) =>
                          <li key={v1 + 1}>
                            <View className="li_row">
                              <View className="left_img">
                                {/* // onClick={() => this.getDetails(v1.productId)} */}
                                <img
                                  src={`${imgUrl}${v1.productImages}`}
                                  alt=""
                                />
                              </View>
                              <View className="right_content">
                                {/* // onClick={() => this.getDetails(v1.productId)} */}
                                <View className="busin_name at-article__h3">
                                  {v1.productName}
                                </View>
                                {/* <View className="busin_time at-article__p">
                                  销量:<span>{v1.sales}</span>库存:<span>{v1.productStock}</span>
                                </View> */}
                                <View className="busin_price at-article__h3">
                                  {`￥${v1.productPrice}`}
                                </View>
                              </View>
                              <View className="right_set">
                                <img
                                  src={addImg}
                                  alt=""
                                  onClick={() => this.editCar(k, k1, v1, "add")}
                                />
                                <span id={`setMuchy${k1 + 1}`}>
                                  {v1.productAmount<0?0:v1.productAmount}
                                </span>
                                <img
                                  src={cutImg}
                                  alt=""
                                  onClick={() => this.editCar(k, k1, v1, "cut")}
                                />
                              </View>
                            </View>
                          </li>
                        )}
                    </ul>
                  </div>
                </div>
              )}
          </View>
        </AtFloatLayout>
        <AtModal isOpened={isOpened} closeOnClickOverlay onClose={this.cancel}>
          <AtModalHeader>提示</AtModalHeader>
          <div className='AtModal-content'>部分商品库存不足，是否继续下单？</div>
          <AtModalAction><AtButton onClick={this.define} type='primary' size='small' >确定</AtButton >  <AtButton size='small' onClick={this.cancel}>取消</AtButton ></AtModalAction>
        </AtModal>
        {
          shopCarLoad?<div className='shopCar_load'>
          <AtActivityIndicator size={100}  mode='center'></AtActivityIndicator>
        </div>:null
        }
        
      </View>
    );
  }
}
