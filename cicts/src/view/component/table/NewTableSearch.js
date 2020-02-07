import React,{ Component } from 'react';
import { Form, Table, Row, Col, Select, Button, Input, DatePicker, Message, Popconfirm, Upload, Cascader } from 'antd';
// import zhCN from 'antd/lib/locale-provider/zh_CN';
import {connect} from 'react-redux';
import { BEGIN, getDataSource, getPageData, getSelectRows } from '../../../redux-root/action/table/table';
import './TableStyle.less';
import { arrayToString } from '../tools';
import API_PREFIX from '../.././content/apiprefix';
import { illegalInput } from '../../../utils/checkForm';
import {postService,exportExcelService,exportExcelService1} from '../.././content/myFetch';
const RangePicker = DatePicker.RangePicker;
const {MonthPicker} = DatePicker;
const Option = Select.Option;
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    getPageData:n=>dispatch(getPageData(n)),
    retSetData: n=>dispatch(getDataSource(n)),
    getSelectRowData: n => dispatch(getSelectRows(n)),
  })
)
@Form.create()
export default class NewTableSearch extends Component {
  constructor(props) {
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
      arrlenth:0
    }
  }
  componentWillUnmount(){
    this.getPageData(1, 10, '');
    this.props.retSetData({ root: { list: [] } });
    this.props.getSelectRowData([]);
  }
  componentDidUpdate(){
    if(localStorage.getItem('selectedRowKeys')){
      let arrlenth= localStorage.getItem('selectedRowKeys').split(",");
      if (this.state.dataSourceUpdate&&this.props.dataSource.root) {
        this.setState({ totalNum: this.props.dataSource.root.totalNum, dataSourceUpdate:false,arrlenth:arrlenth,selectedRowKeys:localStorage.getItem('selectedRowKeys')});
      }
    }else{
      if (this.state.dataSourceUpdate&&this.props.dataSource.root) {
        this.setState({ totalNum: this.props.dataSource.root.totalNum, dataSourceUpdate:false,selectedRowKeys:localStorage.getItem('selectedRowKeys')});
      }
    }
  }
  componentDidMount() {
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
      this.getData(`${this.props.url}/1/10?${this.state.query}`);
      this.getPageData(1,10,this.state.query);
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
    return null;
  }

  onPageChange = (currentPage, pageSize) => {
    localStorage.setItem('selectedRowKeys','');
    this.getPageData(currentPage,pageSize,this.state.query);
    this.setState({ currentPage, pageSize });
    this.getData(
      `${this.props.url}/${currentPage}/${pageSize}?${this.state.query}`
    );
  };
  onPageSizeChange = (currentPage, pageSize) => {
    localStorage.setItem('selectedRowKeys','');
    this.getPageData(currentPage,pageSize,this.state.query);
    this.setState({ currentPage, pageSize });
    this.getData(
      `${this.props.url}/${currentPage}/${pageSize}?${this.state.query}`
    );
  };

  handleChange(value, key, qFilter, type) {
    const { queryFilter } = this.state;
    if (key ==='categoryId') {
      let tempValue = '';
      tempValue = value[value.length - 1]||'';
      queryFilter[key] = `${qFilter}=${tempValue}`;
    }else if (type === 'rangePicker') {
      if(value &&value.length != 0) {
        if(value.length===2){
          queryFilter[key] = `Q=startTime=${value[0].format('YYYY-MM-DD 00:00:00')}&Q=endTime=${value[1].format('YYYY-MM-DD 23:59:59')}`; 
        }else{
          // queryFilter[key] = `Q=${key}_D_GE=${value.format('YYYY-MM-DD 00:00:00')}`;
          queryFilter[key] = `Q=${key}_S_LK=${value.format('YYYY-MM')}`;  //朱劲松 2018-12-12
        }
      }
      else{
        queryFilter[key] = '';
      }
    }else if(key ==='orgId'){
      let tempValue = '';
      tempValue = value[value.length - 1]||'';
      queryFilter[key] = `${qFilter}=${tempValue}`;
    }else {
      queryFilter[key] = `${qFilter}=${value}`;
    }
    this.setState({ queryFilter });
  }

  handleSubmit = e => {
    localStorage.setItem("selectedRowKeys", '');
    const { currentPage, pageSize}=this.state;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        fieldsValue['organizationId'] = fieldsValue['organizationId']?eval(fieldsValue['organizationId']):'';
        fieldsValue['categoryId'] = fieldsValue['categoryId']?arrayToString(fieldsValue['categoryId']):'';
        this.setState({
          fieldsValue:fieldsValue,
        });
        let query = '';
        Object.values(this.state.queryFilter).map(item => {
          if (query === '') {
            query =  item;
          } else {
            query = query + '&' + item;
          }
        });
        if(this.props.special){
          if (query==='') {
            query = this.props.special;
          }else{
            query = query+'&'+this.props.special;
          }
        }
        if (this.props.urlfilter) {
          if (query === '') {
            query = this.props.urlfilter;
          } else {
            query = query + '&' + this.props.urlfilter;
          }
        }
        this.setState({ query },() => {
          this.getData(`${this.props.url}/1/${pageSize}?${query}`);
          //查询重置
          this.setState({
            currentPage:1,
            // pageSize:10,
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
      location.hash = this.props.goBack.url;
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
    if(special){
      special.idList = this.state.selectedRowKeys;
    }
    let body = special?special:{ [field]: this.state.selectedRowKeys };
    body = field === 'NO' ?this.state.selectedRowKeys:special
    postService(
      API_PREFIX + `${url}`,
      body,
      data => {
        if (data.status === 1) {
          if(this.props.tip){
            Message.success('从首页下线成功!');
          }else{
            Message.success('删除成功!');
          }
          localStorage.removeItem('selectedRowKeys') //yelu 清空localStorage里面保存的selectedRowKeys
          this.setState({
            selectedRowKeys:[],
            visible:false,
            arrlenth: 0 //yelu 重置arrlenth为0，置灰删除按钮
          });
          this.setState({
            currentPage:1,
          },() => {
            this.getData(
              `${this.props.url}/${this.state.currentPage}/${
                this.state.pageSize
              }?${this.state.query}`
            );
          });
          
        } else {
          Message.error(data.retMsg);
        }
      }
    );
  }
  importData(){
    
  }
  exportData = (body) => {
    //做复杂了，难受
    if(this.props.exportBtn.type == 'virtualGroup'){
      let acount = '';
      let email = '';
      let lastname = '';
      if(this.state.fieldsValue == undefined){
        acount = '';
        email = '';
        lastname = '';
      }else{
        if(this.state.fieldsValue.acount){
          acount = '?acount=' + `${this.state.fieldsValue.acount}`;
        }else{
          acount = '';
        }
        if(this.state.fieldsValue.email){
          email = '&email=' + `${this.state.fieldsValue.email}`;
        }else{
          email = '';
        }
        if(this.state.fieldsValue.lastname){
          lastname = '&lastname=' + `${this.state.fieldsValue.lastname}`;
        }else{
          lastname = '';
        }
      }
      let path = API_PREFIX + this.props.exportBtn.url + `${this.props.groupId}` + acount + email + lastname;
      exportExcelService(path,'','群成员信息'); 
    }else if(this.props.exportBtn.type === '专题'){
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService1(path,'普通专题'); 
    }else{
      let path = API_PREFIX + this.props.exportBtn.url + '?' + `${this.state.query}`;
      exportExcelService(path,body,this.props.exportBtn.type); 
    }
  }

  offLine=(selectedRowKeys,url)=>{
    let body = { ids: selectedRowKeys };

    postService(API_PREFIX + url, body, data => {
      if (data.retCode === 1) {
        Message.success('操作成功');
        this.getData(`${this.props.url}/1/10?${this.state.query}`);
      }
    });
  }

  handleVisibleChange = () => {
    let {selectedRowKeys}=this.state;
    if (selectedRowKeys.length===0) {
      this.setState({
        visible:false
      })
    }else{
      this.setState({
        visible:true
      })
    }
  }

  Popcancel=()=>{
    this.setState({ visible: false });
  }

  //事项提醒 重新发送邮件 点击事件
  sendEmailClick = (selectedRowKeys)=>{
    postService(`${API_PREFIX}services/servicemanager/attendance/manualEmail`, {ids:selectedRowKeys}, data => {
      if (data.retCode === 1) {
        Message.success('操作成功');
      }
    }); 
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
              Message.success( info.file.name + ' 上传成功。', 3 );
              refresh(`${url}/${currentPage1}/${pageSize1}?${query}`);
            } else if ( info.file.response.retCode == '0' ) {
              Message.error(info.file.response.retMsg + '失败原因：' + info.file.response.root.list[0], 5 );
            }
          }

        },
      };
    }else{
      uploadProps={};
    }
    
    const { totalNum, pageSize, currentPage ,selectedRowKeys} = this.state;
    const {
      columns,
      //dataSource,
      form: { getFieldDecorator },
      children,
    } = this.props;
    /**
 * 待处理dataSource格式
 * totalNum
 * pagesize  完成
 * currentPage  完成
 */
    let data;
    const dataSource = this.state.dataSource.root&&this.state.dataSource.root.list;
    dataSource&&dataSource.map((item, index) => {
      item.sNum = index + 1 + (this.state.currentPage-1)*10;
    });
    //将选中的存到缓存里去 

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
    //按照时间进行倒序；
    if(data&&data.length>1){
      data = data.sort(function(a,b){
        return a.createDate<b.createDate;
      })
    }
    data&&data.map((item, index) => {
      item.sNum = index + 1 + (this.state.currentPage-1)*10;
      if(item.selectCount){
        item.maxmultipleSize=item.multiSelectCount;
        item.maxsingleSize=item.singleSelectCount;
      }else if(item.selectCount===0){
        item.maxmultipleSize=0;
        item.maxsingleSize=0;
      }
    })
    
    let pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      total: totalNum,
      pageSize: pageSize,
      current: currentPage,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
      pageSizeOptions: ['10', '20', '30','40'],
      showTotal: total => `共 ${total} 条`
    };
    const locale = {
      filterTitle: '筛选',
      filterConfirm: '确定',
      filterReset: '重置',
      emptyText: '暂无数据',
    };
    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    const formItemLayout1 = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    const formItemLayout2 = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    const rowSelection = {
      selectedRowKeys,
      type:this.props.type=='radio'?'radio':'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        this.props.getSelectRowData(selectedRows);
        // 缓存拿到所存的选中id
        localStorage.setItem("selectedRowKeys", selectedRowKeys);

        this.setState({selectedRowKeys,arrlenth:selectedRowKeys.length},() => {
          if(this.props.getSelectKey){
            this.props.getSelectKey(selectedRowKeys);
          }
        });
      },
      getCheckboxProps: this.props.getCheckboxProps ? this.props.getCheckboxProps : '',
    };
    
    const offOrOnLineBtn = this.props.offOrOnLineBtn ? <Button disabled={selectedRowKeys.length <= 0} className="queryBtn" style={{ order: this.props.offOrOnLineBtn.order }} onClick={() => this.offLine(selectedRowKeys, this.props.offOrOnLineBtn.url)}>
      {this.props.offOrOnLineBtn.label}
    </Button> : null;
    const customBtn = this.props.customBtn ? <Button className='lineBtn'　style={{ order: this.props.customBtn.order }} onClick={() => this.custom(selectedRowKeys)}>{this.props.customBtn.label}</Button> : null;

    const optionalBtn = this.props.optionalBtn ? <Button className="resetBtn" style={{order: this.props.optionalBtn.order}} onClick={this.addCopy}>{this.props.optionalBtn.label}</Button>:null;
    const optionalBtn2 = this.props.optionalBtn2 ? <Button className="resetBtn" style={{order: this.props.optionalBtn2.order}} disabled={selectedRowKeys.length <= 0} onClick={this.addCopy3}>{this.props.optionalBtn2.label}</Button>:null;
    //从首页下线
    const optionalBtn1 = this.props.optionalBtn1 ? <Button disabled={selectedRowKeys.length <= 0} className="deleteBtn offLineBtn" style={{order: this.props.optionalBtn1.order}} onClick={this.addCopy1}>{this.props.optionalBtn1.label}</Button>:null;

    const addBtn = this.props.addBtn ? <Button className="queryBtn" type="primary" style={{ order: this.props.addBtn.order }} onClick={this.add}>{this.props.addBtn.label?this.props.addBtn.label:'新建'}</Button> : null;
    
  
    const goBackBtn = this.props.goBackBtn ? <Button className="resetBtn" style={{order: this.props.goBackBtn.order}} onClick={this.goBackBtn}>{this.props.goBackBtn.label}</Button>:null;

    const updateBtn = this.props.updateBtn ? <Button className="queryBtn" style={{ order: this.props.updateBtn.order }} onClick={() => { this.getData(`${this.props.url}/${currentPage}/${pageSize}?${this.state.query}`); this.setState({ selectedRowKeys: [] });}}>刷新</Button> : null;
    
    //事项提醒 重新发送邮件 按钮
    const sendEmail = this.props.sendEmailBtn ? <Button className="sendEmail" style={{order: this.props.sendEmailBtn.order,borderRadius:100,height:29,marginLeft:13}} disabled={selectedRowKeys&&selectedRowKeys.length <= 0} onClick={() => { this.sendEmailClick(selectedRowKeys);  this.setState({ selectedRowKeys: [] });}}>{this.props.sendEmailBtn.label}</Button> : null;

    const importBtn = this.props.importBtn ?
      <div style={{ order: this.props.importBtn.order }}>
        <Upload {...uploadProps}>
          <Button className="resetBtn"  onClick={this.importData}>{this.props.importBtn.label ? this.props.importBtn.label : '导入'}</Button>
        </Upload>
      </div> 
      : null;
    const exportBtn = this.props.exportBtn ? <Button className="exportBtn" style={{ order: this.props.exportBtn.order}} onClick={this.exportData.bind(this,this.props.exportBtn.body)}>{this.props.exportBtn.label ?this.props.exportBtn.label:'导出'}</Button> : null;

    let selectedRowKeys1=localStorage.getItem('selectedRowKeys');



    const deleteBtn = this.props.deleteBtn ? <Popconfirm title="确定删除所选项吗？" visible={this.state.visible} onVisibleChange={this.handleVisibleChange}  onCancel={this.Popcancel} onConfirm={this.deleteData.bind(null, this.props.deleteBtn.url, this.props.deleteBtn.field,this.props.deleteBtn.special)} okText="确定" cancelText="取消">
      <Button type="primary" className="deleteBtn"  style={{ order: this.props.deleteBtn.order }} disabled={selectedRowKeys1==null||selectedRowKeys1==''}>
          删除
      </Button>
    </Popconfirm> : null;
    const search = this.props.search ? (
      <Row className="row">
        {this.props.search.map((item, index) => {
          return (
            <div key={index}>
              {  item.label==='是否被举报' ? (
                <Col span={8} pull={1}>
                  <Form.Item {...formItemLayout} label={item.label} style={{marginLeft:'32px'}} >
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
              )
              : item.type==='select' ? (
                <Col span={8} pull={1}>
                  <Form.Item {...formItemLayout} label={item.label} >
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
              ) :        
              (
                <Col span={8} pull={1}>
                  {item.type === 'rangePicker' ? (item.isMont === 'monthPicker' ?
                    <Form.Item className="MonthPicker" {...formItemLayout2} label={item.label}>
                      {getFieldDecorator(item.key, { initialValue: '' })(
                        <MonthPicker 
                         placeholder="请选择"
                        //  style={{ width: '100%' }}
                         className="input1"
                        //  format={'YYYY/MM'}
                        onChange={(value,str)=>{
                            this.handleChange(
                              value,
                              item.key,
                              item.qFilter,
                              item.type,
                              item.isMont,
                            )
                           }}
                         
                        />
                      )}
                    </Form.Item> : <Form.Item className="RangePicker" {...formItemLayout2} label={item.label}>
                      {getFieldDecorator(item.key, { initialValue: '' })(
                        <RangePicker
                          style={{ width: '100%' }}
                          className="input1"
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
                  ) : (
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
                  :item.type==='input'?
                      <Form.Item {...formItemLayout1} label={item.label}> 
                        {getFieldDecorator(item.key, {
                          initialValue: '', 
                          rules: [
                            {
                              required: false,
                              whitespace: true,
                              // validator: (rule, value, callback) => illegalInput(rule, value, callback),//去掉全局input搜索框非法字符的正则验证xwx2019/3/1
                            },

                          ] })(
                          <Input style={{ width: '100%' }} className="input1" placeholder="请输入关键字" onChange={e => this.handleChange(
                            e.target.value,
                            item.key,
                            item.qFilter,
                            item.type
                          )}/>
                        )}
                      </Form.Item>:
                      item.type === 'cascader' ?
                        <Form.Item {...formItemLayout1} label={item.label}>
                          {getFieldDecorator(item.key, { initialValue: '' })(
                            <Cascader
                              style={{ width: '100%' }}
                              className="input1"
                              options={item.option}
                              placeholder="请输入关键字"
                              changeOnSelect
                              onChange={value => this.handleChange(
                                value,
                                item.key,
                                item.qFilter,
                                item.type
                              )}
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
            }}
          >
            重置
          </Button>
        </Col>
      </Row>
    ) : null;
    const num = this.props.scroll&&this.props.scroll.width;
    return(
      <div className="custom-table">
        <div className={this.props.search ? 'custom-table-search' : null}>
          <Form onSubmit={this.handleSubmit}>{search}</Form>
        </div>
        {children}
        <div className="custom-table-btn">
          <span>
            {offOrOnLineBtn}
            {customBtn}
            {addBtn}
            {optionalBtn}
            {optionalBtn1} 
            {optionalBtn2}
            {goBackBtn}
            {updateBtn}
            {importBtn}
            {exportBtn}
            {deleteBtn}
            {sendEmail}
          </span>
        </div>
        <Table scroll={{ x: num }} rowKey={this.props.rowkey?this.props.rowkey:'id'} bordered columns={columns} dataSource={data} locale={locale} pagination={pagination} rowSelection={rowSelection} onRow={(record)=>{
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
                    item[this.props.rowkey ? this.props.rowkey : 'id'] === recordKey
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
                  this.setState({ selectedRowKeys,arrlenth:selectedRowKeys.length}, () => {
                    if (this.props.getSelectKey) {
                      this.props.getSelectKey(selectedRowKeys);
                    }
                  });
                }
              }
            },
          };}}/>
      </div>)
    ;
  }
}