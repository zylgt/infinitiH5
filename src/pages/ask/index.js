import React, { Component } from 'react'
import { connect } from 'dva';
import { SearchBar, Modal, Menu, Toast, List, InputItem,Button,WhiteSpace} from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import emojione from '../../utils/emojione.min'
import CryptoJS from '../../utils/md5'
import { staticURL } from '../../utils/baseURL'
import moment from "moment";
moment.locale('zh-cn');


@connect(({ ask }) => ({ ask }))
class Ask extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataArray:[
                // {
                //     "uid": "sdf", //ID
                //     "no": "112313213", //订单号
                //     "status":"", //panding:待问诊 inquiring:问诊中 finished:完成问诊 expired:过期
                //     "doctor_name":"张三", //医生
                //     "icon":"", //头像
                //     "segment":"",//预约时间段
                //     "dept":"", //科室
                //     "disease":["",""], //疾病标签
                //     "last_msg":"sdf", //最后一条消息
                //     "last_time":"2012-10-10 12:00:00", //最后一条消息时间
                // },
                // {
                //     "uid": "sdf", //ID
                //     "no": "112313213", //订单号
                //     "status":"inquiring", //panding:待问诊 inquiring:问诊中 finished:完成问诊 expired:过期
                //     "doctor_name":"张三", //医生
                //     "dept":"糖尿病科", //科室
                //     "disease":["糖尿饼"], //疾病标签
                //     "last_msg":"sdf", //最后一条消息
                //     "last_time":"2012-10-10 12:00:00", //最后一条消息时间
                // },
                // {
                //     "uid": "sdf", //ID
                //     "no": "112313213", //订单号
                //     "status":"finished", //panding:待问诊 inquiring:问诊中 finished:完成问诊 expired:过期
                //     "doctor_name":"张三", //医生
                //     "dept":"糖尿病科", //科室
                //     "disease":["糖尿饼"], //疾病标签
                //     "last_msg":"sdf", //最后一条消息
                //     "last_time":"2012-10-10 12:00:00", //最后一条消息时间
                // },
                // {
                //     "uid": "sdf", //ID
                //     "no": "112313213", //订单号
                //     "status":"expired", //panding:待问诊 inquiring:问诊中 finished:完成问诊 expired:过期
                //     "doctor_name":"张三", //医生
                //     "dept":"糖尿病科", //科室
                //     "disease":["糖尿饼"], //疾病标签
                //     "last_msg":"sdf", //最后一条消息
                //     "last_time":"2012-10-10 12:00:00", //最后一条消息时间
                // }
            ]
        }
    }
    componentDidMount() {

    }
    //判断消息右上角时间
    rigthTime(item){

        let time = ''
        if(item.last_time){
            let weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
            let currentTime = Date.parse(new Date());
            let d_day = Date.parse(new Date(item.last_time));
            let day = Math.abs(parseInt((d_day - currentTime)/1000/3600/24));//计算日期
            if(day >= 8){
                let date = moment(item.last_time).format('YYYY/MM/DD')
                time = date;
            }else if(day <8 && day >= 2){
                let index = new Date(item.last_time).getDay()
                time = weeks[index]
            }else if(day > 0 && day < 2){
                time = '昨天'
            }else{
                let hours = new Date(item.last_time).getHours();
                let date = moment(item.last_time).format('LT');
                if(hours <= 12){
                    time = '上午' + date
                }else{
                    time = '下午' + date
                }
            }
        }

        if(item.status == 'inquiring'){
            return (
                <span className={Styles.info_right}>time</span>
            )
        }else if(item.status == 'finished'){
            return (
                <span className={Styles.info_right}>time</span>
            )
        }else if(item.status == 'expired'){
            return (
                <span className={Styles.info_right}>time</span>
            )
        }else {
            return (
                <img className={Styles.info_right} src={require('../../assets/ask_order.png')} alt=""/>
            )
        }
    }
    //判断消息内容显示
    infoContent(item){
        if(item.status == 'inquiring'){
            return (
                <div className={Styles.info_content}>
                    <p className={Styles.content_word}> {item.last_msg} </p>
                    <p className={Styles.content_number}>{ item.un_read }</p>
                </div>
            )
        }else if(item.status == 'finished'){
            return (
                <div className={Styles.info_content}>
                    <p className={Styles.content_word}>[本次问诊已结束]</p>
                    <img src={require('../../assets/ask_success.png')} alt=""/>
                </div>
            )
        }else if(item.status == 'expired'){
            return (
                <div className={Styles.info_content}>
                    <p className={Styles.content_word}>[本次问诊已失效]</p>
                    <img src={require('../../assets/ask_lose.png')} alt=""/>
                </div>
            )
        }else {
            return (
                <div className={Styles.info_content}>在线问诊{item.segment}，请等待就诊通知。</div>
            )
        }
    }

    render() {
        const { askList } = this.props.ask;

        return (
            <div className={Styles.ask}>
                {
                    askList && askList.length > 0 ?
                        askList.map((item,index)=>{
                            return(
                                <div className={Styles.ask_item} key={index}>
                                    <div className={Styles.item}>
                                        <img className={Styles.item_head} src={ staticURL + item.icon } alt=""/>
                                        <div className={Styles.item_info}>
                                            <div className={Styles.info}>
                                                <span className={Styles.info_name}>{item.doctor_name}</span>
                                                <span>{item.dept}</span>
                                                {this.rigthTime(item)}
                                            </div>
                                            {this.infoContent(item)}
                                            <div className={Styles.info_ill}>
                                                {
                                                    item.disease.map((item,index)=>{
                                                        return(
                                                            <div className={Styles.ill} key={index}>{item}</div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <div className={Styles.ask_no}>
                            <img src={require('../../assets/no_ask.png')} alt=""/>
                            <p>暂无问诊记录</p>
                        </div>
                }
                {/*<div className={Styles.ask_item} onClick={()=>{router.push('./askChat')}}>*/}
                {/*<div className={Styles.item}>*/}
                {/*<img className={Styles.item_head} src={require('../../assets/head.png')} alt=""/>*/}
                {/*<div className={Styles.item_info}>*/}
                {/*<div className={Styles.info}>*/}
                {/*<span className={Styles.info_name}>李晶</span>*/}
                {/*<span>内分泌科</span>*/}
                {/*<img className={Styles.info_right} src={require('../../assets/ask_order.png')} alt=""/>*/}
                {/*</div>*/}
                {/*<div className={Styles.info_content}>在线问诊10:00-10:30，请等待就诊通知。</div>*/}
                {/*<div className={Styles.info_ill}>*/}
                {/*<div className={Styles.ill}>糖尿病</div>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*</div>*/}

                {/*<div className={Styles.ask_item} onClick={()=>{router.push('./askChat')}}>*/}
                {/*<div className={Styles.item}>*/}
                {/*<img className={Styles.item_head} src={require('../../assets/head.png')} alt=""/>*/}
                {/*<div className={Styles.item_info}>*/}
                {/*<div className={Styles.info}>*/}
                {/*<span className={Styles.info_name}>李晶</span>*/}
                {/*<span>内分泌科</span>*/}
                {/*<span className={Styles.info_right}>上午 8:42</span>*/}
                {/*</div>*/}
                {/*<div className={Styles.info_content}>*/}
                {/*<p className={Styles.content_word}>问一下现在怎么用药呢？血糖餐前问一下现在怎么用药呢？血糖餐前</p>*/}
                {/*<p className={Styles.content_number}>16</p>*/}
                {/*</div>*/}
                {/*<div className={Styles.info_ill}>*/}
                {/*<div className={Styles.ill}>糖尿病</div>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*</div>*/}

                {/*<div className={Styles.ask_item} onClick={()=>{router.push('./askChat')}}>*/}
                {/*<div className={Styles.item}>*/}
                {/*<img className={Styles.item_head} src={require('../../assets/head.png')} alt=""/>*/}
                {/*<div className={Styles.item_info}>*/}
                {/*<div className={Styles.info}>*/}
                {/*<span className={Styles.info_name}>李晶</span>*/}
                {/*<span>内分泌科</span>*/}
                {/*<span className={Styles.info_right}>周三</span>*/}
                {/*</div>*/}
                {/*<div className={Styles.info_content}>*/}
                {/*<p className={Styles.content_word}>[本次问诊已结束]</p>*/}
                {/*<img src={require('../../assets/ask_success.png')} alt=""/>*/}
                {/*</div>*/}
                {/*<div className={Styles.info_ill}>*/}
                {/*<div className={Styles.ill}>颈椎病</div>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*</div>*/}

                {/*<div className={Styles.ask_item} onClick={()=>{router.push('./askChat')}}>*/}
                {/*<div className={Styles.item}>*/}
                {/*<img className={Styles.item_head} src={require('../../assets/head.png')} alt=""/>*/}
                {/*<div className={Styles.item_info}>*/}
                {/*<div className={Styles.info}>*/}
                {/*<span className={Styles.info_name}>李晶</span>*/}
                {/*<span>内分泌科</span>*/}
                {/*<span className={Styles.info_right}>周三</span>*/}
                {/*</div>*/}
                {/*<div className={Styles.info_content}>*/}
                {/*<p className={Styles.content_word}>[本次问诊已失效]</p>*/}
                {/*<img src={require('../../assets/ask_lose.png')} alt=""/>*/}
                {/*</div>*/}
                {/*<div className={Styles.info_ill}>*/}
                {/*<div className={Styles.ill}>心率不齐</div>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*</div>*/}


            </div>
        )
    }
}


export default Ask;
