import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal,InputItem,Button,Checkbox,Toast } from 'antd-mobile';
import router from 'umi/router';
import { createForm } from 'rc-form';
import Styles from './index.less';
import DocumentTitle from 'react-document-title'

const AgreeItem = Checkbox.AgreeItem;

@connect(({ login }) => ({ login }))
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '', // 电话
            phoneError: false, // 电话是否格式错误

            imgCode: '', // 图形验证码

            phoneCode: '', // 短信验证码
            phoneCodeError:false, // 短信验证码是否错误
            codeText: '获取验证码',
            isWait: false, // 是否在倒计时
            codeImageUrl: '', // 验证码图片

            checkedItem:true
        }
    }
    componentWillMount() {
        // 获取图形验证码
        this.refreshCodeImage();

    }
    componentDidMount() {

    }
    //获取图形验证码
    refreshCodeImage(){
        const { login,dispatch } = this.props;
        dispatch({
            type: 'login/getImgCode',
            payload: {}
        });
    }
    //获取短信验证码
    getCode() {
        const { phone, phoneError, imgCode } = this.state;
        const { dispatch, login } = this.props;
        if (this.state.isWait) {
            return false
        }
        if( phone.length < 11 || phoneError){
            // Toast.fail('手机号码格式错误', 1.5);
            this.setState({
                phoneError:true
            });
            return false
        }
        console.log('login.imgCodeError',login.imgCodeError)

        if( imgCode != '' && !login.imgCodeError){
            // Toast.fail('图形验证码错误', 1.5);
            dispatch({
                type: 'login/setData',
                payload: {
                    imgCodeError:true
                }
            });
            return false
        }
        // dispatch({
        //     type: 'login/getPhoneCode',
        //     payload: {
        //         phone:phone
        //     }
        // });
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
    //校验参数
    inputFocus(type){
        console.log('inputFocus')
        if(type == 'phone'){
            this.setState({
                phoneError: false
            })
        }
        if(type == 'imgCode'){
            this.setState({
                imgCodeError: false
            })
        }
        if(type == 'phoneCode'){
            this.setState({
                phoneCodeError: false
            })
        }
    }
    inputBlue(val,type){
        const { dispatch, login } = this.props;
        //手机号码
        if(type == 'phone' ){
            const phoneReg = /^1[3456789]\d{9}$/;
            const phone = parseInt(val.replace(/\s*/g,""));
            this.setState({
                phone: phone
            })
            if( !phoneReg.test(phone) ) {
                this.setState({
                    phoneError: true
                })
            }
        }
        // 验证码校验
        if(type == 'imgCode'){
            this.setState({
                imgCode: val
            })
            if( val != '' ){
                dispatch({
                    type: 'login/verifyImgCode',
                    payload: {
                        captcha_id: login.imgCodeId,
                        graph_code: val
                    }
                });
            }
        }


    }
    //服务协议
    checkService(e){
        const checked =  e.target.checked
        this.setState({
            checkedItem: checked
        })
    }



    render() {
        const { getFieldProps } = this.props.form;
        const {
            phone,
            phoneError,
            phoneCodeError,
            imgCode,
            checkedItem,
            isWait,
            codeText
        } = this.state;
        const { 
            imgCodeError,
            imgCodeId,
            text
        } = this.props.login;

        console.log('imgCodeId',imgCodeId)

        return (
            <DocumentTitle title='登录'>
                <div className={Styles.login}>
                    <div className={Styles.login_title}>
                        天津医科大学朱宪彝纪念医院互联网医院
                    </div>
                    <div className={Styles.login_phone}>
                        <InputItem
                            {...getFieldProps('phone',{
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })}
                            type='phone'
                            placeholder="请输入您的手机号码"
                            ref={el => this.inputPhone = el}
                            onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                            clear
                            onBlur={(val)=>{this.inputBlue(val,'phone')}}
                            onFocus={()=>{this.inputFocus('phone')}}
                        />
                    </div>
                    {
                        phoneError ? <div className={Styles.login_error}>请输入正确的手机号码</div> : ''
                    }
                    <div className={Styles.login_code}>
                        <div className={Styles.code_input}>
                            <InputItem
                                {...getFieldProps('imgCode')}
                                type='number'
                                placeholder="图形验证码"
                                ref={el => this.inputImgCode = el}
                                onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                                clear
                                onBlur={(val)=>{this.inputBlue(val,'imgCode')}}
                                onFocus={()=>{this.inputFocus('imgCode')}}
                            />
                        </div>
                        {/*{text}*/}
                        {/*{imgCodeId}*/}
                        {
                            imgCodeId ? <img
                                onClick={()=>{this.refreshCodeImage()}}
                                className={Styles.code_img}
                                src={'https://api.nethospital.yutanglabs.com/m/common/captcha/'+ imgCodeId +'.png' }
                                alt=""/> : ''
                        }
                    </div>
                    {
                        imgCodeError ? <div className={Styles.login_error}>图形验证码输入有误</div> : ''
                    }
                    <div className={Styles.login_code}>
                        <div className={Styles.code_input}>
                            <InputItem
                                {...getFieldProps('phoneCode')}
                                type='number'
                                placeholder="验证码"
                                ref={el => this.inputCode = el}
                                onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                                clear
                                // moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                                disabledKeys={['.']}
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
                        phoneError && imgCodeError && phoneCodeError && checkedItem ?
                            <Button className={Styles.login_btn} >登录</Button>
                            :
                            <Button className={Styles.login_btn_disabled} >登录</Button>
                    }
                </div>
            </DocumentTitle>
        )
    }
}
export default createForm()(Login);
