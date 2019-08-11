
import React,{Component} from "react";
import './data.scss'
import {Checkbox} from 'antd'
export default class Home17 extends Component{
    constructor(props){
        super(props);
        this.state={
           list:[],
           box:[],
           checkValue:["CH03", "CH08", "CH07"]
        }
    }
    componentWillMount(){
        fetch('http://api.yytianqi.com/citylist/id/1').then(res=>{
                res.json().then(data=>{
                    console.log(data)
                    this.setState({list:data.list})
                })
            }) 
    }
    componentDidUpdate(){
        let list = this.state.list
        let box =[]
        if(list.length>0){
            list.map((item,index)=>{
                box.push(
                    <div key={index}>
                        <p style={{width:300}}>{item.name}<Checkbox style={{float:'right'}} onChange={this.select} value={item.city_id}></Checkbox></p>
                    </div>
                )
            })
            this.setState({box,list:[]})
        }
    }
    onChange=(e)=>{
        console.log(e)
    }
    select=(e)=>{

        let checkValue = this.state.checkValue
        let arr = checkValue.filter(item=>{
            return item
        })
        console.log('--------------->',e)
        let isCheck = e.target.checked
        let value = e.target.value
        if(isCheck){
            arr.push(e.target.value)
        }else{
            let index = arr.indexOf(value)
            arr.splice(index,1)
        }
        console.log(arr)
        setTimeout(()=>{
            this.setState({checkValue:arr})
        },20)
        // this.setState({checkValue})
    }
    render(){
        console.log(this.state)
        const {checkValue}=this.state
        return(
            <div id='home17'> 
                <Checkbox.Group value={checkValue} style={{ width: '100%' }} >
                    {this.state.box}
                </Checkbox.Group>
            </div>
    
        )
    }
}


