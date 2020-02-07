import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString, postService, getService } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
import { Form, Cascader, Divider, Button,Spin,message} from 'antd';
const FormItem = Form.Item;
import './CarouselDetail.less';

@connect(
  state => ({
    powers: state.powers,
  }),
)
export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryOption: [],
      isEnabledOption : [],
      loading: false,
      columnsOptions: [],
    };
  }

  componentDidMount(){
    this.setState({ loading: true });
    //获取栏目数据
    // getService(API_PREFIX+'services/system/cateogry/categoryList/get',data=>{
    //   console.log('栏目数据：',data);
    //   let categorys=data.root.list;
    //   if(categorys){
    //     //调用接口数据处理函数
    //     this.getCategoryData(categorys);
    //     this.setState({
    //       categoryOption:categorys,
    //       loading: false,
    //     });

    //   }else{
    //     message.error(data.retMsg);
    //     this.setState({ loading: false });
    //   }
    // }
    // );
    // getService(API_PREFIX+'services/system/homepageMenu/list',data=>{ 0729wgs原来的
     getService(API_PREFIX+'services/web/config/homepageMenu/getList/1/20',data=>{ 
      console.log(data);
      if(data.status == 1) {
        let arr =[];
        data.root.list.forEach(item => {
          arr.push({key: item.menuName, value: item.menuName});
        });
        arr.unshift({key: '全部', value: '全部'});
        console.log('======>>', arr);
        this.setState({columnsOptions: arr});
      }
      // let arr = []
      // data && data.forEach(item => {
      //   if(item.code != 3) {
      //     arr.push({key: item.code, value: item.desp})
      //   }
      // })
      // this.setState({columnsOptions: arr})
    });
    this.setState({
      isEnabledOption : [
        {
          key: '', value: '全部',
        },
        {
          key: '1', value: '是',
        }, {
          key: '0', value: '否',
        }],
    });
  }

  //递归取出接口返回的栏目数据
  getCategoryData(cData){
    cData.map((item,index)=>{
      item.value=item.id;
      item.label=item.name;
      item.children=item.subCategoryList;
      if(item.subCategoryList){//不为空，递归
        this.getCategoryData(item.subCategoryList);
      }
    });
  }

  //获取到所属栏目的id
  handleCheckChange=(value)=>{
    console.log('级联中的value：',value);
    this.setState({
      selectedValues:value,
    });

  }

  render() {
    const { isEnabledOption} = this.state;
    let powers = this.props.powers;
    // console.log('权限码', powers);
    let createPowers = powers && powers['20003.21402.001'];//新建
    let updatePowers = powers && powers['20003.21402.002'];//修改
    let readPowers = powers && powers['20003.21402.003'];//查询
    let deletePowers = powers && powers['20003.21402.004'];//删除

    const columns = [
      {
        title: '标题名称',
        dataIndex: 'pictureTitle',
        key: 'pictureTitle',
      },
      {
        title: '资讯类型',
        dataIndex: 'sourceType',
        key: 'sourceType',
        render: (text, record) => {
          if(record.sourceType == 23) {
            return '测试数据';
          }else if(record.sourceType == 1) {
            return '文章';
          }else if(record.sourceType == 2) {
            return '活动';
          }else if(record.sourceType == 3) {
            return '杂志';
          }else if(record.sourceType == 4) {
            return '专题';
          }else if(record.sourceType == 5) {
            return '视频';
          }else {
            return '';
          }
        },
      },
      {
        title: '轮播图片',
        dataIndex: 'pictureUrl',
        key: 'pictureUrl',
      },
      {
        title: '关联菜单',
        dataIndex: 'parentName',
        key: 'parentName',
        render: (text, record) => {
          if(record.parentId == '0'){
            return <span>无</span>;
          }else {
            return <span>{record.parentName}</span>;
          }
        },
      },
      {
        title: '显示顺序',
        dataIndex: 'showIndex',
        key: 'showIndex',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '是否启用',
        dataIndex: 'isEnabled',
        key: 'isEnabled',
        render: (text, record) => {
          if(record.isEnabled == true){
            return <span>是</span>;
          }else {
            return <span>否</span>;
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          return <div>
            <a className="operation" onClick={() => {
              const list = JSON.stringify(record);
              window.sessionStorage.setItem('carousel', list);
              location.hash = '/InterfaceManagement/HomeLayout/EditCarousel?isEdit=true&isCheck=false';
            }} 
            style={{ display: updatePowers ? 'inline-block' : 'none' }}
             >编辑 </a>
            <Divider type="vertical" />
            <a className="operation" onClick={() => {
              const list = JSON.stringify(record);
              window.sessionStorage.setItem('carousel', list);
              location.hash = '/InterfaceManagement/HomeLayout/CarouselDetail?isCheck=true&isEdit=false';
            }} 
            style={{ display: readPowers ? 'inline-block' : 'none' }}
             > 详情</a>
          </div>;
        },
      },
    ];

    const cIdsQF=`Q=categoryId_S_ST=${this.state.selectedValues}`;

    const search = [
      { key: 'pictureTitle', label: '标题名称',qFilter:'Q=pictureTitle',type:'input'},
      {
        key: 'parentName',
        label: '关联菜单',
        qFilter: 'Q=parentName',
        type: 'select',
        option: this.state.columnsOptions,
        // code: 'carousel'
      },
      { key: 'isEnabled', label: '是否启用', qFilter: 'Q=isEnabled', type: 'select', option: isEnabledOption },
    ];
      //设置formItem的格式
    const formItemLayout = {
      labelCol: {
        xs: { span: 12},
        sm: { span: 2},
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
    };

    return <div className="CarouselDetail1">

      <TableAndSearch columns={columns} 
      type="CarouselCarousel"
      rowkey="id"
      // url={'services/system/loopPicture/list'} wgs0729原来的
       url={'services/web/config/loopPicture/getList'} 
       search={search}
        addBtn={
          createPowers ?
          { order: 1, url: 'InterfaceManagement/HomeLayout/NewCarousel?isEdit=false' } 
          : null
        }
        deleteBtn={
          deletePowers ?
           { order: 2, url:'services/web/config/loopPicture/delete'}
            : null
            } />
    </div>;
  }
}

