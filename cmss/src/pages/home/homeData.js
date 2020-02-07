/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Carousel, Badge } from 'antd';
import { storage } from '@/utils/utils';
import commenConfig from '../../../config/commenConfig';
import router from 'umi/router';
import styles from './index.less';

@connect(({ partyTask, thematicEducation, menu }) => ({
  partyTask,
  thematicEducation,
  menu,
}))
class HomeData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleData: [
        {
          title: '主题教育专栏',
          url: 'thematic/1564477096311180/1/305/topics/1566869842174236',
          class: 'item1',
        },
        {
          title: '党建工作统计',
          url: 'task/1564984392317342/partyStat/7',
          class: 'item2',
        },
        {
          title: '主题教育',
          url: 'task/1564984392317342/education/1',
          class: 'item3',
        },
        {
          title: '重要工作部署',
          url: 'task/1564984392317342/deployment/99',
          class: 'item4',
        },
        {
          title: '三会一课',
          url: 'task/1564984392317342/deployment/1',
          class: 'item5',
        },
        {
          title: '我的任务',
          url: 'thematic/1564477096311180/1/1564989821468132',
          class: 'item6',
        },

      ],
    };
  }

  componentDidMount() {
    const { partyTask, menu, dispatch } = this.props;
    const { titleData } = this.state;
    const { navList } = partyTask;
    const { menuDetail } = menu;
    let menuId = '1564477096311180';
    const userInfo = JSON.parse(storage.getLocal('userInfo'));

    // 获取最新党建任务下主题教育url
    if (navList[2].categorylist.length > 0) {
      titleData[2].url = `task/1564984392317342/education/${navList[2].categorylist[0].id}`;
    }
    // 动态菜单，获取最新主题教育菜单Id以及我的任务url
    for (let i = 0; i < menuDetail.length; i++) {
      if (menuDetail[i].name === '主题教育') {
        menuId = menuDetail[i].id;
      }
      if (menuDetail[i].name === '党建任务') {
        titleData[5].url = `task/${menuDetail[i].id}/normalTask/5`;
      }
    }
    const formData = {
      msgId: 'GET_EDU_MENU_CATGORY',
      menuId,
      userId: userInfo.id,
    };
    dispatch({
      type: 'thematicEducation/getThematicNavList',
      payload: { text: JSON.stringify(formData) },
      callback: res => {
        for (let i = 0; i < res.length; i++) {
          if (res[i].name === '我的任务') {
            // titleData[5].url = `thematic/${menuId}/${res[i].type}/${res[i].id}`;
          } else if (res[i].name === '党建工作统计') {
            // if (res[i].categorylist.length) {
            //   titleData[1].url = `thematic/${menuId}/${res[i].categorylist[0].type}/${res[i].categorylist[0].id}`;
            // } else {
            //   titleData[1].url = `thematic/${menuId}/${res[i].type}/${res[i].id}`;
            // }
          } else if (res[i].name === '主题教育专栏') {
            // if (res[i].categorylist.length) {
            //   titleData[0].url = `thematic/${menuId}/${res[i].type}/${res[i].categorylist[0].id}`;
            // } else {
            //   titleData[0].url = `thematic/${menuId}/${res[i].type}/${res[i].id}`;
            // }
          }
          this.setState({ titleData });
        }
      },
    });
    this.setState({ titleData });
  }

  turnToNew = item => {
    // console.log('item', item);
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

  getImgs = () => {
    const { imgList } = this.props;
    // console.log(imgList);
    if (imgList.length > 0) {
      return imgList.map(item => {
        let imageUrl;
        const newImg = item.titleImage;
        if (newImg && newImg.length > 0 && newImg[0].indexOf('http') === -1) {
          imageUrl = `${commenConfig.downPath}/${newImg[0]}`;
        } else if (newImg && newImg.length > 0) {
          imageUrl = `${newImg[0]}`;
        } else {
          imageUrl = '';
        }
        const renderItem = (
          <div>
            <img
              src={`${imageUrl}`}
              alt=""
              onClick={() => this.turnToNew(item)}
              onError={e => {
                const img = document.getElementById(`${item.id}`);
                img.src = require('@/assets/home/empty.jpg');
              }}
              id={`${item.id}`}
            />
          </div>
        );
        if (imgList.length === 1) {
          return [1, 2].map(v => renderItem);
        }
        return renderItem;
      });
    }
    //默认两张相同的图片
    return [1, 2].map(v => (
      <div>
        <img src={require('@/assets/home/empty.jpg')} alt="" />
      </div>
    ));
  };

  render() {
    const { titleData } = this.state;
    const { informationList, imgList } = this.props;
    return (
      <div>
        <div
          className={imgList.length > 1 ? styles.Carousel : `${styles.Carousel} ${styles.ulNone}`}
        >
          <Carousel autoplay>{this.getImgs()}</Carousel>
        </div>
        {titleData.map((item, index) => {
          let count = 0;
          if (item.title === '主题教育' || item.title === '我的任务') {
            for (let key in informationList[6]) {
              count = count + informationList[6][key];
            }
          } else if (item.title === '重要工作部署') {
            count = informationList[99];
          } else if (item.title === '三会一课') {
            count =
              informationList[1] + informationList[2] + informationList[3] + informationList[4];
          }
          return (
            <Badge count={count}>
              <div
                className={`${styles.item} ${styles[item.class]}`}
                style={index === 1 ? { marginBottom: 15 } : null}
                onClick={() => {
                  router.push(`${item.url}`);
                }}
                key={index}
              />
            </Badge>
          );
        })}
      </div>
    );
  }
}

export default HomeData;
