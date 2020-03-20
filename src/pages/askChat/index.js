import React, { Component } from 'react'
import { connect } from 'dva';
import { Popover, Modal, Menu, Toast, ListView, InputItem,Button,TextareaItem} from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import emojione from '../../utils/emojione.min'
import CryptoJS from '../../utils/md5'
import { createForm ,formShape } from 'rc-form';
import Socket from '../../components/webSocket';

class AskChat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowSend:false,
            isShowButtom:false,
            word:''
        }
    }
    componentWillUnmount(){

    }
    componentDidUpdate(){

    }
    //点击加号
    autoWordFocus(){
        this.setState({
            isShowButtom: true,
        });
    }
    //输入框内容变化
    changeWord(val){
        this.setState({
            word: val,
            isShowSend: true
        });
        if(val == ''){
            this.setState({
                isShowSend: false,
            });
        }
    }
    //输入框聚焦
    textareaFocus(){
        this.setState({
            isShowButtom: false,
        });
    }

    render() {
        const { getFieldProps } = this.props.form;
        const { isShowSend,word,isShowButtom } = this.state;

        return (
            <div className={Styles.chat}>

                <div className={ `${Styles.chat_list} ` }>

                    <div className={Styles.list_time}>14:39</div>

                    <div className={Styles.list_item_right}>
                        <div className={Styles.item_content}>
                            <span className={Styles.item_icon}></span>
                            <p className={Styles.item_user}>用户 男 27岁</p>
                            <p>就诊情况：去医院就诊过</p>
                            <p>确诊疾病：糖尿病</p>
                            <p>糖尿病史：1年</p>
                            <p>药物过敏史：无</p>
                            <p>病情描述：去年去年八月确诊二型糖尿病，现在对血糖的监测以及胰岛素用药频率和剂量有一些疑问</p>
                            <p className={Styles.item_bottom}>(含图片信息，医生可见)</p>
                        </div>
                        <img className={Styles.item_img} src={require('../../assets/head.png')} />
                    </div>

                    <div className={Styles.list_hint}>
                        <span className={Styles.hint_words}>问诊已开始，本次问诊时间为15分钟</span>
                        <p className={Styles.hint_line}></p>
                    </div>

                    <div className={Styles.list_start}>
                        <span>问诊已开始，医生将在这15分钟内只为您一人解答问题，建议不要离开对话框，保持实时沟通。医生的回复仅为建议，具体诊疗需要前往医院进行</span>
                    </div>

                    <div className={Styles.list_item_left}>
                        <img className={Styles.item_img} src={require('../../assets/head.png')} />
                        <div className={Styles.item_content}>
                            <span className={Styles.item_icon}></span>
                            <span>问一下现在怎么用药的？血糖多少？血肌酐有变化吗？</span>
                        </div>
                    </div>

                    <div className={Styles.list_time}>14:39</div>

                    <div className={Styles.list_item_right}>
                        <div className={Styles.item_content}>
                            <span className={Styles.item_icon}></span>
                            <span>是的发送地方句句说到附近卡是江东父老了看时间到了附近阿克索德积分卡就是来看风景啊就是风景啊就是地方大家发卡就是到了风景阿斯顿发几阿斯顿减肥了</span>
                        </div>
                        <img className={Styles.item_img} src={require('../../assets/head.png')} />
                    </div>

                    <div className={Styles.list_item_right}>
                        <div className={ `${Styles.item_content} ${Styles.item_content_img}`}>
                            <img src={require('../../assets/home_swipe01.png')} alt=""/>
                        </div>
                        <img className={Styles.item_img} src={require('../../assets/head.png')} />
                    </div>

                    <div className={Styles.list_item_right}>
                        <div className={ `${Styles.item_content} ${Styles.item_content_img}`}>
                            <img src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584617338137&di=c09eadbe5f032bfe209c911c45024398&imgtype=0&src=http%3A%2F%2Fc.hiphotos.baidu.com%2Fexp%2Fw%3D480%2Fsign%3D6daf5df38235e5dd902ca4d746c7a7f5%2Fb03533fa828ba61e8abe758e4634970a304e593a.jpg' alt=""/>
                        </div>
                        <img className={Styles.item_img} src={require('../../assets/head.png')} />
                    </div>

                    <div className={Styles.list_item_right}>
                        <div className={ `${Styles.item_content} ${Styles.item_content_img}`}>
                            <img src={require('../../assets/head.png')} alt=""/>
                        </div>
                        <img className={Styles.item_img} src={require('../../assets/head.png')} />
                    </div>

                    <div className={Styles.list_start}>
                        <span>医生的回复仅为建议，具体诊疗需要前往医院进行</span>
                    </div>

                    <div className={Styles.list_hint}>
                        <span className={Styles.hint_words}>本次问诊已结束</span>
                        <p className={Styles.hint_line}></p>
                    </div>

                </div>

                <div className={Styles.chat_input}>
                    <TextareaItem
                        {...getFieldProps('word',{
                            initialValue:word
                        })}
                        autoHeight
                        placeholder="请输入咨询内容"
                        className={Styles.input}
                        ref={el => this.wordFocus = el}
                        onChange = {(val)=>{this.changeWord(val)}}
                        onFocus={()=>{this.textareaFocus()}}
                    />
                    {
                        isShowSend ? <Button type="primary" className={Styles.input_btn}>发送</Button>
                            :
                        <img onClick={()=>{this.autoWordFocus()}} className={Styles.input_img} src={require('../../assets/ask_add.png')} alt=""/>

                    }
                </div>
                {
                    isShowButtom ? <div className={Styles.chat_buttom}>
                        <div className={Styles.buttom_item}>
                            <img src={require('../../assets/chat_camera.png')} alt=""/>
                            <p>拍摄</p>
                        </div>
                        <div className={Styles.buttom_item}>
                            <img src={require('../../assets/chat_picture.png')} alt=""/>
                            <p>拍摄</p>
                        </div>

                    </div> : ''
                }

            </div>
        )
    }
}


export default createForm()(AskChat);
