import React, { Component } from 'react';
import { connect } from 'dva';
import { SearchBar, Modal, Flex,Carousel, WingBlank ,Toast } from 'antd-mobile';
import Link from 'umi/link';
import router from 'umi/router';
import Styles from './index.less';
import { getQueryString, nonceStr } from '../../utils/tools'
import { staticURL, pageURL } from '../../utils/baseURL'
import DocumentTitle from 'react-document-title'
import wx from 'weixin-js-sdk';
import LazyLoad from 'react-lazyload';
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入

import moment from "moment";
moment.locale('zh-cn');

@connect(({ chooseDoctor }) => ({ chooseDoctor }))
class ChooseDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            timestamp:'',
            name:''
        }
        this._onScrollEvent = this._onScrollEvent.bind(this);  //保证被组件调用时，对象的唯一性

    }
    componentDidMount(){
        const { dispatch } = this.props;
        const { offset } = this.props.chooseDoctor;
        let type = getQueryString('type') || '';
        let id = getQueryString('id') || '';
        let name = getQueryString('name') || '';

        this.setState({
            name:name
        })

        dispatch({
            type: 'chooseDoctor/getDoctor',
            payload:{
                type: parseInt(type),
                search_id: id,
                offset: offset,
                limit: 20
            }
        });


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
        //         url: pageURL + '/chooseDoctor'
        //     },
        //     callback: this.getAppidCallback.bind(this)
        // })
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
    //滚动事件
    _onScrollEvent() {
        const { dispatch } = this.props;
        const { offset } = this.props.chooseDoctor;
        let scrollTop = this._container.scrollTop;
        let scrollHeight = this._container.scrollHeight;
        let clientHeight = this._container.clientHeight;
        let type = getQueryString('type') || '';
        let id = getQueryString('id') || '';
        if( scrollTop == 0 || scrollTop % 2 != 0 ){
            return
        }
        if ( scrollHeight - scrollTop - clientHeight < 100 && this.state.isScroll ) {
            console.log('chooseDoctor滑到底了')
            this.setState({
                isScroll:false
            })
            dispatch({
                type: 'chooseDoctor/getDoctor',
                payload:{
                    type: parseInt(type),
                    search_id: id,
                    offset: offset,
                    limit: 20
                }
            });
        }else{
            if(scrollHeight - scrollTop - clientHeight > 100){
                this.setState({
                    isScroll:true
                })
            }
        }
    }
    //点击进入出诊医生
    clickDoctor(e){
        let doctorId = e.currentTarget.getAttribute('data-id');
        // console.log('officeId',doctorId)
        router.push('./doctorInfo?id=' + doctorId )
    }


    render() {
        const { doctorData } = this.props.chooseDoctor;
        const { name } = this.state;

        return (
            <DocumentTitle title={ name }>
                <div className={Styles.choose_doctor} ref={e => this._container = e} onScrollCapture={() => this._onScrollEvent()} >

                    {
                        doctorData.length > 0 ? doctorData.map((item,index)=>{
                            let date = '今日出诊';
                            let isOpen = true;
                            if(moment().format('d') != item.week){
                                let weeks = new Array("日", "一", "二", "三", "四", "五", "六");
                                date = '周' + weeks[ item.week ] + '出诊';
                                isOpen = false;
                            }

                            return(
                                <div className={Styles.doctor_item} key={item.uid} data-id={item.uid} onClick={(e) => { this.clickDoctor(e)}}>
                                    <img className={Styles.doctor_img} src={ staticURL + item.icon } alt=""/>
                                    <div>
                                        <p className={Styles.doctor_info}>
                                            <span className={Styles.doctor_name}>{item.name}</span>
                                            <span className={Styles.doctor_rank}>{item.title}</span>
                                            <span>{item.dept}</span>
                                            <span className={`${Styles.date} ${isOpen ? '':Styles.date_no}`}>{date}</span>
                                        </p>
                                        {
                                            item.skill ?
                                                <div className={Styles.doctor_introducer}>
                                                    擅长：{item.skill}
                                                </div>
                                                :
                                                <div className={Styles.doctor_introducer}>
                                                    简介 ：{item.info}
                                                </div>
                                        }
                                    </div>
                                </div>
                            )
                        }) :''
                    }
                </div>
            </DocumentTitle>


        )
    }
}


export default ChooseDoctor;
