import React, { Component } from 'react';
import Styles from './index.less';
import router from 'umi/router';
import {Input} from "antd";
import WelcomeButton from "../WelcomeButton";
import {cookieUtils} from "../../utils/tools";
import { Toast } from 'antd-mobile';
import {connect} from 'dva';
import { Modal } from 'antd-mobile';

@connect(({ upload, layout }) => ({ upload, layout }))
class UploadSend extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sendName:'',
            sendPhone:'',
            sendAddress:'',
            sendNickname:'',
            sendNameError:false,
            sendPhoneError:false,
            sendAddressError:false,
            sendNicknameError:false,
        }
    }
    componentDidMount() {

    }
    sendFocus(key){
        if(key === 'name'){
            this.setState({
                sendNameError:false,
            })
        }
        if(key === 'phone'){
            this.setState({
                sendPhoneError:false,
            })
        }
        if(key === 'address'){
            this.setState({
                sendAddressError:false,
            })
        }
        if(key === 'nickName'){
            this.setState({
                sendNicknameError:false,
            })
        }
    }
    sendChange(e,key){
        let value = e.target.value;
        if(key === 'name'){
            this.setState({
                sendName: value
            })
        }
        if(key === 'phone'){
            this.setState({
                sendPhone:value
            })
        }
        if(key === 'address'){
            this.setState({
                sendAddress:value
            })
        }
        if(key === 'nickName'){
            this.setState({
                sendNickname:value
            })
        }

    }
    //给他惊喜
    sendSurprise() {
        const { sendName, sendPhone, sendAddress, sendNickname } = this.state;
        const { dispatch } = this.props;
        const { token } = this.props.layout;
        const { uploadId } = this.props.upload;
        const cookieToken = cookieUtils.get('token') || '';
        let isLogin = token || cookieToken;
        if( sendName === '' || sendName === undefined ){
            this.setState({
                sendNameError: true
            })
            return false;
        }
        if(!(/^[1]([3-9])[0-9]{9}$/.test(sendPhone))){
            this.setState({
                sendPhoneError: true
            })
            return false;
        }
        if( sendAddress=== ''){
            this.setState({
                sendAddressError: true
            })
            return false;
        }
        if( sendNickname === ''){
            this.setState({
                sendNicknameError: true
            })
            return false;
        }
        //    发送接口  submitSend
        Toast.loading('正在提交', 60);
        //提交
        dispatch({
            type: 'upload/submitSend',
            payload: {
                token: isLogin,
                poster_id : uploadId ,
                name: sendName,
                phone: sendPhone,
                address: sendAddress,
                sender_name: sendNickname,
            },
            callback: this.sendSuccess.bind(this)
        })
    }
    //send提交成功回调
    sendSuccess(){
        this.props.closeSend()
        this.props.openMask()
    }

    //关闭寄给他
    closeSend() {
        this.props.closeSend()
    }

    render() {
        const { sendNameError, sendPhoneError, sendAddressError, sendNicknameError} = this.state;
        const {url, side} = this.props.upload;

        return (
            <div className={Styles.upload_send}>
                <Modal
                    visible={true}
                    transparent
                    maskClosable={false}
                >
                    <div className={Styles.upload_send_con}>
                        <div className={Styles.send_con}>
                            <img className={Styles.login_close}
                                 src={require('../../assets/welcome_closeicon.png')}
                                 alt="" onClick={() => {
                                this.closeSend()
                            }}/>
                            <div className={Styles.con_title}>
                                <span>如果你希望TA能看到</span>
                                <span>留下TA的通讯方式吧</span>
                                <span>我们将为你</span>
                                <span>寄出这份情感</span>
                            </div>
                            <div className={Styles.con_img}>
                                <img className={Styles.con_img_send} src={require('../../assets/upload_send.png')} alt=""/>
                                {/*<img className={Styles.con_img_left}*/}
                                {/*     src={require('../../assets/home_prize.jpg')} alt=""/>*/}
                                {/*<div className={Styles.con_img_right}>*/}
                                {/*    <img className={Styles.img_right_bg}*/}
                                {/*         src={require('../../assets/home_prize.jpg')} alt=""/>*/}
                                {/*    {*/}
                                {/*        side === 0 ?*/}
                                {/*            <img className={Styles.img_right} src={url} alt=""/>*/}
                                {/*            :*/}
                                {/*            <img className={Styles.img_right_side} src={url} alt=""/>*/}
                                {/*    }*/}
                                {/*</div>*/}
                            </div>
                            <div className={Styles.con_title_sec}>请您填写下方信息：</div>
                            <div className={Styles.con_title_sec}>收件人姓名：</div>
                            <div className={Styles.con_from_box}>
                                <Input className={Styles.con_input} placeholder='请输入收件人姓名' onFocus={()=>{this.sendFocus('name')}} onChange={(e)=>{this.sendChange(e,'name')}}/>
                                {
                                    sendNameError ? <div className={Styles.con_input_error}>请输入姓名</div>:''
                                }
                            </div>
                            <div className={Styles.con_title_sec}>收件人联系电话：</div>
                            <div className={Styles.con_from_box}>
                                <Input className={Styles.con_input} type='number' placeholder='请输入收件人手机号码' onFocus={()=>{this.sendFocus('phone')}} onChange={(e)=>{this.sendChange(e,'phone')}}/>
                                {
                                    sendPhoneError ? <div className={Styles.con_input_error}> 请输入正确的手机号码</div>:''
                                }
                            </div>
                            <div className={Styles.con_title_sec}>收件人邮寄地址：</div>
                            <div className={Styles.con_from_box}>
                                <Input className={Styles.con_input} placeholder='请输入收件人邮寄地址' onFocus={()=>{this.sendFocus('address')}} onChange={(e)=>{this.sendChange(e,'address')}}/>
                                {
                                    sendAddressError ? <div className={Styles.con_input_error}> 请输入收件人邮寄地址</div>:''
                                }
                            </div>
                            <div className={Styles.con_title_sec}>寄件人昵称：</div>
                            <div className={Styles.con_from_box}>
                                <Input className={Styles.con_input} placeholder='请输入您的昵称' onFocus={()=>{this.sendFocus('nickName')}} onChange={(e)=>{this.sendChange(e,'nickName')}}/>
                                {
                                    sendNicknameError ?<div className={Styles.con_input_error}>请输入您的昵称</div>:''
                                }
                            </div>

                            <div className={Styles.con_btn} onClick={() => {
                                this.sendSurprise()
                            }}>
                                <WelcomeButton title='给TA惊喜'/>
                            </div>
                        </div>
                        <div className={Styles.send_bottom}>
                            <img className={Styles.send_bottom_bg}
                                 src={require('../../assets/welcome_bottom_page.png')}
                                 alt=""/>
                        </div>
                    </div>
                </Modal>

            </div>
        )
    }
}


export default UploadSend;
