import React, { Component } from "react";
import { getToken } from '../utils/ProjectUtils';
import "./BaseLayout.less";
export default class Title extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad:true,
      titleList: [
        // { key: 1, value: "采购信息报送", isActive: true, isShow:true, Path: "/InformationSubmit" },
        { key: 2, value: "信息审核", isActive: false, isShow:true, Path: "/InformationExamine" },
        { key: 3, value: "信息汇总", isActive: false, isShow:true, Path: "/InformationCollect" }
      ],
    };
  }
  componentDidMount(){
    this.setState({isLoad:true})
  }

  componentDidUpdate(){
    let {isLoad} = this.state;
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if(isLoad&&userInfo){
      let hasReviewedRight = userInfo.hasReviewedRight;
      let list = []
      if(!hasReviewedRight){
        list = [
          { key: 1,value: "采购信息报送",isActive: true, isShow:true,Path: "/InformationSubmit" },
          // { key: 2, value: "信息审核", isActive: false, isShow:true, Path: "/InformationExamine" },
          // { key: 3, value: "信息汇总", isActive: false, isShow:true, Path: "/InformationCollect" }
        ]
        this.setState({titleList:list,isLoad:false})
      }else{
        this.setState({isLoad:false})
      }
    }
    
  }


  TabPane = (data) => {
    location.hash = data.Path;
  };

  render() {
    const { titleList,isLoad } = this.state;


    if(!getToken()){
      location.hash = '/'
    }

    return (
      <div id="web" className={!isLoad?'showWen':'hideWeb'}>
        <div className="top">安可替代工程进度信息报送系统</div>
        <div className="top-content">
          <div>
            {titleList.map((item) => {
              const isSelect = location.hash.indexOf(item.Path) > 0;
              return (
                <div className={`top-content-tab ${isSelect ? "top-content-tab-active" : "" }`} key={item.key} 
                onClick={() => this.TabPane(item)}>
                  <span className='top-content-tab-title'>
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mainContent">{this.props.children}</div>
        </div>
        <div className='projectFooter'>技术支持：武汉烽火信息集成技术有限公司 联系电话：82401337</div>
      </div>
    );
  }
}
