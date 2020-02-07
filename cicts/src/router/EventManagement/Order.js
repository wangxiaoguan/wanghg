import React from 'react';
import { Route, Switch } from 'react-router-dom';
//订购活动
import List from '../../view/content/EventManagement/Order/List/List';
import Add from '../../view/content/EventManagement/Order/List/Add';
import Edit from '../../view/content/EventManagement/Order/List/Edit';
import Detail from '../../view/content/EventManagement/Order/List/detail';
// 查看订单列表以及详情
import OrderInformation from '../../view/content/EventManagement/Order/Commodity/OrderInformation';
import MerchantDetail from '../../view/content/EventManagement/Order/Merchant/MerchantDetail';
//设置订购商品
import SetShopping from '../../view/content/EventManagement/Order/List/setShopping';
//参与  浏览  点赞  评论详情页
import JoinList from '../../view/content/EventManagement/Order/StatisticalList/JoinList';
import ViewList from '../../view/content/EventManagement/Order/StatisticalList/ViewList';
import LikesList from '../../view/content/EventManagement/Order/StatisticalList/LikesList';
import CommentList from '../../view/content/EventManagement/Order/StatisticalList/CommentList';
import CommentDetail from  '../../view/content/EventManagement/Order/StatisticalList/CommentDetail';


//商品管理以及商家商品路由
import Merchant from  '../../view/content/EventManagement/Order/Merchant/Merchant';
import GoodsList from  '../../view/merchantSysterm/goodsManagetion/goodsList/list';
import AddMerchantGoods from '../../view/merchantSysterm/goodsManagetion/goodsList/add';
// import EditProduct from '../../view/merchantSysterm/goodsManagetion/goodsList/add';
//商品分类路由
import FirstClassifyList from  '../../view/merchantSysterm/goodsManagetion/goodsClassify/firstList.js';
import SecondClassifyList from   '../../view/merchantSysterm/goodsManagetion/goodsClassify/secondList.js';
const OrderMatch = 'Order';
const Order = _ => (
  <Switch>
    {/* 订购活动 */}
    <Route exact path={`${_.match}/${OrderMatch}/List`} component={List} />
    {/*新增*/}
    <Route exact path={`${_.match}/${OrderMatch}/Add`} component={Add} />
    {/*设置订购商品*/}
    <Route exact path={`${_.match}/${OrderMatch}/SetShopping`} component={SetShopping} />
    {/*编辑*/}
    <Route exact path={`${_.match}/${OrderMatch}/Edit`} component={Edit} />
    {/*详情*/}
    <Route exact path={`${_.match}/${OrderMatch}/Detail`} component={Detail} />
    {/*查看订单信息*/}
    <Route exact path={`${_.match}/${OrderMatch}/MerchantDetail`} component={MerchantDetail} />
    <Route exact path={`${_.match}/${OrderMatch}/OrderInformation`} component={OrderInformation} />
    {/* 参与  浏览  点赞  评论详情页 */}
    <Route exact path={`${_.match}/${OrderMatch}/JoinList`} component={JoinList} />
    <Route exact path={`${_.match}/${OrderMatch}/ViewList`} component={ViewList} />
    <Route exact path={`${_.match}/${OrderMatch}/LikesList`} component={LikesList} />
    <Route exact path={`${_.match}/${OrderMatch}/CommentList`} component={CommentList} />
    <Route exact path={`${_.match}/${OrderMatch}/CommentDetail`} component={CommentDetail} />

    {/* 商家管理以及商家商品 */}
    <Route exact path={`${_.match}/${OrderMatch}/Merchant`} component={Merchant} />
    <Route exact path={`${_.match}/${OrderMatch}/MerchantProduct`} component={GoodsList} />
    <Route exact path={`${_.match}/${OrderMatch}/AddProduct`} component={AddMerchantGoods} />
    <Route exact path={`${_.match}/${OrderMatch}/EditProduct`} component={AddMerchantGoods} />

    {/* 商品分类 */}
    <Route exact path={`${_.match}/${OrderMatch}/Classification`} component={FirstClassifyList} />
    <Route exact path={`${_.match}/${OrderMatch}/secondClassify`} component={SecondClassifyList} />


  </Switch>
);
export default Order;
