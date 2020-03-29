import React, { Component } from 'react'
import { connect } from 'dva';
import { createForm } from 'rc-form';
import Styles from './index.less';
import { nonceStr } from '../../utils/tools'
import DocumentTitle from 'react-document-title'
import wx from 'weixin-js-sdk';
import { pageURL } from '../../utils/baseURL'

@connect(({ login }) => ({ login }))
class Agreememt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timestamp:''
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
        dispatch({
            type:'patientDescribe/getAppid',
            payload:{
                noncestr: nonceStr,
                timestamp: timestamp,
                url: pageURL + '/agreement'
            },
            callback: this.getAppidCallback.bind(this)
        })
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

    render() {

        return (
            <DocumentTitle title='服务协议'>
                <div className={Styles.agree}>
                    <div className={Styles.agree_name}>
                        天津医科大学朱宪彝纪念医院互联网医院服务协议
                    </div>
                    <div className={Styles.agree_title}>
                        第一条、条款确认
                    </div>
                    <div className={Styles.agree_section}>
                        1.1医院图文问诊服务（以下简称本服务）各项电子服务的所有权和运作权归国际医院，用户应仔细阅读本《北京大学国际医院图文问诊服务用户协议》（以下简称本协议）中的各个条款（未成年人应当在其监护人陪同下阅读）。
                    </div>
                    <div className={Styles.agree_section}>
                        1.2任何使用本服务或本服务中某项功能、某一部分，或以其他间接方式使用本服务的行为，即视为同意并接受本协议，愿意接受本协议所有条款约定和相应法律责任。
                    </div>
                    <div className={Styles.agree_section}>
                        1.3国际医院可根据服务平台运营实际制订、修改本协议及条款，修改后需经用户重新阅读并确认，如用户确认接受修改协议或条款，变更协议和条款自动产生法律效应。
                    </div>
                    <div className={Styles.agree_title}>
                        第二条、账号管理
                    </div>
                    <div className={Styles.agree_section}>
                        2.1用户添加就诊人资料时，需提供真实、及时、完整和合法有效的资料，若提供的资料信息并非真实、完整、有效，国际医院有权停止、冻结用户的就诊号并要求用户承担因此造成的法律后果。就诊人信息一经添加不允许再修改或删除，如有疑问可拨打平台（）电话联系工作人员。
                    </div>
                    <div className={Styles.agree_section}>
                        2.2用户应妥善保管自身服务账号等个人资料，不得以任何方式将就诊账号等个人资料转让、告知或借给他人。如因上述或其他缘故导致就诊账号等个人资料遗失、被盗或用户信息泄露等情况致使自身相关权益受到损害的，皆由用户独自承担一切后果。
                    </div>
                </div>
            </DocumentTitle>

        )
    }
}
export default Agreememt;
