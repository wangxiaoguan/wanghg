import { Tree,Form,Button } from 'antd';
import React,{Component} from 'react'
import ReactDOM,{render} from 'react-dom'
import { getFileItem } from 'antd/lib/upload/utils';
const TreeNode = Tree.TreeNode;
const FormItem=Form.Item

const treeData = [{
  title: '0-0',
  key: '0-0',
  children: [{
    title: '0-0-0',
    key: '0-0-0',
    children: [
      { title: '0-0-0-0', key: '0-0-0-0' },
      { title: '0-0-0-1', key: '0-0-0-1' },
      { title: '0-0-0-2', key: '0-0-0-2' },
    ],
  }, {
    title: '0-0-1',
    key: '0-0-1',
    children: [
      { title: '0-0-1-0', key: '0-0-1-0' },
      { title: '0-0-1-1', key: '0-0-1-1' },
      { title: '0-0-1-2', key: '0-0-1-2' },
    ],
  }, {
    title: '0-0-2',
    key: '0-0-2',
  }],
}, {
  title: '0-1',
  key: '0-1',
  children: [
    { title: '0-1-0-0', key: '0-1-0-0' },
    { title: '0-1-0-1', key: '0-1-0-1' },
    { title: '0-1-0-2', key: '0-1-0-2' },
  ],
}, {
  title: '0-2',
  key: '0-2',
}];

class Demo extends Component {
    constructor(props){
        super(props);
        this.state={
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: ['0-0-0'],
        }
    }
  

  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent:true,
    });
  }

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  changeKey=()=>{
      this.setState({
        checkedKeys: ['0-0-0','0-0-1'],
      })
  }
  render() {
      const { getFieldDecorator } = this.props.form;
    return (
        <div>
            <Form onSubmit={this.handleSubmit} >
                <FormItem  label='树形控件'>
                    {
                        getFieldDecorator('value',{
                            rules:[
                                {
                                    required: true, 
                                    message: 'Please input your E-mail!',
                                }
                            ],initialValue:['0-0-0','0-0-1']
                        })
                        (
                            <Tree
                                checkable
                                onExpand={this.onExpand}
                                expandedKeys={this.state.expandedKeys}
                                autoExpandParent={this.state.autoExpandParent}
                                onCheck={this.onCheck}
                                checkedKeys={this.state.checkedKeys}
                                onSelect={this.onSelect}
                                selectedKeys={this.state.selectedKeys}
                            >
                                {this.renderTreeNodes(treeData)}
                            </Tree>
                        )
                    }
                </FormItem>
            
            </Form>
            <Button onClick={this.changeKey}>按钮</Button>
        </div>
     
    );
  }
}

const App=Form.create()(Demo)
render(<App />, document.getElementById('app'));
