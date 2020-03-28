import React, { Component } from 'react';
import { connect } from 'dva';
import { SearchBar, Modal, Flex,Carousel, WingBlank ,Toast } from 'antd-mobile';
import Link from 'umi/link';
import router from 'umi/router';
import Styles from './index.less';
import { getQueryString } from '../../utils/tools'
import { staticURL } from '../../utils/baseURL'
import moment from "moment";
moment.locale('zh-cn');

@connect(({ chooseDoctor }) => ({ chooseDoctor }))
class ChooseDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this._onScrollEvent = this._onScrollEvent.bind(this);  //保证被组件调用时，对象的唯一性

    }
    componentDidMount(){
        const { dispatch } = this.props;
        const { offset } = this.props.chooseDoctor;
        let type = getQueryString('type') || '';
        let id = getQueryString('id') || '';

        console.log('type',type)
        console.log('id',id)
        dispatch({
            type: 'chooseDoctor/getDoctor',
            payload:{
                type: parseInt(type),
                search_id: id,
                offset: offset,
                limit: 20
            }
        });
    }
    //滚动事件
    _onScrollEvent() {
        const { dispatch } = this.props;
        const { offset } = this.props.chooseDoctor;
        let scrollTop = this._container.scrollTop;
        let scrollHeight = this._container.scrollHeight;
        let clientHeight = this._container.clientHeight;
        let type = getQueryString('type') || '';
        let id = getQueryString('id') || '';
        if( scrollTop == 0 || scrollTop % 2 != 0 ){
            return
        }
        if ( scrollHeight - scrollTop - clientHeight < 100 && this.state.isScroll ) {
            console.log('chooseDoctor滑到底了')
            this.setState({
                isScroll:false
            })
            dispatch({
                type: 'chooseDoctor/getDoctor',
                payload:{
                    type: parseInt(type),
                    search_id: id,
                    offset: offset,
                    limit: 20
                }
            });
        }else{
            if(scrollHeight - scrollTop - clientHeight > 100){
                this.setState({
                    isScroll:true
                })
            }
        }
    }
    //点击进入出诊医生
    clickDoctor(e){
        let doctorId = e.currentTarget.getAttribute('data-id');
        // console.log('officeId',doctorId)
        router.push('./doctorInfo?id=' + doctorId )
    }


    render() {
        const { doctorData } = this.props.chooseDoctor;

        return (
            <div className={Styles.choose_doctor} ref={e => this._container = e} onScrollCapture={() => this._onScrollEvent()} >

                {
                    doctorData.length > 0 ? doctorData.map((item,index)=>{
                        let date = '今日出诊';
                        let isOpen = true;
                        if(moment().format('d') != item.week){
                            let weeks = new Array("日", "一", "二", "三", "四", "五", "六");
                            date = '周' + weeks[ item.week ] + '出诊';
                            isOpen = false;
                        }

                        return(
                            <div className={Styles.doctor_item} key={item.uid} data-id={item.uid} onClick={(e) => { this.clickDoctor(e)}}>
                                <img className={Styles.doctor_img} src={ staticURL + item.icon } alt=""/>
                                <div>
                                    <p className={Styles.doctor_info}>
                                        <span className={Styles.doctor_name}>{item.name}</span>
                                        <span className={Styles.doctor_rank}>{item.title}</span>
                                        <span>{item.dept}</span>
                                        <span className={`${Styles.date} ${isOpen ? '':Styles.date_no}`}>{date}</span>
                                    </p>
                                    <div className={Styles.doctor_introducer}>
                                        擅长：{item.skill}
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
