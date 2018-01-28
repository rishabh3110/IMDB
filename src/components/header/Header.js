import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import _noop from 'lodash/noop';

//components
import MovieSection from '../movieSection';

//styles
import './header.css';

class Header extends PureComponent {
  static propTypes = {
    userId: PropTypes.string,
    userLogout: PropTypes.func,
    watchList: PropTypes.array,
    isValidUser: PropTypes.bool
  };

  static defaultProps = {
    userId: '',
    userLogout: _noop,
    watchList: []
  };

  constructor(props) {
    super(props);
    this.state = {
      showWatchList: false
    }
  }

  onWatchListClick = () => {
    this.setState({ showWatchList: !this.state.showWatchList });
  };

  render() {
    const that = this,
      { props } = that;

    return (
      <div className="header-bg">
        <div className="header-lbl">{'IMDb'}</div>
        {
          props.isValidUser ? <div className="user-details">
            <div className="watchlist">
              <div className="watchList-lbl" onClick={that.onWatchListClick}>{`Watch List (${props.watchList.length})`}</div>
              {
                that.state.showWatchList ? <MovieSection
                  watchListById={props.watchListById}
                  changeWatchlist={props.changeWatchlist}
                  topMovies={props.watchList}
                /> : null
              }
            </div>
            <div className="user">
              <div className="user-id">{props.userId}</div>
              <div className="logout" onClick={props.userLogout}>{'Logout'}</div>
            </div>
          </div> : null
        }
      </div>
    )
  }
}

export default Header;
