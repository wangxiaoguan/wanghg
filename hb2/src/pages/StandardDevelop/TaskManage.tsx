import React, { Component } from 'react';
import { Card, Progress, List, Button, Tooltip } from 'antd';
import OverviewCard from './component/OverviewCard';
import Point from './component/Point';
import ProgressBar from './component/ProgressBar';
import PointLine from './component/PointLine';
import StatusPoint from './component/StatusPoint';
import FileManage from './FileManage';
import HtmlUtil from '@/utils/HtmlUtil';
import CardProgress from './component/CardProgress';
import { connect } from 'dva';

const classNames = require('./TaskManage.less');

const STEP_COUNT = 8;

interface ITaskManageState {
  showPointCount: number;
  showPointLineCount: number;
  showProgressCount: number;
  showStatusPointCount: number
  showLine: boolean;
  hoverStatus: number;
  hoverStatusColor: string;
  hoverStep: number;
  stepID: number,
  stepClickPosition: any;

  /**
   * 显式模式，1表示流程图，2表示统计图
   */
  displayMode: number;
}


@connect(({ loading }) => ({
  loading
}))
class TaskManage extends Component<any, ITaskManageState> {
  private projectData = {
    name: '湖北科技项目',
    percent: 0,
    useTime: '6-12个月',
    header: '张主任',
    area: '空气治理',
    level: '国家级',
    memberCount: 5,
    moneyAmount: 50000000,
    percents: [0, 0, 0, 0, 0, 0, 0, 0],   //各阶段进度百分比
  };

  private fileDataSource = [
    {
      id: 1,
      name: '申报表',
      status: 1,
      step: [1, 2, 6, 7],
    },
    {
      id: 2,
      name: '编制说明',
      status: 1,
      step: [1, 2, 5, 6, 7],
    },
    {
      id: 3,
      name: '项目计划',
      status: 3,
      step: [1],
    },

    {
      id: 4,
      name: '标准草案',
      status: 2,
      step: [1, 3, 4, 6, 7],
    },
    {
      id: 5,
      name: '查新报告委托单',
      status: 1,
      step: [1],
    },
    {
      id: 6,
      name: '答辩通知（PDF)',
      status: 4,
      step: [3],
    },
    {
      id: 7,
      name: '立项通知(PDF)',
      status: 4,
      step: [3, 6, 7],
    },
    {
      id: 8,
      name: '征求意见函',
      status: 2,
      step: [4],
    },
    {
      id: 9,
      name: '意见反馈表',
      status: 3,
      step: [4, 6],
    },
    {
      id: 10,
      name: '企业上会申请',
      status: 2,
      step: [5],
    },
    {
      id: 11,
      name: '会议通知',
      status: 3,
      step: [5],
    },
    {
      id: 12,
      name: '专家签字表',
      status: 3,
      step: [5, 6],
    },
    {
      id: 13,
      name: '评审意见表',
      status: 1,
      step: [5, 6],
    },
    {
      id: 14,
      name: '征求意见汇总表',
      status: 1,
      step: [4, 6],
    },
    {
      id: 15,
      name: '评审意见汇总表',
      status: 1,
      step: [5, 6],
    },
    {
      id: 16,
      name: '审批表',
      status: 1,
      step: [5, 6],
    },
    {
      id: 17,
      name: '审查委托书',
      status: 1,
      step: [5, 6],
    },
    {
      id: 18,
      name: '检测报告',
      status: 1,
      step: [6],
    },
    {
      id: 19,
      name: '立项答辩PPT',
      status: 1,
      step: [3],
    },
    {
      id: 20,
      name: '查新报告',
      status: 1,
      step: [6],
    },
    {
      id: 21,
      name: '发布公告',
      status: 1,
      step: [8],
    },
    {
      id: 22,
      name: '正式文本',
      status: 1,
      step: [8],
    },
    {
      id: 23,
      name: '项目合同',
      status: 1,
      step: [1],
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      showPointCount: 0,
      showPointLineCount: 0,
      showProgressCount: 0,
      showStatusPointCount: 0,
      showLine: false,
      // 当前鼠标移在哪种状态图标上
      hoverStatus: null,
      hoverStatusColor: null,
      hoverStep: null,
      stepID: null,
      stepClickPosition: null,

      displayMode: 1,
      allFloderList:[]
    }
  }

