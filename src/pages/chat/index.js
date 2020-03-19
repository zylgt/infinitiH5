import React, { Component } from 'react'
import { connect } from 'dva';
import { Popover, Modal, Menu, Toast, ListView, InputItem,Button,TextareaItem} from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import emojione from '../../utils/emojione.min'
import CryptoJS from '../../utils/md5'
import { createForm ,formShape } from 'rc-form';
import Socket from '../../components/webSocket';

@connect(({ class1,chat }) => ({ class1,chat }))
class ClassPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.taskRemindInterval = null;
    }
    componentWillUnmount(){
        this.socket.onclose({
            code:1006,
            msg:'关闭页面'
        })
    }
    componentDidUpdate(){
        this.scrollToBottom();
    }
    //滑动到聊天底部
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "auto" });
    }
    componentDidMount(){
        //    判断专家是否登录
        this.socket = new Socket({
            socketUrl: 'ws://gim.yutanglabs.com/ws',
            timeout: 5000,
            socketMessage: (receive) => {
                console.log('socketMessage',receive);  //后端返回的数据，渲染页面
                const { chat,dispatch } = this.props;

                let newList = chat.list;
                console.log('list',newList)
                let data = JSON.parse(receive.data)
                if(data.email && data.email != ''){
                    newList.push(data)
                    console.log('newList',newList)
                    dispatch({
                        type: 'chat/setData',
                        payload:{
                            list:newList
                        }
                    });

                }

            },
            socketClose: (msg) => {
                console.log('socketClose',msg);//关闭连接
            },
            socketError: () => {
                console.log(this.state.taskStage + '连接建立失败');
            },
            socketOpen: () => {
                console.log('连接建立成功');
                // 心跳机制 定时向后端发数据
                this.taskRemindInterval = setInterval(() => {
                    this.socket.sendMessage({ "msgType": 0 })
                }, 30000)
            }
        });
        // 重试创建socket连接
        try {
            this.socket.connection();
        } catch (e) {
            console.log('socket异常')
            // 捕获异常，防止js error
            // donothing
        }

        this.scrollToBottom();
    }

    //点击提交聊天
    submit = () => {
        const { dispatch,class1,form } = this.props;

        form.validateFields((error, value) => {
            console.log(error, value);

            if(value.word && value.word != ''){
                // console.log('this.socket',this.socket)
                form.resetFields()
                this.socket.sendMessage({
                    "username":class1.name.toString(),
                    "email":class1.key.toString(),
                    "message":value.word.toString()
                })
            }
        });
    }


    render() {
        const { getFieldProps } = this.props.form;
        const { class1,chat } = this.props;

        return (
            <div className={Styles.chat}>
                <div className={Styles.chat_title}>
                    正在与xx聊天
                </div>

                <div className={ `${Styles.chat_list} ` }>
                    {
                        chat.list.length > 0 ? chat.list.map((item,index)=>{
                            return(
                                <li key={index} >
                                    {
                                        item.username != class1.name ? <div className={Styles.list_item_left}>
                                            <div className={Styles.item_img}>{item.username}</div>
                                            <div className={Styles.item_content}>
                                                <span className={Styles.item_icon}></span>
                                                <span>{item.message}</span>
                                            </div>
                                        </div> :  <div className={Styles.list_item_right}>
                                            <div className={Styles.item_content}>
                                                <span className={Styles.item_icon}></span>
                                                <span>{item.message}</span>
                                            </div>
                                            <div className={Styles.item_img}>{item.username}</div>
                                        </div>

                                    }
                                </li>
                            )
                        }):''
                    }

                    <div style={{ float:"left", clear: "both" }}
                         ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </div>

                <div className={Styles.chat_input}>
                    <TextareaItem
                        {...getFieldProps('word')}
                        autoHeight
                        placeholder="请输入咨询内容"
                        className={Styles.input}
                    />
                    <Button type="primary" className={Styles.input_btn} onClick={()=>this.submit()}>发送</Button>
                </div>


            </div>
        )
    }
}


export default createForm()(ClassPage);
