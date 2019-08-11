



import React, {Component} from "react";

import axios from "axios";

import {Link} from  'react-router-dom';

export default class Good extends Component{

    state = {fruits:["西瓜","香蕉","榴莲","菠萝蜜","苹果","樱桃","车厘子","葡萄"] }

    render(){
        return (
            <div>
                <h2>Good-Good-Good 水果展示 </h2>
                <div>
                    {
                        this.state.fruits.map((fruit,index)=>{
                            return ( 
                            <p key={index}>
                                <Link to={
                                    {
                                        pathname:"/fruit/"+fruit+"/"+index,
                                        search:"?index="+index
                                    }
                                }>{fruit}--{index}</Link>
                            </p> 
                            // <p key={index}><Link to={{pathname:"/app/my"}}>{fruit}</Link></p>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}