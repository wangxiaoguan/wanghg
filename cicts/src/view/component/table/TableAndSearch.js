import React,{ Component } from 'react';
import { Form, Table, Row, Col, Select, Button, Input, DatePicker, message,Message, Popconfirm, Upload, Cascader, Spin,InputNumber } from 'antd';
// import zhCN from 'antd/lib/locale-provider/zh_CN';
import {connect} from 'react-redux';
import { BEGIN, getDataSource, getPageData, getSelectRows } from '../../../redux-root/action/table/table';
import './TableStyle.less';
import { arrayToString } from '../tools';
import API_PREFIX from '../.././content/apiprefix';
import { illegalInput } from '../../../utils/checkForm';
import {postService,exportExcelService,exportExcelService1,deleteService,GetQueryString, getService} from '../.././content/myFetch';
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    selectRowsData:state.table.selectRowsData
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    getPageData:n=>dispatch(getPageData(n)),
    retSetData: n=>dispatch(getDataSource(n)),
    getSelectRowData: n => dispatch(getSelectRows(n)),
  })
)
@Form.create()
export default class TableAndSearch extends Component {
  constructor(props) {
    sessionStorage.setItem('InitializationTime',0);
    super(props);
    this.state = {
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
      queryFilter: {},
      query: this.props.urlfilter?this.props.urlfilter:'',
      dataSource:this.props.dataSource,
      selectedRowKeys: [],
      selectedRows:[],
      fieldsValue:{},
      dataSourceUpdate:false,
      visible:false,
      visibleFrozenBtn:false,
      onLinevisible:false,
      offLinevisible:false,
      PointStatus:0,//积分明细里面时间组件是否触发状态判断xwx2019/1/5
      InitializationTime:sessionStorage.getItem('InitializationTime'),//积分明细里面对初始化进入直接点击查询的判断xwx2019/1/7
      reportExcel: false,//设置导出按钮点击后置灰，导出后恢复正常
      isback:GetQueryString(location.hash, ['bcak']).bcak || '',
      postBack:GetQueryString(location.hash, ['postId']).postId || '',
      selected:"",
      arrlenth:0,
      orgIdDisplay:true,
      moreSearchFlag: false, //控制是否显示更多的查询条件
    };
    if (props.tsRef) {
      props.tsRef(this);
    }
  }
  componentWillUnmount(){
      this.getPageData(1, 10, '');
      this.props.retSetData({ root: { list: [] } });
      this.props.getSelectRowData([]);   
  }
  componentDidUpdate(nextProps, nextState){
    if(nextProps.pageData.currentPage!==this.state.currentPage){
      this.setState({currentPage:nextProps.pageData.currentPage})
    }else{
   
    }
    if(localStorage.getItem('selectedRowKeys')){
      let arrlenth= localStorage.getItem('selectedRowKeys').split(",");
      if (this.state.dataSourceUpdate&&this.props.dataSource.root) {
        this.setState({currentPage:this.props.dataSource.root.page,totalNum: this.props.dataSource.root.totalNum, dataSourceUpdate:false,arrlenth:arrlenth,selectedRowKeys:localStorage.getItem('selectedRowKeys')});
      }
    }else{
    if (this.state.dataSourceUpdate&&this.props.dataSource.root) {
      if(sessionStorage.getItem('tradeM')==1){
        this.setState({currentPage:this.props.dataSource.root.page, totalNum: this.props.dataSource.root.totalNum, dataSourceUpdate:false,currentPage:1,selectedRowKeys:localStorage.getItem('selectedRowKeys')});
      }else{
        this.setState({currentPage:this.props.dataSource.root.page, totalNum: this.props.dataSource.root.totalNum, dataSourceUpdate:false,selectedRowKeys:localStorage.getItem('selectedRowKeys')});
      }
    }
  }}



  componentDidMount() {
    if(this.props.type==='platformPointDetail'){//平台积分明细                
      let startValue = moment().subtract(30, 'days').format('YYYY-MM-DD 00:00:00');//默认开始值
      let endValue = moment(new Date(), 'YYYY-MM').format('YYYY-MM-DD 23:59:59');//默认结束值
      let queryTime = `Q=createdate_D_GE=${startValue}&Q=createdate_D_LE=${endValue}`;
      this.getPageData(1, 10, queryTime);
      this.props.retSetData({ root: { list: [] } });
      this.setState({
        query:queryTime,
      });

      this.getData(`${this.props.url}/1/10?${queryTime}`);
      this.getPageData(1,10,queryTime);

    }else{
      this.getPageData(1, 10, '');
      this.props.retSetData({ root: { list: [] } });
      if(this.props.query){
        this.setState({
          query:this.props.query,
        },() => {
          this.getData(`${this.props.url}/1/10?${this.state.query}`);
          this.getPageData(1,10,this.state.query);
        });
      }else{
       if(this.props.type==="EventManagementQues" ){
        this.getData(`${this.props.url}?${this.state.query}`);
        this.getPageData(1,10,this.state.query);
       }else{
        if(this.props.type === 'special'){
          this.getData(`${this.props.url}/1/10?${this.state.query}`);
        }else if(this.props.type === 'article'){
          this.getData(`${this.props.url}/1/10/${this.props.reorder}?${this.state.query}`);
        }else{
          this.getData(`${this.props.url}/1/10?${this.state.query}`);
        }
        this.getPageData(1,10,this.state.query);
       }
       
      }
    }
      

  }

