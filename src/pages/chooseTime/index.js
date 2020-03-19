import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal,Button } from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';

class ChooseTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeData: {
                noon: [ //上午
                    {
                        "time": "08:30~09:00", //时间段
                        "full": 1,  //0:可约 1:约满
                    },
                    {
                        "time": "09:00~09:30", //时间段
                        "full": 0,  //0:可约 1:约满
                    },
                    {
                        "time": "09:30~10:00", //时间段
                        "full": 1,  //0:可约 1:约满
                    },
                    {
                        "time": "10:00~10:30", //时间段
                        "full": 0,  //0:可约 1:约满
                    }
                ],
                afternoon: [ //下午
                    {
                        "time": "14:00~14:30", //时间段
                        "full": 1,  //0:可约 1:约满
                    },
                    {
                        "time": "14:30~15:00", //时间段
                        "full": 0,  //0:可约 1:约满
                    },
                    {
                        "time": "15:00~15:30", //时间段
                        "full": 0,  //0:可约 1:约满
                    },
                    {
                        "time": "15:30~16:00", //时间段
                        "full": 0,  //0:可约 1:约满
                    }
                ],
            },
            selectTime:{}
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;

    }
    //点击时间段选择
    chooseTime (e){
        let time = e.target.getAttribute('data-time');
        let key = e.target.getAttribute('data-key');
        this.setState({
            selectTime: {
                key,
                time
            }
        });
    }
    render() {
        const{ timeData,selectTime } = this.state;

        return (
            <div className={Styles.time}>
                <img className={Styles.time_bgc} src={require('../../assets/time_bgc.png')} alt=""/>
                <div className={Styles.time_info} >
                    <img className={Styles.info_img} src={require('../../assets/head.png')} alt=""/>
                    <div>
                        <p className={Styles.info_name}>陈莉明</p>
                        <p className={Styles.info_office}>副主任医师｜内分泌科</p>
                    </div>
                </div>
                <div className={Styles.time_content}>
                    {
                        timeData.noon.length > 0 ?
                            <div className={Styles.choose_time}>
                                <p className={Styles.choose_title}>上午</p>
                                <div className={Styles.choose_contetn}>
                                    {
                                        timeData.noon.map((item,index)=>{
                                            if(item.full){
                                                return(
                                                    <div key={index} className={ `${Styles.choose_dot} ${Styles.choose_dot_full}` }>{item.time} 约满</div>
                                                )
                                            }else{
                                                if(selectTime.time && selectTime.time == item.time){
                                                    return(
                                                        <div key={index} className={`${Styles.choose_dot} ${Styles.choose_dot_select}`} data-key='noon' data-time={item.time} onClick={(e)=>{this.chooseTime(e)}}>
                                                            {item.time}
                                                            <img className={Styles.item_select} src={require('../../assets/time_select.png')} alt=""/>
                                                        </div>
                                                    )
                                                }else{
                                                    return(
                                                        <div key={index} className={Styles.choose_dot} data-key='noon' data-time={item.time} onClick={(e)=>{this.chooseTime(e)}}>{item.time}</div>
                                                    )
                                                }
                                            }
                                        })
                                    }
                                </div>
                            </div>
                            :''
                    }
                    {
                        timeData.afternoon.length > 0 ?
                            <div className={Styles.choose_time}>
                                <p className={Styles.choose_title}>上午</p>
                                <div className={Styles.choose_contetn}>
                                    {
                                        timeData.afternoon.map((item,index)=>{
                                            if(item.full){
                                                return(
                                                    <div key={index} className={ `${Styles.choose_dot} ${Styles.choose_dot_full}` }>{item.time} 约满</div>
                                                )
                                            }else{
                                                if(selectTime.time && selectTime.time == item.time){
                                                    return(
                                                        <div key={index} className={`${Styles.choose_dot} ${Styles.choose_dot_select}`} data-key='noon' data-time={item.time} onClick={(e)=>{this.chooseTime(e)}}>
                                                            {item.time}
                                                            <img className={Styles.item_select} src={require('../../assets/time_select.png')} alt=""/>
                                                        </div>
                                                    )
                                                }else{
                                                    return(
                                                        <div key={index} className={Styles.choose_dot} data-key='noon' data-time={item.time} onClick={(e)=>{this.chooseTime(e)}}>{item.time}</div>
                                                    )
                                                }
                                            }
                                        })
                                    }
                                </div>
                            </div>
                            :''
                    }


                </div>
                <Button className={Styles.time_btn} >预约</Button>
            </div>
        )
    }
}
export default ChooseTime;
