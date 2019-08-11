

import React , {Component} from "react";
import "../utils/swiper.js"
export default class SwiperDemo extends Component{
    render(){
        return (
            <div className="swiper-container" ref="one" id={this.props.id}>
                <div className="swiper-wrapper">
                    {
                        this.props.children.map((child,index)=>{
                            return (
                                <div className="swiper-slide" key={index}  style={{textAlign:'center',fontSize:20,height:450}}>
                                    {child}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    componentWillMount(){

    }

    componentDidMount(){
        var mySwiper = new Swiper(`#${this.props.id}`,this.props.swiperOptions);
    }

    componentDidUpdate(){
        var mySwiper = new Swiper(`#${this.props.id}`,this.props.swiperOptions);

    }
}

SwiperDemo.propTypes = {
    id:React.PropTypes.string,
    swiperOptions:React.PropTypes.object
}
