import * as React from 'react';

export interface ITestTsProps {
  /**
   * 名称
   */
  name: string;

  /**
   * 年龄
   */
  age: number;
}

class TestTs extends React.Component<ITestTsProps, any> {
  private a: HTMLElement;
  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    console.log(this.a);
  }
  public render() {
    return (
      <div>
        {this.props.name} {this.props.age}
        <audio ref={target => (this.a = target)} />
      </div>
    );
  }
}

export default TestTs;
