import React, {Component, useState} from 'react';
import { Upload } from 'antd';
// import ImgCrop from 'antd-img-crop';
import {connect} from "umi";
import ImgCrop from "../../components/Upload";
import Styles from './index.less';

class UploadImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList:[
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                },
            ]
        }
    }
    componentDidMount() {

    }


    render(){

        const ImgCropProps = {
            modalOk:'确定',
            modalWidth:'7.5rem',
            rotate: true,
            quality:0.2,
            cropBgimg: require('../../assets/upload_crop.png'),

        }

        return (
            <ImgCrop{...ImgCropProps} >
                <Upload
                    action=""
                    listType="picture-card"
                    className={Styles.upload}
                >
                    <div>
                        上传图片 +
                    </div>
                    <div>（建议9MB内）</div>
                </Upload>
            </ImgCrop>
        );
    }

};

export default UploadImg
