import React, { Component } from 'react';
import { Tabs,Select,Button,message,Cascader,Form,Row,Col } from 'antd';
const FormItem = Form.Item;
class Test extends Component{
  constructor(props){
    super(props);
  }
  handleChange(value, key, qFilter, type){
    if (type === 'rangePicker') {

    }
  }
  handleSubmit=e=>{

  }
  render(){
    const search = [
      { key: 'type',label : '文章类型', qFilter: 'Q=type_S_EQ',type:'select',option: this.state.newsTypeOptions},
      { key: 'isrequireddesp', label: '是否必修', qFilter: 'Q=isrequired_Z_EQ', type: 'select', option: isOrNotOptions },
      { key: 'ispush', label: '是否推送', qFilter: 'Q=ispush_Z_EQ', type: 'select', option: isOrNotOptions },
      { key: 'ishomepage', label: '是否上首页', qFilter: 'Q=ishomepage_Z_EQ', type: 'select', option: isOrNotOptions },
      { key: 'title', label: '文章标题',qFilter:'Q=title_LK',type:'input'},
      { key: 'createdate', label: '创建时间', type: 'rangePicker' },
    ];
    const formItemLayout = { labelCol: { span: 12 }, wrapperCol: { span: 12 } };
    const test=search?(<Row className="row">
      {
        search.map((item,index)=>{
          return(<div key={index}>
            {
              item.option?
                  (<Col span="6">
                    <FormItem
                        {...formItemLayout}
                        labe1={item.label}
                    >
                      {
                        getFieldDecorator(item.key, { initialValue: '全部'})
                        (<Select
                            className="select"
                            onChange={value =>
                                this.handleChange(
                                    value,
                                    item.key,
                                    item.qFilter,
                                    item.type
                                )
                            }
                        >
                          {
                            item.option&& item.option.map((item,index)=>{
                              return <Option
                                  key={item.key}  value={item.key}
                              >
                                {_.value}
                              </Option>
                            })
                          }
                        </Select>)
                      }

                    </FormItem>

                  </Col>):(<Col></Col>)

            }

          </div>)
        })
      }
    </Row>):null;
    return(
        <div className="custom-table-search">
          <Form onSubmit={this.handleSubmit}>{search}</Form>
        </div>
    );
  }
}
export default Test;