import React, { Component } from 'react';
import {Carousel, WingBlank  } from 'antd-mobile';
import Styles from './index.less';
import router from 'umi/router';
import { staticURL } from '../../utils/baseURL'
import { isIOS } from '../../utils/tools'

class Swiper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
        }
    }
    render() {
        const props = this.props;
        // console.log('props',props)
        let itemHeight,itemWidth;
        itemWidth = props.itemStyle && props.itemStyle.width ? props.itemStyle.width : '100%';
        itemHeight = props.itemStyle && props.itemStyle.height ? props.itemStyle.height : '100%';
        return (
            <div className={`${Styles.swiper} ${isIOS() ? Styles.swiper_ios : ''}`}>
                <Carousel
                    autoplay = {props.autoplay}
                    infinite = {props.infinite}
                    dots = {props.dots}
                    dotStyle={props.dotStyle}
                    dotActiveStyle={props.dotActiveStyle}
                    autoplayInterval={props.autoplayInterval}
                >
                    {props.itemData.map((item,index) => (
                        <a
                            key={ item.uid }
                            href={ item.link }
                            style={{ width: itemWidth , height: itemHeight }}
                        >
                            <img
                                src={ staticURL + item.image}
                                alt={item.title}
                                style={{ display:'block',width: '100%',height:'100%', verticalAlign: 'top',borderRadius:'.16rem' }}
                                onLoad={() => {
                                    // fire window resize event to change height
                                    window.dispatchEvent(new Event('resize'));
                                    // this.setState({ imgHeight: 'auto' });
                                }}
                            />
                        </a>
                    ))}
                </Carousel>

            </div>
        )
    }
}


export default Swiper;
