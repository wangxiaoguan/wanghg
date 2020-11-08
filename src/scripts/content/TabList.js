import React,{Component} from "react";
import {connect} from 'react-redux';
import InformationSubmit from './InformationSubmit/index';//信息报送
import InformationExamine from './InformationExamine/index';//信息审核
import InformationCollect from './InformationCollect/index';//信息汇总

import InvestSubmit from './InvestSubmit/index';//投资报送
import InvestExamine from './InvestExamine/index';//投资审核
import InvestCollect from './InvestCollect/index';//投资汇总

import YearPlanSubmit from './YearPlanSubmit/index';//投资报送
import YearPlanExamine from './YearPlanExamine/index';//投资审核
import YearPlanCollect from './YearPlanCollect/index';//投资汇总

import {Tabs,Icon,Button,Menu,DatePicker,TimePicker,LocaleProvider,Calendar,ConfigProvider,Row,Col,Modal,Table,Select,Input  } from 'antd';
const { Option } = Select;
const TabPane=Tabs.TabPane;
import './index.less';
@connect(
    state => ({
        state: state,
    }),
    dispatch => ({
        
    })
)
export default class TabList extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }
    onTabsChange = e => {
        
    }
    render(){

        return(
            <div className='TabList'>
               <Tabs type="card" onChange={this.onTabsChange} defaultActiveKey={'1'} style={{width:'100%'}}>
                    <TabPane tab="信息报送" key="1" >
                        <InformationSubmit/>
                    </TabPane>
                    <TabPane tab="信息审核" key="2" >
                        <InformationExamine/>
                    </TabPane>
                    <TabPane tab="信息汇总" key="3" >
                        <InformationCollect/>
                    </TabPane>
                    <TabPane tab="投资报送" key="4" >
                        <InvestSubmit/>
                    </TabPane>
                    <TabPane tab="投资审核" key="5" >
                        <InvestExamine/>
                    </TabPane>
                    <TabPane tab="投资汇总" key="6" >
                        <InvestCollect/>
                    </TabPane>
                    <TabPane tab="年度计划" key="7" >
                        <YearPlanSubmit/>
                    </TabPane>
                    <TabPane tab="年度计划审核" key="8" >
                        <YearPlanExamine/>
                    </TabPane>
                    <TabPane tab="年度计划汇总" key="9" >
                        <YearPlanCollect/>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}





