import React, { Component } from 'react';
import Styles from './index.less';
import router from 'umi/router';
import {Input} from "antd";
import WelcomeButton from "../WelcomeButton";
import {cookieUtils} from "../../utils/tools";
import { Toast } from 'antd-mobile';
import {connect} from 'dva';
import moment from 'moment';
import { Modal } from 'antd-mobile';

@connect(({ my, layout }) => ({ my, layout }))
class MyWin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            winName:'',
            winPhone:'',
            winAddress:'',
            winNameError:false,
            winPhoneError:false,
            winAddressError:false,
        }
    }
    componentDidMount() {

    }
    //清除error
    winFocus(key){
        if(key === 'name'){
            this.setState({
                winNameError:false,
            })
        }
        if(key === 'address'){
            this.setState({
                winAddressError:false,
            })
        }
    }
    // 输入
    winChange(e,key){
        let value = e.target.value;
        if(key === 'name'){
            this.setState({
                winName: value
            })
        }
        if(key === 'address'){
            this.setState({
                winAddress:value
            })
        }
    }
    //提交信息
    winSurprise() {
        const { winName, winAddress } = this.state;
        const { dispatch } = this.props;
        const { token } = this.props.layout;
        console.log('token',token)
        const cookieToken = cookieUtils.get('token') || '';
        let isLogin = token || cookieToken;
        const { user, rewards } = this.props;
        if( winName === '' || winName === undefined ){
            this.setState({
                winNameError: true
            })
            return false;
        }
        if( winAddress=== ''|| winAddress === undefined ){
            this.setState({
                winAddressError: true
            })
            return false;
        }
        Toast.loading('正在提交', 60);
        for(let i=0;i<rewards.length;i++){
            let payload = {
                token:isLogin,
                type: rewards[i].type +'',
                foreign_id: rewards[i].foreign_id+'',
                name:winName,
                phone:user.phone,
                address:winAddress
            }
            // 提交
            dispatch({
                type: 'my/addWin',
                payload: payload,
                callback: this.winSuccess.bind(this)
            })
        }

    }
    //win提交成功回调
    winSuccess(){
        this.props.closeWin()
        this.props.openMask()
    }

    //关闭
    closeWin() {
        this.props.closeWin()
    }

    render() {
        const { winNameError, winAddressError} = this.state;
        const  {
            addressInfo,
            user,
            rewards,
        } = this.props
        console.log('addressInfo',addressInfo)
        console.log('user',user)
        console.log('rewards',rewards)

        return (
            <div className={Styles.my_win}>
                <Modal
                    visible={true}
                    transparent
                    maskClosable={false}
                >
                    <div className={Styles.win_con}>
                        <div className={Styles.win_con_scroll} >
                            <img className={Styles.login_close}
                                 src={require('../../assets/welcome_closeicon.png')}
                                 alt="" onClick={() => {
                                this.closeWin()
                            }}/>
                            <div className={`${Styles.con_title_sec} ${Styles.con_title}`}>中奖纪录：</div>
                            {
                                rewards.length > 0 && rewards.map((item,index)=>{
                                    return(
                                        <div key={index}>
                                            {
                                                item.reward_type === '锦鲤幸运奖' ?
                                                    <div>
                                                        {/*<div className={Styles.con_title_sec}>·恭喜您在{moment(item.reward_time).format('YYYY年MM月DD日')}获得锦鲤幸运奖！</div>*/}
                                                        <div className={Styles.con_title_sec}>·恭喜您，运气爆棚，获得故事无限公司的锦鲤幸运奖。奖品为：{item.reward_name}</div>
                                                    </div> :''
                                            }
                                            {
                                                item.reward_type === '1' ?
                                                    <div>
                                                        {/*<div className={Styles.con_title_sec}>·恭喜您在{moment(item.reward_time).format('YYYY年MM月DD日')}获得锦鲤幸运奖！</div>*/}
                                                        <div className={Styles.con_title_sec}>·恭喜您，因您的故事受到了大家的疯狂pick，获得故事无限公司的合伙人大奖。奖品为：{item.reward_name}</div>
                                                    </div> :''
                                            }
                                            {
                                                item.reward_type === '2' ?
                                                    <div>
                                                        {/*<div className={Styles.con_title_sec}>·恭喜您在{moment(item.reward_time).format('YYYY年MM月DD日')}获得锦鲤幸运奖！</div>*/}
                                                        <div className={Styles.con_title_sec}>·恭喜您，因您的故事受到了导演青睐，获得故事无限公司的导演甄选奖。奖品为：{item.reward_name}</div>
                                                    </div> :''
                                            }
                                            {
                                                item.reward_type === '3' ?
                                                    <div>
                                                        {/*<div className={Styles.con_title_sec}>·恭喜您在{moment(item.reward_time).format('YYYY年MM月DD日')}获得锦鲤幸运奖！</div>*/}
                                                        <div className={Styles.con_title_sec}>·恭喜您，运气爆棚，获得故事无限公司的合伙人幸运奖。奖品为{item.reward_name}</div>
                                                    </div> :''
                                            }

                                        </div>
                                    )
                                })
                            }

                            <div className={`${Styles.con_title_sec} ${Styles.con_title_tre}`}>请您填写下方信息：</div>
                            <div className={Styles.con_title_sec}>收件人姓名：</div>
                            <div className={Styles.con_from_box}>
                                {
                                    addressInfo.name ?
                                        <Input className={Styles.con_input} disabled value={addressInfo.name} placeholder='请输入收件人姓名' maxLength={12} onFocus={()=>{this.winFocus('name')}} onChange={(e)=>{this.winChange(e,'name')}}/>
                                        :
                                        <Input className={Styles.con_input} placeholder='请输入收件人姓名' maxLength={12} onFocus={()=>{this.winFocus('name')}} onChange={(e)=>{this.winChange(e,'name')}}/>
                                }

                                {
                                    winNameError ? <div className={Styles.con_input_error}>请输入姓名</div>:''
                                }
                            </div>
                            <div className={Styles.con_title_sec}>收件人联系电话：</div>
                            <div className={Styles.con_from_box}>
                                <Input disabled className={Styles.con_input} value={user.phone} placeholder='请输入收件人手机号码' onFocus={()=>{this.winFocus('phone')}} onChange={(e)=>{this.winChange(e,'phone')}}/>
                            </div>
                            <div className={Styles.con_title_sec}>收件人邮寄地址：</div>
                            <div className={Styles.con_from_box}>
                                {
                                    addressInfo.address ?
                                        <Input className={Styles.con_input} disabled value={addressInfo.address} placeholder='请输入收件人邮寄地址' onFocus={()=>{this.winFocus('address')}} onChange={(e)=>{this.winChange(e,'address')}}/>
                                        :
                                        <Input className={Styles.con_input} placeholder='请输入收件人邮寄地址' onFocus={()=>{this.winFocus('address')}} onChange={(e)=>{this.winChange(e,'address')}}/>

                                }
                                {
                                    winAddressError ? <div className={Styles.con_input_error}> 请输入收件人邮寄地址</div>:''
                                }
                            </div>
                            {
                                addressInfo.name ?
                                    <div className={Styles.con_btn}>
                                        <div className={Styles.win_input_btn}>
                                            <img src={require('../../assets/welcome_button_null.png')} alt=""/>
                                            <span>提交获奖信息</span>
                                        </div>
                                    </div>
                                    :
                                    <div className={Styles.con_btn} onClick={() => {
                                        this.winSurprise()
                                    }}>
                                        <WelcomeButton title='提交获奖信息'/>
                                    </div>
                            }
                        </div>
                    </div>
                    <div className={Styles.win_bottom}>
                        <img className={Styles.win_bottom_bg}
                             src={require('../../assets/welcome_bottom_page.png')}
                             alt=""/>
                    </div>
                </Modal>

            </div>
        )
    }
}


export default MyWin;
