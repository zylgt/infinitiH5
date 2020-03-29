import React, { Component } from 'react'
import { connect } from 'dva';
import { InputItem,Button,Checkbox } from 'antd-mobile';
import router from 'umi/router';
import { createForm } from 'rc-form';
import Styles from './index.less';
import DocumentTitle from 'react-document-title'
import 'babel-polyfill'
import { baseURL, pageURL } from '../../utils/baseURL'
import wx from 'weixin-js-sdk';
import { nonceStr } from '../../utils/tools'

const AgreeItem = Checkbox.AgreeItem;

@connect(({ login,empty }) => ({ login,empty }))
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '', // 电话
            phoneError: false, // 电话是否格式错误
            phoneCode: '', // 短信验证码
            codeText: '获取验证码',
            isWait: false, // 是否在倒计时
            checkedItem:true,
            timestamp:''
        }
    }
    componentWillMount() {
        // 获取图形验证码
        this.refreshCodeImage();

    }
    componentDidMount() {
        const { dispatch } = this.props;
        //生成签名时间戳
        let timestamp = (Date.parse(new Date()) / 1000).toString();
        this.setState({
            timestamp:timestamp,
        })
        //获取appid和签名
        // dispatch({
        //     type:'patientDescribe/getAppid',
        //     payload:{
        //         noncestr: nonceStr,
        //         timestamp: timestamp,
        //         url: pageURL + '/login'
        //     },
        //     callback: this.getAppidCallback.bind(this)
        // })
    }
    //获取appidcallback
    getAppidCallback(response){
        const { timestamp } = this.state;
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.data.data.app_id, // 必填，公众号的唯一标识
            timestamp: timestamp , // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: response.data.data.signature,// 必填，签名
            jsApiList: ['chooseImage','uploadImage','hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表
        });
        wx.ready(function(){
            wx.hideAllNonBaseMenuItem();
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
    }
    //获取图形验证码
    refreshCodeImage(){
        const { login,dispatch } = this.props;
        dispatch({
            type: 'login/getImgCode',
            payload: {}
        });
    }
    //校验参数
    inputFocus(type){
        const { dispatch } = this.props;
        if(type == 'phone'){
            this.setState({
                phoneError: false
            })
        }
        if(type == 'imgCode'){
            dispatch({
                type: 'login/setData',
                payload: {
                    imgCodeError:false
                }
            });
        }
        if(type == 'phoneCode'){
            dispatch({
                type: 'login/setData',
                payload: {
                    phoneCodeError:false
                }
            });
        }
    }
    // 手机号码录入
    inputPhone(val){
        const phone = parseInt(val.replace(/\s*/g,""));
        this.setState({
            phone: phone
        })
    }
    //短信验证码录入
    inputPhoneCode(val){
        this.setState({
            phoneCode: val
        })
    }
    //校验手机号码
    verifyPhone(val){
        const phoneReg = /^1[3456789]\d{9}$/;
        if( !phoneReg.test(val) ) {
            this.setState({
                phoneError: true
            })
            return true
        }else{
            this.setState({
                phoneError: false
            })
            return false
        }
    }
    // 图片验证码校验
    verifyImgCode(val){
        const { dispatch, login } = this.props;

        if( val != '' && val.length == 6 ){
            dispatch({
                type: 'login/setData',
                payload: {
                    imgCode:val
                }
            });
            dispatch({
                type: 'login/verifyImgCode',
                payload: {
                    captcha_id: login.imgCodeId,
                    graph_code: val
                }
            });
        }else if( val != '' && val.length < 6 ){
            dispatch({
                type: 'login/setData',
                payload: {
                    imgCode:val
                }
            });
            dispatch({
                type: 'login/setData',
                payload: {
                    imgCodeError:true
                }
            });
        }
    }
    //获取短信验证码
    getCode() {
        const { phone, phoneError } = this.state;
        const { imgCode } = this.props.login;
        const { dispatch, login } = this.props;
        if (this.state.isWait) {
            return false
        }
        console.log(this.verifyPhone(phone))
        if( phone.toString().length < 11 || this.verifyPhone(phone) ){
            // Toast.fail('手机号码格式错误', 1.5);
            this.setState({
                phoneError:true
            });
            return false
        }

        if( imgCode.toString().length < 6 || login.imgCodeError){
            // Toast.fail('图形验证码错误', 1.5);
            dispatch({
                type: 'login/setData',
                payload: {
                    imgCodeError:true
                }
            });
            return false
        }
        dispatch({
            type: 'login/getPhoneCode',
            payload: {
                phone:phone
            }
        });
        this.setTime()
    }
    //倒计时
    setTime() {
        this.setState({ isWait: true });
        let countdown = 30;
        this.setState({ codeText: '重新获取'+ countdown + 's' });
        this.timer = setInterval(() => {
            if (countdown === 1) {
                this.setState({
                    codeText: '重新获取',
                    isWait: false
                });
                clearInterval(this.timer);
            } else {
                countdown--;
                this.setState({ codeText: '重新获取'+ countdown + 's' });
            }
        }, 1000)
    }
    //服务协议
    checkService(e){
        const checked =  e.target.checked
        this.setState({
            checkedItem: checked
        })
    }
    //登录
    submit(){
        const { dispatch } = this.props;
        const {phone, phoneCode } = this.state;
        const { unionid } = this.props.empty;
        dispatch({
            type: 'login/sublit',
            payload: {
                unionid: unionid,
                phone: phone.toString(),
                verifi_code: phoneCode
            }
        });
    }

    render() {
        const { getFieldProps } = this.props.form;
        const {
            phone,
            phoneError,
            phoneCode,
            checkedItem,
            isWait,
            codeText
        } = this.state;
        const {
            imgCodeError,
            imgCodeId,
            imgCode,
            phoneCodeError,
        } = this.props.login;
        return (
            <DocumentTitle title='登录'>
                <div className={Styles.login}>
                    <div className={Styles.login_title}>
                        天津医科大学朱宪彝纪念医院互联网医院
                    </div>
                    <div className={Styles.login_phone}>
                        <InputItem
                            type='phone'
                            placeholder="请输入您的手机号码"
                            ref={el => this.phoneItem = el}
                            onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                            clear
                            onFocus={()=>{this.inputFocus('phone')}}
                            onChange={(val)=>{this.inputPhone(val)}}
                        />
                    </div>
                    {
                        phoneError ? <div className={Styles.login_error}>请输入正确的手机号码</div> : ''
                    }
                    <div className={Styles.login_code}>
                        <div className={Styles.code_input}>
                            <InputItem
                                type='number'
                                maxLength={6}
                                value={imgCode}
                                placeholder="图形验证码"
                                ref={el => this.imgCodeItem = el}
                                onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                                clear
                                onFocus={()=>{this.inputFocus('imgCode')}}
                                onChange={(val)=>{this.verifyImgCode(val)}}
                            />
                        </div>
                        {
                            imgCodeId ? <img
                                onClick={()=>{this.refreshCodeImage()}}
                                className={Styles.code_img}
                                src={baseURL + '/m/common/captcha/'+ imgCodeId +'.png' }
                                alt=""/> : ''
                        }
                    </div>
                    {
                        imgCodeError ? <div className={Styles.login_error}>图形验证码输入有误</div> : ''
                    }
                    <div className={Styles.login_code}>
                        <div className={Styles.code_input}>
                            <InputItem
                                type='number'
                                placeholder="验证码"
                                ref={el => this.inputCode = el}
                                onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                                clear
                                maxLength={4}
                                onFocus={()=>{this.inputFocus('phoneCode')}}
                                onChange={(val)=>{this.inputPhoneCode(val)}}
                            />
                        </div>
                        {
                            isWait ?
                                <Button className={Styles.get_code_wait}>{codeText}</Button>
                                :
                                <Button className={Styles.get_code} onClick={()=>{this.getCode()}} >{codeText}</Button>
                        }
                    </div>
                    {
                        phoneCodeError ? <div className={Styles.login_error}>短信验证码输入有误</div> : ''
                    }
                    <div className={Styles.login_agreement}>
                        <AgreeItem data-seed="logId" checked={checkedItem} onChange={(e)=>{this.checkService(e)}}>
                            我已经阅读并同意
                        </AgreeItem>
                        <span onClick={(e) => { router.push('./agreement') }}>《服务协议》</span>
                    </div>
                    {
                        phone.toString().length == 11 && !phoneError
                        && imgCode.toString().length == 6 && !imgCodeError
                        && phoneCode.toString().length == 4 && !phoneCodeError
                        && checkedItem ?
                            <Button className={Styles.login_btn} onClick={()=>{this.submit()}} >登录</Button>
                            :
                            <Button className={Styles.login_btn_disabled} >登录</Button>
                    }
                </div>
            </DocumentTitle>
        )
    }
}
export default createForm()(Login);
