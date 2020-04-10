import React from 'react';
import { TabBar } from 'antd-mobile';
import router from 'umi/router';
import 'antd-mobile/dist/antd-mobile.css';
import styles from './index.less';

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
        const { askList } = this.props.ask;

        console.log('askList',askList)

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
                            let badge = false;
                            if(t.url == '/ask' && askList.length > 0 && askList[0].un_read > 0){
                                badge = askList[0].un_read
                            }
                            return  (<TabBar.Item
                                    title={t.name}
                                    key={t.id}
                                    className={styles.item}
                                    badge={ badge }
                                    icon={<div style={{
                                        width: '0.48rem',
                                        height: '0.48rem',
                                        background: `url(${t.icon}) center center /  0.44rem 0.44rem no-repeat` }}
                                    />
                                    }
                                    selectedIcon={<div style={{
                                        width: '0.48rem',
                                        height: '0.48rem',
                                        background: `url(${t.selectedicon}) center center /  0.44rem 0.44rem no-repeat` }}
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
