import React, { Component } from 'react';
import {Carousel, WingBlank  } from 'antd-mobile';
import Styles from './index.less';
import router from 'umi/router';

class Swiper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
        }
    }
    render() {
        const props = this.props;
        console.log('props',props)
        let itemHeight,itemWidth;
        itemWidth = props.itemStyle && props.itemStyle.width ? props.itemStyle.width : '100%';
        itemHeight = props.itemStyle && props.itemStyle.height ? props.itemStyle.height : '100%';
        return (
            <div className={Styles.swiper}>
                <WingBlank>
                    <Carousel
                        autoplay = {props.autoplay}
                        infinite = {props.infinite}
                        dots = {props.dots}
                        dotStyle={props.dotStyle}
                        dotActiveStyle={props.dotActiveStyle}
                        autoplayInterval={props.autoplayInterval}
                    >
                        {props.itemData.map((item,index) => (
                            <div
                                key={item.id}
                                href="http://www.alipay.com"
                                style={{ width: itemWidth , height: itemHeight }}
                                onClick={() => router.push(item.router)}
                            >
                                <img
                                    src={item.imgUrl}
                                    alt=""
                                    style={{ width: '100%', verticalAlign: 'top' }}
                                    onLoad={() => {
                                        // fire window resize event to change height
                                        window.dispatchEvent(new Event('resize'));
                                        // this.setState({ imgHeight: 'auto' });
                                    }}
                                />
                            </div>
                        ))}
                    </Carousel>
                </WingBlank>

            </div>
        )
    }
}


export default Swiper;
