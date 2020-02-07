import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString, postService, getService } from '../../../myFetch';
import ServiceApi from '../../../apiprefix';
import { connect } from 'react-redux';
import { Form, Cascader, Divider, Button,Spin} from 'antd';
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
    };
  }

  componentDidMount(){
    this.setState({ loading: true });
    //获取栏目数据
    getService(ServiceApi+'services/system/cateogry/categoryList/get',data=>{
      console.log('栏目数据：',data);
      let categorys=data.root.list;
      if(categorys){
        //调用接口数据处理函数
        this.getCategoryData(categorys);
        this.setState({
          categoryOption:categorys,
          loading: false,
        });

      }else{
        message.error(data.retMsg);
        this.setState({ loading: false });
      }
    }
    );
    this.setState({
      isEnabledOption : [
        {
          key: '', value: '全部',
        },
        {
          key: 'true', value: '是',
        }, {
          key: 'false', value: '否',
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
    let createPowers = powers && powers['20001.21402.001'];
    let updatePowers = powers && powers['20001.21402.002'];
    let readPowers = powers && powers['20001.21402.003'];
    let deletePowers = powers && powers['20001.21402.004'];

    const columns = [
      {
        title: '所属栏目',
        dataIndex: 'categoryName',
        key: 'categoryName',
      },
      {
        title: '标题名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '轮播图片',
        dataIndex: 'pictureUrl',
        key: 'pictureUrl',
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
              location.hash = '/SystemSettings/HomeLayout/EditCarousel?isEdit=true&isCheck=false';
            }} style={{ display: updatePowers ? 'inline-block' : 'none' }} >编辑 </a>
            <Divider type="vertical" />
            <a className="operation" onClick={() => {
              const list = JSON.stringify(record);
              window.sessionStorage.setItem('carousel', list);
              location.hash = '/SystemSettings/HomeLayout/CarouselDetail?isCheck=true&isEdit=false';
            }} style={{ display: readPowers ? 'inline-block' : 'none' }} > 详情</a>
          </div>;
        },
      },
    ];

    const cIdsQF=`Q=categoryId_S_ST=${this.state.selectedValues}`;

    const search = [
      {
        key: 'categoryId',
        label: '所属栏目',
        qFilter: 'Q=categoryId_S_LK',
        type: 'cascader',
        option: this.state.categoryOption,
      },
      { key: 'isEnabled', label: '是否启用', qFilter: 'Q=isEnabled_Z_EQ', type: 'select', option: isEnabledOption },
      { key: 'title', label: '标题名称',qFilter:'Q=title_S_LK',type:'input'},
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

      <TableAndSearch columns={columns} url={'services/system/loopPicture/list'} search={search}
        addBtn={createPowers ? { order: 1, url: 'SystemSettings/HomeLayout/NewCarousel?isEdit=false' } : null}
        deleteBtn={deletePowers ? { order: 2, url:'services/system/loopPicture/delete',field:'ids'} : null} />
    </div>;
  }
}

