import React, {Component, useState} from 'react'
import {connect} from 'dva';
import Styles from './index.less';
import DocumentTitle from 'react-document-title'
import Player from '../../components/Player'
import {Input, Checkbox} from 'antd';
import UploadImg from '../../components/UploadImg'
import UploadVideo from '../../components/UploadVideo'
import WelcomeButton from '../../components/WelcomeButton'
import router from "umi/router";
import Back from '../../components/Back';
import Canvas from '../../components/Canvas';
import Rule from '../../components/Rule';
import { Toast } from 'antd-mobile';
import {cookieUtils, isIOS, isWchat, wechatShare} from "../../utils/tools";
import UploadSend from '../../components/UploadSend';
import UploadMask from '../../components/UploadMask';
import wx from "weixin-js-sdk";


const {TextArea} = Input;

@connect(({ upload, layout }) => ({ upload, layout }))
class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bgImgTop: 0,
            conTop: '2rem',
            checked: false,
            textNum: 0,
            textValue: null,
            isSubmit: false,
            isSend: false,
            showRule: false,
            tag: null,
            showMask: false,
            img_base_url:'',
            code_base_url:'',
        }
    }

    componentDidMount() {
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
        //设置热门可更新
        dispatch({
            type:'hot/setData',
            payload: {
                isRefresh: true
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

    onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };
    onChange = ({fileList: newFileList}) => {
        this.setState({
            fileList: newFileList
        })
    };

    // 是否选中
    CheckboxChange(e) {
        this.setState({
            checked: e.target.checked
        })
    }

    //跳转写下故事
    join() {
        const { checked, textValue, tag } = this.state;
        const {dispatch} = this.props;
        const { token } = this.props.layout;
        const cookieToken = cookieUtils.get('token') || '';
        let isLogin = token || cookieToken;
        const {url, side, videoUrl} = this.props.upload;
        //验证是否勾选协议
        if(!checked){
            Toast.info('请勾选同意“活动规则”', 1.2);
            return;
        }
        //验证是否输入内容
        if(!textValue){
            Toast.info('请将故事内容填写完整', 1);
            return;
        }
        if(this.isEmojiCharacter(textValue)){
            Toast.info('请输入英文或汉字', 1.5);
            return
        }
        Toast.loading('正在提交', 60);
        this.setState({
            img_base_url:'',
            code_base_url:'',
        })
        //提交
        dispatch({
            type: 'upload/submitStory',
            payload: {
                token: isLogin,
                posterInfo:{
                    text: textValue,
                    position: side + 1,
                    img_url: url ,
                    video_url: tag === 'video' ? videoUrl : '',
                }
            },
            callback: this.submitSuccess.bind(this)
        })

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

    //提交成功逻辑
    submitSuccess(num,info){
        let that = this;
        if(num === '1'){
            router.push('./upload?submit=1')
            this.setState({
                isSubmit: true
            })
            that.getBase(info.code_url, 'code_url')
            setTimeout(function (){
                that.getBase(info.img_url, 'bg_url')
            },300)
        }
        if(num === '3003'){
            Toast.info('您提交的内容不符合法律法规，请修改后再提交', 1.5);
        }

    }

    //跳转看看故事
    jumpHot() {
        const {dispatch} = this.props;
        dispatch({
            type: 'upload/setData',
            payload: {
                url: ''
            }
        })
        router.push('./hot')

    }

    //输入框变化
    textChange(e) {
        const { dispatch } = this.props;
        dispatch({
            type:'upload/setData',
            payload:{
                textWord: e.target.value
            }
        })
        // console.log(e.target.value.length)
        if (e.target.value.length > 0) {
            this.setState({
                textNum: e.target.value.length,
                textValue: e.target.value
            })
        } else {
            this.setState({
                textNum: 0,
                textValue: null
            })
        }
    }

    //删除已上传信息
    deleteUrl() {
        const {dispatch} = this.props;
        dispatch({
            type: 'upload/setData',
            payload: {
                url: ''
            }
        })
    }

    // touchStart() {
    //     let that = this;
    //     const { canvasUrl } = this.props.upload
    //     this.timeOutEvent = setTimeout(function () {
    //         that.timeOutEvent = 0;
    //         console.log('长按');
    //         that.savePicture( canvasUrl )
    //     }, 400);
    // }
    //
    // touchMove(e) {
    //     clearTimeout(this.timeOutEvent);
    //     this.timeOutEvent = 0;
    //     e.preventDefault();
    // }
    //
    // touchEnd() {
    //     clearTimeout(this.timeOutEvent);
    //     if (this.timeOutEvent != 0) {
    //         console.log('点击');
    //     }
    //     return false;
    // }
    //保存图片至相册
    savePicture(Url) {
        // console.log('Url',Url)
        console.log(1111)
        if(!Url) return;
        var blob = new Blob([''], {type: 'application/octet-stream'});
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = Url;
        a.download = Url.replace(/(.*\/)*([^.]+.*)/ig, "$2").split("?")[0];
        var e = document.createEvent('MouseEvents');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
        URL.revokeObjectURL(url);
    }

    //了解QX50
    jumpMore() {
        let is_weixin = (function(){return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1})();
        if(is_weixin){
            window.location.href = "https://infiniti.hnqxs.com/qx50/index.html";
        }else{
            window.open('https://infiniti.hnqxs.com/qx50/index.html')
        }
    }
    //寄给他
    sendPeople() {
        this.setState({
            isSend: true
        })
    }
    //关闭寄给他
    closeSend() {
        this.setState({
            isSend: false
        })
    }
    //关闭分享成功
    closeMask(){
        this.setState({
            showMask: false
        })
    }
    //打开分享成功
    openMask() {
        this.setState({
            showMask: true
        })
    }
    //关闭活动规则
    closeRule() {
        this.setState({
            showRule: false
        })
    }
    //展示活动规则
    openRule() {
        this.setState({
            showRule: true
        })
    }
    //打开登录
    openLogin(){
        const { dispatch } = this.props;
        dispatch({
            type:'layout/setData',
            payload:{
                showLogin: true,
            }
        })
    }
    //添加tag
    addTag(tag){
        this.setState({
            tag: tag
        })
    }
    //返回回调
    backCallback(){
        const { dispatch } = this.props;
        dispatch({
            type:'upload/setData',
            payload:{
                url:''
            }
        })
        this.setState({
            isSubmit: false,
            img_base_url:'',
            code_base_url:'',
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
        const {bgImgTop, conTop, checked, textNum, textValue, isSubmit, isSend,
            showRule,showMask,img_base_url, code_base_url,videoUrl,tag } = this.state;
        const {url, side, codeUrl, canvasUrl ,isVideo, username} = this.props.upload;

        console.log('username',username)

        const ruleProps = {
            closeRule : this.closeRule.bind(this)
        }
        const { token } = this.props.layout;
        const cookieToken = cookieUtils.get('token') || '';
        let isLogin = token || cookieToken;
        const UploadSendProps = {
            closeSend : this.closeSend.bind(this),
            openMask:this.openMask.bind(this)
        }
        const closeMaskProps = {
            closeMask : this.closeMask.bind(this),
            keyWord:'surprise'
        }
        const canvasProps = {
            url : url,
            side : side,
            codeUrl : codeUrl,
            textWord : textValue,
            isVideo:  isVideo,
            nickName: username,
        }

        console.log('canvasProps',canvasProps)

        const backCallbackPrpos = {
            backCallback: this.backCallback.bind(this)
        }

        return (
            <DocumentTitle title='英菲尼迪『背后的力量』故事无限公司'>
                <div className={Styles.upload}>
                    {
                        isSubmit ?
                            <img style={{top: bgImgTop}} className={Styles.upload_bg}
                                 src={require('../../assets/upload_submit.jpg')}
                                 alt=""/>
                            :
                            <img style={{top: bgImgTop}} className={Styles.upload_bg}
                                 src={require('../../assets/upload_bg.jpg')}
                                 alt=""/>
                    }

                    {
                        showRule ? <Rule {...ruleProps} /> : ''
                    }

                    {
                        isSubmit ?
                            <div style={{top: conTop}}
                                 className={Styles.upload_con}
                                 // onTouchStart={this.touchStart.bind(this)}
                                 // onTouchMove={this.touchMove.bind(this)}
                                 // onTouchEnd={this.touchEnd.bind(this)}
                            >

                                {/*<div>*/}
                                    <img className={Styles.con_mask} src={canvasUrl}/>
                                {/*</div>*/}

                                <Back {...backCallbackPrpos} />
                                <Player/>
                                {
                                    showMask ? <UploadMask {...closeMaskProps} /> : ''
                                }
                                {
                                    url && codeUrl ? <Canvas {...canvasProps} /> : ''
                                }
                                <div className={Styles.con_right} onClick={this.jumpMore.bind(this)}>
                                    <img src={require('../../assets/upload_right.png')} alt=""/>
                                    了解QX50
                                </div>
                                <div className={`${Styles.con_right} ${Styles.con_right_send} `}
                                     onClick={this.sendPeople.bind(this)}>
                                    <img src={require('../../assets/upload_right.png')} alt=""/>
                                    寄 给 TA
                                </div>
                                <div className={Styles.con_bottom} onClick={this.jumpHot.bind(this)}>
                                    <WelcomeButton title='看看他们的力量'/>
                                </div>

                                {
                                    side === 0 ?
                                        <div className={`${Styles.submit} `}>
                                            <div className={Styles.submit_img}>
                                                {
                                                    tag === 'video' ?
                                                    <img className={Styles.submit_img_btn} src={require('../../assets/home_video_btn.png')} alt=""/>
                                                    :''
                                                }
                                                <img className={Styles.submit_img_bg} src={url} alt=""/>
                                            </div>
                                            <div className={Styles.submit_word}>
                                                <div className={Styles.submit_word_info}>
                                                    {textValue}
                                                </div>
                                                {
                                                    textValue && textValue.length > 45 ?
                                                        <div className={Styles.submit_word_down}>
                                                            <img src={require('../../assets/welcome_down.png')} alt=""/>
                                                        </div>
                                                        :''
                                                }
                                            </div>
                                            <div className={Styles.submit_mark}></div>
                                        </div>
                                        :
                                        <div className={`${Styles.submit_side}`}>
                                            <div className={Styles.submit_mark}></div>
                                            <div className={Styles.submit_word}>
                                                <div className={Styles.submit_word_info}>
                                                    {textValue}
                                                </div>
                                                {
                                                    textValue && textValue.length > 50 ?
                                                        <div className={Styles.submit_word_down}>
                                                            <img src={require('../../assets/welcome_down.png')} alt=""/>
                                                        </div>
                                                        :''
                                                }

                                            </div>
                                            <div className={Styles.submit_img}>
                                                {
                                                    tag === 'video' ?
                                                        <img className={Styles.submit_img_btn} src={require('../../assets/home_video_btn.png')} alt=""/>
                                                        :''
                                                }
                                                <img className={Styles.submit_img_bg} src={url} alt=""/>
                                            </div>
                                        </div>
                                }

                            </div>
                            :
                            <div style={{top: conTop}} className={Styles.upload_con}>
                                <Player/>
                                {/*<Back />*/}
                                <div className={Styles.con_text}>
                                    <TextArea className={Styles.text} value={textValue}
                                              placeholder="记录你背后的力量"
                                              onChange={(e) => {
                                                  this.textChange(e)
                                              }}/>
                                    <div className={Styles.text_num}>{textNum}/300</div>
                                </div>

                                {
                                    url ? '' :
                                        <div className={Styles.con_upload}>
                                            {
                                                isLogin ?
                                                    '':
                                                    <div className={Styles.upload_login} onClick={()=>{this.openLogin()}} ></div>
                                            }
                                            <div className={Styles.upload_img} onClick={()=>{this.addTag('img')}}>
                                                <UploadImg ref='imgCrop'/>
                                            </div>
                                            <div className={Styles.upload_video} onClick={()=>{this.addTag('video')}}>
                                                <UploadVideo/>
                                            </div>

                                        </div>
                                }
                                {
                                    url && side === 0 ?
                                        <div className={Styles.con_show_info}>
                                            <img className={Styles.con_show_info_bg}
                                                 src={require('../../assets/xiaoheng.png')} alt=""/>
                                            <img crossOrigin="anonymous" className={Styles.con_show_info_img} src={url} alt=""/>
                                            <div className={Styles.show_info_close} onClick={this.deleteUrl.bind(this)}>
                                                <img className={Styles.con_show_info}
                                                     src={require('../../assets/upload_close.png')} alt=""/>
                                            </div>
                                        </div>
                                        : ''
                                }
                                {
                                    url && side === 1 ?
                                        <div className={Styles.con_show_info_1}>
                                            <img className={Styles.con_show_info_bg}
                                                 src={require('../../assets/xiaoshu.png')} alt=""/>
                                            <img crossOrigin="anonymous" className={Styles.con_show_info_img} src={url} alt=""/>
                                            <div className={Styles.show_info_close} onClick={this.deleteUrl.bind(this)}>
                                                <img className={Styles.con_show_info}
                                                     src={require('../../assets/upload_close.png')} alt=""/>
                                            </div>
                                        </div>
                                        : ''
                                }

                                <div className={`${Styles.con_hint} ${url ? Styles.con_hint_src : ''}`}>
                                    <div>上传文字+图片/视频</div>
                                    <div>让更多人感受到</div>
                                    <div className={Styles.con_hint_blod}>背后的力量</div>
                                </div>


                                {
                                    url ?
                                        <div className={Styles.btn}>
                                            <div className={Styles.con_btn}>
                                                <div onClick={() => {
                                                    this.join()
                                                }}>
                                                    <WelcomeButton title='成为合伙人'/>
                                                </div>
                                            </div>
                                            <div className={Styles.con_rule}>
                                                <Checkbox checked={checked} onChange={(e) => {
                                                    this.CheckboxChange(e)
                                                }}>本人同意英菲尼迪此次</Checkbox><span onClick={()=>{this.openRule()}}>活动相关规则</span>
                                            </div>
                                        </div>
                                        : ''
                                }
                            </div>
                    }

                    {
                        isSend ? <UploadSend {...UploadSendProps} /> : ''
                    }

                </div>
            </DocumentTitle>
        )
    }
}

export default Upload;
