import React from 'react';
import { TabBar } from 'antd-mobile';
import router from 'umi/router';
import 'antd-mobile/dist/antd-mobile.css';
import styles from './index.less';
import { hostURL } from '../../utils/baseURL';


const TabBarData = [
    {
        id: 'home',
        name: '首页',
        icon: require('../../assets/home.png'),
        selectedicon: require('../../assets/home_active.png'),
        url: '/home',
    },
    {
        id: 'upload',
        name: '上传',
        icon: require('../../assets/upload.png'),
        selectedicon: require('../../assets/upload_active.png'),
        url: '/upload',
    },
    {
        id: 'hot',
        name: '热门',
        icon: require('../../assets/hot.png'),
        selectedicon: require('../../assets/hot_active.png'),
        url: '/hot',
    },
    {
        id: 'my',
        name: '我的',
        icon: require('../../assets/my.png'),
        selectedicon: require('../../assets/my_active.png'),
        url: '/my',
    }
];

class BaseLayout extends React.Component {

    componentDidMount() {
        const { dispatch } = this.props;

    }

    isTabBarSelect = (url) => {
        const {location: {pathname}} = this.props;
        if (pathname == '/' && url == '/home') {
            return true;
        } else {
            return pathname === url;
        }
    }

    render() {

        return (
            <div className={styles.baseLayout}>
                <TabBar
                    unselectedTintColor="#999"
                    tintColor="#6b4b3a"
                    barTintColor="white"
                    tabBarPosition='bottom'
                >
                    {
                        TabBarData.map(t => {
                            const isSelect = this.isTabBarSelect(t.url);

                            return  (<TabBar.Item
                                    title={t.name}
                                    key={t.id}
                                    className={styles.item}

                                    icon={<div style={{
                                        width: '0.48rem',
                                        height: '0.48rem',
                                        background: `url(${t.icon}) center center /  0.48rem 0.48rem no-repeat` }}
                                    />
                                    }
                                    selectedIcon={<div style={{
                                        width: '0.48rem',
                                        height: '0.48rem',
                                        background: `url(${t.selectedicon}) center center /  0.48rem 0.48rem no-repeat` }}
                                    />
                                    }

                                    onPress={() => {
                                        router.push(t.url);
                                    }}
                                    selected={isSelect}
                                    data-seed="logId"
                                >
                                    {isSelect && this.props.children}
                                </TabBar.Item>
                            )
                        })
                    }
                </TabBar>
            </div>
        );
    }
}

export default BaseLayout;
