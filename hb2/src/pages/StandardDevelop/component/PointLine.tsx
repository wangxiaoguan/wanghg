import React, { Component } from 'react';
const classNames = require('./PointLine.less');

interface IPointLineProps {
  src: string;
  style: any;
}

class PointLine extends Component<IPointLineProps, any> {
  render() {
    return (
      <div className={classNames.PointLine} {...this.props}>
        <img src={this.props.src} />
        <div className={classNames.Mask} />
      </div>
    );
  }
}

export default PointLine;