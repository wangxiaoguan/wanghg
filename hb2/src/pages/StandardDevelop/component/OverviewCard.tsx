import React, { Component, ReactNode } from 'react';

const classNames = require('./OverviewCard.less');

interface IOverviewCardProps {
  footer: ReactNode;
  style?: any;
  className?: string;
  footerStyle?: any;
}

/**
 * 概览卡片
 */
class OverviewCard extends Component<IOverviewCardProps, any> {
  render() {
    return (
      <div style={this.props.style} className={`OverviewCard ${this.props.className || ''}`}>
        <div className='OverviewCardContent'>{this.props.children}</div>
        <div style={this.props.footerStyle} className='OverviewCardFooter'>{this.props.footer}</div>
      </div>
    );
  }
}

export default OverviewCard;