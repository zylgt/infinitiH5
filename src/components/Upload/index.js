import React, {Component, useState, useCallback, useMemo, useRef, forwardRef} from 'react';
import t from 'prop-types';
import LocaleReceiver from 'antd/es/locale-provider/LocaleReceiver';
import Modal from 'antd/es/modal';
import './index.less';
import  EasyCrop from './EasyCrop'
import request from "../../utils/request";
import {cookieUtils} from "../../utils/tools";
import router from "umi/router";

const pkg = 'antd-img-crop';
const noop = () => {
};

const MEDIA_CLASS = `${pkg}-media`;

const ZOOM_STEP = 0.1;

const MIN_ROTATE = 0;
const MAX_ROTATE = 360;
const ROTATE_STEP = 1;

const ImgCrop = forwardRef((props, ref) => {
    const {
        aspect,
        shape,
        grid,
        quality,

        zoom,
        rotate,
        minZoom,
        maxZoom,

        modalTitle,
        modalWidth,
        modalOk,
        modalCancel,

        beforeCrop,
        children,

        cropperProps,

    } = props;

    const hasZoom = zoom === true;
    const hasRotate = rotate === true;

    const [src, setSrc] = useState('');
    const [isShowmodel, setShowmodel] = useState(false);
    const [zoomVal, setZoomVal] = useState(1);
    const [rotateVal, setRotateVal] = useState(0);
    const [side, setSide] = useState(0); // 横竖屏 0 横 ，1 竖


    const beforeUploadRef = useRef();
    const fileRef = useRef();
    const resolveRef = useRef(noop);
    const rejectRef = useRef(noop);

    const cropPixelsRef = useRef();

    /**
     * Upload
     */
    const renderUpload = useCallback(() => {
        const upload = Array.isArray(children) ? children[0] : children;
        const {beforeUpload, accept, ...restUploadProps} = upload.props;
        beforeUploadRef.current = beforeUpload;

        return {
            ...upload,
            props: {
                ...restUploadProps,
                accept: accept || 'image/*',
                beforeUpload: (file, fileList) =>
                    new Promise((resolve, reject) => {
                        if (beforeCrop && !beforeCrop(file, fileList)) {
                            reject();
                            return;
                        }

                        fileRef.current = file;
                        resolveRef.current = resolve;
                        rejectRef.current = reject;

                        const reader = new FileReader();
                        reader.addEventListener('load', () => {
                            setSrc(reader.result);
                            // 创建对象
                            let img = new Image();
                            img.src = reader.result;
                            // 加载完成执行
                            img.onload = function(){
                                let width = img.width;
                                let height = img.height;
                                if(width >= height){
                                //    横屏
                                    setSide(0)
                                }else{
                                //    竖屏
                                    setSide(1)
                                }
                                setShowmodel(true)
                            };
                        });
                        reader.readAsDataURL(file);
                    }),
            },
        };
    }, [beforeCrop, children]);

    /**
     * EasyCrop
     */
    const onComplete = useCallback((croppedAreaPixels) => {
        cropPixelsRef.current = croppedAreaPixels;
    }, []);

    /**
     * Controls
     */
    const isMinZoom = zoomVal - ZOOM_STEP < minZoom;
    const isMaxZoom = zoomVal + ZOOM_STEP > maxZoom;
    const isMinRotate = rotateVal === MIN_ROTATE;
    const isMaxRotate = rotateVal === MAX_ROTATE;

    const subZoomVal = useCallback(() => {
        if (!isMinZoom) setZoomVal(zoomVal - ZOOM_STEP);
    }, [isMinZoom, zoomVal]);

    const addZoomVal = useCallback(() => {
        if (!isMaxZoom) setZoomVal(zoomVal + ZOOM_STEP);
    }, [isMaxZoom, zoomVal]);

    const subRotateVal = useCallback(() => {
        if (!isMinRotate) setRotateVal(rotateVal - ROTATE_STEP);
    }, [isMinRotate, rotateVal]);

    const addRotateVal = useCallback(() => {
        if (!isMaxRotate) setRotateVal(rotateVal + ROTATE_STEP);
    }, [isMaxRotate, rotateVal]);

    /**
     * Modal
     */
    const modalProps = useMemo(() => {
        const obj = {width: modalWidth, okText: modalOk, cancelText: modalCancel};
        Object.keys(obj).forEach((key) => {
            if (!obj[key]) delete obj[key];
        });
        return obj;
    }, [modalCancel, modalOk, modalWidth]);

    //处理取消逻辑
    const onClose = useCallback(() => {
        // setSrc('');
        setShowmodel(false)
    });

    const onOk = useCallback(async (src) => {
        console.log('onOk', src)
        setShowmodel(false)

    });

    const renderComponent = (titleOfModal) => (
        <div>
            {renderUpload()}
            {isShowmodel && (
                <Modal
                    visible={true}
                    wrapClassName={`${pkg}-modal`}
                    title={titleOfModal}
                    onOk={onOk}
                    onCancel={onClose}
                    maskClosable={false}
                    destroyOnClose
                    {...modalProps}
                >
                    <img style={{position: 'absolute', width: '100%',zIndex:'-1', top: 0, background: '#fff'}}
                       src={require('../../assets/home_bg.jpg')} alt=""/>
                    {
                        side === 0 ?
                            <img style={{position: 'absolute', width: '100%', top: '2.6rem'}}
                                 src={require('../../assets/upload_crop.png')} alt=""/>
                                 :
                            <img style={{position: 'absolute', width: '100%', top: '1.92rem'}}
                                 src={require('../../assets/info_vertical.png')} alt=""/>
                    }
                    {
                        side === 0 ?
                            <img style={{position: 'absolute', width: '2.53rem',height:'.64rem', top: '3.58rem',left:'2.6rem', zIndex:'99'}}
                                 src={require('../../assets/upload_hint.png')} alt=""/>
                            :
                            <img style={{position: 'absolute', width: '2.53rem',height:'.64rem', top: '2.06rem',left:'2.86rem', zIndex:'99'}}
                                 src={require('../../assets/upload_hint.png')} alt=""/>
                    }

                    <EasyCrop
                        ref={ref}
                        src={src}
                        aspect={aspect}
                        shape={shape}
                        grid={grid}
                        hasZoom={hasZoom}
                        zoomVal={zoomVal}
                        rotateVal={rotateVal}
                        setZoomVal={setZoomVal}
                        setRotateVal={setRotateVal}
                        minZoom={minZoom}
                        maxZoom={maxZoom}
                        onComplete={onComplete}
                        cropperProps={cropperProps}

                        onOk={onOk}
                        side={side}
                    />
                    <div onClick={onClose} style={
                        side === 0 ?
                        {position: 'absolute', top: '1.7rem', left: '.32rem', display:'flex', alignItems:'center'}
                        :
                            {position: 'absolute', top: '1.4rem', left: '.32rem', display:'flex', alignItems:'center'}
                    }>
                        <img style={{height:'.48rem',width:'.48rem',margin:'0 .1rem 0 0' }} src={require('../../assets/back.png')} alt=""/>
                        返回
                    </div>

                </Modal>
            )}
        </div>
    );

    if (modalTitle) return renderComponent(modalTitle);

    return (
        <LocaleReceiver>
            {(locale, localeCode) => renderComponent(localeCode === 'zh-cn' ? '编辑图片' : 'Edit image')}
        </LocaleReceiver>
    );
});

ImgCrop.propTypes = {
    aspect: t.number,
    shape: t.oneOf(['rect', 'round']),
    grid: t.bool,
    quality: t.number,

    zoom: t.bool,
    rotate: t.bool,
    minZoom: t.number,
    maxZoom: t.number,

    modalTitle: t.string,
    modalWidth: t.oneOfType([t.number, t.string]),
    modalOk: t.string,
    modalCancel: t.string,

    beforeCrop: t.func,
    cropperProps: t.object,

    children: t.node,

};

ImgCrop.defaultProps = {
    aspect: 1,
    shape: 'rect',
    grid: false,
    quality: 0.2,

    zoom: true,
    rotate: false,
    minZoom: 1,
    maxZoom: 3,

};

export default ImgCrop;
