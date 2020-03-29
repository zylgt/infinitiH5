import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal,Button } from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import { nonceStr } from '../../utils/tools'
import DocumentTitle from 'react-document-title'
import wx from 'weixin-js-sdk';
import { pageURL } from '../../utils/baseURL'

@connect(({ my }) => ({ my }))
class MyIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timestamp:'',
            isCall:false
        }
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
        //         url: pageURL + '/agreement'
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
    //打开拨打电话窗口
    showModal(e){
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            isCall: true
        });

    }
    //关闭拨打电话窗口
    onClose(){
        this.setState({
            isCall: false
        });
    }

    render() {
        const { isCall } = this.state;
        const { userInfo } = this.props.my;
        console.log('userInfo',userInfo)
        let reg = /^(\d{3})\d{7}(\d{1})$/;
        let phone;
        if(userInfo && userInfo.phone){
            phone = userInfo && userInfo.phone.replace(reg, "$1 **** ***$2");
        }
        return (
            <DocumentTitle title='我的'>
                <div className={Styles.my}>
                    <div className={Styles.my_info} >
                        <img src={require('../../assets/my_head.png')} alt=""/>
                        <span>{ phone }</span>
                    </div>
                    <div className={ `${Styles.my_item} ${Styles.my_item_margin}`} onClick={()=>{router.push('./management?type=add&source=my')}}>
                        <span>就诊人管理</span>
                        <img src={require('../../assets/my_right.png')} alt=""/>
                    </div>
                    <div className={Styles.my_item} onClick={(e)=>{this.showModal(e)}}>
                        <span>联系客服</span>
                        <img src={require('../../assets/my_right.png')} alt=""/>
                    </div>
                    <div className={Styles.my_item} onClick={()=>{router.push('./agreement')}}>
                        <div className={Styles.my_item_border}></div>
                        <span>服务协议</span>
                        <img src={require('../../assets/my_right.png')} alt=""/>
                    </div>

                    <Modal
                        visible={ isCall }
                        transparent
                        maskClosable={true}
                        closable={true}
                        onClose={()=>{this.onClose()}}
                        title=""
                        className='my_model'
                    >
                        <p className='model_title'>客服电话</p>
                        <p className='model_title model_phone'>400-0000-000</p>
                        <a className='model_btn' key='phone' href="tel:400-0000-000">拨打电话</a>
                    </Modal>

                </div>
            </DocumentTitle>
        )
    }
}
export default MyIndex;
