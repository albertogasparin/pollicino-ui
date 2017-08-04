import React, { Component } from 'react';

import Btn from '../Btn';
import Icon from '../Icon';
import FormFieldText from '../FormFieldText';

/**
 * @class FormFieldPassword
 * @augments {Component<{
      [x:string]: any
      disabled?: boolean
    }, {
      type?: string
    }>}
 */
class FormFieldPassword extends Component {
  state = {
    type: 'password',
  };

  handleTypeToggle = () => {
    let type = this.state.type ? '' : 'password';
    this.setState({ type });
  };

  render() {
    let { disabled } = this.props;
    let { type } = this.state;
    return (
      <FormFieldText
        {...this.props}
        type={type}
        iconRight={
          !disabled &&
          <Btn
            tagName="span"
            className="Btn--square"
            data-tip={type ? 'Show' : 'Hide'}
            data-tip-right
            onClick={this.handleTypeToggle}
          >
            <Icon glyph="eye" style={{ opacity: type ? 0.8 : 0.2 }} />
          </Btn>
        }
      />
    );
  }
}

export default FormFieldPassword;
