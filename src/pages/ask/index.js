import React, { Component } from 'react'
import { connect } from 'dva';
import { SearchBar, Modal, Menu, Toast, List, InputItem,Button,WhiteSpace} from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import emojione from '../../utils/emojione.min'
import CryptoJS from '../../utils/md5'

class Ask extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {

    }

    render() {

        return (
            <div className={Styles.ask}>
                <div className={Styles.ask_item} onClick={()=>{router.push('./askChat')}}>
                    <div className={Styles.item}>
                        <img className={Styles.item_head} src={require('../../assets/head.png')} alt=""/>
                        <div className={Styles.item_info}>
                            <div className={Styles.info}>
                                <span className={Styles.info_name}>李晶</span>
                                <span>内分泌科</span>
                                <img src={require('../../assets/ask_order.png')} alt=""/>
                            </div>
                            <div className={Styles.info_content}>在线问诊10:00-10:30，请等待就诊通知。</div>
                            <div className={Styles.info_ill}>
                                <div className={Styles.ill}>糖尿病</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={Styles.ask_item} onClick={()=>{router.push('./askChat')}}>
                    <div className={Styles.item}>
                        <img className={Styles.item_head} src={require('../../assets/head.png')} alt=""/>
                        <div className={Styles.item_info}>
                            <div className={Styles.info}>
                                <span className={Styles.info_name}>李晶</span>
                                <span>内分泌科</span>
                                <span className={Styles.info_right}>上午 8:42</span>
                            </div>
                            <div className={Styles.info_content}>
                                <p className={Styles.content_word}>问一下现在怎么用药呢？血糖餐前问一下现在怎么用药呢？血糖餐前</p>
                                <p className={Styles.content_number}>16</p>
                            </div>
                            <div className={Styles.info_ill}>
                                <div className={Styles.ill}>糖尿病</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={Styles.ask_item} onClick={()=>{router.push('./askChat')}}>
                    <div className={Styles.item}>
                        <img className={Styles.item_head} src={require('../../assets/head.png')} alt=""/>
                        <div className={Styles.item_info}>
                            <div className={Styles.info}>
                                <span className={Styles.info_name}>李晶</span>
                                <span>内分泌科</span>
                                <span className={Styles.info_right}>周三</span>
                            </div>
                            <div className={Styles.info_content}>
                                <p className={Styles.content_word}>[本次问诊已失效]</p>
                                <img src={require('../../assets/ask_lose.png')} alt=""/>
                            </div>
                            <div className={Styles.info_ill}>
                                <div className={Styles.ill}>心率不齐</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={Styles.ask_item} onClick={()=>{router.push('./askChat')}}>
                    <div className={Styles.item}>
                        <img className={Styles.item_head} src={require('../../assets/head.png')} alt=""/>
                        <div className={Styles.item_info}>
                            <div className={Styles.info}>
                                <span className={Styles.info_name}>李晶</span>
                                <span>内分泌科</span>
                                <span className={Styles.info_right}>周三</span>
                            </div>
                            <div className={Styles.info_content}>
                                <p className={Styles.content_word}>[本次问诊已结束]</p>
                           <img src={require('../../assets/ask_success.png')} alt=""/>
                            </div>
                            <div className={Styles.info_ill}>
                                <div className={Styles.ill}>颈椎病</div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        )
    }
}


export default Ask;
