import React from "react";
import TrackList from '../TrackList/TrackList';
import './PlayListUser.css';

class PlayListUser extends React.Component {
  constructor(props){
    super(props);
    
    this.search = this.search.bind(this)
  }

  search(){
    this.props.onClick()
  }

  render() {
    return(
      <div className="PlayListUser">
        <h2>User PlayLists</h2>
        <TrackList tracks={this.props.playlistList} noRemoval={true} />
        <button className="User-save" onClick={this.search}  >
            Your Playlists
        </button>
      </div>
    )
  }
}

export default PlayListUser;