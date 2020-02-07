/* eslint-disable no-plusplus */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import OrganizationChart from '@/components/OrganizationChart';
import styles from './index.less';

class PoliticalActiveFramework extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className={styles.main}>
        <OrganizationChart />
      </div>
    );
  }
}

export default PoliticalActiveFramework;
