import React, { Component } from 'react'
import { connect } from 'dva';
import { InputItem,Button,Toast } from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import { createForm } from 'rc-form';
import { getQueryString,nonceStr,isIOS } from '../../utils/tools'
import DocumentTitle from 'react-document-title'
import wx from 'weixin-js-sdk';
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入

import moment from "moment";
moment.locale('zh-cn');

@connect(({ management }) => ({ management }))
class Management extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timestamp:'',
            nameError:false,
            idNumError:false,
            type:'',
            submitButton:'',
            doctor_id:'',
            idSet:false,
            isSetInput:false,
            source:''
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        let type = getQueryString('type') || '';
        let id = getQueryString('id') || '';
        let source = getQueryString('source') || '';
        // console.log('type',type)
        this.setState({
            type: type,
            source:source
        })
        if(type == 'add'){
            this.setState({
                submitButton: '保存',
                doctor_id:id,
            })
        }else{
            this.setState({
                submitButton: '下一步',
                doctor_id:id,
                idSet:true
            })
        }
        //生成签名时间戳
        let timestamp = (Date.parse(new Date()) / 1000).toString();
        this.setState({
            timestamp:timestamp,
        })

        if(isIOS()){
            wx.ready(function(){
                wx.hideAllNonBaseMenuItem();
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            });
        }else{
            //获取appid和签名
            dispatch({
                type:'patientDescribe/getAppid',
                payload:{
                    noncestr: nonceStr,
                    timestamp: timestamp,
                    url: window.location.href.split('#')[0]
                },
                callback: this.getAppidCallback.bind(this)
            })
        }
    }
    componentWillUnmount(){
        //顶部进度条开启
        NProgress.start()
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
    //focus事件
    inputFocus(type){
        if(type == 'name'){
            this.setState({
                nameError: false
            })
        }
        if(type == 'card_id'){
            this.setState({
                idNumError: false
            })
        }
    }
    //输入姓名
    inputName(val){
        const { dispatch } = this.props;
        const { old_name } = this.props.management;
        if(val != old_name){
            this.setState({
                type:'add',
                submitButton: '保存',
                isSetInput:true,
                idSet:false
            })
        }else{
            this.setState({
                type:'set',
                submitButton: '下一步',
                isSetInput:false,
                idSet:true
            })
        }
        dispatch({
            type:'management/setData',
            payload:{
                name:val
            }
        })
    }
    //输入身份证号码
    inputIdNum(val){
        const { dispatch } = this.props;
        const { old_card_id } = this.props.management;
        if(val != old_card_id){
            this.setState({
                type:'add',
                submitButton: '保存',
                isSetInput:true,
                idSet:false
            })
        }else{
            this.setState({
                type:'set',
                submitButton: '下一步',
                isSetInput:false,
                idSet:true
            })
        }
        dispatch({
            type:'management/setData',
            payload:{
                card_id: val
            }
        })
    }
    // 保存
    submit(){
        const { name,card_id } = this.props.management;
        const { dispatch } = this.props;
        const { type } = this.state;
        const cardReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        //判断是否是大于2个的汉字
        const wordReg = /^[\u4E00-\u9FA5]+$/;
        if(!wordReg.test(name)){
            Toast.info('请输入汉字名字',1.5)
            this.setState({
                nameError: true
            })
            return
        }
        if(name.length < 2){
            Toast.info('名字不可少于2个字',1.5)
            this.setState({
                nameError: true
            })
            return
        }
        //判断是否大于18周岁
        let year = card_id.toString().substring(6,14);
        let nowYear = moment().format('YYYYMMDD')

        if( parseInt(nowYear) - parseInt(year) < 180000 ){
            Toast.info('暂不支持未成年问诊',1.5)
            return false
        }

        //判断身份证号
        if(!cardReg.test(card_id)){
            this.setState({
                idNumError:true
            })
            return false;
        }

        if(type == 'add'){
            dispatch({
                type:'management/savePatient',
                payload:{
                    name: name,
                    card_id: card_id
                },
                callback: this.submitCallback.bind(this)
            })
        }else{
            router.push('./chooseTime?id='+this.state.doctor_id)

        }

    }
    //submitCallback
    submitCallback = (response) => {
        const { doctor_id, isSetInput,source } = this.state
        if(response && response.data.code == 200){
            Toast.info('保存成功',1.5)
            if(!source && isSetInput){
                this.setState({
                    type:'set',
                    submitButton: '下一步',
                    idSet:true
                })
            }
        }else if(response && response.data.code == 412){
            Toast.info('就诊人已存在',1.5)
        }else if(response && response.data.code == 411){
            Toast.info('操作失败',1.5)
        }else if(response && response.data.code == 416){
            Toast.info('暂不支持未成年问诊',1.5)
        }else if(response && response.data.code == 403){
            Toast.info('身份证信息有误',1.5)
            this.setState({
                idNumError:true
            })
        }
    }

    render() {
        const { getFieldProps } = this.props.form;
        const { nameError, idNumError,submitButton,idSet,source } = this.state;
        const { name,card_id } = this.props.management;
        let title = '就诊人管理'
        if(!source && idSet){
            title='确认就诊人'
        }
        return (
            <DocumentTitle title={title}>
                <div className={Styles.management}>
                    <div className={Styles.management_name}>
                        <InputItem
                            clear
                            placeholder="请输入真实姓名"
                            ref={el => this.autoFocusInst = el}
                            value={name}
                            onChange={(val)=>{this.inputName(val)}}
                            onFocus={()=>{this.inputFocus('name')}}
                            className={ nameError ? `${Styles.name_error}` : ''}
                        >姓名</InputItem>
                    </div>
                    {
                        nameError ? <div className={Styles.error}>请输入身份证信息上的真实姓名</div> : ''
                    }
                    <div className={Styles.management_card}>
                        <InputItem
                            clear
                            placeholder="请输入准确的身份证号码"
                            ref={el => this.autoFocusInst = el}
                            value={card_id}
                            maxLength={18}
                            onChange={(val)=>{this.inputIdNum(val)}}
                            onFocus={()=>{this.inputFocus('card_id')}}
                            className={ idNumError ? `${Styles.card_error}` : ''}
                        >身份证号</InputItem>
                    </div>
                    {
                        idNumError ? <div className={Styles.error}>身份证号码有误，请核对后重新输入</div> : ''
                    }
                    {
                        name == '' || card_id == '' || nameError || idNumError
                            ?
                            <Button className={Styles.management_btn_disabled} >{submitButton}</Button>
                            :
                            <Button className={Styles.management_btn}  onClick={ ()=>{this.submit()} } >{submitButton}</Button>

                    }

                </div>
            </DocumentTitle>
        )
    }
}
export default createForm()(Management);
