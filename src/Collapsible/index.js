import React, { Component, PropTypes } from 'react';

import Icon from '../Icon';

class Collapsible extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isExpanded: props.expanded || false,
      isAnimating: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expanded !== this.props.expanded) {
      this.handleToggle(null, nextProps.expanded);
    }
  }

  handleToggle(ev, forceToggle) {
    let { isExpanded } = this.state;
    let willExpand = typeof forceToggle === 'boolean' ? forceToggle : !isExpanded;
    this.setState({ isExpanded: willExpand, isAnimating: true });

    if (willExpand) {
      this.props.onExpand();
    } else {
      this.props.onCollapse();
    }

    setTimeout(() => { // allow CSS in/out animation
      if (this.refs.collapsible) { // check if still mounted
        this.setState({ isAnimating: false });
      }
    }, this.props.animation);
  }

  render() {
    let { className, children, header, disabled } = this.props;
    let { isExpanded, isAnimating } = this.state;
    className += isExpanded ? ' isExpanded' : ' isCollapsed';
    className += isAnimating ? ' isAnimating' : '';
    className += disabled ? ' isDisabled' : '';

    return (
      <div className={'Collapsible ' + className} ref="collapsible">
        <header className="Collapsible-header">
          {header}
          <button className="Collapsible-btn"
            type="button" disabled={disabled}
            onClick={this.handleToggle.bind(this)}
          >
            <Icon glyph="chevron-down" />
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
  header: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  expanded: PropTypes.bool,
  children: PropTypes.node,
  animation: PropTypes.number,

  onCollapse: PropTypes.func,
  onExpand: PropTypes.func,
};

Collapsible.defaultProps = {
  className: '',
  animation: 700,

  onCollapse() {},
  onExpand() {},
};

export default Collapsible;
