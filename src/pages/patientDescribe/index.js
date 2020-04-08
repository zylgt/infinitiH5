import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal,TextareaItem,Button,Toast } from 'antd-mobile';
import router from 'umi/router';
import Styles from './index.less';
import { createForm } from 'rc-form';
import wx from 'weixin-js-sdk';
import DocumentTitle from 'react-document-title'
import { pageURL } from '../../utils/baseURL'
import { nonceStr,isIOS } from '../../utils/tools'

@connect(({ patientDescribe,doctorInfo,chooseTime,applyList }) => ({ patientDescribe,doctorInfo,chooseTime,applyList }))
class PatientDescribe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            localIds:[],
            wkwebview:false,
            modal:false,
            timestamp:'',
            retryNum:1
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        const { inject } = this.props.patientDescribe;
        //生成签名时间戳
        let timestamp = (Date.parse(new Date()) / 1000).toString();
        this.setState({
            timestamp:timestamp,
        })

        if(isIOS()){
            console.log('IOS')
            //     alert(window.__wxjs_is_wkwebview)
            //     if (window && window.__wxjs_is_wkwebview == true) {
            //         // this.setState({
            //         //     wkwebview: true
            //         // })
            //     }

            // wx.config({
            //     debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            //     appId: 'wxc6c277ae69cd3a77', // 必填，公众号的唯一标识
            //     timestamp: '1586336027' , // 必填，生成签名的时间戳
            //     nonceStr: 'wang', // 必填，生成签名的随机串
            //     signature: '172f124d1ecdfd44c385f7882fd06d76cbdea518',// 必填，签名
            //     jsApiList: ['chooseImage','uploadImage','hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表
            // });

            wx.ready(function(){
                wx.hideAllNonBaseMenuItem();
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            });
        }else{
            console.log('安卓')
            this.setState({
                wkwebview:true
            })
            //获取appid和签名
            dispatch({
                type:'patientDescribe/getAppid',
                payload:{
                    noncestr: nonceStr,
                    timestamp: timestamp,
                    url: window.location.href.split('#')[0]
                },
                callback: this.getAppidCallback.bind(this)
            })
        }

    }
    //获取appidcallback
    getAppidCallback(response){
        const { timestamp } = this.state;
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.data.data.app_id, // 必填，公众号的唯一标识
            timestamp: timestamp , // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: response.data.data.signature,// 必填，签名
            jsApiList: ['chooseImage','uploadImage','hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表
        });
        wx.ready(function(){
            wx.hideAllNonBaseMenuItem();
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
    }
    addPatient() {
        let that = this;
        const { dispatch } = this.props;
        const { patientImg } = this.props.patientDescribe;
        wx.chooseImage({
            count: 8 - patientImg.length, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                console.log('res',res)
                let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

                that.getPhoneImg(localIds,0,that)

            }
        });
    }
    //根据机型获取可展示图片
    getPhoneImg(localIds,index,that){
        const { dispatch } = this.props;
        const { wkwebview } = this.state;
        const { patientImg } = this.props.patientDescribe;
        let patientObj = {};
        patientObj.isUpload = false; // 是否开始上传
        patientObj.serverId = ''; // 上传完成id
        patientObj.localId = localIds[index]; // 图片本地id
        patientObj.hint = '等待上传'; // 上传过程提示
        if( wkwebview ){
            patientObj.localUrl = localIds[index]; // 不同机型预览地址
            patientImg.push(patientObj)
            dispatch({
                type:'patientDescribe/setData',
                payload:{
                    patientImg:patientImg
                }
            })
            if(index+1 < localIds.length){
                index++ ;
                that.getPhoneImg(localIds,index,that)
            }else{
                that.uploadImg(0,that)
            }
        }else{
            wx.getLocalImgData({
                localId: localIds[index], // 图片的localID
                success: function (res) {
                    // var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                    patientObj.localUrl = res.localData; // 不同机型预览地址
                    patientImg.push(patientObj)
                    dispatch({
                        type:'patientDescribe/setData',
                        payload:{
                            patientImg:patientImg
                        }
                    })
                    if(index+1 < localIds.length){
                        index++ ;
                        that.getPhoneImg(localIds,index,that)
                    }else{
                        that.uploadImg(0,that)
                    }
                },
                fail:function(res){
                    if(index+1 < localIds.length){
                        index++ ;
                        that.getPhoneImg(localIds,index,that)
                    }else{
                        that.uploadImg(0,that)
                    }
                }
            });
        }
    }

    //上传图片
    uploadImg(index,that){
        const { dispatch } = this.props;
        const { patientImg } = this.props.patientDescribe;
        let time_index = 0;
        let time = setInterval(function () {
            if(patientImg[index].isUpload){
                return
            }
            time_index = time_index + 4;
            patientImg[index].hint = time_index + '%';
            dispatch({
                type:'patientDescribe/setData',
                payload:{
                    patientImg: patientImg
                }
            })
            if(time_index >= 95){
                console.log('clearInterval')
                clearInterval(time)
            }
        },30)

        //上传图片
        wx.uploadImage({
            localId: patientImg[index].localId, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 0, // 默认为1，显示进度提示
            success: function (res) {
                let serverId = res.serverId; // 返回图片的服务器端ID
                console.log('serverId',serverId)

                patientImg[index].isUpload = true;
                patientImg[index].serverId = serverId;
                patientImg[index].hint = '上传完成';
                dispatch({
                    type:'patientDescribe/setData',
                    payload:{
                        patientImg: patientImg
                    }
                })
                clearInterval(time)
                if(index + 1 < patientImg.length){
                    index++;
                    that.uploadImg(index, that)
                }
            },
            fail:function(res){
                clearInterval(time)
                if(index + 1 < patientImg.length){
                    index++;
                    that.uploadImg(index, that)
                }
            }
        });
    }
    //删除图片
    deleteImg(e){
        const { patientImg } = this.props.patientDescribe;
        const { dispatch } = this.props;
        let index = e.currentTarget.getAttribute('data-index');
        patientImg.splice(index,1)
        dispatch({
            type:'patientDescribe/setData',
            payload:{
                patientImg: patientImg
            }
        })
    }
    //输入框变化
    textareaChange(val){
        const { dispatch } = this.props;
        dispatch({
            type:'patientDescribe/setData',
            payload:{
                val: val
            }
        })
    }
    //点击下一步
    next(){
        const { patientImg,val } = this.props.patientDescribe;
        const { dispatch } = this.props;
        const { uid } = this.props.chooseTime;
        const { illData } = this.props.applyList;

        let that = this;
        if(val.length == ''){
            Toast.info('请描述您的病情',1.5)
            return false
        }else if(val.length < 20){
            Toast.info('描述信息不可少于20字',1.5)
            return false
        }
        for(let k in patientImg){
            if(!patientImg[k].isUpload){
                Toast.info('照片上传中，请稍等', 1.5)
                return false;
            }
        }

        let media = []; // 图片id
        for(let i in patientImg){
            if(patientImg[i].isUpload){
                media.push(patientImg[i].serverId)
            }
        }
        console.log('media',media)
        let imgInfo = {
            cat:'disease',
            media: media
        }
        let disease_length = '', is_visit = '',disease = '';
        for(let index in illData){
            if(illData[index].key == 'one'){
                disease_length = illData[index].choose
            }
            if(illData[index].key == 'two'){
                if(illData[index].choose == 'yes'){
                    is_visit = true
                    disease = illData[index].inputValue
                }else{
                    is_visit = false
                    disease = ''
                }
            }
        }

        let orderInfo = {
            order_id: uid,
            disease_length: disease_length,
            is_visit: is_visit,
            disease: disease,
            desc: val
        }
        let payload = {
            imgInfo,
            orderInfo
        }
        console.log('payload',payload)

        dispatch({
            type:'patientDescribe/askVisit',
            payload:{
                payload
            },
            callback:this.nextCallback.bind(this)
        })

    }
    nextCallback(response){
        //判断是否大于30分钟
        if(response.data.code == 424){
            this.setState({
                modal:true
            })
        }

    }

    //关闭超时弹窗
    onClose(){
        this.setState({
            modal:false
        })
    }
    //点击超时弹窗确认
    clickKnow(){
        const { doctorInfo } = this.props.doctorInfo;
        console.log('doctorInfo',doctorInfo)
        router.push('./chooseTime?set=reset&id='+doctorInfo.uid)
        this.setState({
            modal:false
        })
    }


    render() {
        const { getFieldProps } = this.props.form;
        const { wkwebview } = this.state;
        const { patientImg,val } = this.props.patientDescribe;

        console.log('--patientImg--',patientImg)

        return (
            <DocumentTitle title='问诊申请'>
                <div className={Styles.patient}>
                    <p className={Styles.patient_title}>请描述您的病情<span>*</span></p>
                    <TextareaItem
                        rows={5}
                        count={600}
                        value={val}
                        placeholder="请详细描述您的病情症状、曾做过的检查、用药情况、目前病情是加重还是环节，想获得医生什么帮助…"
                        className={Styles.patient_textarea}
                        onChange={(val)=>{this.textareaChange(val)}}
                    />
                    <p className={`${Styles.patient_title} ${Styles.patient_title1}`}>上传检查报告或患处照片</p>
                    <p className={Styles.patient_second_title}>照片仅自己和医生可见，最多可上传8张</p>
                    <div className={Styles.patient_img}>
                        {
                            patientImg && patientImg.length > 0 ?
                                patientImg.map((item,index)=>{
                                    return(
                                        <div className={Styles.patient_camera} key={index}>
                                            {
                                                !item.isUpload ? <p className={Styles.camera_cover}>{item.hint}</p> : ''
                                            }
                                            <img className={Styles.camera_img} src={item.localUrl} alt=""/>
                                            <img data-index={index} onClick={(e)=>{this.deleteImg(e)}} className={Styles.camera_delete} src={require('../../assets/patient_delete.png')} alt=""/>
                                        </div>
                                    )
                                })
                                :''
                        }
                        {
                            patientImg && patientImg.length < 8 ?
                                <div className={Styles.patient_camera} onClick={()=>{this.addPatient()}}>
                                    <img src={require('../../assets/patient_camera.png')} alt=""/>
                                    <p className={Styles.camera_title}>添加照片</p>
                                </div>:''
                        }

                    </div>

                    <div className={Styles.apply_btn}>
                        <Button className={Styles.btn} onClick={()=>{this.next()}} >下一步</Button>
                    </div>

                    <Modal
                        visible={this.state.modal}
                        transparent
                        maskClosable={true}
                        onClose={()=>{this.onClose()}}
                        // title="Title"
                        className='patient_model'
                        footer={[{ text: '知道了', onPress: () => { this.clickKnow()} }]}
                    >
                        <div style={{color:'#333'}}>
                            您超过30分钟未完成问诊申请，号源已被他人预约啦，请重新选择预约时段
                        </div>
                    </Modal>
                </div>
            </DocumentTitle>
        )
    }
}
export default createForm()(PatientDescribe);
