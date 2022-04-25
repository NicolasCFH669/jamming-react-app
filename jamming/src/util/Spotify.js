
const clientID = '06365d6f6d9b44b299da8e7785819a0f';
// const redirectURI = 'http://aback-story.surge.sh';
const redirectURI ='http://localhost:3000';
let accessToken;

const Spotify = {
  getAccessToken () {
    if(accessToken){
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    
    const expiresToken = window.location.href.match(/expires_in=([^&]*)/);

    if(accessTokenMatch && expiresToken) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresToken[1]);

      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    }else {
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessURL;
    }

  },


  async search(term) {
    const accessToken = Spotify.getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const jsonResponse = await response.json();

    if (!jsonResponse.tracks) {
      return [];
    }
    return jsonResponse.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri
    }));
  },

  async playlistUser(){
    const accessToken = Spotify.getAccessToken();
    let userId;
    const response = await fetch(`https://api.spotify.com/v1/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const jsRes = await response.json();
    userId = jsRes.id;
    const res = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const data = await res.json();
    // return data
    if (!data.items){
      return [];
    }

    return data.items
  },

  async savePlaylist(playlistName, trackUris){
    if(!playlistName || !trackUris.length){
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const header = { Authorization: `Bearer ${accessToken}`};
    let userId;

    const response = await fetch('https://api.spotify.com/v1/me/', {
      headers: header
    }
    );
    const jsonResponse = await response.json();
    userId = jsonResponse.id;
    const response_1 = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: header,
      method: 'POST',
      body: JSON.stringify({ name: playlistName })
    });
    const jsonResponse_1 = await response_1.json();
    const playlistId = jsonResponse_1.id;
    return await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
      headers: header,
      method: 'POST',
      body: JSON.stringify({ uris: trackUris })
    });
  }
}

export default Spotify;