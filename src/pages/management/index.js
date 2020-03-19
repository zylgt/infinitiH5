import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal,InputItem,Button } from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import { createForm } from 'rc-form';

class Management extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        const { dispatch } = this.props;

    }

    render() {
        const { getFieldProps } = this.props.form;
        return (
            <div className={Styles.management}>
                <div className={Styles.management_name}>
                    <InputItem
                        {...getFieldProps('name')}
                        clear
                        placeholder="请输入真实姓名"
                        ref={el => this.autoFocusInst = el}
                    >姓名</InputItem>
                </div>
                <div className={Styles.error}>请输入身份证信息上的真实姓名</div>
                <div className={Styles.management_card}>
                    <InputItem
                        {...getFieldProps('id_card')}
                        clear
                        placeholder="请输入准确的身份证号码"
                        ref={el => this.autoFocusInst = el}
                    >身份证号</InputItem>
                </div>
                <div className={Styles.error}>身份证号码有误，请核对后重新输入</div>
                <Button className={Styles.management_btn} >登录</Button>
            </div>

        )
    }
}
export default createForm()(Management);
