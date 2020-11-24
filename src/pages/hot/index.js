import React, { Component, useState } from 'react'
import { connect } from 'dva';
import Styles from './index.less';
import DocumentTitle from 'react-document-title'
import Player from '../../components/Player'
import HomeButton from '../../components/HomeButtom'
import ReactSwipe from 'react-swipe';
import {cookieUtils, wechatShare} from "../../utils/tools";
import HomePrize from "../../components/HomePrize";
import { Input, Button } from 'antd';
import Video from '../../components/Video'
import UploadMask from "../../components/UploadMask";
import router from "umi/router";
import { Toast } from 'antd-mobile';
import {isIOS} from "../../utils/tools";
import wx from 'weixin-js-sdk';


@connect(({ hot, layout }) => ({ hot, layout }))
class Hot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bgImgTop: 0,
            conTop: '2rem',
            conTopNum: 2,
            token:'',
            showHomePrize: false,
            showMask: false,
            showVote:false,
            showComment:false,
            inputMessage:null,
            homePrize:1,
            showFirstMask:false,
        }
        this.timeOutEvent = 0
    }
    componentDidMount() {

        if (window.innerHeight <= 667) {
            this.setState({
                bgImgTop: '-0.8rem',
                conTop: '1.2rem',
                conTopNum: 1.2
            })
        }

        const { dispatch } = this.props;
        const { token } = this.props.layout;
        const cookieToken = cookieUtils.get('token') || '';
        let isLogin = token || cookieToken;
        this.setState({
            token: isLogin
        })
        const { tabList, isRefresh } = this.props.hot;
        console.log('isRefresh-------',isRefresh)
        console.log('tabList-------',tabList)
        if( isRefresh ){
            let payload = {
                token: isLogin,
                page:1,
                page_size:50,
            }
            if(tabList === 1){
                payload.recommend = 1
            }
            if(tabList === 2){
                payload.hot = 1
            }
            if(tabList === 3){
                payload.newest = 1
            }
            dispatch({
                type:'hot/getWorksList',
                payload: payload
            })
            dispatch({
                type:'hot/setData',
                payload: {
                    swiperItem:[{}],
                    startSlide:0,
                }
            })
            Toast.loading('加载中...', 60);
        }
        dispatch({
            type:'upload/setData',
            payload:{
                url:''
            }
        })
        dispatch({
            type:'home/setData',
            payload:{
                isPlay: false,
            }
        })
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

    swiperCallback(e){
        console.log(e)
        let that = this;
        const { dispatch } = that.props;
        const{ swiperItem } = this.props.hot;
        // if( e%3 === 0){
            setTimeout(function(){
                dispatch({
                    type:'hot/setData',
                    payload:{
                        startSlide: e,
                    }
                })
                that.setState({
                    inputMessage:null,
                })

                if( e === swiperItem.length-1 ){
                    Toast.info('这是最后一个故事啦！快去转评赞吧，祝你获得锦鲤大奖', 1.6);
                }

            },300)
        // }
    }
    //切换标题
    changeActive(num){
        const { dispatch } = this.props;
        const { token } = this.state;
        Toast.loading('加载中...', 60);
        dispatch({
            type:'hot/setData',
            payload:{
                startSlide: 0,
                tabList: num,
            }
        })
        let payload={
            token: token,
            page:1,
            page_size:50,
        }
        if(num === 1){
            payload.recommend = 1
        }
        if(num === 2){
            payload.hot = 1
        }
        if(num === 3){
            payload.newest = 1
        }
        dispatch({
            type:'hot/setData',
            payload: {
                swiperItem:[{}]
            }
        })
        dispatch({
            type:'hot/getWorksList',
            payload: payload
        })

    }
    //关闭合伙人礼遇/获奖名单
    closeHomePrize(num){
        const { showHomePrize } = this.state;
        this.setState({
            showHomePrize : !showHomePrize,
            homePrize: num
        })
    }
    //点赞
    onPoint(id) {
        //验证登录
        console.log('onPoint',id)
        const {dispatch} = this.props;
        const { token } = this.props.layout;
        const cookieToken = cookieUtils.get('token') || '';
        let isLogin = token || cookieToken;
        if(!isLogin || isLogin === ''){
            dispatch({
                type:'layout/setData',
                payload:{
                    showLogin: true,
                }
            })
            return;
        }
        dispatch({
            type:'hot/setPoint',
            payload:{
                token: isLogin,
                poster_id: id
            },
            callback: this.pointCallback.bind(this)
        })
    }
    //点赞callback
    pointCallback(num){
        let that = this;
        if(num === 3002){
            this.setState({
                showMask: true
            })
            return
        }
        if(num === 1){
            console.log('执行动画函数')
            that.setState({
                showVote: true
            })
            setTimeout(function (){
                that.setState({
                    showVote: false
                })
            },1000)
        }
        if(num === 9){
            that.setState({
                showFirstMask: true
            })
        }
    }
    //关闭点赞已用完
    closeMask(){
        this.setState({
            showMask: false
        })
    }
    //关闭第一次点赞/评论
    closeFirstMask(){
        this.setState({
            showFirstMask: false
        })
    }
    //留言输入
    inputMessage(e){
        // console.log(e.target.value)
        this.setState({
            inputMessage: e.target.value
        })
    }
    //发送留言
    sendLeaveWords(id){
        console.log('sendLeaveWords',id)
        const {dispatch} = this.props;
        const { inputMessage } = this.state;
        const { token } = this.props.layout;
        const cookieToken = cookieUtils.get('token') || '';
        let isLogin = token || cookieToken;
        if(!isLogin || isLogin === ''){
            dispatch({
                type:'layout/setData',
                payload:{
                    showLogin: true,
                }
            })
            return;
        }
        if(!inputMessage && inputMessage=== ''){
            Toast.info('请输入评论内容', 1);
            return
        }
        dispatch({
            type:'hot/setComment',
            payload:{
                token: isLogin,
                poster_id: id,
                comment: inputMessage
            },
            callback: this.sendLeaveWordsSuccess.bind(this)
        })
    }
    //留言成功
    sendLeaveWordsSuccess(num){
        console.log('执行动画函数')
        let that = this;
        that.setState({
            showComment: true,
            inputMessage: null
        })
        setTimeout(function (){
            that.setState({
                showComment: false
            })
        },1000)
        if(num === 9){
            that.setState({
                showFirstMask: true
            })
        }
    }
    //跳转详情
    jumpInfo(id){
        console.log(id)
        const { dispatch } = this.props;
        dispatch({
            type:'hot/setData',
            payload: {
                isRefresh: false
            }
        })
        router.push('./storyInfo?share=0&id='+ id)
    }
    //内容逻辑
    content(index, item, conTopNum){
        // console.log(item)
        let {showVote,showComment,inputMessage} = this.state
        let rowArray=['3','5','6'];
        let columnArray = ['1','2','4'];
        let i = index % 3;
        let bgIndex;
        if(item.position === 1){
            bgIndex = rowArray[i]
        }else{
            bgIndex = columnArray[i]
        }
        if(index === 0){
            return(
                <div>
                    <img className={Styles.hot_bg_img} src={require('../../assets/hot_bg.jpg')}
                         alt=""/>
                    <div className={Styles.hot_hint} style={{top: ( 7.5 ) + 'rem'}}>
                        <img className={Styles.hot_hint_gif} src={require('../../assets/sliding.gif')} alt=""/>
                        <div className={Styles.hot_hint_title}>向左滑动，了解更多故事</div>
                        <div className={Styles.hot_hint_sec}>边看边赞边留言，距离锦鲤不再远</div>
                    </div>
                </div>
            )
        }else{
            return(
                <div>
                    {
                        bgIndex === '1' ?
                        <div>
                            <img className={Styles.hot_bg_img} src={require('../../assets/hot_bg1.jpg')}
                                 alt=""/>
                            <div className={Styles.hot_hint1} style={{top: ( conTopNum + 0.8 ) + 'rem'}}>
                                <img className={Styles.hot_hint_bg} src={require('../../assets/hot_k1.png')} alt="" onClick={this.jumpInfo.bind(this,item.id)}/>
                                {
                                    item.video_url ?
                                        <div className={Styles.video} onClick={this.jumpInfo.bind(this,item.id)}>
                                            <img className={Styles.video_play} src={require('../../assets/home_video_btn.png')} alt=""/>
                                            <img className={Styles.video_img} src={item.img_url} alt=""/>
                                        </div>
                                        :
                                        <img className={Styles.hot_hint_img} src={item.img_url} alt="" onClick={this.jumpInfo.bind(this,item.id)}/>
                                }

                                <div className={Styles.hot_info}>
                                    <div className={Styles.hot_info_hand}>
                                        <img className={Styles.hand} src={require('../../assets/hand2.gif')} alt=""/>
                                    </div>
                                    <div className={Styles.hot_info_vote}  onClick={this.onPoint.bind(this, item.id)} >
                                        {
                                            showVote ? <div className={Styles.hot_info_num}>+1</div> :''
                                        }
                                        <img src={require('../../assets/info_heart.png')} alt=""/>
                                        {item.vote_count}
                                    </div>
                                    <div className={Styles.hot_info_comment}>
                                        {
                                            showComment ? <div className={Styles.hot_info_num}>+1</div> :''
                                        }
                                        <img src={require('../../assets/info_comment.png')} alt=""/>
                                        {item.comment_count}
                                    </div>
                                </div>
                                <div className={Styles.hot_input}>
                                    <Input className={Styles.input} placeholder='写出你的留言' value={inputMessage} maxLength={20} onChange={this.inputMessage.bind(this)}/>
                                    <Button className={`${Styles.hot_input_btn} ${ isIOS() ? Styles.hot_input_btn_ios : ''}`} onClick={this.sendLeaveWords.bind(this, item.id)}>发送</Button>
                                </div>
                            </div>
                        </div> :''
                    }
                    {
                        bgIndex === '2' ?
                        <div>
                            <img className={Styles.hot_bg_img} src={require('../../assets/hot_bg2.jpg')}
                                 alt=""/>
                            <div className={Styles.hot_hint1} style={{top: ( conTopNum + 0.8 ) + 'rem'}}>
                                <img className={Styles.hot_hint_bg} src={require('../../assets/hot_k1.png')} alt=""/>
                                {
                                    item.video_url ?
                                        <div className={Styles.video} onClick={this.jumpInfo.bind(this,item.id)}>
                                            <img className={Styles.video_play} src={require('../../assets/home_video_btn.png')} alt=""/>
                                            <img className={Styles.video_img} src={item.img_url} alt=""/>
                                        </div>
                                        :
                                        <img className={Styles.hot_hint_img} src={item.img_url} alt="" onClick={this.jumpInfo.bind(this,item.id)}/>
                                }

                                <div className={Styles.hot_info}>
                                    <div className={Styles.hot_info_hand}>
                                        <img className={Styles.hand} src={require('../../assets/hand2.gif')} alt=""/>
                                    </div>
                                    <div className={Styles.hot_info_vote} onClick={this.onPoint.bind(this, item.id)} >
                                        {
                                            showVote ? <div className={Styles.hot_info_num}>+1</div> :''
                                        }
                                        <img src={require('../../assets/info_heart.png')} alt="" />
                                        {item.vote_count}
                                    </div>
                                    <div className={Styles.hot_info_comment}>
                                        {
                                            showComment ? <div className={Styles.hot_info_num}>+1</div> :''
                                        }
                                        <img src={require('../../assets/info_comment.png')} alt=""/>
                                        {item.comment_count}
                                    </div>
                                </div>
                                <div className={Styles.hot_input}>
                                    <Input className={Styles.input} placeholder='写出你的留言' value={inputMessage} maxLength={20} onChange={this.inputMessage.bind(this)} />
                                    <Button className={`${Styles.hot_input_btn} ${ isIOS() ? Styles.hot_input_btn_ios : ''}`} onClick={this.sendLeaveWords.bind(this, item.id)}>发送</Button>
                                </div>
                            </div>
                        </div>:''
                    }
                    {
                        bgIndex === '3' ?
                            <div>
                                <img className={Styles.hot_bg_img} src={require('../../assets/hot_bg3.jpg')}
                                     alt=""/>
                                <div className={Styles.hot_hint3} style={{top: ( conTopNum + 1.6 ) + 'rem'}}>
                                    <img className={Styles.hot_hint_bg} src={require('../../assets/hot_k3.png')} alt=""/>
                                    {
                                        item.video_url ?
                                            <div className={Styles.video} onClick={this.jumpInfo.bind(this,item.id)}>
                                                <img className={Styles.video_play} src={require('../../assets/home_video_btn.png')} alt=""/>
                                                <img className={Styles.video_img} src={item.img_url} alt=""/>
                                            </div>
                                            :
                                            <img className={Styles.hot_hint_img} src={item.img_url} alt="" onClick={this.jumpInfo.bind(this,item.id)}/>
                                    }

                                    <div className={Styles.hot_info}>
                                        <div className={Styles.hot_info_hand}>
                                            <img className={Styles.hand} src={require('../../assets/hand2.gif')} alt=""/>
                                        </div>
                                        <div className={Styles.hot_info_vote} onClick={this.onPoint.bind(this, item.id)} >
                                            {
                                                showVote ? <div className={Styles.hot_info_num}>+1</div> :''
                                            }
                                            <img src={require('../../assets/info_heart.png')} alt=""/>
                                            {item.vote_count}
                                        </div>
                                        <div className={Styles.hot_info_comment}>
                                            {
                                                showComment ? <div className={Styles.hot_info_num}>+1</div> :''
                                            }
                                            <img src={require('../../assets/info_comment.png')} alt=""/>
                                            {item.comment_count}
                                        </div>
                                    </div>
                                    <div className={Styles.hot_input}>
                                        <Input className={Styles.input} placeholder='写出你的留言' value={inputMessage} maxLength={20} onChange={this.inputMessage.bind(this)} />
                                        <Button className={`${Styles.hot_input_btn} ${ isIOS() ? Styles.hot_input_btn_ios : ''}`} onClick={this.sendLeaveWords.bind(this, item.id)}>发送</Button>
                                    </div>
                                </div>
                            </div>:''
                    }
                    {
                        bgIndex === '4' ?
                            <div>
                                <img className={Styles.hot_bg_img} src={require('../../assets/hot_bg4.jpg')}
                                     alt=""/>
                                <div className={Styles.hot_hint1} style={{top: ( conTopNum + 0.8 ) + 'rem'}}>
                                    <img className={Styles.hot_hint_bg} src={require('../../assets/hot_k1.png')} alt=""/>
                                    {
                                        item.video_url ?
                                            <div className={Styles.video} onClick={this.jumpInfo.bind(this,item.id)}>
                                                <img className={Styles.video_play} src={require('../../assets/home_video_btn.png')} alt=""/>
                                                <img className={Styles.video_img} src={item.img_url} alt=""/>
                                            </div>
                                            :
                                            <img className={Styles.hot_hint_img} src={item.img_url} alt="" onClick={this.jumpInfo.bind(this,item.id)}/>
                                    }
                                    <div className={Styles.hot_info}>
                                        <div className={Styles.hot_info_hand}>
                                            <img className={Styles.hand} src={require('../../assets/hand2.gif')} alt=""/>
                                        </div>
                                        <div className={Styles.hot_info_vote} onClick={this.onPoint.bind(this, item.id)}>
                                            {
                                                showVote ? <div className={Styles.hot_info_num}>+1</div> :''
                                            }
                                            <img src={require('../../assets/info_heart.png')} alt="" />
                                            {item.vote_count}
                                        </div>
                                        <div className={Styles.hot_info_comment}>
                                            {
                                                showComment ? <div className={Styles.hot_info_num}>+1</div> :''
                                            }
                                            <img src={require('../../assets/info_comment.png')} alt=""/>
                                            {item.comment_count}
                                        </div>
                                    </div>
                                    <div className={Styles.hot_input}>
                                        <Input className={Styles.input} placeholder='写出你的留言' value={inputMessage} maxLength={20} onChange={this.inputMessage.bind(this)} />
                                        <Button className={`${Styles.hot_input_btn} ${ isIOS() ? Styles.hot_input_btn_ios : ''}`} onClick={this.sendLeaveWords.bind(this, item.id)}>发送</Button>
                                    </div>
                                </div>
                            </div>:''
                    }
                    {
                        bgIndex === '5' ?
                            <div>
                                <img className={Styles.hot_bg_img} src={require('../../assets/hot_bg5.jpg')}
                                     alt=""/>
                                <div className={Styles.hot_hint3} style={{top: ( conTopNum + 1.6 ) + 'rem'}}>
                                    <img className={Styles.hot_hint_bg} src={require('../../assets/hot_k3.png')} alt=""/>
                                    {
                                        item.video_url ?
                                            <div className={Styles.video} onClick={this.jumpInfo.bind(this,item.id)}>
                                                <img className={Styles.video_play} src={require('../../assets/home_video_btn.png')} alt=""/>
                                                <img className={Styles.video_img} src={item.img_url} alt=""/>
                                            </div>
                                            :
                                            <img className={Styles.hot_hint_img} src={item.img_url} alt="" onClick={this.jumpInfo.bind(this,item.id)}/>
                                    }
                                    <div className={Styles.hot_info}>
                                        <div className={Styles.hot_info_hand}>
                                            <img className={Styles.hand} src={require('../../assets/hand2.gif')} alt=""/>
                                        </div>
                                        <div className={Styles.hot_info_vote} onClick={this.onPoint.bind(this, item.id)}>
                                            {
                                                showVote ? <div className={Styles.hot_info_num}>+1</div> :''
                                            }
                                            <img src={require('../../assets/info_heart.png')} alt=""  />
                                            {item.vote_count}
                                        </div>
                                        <div className={Styles.hot_info_comment}>
                                            {
                                                showComment ? <div className={Styles.hot_info_num}>+1</div> :''
                                            }
                                            <img src={require('../../assets/info_comment.png')} alt=""/>
                                            {item.comment_count}
                                        </div>
                                    </div>
                                    <div className={Styles.hot_input}>
                                        <Input className={Styles.input} placeholder='写出你的留言' value={inputMessage} maxLength={20} onChange={this.inputMessage.bind(this)} />
                                        <Button className={`${Styles.hot_input_btn} ${ isIOS() ? Styles.hot_input_btn_ios : ''}`} onClick={this.sendLeaveWords.bind(this, item.id)}>发送</Button>
                                    </div>
                                </div>
                            </div>:''
                    }
                    {
                        bgIndex === '6' ?
                            <div>
                                <img className={Styles.hot_bg_img} src={require('../../assets/hot_bg6.jpg')}
                                     alt=""/>
                                <div className={Styles.hot_hint3} style={{top: ( conTopNum + 1.6 ) + 'rem'}}>
                                    <img className={Styles.hot_hint_bg} src={require('../../assets/hot_k3.png')} alt=""/>
                                    {
                                        item.video_url ?
                                            <div className={Styles.video} onClick={this.jumpInfo.bind(this,item.id)}>
                                                <img className={Styles.video_play} src={require('../../assets/home_video_btn.png')} alt=""/>
                                                <img className={Styles.video_img} src={item.img_url} alt=""/>
                                            </div>
                                            :
                                            <img className={Styles.hot_hint_img} src={item.img_url} alt="" onClick={this.jumpInfo.bind(this,item.id)}/>
                                    }
                                    <div className={Styles.hot_info}>
                                        <div className={Styles.hot_info_hand}>
                                            <img className={Styles.hand} src={require('../../assets/hand2.gif')} alt=""/>
                                        </div>
                                        <div className={Styles.hot_info_vote} onClick={this.onPoint.bind(this, item.id)} >
                                            {
                                                showVote ? <div className={Styles.hot_info_num}>+1</div> :''
                                            }
                                            <img src={require('../../assets/info_heart.png')} alt="" />
                                            {item.vote_count}
                                        </div>
                                        <div className={Styles.hot_info_comment}>
                                            {
                                                showComment ? <div className={Styles.hot_info_num}>+1</div> :''
                                            }
                                            <img src={require('../../assets/info_comment.png')} alt=""/>
                                            {item.comment_count}
                                        </div>
                                    </div>
                                    <div className={Styles.hot_input}>
                                        <Input className={Styles.input} placeholder='写出你的留言' value={inputMessage} maxLength={20} onChange={this.inputMessage.bind(this)} />
                                        <Button className={`${Styles.hot_input_btn} ${ isIOS() ? Styles.hot_input_btn_ios : ''}`} onClick={this.sendLeaveWords.bind(this, item.id)}>发送</Button>
                                    </div>
                                </div>
                            </div>:''
                    }
                </div>
            )
        }
    }

    render() {
        const { bgImgTop, conTop, conTopNum, showHomePrize, showMask, homePrize, showFirstMask } = this.state;
        const{ swiperItem,startSlide,tabList } = this.props.hot;
        const HomePrizeProps = {
            closeWindow : this.closeHomePrize.bind(this),
            homePrize: homePrize
        }
        const closeMaskProps = {
            closeMask : this.closeMask.bind(this),
            keyWord:'pointMore'
        }
        const showFirstMaskProps= {
            closeMask : this.closeFirstMask.bind(this),
            keyWord:'first'
        }

        return (
            <DocumentTitle title='英菲尼迪『背后的力量』故事无限公司'>
                <div className={Styles.hot} >
                    <div style={{top: conTopNum + 'rem'}} className={Styles.hot_music}>
                        <Player/>
                    </div>
                    <div style={{top: ( conTopNum + 0.22 ) + 'rem'}}
                         className={ `${Styles.hot_left} ${tabList === 1 ? Styles.hot_left_active :'' }` }
                         onClick={()=>{this.changeActive(1)}}
                    >
                        <img src={require('../../assets/hot_left.png')} alt=""/>
                        <span className={`${isIOS() ?'': Styles.active_and}`}>推荐</span>
                    </div>
                    <div style={ tabList === 2 ? {  top: ( conTopNum + 1.04 ) + 'rem'}:{  top: ( conTopNum + 1.1 ) + 'rem'} }
                         className={`${Styles.hot_left} ${tabList === 2 ? Styles.hot_left_active :''}` }
                         onClick={()=>{this.changeActive(2)}}
                    >
                        <img src={require('../../assets/hot_left.png')} alt=""/>
                        <span className={`${isIOS() ?'': Styles.active_and}`}>热门</span>
                    </div>
                    <div style={{top: ( conTopNum + 1.9 ) + 'rem'}}
                         className={`${Styles.hot_left} ${tabList === 3 ? Styles.hot_left_active :''}` }
                         onClick={()=>{this.changeActive(3)}}
                    >
                        <img src={require('../../assets/hot_left.png')} alt=""/>
                        <span className={`${isIOS() ?'': Styles.active_and}`}>最新</span>
                    </div>

                    <div style={{top: ( conTopNum + 2.7 ) + 'rem'}} className={Styles.hot_left_gift}  onClick={()=>{this.closeHomePrize(1)}}>
                        <HomeButton title='合伙人礼遇' />
                    </div>
                    <div style={{top: ( conTopNum + 4.3 ) + 'rem'}} className={Styles.hot_left_list} onClick={()=>{this.closeHomePrize(2)}}>
                        <HomeButton title='获奖名单'/>
                    </div>
                    {
                        showHomePrize ? <HomePrize {...HomePrizeProps} /> : ''
                    }
                    {
                        showMask ? <UploadMask {...closeMaskProps} /> : ''
                    }
                    {
                        showFirstMask ? <UploadMask {...showFirstMaskProps} /> : ''
                    }
                    <ReactSwipe
                        className="carousel"
                        swipeOptions={
                            {
                                startSlide : startSlide,
                                speed: 300,
                                continuous:false,

                                callback : this.swiperCallback.bind(this)
                            }
                        }
                    >
                        {
                            swiperItem.length > 0 ?
                                swiperItem.map((item,index)=>{
                                    return(
                                        <div style={{top: bgImgTop}} className={Styles.hot_bg}  key={index}>
                                            {this.content(index,item,conTopNum)}
                                        </div>
                                    )
                                }) :''
                        }
                    </ReactSwipe>

                </div>
            </DocumentTitle>
        )
    }
}
export default Hot;
