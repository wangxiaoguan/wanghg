

import React,{Component} from "react";

import {Route,Link} from "react-router-dom";

export default class Fa extends Component{
    render(){
        return(
            <div>
                <h1 style={{fontSize:50}}>F-F-F</h1>
                <h1>嵌套路由</h1>
                <div>
                    <Link to="/fa/a1">FFF-1</Link>
                    <Link to="/fa/a2">FFF-2</Link>
                    <Link to="/fa/a3">FFF-3</Link>
                </div>
                <div>
                    <Route
                        path="/fa/:arg?"
                        render={
                            ({match,location,history})=>{
                                console.log(match)
                                return(
                                    <h1 style={{fontSize:20}}>
                                         <p>params: { match.params.arg || "/"}</p> 
                                         <p>path:{match.path}</p>
                                         <p>url:{match.url}</p>
                                          
                                    </h1>
                                )                               
                            }
                        }

                    />
                </div>
               
            </div>
        )
    }
}

// export default F;