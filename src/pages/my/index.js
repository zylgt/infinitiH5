import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal,Button } from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';

@connect(({ my }) => ({ my }))
class MyIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCall:false
        }
    }
    componentDidMount() {

    }
    //打开拨打电话窗口
    showModal(e){
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            isCall: true
        });

    }
    //关闭拨打电话窗口
    onClose(){
        this.setState({
            isCall: false
        });
    }

    render() {
        const { isCall } = this.state;
        console.log('isCall',isCall)
        return (
            <div className={Styles.my}>
                <div className={Styles.my_info} >
                    <img src={require('../../assets/my_head.png')} alt=""/>
                    <span>{'131 **** ***3'}</span>
                </div>
                <div className={ `${Styles.my_item} ${Styles.my_item_margin}`} onClick={()=>{router.push('./management')}}>
                    <span>就诊人管理</span>
                    <img src={require('../../assets/my_right.png')} alt=""/>
                </div>
                <div className={Styles.my_item} onClick={(e)=>{this.showModal(e)}}>
                    <span>联系客服</span>
                    <img src={require('../../assets/my_right.png')} alt=""/>
                </div>
                <div className={Styles.my_item} onClick={()=>{router.push('./agreement')}}>
                    <div className={Styles.my_item_border}></div>
                    <span>服务协议</span>
                    <img src={require('../../assets/my_right.png')} alt=""/>
                </div>

                <Modal
                    visible={ isCall }
                    transparent
                    maskClosable={true}
                    closable={true}
                    onClose={()=>{this.onClose()}}
                    title=""
                    className='my_model'
                >
                    <p className='model_title'>客服电话</p>
                    <p className='model_title model_phone'>400-0000-000</p>
                    <Button  className='model_btn'>
                        <a href="tel:13161666403">拨打电话</a>
                    </Button>
                </Modal>

            </div>
        )
    }
}
export default MyIndex;
