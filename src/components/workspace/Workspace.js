import React, { PureComponent } from 'react';
import _get from 'lodash/get';

import cx from 'classnames';

// components
import MovieSection from '../movieSection';
import SearchBar from '../searchBar';

//styles
import './workspace.css';

class Workspace extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showFullView: false,
      page: 1
    }
  }

  goBack = () => {
    this.setState({ showFullView: false, page: 1 });
  };

  loadFullView = oldProps => {
    this.setState({ showFullView: true, oldProps });
  };

  reducePage = () => {
    this.setState({page: this.state.page - 1});
  };

  increasePage = () => {
    this.setState({page: this.state.page + 1});
  };

  render() {
    const that = this,
      { props, state : {page} } = that;

    return (
      <div className="workspace">
        <div className="search-bar">
          <SearchBar />
        </div>
        {
          that.state.showFullView ? <div className="full-view">
            <MovieSection
              {...that.state.oldProps}
              loadMainScreen={that.goBack}
              page={that.state.page}
              watchListById={props.watchListById}
            />
            <div className="pagination">
              <div onClick={that.reducePage} className={cx("prev-page", {disabled: page <= 1})}>{'< Previous'}</div>
              <div>{that.state.page}</div>
              <div onClick={that.increasePage} className="next-page">{'Next >'}</div>
            </div>
            <div onClick={that.goBack} className="load-btn">{'Back'}</div>
          </div> : <div className="movie-sections">
            <MovieSection
              headerLbl="Recently Released"
              watchListById={props.watchListById}
              changeWatchlist={props.changeWatchlist}
              sortFunc={(a, b) => +new Date(_get(b, 'release_date')) - +new Date(_get(a, 'release_date'))}
              url="https://api.themoviedb.org/3/movie/now_playing?api_key=f1246e893152d3035b66297f7c65314e&language=en-US"
              loadFullView={that.loadFullView}
              page={that.state.page}
            />
            <MovieSection
              headerLbl="Top Rated"
              changeWatchlist={props.changeWatchlist}
              watchListById={props.watchListById}
              url="https://api.themoviedb.org/3/movie/top_rated?api_key=f1246e893152d3035b66297f7c65314e&language=en-US"
              loadFullView={that.loadFullView}
              page={that.state.page}
            />
          </div>
        }
      </div>
    )
  }
}

export default Workspace;
