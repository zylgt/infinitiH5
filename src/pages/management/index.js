import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal,InputItem,Button,Toast } from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import { createForm } from 'rc-form';
import { getQueryString } from '../../utils/tools'
import moment from "moment";
moment.locale('zh-cn');

@connect(({ management }) => ({ management }))
class Management extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameError:false,
            idNumError:false,
            type:'',
            submitButton:'',
            disabled:false,
            doctor_id:''
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        let type = getQueryString('type') || '';
        console.log('type',type)
        this.setState({
            type: type
        })
        if(type == 'add'){
            this.setState({
                submitButton: '保存'
            })
        }else{
            let id = getQueryString('id') || '';
            this.setState({
                submitButton: '下一步',
                disabled:true,
                doctor_id:id
            })
        }
    }
    //focus事件
    inputFocus(type){
        if(type == 'name'){
            this.setState({
                nameError: false
            })
        }
        if(type == 'card_id'){
            this.setState({
                idNumError: false
            })
        }
    }
    //输入姓名
    inputName(val){
        const { dispatch } = this.props;
        dispatch({
            type:'management/setData',
            payload:{
                name:val
            }
        })
    }
    //输入姓名
    inputIdNum(val){
        const { dispatch } = this.props;
        dispatch({
            type:'management/setData',
            payload:{
                card_id: val
            }
        })
    }
    // 保存
    submit(){
        const { name,card_id } = this.props.management;
        const { dispatch } = this.props;
        const { type } = this.state;
        const Reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        if(name == ''){
             return false
        }
        //判断是否大于18周岁
        let year = card_id.toString().substring(6,14);
        let nowYear = moment().format('YYYYMMDD')

        if( parseInt(nowYear) - parseInt(year) < 180000 ){
            Toast.info('暂不支持未成年问诊',1.5)
            return false
        }

        //判断身份证号
        if(!Reg.test(card_id)){
            this.setState({
                idNumError:true
            })
            return false;
        }

        if(type == 'add'){
            dispatch({
                type:'management/savePatient',
                payload:{
                    name: name,
                    card_id: card_id
                },
                callback: this.submitCallback.bind(this)
            })
        }else{
            router.push('./chooseTime?id='+this.state.doctor_id)
        }

    }
    //submitCallback
    submitCallback(response){
        console.log('submitCallback',response)
        if(response && response.data.code == 200){
            Toast.info('保存成功',1.5)
            let source = getQueryString('source') || '';
            if(!source){
                setTimeout(function () {
                    router.goBack()
                },1000)
            }
        }else if(response && response.data.code == 412){
            Toast.info('就诊人已存在',1.5)
        }else if(response && response.data.code == 411){
            Toast.info('操作失败',1.5)
        }else if(response && response.data.code == 416){
            Toast.info('暂不支持未成年问诊',1.5)
        }else if(response && response.data.code == 403){
            Toast.info('身份证信息有误',1.5)
            this.setState({
                idNumError:true
            })
        }
    }

    render() {
        const { getFieldProps } = this.props.form;
        const { nameError, idNumError,submitButton,disabled } = this.state;
        const { name,card_id } = this.props.management;
        return (
            <div className={Styles.management}>
                <div className={Styles.management_name}>
                    <InputItem
                        clear
                        placeholder="请输入真实姓名"
                        ref={el => this.autoFocusInst = el}
                        value={name}
                        onChange={(val)=>{this.inputName(val)}}
                        onFocus={()=>{this.inputFocus('name')}}
                        disabled={disabled}
                    >姓名</InputItem>
                </div>
                {
                    nameError ? <div className={Styles.error}>请输入身份证信息上的真实姓名</div> : ''
                }
                <div className={Styles.management_card}>
                    <InputItem
                        clear
                        placeholder="请输入准确的身份证号码"
                        ref={el => this.autoFocusInst = el}
                        value={card_id}
                        maxLength={18}
                        onChange={(val)=>{this.inputIdNum(val)}}
                        onFocus={()=>{this.inputFocus('card_id')}}
                        disabled={disabled}
                    >身份证号</InputItem>
                </div>
                {
                    idNumError ? <div className={Styles.error}>身份证号码有误，请核对后重新输入</div> : ''
                }
                {
                    name != '' && card_id != ''
                        ?
                        <Button className={Styles.management_btn}  onClick={ ()=>{this.submit()} } >{submitButton}</Button>
                        :
                        <Button className={Styles.management_btn_disabled} >{submitButton}</Button>
                }

            </div>

        )
    }
}
export default createForm()(Management);
