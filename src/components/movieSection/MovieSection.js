import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

import _get from 'lodash/get';

//styles
import './movieSection.css';

const EMPTY_OBJECT_READ_ONLY = {};

class Movie extends PureComponent {
  watchListAddAction = () => {
    const { props } = this;
    props.changeWatchlist(props, 'add');
  };

  watchListRemoveAction = () => {
    const { props } = this;
    props.changeWatchlist(props, 'remove');
  };

  render() {
    const { props } = this,
      showAddOption = !props.watchListById.find(id => id === props.id);

    return (
      <div className="movie-item">
        <div className="movie-header">
          <div className="movie-name">{_get(props, 'original_title', '')}</div>
          {
            showAddOption ?
              <div className="add-watchlist" title="Add to Watchlist" onClick={this.watchListAddAction}>{'+'}</div> :
              <div className="remove-watchlist" title="Remove from Watchlist"
                onClick={this.watchListRemoveAction}>{'-'}</div>
          }
        </div>
        <div className="movie-details">
          <div>{_get(props, 'vote_average', '')}</div>
          <div>{_get(props, 'release_date', '')}</div>
        </div>
      </div>
    )
  }
}

class MovieSection extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    page: PropTypes.number
  };

  static defaultProps = {
    watchListById: [],
    page: 1
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false
    };
  }

  componentWillMount() {
    const that = this;

    // to show movies in watchlist
    if (that.props.topMovies) {
      that.topMovies = that.props.topMovies;
      this.setState({ isLoaded: true });
    } else {
      // to make the get call and show movie in movie sections on main screen
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = that.handleRequest;
      xhttp.open("GET", `${that.props.url}&page=${that.props.page}`, true);
      xhttp.send();
    }
  }

  componentWillReceiveProps(newProps) {
    const that = this;

    if (newProps.topMovies) {
      that.topMovies = newProps.topMovies;
    }

    if (newProps.page !== that.props.page || newProps.url !== that.props.url) {
      // to make the get call and show movie in movie sections on main screen
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = that.handleRequest;
      xhttp.open("GET", `${newProps.url}&page=${newProps.page}`, true);
      xhttp.send();
      this.setState({isLoaded: false});
    }
  }

  handleRequest = e => {
    const { sortFunc } = this.props;
    if (e.target.readyState === 4 && e.target.status === 200) {
      this.topMovies = sortFunc ? JSON.parse(_get(e, 'target.response', EMPTY_OBJECT_READ_ONLY)).results.sort(sortFunc) : JSON.parse(_get(e, 'target.response', EMPTY_OBJECT_READ_ONLY)).results;

      this.setState({ isLoaded: true });
    }
  };

  render() {
    const that = this,
      { props } = that,
      topMovies = props.loadMainScreen ? that.topMovies : (props.topMovies || (that.topMovies || []).slice(0, 10));

    return (
      <div className={cx("movie-section", { watchList: !!that.props.topMovies })}>
        {
          props.headerLbl ? <div className="header">
            {props.headerLbl}
          </div> : null
        }
        <div className="movie-list">
          {
            that.state.isLoaded ? (topMovies.length ? topMovies.map(movie => <Movie
              {...movie}
              watchListById={props.watchListById}
              changeWatchlist={props.changeWatchlist}
            />) : <div className="list-loader">{'Empty List'}</div>) : <div className="list-loader">{'Loading...'}</div>
          }
        </div>
        {
          (props.topMovies || !!props.loadMainScreen) ? null : <a onClick={() => props.loadFullView(props)} className="load-btn">{'Load More'}</a>
        }
      </div>
    )
  }
}

export default MovieSection;
