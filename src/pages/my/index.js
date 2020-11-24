import React, { Component, useState } from 'react'
import { connect } from 'dva';
import Styles from './index.less';
import DocumentTitle from 'react-document-title'
import Player from '../../components/Player'
import WelcomeButton from '../../components/WelcomeButton'
import router from 'umi/router';
import { Input } from 'antd';
import {cookieUtils, isIOS, wechatShare} from "../../utils/tools";
import MyWin from "../../components/MyWin";
import { Toast } from 'antd-mobile';
import wx from "weixin-js-sdk";

@connect(({ my, layout }) => ({ my, layout }))
class My extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bgImgTop: 0,
            conTop: '2rem',
            isDelete: false,
            deleteId: 0,
            isSet: false,
            isOpenWin: false,
            userName:null,

        }
    }
    componentDidMount() {
        if (window.innerHeight <= 667) {
            this.setState({
                bgImgTop: '-0.8rem',
                conTop: '1.2rem',
            })
        }
        // else if(window.innerHeight <= 736){
        //     this.setState({
        //         bgImgTop: '-.8rem',
        //         conTop: '1.2rem'
        //     })
        // }

        const { dispatch } = this.props;
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

    //展示登录框
    showLogin(){
        const { dispatch } = this.props;
        dispatch({
            type:'layout/setData',
            payload:{
                showLogin: true,
            }
        })
    }
    //切换tab
    changeSelect(num){
        const {userStory} = this.props.my;
        const {dispatch} = this.props;
        if(num === 1){
            dispatch({
                type:'my/setData',
                payload:{
                    story: userStory.myStory,
                    isSelect: num
                }
            })
        }else{
            dispatch({
                type:'my/setData',
                payload:{
                    story: userStory.myVotedStory,
                    isSelect: num
                }
            })
        }
    }
    //跳转上传页
    jumpUpload(){
        const { isSelect } = this.props.my;
        if(isSelect === 1){
            router.push('./upload')
        }else{
            router.push('./hot')
        }
    }
    //删除故事
    delete(e, id, reward_type){
        console.log('id',id)
        console.log('reward_type',reward_type)
        e.preventDefault()
        e.stopPropagation()
        if(reward_type != 0){
            Toast.info('该故事已获奖，无法删除', 1.5);
            return;
        }
        this.setState({
            isDelete : true,
            deleteId : id
        })
    }
    //确定删除故事
    deleteEnter(){
        const { deleteId } = this.state;
        console.log('deleteId',deleteId)
        const {dispatch} = this.props;
        const { token } = this.props.layout;
        const cookieToken = cookieUtils.get('token') || '';
        let isLogin = token || cookieToken;
        Toast.loading('正在删除', 60);
        dispatch({
            type:'my/deleteStory',
            payload:{
                "token":isLogin,
                "posterInfo":{
                    "id":deleteId
                }
            },
            callback: this.deleteEnterSuccess.bind(this)
        })
    }
    //删除成功
    deleteEnterSuccess(){
        Toast.info('已删除', 1);
        this.setState({
            isDelete : false,
        })
    }
    //取消删除故事
    deleteCancel(){
        this.setState({
            isDelete : false,
            deleteId : 0
        })
    }
    //打开修改昵称
    openSet(){
        this.setState({
            isSet : true,
        })
    }
    //输入用户昵称
    setUserName(e){
        // console.log(e.target.value)
        this.setState({
            userName: e.target.value
        })
    }
    //确定修改昵称
    setEnter(){
        const {dispatch} = this.props;
        const { userName } = this.state;
        const { token } = this.props.layout;
        const cookieToken = cookieUtils.get('token') || '';
        let isLogin = token || cookieToken;

        if(this.isEmojiCharacter(userName)){
            Toast.info('请输入英文或汉字', 1.5);
            return
        }else{
            Toast.loading('正在修改', 60);
            dispatch({
                type:'my/setUser',
                payload:{
                    token:isLogin,
                    username:userName
                },
                callback: this.setEnterSuccess.bind(this)
            })
        }

    }
    setEnterSuccess(){
        Toast.info('已修改', 1);
        this.setState({
            isSet : false,
        })
    }
    //取消修改昵称
    setCancel(){
        this.setState({
            isSet : false
        })
    }
    //查看详情
    jumpInfo(id){
        console.log(id)
        router.push('./storyInfo?share=0&id='+ id)
    }
    //打开中奖纪录
    openWin(){
        this.setState({
            isOpenWin : true,
        })
    }
    //关闭中奖纪录
    closeWin(){
        this.setState({
            isOpenWin : false,
        })
    }

    //判断emoji表情
    isEmojiCharacter(substring) {
        for (var i = 0; i < substring.length; i++) {
            var hs = substring.charCodeAt(i);
            if (0xd800 <= hs && hs <= 0xdbff) {
                if (substring.length > 1) {
                    var ls = substring.charCodeAt(i + 1);
                    var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                    if (0x1d000 <= uc && uc <= 0x1f77f) {
                        return true;
                    }
                }
            } else if (substring.length > 1) {
                var ls = substring.charCodeAt(i + 1);
                if (ls == 0x20e3) {
                    return true;
                }
            } else {
                if (0x2100 <= hs && hs <= 0x27ff) {
                    return true;
                } else if (0x2B05 <= hs && hs <= 0x2b07) {
                    return true;
                } else if (0x2934 <= hs && hs <= 0x2935) {
                    return true;
                } else if (0x3297 <= hs && hs <= 0x3299) {
                    return true;
                } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                    || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                    || hs == 0x2b50) {
                    return true;
                }
            }
        }
    }

    render() {
        const { bgImgTop, conTop, isDelete, isSet, isOpenWin, userName } = this.state;
        const { token } = this.props.layout;
        const cookieToken = cookieUtils.get('token') || '';
        let isLogin = token || cookieToken;
        const { userInfo,userStory,story,isSelect } = this.props.my;
        const MyWinProps = {
            closeWin: this.closeWin.bind(this),
            addressInfo: userInfo.addressInfo || '',
            user: userInfo.user || '',
            rewards: userInfo.rewards || '',
        };
        return (
            <DocumentTitle title='英菲尼迪『背后的力量』故事无限公司'>
                <div className={Styles.my} >
                    <img style={{top: bgImgTop}} className={Styles.my_bg} src={require('../../assets/my_bg.jpg')}
                         alt=""/>
                    <div style={{top: conTop}} className={Styles.my_con}>
                        <Player/>
                        {
                            isLogin ?
                                <div>
                                    <div className={Styles.con_user}>
                                        {
                                            userInfo && userInfo.user &&
                                            <div className={Styles.user_info}>
                                                <div className={Styles.info_name}>用户：{userInfo.user.username}</div>
                                                <img className={Styles.info_set} src={require('../../assets/my_set.png')} alt="" onClick={this.openSet.bind(this)}/>
                                            </div>
                                        }
                                        {
                                            userInfo && userInfo.myPosterCount >-1 ?
                                            <div className={Styles.user_num}>
                                                <span>发布数：{userInfo.myPosterCount}</span>
                                                <span>被赞数：{userInfo.myVoteCount}</span>
                                            </div> :''
                                        }
                                        {
                                            userInfo.rewards && userInfo.rewards.length > 0 ?
                                                <div className={Styles.user_win} onClick={this.openWin.bind(this)}>
                                                    <div className={Styles.win_title}>已中奖</div>
                                                    <div className={Styles.win_info}>查看获奖情况</div>
                                                </div>
                                                :''
                                        }
                                    </div>
                                    <div className={Styles.con_story}>
                                        {
                                            userStory.myStory &&
                                            <div className={Styles.story_title}>
                                                <span onClick={()=>{this.changeSelect(1)}} className={isSelect === 1 ? Styles.title_blod : ''}>我的故事:（{userStory.myStory.length}）</span>
                                                <span onClick={()=>{this.changeSelect(2)}} className={isSelect === 2 ? Styles.title_blod : ''}>点赞故事:（{userStory.myVotedStory.length}）</span>
                                            </div>
                                        }
                                        <div className={Styles.story_work}>
                                            {
                                                story && story.length > 0 ?
                                                    <div className={Styles.work_item}>
                                                        {
                                                            story.map((item,index)=>{
                                                                // console.log('item',item)
                                                                return(
                                                                    <div key={index} className={Styles.item} onClick={this.jumpInfo.bind(this,item.id)}>
                                                                        {
                                                                            isSelect === 1 ?
                                                                                <div className={Styles.item_delect} onClick={(e)=>{this.delete(e,item.id,item.reward_type)}}>
                                                                                    <img src={require('../../assets/welcome_closeicon.png')} alt=""/>
                                                                                </div>
                                                                                :''
                                                                        }
                                                                        {
                                                                            item.video_url ?
                                                                                <div className={Styles.item_video} >
                                                                                    <img src={require('../../assets/home_video_btn.png')} alt=""/>
                                                                                </div>
                                                                                :''
                                                                        }
                                                                        <img className={Styles.item_img} src={item.img_url} alt=""/>
                                                                        <div className={Styles.item_word}>
                                                                            {item.text}
                                                                        </div>
                                                                        <div className={Styles.item_buttom}>
                                                                            <img src={require('../../assets/hot.png')} alt=""/>
                                                                            <span>{item.vote_count}</span>
                                                                            <img src={require('../../assets/hot.png')} alt=""/>
                                                                            <span>{item.comment_count}</span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    :
                                                    <div className={Styles.work_null}>
                                                        {
                                                            isSelect === 1 ?
                                                                <div>
                                                                    还没有发布过故事哦，<span onClick={()=>{this.jumpUpload()}}>马上去发布>></span>
                                                                </div>
                                                                :
                                                                <div>
                                                                    还没有点赞过故事哦，<span onClick={()=>{this.jumpUpload()}}>马上去点赞>></span>
                                                                </div>
                                                        }
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className={Styles.con_login}>
                                    <div className={Styles.login} onClick={this.showLogin.bind(this)}>
                                        <WelcomeButton title='点击登录' />
                                    </div>
                                    <div className={`${Styles.login_hint} ${Styles.login_hint_one}`}>登录后将显示您的相关数据</div>
                                    <div className={`${Styles.login_hint}`}>还请尽快</div>
                                    <div className={`${Styles.login_hint}`}>登录查看您的信息</div>
                                </div>
                        }

                    </div>
                    {
                        isOpenWin? <MyWin {...MyWinProps}/>:''
                    }
                    {
                        isDelete ?
                            <div className={Styles.my_delete}>
                                <div className={Styles.delete_con}>
                                    <img className={Styles.delete_con_bg} src={require('../../assets/welcome_bottom_page.png')} alt=""/>
                                    <div className={Styles.delete_con_word}>确认要删除这条故事吗？</div>
                                    <div className={Styles.delete_con_btn}>
                                        <div className={`${Styles.con_btn_enter} ${isIOS() ? '' : Styles.con_btn_enter_and}`} onClick={this.deleteEnter.bind(this)}>
                                            <img src={require('../../assets/my_enter.png')} alt=""/>
                                            <span>确认</span>
                                        </div>
                                        <div className={`${Styles.con_btn_enter} ${isIOS() ? '' : Styles.con_btn_enter_and}`} onClick={this.deleteCancel.bind(this)}>
                                            <img src={require('../../assets/my_cancel.png')} alt=""/>
                                            <span>取消</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : ''
                    }
                    {
                        isSet ?
                            <div className={Styles.my_delete}>
                                <div className={Styles.delete_con}>
                                    <img className={Styles.delete_con_bg} src={require('../../assets/welcome_bottom_page.png')} alt=""/>
                                    <div className={`${Styles.delete_con_word} ${Styles.set_con_word}`}>来定义你在故事无限公司的昵称吧！</div>
                                    <Input className={Styles.set_con_input} placeholder='请输入您的昵称'  maxLength={6} onChange={this.setUserName.bind(this)} />
                                    <div className={Styles.delete_con_btn}>
                                        <div className={`${Styles.con_btn_enter}  ${isIOS() ? '' : Styles.con_btn_enter_and}`} onClick={this.setEnter.bind(this)}>
                                            <img src={require('../../assets/my_enter.png')} alt=""/>
                                            <span>确认</span>
                                        </div>
                                        <div className={`${Styles.con_btn_enter} ${isIOS() ? '' : Styles.con_btn_enter_and}`} onClick={this.setCancel.bind(this)}>
                                            <img src={require('../../assets/my_cancel.png')} alt=""/>
                                            <span>取消</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :''
                    }



                </div>
            </DocumentTitle>
        )
    }
}
export default My;
