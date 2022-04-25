import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import PlayListUser from '../PlayListUser/PlayListUser';

import PlayList from '../PlayList/PlayList';
import './App.css';

import Spotify from '../../util/Spotify';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      searchResults : [],
      playListName: 'Metal',
      playListTracks: [],
      playlistList: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlayListName = this.updatePlayListName.bind(this);
    this.savePlayList = this.savePlayList.bind(this);
    this.search = this.search.bind(this);
    this.playlistUser = this.playlistUser.bind(this);
  }

  addTrack(track){
    let tracks = this.state.playListTracks;
    if(tracks.find(savedTrack => savedTrack.id === track.id)){
      return
    }
    tracks.push(track);
    this.setState({
      playListTracks: tracks
    })
  }

  removeTrack(track) {
    let tracks = this.state.playListTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);

    this.setState({
      playListTracks: tracks
    })
  }

  updatePlayListName(name){
    this.setState({
      playListName: name
    })
  }

  savePlayList(){
    const trackURIs = this.state.playListTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playListName, trackURIs).then(() => {
      this.setState({
        playListName: 'New Playlist',
        playListTracks: []
      })
    })
  }

  search(term){
    Spotify.search(term).then(schResults => {
      this.setState({searchResults: schResults})
    });
  }

  playlistUser(){
    Spotify.playlistUser().then(playlistItems => {
      this.setState({playlistList: playlistItems})
    })
  }

  render(){
    return(
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
         
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
         
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={ this.addTrack } 
            />
           
            <PlayList 
              playListName={ this.state.playListName } 
              playListTracks={ this.state.playListTracks }
              onRemove={this.removeTrack}  
              onNameChange={this.updatePlayListName}
              onSave={this.savePlayList}
            />
            <PlayListUser 
              onClick={this.playlistUser} 
              playlistList={this.state.playlistList} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
