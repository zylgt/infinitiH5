import React, {Component} from 'react';
import Styles from "./index.less";
import {connect} from 'dva';
import {Toast} from 'antd-mobile';


@connect(({upload}) => ({upload}))
class Canvas extends React.Component {
    constructor(props) {
        super(props)
        this.initCanvas = this.initCanvas.bind(this)
    }

    componentDidMount() {
        console.log('Canvas')
        let that = this;
        const { dispatch } = this.props;
        dispatch({
            type: 'upload/setData',
            payload: {
                canvasUrl: '',
                sShowShare:false
            }
        })
        // setTimeout(function (){
            that.initCanvas()
        // },500)
    }

    componentDidUpdate() {
        // console.log(222)
        // this.initCanvas()
    }
    //判断用户昵称
    isPhone(phone) {
        if (!(/^[1]([3-9])[0-9]{9}$/.test(phone))) {
            // console.log("手机号码有误，请重填");
            return phone;
        } else {
            // console.log('是手机号码')
            let str = phone.substring(0, 3);
            let str1 = phone.substring(8, 11);
            return str + '****' + str1
        }
    }

    initCanvas() {
        var that = this
        const {dispatch} = this.props;
        const { url, side, textWord, codeUrl, isVideo, nickName} = this.props;

        console.log('this.props',this.props)
        let phoneStr = '来自：'+this.isPhone(nickName);

        let conX, conY, conWidth, conHeight, codeX, codeY,
            codeWidth, codeHeight, word1X, word1Y, word2X, word2Y, canvasBg,
            videoBtn= require('../../assets/home_video_btn.png'),videoX, videoY,
            videoWidth, videoHeight,nameX,nameY;

        if (side === 0) {
            conX = 33;conY = 175;conWidth = 311;conHeight = 175;codeX = 152;
            codeY = 570;codeWidth = 68;codeHeight = 68;word1X = 187.5; word1Y = 427;
            word2X = 187.5; word2Y = 447; canvasBg= require('../../assets/canvas_hengbg.jpg');
            videoX = 170; videoY = 245; videoWidth=30; videoHeight = 30;nameX=187.5;nameY=480;
        }else{
            conX = 97;conY = 132;conWidth = 181;conHeight = 325;codeX = 152;
            codeY = 570;codeWidth = 68;codeHeight = 68;word1X = 187.5; word1Y = 505;
            word2X = 187.5; word2Y = 525;canvasBg= require('../../assets/canvas_shubg.jpg');
            videoX = 170; videoY = 280; videoWidth=30; videoHeight = 30;nameX=187.5;nameY=552;
        }

        let devicePixelRatio = window.devicePixelRatio;
        // console.log('devicePixelRatio',devicePixelRatio)
        let canvas1 = document.getElementById("customCanvas");

        if(!canvas1 || !url || !codeUrl){
            return
        }

        canvas1.width = 375 * devicePixelRatio;
        canvas1.height = 737 * devicePixelRatio;

        let context1 = canvas1.getContext("2d");

        context1.scale(devicePixelRatio,devicePixelRatio)
        context1.beginPath();
        context1.rect(0, 0, canvas1.width, canvas1.height);
        context1.fillStyle = "#fff";
        context1.fill();
        var myImage = new Image();
        myImage.src = canvasBg;  //背景图片 你自己本地的图片或者在线图片
        myImage.crossOrigin = 'Anonymous';
        myImage.onload = function () {
            console.log('1--------')
            context1.drawImage(myImage, 0, 0, 375, 737);
            // context1.font = "60px Courier New";
            // context1.fillText("合成的图片",350,450);
            var myImage2 = new Image();
            myImage2.crossOrigin = 'Anonymous'; //关键
            myImage2.src = url +'?'+new Date().getTime() ;  //你自己本地的图片或者在线图片
            myImage2.onload = function () {
                console.log('2--------')
                context1.drawImage(myImage2, conX, conY, conWidth, conHeight);
                //var base64 = canvas1.toDataURL("image/png"); //"image/png" 这里注意一下
                //var img = document.getElementById('avatar');
                // document.getElementById('avatar').src = base64;
                //img.setAttribute('src' , base64);
                var myImage3 = new Image();
                myImage3.crossOrigin = 'Anonymous'; //关键
                myImage3.src = codeUrl +'?'+new Date().getTime();  //二维码
                myImage3.onload = function () {
                    console.log('3--------')
                    context1.drawImage(myImage3, codeX, codeY, codeWidth, codeHeight);
                    // 设置字体
                    context1.font = "12px normal";
                    context1.textAlign="center";

                    // 设置颜色
                    context1.fillStyle = "#391a00";
                    // 绘制文字（参数：要写的字，x坐标，y坐标）
                    let word1='',word2='';
                    if(textWord.length > 32){
                        word1 = textWord.slice(0, 18)
                        word2 = textWord.slice(18, 34) + '......'
                    }else if(textWord.length > 18){
                        word1 = textWord.slice(0, 18)
                        word2 = textWord.slice(18)
                    }else{
                        word1 = textWord.slice(0, 18)
                    }
                    // console.log('textWord.length',textWord.length)
                    // console.log('word1',word1)
                    // console.log('word2',word2)
                    context1.fillText(word1, word1X, word1Y);
                    context1.fillText(word2, word2X, word2Y);
                    // 设置字体
                    context1.font = "14px bold";
                    // context1.fontWeight= "bold";
                    // 设置颜色
                    context1.fillStyle = "#391a00";
                    context1.fillText(phoneStr,nameX,nameY);

                    if(isVideo){ //视频
                        var myImage4 = new Image();
                        myImage4.crossOrigin = 'Anonymous'; //关键
                        myImage4.src = videoBtn;  //
                        myImage4.onload = function () {
                            console.log('4--------')
                            context1.drawImage(myImage4, videoX, videoY, videoWidth, videoHeight);
                            context1.closePath();
                            var base64 = canvas1.toDataURL("image/jpeg",0.92); //"image/png" 这里注意一下
                            Toast.hide()
                            dispatch({
                                type: 'upload/setData',
                                payload: {
                                    canvasUrl: base64
                                }
                            })
                            if(that.props.upload.keepToast){
                                dispatch({
                                    type: 'upload/setData',
                                    payload: {
                                        isShowShare:true
                                    }
                                })
                                Toast.info('长按图片保存相册，赶快去分享吧！', 1.5);
                            }
                        }

                    }else{
                        var base64 = canvas1.toDataURL("image/jpeg",0.92); //"image/png" 这里注意一下
                        Toast.hide()
                        dispatch({
                            type: 'upload/setData',
                            payload: {
                                canvasUrl: base64
                            }
                        })
                        if(that.props.upload.keepToast){
                            dispatch({
                                type: 'upload/setData',
                                payload: {
                                    isShowShare:true
                                }
                            })
                            Toast.info('长按图片保存相册，赶快去分享吧！', 1.5);
                        }
                    }



                }
            }
        }
    }

    render() {
        const {width, height, canvaswidth, canvasheight} = this.props;
        // console.log('this.props', this.props)
        return (
            <div className={Styles.canvas} id='container'>
                <canvas id="customCanvas" width={canvaswidth} height={canvasheight}></canvas>
            </div>
        )
    }
}

export default Canvas;
