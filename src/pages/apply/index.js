import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal,Button } from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';

class Apply extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {

    }

    render() {

        return (
            <div className={Styles.apply}>
                <p className={Styles.apply_title} >就诊说明</p>
                <img className={Styles.apply_img} src={require('../../assets/apply_flow.png')} alt=""/>
                <p className={Styles.apply_content}>1.申请问诊后需等候就诊通知，请在您预约时段内实时关注微信公众号的就诊提醒。</p>
                <p className={ `${Styles.apply_content} ${Styles.apply_content_strong}`}>2.通知后5分钟未响应，预约视为作废，需重新申请。</p>
                <p className={Styles.apply_content}>3.就诊时间为15分钟，以进入问诊对话开始计时（建议就诊时间内不退出对话，因为该时段医生会1对1的为解答）。</p>
                <p className={Styles.apply_content}>4.危重病患者请立即到医院进行治疗。</p>
                <p className={Styles.apply_content}>5.医生的咨询服务仅提供相关就诊建议，不作为医嘱。</p>
                <p className={Styles.apply_fill}></p>
                <div className={Styles.apply_bottom}>
                    <p className={Styles.apply_word}>开始问诊即代表您已阅读并同意<span onClick={()=>{router.push('./informed')}}>《知情同意书》</span></p>
                    <Button className={Styles.apply_btn} >开始问诊</Button>
                </div>
            </div>
        )
    }
}
export default Apply;
