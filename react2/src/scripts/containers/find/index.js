

import React,{Component} from "react";
import "./index.scss";
import {Head} from "../../components/head";
import {WhiteSpace ,Tabs} from "antd-mobile";

const tabs = [
    {title:"豆瓣电影"},
    {title:"豆瓣音乐"},
    {title:"豆瓣书籍"},
]
export class Find extends Component{

    render(){
        return (
            <div>
                <Head title="发现" />
                <WhiteSpace />
                <div style={{ height: 250 }}>
                <Tabs tabs={tabs}
                    initalPage={'t2'}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                    Content of first tab
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                    Content of second tab
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                    Content of third tab
                    </div>
                </Tabs>
                </div>
            </div>
        )
    }
}