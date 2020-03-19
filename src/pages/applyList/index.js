import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal,Progress,Button,TextareaItem } from 'antd-mobile';
import router from 'umi/router';
import { createForm } from 'rc-form';
import Styles from './index.less';

class ApplyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            percent: 50,
            rate:20,
            illDate:[
                {time:'一周内'},
                {time:'一个月内'},
                {time:'半年内'},
                {time:'一年内'},
            ],
            selectIllTime:''
        }
    }
    componentDidMount() {

    }
    //选择患病多久
    chooseTime(e){
        let time = e.target.getAttribute('data-time');
        this.setState({
            selectIllTime: time
        });
    }

    render() {
        const { percent,rate,illDate,selectIllTime } = this.state;
        const { getFieldProps } = this.props.form;


        return (
            <div className={Styles.apply_list}>
                <div className={Styles.apply_percent}>
                    <p className={Styles.apply_rate}>已填写{rate}%</p>
                    <Progress  className={Styles.percent} percent={percent} />
                </div>
                <div className={Styles.apply_choose}>
                    <p className={Styles.choose_title}>本次患病多久了？</p>
                    <div className={Styles.choose_contetn}>
                        {
                            illDate.map((item,index)=>{
                                if(selectIllTime !='' && selectIllTime == item.time){
                                    return(
                                        <div key={index} className={`${Styles.choose_dot} ${Styles.choose_dot_select}`} data-time={item.time} onClick={(e)=>{this.chooseTime(e)}}>
                                            {item.time}
                                            <img className={Styles.item_select} src={require('../../assets/time_select.png')} alt=""/>
                                        </div>
                                    )
                                }else{
                                    return(
                                        <div key={index} className={Styles.choose_dot} data-time={item.time} onClick={(e)=>{this.chooseTime(e)}}>{item.time}</div>
                                    )
                                }
                            })
                        }
                    </div>
                    <p className={Styles.choose_title}>就诊医院医生诊断的疾病名称</p>
                    <TextareaItem
                        {...getFieldProps('note')}
                        rows={3}
                        placeholder="请输入医生诊断的疾病名称"
                        className={Styles.choose_input}
                    />
                </div>
                <div className={Styles.apply_btn}>
                    <Button className={Styles.btn} >下一步</Button>
                </div>
            </div>
        )
    }
}
export default createForm()(ApplyList);
