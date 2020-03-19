import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal,Button } from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';

class ApplySubmit extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {

    }

    render() {

        return (
            <div className={Styles.apply_submit}>
                <img className={Styles.submit_img} src={require('../../assets/apply_submit.png')} alt=""/>
                <p className={Styles.submit_title} >已提交问诊</p>
                <div className={Styles.submit_content} >
                    <p className={Styles.content_time} >就诊时间：上午 9:00-9:30</p>
                    <p className={Styles.content} >具体时间请以就诊通知为准，<span>通知后5分钟未响应，预约视为作废，需重新申请。</span>请实时关注「天津医大代谢病」微信公众号提醒</p>
                </div>
                <Button className={Styles.submit_btn} >知道了</Button>
            </div>
        )
    }
}
export default ApplySubmit;
