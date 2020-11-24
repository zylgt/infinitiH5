import React, { Component } from 'react';
import Styles from './index.less';
import { isIOS} from '../../utils/tools'
import { Button, WhiteSpace, WingBlank } from 'antd-mobile';

class WelcomeButton extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return (
            <div className={Styles.button}>
                <img className={Styles.button_img} src={require('../../assets/welcome_button_null.png')} alt=""/>
                <Button className={`${Styles.button_word}`} inline size="small" >{this.props.title}</Button>
            </div>
        )
    }
}


export default WelcomeButton;
