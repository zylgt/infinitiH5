import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal,Button } from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';

@connect(({ chooseTime }) => ({ chooseTime }))
class ApplySubmit extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {

    }
    //知道了


    render() {
        const { selectTime } = this.props.chooseTime;
        let key = ''
        if(selectTime && selectTime.key == 'forenoon'){
            key='上午'
        }
        if(selectTime && selectTime.key == 'afternoon'){
            key='下午'
        }

        return (
            <div className={Styles.apply_submit}>
                <img className={Styles.submit_img} src={require('../../assets/apply_submit.png')} alt=""/>
                <p className={Styles.submit_title} >已提交问诊</p>
                <div className={Styles.submit_content} >
                    <p className={Styles.content_time} >
                        就诊时间：{key}
                        {selectTime && selectTime.segment ? selectTime.segment : ''}
                    </p>
                    <p className={Styles.content} >具体时间请以就诊通知为准，<span>通知后5分钟未响应，预约视为作废，需重新申请。</span>请实时关注「天津医大代谢病」微信公众号提醒</p>
                </div>
                <Button className={Styles.submit_btn} onClick={()=>{router.push('./ask')}}>知道了</Button>
            </div>
        )
    }
}
export default ApplySubmit;
