import React, {Component} from 'react'
import {connect} from 'dva';
import Styles from './index.less';
import wx from 'weixin-js-sdk';
import {isIOS, cookieUtils, wechatShare} from '../../utils/tools'
import WelcomeButton from '../../components/WelcomeButton'
import Player from '../../components/Player'
import router from 'umi/router';
import Rule from '../../components/Rule'
import DocumentTitle from "react-document-title";

@connect(({welcome}) => ({welcome}))
class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timestamp: '',
            bgImgTop: 0,
            conTop: '2rem',
            showRule: false,
            isRuleBottom: false,
        }
    }

    componentDidMount() {

        console.log('window', window.innerHeight)
        console.log('window', window.innerWidth)
        cookieUtils.delete('token', {
            Expires: Date(),
            path: '/q4',
        });
        cookieUtils.delete('token', {
            Expires: Date(),
            path: '/',
        });
        // if (window.innerHeight <= 667) {
        //     this.setState({
        //         bgImgTop: '-1.74rem',
        //         conTop: '.32rem',
        //     })
        // }else if(window.innerHeight <= 736){
        //     this.setState({
        //         bgImgTop: '-.8rem',
        //         conTop: '1.2rem'
        //     })
        // }
       const { dispatch } = this.props

        if (isIOS()) {
            //获取appid和签名
            dispatch({
                type:'layout/getAppid',
                payload:{
                    url: window.location.href.split('#')[0]
                    // url:'https://power.infiniti-story.com/infiniti/q4/welcome'
                },
                callback: this.getAppidCallback.bind(this)
            })
        } else {
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
        const { dispatch } = this.props
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

    //点击活动规则
    showRule() {
        this.setState({
            showRule: true
        })
    }

    //关闭活动规则
    closeRule() {
        this.setState({
            showRule: false
        })
    }

    //点击应聘合伙人
    join() {
        router.push('./home')
    }


    render() {
        const {bgImgTop, conTop, showRule, isRuleBottom} = this.state;
        const ruleProps = {
            closeRule : this.closeRule.bind(this)
        }

        return (
            <DocumentTitle title='英菲尼迪『背后的力量』故事无限公司'>
                <div className={Styles.welcome}>
                    <img style={{top: bgImgTop}} className={Styles.welcome_bg} src={require('../../assets/welcome_bg.jpg')}
                         alt=""/>
                    <div style={{top: conTop}} className={Styles.welcome_con}>
                        <div className={Styles.con_rule}>
                            <img className={Styles.rule_book} src={require('../../assets/welcome_book.png')} alt=""/>
                            <span className={Styles.rule_word} onClick={() => {
                                this.showRule()
                            }}>活动规则</span>
                        </div>
                        <Player/>
                        <div className={Styles.con_join}>
                            <img className={Styles.join_hand} src={require('../../assets/hand.gif')} alt=""/>
                            <div className={Styles.join_btn} onClick={() => { this.join() }}>
                                <WelcomeButton title='应聘合伙人'/>
                            </div>
                        </div>
                        {
                            showRule ? <Rule {...ruleProps} /> : ''
                        }
                    </div>

                </div>
            </DocumentTitle>
        )
    }
}

export default Welcome;
