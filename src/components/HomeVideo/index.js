import React, { Component } from 'react';
import Styles from './index.less';
import ReactPlayer from 'react-player'
import {connect} from 'dva';

@connect(({ home }) => ({ home }))
class HomeVideo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            play: false,
            isOnce: true
        }
    }
    componentDidMount(){
        let that = this;
        let video = document.getElementsByTagName('video')
        setTimeout(function () {
            if(video[0]){
                video[0].setAttribute('x5-video-player-type','h5')
                video[0].setAttribute('x5-video-player-fullscreen','true')
                video[0].setAttribute('x-webkit-airplay','allow')
                video[0].setAttribute('webkit-playsinline','true')
                video[0].setAttribute('playsinline','true')
            }
            // that.playVideo()
        },1000)
    }
    //播放/暂停视频]
    playVideo(){
        this.setState({
            play: !this.state.play,
            isOnce : false
        })
        const { dispatch } = this.props;
        const { isPlay } = this.props.home;
        dispatch({
            type:'home/setData',
            payload: {
                isPlay: !isPlay
            }
        })
        dispatch({
            type:'layout/setData',
            payload:{
                playStatus:'STOPPED',
            }
        })
    }
    //播放完毕
    onEnded(){
        this.setState({
            isOnce : true
        })
        const { dispatch } = this.props;
        dispatch({
            type:'home/setData',
            payload: {
                isPlay: false
            }
        })
    }

    render() {
        let { isOnce } = this.state;
        const { height, width, url, poster, isPlay } = this.props;
        console.log('isPlay--',isPlay)
        const ReactPlayerProps = {
            url : url,
            height: height,
            width: width,
            playing: isPlay,
            onEnded: this.onEnded.bind(this),
        }
        const videoStyle = {
            height: height,
            width: width,
        }

        return (
            <div className={Styles.video} style={ videoStyle }>
                {
                    isOnce && poster && !isPlay ?
                        <img className={Styles.con_video_poster}  src={ poster } alt=""/>
                        : ''
                }
                <div className={Styles.con_video_cover} onClick={()=>{this.playVideo()}}>
                    {
                        isPlay ? '' :
                            <img src={require('../../assets/home_video_btn.png')} alt=""/>
                    }
                </div>
                <ReactPlayer {...ReactPlayerProps} />
            </div>
        )
    }
}


export default HomeVideo;
