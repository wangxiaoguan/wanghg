/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import React, { Component, Fragment } from 'react';
import { Spin, Typography, Popover } from 'antd';
import { connect } from 'dva';
import * as d3 from 'd3';

import styles from './index.less';

let flag = 0;
const { Paragraph } = Typography;
// 节点数量
let maxFlag = 0;

const generaterList = data => {
  for (let i = 0; i < data.length; i += 1) {
    maxFlag += 1;
    if (data[i].children) {
      generaterList(data[i].children);
    }
  }
};

@connect(({ globalhome, loading }) => ({
  globalhome,
  loading: loading.effects['globalhome/getOrganization'],
}))
class OrganizationChart extends Component {
  constructor(props) {
    super(props);
    this.duitLength = 5;
    // 模态框显示方向
    this.decrip = false;
    this.state = {
      organizationInfo: {},
      modalLoading: true,
      storageData: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    window.addEventListener('resize', this.resize);
    this.rectObject = document.getElementById('pedigreehoriz').getBoundingClientRect();
    const formData = {
      msgId: 'PARTY_FRAMEWORK',
    };
    dispatch({
      type: 'globalhome/getOrganization',
      payload: {
        text: JSON.stringify(formData),
      },
      callBack: res => {
        if (res.code === '0' && res.resultMap && res.resultMap.partyOrganization) {
          const root = res.resultMap.partyOrganization;
          let count = root.children.length;
          for (let i = 0; i < root.children.length; i++) {
            if (root.children[i].children.length) {
              count += root.children[i].children.length - 1;
              for (let j = 0; j < root.children[i].children.length; j++) {
                if (
                  root.children[i].children[j].children &&
                  root.children[i].children[j].children.length
                ) {
                  count += root.children[i].children[j].children.length - 1;
                }
              }
            }
          }
          this.getOrganization(root, count);
        }
      },
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.rectObject = document.getElementById('pedigreehoriz').getBoundingClientRect();
  };

  getModelPosition = e => {
    const box = {
      width: 0,
      height: 0,
    };
    if (e.depth === 0) {
      box.width = e.x;
      box.height = e.y + 100;
    } else if (e.depth === 1) {
      box.width = e.x - 20;
      box.height = e.y + 140;
    } else if (e.depth === 2) {
      box.width = e.x - 20;
      box.height = e.y + 155;
    } else {
      box.width = e.x - 20;
      box.height = 335;
    }
    box.width += this.rectObject.top - 16;
    box.height += this.rectObject.left;
    return box;
  };

  getNameByList = list => {
    const name = [];
    let duitNameList = [];
    let shuJi = {};
    let fuShuJi = {};
    for (let i = 0; i < list.length; i++) {
      if (list[i].userNames && list[i].userNames.length) {
        if (list[i].duitName.length + 1 > this.duitLength) {
          this.duitLength = list[i].duitName.length + 1;
        }
        // 确保书记和副书记在前
        if (list[i].duitName === '书记') {
          shuJi = { duitName: list[i].duitName, duitNames: list[i].userNames.join(',') };
        } else if (list[i].duitName === '副书记') {
          fuShuJi = { duitName: list[i].duitName, duitNames: list[i].userNames.join(',') };
        } else {
          duitNameList.push({ duitName: list[i].duitName, duitNames: list[i].userNames.join(',') });
        }
      }
    }
    if (fuShuJi.duitName) {
      duitNameList = [fuShuJi, ...duitNameList];
    }
    if (shuJi.duitName) {
      duitNameList = [shuJi, ...duitNameList];
    }
    return duitNameList;
  };

  displayModel = (res, e) => {
    const item = res.resultMap;
    if (item === undefined || item.name === undefined) {
      return;
    }
    const organizationInfo = {
      name: item.name,
      memCount: item.memCount,
      partyId: e.id,
      duitNameList: this.getNameByList(item.list),
    };
    const box = this.getModelPosition(e);
    if (e.depth > 2) {
      document.getElementById('model').style.left = `${box.height - this.duitLength * 15}px`;
    }
    this.setState(() => ({
      organizationInfo,
      storageData: { res, id: e.id },
      modalLoading: false,
    }));
  };

  getOrganization = (root, count) => {
    const that = this;
    maxFlag = 0;
    generaterList(root.children);
    const width = maxFlag * 36;
    const height = 815;
    const boxWidth = 200;
    const boxHeight = 150;
    const tree = d3.layout.tree().size([width, height - 200]);
    // .separation((a, b) => (a.parent === b.parent ? 1 : 2));

    const diagonal = d3.svg.diagonal().projection(d => [d.x, d.y]);

    const svg = d3
      .select('#pedigreehoriz')
      .append('svg')
      .attr('width', height) // 画布扩大，防止边缘文字被遮挡
      .attr('height', width)
      .append('g')
      .attr('transform', 'translate(20,0)'); // 将图整体下移，以防止顶部节点被遮挡

    const nodes = tree.nodes(root);
    const links = tree.links(nodes);

    drawLine();
    // 将曲线换为折线
    function drawLine() {
      const link = svg.selectAll('path.link').data(links);

      link
        .enter()
        .append('path')
        .attr('class', 'link');

      link.exit().remove();

      link.attr('d', elbow);

      function elbow(d) {
        let sourceY;
        let targetY;
        const sourceX = d.source.x;
        const w1 = d.source.name.length * 12;
        const { depth } = d.source;
        // const sourceY = d.source.y;
        if (depth < 1) {
          sourceY = d.source.y;
        } else if (w1 > 150) {
          sourceY = depth === 2 ? d.source.y + 60 : d.source.y + 40;
        } else if (depth === 2) {
          sourceY = d.source.y + 60;
        } else {
          sourceY = d.source.y + 45;
        }
        const targetX = d.target.x;
        if (depth < 2 && depth > 0) {
          targetY = d.target.y - 40;
        } else if (depth > 2) {
          targetY = d.target.y;
        } else {
          targetY = d.target.y;
        }
        // Mxx,xx,Lxx,xx,Lxx,xx,Lxx,xx
        //  曲线换直线 头部长度 尾部长度
        return `M${sourceY},${sourceX}${' '}L${sourceY + 90},${sourceX}${' '}L${sourceY +
          90},${targetX}${' '}L${targetY},${targetX}`;
      }
    }
    const node = svg
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .on('mouseover', evt => {
        if (!flag) {
          flag = 1;
          if (evt.depth > 2) {
            this.decrip = true;
          }
          that.getOrganizationInfo(evt);
        }
      })
      .on('mouseout', evt => {
        if (flag) {
          this.setState({ organizationInfo: {} }, () => {
            flag = 0;
            this.decrip = false;
            if (document.getElementById('model')) {
              document.getElementById('model').style.display = 'none';
            }
            this.duitLength = 5;
          });
        }
      })
      .attr('class', 'node')
      .attr('transform', d =>
        d.depth === 0 ? `translate(${d.y}, ${d.x})` : `translate(${d.y}, ${d.x})`
      );

    drawRect();

    function getColorByDepth(depth) {
      let color;
      if (depth === 0) {
        color = '#D60D0D';
      } else if (depth === 1) {
        color = '#D16B67';
      } else if (depth === 2) {
        color = '#E97207';
      } else if (depth === 2) {
        color = '#F4A804';
      } else {
        color = '#E0B714';
      }
      return color;
    }

    function getNodePositionByDepth(d, type) {
      const x = 0;
      if (d.depth < 1) {
        return getBroswer(d).x;
      }
      if (d.depth === 1) {
        return 10;
      }
      if (d.depth === 2) {
        return 35;
      }
      if (d.depth === 3) {
        return 70;
      }
      return x;
    }

    function getStyleByDepth(d) {
      let height1;
      let width1;
      let w1 = d.name.length * 36;
      if (d.depth < 1 && getBroswer(d).width) {
        w1 = d.name.length * 30;
      }
      if (d.depth === 0) {
        width1 = 70;
        height1 = w1 > 300 ? w1 : 300;
      } else if (d.depth === 1) {
        width1 = 200;
        height1 = 32;
      } else if (d.depth === 2) {
        width1 = 190;
        height1 = 32;
      } else {
        width1 = 180;
        height1 = 30;
      }
      return {
        width: width1,
        height: height1,
      };
    }

    // 判断浏览器类型
    function getBroswer(d) {
      const sys = {};
      const ua = navigator.userAgent.toLowerCase();
      let s;
      if (ua.match(/edge\/([\d.]+)/)) {
        s = ua.match(/edge\/([\d.]+)/);
        const [edge] = s;
        sys.edge = edge;
      } else if (ua.match(/rv:([\d.]+)\) like gecko/)) {
        s = ua.match(/rv:([\d.]+)\) like gecko/);
        const [ie] = s;
        sys.ie = ie;
      } else if (ua.match(/msie ([\d.]+)/)) {
        s = ua.match(/msie ([\d.]+)/);
        const [ie] = s;
        sys.ie = ie;
      } else if (ua.match(/firefox\/([\d.]+)/)) {
        s = ua.match(/firefox\/([\d.]+)/);
        const [firefox] = s;
        sys.firefox = firefox;
      } else if (ua.match(/chrome\/([\d.]+)/)) {
        s = ua.match(/chrome\/([\d.]+)/);
        const [chrome] = s;
        sys.chrome = chrome;
      } else if (ua.match(/version\/([\d.]+).*safari/)) {
        s = ua.match(/version\/([\d.]+).*safari/);
        const [safari] = s;
        sys.safari = safari;
      }
      if (sys.ie) return { transform: 'rotate(90 0,0)', x: 0, y: -25, space: 8 };
      if (sys.edge) return { transform: 'rotate(90 0,0)', x: 0, y: -25, space: 8 };
      if (sys.firefox) {
        const y = (d.name.length * 24) / 2;
        return { transform: 'rotate(0 0,0)', x: 18, y: -y, space: 1, width: 1 };
      }
      return { transform: 'rotate(0 0,0)', x: 35, y: -0, space: 1 };
    }

    function drawRect() {
      node
        .append('rect')

        .attr('y', d => -getStyleByDepth(d).height / 2)
        .attr('x', d => {
          if (d.depth === 1) {
            return -90;
          }
          if (d.depth === 2) {
            return -60;
          }
          if (d.depth > 2) {
            return -20;
          }
          return 0;
        })
        .attr('width', d => getStyleByDepth(d).width)
        .attr('height', d => getStyleByDepth(d).height)
        // 矩形背景色以及边框颜色宽度
        .attr('fill', d => getColorByDepth(d.depth))
        .attr('stroke', '#996666')
        .attr('rx', '4px')
        .attr('style', 'cursor: pointer');

      node
        .append('text')
        .attr('rotate', 0)
        .attr('transform', d => (d.depth < 1 ? getBroswer(d).transform : 'rotate(0 0,0)'))
        .append('tspan')
        .attr('y', d => {
          if (d.depth < 1) {
            return getBroswer(d).y;
          }
          // if (d.name.length >= 10) {
          //   return -5;
          // }
          return 5;
        })
        .attr('x', d => getNodePositionByDepth(d, 'up'))
        .attr('display', 'inline-block')
        .attr('position', 'relative')
        .attr('width', d => getStyleByDepth(d).width)
        .attr('height', d => getStyleByDepth(d).height)
        .attr('fill', '#fff')
        .attr('style', d =>
          d.depth < 1
            ? `writing-mode:vertical-rl; -webkit-writing-mode: vertical-rl;writing-mode:tb-rl;letter-spacing:${
                getBroswer(d).space
              }px;cursor: pointer`
            : 'cursor: pointer'
        )
        .attr('text-anchor', 'middle')
        .attr('font-size', d => (d.depth > 0 ? '14px' : '24px'))
        .text(d => (d.depth < 1 || d.name.length < 11 ? d.name : `${d.name.substr(0, 11)}...`));
    }
  };

  getOrganizationInfo = e => {
    const { dispatch } = this.props;
    const { storageData } = this.state;
    this.setState({ modalLoading: true, organizationInfo: {} });
    const box = this.getModelPosition(e);
    const docModel = document.getElementById('model');
    if (flag === 1) {
      docModel.style.position = 'absolute';
      docModel.style.display = 'block';
      docModel.style.top = `${box.width}px`;

      if (e.depth > 2) {
        docModel.style.left = `${box.height - this.duitLength * 15}px`;
      } else {
        docModel.style.left = `${box.height}px`;
      }
    }
    // 如果id是同一个，用缓存数据
    if (JSON.stringify(storageData) !== '{}' && storageData.id === e.id) {
      this.displayModel(storageData.res, e);
      return;
    }
    const formData = {
      msgId: 'PARTY_DETAIL',
      partyId: e.id,
    };
    dispatch({
      type: 'globalhome/getOrganizationInfo',
      payload: {
        text: JSON.stringify(formData),
      },
      callBack: res => {
        if (res.code === '0') {
          this.displayModel(res, e);
        }
      },
    });
    //  }
  };

  render() {
    const { organizationInfo, modalLoading } = this.state;
    const { loading } = this.props;
    const duitWdith = this.duitLength * 15;
    return (
      <Fragment>
        <Spin spinning={loading} style={{ marginTop: 50 }}>
          <div id="content" style={{ position: 'relative' }}>
            <div id="pedigreehoriz" style={{ marginBottom: 10 }} />
          </div>
        </Spin>
        <div
          id="model"
          className={this.decrip ? styles.model2 : styles.model}
          style={{ width: duitWdith + 260 }}
        >
          <Spin spinning={modalLoading}>
            {organizationInfo.name ? (
              <div style={{ marginBottom: 10 }}>
                <div className={styles.duitName}>
                  <span className={styles.modelLabel} style={{ width: duitWdith }}>
                    组织名称：
                  </span>
                  <span className={styles.modelDesp}>{organizationInfo.name}</span>
                </div>
                <div className={styles.duitName}>
                  <span className={styles.modelLabel} style={{ width: duitWdith }}>
                    组织人数：
                  </span>
                  <span className={styles.modelDesp}>{organizationInfo.memCount}</span>
                </div>
                {organizationInfo.duitNameList.map(item => (
                  <div className={styles.duitName} key={item.duitName}>
                    {/* {item.duitName && item.duitName.length > 9 ? (
                        <span className={styles.modelLabel} style={{ width: duitWdith }}>
                          <Popover content={item.duitName}>
                            <Paragraph
                              ellipsis={{ rows: 1, expandable: false }}
                              style={{ color: '#a5a5a5' }}
                            >
                              {item.duitName}：
                            </Paragraph>
                          </Popover>
                        </span>
                      ) : ( */}
                    <span className={styles.modelLabel} style={{ width: duitWdith }}>
                      {item.duitName}：
                    </span>
                    {/* )} */}
                    <span className={styles.modelDesp}>{item.duitNames}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ width: 340, height: 80 }} />
            )}
          </Spin>
        </div>
      </Fragment>
    );
  }
}

export default OrganizationChart;

/*


      // .append('tspan')
      // .attr('y', d => (d.depth === 3 ? 14 : 16))
      // .attr('x', d => getNodePositionByDepth(d, 'down'))
      // .attr('fill', '#fff')
      // .attr('style', d => 'cursor: pointer')
      // .attr('text-anchor', 'middle')
      // .attr('font-size', d => (d.depth > 0 ? '14px' : '24px'))
      // .text(d =>
      //   d.depth < 1 || d.name.length < 10 ? '' : d.name.substr(Math.ceil(d.name.length / 2))
      // );

*/
