import React, { Component } from 'react';
import { Progress } from 'antd';

const styles = require('./CardProgress.less');

interface ICardProgressProps {
  percent: number;
  label: string;
  index: string;
}

/**
 * 卡片进度
 */
class CardProgress extends Component<ICardProgressProps, any> {

  getThemeColor() {
    if (this.props.percent) {
      if (this.props.percent < 50) {
        return '#17b1a6';
      }
      else if (this.props.percent < 100) {
        return '#ff9b51';
      }
      return '#1bc270';
    }
    return '#5d5e66';
  }

  render() {
    const themeColor = this.getThemeColor();
    return (
      <div className={styles.CardProgress}>
        <header style={{ backgroundColor: themeColor }}>
          <h1>{this.props.label}</h1>
          <span style={{ color: themeColor }}>{this.props.index}</span>
        </header>
        <div>
          <Progress percent={this.props.percent} strokeWidth={16} strokeColor={themeColor} />
        </div>
        <footer>
          <h1 style={{ color: themeColor }}>审核中</h1>
          <h2 style={{ color: themeColor }}>{this.props.percent}%</h2>
        </footer>
      </div>
    );
  }
}

export default CardProgress;