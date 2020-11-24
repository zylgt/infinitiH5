import React, { Component } from 'react'
import BaseLayout from './baseLayout';
import { connect } from 'dva';
import Sound from 'react-sound';
import Login from '../components/Login'
import {isIOS} from '../utils/tools'
import { Toast } from 'antd-mobile';

const ULR_NO_LAYOUT = ['/home', '/upload','/hot', '/my'];

@connect(({ layout }) => ({ layout }))
class Index extends Component {

    componentDidMount() {
        const { dispatch } = this.props;
        //开启播放
        setTimeout(function(){
            if(!isIOS()){
                dispatch({
                    type:'layout/setData',
                    payload:{
                        playStatus:'PLAYING',
                    }
                })
            }
        },1000)

        // if(window.location.origin === 'https://power.infiniti-story.com'){
        //     window.location.href = "https://power.vermao.com" + window.location.pathname;
        // }

    }
    renderBody = () => {
        const {location: {pathname}, children } = this.props;
        console.log('pathname',pathname)
        if (ULR_NO_LAYOUT.includes(pathname)) {
            return  (<BaseLayout {...this.props} />);
        }
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    }
    componentDidUpdate(){
        const { isLoginSuccess } = this.props.layout;
        const { dispatch } = this.props;
        if(isLoginSuccess){
            Toast.info('登录成功', 1.2);
            setTimeout(function (){
                dispatch({
                    type:'layout/setData',
                    payload:{
                        isLoginSuccess: false
                    }
                })
            },1200)
        }
    }

    render() {
        const { playStatus, showLogin, isLoginSuccess } = this.props.layout;
        let SoundProps = {
            url:'https://infiniti-1302663429.cos.ap-beijing.myqcloud.com/music.mp3',
            playStatus: playStatus,
            loop: true,
        }

        return (
            <React.Fragment>
                {
                    showLogin ? <Login /> : ''
                }
                <Sound {...SoundProps} />
                {this.renderBody()}
            </React.Fragment>
        )
    }
}

export default Index;
