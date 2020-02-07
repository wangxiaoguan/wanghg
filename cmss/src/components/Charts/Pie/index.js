/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class Pie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      color: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    const color = data.map(item => item.color);
    this.setState({ data, color });
  }

  getOption = (data, color) => {
    const xData = [];
    const seriesData = [];
    for (let i = 0; i < data.length; i++) {
      xData.push(data[i].label);
      seriesData.push({
        value: data[i].value,
        name: data[i].label,
        label: {
          normal: {
            formatter: [
              '{br|}{legend|}{weatherHead|{b}}{valueHead|{c}个}{rateHead|{d}%}',
              '{hr|}',
            ].join('\n'),
            rich: {
              legend: {
                width: 8,
                height: 14,
                backgroundColor: color[i],
              },
              br: {
                padding: i === 0 ? [0, 20, 0, 0] : [0, 0, 0, 0],
              },

              weatherHead: {
                color: '#333',
                height: 20,
                align: 'left',
                padding: [0, 0, 0, 8],
                fontSize: 14,
              },
              hr: {
                borderColor: '#B3B3B3',
                width: '100%',
                borderWidth: 2,
                height: 0,
              },
              valueHead: {
                color: '#333',
                height: 20,
                padding: [0, 16, 0, 16],
                align: 'center',
                fontSize: 14,
              },

              rateHead: {
                color: '#333',
                align: 'center',
                height: 20,
                padding: [0, 0, 0, 0],
                fontSize: 14,
              },
            },
          },
        },
        labelLine: {
          show: true,
          length: 0,
          length2: 0,
        },
      });
    }

    const option = {
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: seriesData,
          itemStyle: {
            borderWidth: 2,
            borderColor: '#fff',
          },
        },
      ],
      color,
    };
    return option;
  };

  render() {
    const { height = 200, notMerge } = this.props;
    const { data, color } = this.state;
    return (
      <div>
        <ReactEcharts style={{ height }} option={this.getOption(data, color)} notMerge={notMerge} />
      </div>
    );
  }
}

export default Pie;
