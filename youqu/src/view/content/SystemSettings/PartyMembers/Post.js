import React, { Component } from 'react';
import { Form,  Input, Button,Col,Row, Select ,Message,Cascader,TreeSelect} from 'antd';
//用于下拉框
const Option = Select.Option;
import { connect } from 'react-redux';
import { setPost} from '../../../../redux-root/action';
import $ from 'jquery';
import './post.less';
@connect(
    state => ({
      getPostData:state.postData,
    }),
    dispatch => ({
      setPostData: n => dispatch(setPost(n)),
    })
)
class Post extends Component{
  constructor(props){
    super(props);
    this.state={
      postArray:[],//职务，新建时为空（[]）
      addKey:0,
      //选择组织机构后才可以选择职务===》将每个组织机构的下标用selectedArray存起来，用来判断新增加的职务中组织机构是否选择了
      selectedArray:[],
      postData:[],//职务的数据(给后端)
      partySelected:[],//选中了的级联
      selectedSelect:[],//下拉框选中  //全部的
      initPost:this.props.post,//编辑时职务的初始化数据
      isDisabled:false,//是否能够点击增加职务（当前一个职务包括党组织不为空时，可以点击）

    }
  }
  // static getDerivedStateFromProps(props, state) {
  //   if (props.post !== state.initPost) {
  //     return { initPost: props.post };
  //   }
  //   return null;
  // }
  componentDidUpdate(){
    if (this.props.post !== this.state.initPost) {
      this.setState({ initPost: this.props.post },()=>{
        const {postArray}=this.state;
        let party=this.state.partySelected
        let selected=this.state.selectedSelect

        if(this.state.initPost){ //不为空，则说明是edit
          let splitPost=this.state.initPost.split(';');
          console.log("前一个页面传入的post",splitPost);
          splitPost&&splitPost.map((item,index)=>{
            let selectedArray = this.state.selectedArray;
            selectedArray.push({key:index,value:true});
            postArray.push({id:index});
            this.setState({ addKey:index,postArray:postArray,selectedArray:selectedArray});
            console.log("切割后的post",postArray);
            let temp= item.split("/");
            console.log("切割后的post",temp);
            if(temp.length==2){
              party.push({key:index,value:temp[0].split(',')});
              selected.push({key:index,value:temp[1]});
              let postData=this.state.postData;
              //截取级联选择框的最后一个id
              const partyId=temp[0].split(',').length>0&&temp[0].split(',')[temp[0].split(',').length-1];
              postData.push({key:index,value:partyId+'/'+ temp[1]});
              this.setState({partySelected:party,selectedSelect:selected,postData},()=>{
                console.log("postDataall",postData);
              });
            }

          });
        }
      });
    }
  }
  //点击增加职务
  addPost=(e)=>{
    //前一个职务（包括党组织是否填写完整）
    const {addKey,postArray}=this.state;
    let idlength=this.state.postArray.length
    //最多只能增加5个职务
    if(postArray.length>4){
      Message.error("最多只能添加5个职务");
      return;
    }else{
      // postArray.push({id:this.state.addKey});
      postArray.push({id:idlength});
      console.log(postArray)
      this.setState({postArray:postArray},()=>{
        // if(this.state.postArray.length>1){
        //   this.setState({isDisabled:true});
        // }
        this.setState({ addKey:addKey + 1 });
      });

    }
    //只点击添加按钮的情况下
    if(this.state.postData.length>0){
      this.props.setPostData(this.state.postData);
    }else{
      this.props.setPostData([]);
    }
  }
  //点击删除职务
  deletePost=(key)=>{
    let post=[...this.state.postArray];
    let selected=[...this.state.selectedArray];
    let postData=[...this.state.postData];
    let partySelected =this.state.partySelected;
    let selectedSelect =this.state.selectedSelect;
    console.log("删除前post：",post);
    console.log("删除前selected：",selected);
    console.log("删除前postData：",postData);
    post=post.filter((item)=>{
      return item.id!=key
    });
    partySelected=partySelected.filter((item,index)=>{
      return item&&item.key!=key
    }); 
    selectedSelect=selectedSelect.filter((item,index)=>{
      return item&&item.key!=key
    });
    selected=selected.filter((item,index)=>{
      return item&&item.key!=key
    });
    postData=postData.filter((item,index)=>{
      console.log('删除',item,index,key);
      return item&&item.key!=key
    });

    console.log("删除后post：",post);
    console.log("删除后selected：",selected);
    console.log("删除后postData：",postData);
    this.setState({postArray:post,selectedArray:selected,postData:postData,partySelected,selectedSelect},()=>{
      // if(this.state.postArray.length<=0){
      //   this.setState({isDisabled:false});
      // }
      console.log('this.state.postData',this.state.postData);
      //删除全部的情况下
      if(this.state.postData.length>0){
        this.props.setPostData(this.state.postData);
      }else{
        this.props.setPostData({zhiwuD:0});
      }
    });
  }
  //级联选择发生改变
  onCascaderChange=(value,id)=>{
    console.log('onCascaderChange',value);
    //是否禁用党组织后面的职务选择
    let selectedArray = this.state.selectedArray;
    if(selectedArray.length==0){  //为空
      console.log('selectedArray',selectedArray);
      selectedArray.push({key:id,value:true});
    }else{
      let temp=false;
      selectedArray= selectedArray.map(item=>{
        if (item.key ===id) {
          temp=false;
          return item = {key: id, value: true}
        }else{
          temp=true;
     return item;
        }
      });
      if(temp){
        selectedArray.push({key:id,value:true});
      }
    }
    this.setState({
      selectedArray:selectedArray
    },console.log('selectedArray',selectedArray));

    //记录级联的选择
    let partySelected = this.state.partySelected;
    if(partySelected.length==0){//为空
      partySelected.push({key:id,value:value});
    }else{//不为空
      let temp = false;
      partySelected = partySelected.map(item=>{
        if (item.key ===id) {
          temp= false;
          console.log("onCascaderChange",item,id);
         return  item = {key: id, value:value}
        }else{
          temp= true;
         return item;
        }
      });
      if(temp){
        partySelected.push({key:id,value:value});
      }
    }
    console.log('onCascaderChange-finall',partySelected);
    this.setState({
      partySelected:partySelected
    },()=>{
      console.log('onCascaderChange-finall',this.state.partySelected);
    });

    //最终数据
     let postData=this.state.postData;
    const  {selectedSelect}=this.state;//下拉框的选择

    let post;
      selectedSelect&& selectedSelect.map((item,index)=>{
        console.log("postData6666666666666",item,id);
        if(item.key===id){
         post=item.value
        }
      });
    //当还没选择职务时，不做后面的处理
    if(post){//不为空
      let curr={key:id,value:value[value.length-1]+'/'+post};
      let flag = postData.some((item)=>{
        console.log("postData6666666666667",item);
       return  item.value ==curr.value;
      });
      console.log("postData6666666666666",postData,flag);
      if(flag){
        Message.error('同一组织机构下只能选择一个职务');
        partySelected= partySelected.map((item,index)=>{
          console.log("postData6666666666667",item,id);
          if(item.key==id){
            return item.value=[];
          }else{
            return item;
          }
        });
        //肯定是第三次，将上一次清掉
        postData= postData.map((item,index)=>{
          if(item.key==id){
            return item.value=[];
          }else{
            return item;
          }
        });

        this.setState({
          partySelected:partySelected,postData
        },()=>{
          console.log("partySelected",this.state.partySelected);
          let cascader = "cascader" + id;
          $("." + cascader).children("span").children("span").empty();
          console.log($("." + cascader).children("span").children("span"))
          console.log("cascader",cascader)
        });
        return;
      }
      if(postData.length==0){//为空
        postData.push({key:id,value:value[value.length-1]+'/'+post});
      }else{
        let temp = false;
        postData=postData.map(item=>{
          if (item.key ===id) {
            temp = false
            return item = {key: id, value:value[value.length-1]+'/'+post}
          }else{
            temp =true
           return item;
          }
        });
        if(temp){
          postData.push({key:id,value:value[value.length-1]+'/'+post});
        }
      }
    }

    postData=postData.filter((item,index)=>{
      return item!=undefined;
    });
    this.setState({
      postData:postData,partySelected
    },()=>{
      console.log('this.state.postData',this.state.postData);
      if(this.state.postData.length>0){
        this.props.setPostData(this.state.postData);
      }else{
        this.props.setPostData([]);
      }

    });

  }
  //下拉框选择发生改变
  onSelectChange=(value,id)=>{
    //记录下拉框选中的值
    let selectedSelect = this.state.selectedSelect;
   console.log('selectedSelect',selectedSelect);
   if(selectedSelect.length==0){//为空
     console.log("selectedSelect",'为空');
     selectedSelect.push({key:id,value:value});
   } else{
     let temp = false;
     selectedSelect=selectedSelect.map(item=>{
         if (item.key ===id) {
           temp=false;
          return item = {key: id, value: value}
         }else{
           temp=true;
           return item;
         }
       });
     if(temp){
       selectedSelect.push({key:id,value:value});
     }
     }
     console.log('selectedSelect',selectedSelect);
    this.setState({
      selectedSelect
    });

   //最终数据处理
    let postData=this.state.postData;


    const {partySelected}=this.state;
    if(partySelected){//不为空
      let t;
      partySelected.map((item,index)=>{
        if(item.key===id){
          t=item.value[item.value.length-1]
        }
      });

      if(postData.length==0){//为空
        postData.push({key:id,value:t+'/'+value});
      }else{
        //获取当前的post（总值）
        let p={key:id,value:t+'/'+value};
        //唯一性校验
        let flag = postData.some((item)=>{
          console.log('flag',item.value,p.value);
          return item.value ===p.value
        });
        console.log("flag",flag,postData);
        if(flag){
          Message.error('同一组织机构下只能选择一个职务');
          //并将选中的职务清空
          let selectedSelect = this.state.selectedSelect;
          selectedSelect= selectedSelect.map((item,index)=>{
            console.log("selectedSelect-item",item);
            if(item.key==id){
              return item.value='';
            }else{
              return item;
            }
          });
          postData.push({key:id,value:[]});
          this.setState({
            selectedSelect
          },()=>{
            console.log('6666',this.state.selectedSelect);
          });
          return;
        }

        let temp = false;
        if(postData.length==0){//为空
          postData.push({key:id,value:t+'/'+value});
        }else{
          postData= postData.map(item=>{
            if (item.key ===id) {
              temp=false;
              return item = {key: id, value: t + '/' + value}
            }else{
              temp=true;
            return item;
            }
          });
          if(temp){
            postData.push({key:id,value:t+'/'+value});
          }
        }

      }
    }

    postData=postData.filter((item,index)=>{
      console.log("postDataiditem", item)
      return item!=undefined;
    });

    this.setState({
      postData:postData
    },()=>{
      //前一个职务（包括党组织是否填写完整）
      console.log('this.state.postData',this.state.postData);

      if(this.state.postData.length>0){
        this.props.setPostData(this.state.postData);
      }else{
        this.props.setPostData([]);
      }
    });

  }
  render(){
    const {cascaderOptions,selectOptions,}=this.props; //级联的option  下拉框的option
    const {postArray,partySelected,selectedArray,isDisabled,selectedSelect}=this.state;
    console.log("partySelectedpartySelectedpartySelectedpartySelectedpartySelected",selectedSelect);

    return (
        <div >
          <Button onClick={this.addPost} >
            添加职务
          </Button>
          {
            postArray&&postArray.map((item,index)=>{

              let party;
              partySelected&&partySelected.map((i)=>{
                if(i.key===item.id){
                  party=i.value
                }
              });
              let post;
              selectedSelect.map((i)=>{
                if(i.key===item.id){
                  post=i.value
                }
              });
              let select;
              selectedArray.map((i)=>{
                if(i.key===item.id){
                  select=i.value
                }
              });
              console.log("select",select);
              return (
                  <div key={item.id} className={"cascader"+`${item.id} post-main`} >
                      <Cascader
                          style={{width:'300px'}}
                          defaultValue={party}
                          placeholder="请选择党组织"
                          options={cascaderOptions}
                          onChange={(value)=>this.onCascaderChange(value,item.id)}
                          changeOnSelect
                      >
                      </Cascader>
                      <Select
                          style={{width:'280px'}}
                          value={post}
                          placeholder="请选择党组织下的职务"
                          disabled={!select}
                          onChange={(value)=>this.onSelectChange(value,item.id)}>
                        {
                          selectOptions&&selectOptions.map((_)=>{
                            return  <Option key={_.key} value={_.value} >
                              {_.label}
                            </Option>
                          })
                        }
                      </Select>
                     <Button onClick={()=>this.deletePost(item.id)}>
                       删除职务
                     </Button>


                  </div>
              )
            })
          }
        </div>
    );
  }

}
export default Post;