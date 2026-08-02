import TrackList from "../TrackList/TrackList";
import "./Playlist.css";

function Playlist({ tracks, playlistName, onNameChange, onRemove, onSave, isSaving, saveMessage, saveError }) {
  return (
    <section className="playlist-panel" aria-labelledby="playlist-heading">
      <div className="panel-header">
        <h2 id="playlist-heading">Your Playlist</h2>
        <span>
          {tracks.length}{" "}
          {tracks.length === 1 ? "track" : "tracks"}
        </span>
      </div>

      <label htmlFor="playlist-name">Playlist name</label>

      <input
        id="playlist-name"
        type="text"
        value={playlistName}
        onChange={(event) => onNameChange(event.target.value)}
      />

      {tracks.length > 0 ? (
        <TrackList 
          tracks={tracks} 
          isRemoval 
          onRemove={onRemove}
        />
      ) : (
        !saveMessage && (
          <p className="empty-message">
            Add tracks from the search results to build your playlist.
          </p>
        )
      )}

      {saveMessage && (
        <p className="save-message" role="status">
          {saveMessage}
        </p>
      )}
      
      {saveError && (
        <p className="save-error" role="alert">
          {saveError}
        </p>
      )}

      <button
        className="save-button"
        type="button"
        onClick={onSave}
        disabled={tracks.length === 0 || playlistName.trim() === "" || isSaving}
      >
        {isSaving ? "⏳ Saving..." : "Save to Spotify"}
      </button>
    </section>
  );
}

export default Playlist;