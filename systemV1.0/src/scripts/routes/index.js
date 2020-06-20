import React,{Component} from "react";
import {Route,Switch,Router,Redirect} from "react-router-dom";

import BaseLayout from '../content/BaseLayout'
import ConnectPage from '../content/ConnectPage/index';

import InformationSubmit from '../content/InformationSubmit/index';//信息报送
import AddInformationSubmit from '../content/InformationSubmit/add';//新建信息报送
import EditInformationSubmit from '../content/InformationSubmit/edit';//编辑信息报送
import DetailInformationSubmit from '../content/InformationSubmit/detail';//查看信息报送
import EditPassInformationSubmit from '../content/InformationSubmit/editpass';//查看已通过信息报送【部门内容可以修改】

import InformationExamine from '../content/InformationExamine/index';//信息审核
import ExaminePage from '../content/InformationExamine/Examine/Examine';//信息审核
import InformationCollect from '../content/InformationCollect/index';//信息汇总

import InvestSubmit from '../content/InvestSubmit/index';//投资报送
import InvestExamine from '../content/InvestExamine/index';//投资审核
import InvestCollect from '../content/InvestCollect/index';//投资汇总

import YearPlanSubmit from '../content/YearPlanSubmit/index';//投资报送
import YearPlanExamine from '../content/YearPlanExamine/index';//投资审核
import YearPlanCollect from '../content/YearPlanCollect/index';//投资汇总


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
                <Route exact path="/InformationSubmit/Detail/:id" component={DetailInformationSubmit}/>

                <Route exact path="/InformationExamine" component={InformationExamine}/>
                <Route exact path="/InformationExamine/Examine/:data" component={ExaminePage}/>
                <Route exact path="/InformationCollect" component={InformationCollect}/>
                <Route exact path="/InformationCollect/Examine/:data" component={ExaminePage}/>

                <Route exact path="/InvestSubmit" component={InvestSubmit}/>
                <Route exact path="/InvestExamine" component={InvestExamine}/>
                <Route exact path="/InvestCollect" component={InvestCollect}/>

                <Route exact path="/YearPlanSubmit" component={YearPlanSubmit}/>
                <Route exact path="/YearPlanExamine" component={YearPlanExamine}/>
                <Route exact path="/YearPlanCollect" component={YearPlanCollect}/>

                
                <Route exact path="/404" component={notFindePage}/>


            </BaseLayout> 
        )
    }
}





