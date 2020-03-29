import React, { Component } from 'react'
import { connect } from 'dva';
import { Progress,Button,TextareaItem } from 'antd-mobile';
import router from 'umi/router';
import { createForm } from 'rc-form';
import Styles from './index.less';
import { illDate } from '../../utils/illDate'
import { getQueryString } from '../../utils/tools'

import { nonceStr } from '../../utils/tools'
import DocumentTitle from 'react-document-title'
import wx from 'weixin-js-sdk';
import { pageURL } from '../../utils/baseURL'


@connect(({ applyList }) => ({ applyList }))
class ApplyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step:1,
            timestamp:''
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        const { illData } = this.props.applyList;
        //如果没有值就跳回第一步
        if(illData.length == 0){
            router.push('./applyList?step=1')
        }
        let step = getQueryString('step') || '';
        //如果没有参数就跳回第一步
        if(step == ''){
            router.push('./applyList?step=1')
        }
        console.log('step', step)

        dispatch({
            type:'applyList/setData',
            payload:{
                illData: illDate.ill1
            }
        })

        //监听路由变化
        this.props.history.listen((history) => {
            if( history.pathname == '/applyList' ){
                let step =  parseInt( history.query.step ) ;
                // this.setState({
                //     step: step
                // })

                dispatch({
                    type:'applyList/setData',
                    payload:{
                        step: step
                    }
                })
            }
        })

        //生成签名时间戳
        let timestamp = (Date.parse(new Date()) / 1000).toString();
        this.setState({
            timestamp:timestamp,
        })
        //获取appid和签名
        dispatch({
            type:'patientDescribe/getAppid',
            payload:{
                noncestr: nonceStr,
                timestamp: timestamp,
                url: pageURL + '/applyList'
            },
            callback: this.getAppidCallback.bind(this)
        })
    }
    //获取appidcallback
    getAppidCallback(response){
        const { timestamp } = this.state;
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.data.data.app_id, // 必填，公众号的唯一标识
            timestamp: timestamp , // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: response.data.data.signature,// 必填，签名
            jsApiList: ['chooseImage','uploadImage','hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表
        });
        wx.ready(function(){
            wx.hideAllNonBaseMenuItem();
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
    }
    //选择答案
    chooseAnswer(e){
        const { illData, step } = this.props.applyList;
        const { dispatch } = this.props;
        // const { step } = this.state;
        let answer = e.target.getAttribute('data-answer');
        let showInput = e.target.getAttribute('data-showinput');
        console.log('answer',answer)
        console.log('showInput',showInput)

        illData[step-1].choose = answer;

        if( showInput == 'true' ){
            illData[step-1].isShowInput = true
        }else{
            illData[step-1].isShowInput = false
        }

        console.log('illData',illData)
        dispatch({
            type:'applyList/setData',
            payload:{
                illData: illData
            }
        })
    }
    //输入框填写
    onChangeInput(val){
        console.log('val',val)
        const { illData, step } = this.props.applyList;
        const { dispatch } = this.props;

        illData[step-1].inputValue = val;

        dispatch({
            type:'applyList/setData',
            payload:{
                illData: illData
            }
        })
    }
    //下一步
    step(){
        let { illData, step } = this.props.applyList;
        const { dispatch } = this.props;
        // let step = this.state.step;
        step++;

        if(step > illData.length ){
            router.push('./patientDescribe')
            return
        }

        router.push('./applyList?step=' + step )
        // this.setState({
        //     step:step
        // })
        dispatch({
            type:'applyList/setData',
            payload:{
                step: step
            }
        })

    }


    render() {
        // const { step } = this.state;
        const { getFieldProps } = this.props.form;
        const { illData, step } = this.props.applyList;

        //百分比
        let percentage = ( step / illData.length * 100 ).toFixed(1);

        return (
            <DocumentTitle title='问诊申请'>
                <div className={Styles.apply_list}>
                    {
                        illData && illData.length > 0 ? <div>
                            <div className={Styles.apply_percent}>
                                <p className={Styles.apply_rate}>已填写{ percentage }%</p>
                                <Progress  className={Styles.percent} percent={ percentage } />
                            </div>
                            <div className={Styles.apply_choose}>
                                <p className={Styles.choose_title}>{ illData[step-1].question }</p>
                                <div className={Styles.choose_contetn}>
                                    {
                                        illData[step-1].answer.map((item,index)=>{
                                            if(item.name == illData[step-1].choose){
                                                return(
                                                    <div key={index}
                                                         className={`${Styles.choose_dot} ${Styles.choose_dot_select}`}
                                                         data-answer={item.name}
                                                         data-showinput={item.showInput}
                                                         onClick={(e)=>{this.chooseAnswer(e)}}
                                                    >
                                                        {item.title}
                                                        <img className={Styles.item_select} src={require('../../assets/time_select.png')} alt=""/>
                                                    </div>
                                                )
                                            }else{
                                                return(
                                                    <div key={index}
                                                         className={Styles.choose_dot}
                                                         data-answer={item.name}
                                                         data-showinput={item.showInput}
                                                         onClick={(e)=>{this.chooseAnswer(e)}}
                                                    >{item.title}</div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                                {
                                    illData[step-1].isInput && illData[step-1].isShowInput ? <div>
                                        <p className={Styles.choose_title}>{ illData[step-1].title }</p>
                                        <TextareaItem
                                            {...getFieldProps(`${illData[step-1].key}`,{
                                                initialValue: illData[step-1].inputValue
                                            })}
                                            autoHeight
                                            placeholder={ illData[step-1].title }
                                            className={Styles.choose_input}
                                            onChange={(val)=>{this.onChangeInput(val)}}
                                        />
                                    </div>: ''
                                }

                            </div>
                            <div className={Styles.apply_btn}>
                                {
                                    illData[step-1].choose && !illData[step-1].isInput
                                    ||
                                    illData[step-1].choose && illData[step-1].isInput && !illData[step-1].isShowInput
                                    ||
                                    illData[step-1].choose && illData[step-1].isInput && illData[step-1].isShowInput && illData[step-1].inputValue
                                        ?
                                        <Button className={Styles.btn} onClick={()=>{this.step()}} >下一步</Button>
                                        :
                                        <Button className={Styles.btn_disabled} >下一步</Button>
                                }
                            </div>
                        </div> : ''
                    }
                </div>
            </DocumentTitle>

        )
    }
}
export default createForm()(ApplyList);