  componentDidMount() {
    // console.log(this.getId(this.props))
    this.requestTotalData(this.getId(this.props),(res)=>{
      console.log(res)
      setTimeout(() => {
        this.projectData = {
          name: res.data[0].projectName,
          percent: 33,
          useTime: '6-12个月',
          header: res.data[0].head,
          area: '空气治理',
          level: '国家级',
          memberCount: res.data[0].projectMember,
          moneyAmount: res.data[0].projectAmonut,
          percents: [res.data[0].persent, res.data[1].persent, res.data[2].persent, res.data[3].persent, res.data[4].persent, res.data[5].persent, res.data[6].persent, res.data[7].persent],   //各阶段进度百分比
        };
        this.forceUpdate();
      }, 3000);
    })

    this.requestFLoderList((res)=>{
      console.log(res)
      this.setState({
        allFloderList:res.data
      })
    })

    this.pointInterval();
    setTimeout(() => {
      this.pointLineInterval();
    }, 300);
    //一个圆点的动画是1秒，对应的进度条需要在圆点动画完成后再开始
    setTimeout(() => {
      this.progressBarInterval();
    }, 800);

    setTimeout(() => {
      this.statusPointInterval();
    }, 2000);

    // 模块数据延迟
    // setTimeout(() => {
    //   this.projectData = {
    //     name: '湖北科技项目',
    //     percent: 33,
    //     useTime: '6-12个月',
    //     header: '张主任',
    //     area: '空气治理',
    //     level: '国家级',
    //     memberCount: 5,
    //     moneyAmount: 50000000,
    //     percents: [100, 20, 56, 78, 90, 23, 34, 75],   //各阶段进度百分比
    //   };
    //   this.forceUpdate();
    // }, 3000);
  }

  requestTotalData=(id,callback)=>{
    this.props.dispatch({
      type:'TaskManage/TotalData',
      payLoad:{
        id,
      },
      callBack:(res)=>{
        callback(res)
      }
    })
  }

  requestFLoderList=(callback)=>{
    this.props.dispatch({
      type:'TaskManage/FLoderList',
      // payLoad:{
      //   step,
      // },
      callBack:(res)=>{
        callback(res)
      }
    })
  }

  getId(props) {
    return props.match.params.id;
  }

  pointInterval() {
    let id = setInterval(() => {
      const count = this.state.showPointCount + 1;
      if (count >= STEP_COUNT) {
        clearInterval(id);
        this.showLine();
      }
      this.setState({ showPointCount: count });
    }, 300);
  }

  pointLineInterval() {
    let id = setInterval(() => {
      const count = this.state.showPointLineCount + 1;
      if (count >= STEP_COUNT) {
        clearInterval(id);
        this.showLine();
      }
      this.setState({ showPointLineCount: count });
    }, 300);
  }

  progressBarInterval() {
    let id = setInterval(() => {
      const count = this.state.showProgressCount + 1;
      if (count >= STEP_COUNT) {
        clearInterval(id);
        this.showLine();
      }
      this.setState({ showProgressCount: count });
    }, 300);
  }

  statusPointInterval() {
    let id = setInterval(() => {
      const count = this.state.showStatusPointCount + 1;
      if (count >= STEP_COUNT) {
        clearInterval(id);
        this.showLine();
      }
      this.setState({ showStatusPointCount: count });
    }, 300);
  }

  showLine() {
    this.setState({ showLine: true });
  }

