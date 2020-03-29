import React, { Component } from 'react'
import { connect } from 'dva';
import Styles from './index.less';
import { getQueryString } from '../../utils/tools'

@connect(({ empty }) => ({ empty }))
class Empty extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        let code = getQueryString('code')
        console.log('code',code)
        const { dispatch } = this.props;
        dispatch({
            type: 'empty/isBind',
            payload: {
                code: code
            }
        });
    }


    render() {

        return (
            <div className={Styles.empty}></div>
        )
    }
}
export default Empty;
