//信息报送
import React,{Component} from "react";
import {connect} from 'react-redux'
import {Icon,Button,Tooltip,Row,Spin,message} from 'antd';
import $ from 'jquery'
import './viewtotal.less';
import {getService,postService,getExportExcelService} from '../../common/fetch';
import moment from "moment";
const empty = require('../../../assets/images/empty.png')
@connect(
    state => ({
        state: state,
    }),
    dispatch => ({
        
    })
)

export default class InformationCollectViewTotal extends Component{
    constructor(props){
        super(props);
        this.state={
            list1:[],
            list2:[],
            list3:[],
            list4:[],
            list5:[],
            list6:[],
            tableList3:[],
            tableList4:[],
            tableList5:[],
            tableList6:[],
            detail1:{},
            detail2:{},
            spin:false,
            allData:{},
            year:'',
            month:'',
        }
    }

    componentDidMount(){
        let {match} = this.props;
        window.addEventListener('scroll', this.handleScroll);
        this.getDetail()
        
    }
    handleScroll = e => {
        let top = $(window).scrollTop(); 
        if(top>208){
            $('#header').addClass('header-fixed')
            $('#empty').addClass('empty')
        }else{
            $('#header').removeClass('header-fixed')
            $('#empty').removeClass('empty')
        }
    }

    getDetail = () => {
        let {match} = this.props;
        this.setState({spin:true})
        getService(`/workReport/infoSubmit/previewCollect`,res=>{
            if(res.flag){
                let data = res.data;
                let list1 = [],list2 = [],tableList3 = [],tableList4 = [],tableList5 = [],tableList6 = [];
                data.smApplicationInfoList&&data.smApplicationInfoList.map((item,index)=>{
                    list1.push({
                        orderNum:index+1,
                        systemName:item.systemName,
                        isSm:item.isSm,
                        startTime:item.startTime,
                        finishTime:item.finishTime,
                    })
                })
                data.fsmApplicationInfoList&&data.fsmApplicationInfoList.map((item,index)=>{
                    list2.push({
                        orderNum:index+1,
                        systemName:item.systemName,
                        isSm:item.isSm,
                        startTime:item.startTime,
                        finishTime:item.finishTime,
                    })
                })
                data.smDeviceInfoNoInList&&data.smDeviceInfoNoInList.map((e,index)=>{//涉密设备非类别
                    let object = {productId:e.deviceType,productName:e.deviceName,list:[]}
                    let list = [];
                    e.childDevices.map(item=>{
                        list.push({
                            companyName:item.manufacturerName,
                            companyId:item.manufacturer,

                            cpuName:item.cpuName,
                            cpuId:item.cpu,

                            systemName:item.osName,
                            systemId:item.os,

                            model:item.model,
                            num:String(item.num),
                            remark:item.remark,
                        })
                    })
                    object.list = list;
                    tableList3.push(object)

                })

                data.smDeviceInfoInList&&data.smDeviceInfoInList.map((e,index)=>{//涉密设备类别
                    let object = {productId:e.deviceType,productName:e.deviceName,list:[]}
                    let list = [];
                    e.childDevices.map(item=>{
                        list.push({
                            typeId:item.deviceDetailType,
                            typeName:item.deviceDetailTypeName,
                            model:item.model,
                            num:String(item.num),
                            remark:item.remark,
                        })
                    })
                    object.list = list;
                    tableList4.push(object)
                })

                data.fsmDeviceInfoNoInList&&data.fsmDeviceInfoNoInList.map((e,index)=>{//非涉密设备非类别
                    let object = {productId:e.deviceType,productName:e.deviceName,list:[]}
                    let list = [];
                    e.childDevices.map(item=>{
                        list.push({
                            companyName:item.manufacturerName,
                            companyId:item.manufacturer,

                            cpuName:item.cpuName,
                            cpuId:item.cpu,

                            systemName:item.osName,
                            systemId:item.os,

                            model:item.model,
                            num:String(item.num),
                            remark:item.remark,
                        })
                    })
                    object.list = list;
                    tableList5.push(object)
                })

                data.fsmDeviceInfoInList&&data.fsmDeviceInfoInList.map((e,index)=>{//非涉密设备类别
                    let object = {productId:e.deviceType,productName:e.deviceName,list:[]}
                    let list = [];
                    e.childDevices.map(item=>{
                        list.push({
                            typeId:item.deviceDetailType,
                            typeName:item.deviceDetailTypeName,
                            model:item.model,
                            num:String(item.num),
                            remark:item.remark,
                        })
                    })
                    object.list = list;
                    tableList6.push(object)
                })

                this.setState({spin:false,list1,list2,tableList3,tableList4,tableList5,tableList6,allData:{...data,month:new Date().getMonth()+1}
                })
                
            }else{
              this.setState({spin:false})
              message.error('未知错误')
            }
        })
    }

