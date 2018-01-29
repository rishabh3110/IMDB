import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import _get from 'lodash/get';

// components
import { Input } from '../formComponents';

// utils
import { credentials } from "../../utils/loginCredentials";

// styles
import './login.css';

const USER_ID = 'userId';
const PASSWORD = 'password';

class Login extends React.PureComponent {
  static propTypes = {
    onLogin: PropTypes.func,
  };

  static defaultProps = {
    onLogin: () => {
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      [USER_ID]: '',
      [PASSWORD]: '',
      showError: false
    };
  }

  onValueChange = value => {
    this.setState(value);
  };

  handleLogin = () => {
    const that = this,
      { state } = that,
      validUser = credentials.find(({ userId, password }) => userId === state[USER_ID] && password === state[PASSWORD]);

    that.setState({ showError: !validUser }, that.props.onLogin(!!validUser, state[USER_ID], JSON.parse(_get(validUser, 'watchList', "[]"))));
  };

  render() {
    const that = this,
      { state } = that;

    return (
      <div className="login-page">
        <div className="input-field">
          <span className="email-lbl">{'Email Id:'}</span>
          <Input
            dataKey={USER_ID}
            value={state[USER_ID]}
            type="email"
            onChange={that.onValueChange}
            placeholder="Enter Email"
          />
        </div>
        <div className="password-input-field">
          <span className="password-lbl">{'Password:'}</span>
          <Input
            dataKey={PASSWORD}
            value={state[PASSWORD]}
            type="password"
            onChange={that.onValueChange}
            placeholder="Enter Password"
          />
        </div>
        <div className="err">
          {state.showError && 'Invalid user or password details. Please try again!'}
        </div>
        <div className={cx('btn-field', {hasErr: state.showError})}>
          <button onClick={that.handleLogin}>{'Login'}</button>
        </div>
      </div>
    );
  }
}

export default Login;
