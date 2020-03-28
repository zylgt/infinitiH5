import React, { Component } from 'react';
import { connect } from 'dva';
import { SearchBar, Modal, Flex,Carousel, WingBlank  } from 'antd-mobile';
import Link from 'umi/link';
import router from 'umi/router';
import Styles from './index.less';
import { getQueryString } from '../../utils/tools'
import { staticURL } from '../../utils/baseURL'
import moment from "moment";
moment.locale('zh-cn');

@connect(({ doctorInfo }) => ({ doctorInfo }))
class DoctorInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount(){
        const { dispatch } = this.props;
        let id = getQueryString('id') || '';
        console.log('id',id)
        dispatch({
            type: 'doctorInfo/getDoctorInfo',
            payload:{
                doctor_id: id
            }
        });
    }

    render() {

        const { doctorInfo } = this.props.doctorInfo;

        let date = '今日出诊';

        if(moment().format('d') != doctorInfo.week){
            let weeks = new Array("日", "一", "二", "三", "四", "五", "六");
            date = '周' + weeks[ doctorInfo.week ] + '出诊';
        }

        return (
            <div className={Styles.doctor_info}>
                <div className={Styles.info}>
                    <img className={Styles.info_img} src={ staticURL + doctorInfo.icon } alt=""/>
                    <div className={Styles.info_right}>
                        <p className={Styles.info_name}>
                            <span>{doctorInfo.name}</span>
                            <span className={Styles.date}>{date}</span>
                        </p>
                        <p className={Styles.info_rank}>
                            <span>{doctorInfo.title}</span>
                            <span>{doctorInfo.dept}</span>
                        </p>
                    </div>
                </div>
                <div className={Styles.introducer}>
                    <img className={Styles.introducer_img} src={require('../../assets/strong.png')} alt=""/>
                    <div className={Styles.introducer_word}>
                        <span className={Styles.introducer_word_key}>擅长：</span>{doctorInfo.skill}
                    </div>
                </div>
                <div className={Styles.introducer}>
                    <img className={Styles.introducer_img} src={require('../../assets/introduce.png')} alt=""/>
                    <div className={Styles.introducer_word}>
                        <span className={Styles.introducer_word_key}>简介：</span>{doctorInfo.info}
                    </div>
                </div>


            </div>
        )
    }
}


export default DoctorInfo;
