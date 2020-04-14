import React, { Component } from 'react'
import { connect } from 'dva';
import { Progress,Button,Toast } from 'antd-mobile';
import router from 'umi/router';
import { createForm } from 'rc-form';
import Styles from './index.less';
import { illDate } from '../../utils/illDate'
import { getQueryString } from '../../utils/tools'

import { nonceStr } from '../../utils/tools'
import DocumentTitle from 'react-document-title'
import wx from 'weixin-js-sdk';
import { pageURL } from '../../utils/baseURL'


@connect(({ applyList,management }) => ({ applyList,management }))
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

        //获取疾病数据
        dispatch({
            type:'applyList/setData',
            payload:{
                illData: illDate.ill2
            }
        })

        //监听路由变化
        this.props.history.listen((history) => {
            if( history.pathname == '/applyList' ){
                let step =  parseInt( history.query.step ) ;
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
        // dispatch({
        //     type:'patientDescribe/getAppid',
        //     payload:{
        //         noncestr: nonceStr,
        //         timestamp: timestamp,
        //         url: pageURL + '/applyList'
        //     },
        //     callback: this.getAppidCallback.bind(this)
        // })
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
        let answer = e.target.getAttribute('data-answer') || '';
        let showNext = e.target.getAttribute('data-shownext') || '';
        let index =  e.target.getAttribute('data-index') || '';
        index = parseInt(index);
        console.log('answer',answer)
        console.log('showNext',showNext)
        console.log('index',index )


        if(illData[step-1].content[index].answerMore){
            let i = illData[step-1].content[index].chooseAnswer.indexOf(answer)
            if( i >= 0){
                illData[step-1].content[index].chooseAnswer.splice(i,1)
            }else{
                illData[step-1].content[index].chooseAnswer.push(answer)
            }
        }else{
            illData[step-1].content[index].chooseAnswer = [ answer ]
        }


        if(showNext == 'true'){
            if(illData[step-1].content[index + 1]){
                illData[step-1].content[index + 1].isShow = true
            }
        }else{
            if(illData[step-1].content[index + 1]){
                illData[step-1].content[index + 1].isShow = false
            }
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
    nextStep(){
        let { illData, step } = this.props.applyList;
        const { dispatch } = this.props;
        const { uid } = this.props.management;

        let item = illData[step-1].content;

        for(let i = 0; i < item.length; i++){
            if( item[i].isShow && item[i].chooseAnswer.length <= 0 ){
                if(i == 0){
                    Toast.info('请选择答案',1.5)
                }else{
                    if(illData[step-1].key == 'operation'){
                        Toast.info('请选择手术部位',1.5)
                    }else if(illData[step-1].key == 'allergy'){
                        Toast.info('请选择过敏源',1.5)
                    }else{
                        Toast.info('请选择疾病',1.5)
                    }
                }
                return
            }
        }

        step++;

        if(step > illData.length ){
            let payload= {}
            payload.patient_id = uid;
            for(let i = 0; i < illData.length ; i++){
                let content = illData[i].content;
                let key = illData[i].key;
                if(content.length == 1){
                    if(content[0].answerMore){
                        payload[key] = content[0].chooseAnswer
                    }else{
                        payload[key] = content[0].chooseAnswer[0]
                    }
                }else{
                    if(content[0].chooseAnswer[0] == '无'){
                        payload[key] = []
                    }else{
                        payload[key] = content[1].chooseAnswer
                    }
                }
            }
            console.log('payload',payload)
            dispatch({
                type:'applyList/setPatientInfo',
                payload:{ ...payload }
            })

            return
        }

        router.push('./applyList?step=' + step )

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
        const that = this;
        //百分比
        let percentage = ( (step - 1) / illData.length  * 100 ).toFixed(0);
        let btnTitle = '下一步';

        if(step == illData.length){
            btnTitle = '保存'
        }

        return (
            <DocumentTitle title='完善信息'>
                {
                    illData && illData.length > 0 ?
                        <div className={Styles.apply_list}>
                            <div className={Styles.apply_percent}>
                                <p className={Styles.apply_rate}>已填写{ percentage }%</p>
                                <Progress  className={Styles.percent} percent={ percentage } />
                            </div>
                            <div className={Styles.apply_choose}>
                                {
                                    illData[step-1].content.map((item, index)=>{
                                        if(!item.isShow){
                                            return
                                        }
                                        return (
                                            <div className={Styles.choose_contetn} key={index}>
                                                <p className={Styles.choose_title}>{ item.title }</p>
                                                {
                                                    item.answer.map((answerItem, answerIndex)=>{
                                                        let isChoose = false;
                                                        return(
                                                            item.chooseAnswer.length > 0 ? item.chooseAnswer.map((chooseItem, chooseIndex)=>{
                                                                    if(answerItem.key == chooseItem){
                                                                        isChoose = true
                                                                        return(
                                                                            <div key={answerIndex}
                                                                                 className={`${Styles.choose_dot} ${Styles.choose_dot_select} ${answerItem.title.length > 10 ? Styles.choose_dot_line : ''}`}
                                                                                 data-answer={answerItem.key}
                                                                                 data-shownext={answerItem.showNext}
                                                                                 data-index={ index }
                                                                                 onClick={(e)=>{that.chooseAnswer(e)}}
                                                                            >
                                                                                {answerItem.title}
                                                                                <img className={Styles.item_select} src={require('../../assets/time_select.png')} alt=""/>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    if(item.chooseAnswer.length - 1 == chooseIndex && answerItem.title != chooseItem && !isChoose){
                                                                        return(
                                                                            <div key={answerIndex}
                                                                                 className={`${Styles.choose_dot} ${answerItem.title.length > 10 ? Styles.choose_dot_line : ''}`}
                                                                                 data-answer={answerItem.key}
                                                                                 data-shownext={answerItem.showNext}
                                                                                 data-index={ index }
                                                                                 onClick={(e)=>{that.chooseAnswer(e)}}
                                                                            >{answerItem.title}</div>
                                                                        )
                                                                    }
                                                                })
                                                                :
                                                                <div key={answerIndex}
                                                                     className={`${Styles.choose_dot} ${answerItem.title.length > 10 ? Styles.choose_dot_line : ''}`}
                                                                     data-answer={answerItem.key}
                                                                     data-shownext={answerItem.showNext}
                                                                     data-index={ index }
                                                                     onClick={(e)=>{that.chooseAnswer(e)}}
                                                                >{answerItem.title}</div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className={Styles.apply_btn}>
                                <Button className={Styles.btn} onClick={()=>{this.nextStep()}} >{ btnTitle }</Button>
                            </div>
                        </div>
                        : ''
                }

            </DocumentTitle>

        )
    }
}
export default createForm()(ApplyList);
