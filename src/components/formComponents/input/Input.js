import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// styles
import './input.css';

class Input extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    dataKey: PropTypes.string.isRequired,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    type: 'text',
    value: '',
    placeholder: '',
    onChange: () => {}
  };

  getValue() {
    return this.refs['fieldInput'].value;
  }

  handleChange = () => {
    const that = this,
      {props} = that;

    props.onChange({[props.dataKey]: that.getValue()});
  };

  render() {
    const that = this,
      {props} = that;

    return (
      <input
        ref="fieldInput"
        {...props}
        onChange={that.handleChange}
      />)
  }
}

export default Input;
