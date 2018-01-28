import React, { PureComponent } from 'react';

import snackbar from 'node-snackbar';
import '../../../node_modules/node-snackbar/dist/snackbar.css';

//components
import Header from '../header';
import Login from '../login';
import Workspace from '../workspace';

//styles
import './app.css';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isValidUser: false,
      userId: '',
      watchList: []
    }
  }

  componentWillMount() {
    const validUser = JSON.parse(localStorage.getItem('validUser')) || {};
    this.setState({isValidUser: validUser.isValidUser, userId: validUser.userId});
  }

  handleLogin = (isValidUser, userId, watchList) => {
    if(isValidUser) {
      localStorage.setItem('validUser', JSON.stringify({isValidUser, userId}));
    }
    this.setState({isValidUser, userId, watchList});
  };

  userLogout = () => {
    localStorage.setItem('validUser', JSON.stringify({isValidUser: false, userId: ''}));
    this.setState({isValidUser: false, userId: '', watchList: []}, snackbar.show({text: 'User Logged out!', pos: 'bottom-center'}));
  };

  changeWatchlist = (movie, action) => {
    const that = this,
      newWatchList = [...that.state.watchList];

    if (action === 'add') {
      snackbar.show({text: 'Added movie to watch list!', pos: 'bottom-center'});
      that.setState({watchList: [...newWatchList, movie]});
    } else {
      snackbar.show({text: 'Removed movie from watch list!', pos: 'bottom-center'});
      that.setState({watchList: newWatchList.filter(oldMovie => oldMovie.id !== movie.id)});
    }
  };

  getWatchListById = movie => this.state.watchList.map(movie => movie.id);

  render() {
    const that = this,
      {state} = that;

    return (
      <div className="imdb-page">
        <Header
          watchList={state.watchList}
          watchListById={that.getWatchListById()}
          userId={state.userId}
          changeWatchlist={that.changeWatchlist}
          userLogout={that.userLogout}
          isValidUser={state.isValidUser}
        />
        {
          that.state.isValidUser ? <Workspace
              changeWatchlist={that.changeWatchlist}
              watchListById={that.getWatchListById()}
            /> :
            <Login onLogin={that.handleLogin}/>
        }
      </div>
    )
  }
}

export default App;
