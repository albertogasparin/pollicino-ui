import React, { Component } from 'react';

import { withDebounce, withValidation } from '../HOC';
import Btn from '../Btn';
import Icon from '../Icon';
import { FormFieldText } from '../FormFieldText';

/**
 * @class FormFieldPassword
 * @augments {Component<{
      [x:string]: any
      disabled?: boolean
    }, any>}
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
    let { disabled, readOnly } = this.props;
    let { type } = this.state;
    return (
      <FormFieldText
        {...this.props}
        type={type}
        iconRight={
          !disabled &&
          !readOnly && (
            <Btn
              tagName="span"
              className="Btn--square"
              data-tip={type ? 'Show' : 'Hide'}
              data-tip-right
              onClick={this.handleTypeToggle}
            >
              <Icon glyph="eye" style={{ opacity: type ? 0.8 : 0.2 }} />
            </Btn>
          )
        }
      />
    );
  }
}

export default withDebounce(withValidation(FormFieldPassword));
export { FormFieldPassword };