  getPageData(currentPage,pageSize,query){
    let data = {currentPage,pageSize,query}; 
    this.props.getPageData(data);
  }
  getData = async(url) => {
    await this.props.getData(API_PREFIX + `${url}`);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.dataSource !== prevState.dataSource) {
      return { dataSource: nextProps.dataSource,dataSourceUpdate:true}; 
    }
    if(nextProps.code == 'columnTree' && nextProps.pageData.currentPage != prevState.currentPage) { // yelu 2019-01-02 取缓存里面保存的页码值
      return {currentPage: nextProps.pageData.currentPage};
    }
    return null;
  }

  onPageChange = (currentPage, pageSize) => {
    localStorage.setItem('selectedRowKeys','');
    this.props.retSetData({ root: { list: [] } });
    this.getPageData(currentPage,pageSize,this.state.query);
    this.setState({ currentPage, pageSize });
    if(this.props.code == 'columnTree') { // yelu 2019-01-02 修改选择人员查询后分页后不带查询条件
      this.getData(`${this.props.url}/${currentPage}/${pageSize}?${this.props.urlfilter}`);
    }else if(this.props.type === 'article'){
      this.getData(`${this.props.url}/${currentPage}/${pageSize}/${this.props.reorder}?${this.state.query}`);
    }else{
      this.getData(
        `${this.props.url}/${currentPage}/${pageSize}?${this.state.query}`
      );
    }
  };
  onPageSizeChange = (currentPage, pageSize) => {
    localStorage.setItem('selectedRowKeys','');
    this.props.retSetData({ root: { list: [] } });
    this.getPageData(currentPage,pageSize,this.state.query);
    this.setState({ currentPage, pageSize });
    if(this.props.code == 'columnTree') { // yelu 2019-01-02 修改选择人员查询后分页后不带查询条件
      this.getData(`${this.props.url}/${currentPage}/${pageSize}?${this.props.urlfilter}`);
    }else if(this.props.type === 'article'){
      this.getData(`${this.props.url}/${currentPage}/${pageSize}/${this.props.reorder}?${this.state.query}`);
    }else{
      this.getData(
        `${this.props.url}/${currentPage}/${pageSize}?${this.state.query}`
      );
    } 
  };

  handleChange(value, key, qFilter, type, startTime, endTime) {
    if(typeof(value)=='string'&&type=="input"){
      value=encodeURIComponent(value);
    }
    console.log('哈哈哈哈哈哈哈哈哈哈哈', value)
    const { queryFilter } = this.state;
    if (key ==='categoryId') {
      let tempValue = '';
      tempValue = value[value.length - 1]||'';
      queryFilter[key] = `${qFilter}=${tempValue}`;
    }else if (type === 'rangePicker') {
      queryFilter[key] = value.length != 0 ? `Q=startTime=${value[0].format('YYYY-MM-DD 00:00:00')}&Q=endTime=${value[1].format('YYYY-MM-DD 23:59:59')}` : '';
      // if(value.length != 0) {
      //   if(startTime&&endTime){
      //     queryFilter[key] = `Q=${startTime}=${value[0].format('YYYY-MM-DD 00:00:00')}&Q=${endTime}=${value[1].format('YYYY-MM-DD 23:59:59')}`;
      //   }
      // } else{
      //   queryFilter[key] = '';
      // }
    }else if(key ==='tenantId' &&  type==='company'){
      let tenantId = window.sessionStorage.getItem("tenantId");
      if(value==tenantId){
       this.setState({
         orgIdDisplay:false,
       });
       if(key ==='orgId'){
        let tempValue = '';
        tempValue = value[value.length - 1]||'';//传给后台最后选择的id
        // tempValue = value||'';//传给后台所有的id
        queryFilter[key] =`${tempValue}`? `${qFilter}=${tempValue}`:'';
      }
      }else{
        this.setState({
          orgIdDisplay:true,
        });
      }
      let tempValue = '';
      tempValue = value[value.length - 1]||'';
      queryFilter[key] = `${qFilter}=${tempValue}`;
    }else if(key ==='orgId'){
      let tempValue = '';
      tempValue = value[value.length - 1]||'';//传给后台最后选择的id
      // tempValue = value||'';//传给后台所有的id
      queryFilter[key] =`${tempValue}`? `${qFilter}=${tempValue}`:'';
    }else if(type === 'platformPointrangePicker'){//积分明细时间组件
      this.setState({PointStatus:1});//触发积分时间组件就改变状态
      if(value.length != 0) {
        queryFilter[key] = `Q=${key}_D_GE=${value[0].format('YYYY-MM-DD 00:00:00')}&Q=${key}_D_LE=${value[1].format('YYYY-MM-DD 23:59:59')}`;
      } else{
        queryFilter[key] = '';
      }
    }else if(this.props.styleType === 'PartyMembers' && key === 'partyId') {
      if(value.length) {
        queryFilter[key] = `${qFilter}=${value[value.length - 1]}`;
      }
    } else if (key === 'address') {
      let tempValue = value.join('>') || ''
      queryFilter[key] = tempValue ? `${qFilter}=${tempValue}`:'';
    }
    else {
      // queryFilter[key] = `${qFilter}=${value}`;//对拼接字段是否有值做一个判断xwx/2018/12/12
      if(this.props.ConfigGrade){
        // if(value.indexOf("%")>0){
        //   value=encodeURIComponent(value)
        // }else if(value.indexOf("#")>0){
        //   value=encodeURIComponent(value)
        // }else if(value.indexOf("&")>0){
        //   value=encodeURIComponent(value)
        // }else{
          value=encodeURIComponent(value);
        // }
      }
      // queryFilter[key]=`${value}`?`${qFilter}=${value}`:'';
      queryFilter[key]=value || value === 0?`${qFilter}=${value}`:'';
    }
    if(queryFilter.isHomePage){
      let isHomePage=queryFilter.isHomePage;
      let index=isHomePage.substring(13,18);
      if(index==='false'){
        queryFilter.isHomePage=isHomePage.substring(0,13)+"0";
      }else if(index==='true'){
        queryFilter.isHomePage=isHomePage.substring(0,13)+"1";
      }
    }
    if(queryFilter.isPush){
      let isPush=queryFilter.isPush;
      let index=isPush.substring(9,14);
      if(index==='false'){
        queryFilter.isPush=isPush.substring(0,9)+"0";
      }else if(index==='true'){
        queryFilter.isPush=isPush.substring(0,9)+"1";
      }
    }
    if(key=="tenantId"&&type=="company"){
      delete queryFilter.orgId
    }

    this.setState({ queryFilter });
  }

  handleSubmit = e => {
    localStorage.setItem("selectedRowKeys", '');
    const { currentPage, pageSize}=this.state;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        // fieldsValue['createDate'][0] = moment('00:00:00', 'HH:mm:ss');
        // fieldsValue['createDate'][1] = moment('23:59:59', 'HH:mm:ss');
        // if(fieldsValue['createDate']){
        //   fieldsValue['createDate'][0] = moment('00:00:00', 'HH:mm:ss');
        //   fieldsValue['createDate'][1] = moment('23:59:59', 'HH:mm:ss');
        // }
        this.props.retSetData({ root: { list: [] } });
        fieldsValue['organizationId'] = fieldsValue['organizationId']?eval(fieldsValue['organizationId']):'';
        fieldsValue['categoryId'] = fieldsValue['categoryId']?arrayToString(fieldsValue['categoryId']):'';
        this.setState({
          fieldsValue:fieldsValue,
        });
        let query = '';
        Object.values(this.state.queryFilter).map(item => {
          if(item){//对item为空时做一个判断
            if (query === '') {
              query =  item;
            } else {
              query = query + '&' + item;
            }
          }
        });

        if(this.props.special){
          if (query==='') {
            query =this.props.findData?this.props.special+"&Q=sort="+this.props.findData:this.props.special;
          }else{
            query =this.props.findData?query+'&'+this.props.special+"&Q=sort="+this.props.findData:query+'&'+this.props.special;
          }
        }
        if (this.props.urlfilter) {
          if (query === '') {       
            query =this.props.findData?this.props.urlfilter+"&Q=sort="+this.props.findData:this.props.urlfilter;
          } else {
            query =this.props.findData?query+'&'+this.props.urlfilter+"&Q=sort="+this.props.findData:query+'&'+this.props.urlfilter;
            // query = query + '&' + this.props.urlfilter;
          }
        }
          query=query.replace(/\+/g,'%2B');
        if(this.props.type==='platformPointDetail'){//积分明细里面
          let startValue = moment().subtract(30, 'days').format('YYYY-MM-DD 00:00:00');//默认开始值
          let endValue = moment(new Date(), 'YYYY-MM').format('YYYY-MM-DD 23:59:59');//默认结束值
          let queryTime = `Q=createdate_D_GE=${startValue}&Q=createdate_D_LE=${endValue}`;
          if(query===''){//当不输入任何查询条件时，默认只传最近一个月的时间
            sessionStorage.setItem('InitializationTime',1);//初始化进入时，为空的状态判断
            query=queryTime;
          }
          if(this.state.PointStatus===0){//不触发时间组件时，默认传最近一个月拼接在条件后面
            if(query){
              if(sessionStorage.getItem('InitializationTime')==='0'){
                query=query+`&${queryTime}`;
              }else{
                sessionStorage.setItem('InitializationTime',0);
                query=queryTime;
              }
            }
            
          }
        }
        this.setState({ query },() => {
          if(this.props.type === 'special'){
            this.getData(`${this.props.url}/1/10?${this.state.query}`);
          }else if(this.props.type === 'article'){
            this.getData(`${this.props.url}/1/10/${this.props.reorder}?${this.state.query}`);
          }else{
            this.getData(`${this.props.url}/1/${this.state.pageSize}?${query}`);
          }
          //查询重置
          this.setState({
            currentPage:1,
          },() => {
            this.getPageData(this.state.currentPage,pageSize,query);
          });
        });
        
      }
    });
  };
  custom = (selectedRowKeys)=>{
    this.props.customBtn.onClick(selectedRowKeys);
  }

  add=(selectedRowKeys)=>{
    if (this.props.addBtn.url) {
      location.hash = this.props.addBtn.url;
    }else if (this.props.addBtn.OnEvent) {
      this.props.addBtn.OnEvent();
    }else if(this.props.addBtn.addUser){
      this.props.addBtn.addUser(this.props.groupId,this.state.selectedRowKeys);
      location.hash = this.props.goBack.url;
    }
  }
  
  addCopy=(selectedRowKeys) => {
    if (this.props.optionalBtn.url) {
      location.hash = this.props.optionalBtn.url;
    }else if (this.props.optionalBtn.OnEvent) {
      this.props.optionalBtn.OnEvent();
    }else if(this.props.optionalBtn.addUser){
      this.props.optionalBtn.addUser(this.props.groupId,this.state.selectedRowKeys);
      if(this.props.type!='VirtualGroupNumber'){
        location.hash = this.props.goBack.url;
      }
    }else if(this.props.offLine){
      this.deleteData();
    }
  }
  addCopy1=(selectedRowKeys) => {
    if(this.props.offLine){
      this.deleteData();
    }
  }
  addCopy3=(selectedRowKeys) => {
    if (this.props.optionalBtn2.OnEvent) {
      this.props.optionalBtn2.OnEvent();
    }
  }
  goBackBtn = () => {
    if(this.props.goBackBtn.url!=''){
      location.hash = this.props.goBackBtn.url;
    }else{
      history.back();
    }
  }
  deleteData = (url = this.props.delUrl,field='ids',special) => {
    
    if (this.props.deleteBtn&&this.props.deleteBtn.type == 'suggestion') {
      deleteService(
        API_PREFIX + url + `${this.state.selectedRowKeys}`,
        data => {
          if (data.status === 1) {
              message.success('删除成功!');
            this.setState({
              selectedRowKeys:[],
            });
            this.setState({
              currentPage:1,
              visible:false,
            },() => {
              this.getData(
                `${this.props.url}/1/${
                  this.state.pageSize
                  }?${this.state.query}`
              );
            });
          } else {
            this.setState({visible:false});
            message.error(data.errorMsg);
          }
        }
      );  
    } else {


      if(special){
        special.idList = this.state.selectedRowKeys;
      }
      // let body = special?special:{ [field]: this.state.selectedRowKeys };
      let body;
      if(special){
        body=special;
      }else if( this.props.type==="PopularWords"||this.props.type==="ContentManagementContent" || this.props.type==="CarouselCarousel"||this.props.type==="VersionInformation" || this.props.type==="HomeLayoutTag" ){
        body=this.state.selectedRowKeys;
      }else  if(!this.props.deleteBtn.field){
        body=this.state.selectedRowKeys;
      }else{
        body={ [field]: this.state.selectedRowKeys };
      }
      if(this.props.type=='virtualGroupDel'){//群成员管理删除时，传递的参数xwx2019/3/12
         body=this.state.selectedRowKeys;
      }

      // /////这里加的是删除活动的的数据鉴权   请不要删除，记得复原下面加大括号（0902wgs）
      if(this.props.deleteBtn&&this.props.deleteBtn.type === 'authentication'){
        // let value = {
        //   dataId: body,
        //   dataType: 2,
        // };
  

        postService(
          API_PREFIX + `${this.props.deleteBtn.authUrl}`,
          body,
          data => {
            if (data.status === 1) {

              postService(
                API_PREFIX + `${url}`,
                body,
                data => {
                  if (data.status === 1) {
                    
                      message.success('删除成功!');
                      localStorage.setItem("selectedRowKeys",'');
  
                    this.setState({
                      selectedRowKeys:[],
                      visible:false,
                      visibleFrozenBtn:false,
        
                    });
                    this.setState({
                      currentPage:1,
                    },() => {
                      this.getData(
                        `${this.props.url}/1/${
                          this.state.pageSize
                          }?${this.state.query}`
                      );
                    });
        
                  } else {
                    message.error(data.errorMsg);
                  }
                }
              );

            } else {
              message.error(data.errorMsg);
            }
          }
        );

      }else{

        postService(
          API_PREFIX + `${url}`,
          body,
          data => {
            if (data.status === 1) {
              localStorage.setItem('selectedRowKeys','');
              if(this.props.tip){
                message.success('从首页下线成功!');
              }else if(this.props.code == 'frozenBtn') {
                message.success('操作成功!');
              }else {
                message.success('删除成功!');
                if(this.props.deleteBtn.delAuthUser) {
                  this.props.deleteBtn.delAuthUser(this.state.selectedRows)
                }
                localStorage.setItem("selectedRowKeys",'');
              }
              this.setState({
                selectedRowKeys:[],
                visible:false,
                visibleFrozenBtn:false,
  
              });
              this.setState({
                currentPage:1,
              },() => {
                if(this.props.type === 'special'){
                  this.getData(`${this.props.url}/1/10?${this.state.query}`);
                }else if(this.props.type === 'article'){
                  this.getData(`${this.props.url}/1/10/${this.props.reorder}?${this.state.query}`);
                }else{
                  // this.getData(`${this.props.url}/${this.state.currentPage}/${this.state.pageSize}?${this.state.query}`);
                  this.getData(`${this.props.url}/1/${this.props.pageData.pageSize}?${this.state.query}`);
                }
              });
  
            } else {
              message.error(data.errorMsg);
              this.setState({
                selectedRowKeys:[],
                visible:false,
                visibleFrozenBtn:false,
              });
            }
          }
        );
       
       }  //////这是上面注释掉的

    }

  }
  exportData = (body) => {
    if(this.props.exportBtn.type == 'virtualGroup'){
      let mobile = '';
      let email = '';
      let name = '';
      if(this.state.fieldsValue == undefined){
        mobile = '';
        email = '';
        name = '';
      }else{
        if(this.state.fieldsValue.mobile){
            mobile = '&Q=mobile=' + `${this.state.fieldsValue.mobile}`;
        }else{
            mobile = '';
        }
        if(this.state.fieldsValue.email){
          email = '&Q=email=' + `${this.state.fieldsValue.email}`;
        }else{
          email = '';
        }
        if(this.state.fieldsValue.name){
            name = '&Q=name=' + `${this.state.fieldsValue.name}`;
        }else{
            name = '';
        }
      }
      let path = API_PREFIX + this.props.exportBtn.url+ `Q=groupId=${this.props.groupId}` + mobile + email + name;
      exportExcelService(path,"",'群成员信息'); 
    } else if (this.props.exportBtn.type == 'suggestions') {
      let query = '';
      Object.values(this.state.queryFilter).map(item => {
        if (query === '') {
          query =  item;
        } else {
          query = query + '&' + item;
        }
      });
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${query}`;
      exportExcelService1(path,'建言管理');
    } else if (this.props.exportBtn.type === '会员管理') {
      // 会员管理列表的导出 用get
      exportExcelService1(API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`, '会员管理');
    }else if(this.props.exportBtn.type==='生日劵积分变更'){//生日劵积分变更记录导出xwx2019/1/2
      this.setState({reportExcel: true});//点击后置灰
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'生日劵积分变更记录导出').then(data=>{
        this.setState({reportExcel:data});
      }); 
    }else if(this.props.exportBtn.type==='党员荣誉积分变更'){
      this.setState({reportExcel: true});//点击后置灰
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'党员荣誉积分变更记录导出').then(data=>{
        this.setState({reportExcel:data});
      }); 
    }else if(this.props.exportBtn.type==='通用积分变更'){
      this.setState({reportExcel: true});//点击后置灰
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'通用积分变更记录导出').then(data=>{
        this.setState({reportExcel:data});
      }); 
    }else if(this.props.exportBtn.type==='过节物资积分变更'){
      this.setState({reportExcel: true});//点击后置灰
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'过节物资积分变更记录导出').then(data=>{
        this.setState({reportExcel:data});
      }); 
    }else if(this.props.exportBtn.type==='电影票积分变更'){
      this.setState({reportExcel: true});//点击后置灰
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'电影票积分变更记录导出').then(data=>{
        this.setState({reportExcel:data});
      }); 
    }else if(this.props.exportBtn.type==='企业用户'){
      this.setState({reportExcel: true});//点击后置灰
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'企业用户').then(data=>{
        this.setState({reportExcel:data});
      });
    }else if(this.props.exportBtn.type==='文章'){
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'文章').then(data=>{
        this.setState({reportExcel:data});
      });
    }else if(this.props.exportBtn.type==='视频'){
      let path = API_PREFIX + this.props.exportBtn.url + '&' + `${this.state.query}`;
      exportExcelService1(path,'视频').then(data=>{
        this.setState({reportExcel:data});
      });
    }else if(this.props.exportBtn.type==='tradeLetter'){//主席信箱、困难帮扶、维权管理
      let path = API_PREFIX + this.props.exportBtn.exportBtnProps.url + '?' + `${this.state.query}`;
      exportExcelService1(path,this.props.exportBtn.exportBtnProps.type).then(data=>{
        this.setState({reportExcel:data});
      });
    }else if(this.props.exportBtn.type==='报名信息'){
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'报名信息').then(data=>{
        this.setState({reportExcel:data});
      });
    }
    else if(this.props.exportBtn.type==='参与列表'){
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'参与列表').then(data=>{
        this.setState({reportExcel:data});
      });
    }
    else if(this.props.exportBtn.type==='浏览列表'){
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'浏览列表').then(data=>{
        this.setState({reportExcel:data});
      });
    }
    else if(this.props.exportBtn.type==='点赞列表'){
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'点赞列表').then(data=>{
        this.setState({reportExcel:data});
      });
    }
    else if(this.props.exportBtn.type==='活动列表'){
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'活动列表').then(data=>{
        this.setState({reportExcel:data});
      });
    }
    else if(this.props.exportBtn.type==='考试成绩'){
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'考试成绩').then(data=>{
        this.setState({reportExcel:data});
      });
    }
    else if(this.props.exportBtn.type==='问卷信息'){
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'问卷信息').then(data=>{
        this.setState({reportExcel:data});
      });
    }
    else if(this.props.exportBtn.type==='投票信息'){
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'投票信息').then(data=>{
        this.setState({reportExcel:data});
      });
    }
    else if(this.props.exportBtn.type==='评论列表'){
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'评论列表').then(data=>{
        this.setState({reportExcel:data});
      });
    }else if(this.props.exportBtn.type==='资讯评论列表'){
      let query = this.state.query?`&${this.state.query}`:''
      let path = API_PREFIX + this.props.exportBtn.url + '?' + this.props.exportBtn.id + query;
      exportExcelService1(path,'评论列表').then(data=>{
        this.setState({reportExcel:data});
      });
    }else if(this.props.exportBtn.request === 'get') {
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,this.props.exportBtn.type).then(data=>{
        this.setState({reportExcel:data});
      });
    }else if(this.props.exportBtn.type==='订购信息'){
      let query = this.state.query?`${this.state.query}`:''
      let path = API_PREFIX + this.props.exportBtn.url + '?' + query;
      exportExcelService1(path,'订购信息').then(data=>{
        this.setState({reportExcel:data});
      });
    }else{
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService(path,body,this.props.exportBtn.type); 
    }
  }

  offBarLine=(selectedRowKeys,url)=>{
    let body =selectedRowKeys;
    this.setState({ onLinevisible: false,offLinevisible:false });
    postService(API_PREFIX + url, body, data => {
      if (data.status === 1) {
        message.success('操作成功');
        this.setState({selectedRowKeys:[]});
        this.getData(`${this.props.url}/${this.state.currentPage}/${this.state.pageSize}?${this.state.query}`)
      }else{
        message.error(data.errorMsg)
      }
    })
  }

  offLine=(selectedRowKeys,url)=>{
    this.setState({onLinevisible:false});
    let body =selectedRowKeys;
    let value = {
        dataId: selectedRowKeys,
        dataType: 2,
      };

      /////上线，下线数据鉴权。。。。
      let onlineAuthUrl=`services/web/auth/authdata/addAuthDataToRedis`;
      let offlineAuthUrl=`services/web/auth/authdata/delAuthDataFromRedis`;
      if(this.props.offOrOnLineBtn.typeLine&&this.props.offOrOnLineBtn.typeLine==='上线'){
        postService(API_PREFIX + onlineAuthUrl, value, data => {
          if(data.status === 1){
            postService(API_PREFIX + url, body, data => {
             
              if (data.status === 1) {
                // if(this.props.offOrOnLineBtn.typeLine&&this.props.offOrOnLineBtn.typeLine==='上线'){
                //   if(JSON.stringify(data.root)==='{}' || data.root.object!=0){
                //     message.success('操作成功');
                //     this.setState({selectedRowKeys:[]});
                //     // this.getData(`${this.props.url}/1/10?${this.state.query}`);//xwx2019/1/12注释
                //     this.getData(`${this.props.url}/${this.state.currentPage}/${this.state.pageSize}?${this.state.query}`);//解决上线分页问题xwx2019/1/12
                //   }else if(data.retMsg=='操作成功'){
                //     message.success('操作成功');
                //     this.setState({selectedRowKeys:[]});
                //     this.getData(`${this.props.url}/${this.state.currentPage}/${this.state.pageSize}?${this.state.query}`);//解决上线分页问题xwx2019/1/12
                //   }else{
                //     let nameList='';
                //     data.root.list.map(v=>{
                //       nameList+=v.name+",";
                //     });
                //     message.error(nameList+'不能发布，请完善相关设置信息');
                //   }
                // }else{
                //   message.success('操作成功');
                //   this.setState({selectedRowKeys:[]});
                //   this.getData(`${this.props.url}/${this.state.currentPage}/${this.state.pageSize}?${this.state.query}`);//解决下线分页问题xwx2019/1/12
                // }
                message.success('操作成功');
                this.setState({selectedRowKeys:[]});
                this.getData(`${this.props.url}/${this.state.currentPage}/${this.state.pageSize}?${this.state.query}`);//解决下线分页问题xwx2019/1/12
              } else {
                if(this.props.examinationType=="examinationOnline"){
                  message.error('请先设置考试题型');
                }else if(this.props.questionType=="questionOnline"){
                  message.error('请先设置问卷题目');
                }else if(this.props.voteType=="voteOnline"){
                  message.error('请先设置投票题目');
                }else if(this.props.orderType=="orderOnine"){
                  message.error('请先设置订购商品');
                } else {
                  message.error(data.errorMsg)
                }
                this.setState({selectedRowKeys:[]});
                this.getData(`${this.props.url}/${this.state.currentPage}/${this.state.pageSize}?${this.state.query}`);
              }
            });
          }
        });

      }else{
                   /////wgs 0923说是所有的活动下线都不调用这个接口 
        // postService(API_PREFIX + offlineAuthUrl, body, data => {
        //   if(data.status === 1){
            postService(API_PREFIX + url, body, data => {
              if (data.status === 1) {
                // if(this.props.offOrOnLineBtn.typeLine&&this.props.offOrOnLineBtn.typeLine==='上线'){
                //   if(JSON.stringify(data.root)==='{}' || data.root.object!=0){
                //     message.success('操作成功');
                //     this.setState({selectedRowKeys:[]});
                //     // this.getData(`${this.props.url}/1/10?${this.state.query}`);//xwx2019/1/12注释
                //     this.getData(`${this.props.url}/${this.state.currentPage}/${this.state.pageSize}?${this.state.query}`);//解决上线分页问题xwx2019/1/12
                //   }else if(data.retMsg=='操作成功'){
                //     message.success('操作成功');
                //     this.setState({selectedRowKeys:[]});
                //     this.getData(`${this.props.url}/${this.state.currentPage}/${this.state.pageSize}?${this.state.query}`);//解决上线分页问题xwx2019/1/12
                //   }else{
                //     let nameList='';
                //     data.root.list.map(v=>{
                //       nameList+=v.name+",";
                //     });
                //     message.error(nameList+'不能发布，请完善相关设置信息');
                //   }
                // }else{
                //   message.success('操作成功');
                //   this.setState({selectedRowKeys:[]});
                //   // this.getData(`${this.props.url}/1/10?${this.state.query}`);//xwx2019/1/12注释
                //   this.getData(`${this.props.url}/${this.state.currentPage}/${this.state.pageSize}?${this.state.query}`);//解决下线分页问题xwx2019/1/12
                // }
                message.success('操作成功');
                this.setState({selectedRowKeys:[]});
                this.getData(`${this.props.url}/${this.state.currentPage}/${this.state.pageSize}?${this.state.query}`);//解决下线分页问题xwx2019/1/12
              }else{
                if(this.props.examinationType=="examinationOnline"){
                  message.error('请先设置考试题型');
                }else if(this.props.questionType=="questionOnline"){
                  message.error('请先设置问卷题目');
                }else if(this.props.voteType=="voteOnline"){
                  message.error('请先设置投票题目');
                }else if(this.props.orderType=="orderOnine"){
                  message.error('请先设置订购商品');
                } else {
                  message.error(data.errorMsg)
                }
                this.setState({selectedRowKeys:[]});
                this.getData(`${this.props.url}/${this.state.currentPage}/${this.state.pageSize}?${this.state.query}`);
              }
            });
        //   }
        // });


      }
  }
  synchronizationUser = (url) => {
    getService(API_PREFIX + url, res => {
        if(res.retCode == 1) {
            postService(res.retMsg, '', data => {
                if(data.retCode == 1) {
                    message.success('同步成功');
                }else {
                    message.error('同步失败');
                }
            });
        }else {
            message.error('同步失败');
        }
    });
  }
  handleVisibleChange = () => {
    let {selectedRowKeys}=this.state;

    if (selectedRowKeys.length===0) {
      this.setState({
        visible:false,
      });
    }else{
      this.setState({
        visible:true,
      });
    }
  }

  handleVisibleChangeFrozenBtn=()=>{
    let {selectedRowKeys}=this.state;

    if (selectedRowKeys.length===0) {
      this.setState({
        visibleFrozenBtn:false,
      });
    }else{
      this.setState({
        visibleFrozenBtn:true,
      });
    }
  }

  Popcancel=()=>{
    this.setState({ visible: false });
  }

  PopcancelFrozenBtn=()=>{
    this.setState({ visibleFrozenBtn: false });
  }

  lineVisibleChange = () => {
    let {selectedRowKeys}=this.state;

    if (selectedRowKeys.length===0) {
      this.setState({
        onLinevisible:false,
      });
    }else{
      this.setState({
        onLinevisible:true,
      });
    }
  }
  offLineVisibleChange = () => {
    let {selectedRowKeys}=this.state;

    if (selectedRowKeys.length===0) {
      this.setState({
        offLinevisible:false,
      });
    }else{
      this.setState({
        offLinevisible:true,
      });
    }
  }
  offLineClick = () => {
      this.setState({ onLinevisible: false});
  }
  onLineClick = () => {
    this.setState({ offLinevisible: false});
}
  Linecancel=()=>{
    this.setState({ onLinevisible: false,offLinevisible:false });
  }
  render() {
    const refresh = this.getData;
    const url = this.props.url;
    const currentPage1 = this.state.currentPage;
    const pageSize1 = this.state.pageSize;
    const query = this.state.query;
    let uploadProps;

    //导入
    if(this.props.importBtn){
      uploadProps = {
        name: 'file',
        action: API_PREFIX + this.props.importBtn.url,
        /*'services/systemA/import/groupMember'+'?groupId='+`${this.props.groupId}`,*/
        accept: 'application/vnd.ms-excel',
        multiple: false,
        data: null,
        showUploadList: false,
        onChange(info) {
          if(info.file.response){
            if ( info.file.response.retCode == '1' ) {
              message.success( info.file.name + ' 上传成功。', 3 );
              refresh(`${url}/${currentPage1}/${pageSize1}?${query}`);
            } else if ( info.file.response.retCode == '0' ) {
              message.error(info.file.response.retMsg + '失败原因：' + info.file.response.root.list[0], 5 );
            }
          }

        },
      };
    }else{
      uploadProps={};
    }
    
    const { totalNum, pageSize ,selectedRowKeys} = this.state;
    let {currentPage}=this.state;
    const {
      columns,
      //dataSource,
      form: { getFieldDecorator },
      children,
    } = this.props;
    
    if(this.state.dataSource&&this.state.dataSource.root.page!==currentPage&&this.state.dataSource.root.page){
      currentPage=this.state.dataSource.root.page
    }

    /**
 * 待处理dataSource格式
 * totalNum
 * pagesize  完成
 * currentPage  完成
 */
    let data;
    let dataSource;
    dataSource = this.state.dataSource.root&&(this.state.dataSource.root.list||this.state.dataSource.root.object);    
    dataSource&&dataSource.map((item, index) => {
        item.sNum = index + 1 + (currentPage-1)*10;
    });

    if(this.props.typeId == 'Vote'){
      data = dataSource&&dataSource.filter(item => item.typeId === '4' && item.status == this.props.tabKey);
    }else if(this.props.typeId == 'shopping'){
      data = dataSource&&dataSource.filter(item => item.typeId === '5' && item.status == this.props.tabKey);
    }else if(this.props.typeId == 'Magazine'){
      /*   dataSource.map((item,index) => {
        item.pictureUrl = <img src={item.pictureUrl} style={{width:"50px"}} onClick={this.props.handleMagazinePreview.bind(this,item.pictureUrl)}/>
      })    */  
      data = dataSource;
    }else{
      data = dataSource;
    }
    sessionStorage.setItem('selectedRow',"");
    let spin = (data && data.length > 0) || (this.state.dataSource && this.state.dataSource.status == 1) ? false : true;//实际接口用xwx2019/01/02
    
    //按照时间进行倒序；
    // if(data&&data.length>1){
    //   data = data.sort(function(a,b){
    //     return a.createDate<b.createDate;
    //   })
    // }
    // if(this.props.reorder){
    //   if(this.props.reorder==0){
    //     if(data&&data.length>1){
    //       data = data.sort(function(a,b){
    //         return a.createDate<b.createDate;
    //       })
    //     }
    //   }else if(this.props.reorder==1){
    //     if(data&&data.length>1){
    //       data = data.sort(function(a,b){
    //         return a.likeNum<b.likeNum;
    //       })
    //     }
    //   }
    // }

    let pageSizeN;
    // if(pageSize==10){
    //   pageSizeN=10
    // }else if(pageSize==15){
    //   pageSizeN=15
    // }else if(pageSize==20){
    //   pageSizeN=20
    // }
    //xwx2018/12/12修改
    if(pageSize==10){
      pageSizeN=10;
    }else if(pageSize==20){
      pageSizeN=20;
    }else if(pageSize==30){
      pageSizeN=30;
    }else if(pageSize==40){
      pageSizeN=40;
    }

    data&&data.map((item, index) => {
      item.sNum = index + 1 + (currentPage-1)*pageSizeN;

      if(item.selectCount){
        item.maxmultipleSize=item.multiSelectCount;
        item.maxsingleSize=item.singleSelectCount;
      }else if(item.selectCount===0){
        item.maxmultipleSize=0;
        item.maxsingleSize=0;
      }
    });
    
    let pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      total: totalNum,
      pageSize: pageSize,
      current: currentPage,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
      // pageSizeOptions: ['10', '15', '20'],
      pageSizeOptions: ['10', '20', '30','40'],
      showTotal: total => `共 ${total} 条`,
    };
    const locale = {
      filterTitle: '筛选',
      filterConfirm: '确定',
      filterReset: '重置',
      emptyText: '暂无数据',
    };

    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    const formItemLayout4 = { labelCol: { span: 4 }, wrapperCol: { span:20  } };
    const formItemLayout1 = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    const formItemLayout2 = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    const formItemLayout3 = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };//解决字典管理里面名称显示不全问题
    const rowSelection = {
      selectedRowKeys,
      type:this.props.type=='radio'?'radio':'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
         localStorage.setItem("selectedRowKeys", selectedRowKeys);
      //  this.props.getSelectRowData([...selectedRows,...this.props.selectRowsData]);
        this.props.getSelectRowData(selectedRows);
        this.setState({selectedRowKeys,},() => {
          if(this.props.getSelectKey){
            this.props.getSelectKey(selectedRowKeys);
          }
          if(this.props.getSelectRow){
            this.props.getSelectRow(selectedRows);
          }
        });
      },
      getCheckboxProps: this.props.getCheckboxProps ? this.props.getCheckboxProps : '', 
    };
    
    const offOrOnLineBtn = this.props.offOrOnLineBtn ? <Popconfirm title={this.props.offOrOnLineBtn.typeLine === '上线' ? "确定上线所选项吗？" :this.props.offOrOnLineBtn.typeLine === '上架' ? '确定上架所选项吗？' : this.props.offOrOnLineBtn.typeLine === '下架' ? '确定下架所选项吗？' :
      "确定下线所选项吗？"} visible={this.state.onLinevisible} onVisibleChange={this.lineVisibleChange} onCancel={this.Linecancel} onConfirm={() => this.offLine(selectedRowKeys, this.props.offOrOnLineBtn.url)}><Button disabled={selectedRowKeys.length <= 0} className="queryBtn" style={{ order: this.props.offOrOnLineBtn.order }} >
      {this.props.offOrOnLineBtn.label}
    </Button></Popconfirm> : null;
    const OnLineBtn = this.props.OnLineBtn ? 
    <Popconfirm 
    title={'确定上线所选项吗？'} 
    visible={this.state.onLinevisible} 
    onVisibleChange={this.lineVisibleChange} 
    onCancel={this.Linecancel}  
    onConfirm={() => this.offBarLine(selectedRowKeys, this.props.OnLineBtn.url)}>
      <Button disabled={selectedRowKeys.length <= 0} className="barlineBtn"  onClick={this.onLineClick} style={{ order: this.props.OnLineBtn.order }} >
    {this.props.OnLineBtn.label}
    </Button></Popconfirm> : null;
    const OffLineBtn = this.props.OffLineBtn ? 
    <Popconfirm 
    title={'确定下线所选项吗？'} 
    visible={this.state.offLinevisible} 
    onVisibleChange={this.offLineVisibleChange} 
    onCancel={this.Linecancel}  

    onConfirm={() => this.offBarLine(selectedRowKeys, this.props.OffLineBtn.url)}>
      <Button disabled={selectedRowKeys.length <= 0}  onClick={this.offLineClick} className="queryBtn" style={{ order: this.props.OffLineBtn.order }} >
    {this.props.OffLineBtn.label}
    </Button>
    </Popconfirm> : null;
    const customBtn = this.props.customBtn ? <Button className='lineBtn' style={{ order: this.props.customBtn.order }} onClick={() => this.custom(selectedRowKeys)} >{this.props.customBtn.label}</Button>: null;
    const optionalBtn = this.props.optionalBtn ? <Button className="resetBtn" style={{order: this.props.optionalBtn.order}} onClick={this.addCopy}>{this.props.optionalBtn.label}</Button>:null;
    const optionalBtn2 = this.props.optionalBtn2 ? <Button className="resetBtn" style={{order: this.props.optionalBtn2.order}} disabled={selectedRowKeys.length <= 0} onClick={this.addCopy3}>{this.props.optionalBtn2.label}</Button>:null;
    //从首页下线
    // const optionalBtn1 = this.props.optionalBtn1 ? <Button disabled={selectedRowKeys.length <= 0} className="deleteBtn offLineBtn" style={{order: this.props.optionalBtn1.order}} onClick={this.addCopy1}>{this.props.optionalBtn1.label}</Button>:null;
    // // const optionalBtn1 = this.props.optionalBtn1 ? <Button disabled={selectedRowKeys.length <= 0} className="deleteBtn offLineBtn" style={{order: this.props.optionalBtn1.order}} onClick={this.addCopy1}>{this.props.optionalBtn1.label}</Button>:null;
    const optionalBtn1 = this.props.optionalBtn1 ? <Popconfirm title="确定从首页下线吗？" visible={this.state.visible} onVisibleChange={this.handleVisibleChange} onCancel={this.Popcancel} onConfirm={this.addCopy1} okText="确定" cancelText="取消">
      <Button type="primary" className="deleteBtn offLineBtn"  style={{ order: this.props.optionalBtn1.order }} disabled={selectedRowKeys.length <= 0}>{this.props.optionalBtn1.label}</Button></Popconfirm> : null;
    let addBtn;
    if(this.props.type==='vote'){
      addBtn = this.props.addBtn ? <Button 
                                    disabled={data&&data.length>0?true:false} 
                                    className="queryBtn" type="primary" style={{ order: this.props.addBtn.order }} 
                                    onClick={this.add}>{this.props.addBtn.label?this.props.addBtn.label:'新建'}
                                    </Button> : null;
    }else{
      addBtn = this.props.addBtn ? <Button className="queryBtn" type="primary" style={{ order: this.props.addBtn.order }} onClick={this.add}>{this.props.addBtn.label?this.props.addBtn.label:'新建'}</Button> : null;
    }

    const goBackBtn = this.props.goBackBtn ? <Button className="resetBtn" style={{order: this.props.goBackBtn.order}} onClick={this.goBackBtn}>{this.props.goBackBtn.label}</Button>:null;

    const updateBtn = this.props.updateBtn ? <Button className="queryBtn" style={{ order: this.props.updateBtn.order }} onClick={() => { this.getData(`${this.props.url}/${currentPage}/${pageSize}?${this.state.query}`); this.setState({ selectedRowKeys: [] });localStorage.setItem("selectedRowKeys","");}}>刷新</Button> : null;

    const importBtn = this.props.importBtn ?
      <div style={{ order: this.props.importBtn.order }}>
        <Upload {...uploadProps}>
          <Button className="resetBtn"  onClick={this.importData}>{this.props.importBtn.label ? this.props.importBtn.label : '导入'}</Button>
        </Upload>
      </div> 
      : null;
    const exportBtn = this.props.exportBtn ? <Button className="exportBtn" style={{ order: this.props.exportBtn.order}} disabled={this.state.reportExcel} onClick={this.exportData.bind(this,this.props.exportBtn.body)}>{this.props.exportBtn.label ?this.props.exportBtn.label:'导出'}</Button> : null;
   
    const deleteBtn = this.props.deleteBtn ? <Popconfirm title={this.props.deleteBtn.txt?this.props.deleteBtn.txt:"确定删除该选项吗？"} visible={this.state.visible} onVisibleChange={this.handleVisibleChange} onCancel={this.Popcancel} onConfirm={this.deleteData.bind(null, this.props.deleteBtn.url, this.props.deleteBtn.field,this.props.deleteBtn.special)} okText="确定" cancelText="取消">
      <Button type="primary" className="deleteBtn"  style={{ order: this.props.deleteBtn.order }} disabled={selectedRowKeys.length <= 0}>
          删除
      </Button>
    </Popconfirm> : null;


      const virtualGroupBack=this.props.type=='virtualGroupBack'||this.props.type==='CommentManageationDetail'?
      (this.state.isback == '1'||this.state.postBack!=='' ?
      <Button className="resetBtn" type="primary" onClick={() => history.back()}>
      返回
      </Button> : null):null;
    const frozenBtn = this.props.frozenBtn ? <Popconfirm title="确定冻结所选项吗？" visible={this.state.visibleFrozenBtn} onVisibleChange={this.handleVisibleChangeFrozenBtn} onCancel={this.PopcancelFrozenBtn} onConfirm={this.deleteData.bind(null, this.props.frozenBtn.url, this.props.frozenBtn.field,this.props.frozenBtn.special)} okText="确定" cancelText="取消">
    <Button type="primary" className="deleteBtn"  style={{ order: this.props.frozenBtn.order }} disabled={selectedRowKeys.length <= 0 }>
        冻结
    </Button>
    </Popconfirm> : null;
    const synchronizationBtn = this.props.synchronizationBtn ? <Popconfirm title="确定同步新用户吗？" onConfirm={this.synchronizationUser.bind(this, this.props.synchronizationBtn.url)} okText="确定" cancelText="取消">
    <Button type="primary" className="exportBtn"  style={{ order: this.props.synchronizationBtn.order }} >
        同步
    </Button>
    </Popconfirm> : null;
    let searchData = this.props.search
    if(this.state.moreSearchFlag) {
        searchData = [...searchData, ...this.props.moreSearch]
    }else {
        searchData = this.props.search
    }
   
    console.log("searchData===>",searchData)
    const search = searchData ? (
      <Row className="row">
        {searchData.map((item, index) => {
          return (
            <div key={index}>
              {item.label==='是否被举报' ? (
                <Col span={8} pull={1}>
                  <Form.Item {...formItemLayout} label={item.label} style={{marginLeft:'32px'}}>
                    {getFieldDecorator(item.key, { initialValue: '全部' })(
                      <Select
                        className="select"
                        style={{width:'100%'}}
                        getPopupContainer={trigger => trigger.parentNode}
                        onChange={value =>
                          this.handleChange(
                            value,
                            item.key,
                            item.qFilter,
                            item.type
                          )
                        }
                      >
                        {
                          item.option&&item.option.map(_=>{
                            return <Option key={_.key} value={_.key}>
                              {_.value}
                            </Option>;
                          })
                        }
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              ): item.type === 'inputAge' ?
              <Col span="8" pull={1}>
                <Form.Item {...formItemLayout} label={item.label}>
                    <Row>
                        <Col span='11'>
                    {getFieldDecorator(item.startKey, { initialValue: ''})(
                    <InputNumber
                        style={{width:'100%',height: 32, lineHeight: '30px'}}
                        onChange={value =>
                        this.handleChange(
                            value,
                            item.startKey,
                            item.qFilterStart,
                            item.type
                        )
                        }
                    />
                    )}
                    </Col>
                    <Col span='2'>&nbsp;至&nbsp;</Col>
                    <Col span='11'>
                    {getFieldDecorator(item.endKey, { initialValue: ''})(
                    <InputNumber
                        style={{width:'100%',height: 32, lineHeight: '30px'}}
                        onChange={value =>
                        this.handleChange(
                            value,
                            item.endKey,
                            item.qFilterEnd,
                            item.type
                        )
                        }
                    />
                    )}
                    </Col>
                    </Row>
                </Form.Item>
              </Col>
                : item.type === 'select' && item.key === 'cardThemeId' ? (
                <Col span="8" pull={1}>
                <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, { initialValue: item.code == 'carousel' ? '无' : '全部' })(
                  <Select
                    className="select"
                    style={{width:'100%'}}
                    getPopupContainer={trigger => trigger.parentNode}
                    onChange={value =>
                      this.handleChange(
                        value,
                        item.key,
                        item.qFilter,
                        item.type
                      )
                    }
                  >
                    {
                      item.option&&item.option.map(_=>{
                        return <Option key={_.id} value={_.id}>
                          {_.name}
                        </Option>;
                      })
                    }
                  </Select>
                )}
              </Form.Item>
            </Col>
              ):item.type==='select'&&item.key==='employeeType'?(
                <Col span={8} pull={1}>
                  <Form.Item {...formItemLayout} label={item.label}>
                  {getFieldDecorator(item.key, { initialValue: item.code == 'carousel' ? '无' : '全部' })(
                    <Select
                      className="select"
                      style={{width:'100%'}}
                      getPopupContainer={trigger => trigger.parentNode}
                      onChange={value =>
                        this.handleChange(
                          value,
                          item.key,
                          item.qFilter,
                          item.type
                        )
                      }
                    >
                      {
                        item.option&&item.option.map(_=>{
                          return <Option key={_.code} value={_.code}>
                            {_.desp}
                          </Option>;
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              ):item.type==='select'&&item.key==='roleId'?(
                <Col span={8} pull={1}>
                <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, { initialValue: item.code == 'carousel' ? '无' : '全部' })(
                  <Select
                    className="select"
                    style={{width:'100%'}}
                    getPopupContainer={trigger => trigger.parentNode}
                    onChange={value =>
                      this.handleChange(
                        value,
                        item.key,
                        item.qFilter,
                        item.type
                      )
                    }
                  >
                    {
                      item.option&&item.option.map(_=>{
                        return <Option key={_.id} value={_.id}>
                          {_.name}
                        </Option>;
                      })
                    }
                  </Select>
                )}
              </Form.Item>
            </Col>
              ):item.type==='select' ? (
                <Col span={8} pull={1}>
                  <Form.Item {...formItemLayout} label={item.label}>
                    {getFieldDecorator(item.key, { initialValue: item.code == 'carousel' ? '无' : '全部' })(
                      <Select
                        className="select"
                        style={{width:'100%'}}
                        getPopupContainer={trigger => trigger.parentNode}
                        onChange={value =>
                          this.handleChange(
                            value,
                            item.key,
                            item.qFilter,
                            item.type
                          )
                        }
                      >
                        {
                          item.option&&item.option.map(_=>{
                            return <Option key={_.key} value={_.key}>
                              {_.value}
                            </Option>;
                          })
                        }
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              ) : (
                <Col span={8} pull={1}>
                  {item.type === 'rangePicker' ? (
                    <Form.Item className="RangePicker" {...formItemLayout2} label={item.label}>
                      {getFieldDecorator(item.key, { initialValue: '' })(
                        <RangePicker
                          style={{ width: '100%' }}
                          // format="YYYY-MM-DD HH:mm:ss"
                          className="input1"
                          // showTime={{ format: 'HH:mm:ss' }}
                          // showTime={{
                          //   // hideDisabledOptions: true,
                          //   defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                          // }}
                          onChange={value =>
                            this.handleChange(
                              value,
                              item.key,
                              item.qFilter,
                              item.type,
                              item.startTime,
                              item.endTime,
                            )
                          }
                        />
                      )}
                    </Form.Item>
                  ) :item.type==='platformPointrangePicker'?
                  (
                    <Form.Item className="RangePicker" {...formItemLayout2} label={item.label}>
                      {getFieldDecorator(item.key, { 
                        initialValue:[moment(moment().subtract(30, 'days'), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
                       })(
                        <RangePicker
                          style={{ width: '100%' }}
                          // format="YYYY-MM-DD HH:mm:ss"
                          className="input1"
                          allowClear={false}
                          // showTime={{ format: 'HH:mm:ss' }}
                          // showTime={{
                          //   // hideDisabledOptions: true,
                          //   defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                          // }}
                          onChange={value =>
                            this.handleChange(
                              value,
                              item.key,
                              item.qFilter,
                              item.type
                            )
                          }
                        />
                      )}
                    </Form.Item>
                  ):
                   (
                    item.label==='评论人'?
                    <Form.Item {...formItemLayout1} label={item.label} style={{marginLeft:'32px'}} >
                        {getFieldDecorator(item.key, {
                          initialValue: '', 
                          rules: [
                            {
                              required: false,
                              whitespace: true,
                              validator: (rule, value, callback) => illegalInput(rule, value, callback),
                            },

                          ] })(
                          <Input style={{ width: '100%' }} className="input1" placeholder="请输入关键字" onChange={e => this.handleChange(
                            e.target.value,
                            item.key,
                            item.qFilter,
                            item.type
                          )}/>
                        )}
                      </Form.Item>
                    :item.label==='任务主题名称'?
                    <Form.Item {...formItemLayout3} label={item.label} help="">
                    {getFieldDecorator(item.key, {
                      initialValue: '', 
                      rules: [
                        {
                          required: false,
                          whitespace: true,
                          // validator: item.label != '配置档名称' ? (rule, value, callback) => illegalInput(rule, value, callback) : null,//去掉input搜索框非法字符的正则验证xwx2019/1/17
                        },

                      ] })(
                      <Input style={{ width: '100%' }} className="input1" placeholder="请输入关键字" onChange={e => this.handleChange(
                        e.target.value,
                        item.key,
                        item.qFilter,
                        item.type
                      )}/>
                    )}
                  </Form.Item>
                    :item.label==='任务类型名称'?
                    <Form.Item {...formItemLayout3} label={item.label}>
                    {getFieldDecorator(item.key, {
                      initialValue: '', 
                      rules: [
                        {
                          required: false,
                          whitespace: true,
                          // validator: item.label != '配置档名称' ? (rule, value, callback) => illegalInput(rule, value, callback) : null,//去掉input搜索框非法字符的正则验证xwx2019/1/17
                        },

                      ] })(
                      <Input style={{ width: '100%' }} className="input1" placeholder="请输入关键字" onChange={e => this.handleChange(
                        e.target.value,
                        item.key,
                        item.qFilter,
                        item.type
                      )}/>
                    )}
                  </Form.Item>    
                    :item.type==='input'?
                      <Form.Item {...formItemLayout1} label={item.label}>
                        {getFieldDecorator(item.key, {
                          initialValue: '', 
                          rules: [
                            {
                              required: false,
                              whitespace: true,
                              message: '不能全部为空格！'
                              // validator: item.label != '配置档名称' ? (rule, value, callback) => illegalInput(rule, value, callback) : null,//去掉全局input搜索框非法字符的正则验证xwx2019/1/17
                            },

                          ] })(
                          <Input style={{ width: '100%' }} className="input1" placeholder="请输入关键字" onChange={e => this.handleChange(
                            e.target.value,
                            item.key,
                            item.qFilter,
                            item.type
                          )}/>
                        )}
                      </Form.Item>
                       :item.type === 'company'?
                       <Row>
                       <Col span={12}>
                       <Form.Item {...formItemLayout4} label={item.label}>
                         {getFieldDecorator(item.key, { initialValue: '' })(                
                       <Cascader
                             style={{ width: '100%' }}
                             className="input1"
                             options={item.option}
                             placeholder="请选择关键字"
                             changeOnSelect
                             onChange={(value) => this.handleChange(
                                 value,
                                 item.key,
                                 item.qFilter,
                                 item.type
                               )
                             }
                           />
                         )}
                       </Form.Item>
                       </Col>
                       <Col span={12}  style={{display:this.state.orgIdDisplay ? "none":'block'}}>
                       <Form.Item {...formItemLayout4} label="部门">
                         {getFieldDecorator(item.key2, { initialValue: '' })(
                           <Cascader
                             style={{ width: '100%' }}
                             className="input1"
                             options={item.option2}
                             placeholder="请选择关键字"
                             changeOnSelect
                             onChange={(value) => this.handleChange(
                                 value,
                                 item.key2,
                                 item.qFilter2,
                                 item.type
                               )
                             }
                           />
                         )}
                       </Form.Item>
                       </Col>
                       </Row>
                      :item.type === 'cascader' ?
                        <Form.Item {...formItemLayout1} label={item.label}>
                          {getFieldDecorator(item.key, { initialValue: '' })(
                            <Cascader
                              style={{ width: '100%' }}
                              className="input1"
                              options={item.option}
                              placeholder="请选择关键字"
                              changeOnSelect
                              onChange={(value) => this.handleChange(
                                  value,
                                  item.key,
                                  item.qFilter,
                                  item.type
                                )
                              }
                            />
                          )}
                        </Form.Item>:null
                  )}
                </Col>
              )}
            </div>
          );
        })}
        <Col span={24} className="colBtn">
          <Button
            type="primary"
            htmlType="submit"
            className="queryBtn"
          >
            查询
          </Button>
          <Button
            type="primary"
            className="resetBtn"
            onClick={() => {
              this.props.form.resetFields();
              this.setState({ queryFilter: {} });
              this.setState({PointStatus:0});//积分明细里面重置后再将状态恢复到初始状态
            }}
          >
            重置
          </Button>
          {this.props.moreSearch ? <Button
            type="primary"
            style={{marginLeft: '80px'}}
            className="resetBtn"
            onClick={() => {
              this.setState({moreSearchFlag: !this.state.moreSearchFlag});
            }}
          >
            {this.state.moreSearchFlag ? '收起<<' : '更多查询条件<<'}
          </Button>: null}
        </Col>
      </Row>
    ) : null;
    const num = this.props.scroll&&this.props.scroll.width;
    return(
      <Spin spinning={spin}>
        <div className="custom-table">
        <div className={this.props.search ? 'custom-table-search' : null}>
          <Form onSubmit={this.handleSubmit}>{search}</Form>
        </div>
        {children}
        <div className="custom-table-btn">
          <span>
            {offOrOnLineBtn}
            {OnLineBtn}
            {OffLineBtn}
            {addBtn}
            {importBtn}
            {customBtn}
            {optionalBtn}
            {optionalBtn1}
            {optionalBtn2}
            {goBackBtn}
            {updateBtn}
            {exportBtn}
            {deleteBtn}
            {frozenBtn}
            {virtualGroupBack}
            {synchronizationBtn}
          </span>
        </div>
        
        <Table scroll={{ x: num }} rowKey={this.props.rowkey?this.props.rowkey:'id' } bordered columns={columns} dataSource={data} locale={locale} pagination={pagination} 
        rowSelection={this.props.type=='pageview'||this.props.type=='platformPointDetail'?null:rowSelection}
         onRow={(record)=>{
          return {
            onClick:(e)=>{
              if (e.target.tagName !== 'TD' && e.target.tagName !=='DIV') {
                return;
              }
              let checkedProps = this.props.getCheckboxProps ? this.props.getCheckboxProps(record) : '';
              let recordKey = record[this.props.rowkey ? this.props.rowkey : 'id'];
              let selectedRowKeys = this.state.selectedRowKeys;
              let selectedRows = this.state.selectedRows;
              if (this.props.type == 'radio') {
                if (!checkedProps.disabled) {
                  this.props.getSelectRowData([record]);
                  selectedRowKeys = [recordKey];
                  this.setState({ selectedRowKeys }, () => {
                    if (this.props.getSelectKey) {
                      this.props.getSelectKey(selectedRowKeys);
                    }
                  });
                }
              } else {
                if (!checkedProps.disabled) {
                  if (selectedRows.some(item =>
                    item[this.props.rowkey ? this.props.rowkey : 'id' ] === recordKey
                  )) {
                    selectedRows.filter(item => item[this.props.rowkey ? this.props.rowkey : 'id'] !== recordKey);
                  } else {
                    selectedRows.push(record);
                  }   
             
                  this.props.getSelectRowData(selectedRows);
                  if (selectedRowKeys.indexOf(recordKey) > -1) {
                    selectedRowKeys = selectedRowKeys.filter(_ => _ !== recordKey);
                  } else {
                    selectedRowKeys = [...this.state.selectedRowKeys, recordKey];
                  }

                  localStorage.setItem("selectedRowKeys", selectedRowKeys);
                  this.setState({ selectedRowKeys,arrlenth:selectedRowKeys.length }, () => {
                    if (this.props.getSelectKey) {
                      this.props.getSelectKey(selectedRowKeys);
                    }
                  });
                }
              }
            },
          };}}/>
      </div>
      </Spin>
      )
    ;
  }}