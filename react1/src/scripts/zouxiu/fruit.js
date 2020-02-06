
import React, {Component} from "react";


// export default Fruit  常量
// export Fruit  {Fruit:Fruit}  解构对象 导出 


import getQuery from "../utils/getQuery";

import url from "url";

export  class  Fruit  extends  Component{
    goback = ()=>{
        const {history} = this.props;
        // history.go(-1);
        history.goBack();
    }
    render(){
        const {match,location} = this.props;
        return (
            <div>
                <h2>水果具体信息 </h2>
                <h2>fname == {match.params.fname}</h2>
                {/* <h2>index == {getQuery(location.search).index}</h2> */}
                <h2>index=={url.parse(location.search,true).query.index}</h2>
                <button onClick={this.goback}>返回</button>
            </div>
        )
    }
}