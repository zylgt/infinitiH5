import React, {Component, useState} from 'react';
import {Upload, Button} from 'antd';
import {connect} from 'dva';
import Style from './index.less'
import {Toast} from 'antd-mobile';
import {baseURL} from '../../utils/baseURL'
import ReactPlayer from "react-player";
import { isIOS } from "../../utils/tools";

@connect(({upload}) => ({upload}))
class UploadVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: []
        }
    }

    render() {
        const that = this;
        const props = {
            name: 'file',
            action: baseURL + '/fileup/uploadVideo',
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                console.log('info', info)
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    console.log(`${info.file.name} file uploaded successfully`);
                    let msg = info.file.response.msg;
                    const {dispatch} = that.props;
                    Toast.hide()
                    // 创建对象
                    let img = new Image();
                    img.src = msg.imgURL;
                    // 加载完成执行
                    img.onload = function () {
                        let width = img.width;
                        let height = img.height;
                        console.log('width', width)
                        console.log('height', height)

                        if (width >= height) {
                            //    横屏
                            dispatch({
                                type: 'upload/setData',
                                payload: {
                                    url: msg.imgURL,
                                    videoUrl: msg.videoURL,
                                    side: 0,
                                }
                            })
                        } else {
                            //    竖屏
                            dispatch({
                                type: 'upload/setData',
                                payload: {
                                    url: msg.imgURL,
                                    videoUrl: msg.videoURL,
                                    side: 1,
                                }
                            })
                        }
                    };

                } else if (info.file.status === 'error') {
                    // var str = JSON.stringify(info.file);
                    // alert(str);
                    // Toast.hide()
                    Toast.fail('网络原因上传失败，建议上传15s以内视频并切换网络环境重试', 1.5);
                    console.log(`${info.file.name} file upload failed.`);
                }
            },
            beforeUpload(file, fileList) {
                console.log('file',file)
                // console.log(file.type.indexOf('video'))
                if(file.type.indexOf('video') === -1){
                    Toast.fail('请选择视频进行上传', 1.5);
                    return false
                }
                if(isIOS()){
                    if(file.size/1000 > 50000){
                        Toast.fail('网络原因上传失败，建议上传15s以内视频并切换网络环境重试', 1.5);
                        return false
                    }
                    Toast.loading('上传中', 600, () => {
                        console.log('上传成功');
                    });
                    return true
                }
                return new Promise((resolve, reject) => {
                    console.log('file',file)
                    var fileurl = URL.createObjectURL(file);
                    //经测试，发现audio也可获取视频的时长
                    var audioElement = new Audio(fileurl);
                    var duration;
                    audioElement.addEventListener("loadedmetadata", function (_event) {
                        duration = audioElement.duration;
                        console.log('duration', duration);//单位：秒
                        if (duration > 15) {
                            Toast.fail('您选择的视频超过15秒，还请重新选择', 1.5);
                            reject();
                        } else {
                            Toast.loading('上传中', 600, () => {
                                console.log('上传成功');
                            });
                            resolve()
                        }
                    });
                })
            }

        };
        return (
            <Upload {...props}>
                <div>
                    上传视频 +
                </div>
                <div>（建议15s内）</div>
            </Upload>
        );
    }

};

export default UploadVideo