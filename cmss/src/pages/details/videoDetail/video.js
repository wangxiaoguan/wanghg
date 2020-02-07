/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ detailModel }) => ({
  detail: detailModel,
}))
class VideoFile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setAliVedio();
  }

  setAliVedio = () => {
    const { videoUrl } = this.props;
    const player = new Aliplayer({
      id: 'wrapper',
      height: '350px',
      width: '540px',
      autoplay: true,
      source: videoUrl,
      skinLayout: [
        { name: "bigPlayButton", align: "blabs", x: 240, y: 150 },
        {
          name: "H5Loading", align: "cc"
        },
        { name: "errorDisplay", align: "tlabs", x: 0, y: 0 },
        { name: "infoDisplay" },
        { name: "tooltip", align: "blabs", x: 0, y: 56 },
        { name: "thumbnail" },
        {
          name: "controlBar", align: "blabs", x: 0, y: 0,
          children: [
            { name: "progress", align: "blabs", x: 0, y: 44 },
            { name: "playButton", align: "tl", x: 15, y: 12 },
            { name: "timeDisplay", align: "tl", x: 10, y: 7 },
            { name: "fullScreenButton", align: "tr", x: 10, y: 12 },
            // { name: "subtitle", align: "tr", x: 15, y: 12 },
            // { name: "setting", align: "tr", x: 15, y: 12 },
            { name: "volume", align: "tr", x: 5, y: 10 }
          ]
        }
      ]
    },
      () => {
        player.play();
      }
    );
  }

  render() {
    return (
      <div style={{display: 'flex',  justifyContent: 'Center'}}>
        <div id="wrapper" />
      </div>);
  }
}

export default VideoFile;
