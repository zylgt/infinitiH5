import React, {Component} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import Styles from './index.less';
import DocumentTitle from 'react-document-title'
import Player from '../../components/Player'
import HomeButton from '../../components/HomeButtom'
import WelcomeButton from '../../components/WelcomeButton'
import Video from '../../components/Video'
import Back from '../../components/Back'
import HomePrize from '../../components/HomePrize'
import {Input, Button} from 'antd';
import {cookieUtils, getQueryString, isIOS, wechatShare} from '../../utils/tools';
import UploadMask from '../../components/UploadMask';
import {Toast} from 'antd-mobile';
import Canvas from "../../components/Canvas";
import wx from "weixin-js-sdk";

@connect(({info, layout, upload, hot}) => ({info, layout, upload, hot}))
class Info extends Component {
    constructor(props) {
        super(props)
        // props.info.storyInfo = {}
        this.state = {
            bgImgTop: 0,
            conTop: '2rem',
            isShowComment: false,
            showMask: false,
            textMessage: '',
            id: '',
            share:'0',
            newImgUrl: '',
            isShowShare: false,
            img_base_url:'',
            code_base_url:'',
        }
        this.dp = null
    }

    componentDidMount() {
        const {dispatch} = this.props;
        if (window.innerHeight <= 667) {
            this.setState({
                bgImgTop: '-0.8rem',
                conTop: '1.2rem',
            })
        }
        let id = getQueryString('id') || ''
        let share = getQueryString('share') || ''
        console.log('id', id)
        console.log('share', share)
        this.setState({
            id: id,
            share: share,
            img_base_url:'',
            code_base_url:'',
        })
        Toast.loading('加载中...', 60);
        dispatch({
            type: 'info/setData',
            payload: {
                storyInfo: {}
            }
        })
        dispatch({
            type: 'upload/setData',
            payload: {
                keepToast:false
            }
        })
        dispatch({
            type: 'info/getStory',
            payload: {
                id: id
            },
            callback: this.getStoryCallback.bind(this)
        })

        if (isIOS()) {
            if(share === '0'){
                wechatShare(dispatch)
            }else{
                dispatch({
                    type: 'layout/getAppid',
                    payload: {
                        url: window.location.href.split('#')[0]
                        // url:'https://power.infiniti-story.com/infiniti/q4/welcome'
                    },
                    callback: this.getAppidCallback.bind(this)
                })
            }
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
    getAppidCallback(response) {
        // console.log('response', response)
        const { dispatch } = this.props;
        wx.config({
            debug: response.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.appId, // 必填，公众号的唯一标识
            timestamp: parseInt(response.timestamp), // 必填，生成签名的时间戳
            nonceStr: response.nonceStr, // 必填，生成签名的随机串
            signature: response.signature,// 必填，签名
            jsApiList: response.jsApiList // 必填，需要使用的JS接口列表
        });
        wechatShare(dispatch)
    }
    //转base64
    base64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var dataURL = canvas.toDataURL("image/png");  // 可选其他值 image/jpeg
        return dataURL;
    }
    getBase(src, key) {
        var image = new Image();
        let that =this;
        image.src = src + '?v=' + Math.random(); // 处理缓存
        image.crossOrigin = "*";  // 支持跨域图片
        image.onload = function(){
            var base64 = that.base64Image(image);
            // console.log(key, base64)
            if(key === 'bg_url'){
                that.setState({
                    img_base_url:base64,
                })
            }else{
                that.setState({
                    code_base_url:base64,
                })
            }
        }
    }
    //获取故事信息成功
    getStoryCallback(storyInfo){
        let that = this;
        that.getBase(storyInfo.code_url, 'code_url')
        setTimeout(function (){
            that.getBase(storyInfo.img_url, 'bg_url')
        },500)
    }

    //成为合伙人
    jumpUpload() {
        router.push('./upload')
    }

    //展示评论/获取评论
    getComment(id) {
        // console.log('getComment',id)
        const {dispatch} = this.props;
        const {token} = this.props.layout;
        const cookieToken = cookieUtils.get('token') || '';
        let isLogin = token || cookieToken;
        if (!isLogin || isLogin === '') {
            dispatch({
                type: 'layout/setData',
                payload: {
                    showLogin: true,
                }
            })
            return;
        }
        this.setState({
            isShowComment: true
        })
        dispatch({
            type: 'info/getComment',
            payload: {
                token: isLogin,
                poster_id: id,
                page: 1,
                page_size: 100
            },
        })
    }

    //关闭评论
    closeComment() {
        this.setState({
            isShowComment: false
        })
    }

    //分享
    onShare() {
        console.log('onShare')
        const {id} = this.state;
        const {dispatch} = this.props;
        const {token} = this.props.layout;
        const cookieToken = cookieUtils.get('token') || '';
        let isLogin = token || cookieToken;

        if (!isLogin || isLogin === '') {
            dispatch({
                type: 'layout/setData',
                payload: {
                    showLogin: true,
                }
            })
            return;
        }
        let that = this;
        dispatch({
            type: 'info/setShare',
            payload: {
                token: isLogin,
                poster_id: parseInt(id)
            },
        })
        if(this.props.upload.canvasUrl!=''){
            dispatch({
                type: 'upload/setData',
                payload: {
                    isShowShare:true
                }
            })
            Toast.hide();
            Toast.info('长按图片保存相册，赶快去分享吧！', 1.5);
        }else{
            Toast.loading('生成海报中...', 0);
            dispatch({
                type: 'upload/setData',
                payload: {
                    keepToast:true
                }
            })
        }
    }

    //点赞
    onPoint(id) {
        console.log('onPoint', id)
        const {dispatch} = this.props;
        const {token} = this.props.layout;
        const cookieToken = cookieUtils.get('token') || '';
        let isLogin = token || cookieToken;
        if (!isLogin || isLogin === '') {
            dispatch({
                type: 'layout/setData',
                payload: {
                    showLogin: true,
                }
            })
            return;
        }
        dispatch({
            type: 'info/setPoint',
            payload: {
                token: isLogin,
                poster_id: id
            },
            callback: this.pointCallback.bind(this)
        })
    }

    //点赞已用完
    pointCallback(num) {
        let {isRefresh, swiperItem} = this.props.hot;
        let {storyInfo} = this.props.info;
        const {id} = this.state;
        const {dispatch} = this.props;
        if (num === 1 && !isRefresh) {
            for (let i = 1; i < swiperItem.length; i++) {
                if (swiperItem[i].id == id) {
                    swiperItem[i].vote_count = storyInfo.vote_count;
                    dispatch({
                        type: 'hot/setData',
                        payload: {
                            swiperItem: swiperItem
                        }
                    })
                    break;
                }
            }
        }
        //点赞已用完
        if (num === 3002) {
            this.setState({
                showMask: true
            })
        }
    }

    //关闭点赞已用完
    closeMask() {
        this.setState({
            showMask: false
        })
    }

    //写评论
    messageChange(e) {
        // console.log(e.target.value)
        this.setState({
            textMessage: e.target.value
        })
    }

    //发送评论
    sendMessage() {
        const {dispatch} = this.props;
        const {id} = this.state;
        const {textMessage} = this.state;
        const {token} = this.props.layout;
        const cookieToken = cookieUtils.get('token') || '';
        let isLogin = token || cookieToken;
        if (!textMessage || textMessage === '') {
            Toast.info('请输入评论内容', 1);
            return
        }
        dispatch({
            type: 'info/setComment',
            payload: {
                token: isLogin,
                poster_id: parseInt(id),
                comment: textMessage
            },
            callback: this.sendMessageSuccess.bind(this)
        })
    }

    sendMessageSuccess() {
        let {isRefresh, swiperItem} = this.props.hot;
        let {comment} = this.props.info;
        const {id} = this.state;
        const {dispatch} = this.props;
        if (!isRefresh) {
            for (let i = 1; i < swiperItem.length; i++) {
                if (swiperItem[i].id == id) {
                    swiperItem[i].comment_count = comment.allNum;
                    dispatch({
                        type: 'hot/setData',
                        payload: {
                            swiperItem: swiperItem
                        }
                    })
                    break;
                }
            }
        }
        this.setState({
            textMessage: null
        })
    }

    //关闭分享
    closeShare() {
        const {dispatch} = this.props;
        dispatch({
            type: 'upload/setData',
            payload: {
                isShowShare:false
            }
        })
    }

    //判断用户昵称
    isPhone(phone) {
        if (!(/^[1]([3-9])[0-9]{9}$/.test(phone))) {
            // console.log("手机号码有误，请重填");
            return phone;
        } else {
            // console.log('是手机号码')
            let str = phone.substring(0, 3);
            let str1 = phone.substring(8, 11);
            return str + '****' + str1
        }
    }

    render() {
        const {bgImgTop, conTop, isShowComment, showMask, textMessage,
            newImgUrl, isShowShare, img_base_url, code_base_url,share} = this.state;
        const {storyInfo, comment} = this.props.info;

        const closeMaskProps = {
            closeMask: this.closeMask.bind(this),
            keyWord: 'pointMore'
        }

        const canvasProps = {
            url: storyInfo.img_url,
            side: storyInfo.position - 1,
            codeUrl: storyInfo.code_url,
            textWord: storyInfo.text,
            isVideo: storyInfo.video_url ? 1 : 0,
            nickName:storyInfo.username,
        }
        // console.log('canvasProps',canvasProps)
        return (
            <DocumentTitle title='英菲尼迪『背后的力量』故事无限公司'>
                <div className={Styles.info}>
                    <canvas className={Styles.info_canvas_ele}></canvas>
                    <img style={{top: bgImgTop}} className={Styles.info_bg} src={require('../../assets/home_bg.jpg')}
                         alt=""/>
                    <div style={{top: conTop}} className={Styles.info_con}>
                        {
                            share === '0' ? <Back/> : ''
                        }
                        <Player/>
                        {
                            this.props.upload.isShowShare ?
                                <div className={Styles.info_canvas}>
                                    <div className={Styles.info_canvas_con}>
                                        <div className={Styles.canvas_close} onClick={this.closeShare.bind(this)}>
                                            <img src={require('../../assets/welcome_closeicon.png')} alt=""/>
                                        </div>
                                        <img className={Styles.canvas_img} src={this.props.upload.canvasUrl} alt=""/>
                                    </div>
                                </div> : ''
                        }

                        <div className={Styles.con_img}>
                            {
                                storyInfo.position === 1 ?
                                    <div className={Styles.img_across}>
                                        {
                                            storyInfo.img_url ?  <img className={Styles.img_across_bg} src={require('../../assets/info_row.png')}
                                                                      alt=""/> :''
                                        }
                                        {
                                            storyInfo.video_url ?
                                                <div className={Styles.video}>
                                                    <Video
                                                        url={storyInfo.video_url}
                                                        height='2.6rem'
                                                        width='4.6rem'
                                                        poster={storyInfo.img_url}
                                                        className={Styles.video}
                                                    />
                                                </div>
                                                :
                                                <div>
                                                    {
                                                        storyInfo.img_url ? <img className={Styles.img} src={storyInfo.img_url} alt=""/> : ''
                                                    }
                                                </div>
                                        }
                                    </div>
                                    :
                                    <div className={Styles.img_column}>
                                        {
                                            storyInfo.img_url ? <img className={Styles.img_across_bg}
                                                                     src={require('../../assets/info_column.png')} alt=""/> : ''
                                        }

                                        {
                                            storyInfo.video_url ?
                                                <div className={Styles.video}>
                                                    <Video
                                                        url={storyInfo.video_url}
                                                        height='4.9rem'
                                                        width='2.8rem'
                                                        poster={storyInfo.img_url}
                                                    />
                                                </div>
                                                :
                                                <div>
                                                    {
                                                        storyInfo.img_url ? <img className={Styles.img} src={storyInfo.img_url} alt=""/> : ''
                                                    }
                                                </div>
                                        }
                                    </div>
                            }
                        </div>

                        {
                            storyInfo.img_url ?
                                <div className={Styles.con_info}>
                                    <div className={Styles.con_info_name}>用户：{this.isPhone(storyInfo.username)}</div>
                                    <div className={Styles.con_info_word}>
                                        {storyInfo.text}
                                    </div>
                                </div>
                                :''
                        }
                        {
                            storyInfo.img_url ?
                                <div className={Styles.con_right}>
                                    <div className={Styles.right_info} onClick={this.onShare.bind(this)}>
                                        <img src={require('../../assets/info_share.png')} alt=""/>
                                    </div>
                                    <div className={Styles.right_info} onClick={this.onPoint.bind(this, storyInfo.id)}>
                                        <img src={require('../../assets/info_heart.png')} alt=""/>
                                        {storyInfo.vote_count}
                                    </div>
                                    <div className={Styles.right_info} onClick={this.getComment.bind(this, storyInfo.id)}>
                                        <img src={require('../../assets/info_comment.png')} alt=""/>
                                        {storyInfo.comment_count}
                                    </div>
                                </div>:''
                        }

                        {
                            isShowComment ?
                                <div className={Styles.con_comment}>
                                    <div className={Styles.comment_title}>
                                        <div>评论 {storyInfo.comment_count}</div>
                                        <img src={require('../../assets/welcome_closeicon.png')}
                                             onClick={this.closeComment.bind(this)}/>
                                    </div>
                                    <div className={Styles.comment_con}>
                                        {
                                            comment.allNum > 0 ?
                                                comment.list.map((item, index) => {
                                                    return (
                                                        <div className={Styles.comment_item} key={index}>
                                                            <div
                                                                className={Styles.item_name}>用户：{this.isPhone(item.username)}</div>
                                                            <div className={Styles.item_con}>{item.comment}</div>
                                                        </div>
                                                    )
                                                }) : ''
                                        }
                                    </div>
                                    <div className={Styles.comment_input}>
                                        <Input className={Styles.input} placeholder='写出你的留言（20字以内）' value={textMessage}
                                               maxLength={20} onChange={this.messageChange.bind(this)}/>
                                        <Button className={Styles.btn} type="primary"
                                                onClick={this.sendMessage.bind(this)}>发送</Button>
                                    </div>
                                </div> : ''
                        }

                        {
                            storyInfo.img_url ?
                                <div className={Styles.con_btn} onClick={this.jumpUpload.bind(this)}>
                                    <WelcomeButton title='成为合伙人'/>
                                </div>
                                :''
                        }

                        {
                            showMask ? <UploadMask {...closeMaskProps} /> : ''
                        }
                        {
                            storyInfo.img_url ? <Canvas {...canvasProps} /> : ''
                        }

                    </div>

                </div>
            </DocumentTitle>
        )
    }
}


export default Info;
