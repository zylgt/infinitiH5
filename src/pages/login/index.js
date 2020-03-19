import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal,InputItem,Button,Checkbox } from 'antd-mobile';
import router from 'umi/router';
import { createForm } from 'rc-form';
import Styles from './index.less';


const AgreeItem = Checkbox.AgreeItem;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {

    }

    render() {
        const { getFieldProps } = this.props.form;

        return (
            <div className={Styles.login}>
                <div className={Styles.login_title}>
                    天津医科大学朱宪彝纪念医院互联网医院
                </div>
                <div className={Styles.login_phone}>
                    <InputItem
                        {...getFieldProps('phone', {
                            normalize: (v, prev) => {
                                if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                                    if (v === '.') {
                                        return '0.';
                                    }
                                    return prev;
                                }
                                return v;
                            },
                        })}
                        type='phone'
                        placeholder="请输入您的手机号码"
                        ref={el => this.inputRef = el}
                        onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                        clear
                        // moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                    />
                </div>
                <div className={Styles.login_code}>
                    <div className={Styles.code_input}>
                        <InputItem
                            {...getFieldProps('imgCode', {
                                normalize: (v, prev) => {
                                    if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                                        if (v === '.') {
                                            return '0.';
                                        }
                                        return prev;
                                    }
                                    return v;
                                },
                            })}
                            type='number'
                            placeholder="图形验证码"
                            ref={el => this.inputRef = el}
                            onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                            clear
                            // moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                            disabledKeys={['.']}
                        />
                    </div>
                    <img  className={Styles.code_img} src="" alt=""/>
                </div>
                <div className={Styles.login_code}>
                    <div className={Styles.code_input}>
                        <InputItem
                            {...getFieldProps('code', {
                                normalize: (v, prev) => {
                                    if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                                        if (v === '.') {
                                            return '0.';
                                        }
                                        return prev;
                                    }
                                    return v;
                                },
                            })}
                            type='number'
                            placeholder="验证码"
                            ref={el => this.inputRef = el}
                            onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
                            clear
                            // moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                            disabledKeys={['.']}
                        />
                    </div>
                    <Button className={Styles.get_code}>获取验证码</Button>
                </div>
                <div className={Styles.login_agreement}>
                    <AgreeItem data-seed="logId" onChange={e => console.log('checkbox', e)}>
                        我已经阅读并同意
                    </AgreeItem>
                    <span onClick={(e) => { router.push('./agreement') }}>《服务协议》</span>
                </div>
                <Button className={Styles.login_btn} >登录</Button>
            </div>
        )
    }
}
export default createForm()(Login);
