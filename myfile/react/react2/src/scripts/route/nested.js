

import React,{Component} from "react";

import {Route,Link} from "react-router-dom"
export default class Nested extends Component {
    render(){
        return (
            <div>
                <h2>Nested-Nested-Nested</h2>
                <h1>嵌套路由</h1>
                <div>
                    <Link to="/nested/one">One</Link>
                    <Link to="/nested/two">Two</Link>
                    <Link to="/nested/three">Three</Link>
                </div>
                <div>
                    <Route
                        path="/nested/:min?"
                        render = {
                            ({match,location,history})=>{
                                console.log(match)
                                return (
                                    <h1 style={{height:100,background:'yellowgreen'}}>
                                        URL: { match.params.min || "/"}
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