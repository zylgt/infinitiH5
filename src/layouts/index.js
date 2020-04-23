import React, { Component } from 'react'
import BaseLayout from './baseLayout';
import { connect } from 'dva';

const ULR_NO_LAYOUT = ['/', '/home', '/ask', '/my'];

@connect(({ ask }) => ({ ask }))
class Index extends Component {
  componentDidMount() {

  }
  renderBody = () => {
    const {location: {pathname}, children, ask } = this.props;
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
