

import React,{Component} from "react";
import axios from "axios";
import {Button,Table} from 'antd'
export default class Data11 extends Component{
    constructor(props){
        super(props);
        this.state={
            shopList:[]
        }
    }
    componentDidMount(){
        
    }
    send=()=>{
        let me=this
        axios.get('http://wanghg.top/item/shop/php/shoppingcar.php')
        .then(function (response) {
            console.log(response.data);
            me.setState({shopList:response.data})
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    render(){
        const columns = [
            {title: '商品号', width: 100, dataIndex: 'goodsid'},
            {title: '名称', width:300, dataIndex: 'goodsname'},
            {title: '促销价', dataIndex: 'newprice',  width:80},
            {title: '原价', dataIndex: 'oldprice',  width: 80},
            {title: '商品信息', dataIndex: 'goodsmsg',  width: 500}
        ];
          
        const data = [];
        if(this.state.shopList.length){
            this.state.shopList.map((item,index)=>{
                data.push({
                    key: index,
                    goodsid: item.goodsid,
                    goodsname: item.goodsname,
                    newprice: item.newprice,
                    oldprice:item.oldprice,
                    goodsmsg:item.goodsmsg
                });
            })
        }
        const rowSelection = {
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          },
          onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
          },
        }
        return(
            <div>
                 <Button onClick={this.send} type='primary'>请求</Button>
                 <Table columns={columns}  rowSelection={rowSelection} bordered dataSource={data} />
            </div>
        )
    }
}




