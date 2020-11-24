import React, { Component } from 'react';
import Styles from './index.less';
import {connect} from "react-redux";

@connect(({ layout }) => ({ layout }))
class Cropper extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {


    }

    render() {
        return (
            <div className={Styles.music} >

            </div>
        )
    }
}


export default Cropper;
