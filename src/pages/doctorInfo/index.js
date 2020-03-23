import React, { Component } from 'react';
import { connect } from 'dva';
import { SearchBar, Modal, Flex,Carousel, WingBlank  } from 'antd-mobile';
import Link from 'umi/link';
import router from 'umi/router';
import Styles from './index.less';
import moment from "moment";
moment.locale('zh-cn');

class DoctorInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            doctorInfo:{
                id:1,
                name:'医生一',
                rank:'副主任医师',
                office:'内分泌科',
                headImg:require('../../assets/head.png'),
                router:'./doctorInfo',
                date:'星期日',
                introducer:'内分泌系统疾病治疗，包括各种类型糖尿病，甲状腺疾病，高血压内分泌系统疾病治疗，包括各种类型糖尿病，甲状腺疾病，高血压'
            }
        }
    }
    render() {

        const { doctorInfo } = this.state;

        let date = '今日出诊';
        let isOpen = true;
        if(moment().format('dddd') != doctorInfo.date){
            date = '周' + doctorInfo.date.substr(-1) + '出诊';
            isOpen = false;
        }

        return (
            <div className={Styles.doctor_info}>
                <div className={Styles.info}>
                    <img className={Styles.info_img} src={doctorInfo.headImg} alt=""/>
                    <div className={Styles.info_right}>
                        <p className={Styles.info_name}>
                            <span>{doctorInfo.name}</span>
                            <span className={Styles.date}>{date}</span>
                        </p>
                        <p className={Styles.info_rank}>
                            <span>{doctorInfo.rank}</span>
                            <span>{doctorInfo.office}</span>
                        </p>
                    </div>
                </div>
                <div className={Styles.introducer}>
                    <img className={Styles.introducer_img} src={require('../../assets/strong.png')} alt=""/>
                    <div className={Styles.introducer_word}>
                        <span className={Styles.introducer_word_key}>擅长：</span>{doctorInfo.introducer}
                    </div>
                </div>
                <div className={Styles.introducer}>
                    <img className={Styles.introducer_img} src={require('../../assets/introduce.png')} alt=""/>
                    <div className={Styles.introducer_word}>
                        <span className={Styles.introducer_word_key}>简介：</span>{doctorInfo.introducer}
                    </div>
                </div>
                <div className={Styles.doctor_info_right}>
                    医生信息
                    <img className={Styles.info_right_img} src={require('../../assets/right.png')} alt=""/>
                </div>
                <div className={Styles.line}>
                    <div className={Styles.line_left}>
                        <img className={Styles.line_img} src={require('../../assets/line.png')} alt=""/>
                        <div  className={Styles.line_word}>
                            <p>在线问诊</p>
                            <p>¥0.00/次</p>
                        </div>
                    </div>
                    <div className={Styles.line_right}>
                        去问诊<img src={require('../../assets/line_right.png')} alt=""/>
                    </div>
                </div>


            </div>
        )
    }
}


export default DoctorInfo;
