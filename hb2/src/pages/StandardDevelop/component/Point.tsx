import React, { Component, ReactNode } from 'react';

const classNames = require('./Point.less');

interface IPointProps {
  text: ReactNode;
  themecolor?: string;
  style: any;
  onClick: (event) => void;
  onMouseEnter?: (event) => void;
  onMouseLeave?: (event) => void;
  [key: string]: any;
}

class Point extends Component<IPointProps, any> {
  render() {
    return (
      <div className={classNames.Point} {...this.props}>
        <div className={classNames.Bg} style={{ backgroundColor: this.props.themecolor }} />
        <div className={classNames.Content} style={{ backgroundColor: this.props.themecolor }}>
          {
            this.props.text
          }
        </div>
      </div>
    );
  }
}

export default Point;