
import React,{Component} from "react";
import './home.scss'
export default class Home4 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='home4'> 
<pre>{`
var mongodb=require("mongodb");
var mongoclient=mongodb.MongoClient;
var table="mongodb://localhost:27017/user";
mongoclient.connect(table,(err,db)=>{
    try{
         db.collection("movie").find({},{}).toArray((err,result)=>{
            if(err)throw err;
            res.send(result);
        })       
    }catch(err){
        if(err)throw err;
    }
})
`}</pre>
            </div>
    
        )
    }
}


