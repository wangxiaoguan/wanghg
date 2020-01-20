import React, { Component } from 'react';

const classNames = require('./StatusPoint.less');

interface IStatusPointProps {
  img: string;
  themecolor: string;
  label: string;
  style: any;
  [key: string]: any;
}

class StatusPoint extends Component<IStatusPointProps, any> {
  render() {
    return (
      <div className={classNames.StatusPoint} {...this.props}>
        <img src={this.props.img} />
        <div className={classNames.Bg} style={{ backgroundColor: this.props.themecolor }} />
        <div className={classNames.Content} style={{ backgroundColor: this.props.themecolor }} >
          {this.props.label}
        </div>
      </div>
    );
  }
}

export default StatusPoint;