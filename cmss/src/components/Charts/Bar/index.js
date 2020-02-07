/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class Bar extends Component {
  componentDidMount() {}

  getOption = (data, color, xData) => {
    const seriesData = [];
    for (let i = 0; i < data.length; i++) {
      seriesData.push({
        name: data[i].label,
        type: 'bar',
        barWidth: 10,
        label: {
          normal: {
            show: true,
            position: 'top',
            color: '#333',
            fontSize: 14,
          },
        },
        data: data[i].data,
      });
    }
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        top: '20px',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: xData,
          axisLabel: {
            formatter: params => {
              let newParamsName = ''; // 最终拼接成的字符串
              const paramsNameNumber = params.length; // 实际标签的个数
              const provideNumber = 5; // 每行能显示的字的个数
              const rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
              /**
               * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
               */
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (let p = 0; p < rowNumber; p++) {
                  let tempStr = ''; // 表示每一次截取的字符串
                  const start = p * provideNumber; // 开始截取的位置
                  const end = start + provideNumber; // 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p === rowNumber - 1) {
                    // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    // 每一次拼接字符串并换行
                    tempStr = `${params.substring(start, end)}\n`;
                  }
                  newParamsName += tempStr; // 最终拼成的字符串
                }
              } else {
                // 将旧标签的值赋给新标签
                newParamsName = params;
              }
              // 将最终的字符串返回
              return newParamsName;
            },

            fontSize: 14,
            color: '#333',
            fontWeight: 'bold',
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#B3B3B3',
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: seriesData,
      color,
    };
    return option;
  };

  render() {
    const { data, height = 200, notMerge, color, xData } = this.props;
    return (
      <ReactEcharts
        style={{ height }}
        option={this.getOption(data, color, xData)}
        notMerge={notMerge}
      />
    );
  }
}

export default Bar;
