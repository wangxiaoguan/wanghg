
// 封装swiper  组件 
import React,{Component} from "react";
import "./index.scss";
import "../../utils/swiper-3.3.1.min.js"

// this.props.children 
export default class SwiperDemo extends Component{
    render(){
        return (
            <div className="swiper-container" ref="one" id={this.props.id}>
                <div className="swiper-wrapper">
                    {
                        this.props.children.map((child,index)=>{
                            return (
                                <div className="swiper-slide" key={index}>
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
