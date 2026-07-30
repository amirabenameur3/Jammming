import "./Playlist.css";

function Playlist() {
  return (
    <section className="playlist-panel" aria-labelledby="playlist-heading">
      <div className="panel-header">
        <h2 id="playlist-heading">Your Playlist</h2>
        <span>0 tracks</span>
      </div>

      <label htmlFor="playlist-name">Playlist name</label>

      <input
        id="playlist-name"
        type="text"
        defaultValue="My Awesome Playlist"
      />

      <p className="empty-message">
        Add tracks from the search results to build your playlist.
      </p>

      <button type="button" disabled>
        Save to Spotify
      </button>
    </section>
  );
}

export default Playlist;