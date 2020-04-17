import React, { Component } from 'react';

import TestTs from './TestTs';

const styles = require('./ThemeTest.less');

class ThemeTest extends Component<any, any> {
  public render() {
    return (
      <div>
        <button
          onClick={() => {
            sessionStorage.setItem('a', '1');
          }}
          type="button"
          className={styles.themeTestButton}
        >
          button
        </button>
        <TestTs name="aa" age={1} />
      </div>
    );
  }
}

export default ThemeTest;