  setStep(stepID, event) {
    const p = HtmlUtil.globalToLocal(HtmlUtil.getMouseEventPosition(event.nativeEvent), document.getElementById('taskManage'));
    this.setState({ stepID, stepClickPosition: p }, () => this.changeFileManage());
    // this.requestFileList(stepID,(res)=>{
    //   console.log(res)
    // })
  }

  changeFileManage() {
    const orgP = this.state.stepClickPosition;
    const element: HTMLElement = document.getElementById('fileManage');
    const orgT = element.style.transform;
    const transition = element.style.transition;
    // console.log(element)
    element.style.transition = 'none';
    element.style.transform = 'scale(1,1)';
    element.style.transformOrigin = `${orgP.x}px ${orgP.y}px`;
    element.style.transform = orgT;

    //关闭
    setTimeout(() => {
      element.style.transition = transition;
      element.style.transform = this.state.stepID !== null ? 'scale(1,1)' : 'scale(0,0)';
    }, 100);
  }

  render() {
    const projectData = this.projectData;
    return (
      <div id='taskManage' className={classNames.TaskManage}>
        <FileManage
          id='fileManage'
          className={classNames.FileManage}
          stepInfo = {{
            stepID:this.state.stepID,
            stepPrecent:projectData.percents[this.state.stepID-1],
            floderList:this.state.allFloderList[this.state.stepID-1],
            taskID:this.getId(this.props),
          }}
          closeHandler={() => {
            this.setState({ stepID: null }, () => this.changeFileManage());
          }}
        />
        <div className={classNames.Left}>
          <Card title='项目概览' className={classNames.OverviewContainer}>
            <OverviewCard
              footerStyle={{ backgroundColor: 'transparent' }}
              style={{ backgroundColor: '#1bc270' }}
              footer={[<span key='1' />, <span key={2}>地方标准</span>]}
            >
              <div className={classNames.Card1}>
                <Progress
                  width={112}
                  strokeColor='white'
                  strokeWidth={10}
                  strokeLinecap="square"
                  type="circle"
                  percent={projectData.percent}
                  className={classNames.Progress}
                  format={percent => <span>{percent}<b>%</b></span>}
                />
                <div className={classNames.Right}>
                  <h1>总进度</h1>
                  <h2>{projectData.name}</h2>
                </div>
              </div>
            </OverviewCard>
            <OverviewCard
              style={{ backgroundColor: '#ff9b51' }}
              footer={[<span key='1'>{projectData.useTime}</span>, <span key='2'>{projectData.header}</span>]}
            >
              <div className={classNames.Card2}>
                <img src={require('@/assets/StandardDevelop/iconPerson.png')} />
                <div className={classNames.Right}>
                  <span>项目成员：</span>
                  <b>{projectData.memberCount}</b>
                </div>
              </div>
            </OverviewCard>
            <OverviewCard
              style={{ backgroundColor: '#17b1a6' }}
              footer={[<span key='1'>领域：{projectData.area}</span>, <span key='2'>{projectData.level}</span>]}
            >
              <div className={classNames.Card3}>
                <img src={require('@/assets/StandardDevelop/iconBook.png')} />
                <div className={classNames.Right}>
                  <h2>项目金额</h2>
                  <h1>{projectData.moneyAmount}</h1>
                </div>
              </div>
            </OverviewCard>
          </Card>
          <Card title='项目进度' style={{ marginTop: 20 }} extra={<div>
            <Button className={`${classNames.BtnTab} ${this.state.displayMode === 1 ? classNames.BtnTabSelected : ''}`} style={{ marginRight: 10 }} onClick={() => this.setState({ displayMode: 1 })}>流程图</Button>
            <Button className={`${classNames.BtnTab} ${this.state.displayMode === 2 ? classNames.BtnTabSelected : ''}`} onClick={() => this.setState({ displayMode: 2 })}>统计视图</Button>
          </div>}>
            {
              this.state.displayMode === 1 ? (
                <div className={classNames.FlowContainer}>
                  {
                    this.state.showLine &&
                    <div className={classNames.ImgLine} style={{ backgroundImage: `url(${require('@/assets/StandardDevelop/line.png')})` }} />
                  }
                  {
                    [
                      <PointLine key='1' src={require('@/assets/StandardDevelop/sline1.png')} style={{ left: 12, top: -37 }} />,
                      <PointLine key='2' src={require('@/assets/StandardDevelop/sline2.png')} style={{ left: 114, top: 208 }} />,
                      <PointLine key='3' src={require('@/assets/StandardDevelop/sline3.png')} style={{ left: 226, top: 118 }} />,
                      <PointLine key='4' src={require('@/assets/StandardDevelop/sline4.png')} style={{ left: 332, top: -37 }} />,
                      <PointLine key='5' src={require('@/assets/StandardDevelop/sline5.png')} style={{ left: 435, top: 28 }} />,
                      <PointLine key='6' src={require('@/assets/StandardDevelop/sline6.png')} style={{ left: 535, top: 208 }} />,
                      <PointLine key='7' src={require('@/assets/StandardDevelop/sline7.png')} style={{ left: 647, top: 122 }} />,
                      <PointLine key='8' src={require('@/assets/StandardDevelop/sline8.png')} style={{ left: 749, top: -37 }} />,
                    ].slice(0, this.state.showPointLineCount)
                  }
                  {
                    [
                      {
                        stepID: 1,
                        left: 17,
                        top: 122,
                        themeColor: '#1bc270',
                      },
                      {
                        stepID: 2,
                        left: 122,
                        top: 223,
                        themeColor: '#1bc270',
                      },
                      {
                        stepID: 3,
                        left: 227,
                        top: 122,
                        themeColor: '#3fa9f5',
                      },
                      {
                        stepID: 4,
                        left: 335,
                        top: 13,
                        themeColor: '#3fa9f5',
                      },
                      {
                        stepID: 5,
                        left: 438,
                        top: 122,
                        themeColor: '#3fa9f5',
                      },
                      {
                        stepID: 6,
                        left: 542,
                        top: 223,
                        themeColor: '#ff9b51',
                      },
                      {
                        stepID: 7,
                        left: 647,
                        top: 122,
                        themeColor: '#3fa9f5',
                      },
                      {
                        stepID: 8,
                        left: 753,
                        top: 13,
                        themeColor: '#3fa9f5',
                      },
                    ].slice(0, this.state.showPointCount).map((item) => {
                      return <Point
                        onMouseEnter={() => {
                          this.setState({ hoverStep: item.stepID });
                        }}
                        onMouseLeave={() => {
                          this.setState({ hoverStep: null });
                        }}
                        onClick={(event) => {
                          this.setStep(item.stepID, event);
                        }}
                        key={item.stepID}
                        themecolor={item.themeColor}
                        text={item.stepID}
                        style={{ top: item.top, left: item.left }}
                      />;
                    })
                  }
                  {
                    [
                      <ProgressBar key='1' label='预研究' percenet={projectData.percents[0]} themecolor='#1bc270' style={{ left: 104, top: -46 }} />,
                      <ProgressBar key='2' label='请章&查新' percenet={projectData.percents[1]} themecolor='#1bc270' style={{ left: 160, top: 264 }} />,
                      <ProgressBar key='3' label='立项&答辩' percenet={projectData.percents[2]} themecolor='#1bc270' style={{ left: 280, top: 189 }} />,
                      <ProgressBar key='4' label='征求意见' percenet={projectData.percents[3]} themecolor='#1bc270' style={{ left: 386, top: -46 }} />,
                      <ProgressBar key='5' label='评审准备' percenet={projectData.percents[4]} themecolor='#1bc270' style={{ left: 497, top: 18 }} />,
                      <ProgressBar key='6' label='评审会' percenet={projectData.percents[5]} themecolor='#ff9b51' style={{ left: 582, top: 264 }} />,
                      <ProgressBar key='7' label='审核' percenet={projectData.percents[6]} themecolor='#1bc270' style={{ left: 693, top: 174 }} />,
                      <ProgressBar key='8' label='发布' percenet={projectData.percents[7]} themecolor='#1bc270' style={{ left: 783, top: -46 }} />,
                    ].slice(0, this.state.showProgressCount)
                  }
                  {
                    [
                      <StatusPoint
                        onMouseEnter={() => this.setState({ hoverStatus: 1, hoverStatusColor: '#3fa9f5' })}
                        onMouseLeave={() => this.setState({ hoverStatus: null, hoverStatusColor: null })}
                        key='1'
                        style={{ left: 70, top: 70 }}
                        label='待处理'
                        themecolor='#3fa9f5'
                        img={require('@/assets/StandardDevelop/waitDeal.png')}
                      />,
                      <StatusPoint
                        onMouseEnter={() => this.setState({ hoverStatus: 2, hoverStatusColor: '#17b1a6' })}
                        onMouseLeave={() => this.setState({ hoverStatus: null, hoverStatusColor: null })}
                        key='2'
                        style={{ left: 284, top: 70 }}
                        label='待提交' themecolor='#17b1a6'
                        img={require('@/assets/StandardDevelop/waitSubmit.png')}
                      />,
                      <StatusPoint
                        onMouseEnter={() => this.setState({ hoverStatus: 3, hoverStatusColor: '#ff9b51' })}
                        onMouseLeave={() => this.setState({ hoverStatus: null, hoverStatusColor: null })}
                        key='3'
                        style={{ left: 492, top: 70 }}
                        label='待审核'
                        themecolor='#ff9b51'
                        img={require('@/assets/StandardDevelop/waitCheck.png')}
                      />,
                      <StatusPoint
                        onMouseEnter={() => this.setState({ hoverStatus: 4, hoverStatusColor: '#1cc271' })}
                        onMouseLeave={() => this.setState({ hoverStatus: null, hoverStatusColor: null })}
                        key='4'
                        style={{ left: 705, top: 70 }}
                        label='已完成'
                        themecolor='#1cc271'
                        img={require('@/assets/StandardDevelop/complete.png')}
                      />,
                    ].slice(0, this.state.showStatusPointCount)
                  }
                </div>
              )
                :
                (
                  <div className={classNames.FlatContainer}>
                    <CardProgress index='S01' label='预研究' percent={projectData.percents[0]} />,
                  <CardProgress index='S02' label='请章&查新' percent={projectData.percents[1]} />,
                  <CardProgress index='S03' label='立项&答辩' percent={projectData.percents[2]} />,
                  <CardProgress index='S04' label='征求意见' percent={projectData.percents[3]} />,
                  <CardProgress index='S05' label='评审准备' percent={projectData.percents[4]} />,
                  <CardProgress index='S06' label='评审会' percent={projectData.percents[5]} />,
                  <CardProgress index='S07' label='审核' percent={projectData.percents[6]} />,
                  <CardProgress index='S08' label='发布' percent={projectData.percents[7]} />,
                </div>
                )
            }


          </Card>

        </div>
        <div className={classNames.Right}>
          <Card title="项目文档">
            <List dataSource={this.fileDataSource} renderItem={(item) => {
              //如果鼠标移在某一步骤，且当前文件属于这一步骤，显示蓝色
              let style: any = {};
              if (this.state.hoverStep && item.step.indexOf(this.state.hoverStep) >= 0) {
                style.backgroundColor = '#1cc271';
              }
              //如果鼠标移在某一阶段，且当前文件属性于这一阶段，显示阶段颜色
              else if (this.state.hoverStatus && item.status === this.state.hoverStatus) {
                style.backgroundColor = this.state.hoverStatusColor;
              }

              if (style.backgroundColor) {
                style.color = 'white';
              }
              return (
                <Tooltip title={item.name}>
                  <li className={classNames.FileItem} style={style}> {item.name}</li>
                </Tooltip>
              );
            }} />
          </Card>
        </div>
      </div>
    );
  }
}

export default TaskManage;