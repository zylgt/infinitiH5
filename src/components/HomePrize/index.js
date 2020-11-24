import React, { Component } from 'react';
import Styles from './index.less';
import {connect} from 'dva';
import { Modal } from 'antd-mobile';

@connect(({ home, layout }) => ({ home, layout }))
class homePrize extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isBottom: false
        }
    }
    componentDidMount() {

    }
    //关闭弹窗
    close(){
        this.props.closeWindow()
    }

    render() {
        const { imgArray, isBottom } = this.state;
        const { homePrize } = this.props;
        const { winList } = this.props.home;
        return (
            <div className={Styles.home_prize}>
                <Modal
                    visible={true}
                    transparent
                    maskClosable={false}
                >

                    <div className={Styles.hp_con}>
                        <img className={Styles.con_close} src={require('../../assets/welcome_closeicon.png')} alt="" onClick={() => {
                            this.close()
                        }}/>
                        <div className={Styles.con_img}>
                            {
                                homePrize === 2 ?
                                    <img src={ winList } alt=""/>
                                    :
                                    <img src={ require('../../assets/home_rule.jpg')} alt=""/>
                            }
                        </div>
                        <img className={Styles.con_img_down} src={require('../../assets/down_arrow.gif')} alt=""/>

                    </div>

                </Modal>
            </div>
        )
    }
}


export default homePrize;
