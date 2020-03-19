import React, { Component } from 'react';
import { connect } from 'dva';
import { SearchBar, Modal, Flex,Carousel, WingBlank  } from 'antd-mobile';
import Link from 'umi/link';
import router from 'umi/router';
import Styles from './index.less';
import moment from "moment";
moment.locale('zh-cn');

class ChooseDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            doctorData:[
                {
                    id:1,
                    name:'医生一',
                    rank:'副主任医师',
                    office:'内分泌科',
                    headImg:require('../../assets/head.png'),
                    router:'./doctorInfo',
                    date:'星期日',
                    introducer:'内分泌系统疾病治疗，包括各种类型糖尿病，甲状腺疾病，高血压'
                },
                {
                    id:2,
                    name:'医生二',
                    rank:'副主任医师',
                    office:'内分泌科',
                    headImg:require('../../assets/head.png'),
                    router:'./doctorInfo',
                    date:'星期日',
                    introducer:'内分泌系统疾病治疗，包括各种类型糖尿病，甲状腺疾病，高血压，血脂异常疾病治疗，包括各种类型糖尿病，甲状腺疾病，高血压'
                }
                ,
                {
                    id:3,
                    name:'医生三',
                    rank:'副主任医师',
                    office:'内分泌科',
                    headImg:require('../../assets/head.png'),
                    router:'./doctorInfo',
                    date:'星期一',
                    introducer:'内分泌系统疾病治疗，包括各种类型糖尿病，甲状腺疾病，高血压，血脂异常疾病治疗，包括各种类型糖尿病，甲状腺疾病，高血压'
                }
                ,
                {
                    id:4,
                    name:'医生四',
                    rank:'副主任医师',
                    office:'内分泌科',
                    headImg:require('../../assets/head.png'),
                    router:'./doctorInfo',
                    date:'星期一',
                    introducer:'内分泌系统疾病治疗，包括各种类型糖尿病，甲状腺疾病，高血压'
                }
                ,
                {
                    id:5,
                    name:'医生五',
                    rank:'副主任医师',
                    office:'内分泌科',
                    headImg:require('../../assets/head.png'),
                    router:'./doctorInfo',
                    date:'星期二',
                    introducer:'内分泌系统疾病治疗，包括各种类型糖尿病，甲状腺疾病，高血压，血脂异常疾病治疗，包括各种类型糖尿病，甲状腺疾病，高血压'
                }
                ,
                {
                    id:6,
                    name:'医生六',
                    rank:'副主任医师',
                    office:'内分泌科',
                    headImg:require('../../assets/head.png'),
                    router:'./doctorInfo',
                    date:'星期二',
                    introducer:'内分泌系统疾病治疗，包括各种类型糖尿病，甲状腺疾病，高血压，血脂异常疾病治疗，包括各种类型糖尿病，甲状腺疾病，高血压'
                }
            ]

        }
    }
    render() {

        const { doctorData } = this.state;

        return (
            <div className={Styles.choose_doctor}>

                {
                    doctorData.length > 0 ? doctorData.map((item,index)=>{
                        let date = '今日出诊';
                        let isOpen = true;
                        if(moment().format('dddd') != item.date){
                            date = '周' + item.date.substr(-1) + '出诊';
                            isOpen = false;
                        }

                        return(
                            <div className={Styles.doctor_item} key={item.id} onClick={() => router.push(item.router)}>
                                <img className={Styles.doctor_img} src={item.headImg} alt=""/>
                                <div>
                                    <p className={Styles.doctor_info}>
                                        <span className={Styles.doctor_name}>{item.name}</span>
                                        <span className={Styles.doctor_rank}>{item.rank}</span>
                                        <span>{item.office}</span>
                                        <span className={`${Styles.date} ${isOpen ? '':Styles.date_no}`}>{date}</span>
                                    </p>
                                    <div className={Styles.doctor_introducer}>
                                        擅长：{item.introducer}
                                    </div>
                                </div>
                            </div>
                        )
                    }) : ''
                }
            </div>

        )
    }
}


export default ChooseDoctor;
