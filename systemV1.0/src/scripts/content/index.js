import React,{Component} from "react";
import {connect} from 'react-redux';
import { Link } from 'react-router'
import $ from 'jquery'
import InformationSubmit from './InformationSubmit/index';//信息报送
import InformationExamine from './InformationExamine/index';//信息审核
import InformationCollect from './InformationCollect/index';//信息汇总

import InvestSubmit from './InvestSubmit/index';//投资报送
import InvestExamine from './InvestExamine/index';//投资审核
import InvestCollect from './InvestCollect/index';//投资汇总

import YearPlanSubmit from './YearPlanSubmit/index';//投资报送
import YearPlanExamine from './YearPlanExamine/index';//投资审核
import YearPlanCollect from './YearPlanCollect/index';//投资汇总
// import Routes from '../routes/index'
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
export default class Title extends Component{
    constructor(props){
        super(props);
        this.state={
           titleList:[
               {key:1,value:'信息报送',isActive:true,Path:'/InformationSubmit'},
               {key:2,value:'信息审核',isActive:false,Path:'/InformationExamine'},
               {key:3,value:'信息汇总',isActive:false,Path:'/InformationCollect'},
               {key:4,value:'投资报送',isActive:false,Path:'/InvestSubmit'},
               {key:5,value:'投资审核',isActive:false,Path:'/InvestExamine'},
               {key:6,value:'投资汇总',isActive:false,Path:'/InvestCollect'},
               {key:7,value:'年度计划',isActive:false,Path:'/YearPlanSubmit'},
               {key:8,value:'年度计划审核',isActive:false,Path:'/YearPlanExamine'},
               {key:9,value:'年度计划汇总',isActive:false,Path:'/YearPlanCollect'},
           ]
        }
    }

    TabPane = data => {
        let {titleList} = this.state;
        titleList.map(item=>{
            if(item.key === data.key){
                item.isActive=true;
            }else{
                item.isActive=false;
            }
        })
        this.setState({titleList},()=>{
            location.hash = data.Path
        })
    }

    render(){
        const {titleList} = this.state;
        return(
            <div id='web'>
                <div className='top'>管理系统</div>
                <div className='top-title'>项目工程</div>
                <div className='top-content'>
                    {
                        titleList.map(item=>{
                            return  <div className={`top-content-tab ${item.isActive?'top-content-tab-active':''}`} key={item.key} onClick={()=>this.TabPane(item)}>
                                        <span className='top-content-tab-title'>{item.value}</span>
                                    </div>
                        })
                    }
                </div>
            </div>
        )
    }
}





