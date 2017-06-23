import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';

class Collapsible extends Component {

  state = {
    isExpanded: this.props.expanded || false,
    isAnimating: false,
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.expanded !== this.props.expanded) {
      this.handleToggle(null, nextProps.expanded);
    }
  }

  handleToggle = (ev, forceToggle) => {
    let { isExpanded } = this.state;
    let willExpand = typeof forceToggle === 'boolean' ? forceToggle : !isExpanded;
    this.setState({ isExpanded: willExpand, isAnimating: true });

    if (willExpand) {
      this.props.onExpand();
    } else {
      this.props.onCollapse();
    }

    setTimeout(() => { // allow CSS in/out animation
      if (this.el) { // check if still mounted
        this.setState({ isAnimating: false });
      }
    }, this.props.animation);
  }

  render () { // eslint-disable-line complexity
    let {
      className, style, children, header, disabled, headerClickable, direction, tabIndex,
    } = this.props;
    let { isExpanded, isAnimating } = this.state;
    className += isExpanded ? ' isExpanded' : ' isCollapsed';
    className += isAnimating ? ' isAnimating' : '';
    className += disabled ? ' isDisabled' : '';
    let btnClassName = 'Collapsible-btn--' + direction;
    btnClassName += headerClickable ? ' isFull' : '';

    return (
      <div className={'Collapsible ' + className}
        style={style} ref={c => this.el = c}
      >
        <header className="Collapsible-header">
          {header}
          <button className={'Collapsible-btn ' + btnClassName}
            type="button" disabled={disabled} tabIndex={tabIndex}
            onClick={this.handleToggle.bind(this)}
          >
            <Icon className="Icon--btn" glyph="chevron-down" />
          </button>
        </header>

        {(isExpanded || isAnimating) &&
          <div className="Collapsible-content">
            {children}
          </div>
        }
      </div>
    );
  }
}

Collapsible.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  expanded: PropTypes.bool,
  children: PropTypes.node,
  header: PropTypes.node.isRequired,
  headerClickable: PropTypes.bool,
  animation: PropTypes.number,
  direction: PropTypes.oneOf(['up', 'down']),

  onCollapse: PropTypes.func,
  onExpand: PropTypes.func,
};

Collapsible.defaultProps = {
  className: '',
  animation: 700,
  headerClickable: false,
  direction: 'down',

  onCollapse () {},
  onExpand () {},
};

export default Collapsible;
