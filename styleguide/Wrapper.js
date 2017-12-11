import React, { Component } from 'react';

let uid = 0;

export default class Wrapper extends Component {
  setPreviewState(component) {
    if (component && !component.state.uid) {
      component.setState({
        uid: 'c' + uid++,
      });
    }
  }

  render() {
    let previewLight = React.cloneElement(this.props.children, {
      ref: c => this.setPreviewState(c),
    });
    let previewDark = React.cloneElement(this.props.children, {
      ref: c => this.setPreviewState(c),
    });
    return React.createElement('div', { className: 'preview-row' }, [
      React.createElement(
        'div',
        { key: 1, className: 'preview-col-light' },
        previewLight
      ),
      React.createElement(
        'div',
        { key: 2, className: 'preview-col-dark' },
        previewDark
      ),
    ]);
  }
}
