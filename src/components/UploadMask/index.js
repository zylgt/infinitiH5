import React, {Component} from 'react';
import Styles from './index.less';
import router from 'umi/router';
import { Modal } from 'antd-mobile';

class UploadMask extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }
    closeMask(){
        this.props.closeMask()
    }

    render() {
        const  keyWord = this.props.keyWord;
        return (
            <div className={Styles.mask}>
                <Modal
                    visible={true}
                    transparent
                    maskClosable={false}
                >
                    <div className={Styles.window}>
                        <img className={Styles.window_close} src={require('../../assets/welcome_closeicon.png')}
                             alt="" onClick={() => {
                            this.closeMask()
                        }}/>
                        {
                            keyWord === 'pointMore'?
                                <div className={Styles.point_title}>
                                    <span>我们已收到您对</span>
                                    <span>故事无限公司的强力支持</span>
                                    <span>今日点赞额度已用完</span>
                                    <span>请通过评论/转发的形式</span>
                                    <span>继续pick合伙人的故事吧</span>
                                </div>:''
                        }
                        {
                            keyWord === 'surprise'?
                                <div className={Styles.mask_title}>
                                    <span>您的信息已提交！信件正在快马加鞭的寄出去…</span>
                                </div>:''
                        }
                        {
                            keyWord === 'first'?
                                <div className={Styles.first_title}>
                                    <span>活动期间，累计点赞、评论或者分享10次即可获取，“锦鲤幸运奖”抽奖资格，快快行动吧！</span>
                                </div>:''
                        }
                    </div>
                    <div className={Styles.window_bottom}>
                        <img className={Styles.window_bottom_bg} src={require('../../assets/welcome_bottom_page.png')}
                             alt=""/>
                    </div>

                </Modal>
            </div>
        )
    }
}


export default UploadMask;
