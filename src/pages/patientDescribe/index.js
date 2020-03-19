import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal,TextareaItem,Button } from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import { createForm } from 'rc-form';

class PatientDescribe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientImg:[]
        }
    }
    componentDidMount() {

    }

    render() {
        const { getFieldProps } = this.props.form;
        const { patientImg } = this.state;
        return (
            <div className={Styles.patient}>
                <p className={Styles.patient_title}>请描述您的病情<span>*</span></p>
                <TextareaItem
                    {...getFieldProps('count')}
                    rows={5}
                    count={600}
                    placeholder="请详细描述您的病情症状、曾做过的检查、用药情况、目前病情是加重还是环节，想获得医生什么帮助…"
                    className={Styles.patient_textarea}
                />
                <p className={`${Styles.patient_title} ${Styles.patient_title1}`}>上传检查报告或患处照片</p>
                <p className={Styles.patient_second_title}>照片仅自己和医生可见，最多可上传8张</p>
                <div className={Styles.patient_img}>
                    <div className={Styles.patient_camera}>
                        <img src={require('../../assets/patient_camera.png')} alt=""/>
                        <img className={Styles.camera_delete} src={require('../../assets/patient_delete.png')} alt=""/>
                    </div>
                    <div className={Styles.patient_camera}>
                        <img src={require('../../assets/patient_camera.png')} alt=""/>
                        <img className={Styles.camera_delete} src={require('../../assets/patient_delete.png')} alt=""/>
                    </div>
                    <div className={Styles.patient_camera}>
                        <img src={require('../../assets/patient_camera.png')} alt=""/>
                        <p className={Styles.camera_title}>添加照片</p>
                    </div>
                </div>
                <div className={Styles.apply_btn}>
                    <Button className={Styles.btn} >下一步</Button>
                </div>
            </div>
        )
    }
}
export default createForm()(PatientDescribe);
