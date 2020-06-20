//信息报送
import React,{Component} from "react";
import {connect} from 'react-redux'
import {Icon,Button,Tooltip,Row,Spin,message,Input,Modal,Popover,Popconfirm} from 'antd';
import $ from 'jquery'
import moment from 'moment';
import './examine.less';
import {getService,postService,getExportExcelService} from '../../common/fetch';
import {timeDetailList} from '../../common/staticData';
const empty = require('../../../assets/images/empty.png')
const {TextArea} = Input;
@connect(
    state => ({
        state: state,
    }),
    dispatch => ({
        
    })
)

export default class AddInformationSubmit extends Component{
    constructor(props){
        super(props);
        this.state={
            list1:[],
            list2:[],
            tableList3:[],
            tableList4:[],
            tableList5:[],
            tableList6:[],
            list1_1:[],
            list2_1:[],
            tableList3_1:[],
            tableList4_1:[],
            tableList5_1:[],
            tableList6_1:[],
            spin:false,
            allData:{},
            lastData:{},
            id:'',
            reason:'',
            isFirst:true
        }
    }

    componentDidMount(){
        let {match} = this.props;
        let id = match.params.id;
        this.setState({id})
        window.addEventListener('scroll', this.handleScroll);
        // this.getDetail()
        // this.getLastDetail()
        this.getNowAndPreDetail()
        
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
    exportExcel = () => {
      let {allData} = this.state;
      getExportExcelService(`/workReport/infoSubmit/exportSingle/${allData.id}`,`${allData.projectName}项目表格`)
    }
    getNowAndPreDetail = () => {
      this.setState({spin:true})
      let {match} = this.props;
      let isFirst = false;
      let now = new Promise((pass,fail)=>{
        getService(`/workReport/infoSubmit/getDetail?id=${match.params.id}`,res=>{
          if(res.flag){
              let data = res.data||{};
              pass(data)
          }else{
              message.error('未知错误')
              fail({})
          }
        })
      })
      let pre = new Promise((pass,fail)=>{
        getService(`/workReport/infoSubmit/getLastPassVersionById/${match.params.id}`,res=>{
          if(res.flag){
              let data = res.data||{};
              pass(data)
          }else{
            isFirst = true;
            pass({})
          }
        })
      })
      Promise.all([now,pre]).then(data=>{
        let nowData = data[0], preData = data[1];
        //当前最新数据
        let list1 = [],list2 = [],tableList3 = [],tableList4 = [],tableList5 = [],tableList6 = [];
        nowData.smApplicationInfoList.map((item,index)=>{
            list1.push({
                id:item.id,
                orderNum:index+1,
                systemName:item.systemName,
                isSm:item.isSm,
                startTime:item.startTime,
                finishTime:item.finishTime,
            })
        })
        nowData.fsmApplicationInfoList.map((item,index)=>{
            list2.push({
                id:item.id,
                orderNum:index+1,
                systemName:item.systemName,
                isSm:item.isSm,
                startTime:item.startTime,
                finishTime:item.finishTime,
            })
        })
        nowData.smDeviceInfoNoInList.map((e,index)=>{//涉密设备非类别
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
        nowData.smDeviceInfoInList.map((e,index)=>{//涉密设备类别
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
        nowData.fsmDeviceInfoNoInList.map((e,index)=>{//非涉密设备非类别
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
        nowData.fsmDeviceInfoInList.map((e,index)=>{//非涉密设备类别
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


        //上一次数据
        let list1_1 = [],list2_1 = [],tableList3_1 = [],tableList4_1 = [],tableList5_1 = [],tableList6_1 = [];
        !isFirst&&preData.smApplicationInfoList.map((item,index)=>{
            list1_1.push({
                id:item.id,
                orderNum:index+1,
                systemName:item.systemName,
                isSm:item.isSm,
                startTime:item.startTime,
                finishTime:item.finishTime,
            })
        })
        !isFirst&&preData.fsmApplicationInfoList.map((item,index)=>{
            list2_1.push({
                id:item.id,
                orderNum:index+1,
                systemName:item.systemName,
                isSm:item.isSm,
                startTime:item.startTime,
                finishTime:item.finishTime,
            })
        })
        !isFirst&&preData.smDeviceInfoNoInList.map((e,index)=>{//涉密设备非类别
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
            tableList3_1.push(object)

        })
        !isFirst&&preData.smDeviceInfoInList.map((e,index)=>{//涉密设备类别
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
            tableList4_1.push(object)
        })
        !isFirst&&preData.fsmDeviceInfoNoInList.map((e,index)=>{//非涉密设备非类别
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
            tableList5_1.push(object)
        })
        !isFirst&&preData.fsmDeviceInfoInList.map((e,index)=>{//非涉密设备类别
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
            tableList6_1.push(object)
        })

        this.setState({
          spin:false,
          isFirst,
          list1,
          list2,
          tableList3,
          tableList4,
          tableList5,
          tableList6,
          allData:{...nowData,month:new Date().getMonth()+1},
          list1_1,
          list2_1,
          tableList3_1,
          tableList4_1,
          tableList5_1,
          tableList6_1,
          lastData:{...preData,month:new Date().getMonth()+1}

        })

      }).catch(error=>{
        console.log(error)
      })
    }
    getDetail = () => {
        let {match} = this.props;
        this.setState({spin:true})
        getService(`/workReport/infoSubmit/getDetail?id=${match.params.id}`,res=>{
            if(res.flag){
                let data = res.data;
                let list1 = [],list2 = [],tableList3 = [],tableList4 = [],tableList5 = [],tableList6 = [];
                data.smApplicationInfoList.map((item,index)=>{
                    list1.push({
                        orderNum:index+1,
                        systemName:item.systemName,
                        isSm:item.isSm,
                        startTime:item.startTime,
                        finishTime:item.finishTime,
                    })
                })
                data.fsmApplicationInfoList.map((item,index)=>{
                    list2.push({
                        orderNum:index+1,
                        systemName:item.systemName,
                        isSm:item.isSm,
                        startTime:item.startTime,
                        finishTime:item.finishTime,
                    })
                })
                data.smDeviceInfoNoInList.map((e,index)=>{//涉密设备非类别
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

                data.smDeviceInfoInList.map((e,index)=>{//涉密设备类别
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

                data.fsmDeviceInfoNoInList.map((e,index)=>{//非涉密设备非类别
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

                data.fsmDeviceInfoInList.map((e,index)=>{//非涉密设备类别
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
                
            }
        })
    }

    getLastDetail = () => {
      let {match} = this.props;
        this.setState({spin:true})
        getService(`/workReport/infoSubmit/getLastPassVersionById/${match.params.id}`,res=>{
            if(res.flag){
                let data = res.data;
                let list1_1 = [],list2_1 = [],tableList3_1 = [],tableList4_1 = [],tableList5_1 = [],tableList6_1 = [];
                data.smApplicationInfoList.map((item,index)=>{
                    list1_1.push({
                        orderNum:index+1,
                        systemName:item.systemName,
                        isSm:item.isSm,
                        startTime:item.startTime,
                        finishTime:item.finishTime,
                    })
                })
                data.fsmApplicationInfoList.map((item,index)=>{
                    list2_1.push({
                        orderNum:index+1,
                        systemName:item.systemName,
                        isSm:item.isSm,
                        startTime:item.startTime,
                        finishTime:item.finishTime,
                    })
                })
                data.smDeviceInfoNoInList.map((e,index)=>{//涉密设备非类别
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
                    tableList3_1.push(object)

                })

                data.smDeviceInfoInList.map((e,index)=>{//涉密设备类别
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
                    tableList4_1.push(object)
                })

                data.fsmDeviceInfoNoInList.map((e,index)=>{//非涉密设备非类别
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
                    tableList5_1.push(object)
                })

                data.fsmDeviceInfoInList.map((e,index)=>{//非涉密设备类别
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
                    tableList6_1.push(object)
                })

                this.setState({isFirst:false,spin:false,list1_1,list2_1,tableList3_1,tableList4_1,tableList5_1,tableList6_1,lastData:{...data,month:new Date().getMonth()+1}
                })
                
            }else{
              this.setState({isFirst:true})
            }
        })
    }

	// 审核
	examinePass = () => {
		postService("/workReport/infoSubmit/audit",{id: this.state.id,status:'3'},res => {
			if (res && res.flag) {
				message.success("操作成功！");
				history.back()
			} else {
				message.error(res.msg);
			}
		}
		);
	};
	examineFail = () => {
    let body = {
      id: this.state.id,
      status:'4',
      notPassReason:this.state.reason
    };
		postService("/workReport/infoSubmit/audit",body,res => {
			if (res && res.flag) {
				message.success("操作成功！");
				location.hash = "/InformationExamine";
			} else {
				message.error(res.msg);
			}
		}
		);
	};
    render(){
        const {allData,list1,list2,tableList3,tableList4,tableList5,tableList6} = this.state;
        const {lastData,list1_1,list2_1,tableList3_1,tableList4_1,tableList5_1,tableList6_1,isFirst} = this.state;
        const compareData = (nowData,preData) => {
            if(preData !== nowData&&!isFirst){
                return(
                    <Tooltip placement="top" title={<div>上次有效数据：<br/>{preData||"无"}</div>}>
                            <span style={{color:'red',cursor:'pointer'}}>{nowData}</span>
                    </Tooltip>
                )
            }else{
                return nowData
            }
        }
        const compareAppData = (nowData,preList) => {
          if(!isFirst){
            let preItem = preList.filter((item)=>{return item.orderNum === nowData.orderNum})
            console.log(preItem)
            if(preItem.length&&preItem[0].finishTime!==nowData.finishTime){
                return(
                  <Tooltip placement="top" title={<div>上次有效数据：<br/>无</div>}>
                          <span style={{color:'red',cursor:'pointer'}}>{nowData.finishTime}</span>
                  </Tooltip>
                )
            }else{
              return nowData.finishTime;
            }

          }else{
            return nowData.finishTime;
          }
        }
        const mainNode = () => {
            return (
              <div className="tableItem">
                {timeDetailList.map((item, n) => (
                  <table key={n}>
                    <thead>
                      <tr>
                        {item.map((data, j) => (
                          <th key={j}>{data.lable}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {item.map((data, k) => (
                          <td key={k}>{compareData(allData[data.key],lastData[data.key])||'无'} ~ {compareData(allData[data.key2],lastData[data.key2])||'无'}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                ))}
              </div>
            );
        };
        const capital = () => {
            return (
              <table className="capitalTable">
                <thead>
                  <tr>
                    <th colSpan="2">年度计划投资到位</th>
                    <th colSpan="2">年度计划投资完成</th>
                    <th colSpan="2">年度计划投资拨付</th>
                    <th colSpan="2">投资调整</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>日期</th>
                    <th>金额（万元）</th>
                    <th>日期</th>
                    <th>金额（万元）</th>
                    <th>日期</th>
                    <th>金额（万元）</th>
                    <td colSpan="2" rowSpan='2' style={{textAlign:'left'}}>{compareData(allData.adjustInfo,lastData.adjustInfo)||'　'}</td>
                  </tr>
                  <tr>
                    <td>{allData.curInvestmentPlaceTime||'　'}</td>
                    <td>{allData.curInvestmentPlaceMoney||'　'}</td>
                    <td>{allData.curInvestmentPlanTime||'　'}</td>
                    <td>{allData.curInvestmentPlanMoney||'　'}</td>
                    <td>{allData.curInvestmentPayTime||'　'}</td>
                    <td>{allData.curInvestmentPayMoney||'　'}</td>
                  </tr>
                </tbody>
              </table>
            );
        };
        const reformTbale = () => {
            return (
              <table className="reformTbale">
                <thead>
                  <tr>
                    <th colSpan="2">{allData.month}月适配改造的涉密系统名称</th>
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
                        {/* <td>{compareAppData(item,list1_1)}</td> */}
                      </tr>
                    )):<tr><td colSpan={4}><img src={empty} alt=''/></td></tr>
                  }
                </tbody>
                <thead>
                  <tr>
                    <th colSpan="2">{allData.month}月适配改造的非涉密系统名称</th>
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
                        {/* <td>{compareAppData(item,list2_1)}</td> */}
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
							<td>{compareData(allData.addInvestmentMoney,lastData.addInvestmentMoney)||'　'}</td>
							<td>{compareData(allData.addTerminalsNum,lastData.addTerminalsNum)||'　'}</td>
							<td>{compareData(allData.addServersNum,lastData.addServersNum)||'　'}</td>
						</tr>
						<tr>
							<td>台账预算外投资经费(万元)</td>
							<td>台账外新增终端数量(台)</td>
							<td>台账外新增服务器数量(台)</td>
						</tr>
						<tr>
							<td>{compareData(allData.ebInvestmentMoney,lastData.ebInvestmentMoney)||'　'}</td>
							<td>{compareData(allData.ebTerminalsNum,lastData.ebTerminalsNum)||'　'}</td>
							<td>{compareData(allData.ebServersNum,lastData.ebServersNum)||'　'}</td>
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
							<td colSpan='2'>非涉密领域(台)</td>
						</tr>
						<tr>
							<td style={{textAlign:'left',verticalAlign:'top'}}>{compareData(allData.isSmSuggestion,lastData.isSmSuggestion)||'　'}</td>
							<td style={{textAlign:'left',verticalAlign:'top'}} colSpan='2'>{compareData(allData.notSmSuggestion,lastData.notSmSuggestion)||'　'}</td>
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
							<td>{compareData(allData.contactName,lastData.contactName)||'　'}</td>
							<td>{compareData(allData.officePhone,lastData.officePhone)||'　'}</td>
							<td>{compareData(allData.contactPhone,lastData.contactPhone)||'　'}</td>
						</tr>
					</tbody>
				</table>
            </div>
          )
        }
        
        return(
            <Spin spinning={this.state.spin}>
                <div className='InformationExamineDetail2'>
                    <header id='header'>
                        <div className='header-item'>填报单位：{allData.createUnitName}</div>
                        <div className='header-item'>填报人：{allData.createUserName}</div>
                        <div className='header-item'>时间：{allData.createTime&&allData.createTime.substring(0,10)}</div>
                        <div className='header-item'>
                            <Popconfirm title="确定通过吗?" placement="bottom" onConfirm={()=>this.examinePass()}>
                              <Button type='primary'>通过</Button>　
                            </Popconfirm>
                            <Button type='default' onClick={()=>this.setState({reasonModal:true})}>不通过</Button>
                        </div>
                    </header>
                    <div id='empty'></div>
                    <div className='step-name'>
                        <span>一、项目推进主要进度节点</span>　
                        <Tooltip placement="right"  title={'说明：已完成的工作在对应进度下选择完成日期，未完成的可不填写'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    {
                        mainNode()
                    }
                    <div className='step-name'>
                        <span>二、项目资金使用情况</span>　
                        <Tooltip placement="right" title={'说明：计划投资完成指完成项目采购签订合同，计划投资拨付指向工程承建、监理等单位拨付款项，如分批次付款，以最后一次为准。如有调整请写明调整事项、时间、设计金额和履行的程序。'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    <div className='totalWeek'>
                        <span>统计周期：</span><span>{compareData(allData.curReportStartTime,lastData.curReportStartTime)||'无'}</span> ~ <span>{compareData(allData.curReportEndTime,lastData.curReportEndTime)||'无'}</span>
                    </div>
                    {
                        capital()
                    }
                    
                    <div className='step-name'>
                        <span>三、应用系统改造情况</span>　
                        <Tooltip placement="right" title={'说明：涉密系统点击“新增涉密系统改造”，非涉密系统点击“新增涉密系统改造”，来分别填写本次采购项目涉及到的应用系统适配改造情况，如果没有则不填'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    <div className='totalWeek'>
                        <span>统计周期：</span><span>{compareData(allData.appReportStartTime,lastData.appReportStartTime)||'无'}</span> ~ <span>{compareData(allData.appReportEndTime,lastData.appReportEndTime)||'无'}</span>
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
                    <div className='totalWeek'>
                        <span>统计周期：</span><span>{compareData(allData.devReportStartTime,lastData.devReportStartTime)||'无'}</span> ~ <span>{compareData(allData.devReportEndTime,lastData.devReportEndTime)||'无'}</span>
                    </div>
                    <Row style={{padding:'10px 0px'}}>
                        <div className='row-div-title'>{allData.month}月涉密领域部署情况</div>
                        {
                            deplayTable()
                        }
                        <div className='row-div-title'>{allData.month}月非涉密领域部署情况</div>
                        {
                            deplayTable2()
                        }
                    </Row>
                    <div className='step-name'>
                        <span>五、重要事项</span>　
                        <Tooltip placement="right" title={'说明：主要填写领导批示、好的经验做法等，以及推进工作中遇到的重要情况.'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    <div className='importantItem'>{compareData(allData.importantItem,lastData.importantItem)}</div>
                    <div className='step-name'>
                        <span>六、备注</span>　
                    </div>
                    {
                      	remarksTable()
                    }
                    <div className='step-name'>
                        <span>七、问题和建议</span>　
                        <Tooltip placement="right" title={'说明：请填写推进工作中遇到的主要困难和问题，包括出现问题的产品、生产厂商等，以及对全面替代工作的意见建议.'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    {
                      	problemTable()
                    }
					<Modal
						title='不通过原因'
						visible={this.state.reasonModal}
						destroyOnClose={true}
						afterClose={()=>this.setState({reasonModal:false})}
						onCancel={()=>this.setState({reasonModal:false})}
						onOk={this.examineFail}
					>
						<TextArea rows={4} onChange={e=>this.setState({reason:e.target.value})}/>
					</Modal>
                </div>
            </Spin>
        )
    }
}





