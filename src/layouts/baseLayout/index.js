import React from 'react';
import { TabBar } from 'antd-mobile';
import router from 'umi/router';
import 'antd-mobile/dist/antd-mobile.css';
import styles from './index.less';
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入
import { hostURL } from '../../utils/baseURL';
import linkSocket from '../../components/linkSocket'
import Sound from 'react-sound';

const TabBarData = [
    {
        id: 'home',
        name: '首页',
        icon: require('../../assets/home_01.png'),
        selectedicon: require('../../assets/home.png'),
        url: '/home',
    },
    {
        id: 'ask',
        name: '问诊',
        icon: require('../../assets/question_01.png'),
        selectedicon: require('../../assets/question.png'),
        url: '/ask',
    },
    {
        id: 'my',
        name: '我的',
        icon: require('../../assets/my_01.png'),
        selectedicon: require('../../assets/my.png'),
        url: '/my',
    }
];

class BaseLayout extends React.Component {

    componentWillUnmount(){
        if(this.socket){
            this.socket.onclose({
                msg:'关闭页面'
            })
        }
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type:'layout/setData',
            payload:{
                sendMsg:[],
                historyMsg:[]
            }
        })
        dispatch({
            type:'ask/getAskList',
            callback: this.getAskListCallback.bind(this)
        })
    }
    //获取订单列表回调
    getAskListCallback(response){
        // console.log('-getAskListCallback-',response)
        const { dispatch } = this.props;
        let data = response.data.data;
        if(data && data.length > 0){
            for(let i=0;i < data.length; i++){
                if(data[i].status == 'pending' || data[i].status == 'inquiring'){
                    linkSocket(this, data[i].uid)
                    dispatch({
                        type:'layout/setData',
                        payload:{
                            isSocket: true,
                            orderNo: data[i].uid
                        }
                    })
                    break;
                }
            }
        }
    }

    isTabBarSelect = (url) => {
        const {location: {pathname}} = this.props;
        if (pathname == '/' && url == '/home') {
            return true;
        } else {
            return pathname === url;
        }
    }
    componentWillReceiveProps(){
        if(window.location.pathname == '/home' || window.location.pathname == '/my'){
            //顶部进度条开启
            NProgress.start()

            setTimeout(function () {
                //顶部进度条关闭
                NProgress.done()
            },350)
        }
    }
    //声音播放完毕
    onFinished(){
        const {dispatch} = this.props;
        dispatch({
            type:'layout/setData',
            payload:{
                playStatus:'STOPPED',
            }
        })
    }
    render() {
        const { sendMsg, historyMsg } = this.props.layout;
        const {playStatus} = this.props.layout;
        let { userInfo } = this.props.my;
        let SoundProps = {
            url:require('../../assets/bgm.mp3'),
            playStatus: playStatus,
            loop:false,
            onFinishedPlaying: this.onFinished.bind(this),
            volume: userInfo.voice_switch ? 100 : 0
        }
        console.log('voice_switch--------',userInfo.voice_switch)
        return (
            <div className={styles.baseLayout}>
                <Sound {...SoundProps} />
                <TabBar
                    unselectedTintColor="#999"
                    tintColor="#2089EB"
                    barTintColor="white"
                    tabBarPosition='bottom'
                >
                    {
                        TabBarData.map(t => {
                            const isSelect = this.isTabBarSelect(t.url);
                            let badge = false;

                            if(t.url == '/ask'){
                                let array = historyMsg.concat(sendMsg);
                                let index = 0;
                                for(let i = 0;i< array.length ;i++){
                                    if(!array[i].readed_at && array[i].type != "notification" && array[i].sender_type == "doctor"){
                                        index++;
                                    }
                                }
                                badge = index
                            }
                            return  (<TabBar.Item
                                    title={t.name}
                                    key={t.id}
                                    className={styles.item}
                                    badge={ badge }
                                    icon={<div style={{
                                        width: '0.48rem',
                                        height: '0.48rem',
                                        background: `url(${t.icon}) center center /  0.44rem 0.44rem no-repeat` }}
                                    />
                                    }
                                    selectedIcon={<div style={{
                                        width: '0.48rem',
                                        height: '0.48rem',
                                        background: `url(${t.selectedicon}) center center /  0.44rem 0.44rem no-repeat` }}
                                    />
                                    }
                                    // badge={1}
                                    onPress={() => {
                                        router.push(t.url);
                                    }}
                                    selected={isSelect}
                                    data-seed="logId"
                                >
                                    {isSelect && this.props.children}
                                </TabBar.Item>
                            )
                        })
                    }
                </TabBar>
            </div>
        );
    }
}

export default BaseLayout;
