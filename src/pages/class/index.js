import React, { Component } from 'react'
import { connect } from 'dva';
import { SearchBar, Modal, Menu, Toast, List, InputItem,Button,WhiteSpace} from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import emojione from '../../utils/emojione.min'
import CryptoJS from '../../utils/md5'
import { createForm ,formShape } from 'rc-form';

@connect(({ class1 }) => ({ class1 }))
class ClassPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {

    }
    submit = () => {
        const { dispatch } = this.props;
        this.props.form.validateFields((error, value) => {
            console.log(error, value);
            if(value.key && value.name){
                dispatch({
                    type: 'class1/setData',
                    payload: {
                        key: value.key,
                        name: value.name
                    }
                })

                router.push('/chat')
            }
        });
    }


    render() {
        const { getFieldProps } = this.props.form;
        // const { dispatch } = this.props;

        console.log('props', this.props)

        return (
            <div className={Styles.class}>

                <List renderHeader={() => '通过key连接'}>
                    <InputItem
                        {...getFieldProps('key')}
                        clear
                        placeholder="请输入key"
                    >key</InputItem>
                </List>
                <List renderHeader={() => '展示的名字'}>
                    <InputItem
                        {...getFieldProps('name')}
                        clear
                        placeholder="请输入姓名"
                    >姓名</InputItem>
                </List>

                <Button type="primary" className={Styles.class_btn} onClick={()=>this.submit()}>开始咨询</Button><WhiteSpace />

            </div>
        )
    }
}


export default createForm()(ClassPage);
