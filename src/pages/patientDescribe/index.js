import React, {Component} from 'react'
import {connect} from 'dva';
import {Modal, TextareaItem, Button, Toast} from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import {createForm} from 'rc-form';
import wx from 'weixin-js-sdk';
import DocumentTitle from 'react-document-title'
import {nonceStr, isIOS} from '../../utils/tools'
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入

@connect(({patientDescribe, doctorInfo, chooseTime, applyList, management}) => ({
    patientDescribe,
    doctorInfo,
    chooseTime,
    applyList,
    management
}))
class PatientDescribe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            localIds: [],
            wkwebview: false,
            modal: false,
            timestamp: '',
            retryNum: 1,
            isShowCase: false,

        }
    }

    componentWillUnmount() {
        //顶部进度条开启
        NProgress.start()
    }

    componentDidMount() {
        const {dispatch} = this.props;
        const {inject} = this.props.patientDescribe;
        const that = this;
        //生成签名时间戳
        let timestamp = (Date.parse(new Date()) / 1000).toString();
        this.setState({
            timestamp: timestamp,
        })

        if (isIOS()) {
            console.log('IOS')
            //     alert(window.__wxjs_is_wkwebview)
            //     if (window && window.__wxjs_is_wkwebview == true) {
            //         // this.setState({
            //         //     wkwebview: true
            //         // })
            //     }
            //顶部进度条关闭
            NProgress.done()

            wx.ready(function () {
                wx.hideAllNonBaseMenuItem();
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            });
        } else {
            console.log('安卓')
            this.setState({
                wkwebview: true
            })
            //获取appid和签名
            dispatch({
                type: 'patientDescribe/getAppid',
                payload: {
                    noncestr: nonceStr,
                    timestamp: timestamp,
                    url: window.location.href.split('#')[0]
                },
                callback: this.getAppidCallback.bind(this)
            })
        }
    }

    //获取appidcallback
    getAppidCallback(response) {
        const {timestamp} = this.state;
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.data.data.app_id, // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: response.data.data.signature,// 必填，签名
            jsApiList: ['chooseImage', 'uploadImage', 'hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表
        });
        wx.ready(function () {
            wx.hideAllNonBaseMenuItem();
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
    }

    offset(element) {
        var offest = {
            top: 0,
            left: 0
        };

        var _position;

        getOffset(element, true);

        return offest;

        // 递归获取 offset, 可以考虑使用 getBoundingClientRect
        function getOffset(node, init) {
            // 非Element 终止递归
            if (node.nodeType !== 1) {
                return;
            }
            _position = window.getComputedStyle(node)['position'];

            // position=static: 继续递归父节点
            if (typeof (init) === 'undefined' && _position === 'static') {
                getOffset(node.parentNode);
                return;
            }
            offest.top = node.offsetTop + offest.top - node.scrollTop;
            offest.left = node.offsetLeft + offest.left - node.scrollLeft;

            // position = fixed: 获取值后退出递归
            if (_position === 'fixed') {
                return;
            }

            getOffset(node.parentNode);
        }
    }

    //添加图片
    addPatient() {
        let that = this;
        const {dispatch} = this.props;
        const {patientImg} = this.props.patientDescribe;
        wx.chooseImage({
            count: 8 - patientImg.length, // 默认9
            sizeType: ['compressed'], // 'original',可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // console.log('res',res)
                let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

                that.getPhoneImg(localIds, 0, that)

            }
        });
    }

    //根据机型获取可展示图片
    getPhoneImg(localIds, index, that) {
        const {dispatch} = this.props;
        const {wkwebview} = this.state;
        const {patientImg} = this.props.patientDescribe;
        let patientObj = {};
        patientObj.isUpload = false; // 是否开始上传
        patientObj.serverId = ''; // 上传完成id
        patientObj.localId = localIds[index]; // 图片本地id
        patientObj.hint = '等待上传'; // 上传过程提示
        if (wkwebview) {
            patientObj.localUrl = localIds[index]; // 不同机型预览地址
            patientImg.push(patientObj)
            dispatch({
                type: 'patientDescribe/setData',
                payload: {
                    patientImg: patientImg
                }
            })
            if (index + 1 < localIds.length) {
                index++;
                that.getPhoneImg(localIds, index, that)
            } else {
                that.uploadImg(0, that)
            }
        } else {
            wx.getLocalImgData({
                localId: localIds[index], // 图片的localID
                success: function (res) {
                    // var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                    patientObj.localUrl = res.localData; // 不同机型预览地址
                    patientImg.push(patientObj)
                    dispatch({
                        type: 'patientDescribe/setData',
                        payload: {
                            patientImg: patientImg
                        }
                    })
                    if (index + 1 < localIds.length) {
                        index++;
                        that.getPhoneImg(localIds, index, that)
                    } else {
                        that.uploadImg(0, that)
                    }
                },
                fail: function (res) {
                    if (index + 1 < localIds.length) {
                        index++;
                        that.getPhoneImg(localIds, index, that)
                    } else {
                        that.uploadImg(0, that)
                    }
                }
            });
        }
    }

    //上传图片
    uploadImg(index, that) {
        const {dispatch} = this.props;
        const {patientImg} = this.props.patientDescribe;

        if (patientImg[index].isUpload && index + 1 < patientImg.length) {
            index++;
            that.uploadImg(index, that)
            return
        }

        let time_index = 0;
        let time = setInterval(function () {
            time_index = time_index + 4;
            patientImg[index].hint = time_index + '%';
            dispatch({
                type: 'patientDescribe/setData',
                payload: {
                    patientImg: patientImg
                }
            })
            if (time_index >= 95) {
                // console.log('clearInterval')
                clearInterval(time)
            }
        }, 30)

        //上传图片
        wx.uploadImage({
            localId: patientImg[index].localId, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 0, // 默认为1，显示进度提示
            success: function (res) {
                let serverId = res.serverId; // 返回图片的服务器端ID
                // console.log('serverId',serverId)

                patientImg[index].isUpload = true;
                patientImg[index].serverId = serverId;
                patientImg[index].hint = '上传完成';
                dispatch({
                    type: 'patientDescribe/setData',
                    payload: {
                        patientImg: patientImg
                    }
                })
                clearInterval(time)
                if (index + 1 < patientImg.length) {
                    index++;
                    that.uploadImg(index, that)
                }
            },
            fail: function (res) {
                clearInterval(time)
                if (index + 1 < patientImg.length) {
                    index++;
                    that.uploadImg(index, that)
                }
            }
        });
    }

    //删除图片
    deleteImg(e) {
        const {patientImg} = this.props.patientDescribe;
        const {dispatch} = this.props;
        let index = e.currentTarget.getAttribute('data-index');
        patientImg.splice(index, 1)
        dispatch({
            type: 'patientDescribe/setData',
            payload: {
                patientImg: patientImg
            }
        })
    }

    //输入框变化
    textareaChange(val, type) {
        const {dispatch} = this.props;
        let payload = {}
        payload[type] = val
        dispatch({
            type: 'patientDescribe/setData',
            payload: {...payload}
        })
    }

    //点击下一步
    next() {
        const {patientImg, info, medicine, question} = this.props.patientDescribe;
        const {dispatch} = this.props;
        const {uid} = this.props.chooseTime;

        let that = this;
        if (info.length == 0) {
            Toast.info('请填写病情', 1.5)
            return false
        } else if (info.length < 10) {
            Toast.info('病情描述不可少于10字', 1.5)
            return false
        }
        if (medicine.length == 0) {
            Toast.info('请填写用药情况', 1.5)
            return false
        } else if (medicine.length < 10) {
            Toast.info('用药情况描述不可少于10字', 1.5)
            return false
        }
        if (question.length == 0) {
            Toast.info('请填写您想解决的问题', 1.5)
            return false
        } else if (question.length < 10) {
            Toast.info('您想解决的问题描述不可少于10字', 1.5)
            return false
        }

        for (let k in patientImg) {
            if (!patientImg[k].isUpload) {
                Toast.info('照片上传中，请稍等', 1.5)
                return false;
            }
        }

        let media = []; // 图片id
        for (let i in patientImg) {
            if (patientImg[i].isUpload) {
                media.push(patientImg[i].serverId)
            }
        }
        // console.log('media',media)
        let imgInfo = {
            cat: 'disease',
            media: media
        }

        let orderInfo = {
            order_id: uid,
            desc: info,
            medicine: medicine,
            question: question,

        }
        let payload = {
            imgInfo,
            orderInfo
        }
        console.log('payload', payload)

        dispatch({
            type: 'patientDescribe/askVisit',
            payload: {
                payload
            },
            callback: this.nextCallback.bind(this)
        })
    }

    nextCallback(response) {
        //判断是否大于30分钟
        if (response.data.code == 424) {
            this.setState({
                modal: true
            })
        }

    }

    //关闭超时弹窗
    onClose() {
        this.setState({
            modal: false
        })
    }

    //点击超时弹窗确认
    clickKnow() {
        const {doctorInfo} = this.props.doctorInfo;
        // console.log('doctorInfo',doctorInfo)
        router.push('./chooseTime?set=reset&id=' + doctorInfo.uid)
        this.setState({
            modal: false
        })
    }

    //打开案例描述
    openCase() {
        this.setState({
            isShowCase: !this.state.isShowCase
        })
    }

    //导入上次病情描述
    importInfo() {
        const {dispatch} = this.props;
        const {patientInfo} = this.props.management;
        if (patientInfo.last_ill_desc == '' && patientInfo.last_ill_medicine == '' && patientInfo.last_ill_question == '') {
            Toast.info('格式不对，无法导入', 1.5)
        }
        if (patientInfo.last_ill_desc == '' || patientInfo.last_ill_medicine == '' || patientInfo.last_ill_question == '') {
            Toast.info('您还没有添加过描述信息', 1.5)
        }
        dispatch({
            type: 'patientDescribe/setData',
            payload: {
                info: patientInfo.last_ill_desc,
                medicine: patientInfo.last_ill_medicine,
                question: patientInfo.last_ill_question
            }
        })

    }

    //focus时使输入框滑动到页面中间位置
    textareaFocus(type) {
        const {dispatch} = this.props;
        const {isShowCase} = this.state;
        dispatch({
            type: 'setData',
            payload: {
                type: type,
            }
        })
        if (isIOS()) {
            if (isShowCase) {
                if (type == 'info') {
                    this.patient.scrollTop = 60
                } else if (type == 'medicine') {
                    this.patient.scrollTop = 200
                } else if (type == 'question') {
                    this.patient.scrollTop = 400
                }
            } else {
                if (type == 'info') {
                    this.patient.scrollTop = 0
                } else if (type == 'medicine') {
                    this.patient.scrollTop = 50
                } else if (type == 'question') {
                    this.patient.scrollTop = 100
                }
            }
        } else {
            if (isShowCase) {
                if (type == 'info') {
                    this.patient.scrollTop = 70
                } else if (type == 'medicine') {
                    this.patient.scrollTop = 360
                } else if (type == 'question') {
                    this.patient.scrollTop = 700
                }
            } else {
                if (type == 'info') {
                    this.patient.scrollTop = 0
                } else if (type == 'medicine') {
                    this.patient.scrollTop = 100
                } else if (type == 'question') {
                    this.patient.scrollTop = 400
                }
            }
        }

    }

    render() {
        const {getFieldProps} = this.props.form;
        const {wkwebview, isShowCase} = this.state;
        const {patientImg, info, medicine, question} = this.props.patientDescribe;

        // console.log('--patientImg--',patientImg)

        return (
            <DocumentTitle title='问诊申请'>
                <div className={Styles.patient} ref={el => this.patient = el}>
                    <div className={Styles.patient_title}>
                        <span>请描述您的病情</span>
                        <div className={Styles.title_right} onClick={() => {
                            this.openCase()
                        }}>
                            <span>查看案例描述</span>
                            <img className={Styles.title_img} src={require('../../assets/right.png')} alt=""/>
                        </div>
                    </div>
                    {
                        isShowCase ?
                            <div className={Styles.patient_example}>
                                <p className={Styles.example_title}>病情</p>
                                <p className={Styles.example_content}>本人，男，53岁，2018年体检时发现血糖偏高，当时空腹血糖7.0mmol/l，餐后血糖11.5mmol/l。</p>
                                <p className={Styles.example_title}>用药情况</p>
                                <p className={Styles.example_content}>一直服用盐酸二甲双胍片控制血糖。近日测空腹血糖6.6-7.0mmol/l，餐后血糖8.0～10.0mmol/l.</p>
                                <p className={Styles.example_title}>想解决的问题</p>
                                <p className={Styles.example_content}>请问大夫是否需要更换药物来控制？</p>
                            </div>
                            : ''
                    }

                    <div className={Styles.patient_title}>
                        <span>病情<span className={Styles.title_imp}>*</span></span>
                        <div className={Styles.title_right} onClick={() => {
                            this.importInfo()
                        }}>
                            <img className={Styles.title_cloud} src={require('../../assets/cloud.png')} alt=""/>
                            <span>导入上次病情描述</span>
                        </div>
                    </div>
                    <TextareaItem
                        rows={5}
                        count={200}
                        value={info}
                        placeholder="请详细描述您的病情症状、曾做过的检查，目前病情是加重还是缓解"
                        className={Styles.patient_textarea}
                        onChange={(val) => {
                            this.textareaChange(val, 'info')
                        }}
                        onFocus={() => {
                            this.textareaFocus('info')
                        }}
                    />
                    <div className={Styles.patient_title}>
                        <span>用药情况<span className={Styles.title_imp}>*</span></span>
                    </div>
                    <TextareaItem
                        rows={5}
                        count={200}
                        value={medicine}
                        placeholder="请描述用药情况"
                        className={Styles.patient_textarea}
                        onChange={(val) => {
                            this.textareaChange(val, 'medicine')
                        }}
                        onFocus={() => {
                            this.textareaFocus('medicine')
                        }}
                    />
                    <div className={Styles.patient_title}>
                        <span>想解决的问题<span className={Styles.title_imp}>*</span></span>
                    </div>
                    <TextareaItem
                        rows={5}
                        count={200}
                        value={question}
                        placeholder="请描述想获得医生什么帮助"
                        className={Styles.patient_textarea}
                        onChange={(val) => {
                            this.textareaChange(val, 'question')
                        }}
                        onFocus={() => {
                            this.textareaFocus('question')
                        }}
                    />

                    <p className={`${Styles.patient_title} ${Styles.patient_title1}`}>上传检查报告或患处照片</p>
                    <p className={Styles.patient_second_title}>照片仅自己和医生可见，最多可上传8张</p>
                    <div className={Styles.patient_img}>
                        {
                            patientImg && patientImg.length > 0 ?
                                patientImg.map((item, index) => {
                                    return (
                                        <div className={Styles.patient_camera} key={index}>
                                            {
                                                !item.isUpload ? <p className={Styles.camera_cover}>{item.hint}</p> : ''
                                            }
                                            <img className={Styles.camera_img} src={item.localUrl} alt=""/>
                                            <img data-index={index} onClick={(e) => {
                                                this.deleteImg(e)
                                            }} className={Styles.camera_delete}
                                                 src={require('../../assets/patient_delete.png')} alt=""/>
                                        </div>
                                    )
                                })
                                : ''
                        }
                        {
                            patientImg && patientImg.length < 8 ?
                                <div className={Styles.patient_camera} onClick={() => {
                                    this.addPatient()
                                }}>
                                    <img src={require('../../assets/patient_camera.png')} alt=""/>
                                    <p className={Styles.camera_title}>添加照片</p>
                                </div> : ''
                        }

                    </div>

                    <div className={Styles.apply_btn}>
                        <Button className={Styles.btn} onClick={() => {
                            this.next()
                        }}>下一步</Button>
                    </div>

                    <Modal
                        visible={this.state.modal}
                        transparent
                        maskClosable={true}
                        onClose={() => {
                            this.onClose()
                        }}
                        // title="Title"
                        className='patient_model'
                        footer={[{
                            text: '知道了', onPress: () => {
                                this.clickKnow()
                            }
                        }]}
                    >
                        <div style={{color: '#333'}}>
                            您超过20分钟未完成问诊申请，号源已被他人预约啦，请重新选择预约时段
                        </div>
                    </Modal>
                </div>
            </DocumentTitle>
        )
    }
}

export default createForm()(PatientDescribe);
