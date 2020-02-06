

import React,{Component} from "react";
import "./index.scss";
import {Head} from "../../components/head";
import {WhiteSpace,Card,WingBlank } from "antd-mobile";
import getQuery from "../../utils/getQuery"
export class ContactDetail extends Component{

    render(){
        const {match,location} =this.props;
        return (
            <div>
                <Head title={match.params.title} show={true} history={this.props.history}/>
                <WingBlank size="lg">
                <WhiteSpace size="lg" />
                <Card>
                    <Card.Header
                        title={match.params.title}
                        thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
                        extra={<span>this is extra</span>}
                    />
                    <Card.Body>
                        <div><img src={  getQuery(location.search).src  } alt=""/></div>
                    </Card.Body>
                    <Card.Footer content="点赞" extra={<div>我喜欢的电影</div>} />
                </Card>
                <WhiteSpace size="lg" />
                </WingBlank>
            </div>
        )
    }
}