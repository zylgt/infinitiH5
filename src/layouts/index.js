import React, { Component } from 'react'
import BaseLayout from './baseLayout';
import { connect } from 'dva';

const ULR_NO_LAYOUT = ['/', '/home', '/ask', '/my'];


@connect(({ layout,ask, my }) => ({ layout,ask, my }))
class Index extends Component {

    renderBody = () => {
        const {location: {pathname}, children } = this.props;

        if (ULR_NO_LAYOUT.includes(pathname)) {
            return  (<BaseLayout {...this.props} />);
        }
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    }


    render() {
        return (
            <React.Fragment>
                {this.renderBody()}
            </React.Fragment>
        )
    }
}

export default Index;
