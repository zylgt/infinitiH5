import React from 'react';
import { TabBar } from 'antd-mobile';
import router from 'umi/router';
import 'antd-mobile/dist/antd-mobile.css';
import styles from './baseLayout.less';

const TabBarData = [
    {
        id: 'home',
        name: '首页',
        icon: require('../../assets/home_01.png'),
        selectedicon: require('../../assets/home.png'),
        url: '/home',
    },
    {
        id: 'ask',
        name: '问诊',
        icon: require('../../assets/question_01.png'),
        selectedicon: require('../../assets/question.png'),
        url: '/ask',
    },
    {
        id: 'my',
        name: '我的',
        icon: require('../../assets/my_01.png'),
        selectedicon: require('../../assets/my.png'),
        url: '/my',
    }
];

class BaseLayout extends React.Component {

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
                    tintColor="#2089EB"
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
                                        width: '0.44rem',
                                        height: '0.44rem',
                                        background: `url(${t.icon}) center center /  20px 20px no-repeat` }}
                                    />
                                    }
                                    selectedIcon={<div style={{
                                        width: '0.44rem',
                                        height: '0.44rem',
                                        background: `url(${t.selectedicon}) center center /  20px 20px no-repeat` }}
                                    />
                                    }
                                    // badge={1}
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
