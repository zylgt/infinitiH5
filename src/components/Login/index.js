import React, { Component } from 'react';
import Styles from './index.less';
import { Input, InputNumber } from 'antd';
import WelcomeButton from '../WelcomeButton'
import {connect} from 'dva';
import { InputItem } from 'antd-mobile';

@connect(({ layout }) => ({ layout }))
class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phone : 0,
            code: 0,
            codeTitle : '获取验证码',
            phoneError: false,
            codeError: false,

        }
        this.codeTime = null
    }
    componentDidMount() {
        clearInterval( this.codeTime )
        this.codeTime = null
    }
    //关闭登陆页面
    closeLogin(){
        const { dispatch } = this.props;
        dispatch({
            type:'layout/setData',
            payload:{
                showLogin: false
            }
        })
        dispatch({
            type:'home/setData',
            payload:{
                isShowVideo: true
            }
        })
    }
    //记录手机号码
    setPhone(e, key){
        console.log(e)
        if(key === 'phone'){
            this.setState({
                phone : e.target.value
            })
        }else{
            this.setState({
                code : e
            })
        }

    }
    phoneFocus(key){
        if(key === 'phone'){
            this.setState({
                phoneError: false
            })
        }else{
            this.setState({
                codeError: false
            })
        }

    }
    //获取验证码
    getCode(){
        if(this.codeTime){
            return
        }
        let that = this;
        let i = 60;
        const { phone } = that.state;
        const { dispatch } = that.props;
        console.log('phone',phone)
        //校验手机号
        if(!(/^[1]([3-9])[0-9]{9}$/.test(phone))){
            console.log(3333)
            that.setState({
                phoneError: true
            })
            return false;
        }

        that.setState({
            codeTitle: i + '秒'
        })
        that.codeTime = setInterval(function (){
            i--;
            // console.log(i)
            that.setState({
                codeTitle: i + '秒'
            })
            if(i === 0){
                that.setState({
                    codeTitle: '获取验证码'
                })
                clearInterval( that.codeTime )
                that.codeTime = null
            }
        },1000)
        // 调接口
        dispatch({
            type:'layout/getCode',
            payload:{
                phone: phone,
                sc:"1w3edd4590p2ccf"
            }
        })
    }
    //点击登陆
    login(){
        const { dispatch } = this.props;
        const { phone, code } = this.state;
        dispatch({
            type:'layout/login',
            payload:{
                phone: phone,
                code: code
            },
            callback: this.loginCallback.bind(this)
        })
    }
    //登录回调
    loginCallback(){
        this.setState({
            codeError: true
        })
    }


    render() {
        const { codeTitle, phoneError, codeError } = this.state;
        return (
            <div className={Styles.login}>
                <div className={Styles.login_con}>
                    <img className={Styles.login_close} src={require('../../assets/welcome_closeicon.png')}
                         alt="" onClick={() => {
                        this.closeLogin()
                    }}/>
                    <div className={Styles.con_title}>手机号登陆注册</div>
                    <div className={Styles.con_phone}>
                        <Input type="number" addonBefore="+86" placeholder='请输入手机号码' maxLength={11} onFocus={()=>{this.phoneFocus('phone')}} onChange={(e)=>{this.setPhone(e,'phone')}} />
                        {
                            phoneError ? <span className={Styles.con_phone_error} >请输入正确的手机号码</span> :''
                        }
                    </div>
                    <div className={Styles.con_code} >

                        <InputItem type="number" className={Styles.con_code_input} maxLength={4} placeholder='请输入验证码' onFocus={()=>{this.phoneFocus('code')}} onChange={(e)=>{this.setPhone(e,'code')}}/>
                        {/*<Input type="number" className={Styles.con_code_input} maxLength={4} placeholder='请输入验证码' onFocus={()=>{this.phoneFocus('code')}} onChange={(e)=>{this.setPhone(e,'code')}}/>*/}
                        <div className={Styles.con_code_btn}  onClick={this.getCode.bind(this)}>{ codeTitle }</div>
                        {
                            codeError ? <span className={Styles.con_code_error} >请输入正确的验证码</span> : ''
                        }
                    </div>
                    <div className={Styles.con_btn} onClick={()=>{this.login()}}>
                        <WelcomeButton title='验证登录'/>
                    </div>
                    <div className={Styles.con_hint}>
                        <span>未注册本网站或者未绑定的手机号，将帮您注册新账号。</span>
                        <span>参与活动即可获取丰厚礼品哦！</span>
                    </div>
                </div>
                <div className={Styles.login_bottom}>
                    <img className={Styles.login_bottom_bg} src={require('../../assets/welcome_bottom_page.png')}
                         alt=""/>
                </div>
            </div>
        )
    }
}


export default Login;