    exportExcel = type => {
        let name = type ? "各项目资金使用情况一览" : "各项目进度节点一览" ;
        getExportExcelService(`/workReport/infoSubmit/exportReportNotCollectTotalDetail/${type}`,name);
    }

    render(){
        const {allData,list1,list2,tableList3,tableList4,tableList5,tableList6,year,month} = this.state;

        const reformTbale = () => {
            return (
              <table className="reformTbale">
                <thead>
                  <tr>
					<th colSpan="2">XX月适配改造的涉密系统名称</th>
                    <th>开始时间</th>
                    <th>结束时间</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    list1.length?list1.map((item, j) => (
                      <tr key={j}>
                        <td>{j + 1}</td>
                        <td>{item.systemName}</td>
                        <td>{item.startTime}</td>
                        <td>{item.finishTime}</td>
                      </tr>
                    )):<tr><td colSpan={4}><img src={empty} alt=''/></td></tr>
                  }
                </tbody>
                <thead>
					<tr>
						<th colSpan="2">XX月适配改造的非涉密系统名称</th>
						<th>开始时间</th>
						<th>结束时间</th>
					</tr>
                </thead>
                <tbody>
                  {
                    list2.length?list2.map((item, j) => (
                      <tr key={j}>
                        <td>{j + 1}</td>
                        <td>{item.systemName}</td>
                        <td>{item.startTime}</td>
                        <td>{item.finishTime}</td>
                      </tr>
                    )):<tr><td colSpan={4}><img src={empty} alt=''/></td></tr>
                  }
                </tbody>
              </table>
            );
        };
        const deplayTable = () => {
            return (
              <div>
                <div className='deplayContent'>
                  <table border="1">
                    <thead>
                      <tr>
                        <th>产品分类</th>
                        <th colSpan="2">生产厂商</th>
                        <th>CPU芯片</th>
                        <th>操作系统</th>
                        <th>数量（台/套）</th>
                        <th>备注</th>
                      </tr>
                    </thead>
                    <tbody>
                        {
                            tableList3.length?tableList3.map(e=>{
                                return e.list.map((item, index) => {
                                    return (
                                      <tr key={index}>
                                        {index === 0 ? (
                                          <td rowSpan={e.list.length}>{e.productName}</td>
                                        ) : null}
                                        <td>{index + 1}</td>
                                        <td>{item.companyName}</td>
                                        <td>{item.cpuName}</td>
                                        <td>{item.systemName}</td>
                                        <td>{item.num}</td>
                                        <td>{item.remark}</td>
                                      </tr>
                                    );
                                  })
                            }):<tr><td colSpan={7}><img src={empty} alt=''/></td></tr>
                        }
                    </tbody>
                     <thead>
                      <tr>
                        <th> </th>
                        <th colSpan="2">类别</th>
                        <th>数量（台/套）</th>
                        <th colSpan="3">备注</th>
                      </tr>
                    </thead>
                    <tbody>
                        {
                            tableList4.length?tableList4.map(e=>{
                                return e.list.map((item, index) => {
                                    return (
                                    <tr key={index}>
                                        {index === 0 ? (
                                        <td rowSpan={e.list.length}>{e.productName}</td>
                                        ) : null}
                                        <td>{index + 1}</td>
                                        <td>{item.typeName}</td>
                                        <td>{item.num}</td>
                                        <td colSpan='3'>{item.remark}</td>
                                    </tr>
                                    )
                                })
                            }):<tr><td colSpan={7}><img src={empty} alt=''/></td></tr>
                        }
                    </tbody>
                  </table>
                </div>
              </div>
            );
        };
        const deplayTable2 = () => {
            return (
              <div>
                <div className='deplayContent'>
                  <table border="1">
                    <thead>
                      <tr>
                        <th>产品分类</th>
                        <th colSpan="2">生产厂商</th>
                        <th>CPU芯片</th>
                        <th>操作系统</th>
                        <th>数量（台/套）</th>
                        <th>备注</th>
                      </tr>
                    </thead>
                    <tbody>
                        {
                            tableList5.length?tableList5.map(e=>{
                                return e.list.map((item, index) => {
                                    return (
                                      <tr key={index}>
                                        {index === 0 ? (
                                          <td rowSpan={e.list.length}>{e.productName}</td>
                                        ) : null}
                                        <td>{index + 1}</td>
                                        <td>{item.companyName}</td>
                                        <td>{item.cpuName}</td>
                                        <td>{item.systemName}</td>
                                        <td>{item.num}</td>
                                        <td>{item.remark}</td>
                                      </tr>
                                    );
                                  })
                            }):<tr><td colSpan={7}><img src={empty} alt=''/></td></tr>
                        }
                    </tbody>
                     <thead>
                      <tr>
                        <th> </th>
                        <th colSpan="2">类别</th>
                        <th>数量（台/套）</th>
                        <th colSpan="3">备注</th>
                      </tr>
                    </thead>
                    <tbody>
                        {
                            tableList6.length?tableList6.map(e=>{
                                return e.list.map((item, index) => {
                                    return (
                                    <tr key={index}>
                                        {index === 0 ? (
                                        <td rowSpan={e.list.length}>{e.productName}</td>
                                        ) : null}
                                        <td>{index + 1}</td>
                                        <td>{item.typeName}</td>
                                        <td>{item.num}</td>
                                        <td colSpan='3'>{item.remark}</td>
                                    </tr>
                                    )
                                })
                            }):<tr><td colSpan={7}><img src={empty} alt=''/></td></tr>
                        }
                    </tbody>
                  </table>
                </div>
              </div>
            );
		    };
        const remarksTable = () => {
          return(
            <div className='remarksTable'>
              	<table>
					<tbody>
						<tr>
							<td>本次填报周期新增投资经费(万元)</td>
							<td>本次填报周期新增终端数量(台)</td>
							<td>本次填报周期新增服务器(台)</td>
						</tr>
						<tr>
							<td>{allData.addInvestmentMoney||'　'}</td>
							<td>{allData.addTerminalsNum||'　'}</td>
							<td>{allData.addServersNum||'　'}</td>
						</tr>
						<tr>
							<td>台账预算外投资经费(万元)</td>
							<td>台账外新增终端数量(台)</td>
							<td>台账外新增服务器数量(台)</td>
						</tr>
						<tr>
							<td>{allData.ebInvestmentMoney||'　'}</td>
							<td>{allData.ebTerminalsNum||'　'}</td>
							<td>{allData.ebServersNum||'　'}</td>
						</tr>
					</tbody>
              	</table>
            </div>
          )
        };
        const problemTable = () => {
          return(
            <div className="problemTable">
              	<table>
                    <tbody>
                      <tr>
                        <td>涉密领域</td>
                        <td colSpan='2'>非涉密领域</td>
                      </tr>
                      <tr>
                        <td style={{textAlign:'left'}}>{allData.isSmSuggestion||'　'}</td>
                        <td style={{textAlign:'left'}} colSpan='2'>{allData.notSmSuggestion||'　'}</td>
                      </tr>
                    </tbody>
              	</table>
                <table>
                    <tbody>
                        <tr>
                            <td>联系人</td>
                            <td>办公室电话</td>
                            <td>移动电话</td>
                        </tr>
                        <tr>
                            <td>{allData.contactName||'　'}</td>
                            <td>{allData.officePhone||'　'}</td>
                            <td>{allData.contactPhone||'　'}</td>
                        </tr>
                    </tbody>
              	</table>
            </div>
          )
        };
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        return(
            <Spin spinning={this.state.spin}>
                <div className='InformationCollectViewTotal'>
                    <header id='header'>
                        <div className='header-item'>填报单位：{allData.createUnitName||userInfo.unitName}</div>
                        <div className='header-item'>填报人：{allData.admitName||userInfo.userName}</div>
                        <div className='header-item'>时间：{allData.createTime&&allData.createTime.substring(0,10)||moment(new Date()).format("YYYY-MM-DD")}</div>
                        <div className='header-item'>
                            <Button type='default' onClick={()=>history.back()}>返回</Button>
                        </div>
                    </header>
                    <div id='empty'></div>
                    <div className='step-name'>
                        <span>一、项目推进主要进度节点</span>　
                        <Tooltip placement="right" title={'说明：已完成的工作在对应进度下选择完成日期，未完成的可不填写'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    <div style={{padding:'30px 0',fontSize:'16px',cursor:'pointer'}} onClick={() =>this.exportExcel(0)}>
                        <img className='download' src={require("../../../assets/icon/download.png")} />
						<span>下载各项目进度节点一览.xlsx</span>
                    </div>
                    <div className='step-name'>
                        <span>二、项目资金使用情况</span>　
                        <Tooltip placement="right" title={'说明：计划投资完成指完成项目采购签订合同，计划投资拨付指向工程承建、监理等单位拨付款项，如分批次付款，以最后一次为准。如有调整请写明调整事项、时间、设计金额和履行的程序。'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
					<div style={{padding:'30px 0',fontSize:'16px',cursor:'pointer'}} onClick={() =>this.exportExcel(1)}>
                        <img className='download' src={require("../../../assets/icon/download.png")} />
						<span>下载各项目资金使用情况一览.xlsx</span>
                    </div>
                    <div className='step-name'>
                        <span>三、应用系统改造情况</span>　
                        <Tooltip placement="right" title={'说明：涉密系统点击“新增涉密系统改造”，非涉密系统点击“新增涉密系统改造”，来分别填写本次采购项目涉及到的应用系统适配改造情况，如果没有则不填'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    {
                        reformTbale()
                    }
                    <div className='step-name'>
                        <span>四、设备部署情况</span>　
                        <Tooltip placement="right" title={'说明：填写过程中，请点击按钮新增设备，来添加设备。生产城市、CPU芯片、操作系统、数据库请在下拉菜单中选择'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    <Row style={{padding:'10px 0px'}}>
                        <div className='row-div-title'>XX月涉密领域部署情况</div>
                        {
                            deplayTable()
                        }
                        <div className='row-div-title'>XX月非涉密领域部署情况</div>
                        {
                            deplayTable2()
                        }
                    </Row>
                    {/* <div className='step-name'>
                        <span>五、重要事项</span>　
                        <Tooltip placement="right" title={'说明：主要填写领导批示、好的经验做法等，以及推进工作中遇到的重要情况.'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    <div className='importantItem'>{allData.importantItem}</div> */}
                    <div className='step-name'>
                        <span>六、备注</span>　
                    </div>
                    {
                      	remarksTable()
                    }
                    {/* <div className='step-name'>
                        <span>七、问题和建议</span>　
                        <Tooltip placement="right" title={'说明：请填写推进工作中遇到的主要困难和问题，包括出现问题的产品、生产厂商等，以及对全面替代工作的意见建议.'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div> */}
                    {/* {
                      	problemTable()
                    } */}
                </div>
            </Spin>
        )
    }
}





