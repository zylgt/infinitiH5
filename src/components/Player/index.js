import React, { Component } from 'react';
import Styles from './index.less';
import {connect} from "react-redux";

@connect(({ layout }) => ({ layout }))
class Player extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
    }
    //开启/暂停音乐
    musicButton(){
        const { playStatus } = this.props.layout;
        const { dispatch } = this.props;
        if(playStatus === 'PLAYING'){
            dispatch({
                type:'layout/setData',
                payload:{
                    playStatus:'PAUSED'
                }
            })
        }else{
            dispatch({
                type:'layout/setData',
                payload:{
                    playStatus:'PLAYING'
                }
            })
        }

    }

    render() {
        const { playStatus } = this.props.layout;
        return (
            <div className={Styles.music} onClick={() => {
                this.musicButton()
            }}>
                {
                    playStatus === 'PLAYING' ?
                        <img src={require('../../assets/welcome_palymusic.png')} alt=""/>
                        :
                        <img src={require('../../assets/welcome_pausemusic.png')} alt=""/>
                }
            </div>
        )
    }
}


export default Player;
