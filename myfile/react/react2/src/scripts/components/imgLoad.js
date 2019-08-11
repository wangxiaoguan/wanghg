import React from 'react';

class DefaultImage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            src: this.props.src ? this.props.src : '',
        }
    }

    handleImageLoaded() {
        //加载完毕
    }

    handleImageErrored() {
        //加载失败
        this.setState({
            src: require('../../images/default.jpg')
        });
    }

    render() {

        return (
            <div>
                <img  src={this.state.src} onLoad={this.handleImageLoaded.bind(this)} onError={this.handleImageErrored.bind(this)} />
                <img style={{width:'100%'}} src={imgUrl+friendsData.txPic} onError={(e) => {e.target.onerror = null;e.target.src=this.state.errorImg}}/>
            </div>

        );
    }
}

export default DefaultImage;
