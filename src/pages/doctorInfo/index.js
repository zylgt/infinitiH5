import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Toast  } from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import { getQueryString,nonceStr,isIOS } from '../../utils/tools'
import { staticURL } from '../../utils/baseURL'
import DocumentTitle from 'react-document-title'
import wx from 'weixin-js-sdk';
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入
import moment from "moment";
moment.locale('zh-cn');

@connect(({ doctorInfo }) => ({ doctorInfo }))
class DoctorInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            timestamp:'',
            doctor_id:'',
            modal:false,
            modelTitl:'',
            isShowCover:false
        }
    }

    componentDidMount(){
        const { dispatch } = this.props;
        let id = getQueryString('id') || '';
        // console.log('id',id)
        this.setState({
            doctor_id: id
        })
        dispatch({
            type: 'doctorInfo/getDoctorInfo',
            payload:{
                doctor_id: id
            }
        });

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
    //点击进入出诊医生详情
    clickDoctorDetail(){
        let doctorId = this.state.doctor_id;
        this.setState({
            isShowCover:true
        })
        // console.log('officeId',doctorId)
        // router.push('./doctorDetail?id=' + doctorId )
    }
    //点击去问诊
    clickAskChat(isOpen){
        const { dispatch } = this.props;
        console.log('isOpen',isOpen)
        if(!isOpen){
            return;
        }
        let doctorId = this.state.doctor_id;
        //问诊验证
        dispatch({
            type: 'doctorInfo/getAskVerify',
            payload:{
                doctor_id: doctorId
            },
            callback:this.clickAskChatCallback.bind(this)
        });
    }
    //callback
    clickAskChatCallback(response){
        // console.log('response-----',response)

        if(response.data.code == 421){
            router.push('./management?type=add&id='+this.state.doctor_id  )
        }else if(response.data.code == 420){
            Toast.info('今日无出诊', 1.5)
        }else if(response.data.code == 422){
            this.setState({
                modal:true,
                modelTitl:'您当前已有一个问诊预约待就诊，需完成后才可继续预约，给您带来不便敬请谅解'
            })
        }else if(response.data.code == 423){
            this.setState({
                modal:true,
                modelTitl:'您已在今日问诊过该科室，所以无法继续预约了（一个就诊人只可在一天内问诊一个科室）'
            })
        }else if(response.data.code == 200){
            router.push('./management?type=set&id='+this.state.doctor_id )
        }
    }
    //关闭model
    onClose(){
        this.setState({
            modal:false
        })
    }
    //关闭详情
    closeDetail(e){
        // e.stopPropagation();
        // e.preventDefault();
        this.setState({
            isShowCover:false
        })
    }


    render() {
        const { modelTitl,isShowCover } = this.state;
        const { doctorInfo } = this.props.doctorInfo;

        let date = '今日出诊';
        let isOpen = true;
        if(moment().format('d') != doctorInfo.week){
            let weeks = new Array("日", "一", "二", "三", "四", "五", "六");
            let num = weeks[ doctorInfo.week ] || '';
            date = '周' + num + '出诊';
            isOpen = false;
        }
        let title = '医生详情';
        if(doctorInfo.name){
            title = doctorInfo.name + '医生详情'
        }

        return (
            <DocumentTitle title={ title }>
                <div className={Styles.doctor_info}>
                    <div className={Styles.info}>
                        {
                            doctorInfo.icon ? <img className={`${Styles.info_img} ${Styles.img}`} src={ staticURL + doctorInfo.icon } alt=""/> : ''
                        }
                        {
                            doctorInfo.name ? <div className={Styles.info_right}>
                                <p className={Styles.info_name}>
                                    <span>{doctorInfo.name}</span>
                                    <span className={`${Styles.date} ${isOpen ? '':Styles.date_no}`}>{date}</span>
                                </p>
                                <p className={Styles.info_rank}>
                                    <span>{doctorInfo.title}</span>
                                    <span>{doctorInfo.dept}</span>
                                </p>
                            </div> : ''
                        }
                    </div>
                    {
                        doctorInfo.skill
                            ?
                            <div className={Styles.introducer}>
                                <img className={`${Styles.introducer_img} ${Styles.img}`} src={require('../../assets/strong.png')} alt=""/>
                                <div className={Styles.introducer_word}>
                                    <span className={Styles.introducer_word_key}>擅长：</span>{doctorInfo.skill}
                                </div>
                            </div>
                            : ''
                    }
                    {
                        doctorInfo.info
                            ?
                            <div className={Styles.introducer}>
                                <img className={`${Styles.introducer_img} ${Styles.img}`} src={require('../../assets/introduce.png')} alt=""/>
                                <div className={Styles.introducer_word}>
                                    <span className={Styles.introducer_word_key}>简介：</span>{doctorInfo.info}
                                </div>
                            </div>
                            : ''
                    }

                    <div className={Styles.doctor_info_right} onClick={()=>{this.clickDoctorDetail()}}>
                        医生信息
                        <img className={ `${Styles.info_right_img}`} src={require('../../assets/right.png')} alt=""/>
                    </div>

                    <div className={Styles.line}>
                        <div className={Styles.line_left}>
                            <img className={`${Styles.line_img} ${Styles.img}`} src={require('../../assets/line_video.png')} alt=""/>
                            <div className={Styles.line_word}>
                                <p>视频轻问诊</p>
                                <p>¥0.00/次</p>
                            </div>
                        </div>
                        <div className={`${Styles.line_right} ${ isOpen ? '' : Styles.line_right_no } ${isIOS() ? '' : Styles.line_right_and}`} onClick={()=>{this.clickAskChat(isOpen)}}>
                            去问诊<img src={require('../../assets/line_right.png')} alt=""/>
                        </div>
                    </div>
                    <div className={`${Styles.line} ${Styles.line_video}`}>
                        <div className={Styles.line_left}>
                            <img className={`${Styles.line_img} ${Styles.img}`} src={require('../../assets/line.png')} alt=""/>
                            <div className={Styles.line_word}>
                                <p>图文轻问诊</p>
                                <p>¥0.00/次</p>
                            </div>
                        </div>
                        <div className={`${Styles.line_right} ${ isOpen ? '' : Styles.line_right_no } ${isIOS() ? '' : Styles.line_right_and}`} onClick={()=>{this.clickAskChat(isOpen)}}>
                            去问诊<img src={require('../../assets/line_right.png')} alt=""/>
                        </div>
                    </div>

                    {
                        isShowCover ?
                            <div className={ Styles.doctor_info_cover }>
                                <div onClick={(e)=>{this.closeDetail(e)}} className={Styles.cover} ></div>
                                <div className={`${Styles.cover_content}`}>
                                    <div className={Styles.cover_title}>
                                        {doctorInfo.name}医生简介
                                        <img onClick={(e)=>{this.closeDetail(e)}} src={require('../../assets/close_cover.png')} alt=""/>
                                    </div>
                                    <div className={Styles.cover_info}>
                                        {
                                            doctorInfo.skill
                                                ?
                                                <div className={`${Styles.introducer} ${Styles.cover_introducer}`}>
                                                    <img className={`${Styles.introducer_img} ${Styles.cover_introducer_img}`} src={require('../../assets/strong.png')} alt=""/>
                                                    <div className={`${Styles.introducer_word} ${Styles.cover_introducer_word}`} >
                                                        <span className={`${Styles.introducer_word_key} ${Styles.cover_introducer_word_key}`}>擅长：</span>{doctorInfo.skill}
                                                    </div>
                                                </div>
                                                : ''
                                        }
                                        {
                                            doctorInfo.info
                                                ?
                                                <div className={`${Styles.introducer} ${Styles.cover_introducer}`}>
                                                    <img className={`${Styles.introducer_img} ${Styles.cover_introducer_img}`} src={require('../../assets/introduce.png')} alt=""/>
                                                    <div className={`${Styles.introducer_word} ${Styles.cover_introducer_word}`} >
                                                        <span className={`${Styles.introducer_word_key} ${Styles.cover_introducer_word_key}`}>简介：</span>{doctorInfo.info}
                                                    </div>
                                                </div>
                                                : ''
                                        }
                                    </div>
                                </div>
                            </div>
                            :''
                    }


                    <Modal
                        visible={this.state.modal}
                        transparent
                        maskClosable={true}
                        onClose={()=>{this.onClose()}}
                        // title="Title"
                        className='doctor_info_model'
                        footer={[{ text: '知道了', onPress: () => { this.onClose()} }]}
                    >
                        <div style={{color:'#333'}}>
                            { modelTitl }
                        </div>
                    </Modal>

                </div>
            </DocumentTitle>
        )
    }
}


export default DoctorInfo;
