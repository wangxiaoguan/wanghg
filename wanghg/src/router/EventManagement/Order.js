import React from 'react';
import { Route, Switch } from 'react-router-dom';

import List from '../../view/content/EventManagement/Order/List/List';
import Commodity from '../../view/content/EventManagement/Order/Commodity/Commodity';
import CommodityAdd from '../../view/content/EventManagement/Order/Commodity/CommodityAdd';
import CommodityEdit from '../../view/content/EventManagement/Order/Commodity/CommodityAdd';

import OrderInformation from '../../view/content/EventManagement/Order/Commodity/OrderInformation';
import Add from '../../view/content/EventManagement/Order/list/Add';
import SetShopping from '../../view/content/EventManagement/Order/list/setShopping';
import Edit from '../../view/content/EventManagement/Order/list/Edit';
import Detail from '../../view/content/EventManagement/Order/list/detail';
//参与  浏览  点赞  评论详情页
import JoinList from '../../view/content/EventManagement/StatisticalList/JoinList';
import ViewList from '../../view/content/EventManagement/StatisticalList/ViewList';
import LikesList from '../../view/content/EventManagement/StatisticalList/LikesList';
import CommentList from '../../view/content/EventManagement/StatisticalList/CommentList';
const OrderMatch = 'Order';
const Order = _ => (
  <Switch>
    <Route exact path={`${_.match}/${OrderMatch}/List`} component={List} />
    <Route exact path={`${_.match}/${OrderMatch}/Commodity`} component={Commodity} />
    <Route exact path={`${_.match}/${OrderMatch}/CommodityAdd`} component={CommodityAdd} />
    <Route exact path={`${_.match}/${OrderMatch}/CommodityEdit`} component={CommodityEdit} />
    <Route exact path={`${_.match}/${OrderMatch}/OrderInformation`} component={OrderInformation} />

    <Route exact path={`${_.match}/${OrderMatch}/JoinList`} component={JoinList} />
    <Route exact path={`${_.match}/${OrderMatch}/ViewList`} component={ViewList} />
    <Route exact path={`${_.match}/${OrderMatch}/LikesList`} component={LikesList} />
    <Route exact path={`${_.match}/${OrderMatch}/CommentList`} component={CommentList} />

    {/*新增*/}
    <Route exact path={`${_.match}/${OrderMatch}/Add`} component={Add} />
    {/*设置订购商品*/}
    <Route exact path={`${_.match}/${OrderMatch}/SetShopping`} component={SetShopping} />
    {/*编辑*/}
    <Route exact path={`${_.match}/${OrderMatch}/Edit`} component={Edit} />
    {/*详情*/}
    <Route exact path={`${_.match}/${OrderMatch}/Detail`} component={Detail} />
    {/*查看订购信息*/}

  </Switch>
);
export default Order;
