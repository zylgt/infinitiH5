import React, { Component } from 'react';
import Styles from './index.less';
import { Button, WhiteSpace, WingBlank } from 'antd-mobile';

class HomeButton extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return (
            <div className={Styles.button}>
                <img className={Styles.button_img} src={require('../../assets/home_left_btn.png')} alt=""/>
                <span className={Styles.button_word} >{this.props.title}</span>
            </div>
        )
    }
}


export default HomeButton;
