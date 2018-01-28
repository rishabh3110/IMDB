import React, { PureComponent } from 'react';
import _get from 'lodash/get';

import Input from '../formComponents/input';

import './searchbar.css';

class SearchBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      searchResult: []
    };
    this.debounceTimeout = null;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    const that = this;

    if (that.wrapperRef && !that.wrapperRef.contains(event.target)) {
      that.setState({search: []});
    }
  };

  handleRequest = e => {
    if (e.target.readyState === 4 && e.target.status === 200) {
      const searchResult = JSON.parse(_get(e, 'target.response', {})).results;

      this.setState({ searchResult: searchResult.slice(0, 6) });
    }
  };

  searchString = search => {
    if (!search.length) {
      return;
    }

    const that = this,
      xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = that.handleRequest;
    xhttp.open("GET", `https://api.themoviedb.org/3/search/multi?api_key=f1246e893152d3035b66297f7c65314e&language=en-US&page=1&query="${search}"`, true);
    xhttp.send();
  };

  onValueChange = value => {
    const that = this;

    clearTimeout(that.debounceTimeout);
    that.setState(value, () => that.debounceTimeout = setTimeout(() => that.searchString(value.search), 250));
  };

  setWrapperRef = node => {this.wrapperRef = node};

  render() {
    const that = this,
      { searchResult, search } = that.state;

    return (
      <div
        ref={that.setWrapperRef}
      >
        <Input
          dataKey="search"
          value={search}
          type="text"
          onChange={that.onValueChange}
          placeholder="Search movies, actor here"
        />
        {
          (searchResult.length && search.length) ? <div className="search-results">
            {
              searchResult.map(res => (
                <div className="search-item">
                  <div className="item-name">{res.original_title || res.name}</div>
                  <div className="item-type">{res.media_type}</div>
                </div>
              ))
            }
          </div> : null
        }
      </div>
    )
  }
}

export default SearchBar;
