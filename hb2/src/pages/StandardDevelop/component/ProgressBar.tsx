import React, { Component } from 'react';
const classNames = require('./ProgressBar.less');

interface IProgressBarProps {
  percenet: number;
  themecolor: string;
  label: string;
  style?: any;
}

class ProgressBar extends Component<IProgressBarProps, any> {
  render() {
    return (
      <div className={classNames.ProgressBar} {...this.props}>
        <div className={classNames.BarContainer}>
          <div className={classNames.Track}>
            <div className={classNames.TrackBg} style={{ backgroundColor: this.props.themecolor }} />
            <div className={classNames.Bar} style={{ backgroundColor: this.props.themecolor, width: `${this.props.percenet}%` }} />
          </div>
          <span>{this.props.percenet}%</span>
        </div>
        <h2>{this.props.label}</h2>
      </div>
    );
  }
}

export default ProgressBar;