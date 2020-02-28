import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtTabs, AtTabsPane,AtSearchBar} from 'taro-ui'
import './SellerList.scss'

import SellerGoodsList from "./SellerGoodsList";
import SellerOrdersList from "./SellerOrdersList";

export default class SellerList extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      current: 0,
      orderSearchValue: '',
      goodsSearchValue: '',
      searchValue: '',
      searchLeft: false,
      searchRight: false
    }
  }

  componentWillMount() {
    document.title='商家首页'
  }

  handleClick(value) {
    this.setState({
      current: value,
    })
  }
  onChange(value){
    this.setState({
      searchValue: value,
      searchLeft: false,
      searchRight: false
    })
  }
  onActionClick(){
    const { searchValue,current } = this.state;
    // if(searchValue === ''){
    //   return
    // }
    if(current === 0){
      this.setState({
        orderSearchValue: searchValue,
        searchLeft: true,
        searchRight: false
      })
    } else {
      this.setState({
        goodsSearchValue: searchValue,
        searchLeft: false,
        searchRight: true
      })
    }
  }

  clearSearch(){
    this.setState({
      orderSearchValue: '',
      goodsSearchValue: '',
      searchValue: '',
      searchLeft: this.state.current === 0,
      searchRight: this.state.current === 1
    })
  }

  render() {
    const tabList = [{title: '订单列表'}, {title: '商品列表'}]
    const { windowHeight } = Taro.getSystemInfoSync();
    const { orderSearchValue, goodsSearchValue,searchValue, current, searchLeft,searchRight} =  this.state;
    return (
      <View style={{ flex: 1, height: windowHeight, background: 'white', overflow: 'hidden'}}>
        <AtSearchBar
          showActionButton
          value={searchValue}
          onChange={this.onChange.bind(this)}
          onActionClick={this.onActionClick.bind(this)}
          onClear={this.clearSearch.bind(this)}
        />
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0}>
            {
              searchLeft ?  <SellerOrdersList searchValue={orderSearchValue} />
              :  <SellerOrdersList />
            }
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            {searchRight ? <SellerGoodsList searchValue={ goodsSearchValue } />:
              <SellerGoodsList />
            }
          </AtTabsPane>
        </AtTabs>
      </View>

    )
  }

}
