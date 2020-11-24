import React, {Component} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import Styles from './index.less';
import DocumentTitle from 'react-document-title'
import Player from '../../components/Player'
import ImgCrop from 'antd-img-crop';
import { Upload } from 'antd';
import HomeButton from '../../components/HomeButtom'
import WelcomeButton from '../../components/WelcomeButton'
import HomeVideo from '../../components/HomeVideo'
import Back from '../../components/Back'
import HomePrize from '../../components/HomePrize'
import {cookieUtils, isIOS, wechatShare, isWchat} from '../../utils/tools'
import wx from "weixin-js-sdk";
import { Button } from 'antd-mobile';

@connect(({ home, layout }) => ({ home, layout }))
class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bgImgTop: 0,
            conTop: '2rem',
            showHomePrize: false,
            homePrize:1,
        }
        this.dp = null
    }
    componentDidMount() {
        console.log('isWchat',isWchat())
        if(isWchat()){
            if (window.innerHeight <= 672) {
                this.setState({
                    bgImgTop: '-1.74rem',
                    conTop: '.32rem',
                })
            }
        }else{
            if (window.innerHeight <= 667) {
                this.setState({
                    bgImgTop: '-0.8rem',
                    conTop: '1.2rem',
                })
            }
        }

        const { dispatch } = this.props;
        const { isFrist } = this.props.home;
        dispatch({
            type:'home/setData',
            payload: {
                isShowVideo: true
            }
        })
        if(isFrist){
            this.setState({
                showHomePrize: true,
            })
            dispatch({
                type:'home/setData',
                payload: {
                    isShowVideo: false
                }
            })
        }
        //设置热门可更新
        dispatch({
            type:'hot/setData',
            payload: {
                isRefresh: true
            }
        })
        dispatch({
            type:'upload/setData',
            payload:{
                url:''
            }
        })
    //    播放视频，关闭音乐
        setTimeout(function(){
            // dispatch({
            //     type:'layout/setData',
            //     payload:{
            //         playStatus:'STOPPED',
            //     }
            // })
            // dispatch({
            //     type:'home/setData',
            //     payload:{
            //         isPlay: true,
            //     }
            // })
        },1000)
        if (isIOS()) {
            wechatShare(dispatch)
        } else
        {
            //获取appid和签名
            dispatch({
                type: 'layout/getAppid',
                payload: {
                    url: window.location.href.split('#')[0]
                    // url:'https://power.infiniti-story.com/infiniti/q4/welcome'
                },
                callback: this.getAppidCallback.bind(this)
            })
        }

    }
    // 获取appidcallback
    getAppidCallback(response){
        const { dispatch } = this.props;
        wx.config({
            debug: response.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.appId, // 必填，公众号的唯一标识
            timestamp: parseInt(response.timestamp) , // 必填，生成签名的时间戳
            nonceStr: response.nonceStr, // 必填，生成签名的随机串
            signature: response.signature,// 必填，签名
            jsApiList: response.jsApiList // 必填，需要使用的JS接口列表
        });
        wechatShare(dispatch)
    }

    componentWillUnmount (){
        console.log('卸载')
    }
    //跳转写下故事
    jumpUpload(){
        //验证登陆
        const { token } = this.props.layout;
        const { dispatch } = this.props;
        const cookieToken = cookieUtils.get('token') || '';
        if(token || cookieToken){
            router.push('./upload')
        }else{
            dispatch({
                type:'layout/setData',
                payload:{
                    showLogin: true
                }
            })
            dispatch({
                type:'home/setData',
                payload: {
                    isShowVideo: false
                }
            })
        }
    }
    //跳转看看故事
    jumpHot(){
        router.push('./hot')
    }
    //关闭合伙人礼遇/获奖名单
    closeHomePrize(num){
        const { dispatch } = this.props;
        const { showHomePrize } = this.state;
        const { isFrist,isShowVideo } = this.props.home;
        this.setState({
            showHomePrize : !showHomePrize,
            homePrize: num,
        })
        dispatch({
            type:'home/setData',
            payload: {
                isShowVideo: showHomePrize
            }
        })
        console.log('num',num)
        if(isFrist){
            dispatch({
                type:'layout/setData',
                payload:{
                    playStatus:'STOPPED',
                }
            })
            dispatch({
                type:'home/setData',
                payload:{
                    isPlay: true,
                    isFrist: false
                }
            })
        }
    }

    render() {
        const { bgImgTop, conTop, showHomePrize, homePrize } = this.state;
        const { isPlay, isShowVideo } = this.props.home;
        const VideoProps ={
            url : 'https://infiniti-1302663429.cos.ap-beijing.myqcloud.com/ty3.mp4',
            height: '3.3rem',
            width:'5.92rem',
            poster:'https://infiniti-1302663429.cos.ap-beijing.myqcloud.com/ty3.png',
            isPlay: isPlay
        }
        const HomePrizeProps = {
            closeWindow : this.closeHomePrize.bind(this),
            homePrize: homePrize
        }

        return (
            <DocumentTitle title='英菲尼迪『背后的力量』故事无限公司'>
                <div className={Styles.home} >
                    <img style={{top: bgImgTop}} className={Styles.home_bg} src={require('../../assets/home_bg.jpg')}
                         alt=""/>
                    <div style={{top: conTop}} className={Styles.home_con}>
                        <div className={Styles.home_left_gift} onClick={()=>{this.closeHomePrize(1)}} >
                            <HomeButton title='合伙人礼遇' />
                        </div>
                        <div className={Styles.home_left_list} onClick={()=>{this.closeHomePrize(2)}} >
                            <HomeButton title='获奖名单'/>
                        </div>
                        <Back/>
                        <Player/>
                        <div className={Styles.con_video}>
                            <img className={`${isIOS() ? Styles.con_video_tv : Styles.con_video_tv_and }`} src={require('../../assets/home_tv.png')} alt=""/>

                            {/*{*/}
                            {/*    showHomePrize ?  '':<HomeVideo {...VideoProps} />*/}
                            {/*}*/}
                            <div style={ isShowVideo ? {} : {display:'none'}} >
                                <HomeVideo {...VideoProps} />
                            </div>

                        </div>
                        <div className={Styles.con_hint}>
                            <p><span>「故事无限公司」</span>营业中</p>
                            <p>我们愿收集你与<span>“背后的力量”</span>之间的故事</p>
                            <p>带着你的故事来应聘合伙人吧</p>
                            <p>还有丰厚大奖等你拿</p>
                        </div>
                        <div className={Styles.con_btn}>
                            <div onClick={()=>{this.jumpUpload()}}>
                                <WelcomeButton title='写下故事' />
                            </div>
                            <div onClick={()=>{this.jumpHot()}}>
                                <WelcomeButton title='看看故事' />
                            </div>
                        </div>
                    </div>
                    {
                        showHomePrize ? <HomePrize {...HomePrizeProps} /> : ''
                    }

                </div>
            </DocumentTitle>
        )
    }
}


export default Home;
