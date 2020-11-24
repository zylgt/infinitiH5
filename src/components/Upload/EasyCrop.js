import React, { Component } from 'react';
import Cropper from 'cropperjs'
import WelcomeButton from '../WelcomeButton'
import Styles from './EasyCrop.less';
import {connect} from "react-redux";
import { Toast } from 'antd-mobile';

@connect(({ upload }) => ({ upload }))
class EasyCrop extends Component {
    state = {
        cropper: {},
        height: 159,
        width: 286,
        margin : '4rem 0 0 0.88rem',
        transform: 'scale(1, 1)'
    }
    // 330 590

    componentDidMount() {

        console.log('props',this.props)
        const { side } = this.props;
        //计算裁剪框大小
        let innerWidth = window.innerWidth;
        let width, height, margin, transform ;
        if(side === 0){
            width = window.innerWidth / 375 * 285;
            height = window.innerWidth / 375 * 159;
            margin = '4rem 0 0 0.88rem';
            transform = 'scale(1, 1)';
        }else{
            width = window.innerWidth / 375 * 200;
            height = window.innerWidth / 375 * 352;
            margin = '2.06rem 0 0 1.72rem';
            transform = 'scale(0.83, 0.835)';
        }

        this.setState({
            height : height,
            width : width,
            margin: margin,
            transform: transform
        })
        console.log('height', height)
        console.log('width', width)

        const image = document.getElementById('upload-image')
        const cropper = new Cropper(image, {
            // aspectRatio: 1 / 1,
            dragMode: 'move',
            background: false,
            viewMode: 0,
            //autoCropArea: 1,
            cropBoxMovable: false,
            minCropBoxWidth: width,
            minCropBoxHeight: height,
            modal: false,
            guides: false,
            center:false,
        })
        this.setState({cropper})
    }

    getCropperImage() {
        this.state.cropper.getCroppedCanvas().toDataURL('image/jpeg')
        // console.log('a=', this.state.cropper.getCroppedCanvas({fillColor:'#fff'}).toDataURL('image/jpeg'))
        // console.log('cropper=', this.state.cropper)
        let src = this.state.cropper.getCroppedCanvas({fillColor:'#63311e'}).toDataURL('image/jpeg')
        //上传图片接口
        const { dispatch } = this.props;
        Toast.loading('上传中', 60, () => {
            console.log('上传成功');
        });
        dispatch({
            type:'upload/uploadImg',
            payload: {
                imgData: src
            },
            callback: this.uploadImgCallback.bind(this)
        })
    }
    //图片上传成功回调
    uploadImgCallback( src ){
        console.log('uploadImgCallback', src )
        const { dispatch, side } = this.props;
        this.props.onOk(src)
        Toast.hide()
        dispatch({
            type:'upload/setData',
            payload: {
                url: src,
                side: side,
                codeUrl:''
            }
        })

    }


    render() {
        const { height, width, margin, transform } = this.state;
        const { side } = this.props;
        console.log('side---',side)
        return (
            <div className={Styles.easy}>
                <div className={Styles.easy_img} style={{width: width, height: height,margin: margin, transform: transform }}>
                    <img src={this.props.src} alt='WelcomeBook' id='upload-image'/>
                </div>
                <div className={`${Styles.easy_btn} ${side === 1 ? Styles.easy_btn_side : ''} `} onClick={this.getCropperImage.bind(this)} >
                    <WelcomeButton title='确认'/>
                </div>
            </div>
        )
    }
}

export default EasyCrop;