import React, { Component } from 'react';
import Styles from './index.less';
import router from 'umi/router';

class Back extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {

    }
    //返回
    back(){
        // console.log('window',window.location.pathname)
        if(window.location.pathname === '/home' || window.location.pathname === '/q4/home'){
            router.push('./welcome')
            return
        }
        if(window.location.pathname.indexOf('upload') > -1 ){
            this.props.backCallback && this.props.backCallback()
        }
        router.go(-1);
    }

    render() {
        return (
            <div className={Styles.back} onClick={() => {
                this.back()
            }}>
                <img src={require('../../assets/back.png')} alt=""/>
                返回
            </div>
        )
    }
}


export default Back;
