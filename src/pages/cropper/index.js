import React, {Component, useState} from 'react'
import {connect} from 'dva';
import Styles from './index.less';
import DocumentTitle from 'react-document-title'
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css'
import { Button } from 'antd';


class Crop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            afterImg: null
        }
        this.myCropper = null
    }

    componentDidMount() {
        if (window.innerHeight <= 667) {
            this.setState({
                bgImgTop: '-1.74rem',
                conTop: '.32rem',
            })
        } else if (window.innerHeight <= 736) {
            this.setState({
                bgImgTop: '-.8rem',
                conTop: '1.2rem'
            })
        }

        const image = document.getElementById('image');
        console.log('image', image)
        // const cropper = new Cropper(image, {
        //     // aspectRatio: 16 / 9,
        //     viewMode: 1,
        //     dragMode: 'none',
        //     initialAspectRatio: 1,
        //     aspectRatio: 1,
        //     preview: '.before',
        //     background: false,
        //     autoCropArea: 0.6,
        //     zoomOnWheel: false,
        //     crop(event) {
        //         console.log(event.detail.x);
        //         console.log(event.detail.y);
        //         console.log(event.detail.width);
        //         console.log(event.detail.height);
        //         console.log(event.detail.rotate);
        //         console.log(event.detail.scaleX);
        //         console.log(event.detail.scaleY);
        //     },
        // });

        this.init()

    }

    init() {
        this.myCropper = new Cropper(this.refs.image, {
            viewMode: 0,
            dragMode: 'none',
            aspectRatio: 570 / 320,
            background: false,
            autoCropArea: 1,
            zoomOnWheel: true,
            crop(event) {
                console.log(event.detail.x);
                console.log(event.detail.y);
                console.log(event.detail.width);
                console.log(event.detail.height);
                console.log(event.detail.rotate);
                console.log(event.detail.scaleX);
                console.log(event.detail.scaleY);
            },
        })
        let that = this
        setTimeout(function () {
            that.setData()
        },1000)

    }
    setData(){
        const data = this.myCropper.getData();
        console.log('data', data)

        const canvasData = this.myCropper.getCanvasData()
        console.log('canvasData', canvasData)

        const ContainerData = this.myCropper.getContainerData()
        console.log('ContainerData', ContainerData)

        const ImageData = this.myCropper.getImageData()
        console.log('ImageData', ImageData)

        const CropBoxData = this.myCropper.getCropBoxData()
        console.log('CropBoxData', CropBoxData)

        this.myCropper.setCropBoxData({
            height:160,
            width:285,
            left:45
        });

    }
    sureSava() {
        const afterImg = this.myCropper.getCroppedCanvas({
            imageSmoothingQuality: 'high',
            fillColor: '#fff'
        }).toDataURL('image/jpeg')
        console.log('afterImg', afterImg)
        this.setState({
            afterImg: afterImg
        })




    }

    render() {
        const {afterImg} = this.state;
        console.log('afterImg',afterImg)
        return (
            <DocumentTitle title='【背后的力量】故事无限公司'>
                <div className={Styles.crop}>
                    <Button onClick={this.sureSava.bind(this)}>裁剪</Button>
                    <div className={Styles.container}>
                        <div className={Styles.img_container}>
                            {/*<img ref="image" src={require('../../assets/welcome_button_null.png')} alt=""/>*/}
                            <img ref="image" src={require('../../assets/welcome_bg.jpg')} alt=""/>
                        </div>
                        <div className={Styles.afterCropper}>
                            {
                                afterImg ? <img src={afterImg} alt=""/> : ''
                            }
                        </div>
                    </div>

                </div>
            </DocumentTitle>
        )
    }
}

export default Crop;
