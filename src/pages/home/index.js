import React, { Component } from 'react';
import { connect } from 'dva';
import { SearchBar, Modal, Flex,Carousel, WingBlank  } from 'antd-mobile';
import Link from 'umi/link';
import router from 'umi/router';
import Styles from './index.less';
import Swiper from '../../components/swiper'

@connect(({ home }) => ({ home }))
class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            swipeData:[
                {
                    id:'1',
                    imgUrl:require('../../assets/home_swipe01.png'),
                    router:'./ask'
                },
                {
                    id:'2',
                    imgUrl:require('../../assets/home_swipe02.png'),
                    router:'./ask'
                }
            ],
            officeData:[
                {
                    id:1,
                    imgUrl:require('../../assets/office01.png'),
                    title:'糖尿病',
                    router:'./chooseDoctor'
                },
                {
                    id:2,
                    imgUrl:require('../../assets/office02.png'),
                    title:'呼吸科',
                    router:'./chooseDoctor'
                },
                {
                    id:3,
                    imgUrl:require('../../assets/office03.png'),
                    title:'眼科',
                    router:'./chooseDoctor'
                },
                {
                    id:4,
                    imgUrl:require('../../assets/office04.png'),
                    title:'肿瘤科',
                    router:'./chooseDoctor'
                }
            ],
            illnessData:[
                {
                    id:1,
                    title:'糖尿病',
                    router:'./chooseDoctor'
                },
                {
                    id:2,
                    title:'高血压',
                    router:'./chooseDoctor'
                },
                {
                    id:3,
                    title:'腰腿疼',
                    router:'./chooseDoctor'
                },
                {
                    id:4,
                    title:'湿疹',
                    router:'./chooseDoctor'
                },
                {
                    id:5,
                    title:'胃炎',
                    router:'./chooseDoctor'
                },
                {
                    id:6,
                    title:'感冒',
                    router:'./chooseDoctor'
                },
                {
                    id:7,
                    title:'肠胃炎',
                    router:'./chooseDoctor'
                }
            ],
            doctorData:[
                {
                    id:1,
                    name:'医生一',
                    rank:'副主任医师',
                    office:'内分泌科',
                    headImg:require('../../assets/head.png'),
                    router:'./doctorInfo',
                    introducer:'内分泌系统疾病治疗，包括各种类型糖尿病，甲状腺疾病，高血压，血脂异常疾病治疗，包括各种类型糖尿病，甲状腺疾病，高血压'
                },
                {
                    id:2,
                    name:'医生二',
                    rank:'副主任医师',
                    office:'内分泌科',
                    headImg:require('../../assets/head.png'),
                    router:'./doctorInfo',
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
                    introducer:'内分泌系统疾病治疗，包括各种类型糖尿病，甲状腺疾病，高血压，血脂异常疾病治疗，包括各种类型糖尿病，甲状腺疾病，高血压'
                }
            ]

        }
    }
    render() {
        const { home } = this.props;
        const { swipeData,officeData,illnessData,doctorData } = this.state;

        const swiperProps={
            dots:true,
            autoplay:true,
            autoplayInterval:5000,
            infinite:true,
            dotStyle:{width:'6px',height:'6px',background:'rgba(255,255,255,0.5)'},
            dotActiveStyle:{height:'6px',background:'rgba(255,255,255,1)'},
            itemStyle:{width:'100%',height:'2.7rem'},
            itemData:swipeData
        }
        return (
            <div className={Styles.home}>
                <div className={Styles.swiper}>
                    <Swiper {...swiperProps} ></Swiper>
                </div>
                <div className={Styles.title}>选择科室</div>
                <div className={Styles.office} >
                    {
                        officeData.length > 0 ? officeData.map((item,index)=>{
                            return(
                                <div className={Styles.office_item} key={item.id} onClick={() => router.push(item.router)}>
                                    <img className={Styles.item_img} src={item.imgUrl} alt=""/>
                                    <p className={Styles.item_title}>{item.title}</p>
                                </div>
                            )
                        }) : ''
                    }
                </div>
                <div className={Styles.title}>常见疾病</div>
                <div className={Styles.illness} >
                    {
                        illnessData.length > 0 ? illnessData.map((item,index)=>{
                            return(
                                <div className={Styles.illness_title} key={item.id} onClick={() => router.push(item.router)}>
                                    {item.title}
                                </div>
                            )
                        }) : ''
                    }
                </div>
                <div className={Styles.title}>今日出诊医生</div>
                <div className={Styles.doctor} >
                    {
                        doctorData.length > 0 ? doctorData.map((item,index)=>{
                            return(
                                <div className={Styles.doctor_item} key={item.id} onClick={() => router.push(item.router)}>
                                    <img className={Styles.doctor_img} src={item.headImg} alt=""/>
                                    <div>
                                        <p className={Styles.doctor_info}>
                                            <span className={Styles.doctor_name}>{item.name}</span>
                                            <span className={Styles.doctor_rank}>{item.rank}</span>
                                            <span>{item.office}</span>
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

            </div>
        )
    }
}


export default Home;
