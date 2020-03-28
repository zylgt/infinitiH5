import React, { Component } from 'react';
import { connect } from 'dva';
import { SearchBar, Modal, Flex,Carousel, WingBlank  } from 'antd-mobile';
import Link from 'umi/link';
import router from 'umi/router';
import Styles from './index.less';
import Swiper from '../../components/swiper'
import { staticURL } from '../../utils/baseURL'
import wx from 'weixin-js-sdk';


@connect(({ home }) => ({ home }))
class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isScroll:true
        }
        this._onScrollEvent = this._onScrollEvent.bind(this);  //保证被组件调用时，对象的唯一性

    }
    componentDidMount() {
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wxc6c277ae69cd3a77', // 必填，公众号的唯一标识
            timestamp:'1585276766' , // 必填，生成签名的时间戳
            nonceStr: 'wangshenzhen', // 必填，生成签名的随机串
            signature: '6b76c25a60fe6628f7711011141dac888ac82fcd',// 必填，签名
            jsApiList: ['uploadImage','chooseImage','hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表
        });
        wx.ready(function(){
            console.log(111)
            wx.hideAllNonBaseMenuItem();
            // wx.closeWindow();


            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });

    }
    //滚动事件
    _onScrollEvent() {
        const { dispatch } = this.props;
        const { offset } = this.props.home;
        let scrollTop = this._container.scrollTop;
        let scrollHeight = this._container.scrollHeight;
        let clientHeight = this._container.clientHeight;
        if( scrollTop == 0 || scrollTop % 2 != 0 ){
            return
        }
        if ( scrollHeight - scrollTop - clientHeight < 100 && this.state.isScroll ) {
            console.log('home滑到底了')
            this.setState({
                isScroll:false
            })
            dispatch({
                type: 'home/getDoctorData',
                payload:{
                    offset: offset,
                    limit:20
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

    //点击科室 / 点击疾病
    clickOffice(e){
        let officeId = e.currentTarget.getAttribute('data-id');
        let type = e.currentTarget.getAttribute('data-type');
        // console.log('officeId',officeId)
        router.push('./chooseDoctor?id=' + officeId + '&type=' + type )

    }
    //点击进入出诊医生
    clickDoctor(e){
        let doctorId = e.currentTarget.getAttribute('data-id');
        // console.log('officeId',doctorId)
        router.push('./doctorinfo?id=' + doctorId )
    }

    render() {
        const { home } = this.props;
        const { swipeData, officeData, illnessData, doctorData } = this.props.home;
        const swiperProps={
            dots:true,
            autoplay:true,
            autoplayInterval:5000,
            infinite:true,
            dotStyle:{width:'6px',height:'6px',background:'rgba(255,255,255,0.5)'},
            dotActiveStyle:{height:'6px',background:'rgba(255,255,255,1)'},
            itemStyle:{width:'100%',height:'2.7rem'},
            itemData:swipeData
        }

        // console.log('doctorData',doctorData)
        return (
            <div className={Styles.home} ref={e => this._container = e} onScrollCapture={() => this._onScrollEvent()} >

                <div className={Styles.swiper}>
                    {
                        swipeData.length > 0 ? <Swiper {...swiperProps} ></Swiper> : ''
                    }
                </div>
                <div className={Styles.title}>选择科室</div>
                <div className={Styles.office} >
                    {
                        officeData.length > 0 ? officeData.map((item,index)=>{
                            return(
                                <div className={Styles.office_item} key={item.uid} data-id={item.uid} data-type="1" onClick={(e) => { this.clickOffice(e) }}>
                                    <img className={Styles.item_img} src={ staticURL + item.icon} alt=""/>
                                    <p className={Styles.item_title}>{item.name}</p>
                                </div>
                            )
                        }) : ''
                    }
                </div>
                <div className={Styles.title}>常见疾病</div>
                <div className={Styles.illness} >
                    {
                        illnessData.length > 0 ? illnessData.map((item,index)=>{
                            return(
                                <div className={Styles.illness_title} key={item.uid} data-id={item.uid} data-type="2" onClick={(e) => {this.clickOffice(e)}}>
                                    {item.name}
                                </div>
                            )
                        }) : ''
                    }
                </div>
                <div className={Styles.title}>今日出诊医生</div>
                <div className={Styles.doctor} >
                    {
                        doctorData.length > 0 ? doctorData.map((item,index)=>{

                            return(
                                <div className={Styles.doctor_item} key={item.uid} data-id={item.uid} onClick={(e) => { this.clickDoctor(e) }}>
                                    <img className={Styles.doctor_img} src={ staticURL + item.icon } alt=""/>
                                    <div>
                                        <p className={Styles.doctor_info}>
                                            <span className={Styles.doctor_name}>{item.name}</span>
                                            <span className={Styles.doctor_rank}>{item.title}</span>
                                            <span>{item.dept}</span>
                                        </p>
                                        <div className={Styles.doctor_introducer}>
                                            擅长：{item.skill}
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : ''
                    }
                </div>

            </div>
        )
    }
}


export default Home;
