import React,{Component} from "react";
import {Route,Switch,Router,Redirect} from "react-router-dom";

import BaseLayout from '../content/BaseLayout'
import ConnectPage from '../content/ConnectPage/index';

import InformationSubmit from '../content/InformationSubmit/index';//信息报送
import AddInformationSubmit from '../content/InformationSubmit/add';//新建信息报送
import EditInformationSubmit from '../content/InformationSubmit/edit';//编辑信息报送
import DetailInformationSubmit from '../content/InformationSubmit/detail';//查看信息报送
import EditPassInformationSubmit from '../content/InformationSubmit/editpass';//查看已通过信息报送【部门内容可以修改】

import InformationExamine from '../content/InformationExamine/index';//信息审核总列表
import InformationExamineList from '../content/InformationExamine/list';//信息审核列表
import InformationExamineListDetail from '../content/InformationExamine/detail';//信息审核列表详情
import InformationExamineListExamine from '../content/InformationExamine/examine';//信息审核列表审核

import InformationCollect from '../content/InformationCollect/index';//信息汇总
import InformationCollectDetail from '../content/InformationCollect/detail';//信息汇总详情
import InformationCollectViewTotal from '../content/InformationCollect/viewtotal';//信息汇总详情




import notFindePage from '../content/404Page/404Page';//投资汇总


import './index.less'
export default class Routes extends Component{
    constructor(props){
        super(props);
        this.state={
          
        }
    }
    

    render(){
        return(
            <BaseLayout>
                <Route exact path="/" component={ConnectPage}/>

                <Route exact path="/InformationSubmit" component={InformationSubmit}/>
                <Route exact path="/InformationSubmit/Add" component={AddInformationSubmit}/>
                <Route exact path="/InformationSubmit/Edit/:id" component={EditInformationSubmit}/>
                <Route exact path="/InformationSubmit/EditPass/:id" component={EditPassInformationSubmit}/>
                <Route exact path="/InformationSubmit/Detail/:id/:isExamine" component={DetailInformationSubmit}/>

                <Route exact path="/InformationExamine" component={InformationExamine}/>
                <Route exact path="/InformationExamine/List/:id" component={InformationExamineList}/>
                <Route exact path="/InformationExamine/List/Detail/:id/:isSubmit" component={InformationExamineListDetail}/>
                <Route exact path="/InformationExamine/List/Examine/:id" component={InformationExamineListExamine}/>

                <Route exact path="/InformationCollect" component={InformationCollect}/>
                <Route exact path="/InformationCollect/Detail" component={InformationCollectDetail}/>
                <Route exact path="/InformationCollect/ViewTotal" component={InformationCollectViewTotal}/>

                <Route exact path="/404" component={notFindePage}/>


            </BaseLayout> 
        )
    }
}





