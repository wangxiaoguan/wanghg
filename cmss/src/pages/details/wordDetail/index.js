/**
 * 文字详情
 **/
import React from 'react';
import PropTypes from 'prop-types';

export default class WordDetail extends React.Component {
  static propTypes = {
    detail: PropTypes.object
  };

  render() {

    const { detail } = this.props;
    let content = '';
    if (detail && detail.newsInfo) {
      content = detail.newsInfo.content;
    }
    return <div dangerouslySetInnerHTML={{ __html: content }} id={'content'} />
  }
}
