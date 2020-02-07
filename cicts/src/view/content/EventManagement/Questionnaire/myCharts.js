// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
export function getBaseChartConfig(item,index,callback){
    // 绘制图表
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById(`main${index}`));

   let  xData=[];
   item.titleType!==3&&item.optionInfos.map((item,index)=>{
    xData.push(item.content)
   })
  let yData=[];
  item.titleType!==3&&item.optionInfos.map((item,index)=>{
    yData.push(item.selectCount)
   })
    myChart.setOption({
      title: { text: `${index+1}、${item.titleName}(${item.titleType==1?'单选':(item.titleType==2?'多选':'问答题不统计')})`, left: 'center'},
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.8)',
        extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);',
        textStyle: {
          color: '#6a717b',
        },
        formatter:function(params){
          return ""
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      yAxis: [{
        type: 'category',
        data: xData,
        inverse: true,
        axisTick: {
          alignWithLabel: true,


        },
        axisLabel: {
          margin: 10,
          textStyle: {
            fontSize: 12,
            color: '#53a8fa',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#2548ac',
          },
        },

      }],
      xAxis: [{
        type: 'value',
        axisLabel: {
          margin: 10,
          textStyle: {
            fontSize: 12,
            color: '#53a8fa',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#192469',
          },
        },
        splitLine: {
          lineStyle: {
            // color: '#17367c',
          },
        },
      }],
      // backgroundColor: '#192469',
      series: [{
        // name: 'Top 10',
        type: 'bar',
        barWidth: 26,
        data: yData,
        label: {
          normal: {
            show: true,
            position: 'insideRight',
            textStyle: {
              color: 'white', //color of value
            },
          },
        },
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 0,
              color: '#0590eb', // 0% 处的颜色
            }, {
              offset: 1,
              color: '#08e3f1', // 100% 处的颜色
            }], false),
            barBorderRadius: [0, 15, 15, 0],
            shadowColor: 'rgba(0,0,0,0.1)',
            shadowBlur: 3,
            shadowOffsetY: 3,
          },
        },
      }],
    });
    myChart.on('click', function (params) { 
        callback(item,params);
    });
}