
import { Route } from 'react-router-dom';
import React from 'react';

import merchantInfoList from '../../view/merchantSysterm/merchantInfomation/list';
import GoodsList from '../../view/merchantSysterm/goodsManagetion/goodsList/list';
import AddMerchantGoods from '../../view/merchantSysterm/goodsManagetion/goodsList/add';
import FirstClassifyList from '../../view/merchantSysterm/goodsManagetion/goodsClassify/firstList';
import SecondClassifyList from '../../view/merchantSysterm/goodsManagetion/goodsClassify/secondList';
import OrdersList from '../../view/merchantSysterm/ordersManagetion/list';
// import OrdersDetail from '../../view/merchantSysterm/ordersManagetion/detail';

// const match = '/Message';
const MerchantRouters = (props) => {
  return (
    <div>
      <Route exact path={'/MerchantInfomatin'} component={merchantInfoList} />
      <Route exact path={`/GoodsManagetion/GoodsList`} component={GoodsList} />
      <Route exact path={`/GoodsManagetion/AddGoods`} component={AddMerchantGoods} />
      <Route exact path={`/GoodsManagetion/EditGoods`} component={AddMerchantGoods} />
      <Route exact path={`/GoodsManagetion/ClassifyList`} component={FirstClassifyList} />
      <Route exact path={`/GoodsManagetion/secondClassify`} component={SecondClassifyList} />
      <Route exact path={`/OrdersMaganetion/OrdersList`} component={OrdersList} />
      {/* <Route exact path={`/OrdersMaganetion/OrdersDetail`} component={OrdersDetail} /> */}
    </div>
  );
};

export default MerchantRouters;