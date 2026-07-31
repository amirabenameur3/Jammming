import TrackList from "../TrackList/TrackList";
import "./Playlist.css";

function Playlist() {
  const playlistTracks = [
    {
      id: 4,
      name: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
    },
    {
      id: 5,
      name: "Watermelon Sugar",
      artist: "Harry Styles",
      album: "Fine Line",
    },
  ];

  return (
    <section className="playlist-panel" aria-labelledby="playlist-heading">
      <div className="panel-header">
        <h2 id="playlist-heading">Your Playlist</h2>
        <span>{playlistTracks.length} tracks</span>
      </div>

      <label htmlFor="playlist-name">Playlist name</label>

      <input
        id="playlist-name"
        type="text"
        defaultValue="My Awesome Playlist"
      />

      {playlistTracks.length > 0 ? (
        <TrackList 
          tracks={playlistTracks}
          isRemoval
        />
      ) : (
        <p className="empty-message">
          Add tracks from the search results to build your playlist.
        </p>
      )}
      
      <button className="save-button" type="button">
        Save to Spotify
      </button>
    </section>
  );
}

export default Playlist;