import React, { Component, Fragment } from 'react';
import HomeData from './homeData';
// import Detail from './newDetail';
import styles from './index.less';
import { storage } from '@/utils/utils';
import { connect } from 'dva';

@connect(({ menu, home, partyTask }) => ({ menu, home, partyTask }))
// 首页
class Home extends Component {
  constructor(props) {
    super(props);
    this.userInfo = JSON.parse(storage.getLocal('userInfo'));
    this.state = {
      leftList: [],
      rightList: [],
      leftList2: [],
      rightList2: [],
      imgList: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.getAlldata(); //接口待定
    // 默认跳转党建任务接收列表，职务为最高职务。
    dispatch({
      type: 'partyTask/clear',
    });
  }

  getAlldata = () => {
    const { dispatch } = this.props;
    //获取党建宣传
    const party = {
      type: 1,
      pagesize: 5,
      msgId: 'QRY_NEWS_TOP10',
      userId: this.userInfo.id,
    };
    dispatch({
      type: 'home/getNewList',
      payload: {
        text: JSON.stringify(party),
      },
      callback: data => {
        this.setState({ leftList: data });
      },
    });
    //获取精品示范
    const quality = {
      type: 2,
      pagesize: 5,
      msgId: 'QRY_NEWS_TOP10',
      userId: this.userInfo.id,
    };
    dispatch({
      type: 'home/getNewList',
      payload: {
        text: JSON.stringify(quality),
      },
      callback: data => {
        // console.log(data);
        this.setState({ rightList: data });
      },
    });
    //党建测评
    const test = {
      type: 3,
      pagesize: 5,
      msgId: 'QRY_NEWS_TOP10',
      userId: this.userInfo.id,
    };
    dispatch({
      type: 'home/getNewList',
      payload: {
        text: JSON.stringify(test),
      },
      callback: data => {
        // console.log(data);
        this.setState({ leftList2: data });
      },
    });
    //党建测评
    const study = {
      type: 4,
      pagesize: 5,
      msgId: 'QRY_NEWS_TOP10',
      userId: this.userInfo.id,
    };
    dispatch({
      type: 'home/getNewList',
      payload: {
        text: JSON.stringify(study),
      },
      callback: data => {
        // console.log(data);
        this.setState({ rightList2: data });
      },
    });

    // 获取轮播图片
    const imgQuest = {
      department: `${this.userInfo.orgid}`,
      isSelf: false,
      msgId: 'APP007',
      userId: this.userInfo.id,
    };
    dispatch({
      type: 'home/getImgs',
      payload: {
        text: JSON.stringify(imgQuest),
      },
      callback: resp => {
        this.setState({ imgList: resp });
      },
    });

    // 获取用户层级
    const formDataLevel = {
      msgId: 'GET_USER_LEVEL',
      userId: this.userInfo.id,
    };

    dispatch({
      type: 'home/getUserLevel',
      payload: {
        text: JSON.stringify(formDataLevel),
      },
      callBack: resp => {
        if (resp && resp.length) {
          // 获取未完成任务数量
          const formTaskData = {
            level: resp[0].level,
            msgId: 'GET_USER_UNDOING',
            partyId: resp[0].value,
            userId: this.userInfo ? this.userInfo.id : '',
          };
          dispatch({
            type: 'home/getTaskCount',
            payload: {
              text: JSON.stringify(formTaskData),
            },
          });
        }
      },
    });
  };

  linkTo = item => {
    let path = '';
    if (`${item.type}` === '4') {
      path = `${window.location.href}/topics/${item.id}`;
    } else {
      path = `${window.location.href}/${`${item.objectType}` === '2' ? 'activity' : 'news'}?id=${
        item.id
      }&subType=${item.type}`;
    }
    window.open(path, '_blank');
  };

  render() {
    const { leftList, rightList, leftList2, rightList2, imgList } = this.state;
    const {
      children,
      home,
      location: { pathname },
    } = this.props;
    const { informationList } = home;
    const arrKey = pathname.split('/');
    return (
      <Fragment>
        <div
          className={styles.main}
          style={{ display: arrKey.length < 3 ? 'inline-block' : 'none' }}
        >
          <div>
            <div className={styles.top}>
              <HomeData {...this.props} informationList={informationList} imgList={imgList}/>
            </div>
            <div className={styles.bottom}>
              <div className={styles.newTitleContent}>
                <i className={styles.titleIcon}/>
                <span className={styles.newTitle}>党建宣传</span>
              </div>
              <div className={styles.titleDvider}/>
              <div className={styles.newTitleContent2}>
                <i className={styles.titleIcon}/>
                <span className={styles.newTitle}>精品示范</span>
              </div>
              <div className={styles.titleDvider2}/>
              <div className={styles.newsListContent}>

                <div className={styles.newListLeft} style={{ marginRight: 35 }}>
                  {leftList.length > 0 ? (leftList.slice(0, 5).map(item => (
                    <div
                      onClick={() => this.linkTo(item)}
                      key={item.id}
                      className={styles.newItem}
                    >
                      <i className={styles.newItemIcon}/>
                      <span className={item.hasNew ? styles.newItemTitle : styles.itemTitle}>
                          {item.title}
                        </span>
                      {item.hasNew ? <span className={styles.newIcon}/> : null}
                      <span className={styles.newItemTime}>{item.updateTime}</span>
                    </div>
                  ))) : null}
                </div>

                <div className={styles.newListLeft}>
                  {rightList.length > 0 ? (rightList.slice(0, 5).map(item => (
                    <div
                      onClick={() => this.linkTo(item)}
                      key={item.id}
                      className={styles.newItem}
                    >
                      <i className={styles.newItemIcon}/>
                      <span className={item.hasNew ? styles.newItemTitle : styles.itemTitle}>
                          {item.title}
                        </span>
                      {item.hasNew ? <span className={styles.newIcon}/> : null}
                      <span className={styles.newItemTime}>{item.updateTime}</span>
                    </div>
                  ))) : null}
                </div>
              </div>
            </div>
            <div className={styles.bottom}>
              <div className={styles.newTitleContent}>
                <i className={styles.titleIcon}/>
                <span className={styles.newTitle}>基层动态</span>
              </div>
              <div className={styles.titleDvider}/>
              <div className={styles.newTitleContent2}>
                <i className={styles.titleIcon}/>
                <span className={styles.newTitle}>学习园地</span>
              </div>
              <div className={styles.titleDvider2}/>
              <div className={styles.newsListContent}>
                <div className={styles.newListLeft} style={{ marginRight: 35 }}>
                  {leftList2.length > 0 ? (
                    leftList2.slice(0, 5).map(item => (
                      <div
                        onClick={() => this.linkTo(item)}
                        key={item.id}
                        className={styles.newItem}
                      >
                        <i className={styles.newItemIcon}/>
                        <span className={item.hasNew ? styles.newItemTitle : styles.itemTitle}>
                          {item.title}
                        </span>
                        {item.hasNew ? <span className={styles.newIcon}/> : null}
                        <span className={styles.newItemTime}>{item.updateTime}</span>
                      </div>
                    ))) : null}
                </div>

                <div className={styles.newListLeft}>
                  {rightList2.length > 0 ? (rightList2.slice(0, 5).map(item => (
                    <div
                      onClick={() => this.linkTo(item)}
                      key={item.id}
                      className={styles.newItem}
                    >
                      <i className={styles.newItemIcon}/>
                      <span className={item.hasNew ? styles.newItemTitle : styles.itemTitle}>
                          {item.title}
                        </span>
                      {item.hasNew ? <span className={styles.newIcon}/> : null}
                      <span className={styles.newItemTime}>{item.updateTime}</span>
                    </div>
                  ))) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        {children && arrKey.length >= 3 ? <div className={styles.newDetail}>{children}</div> : null}
      </Fragment>
    );
  }
}

export default Home;
