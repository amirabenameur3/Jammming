import TrackList from "../TrackList/TrackList";
import "./SearchResults.css";

function SearchResults({ tracks, onAdd, hasSearched, playlistTracks, isSearching }) {
  return (
    <section className="results-panel" aria-labelledby="results-heading">
      <div className="panel-header">
        <h2 id="results-heading">Search Results</h2>
        <span>
          {tracks.length} {tracks.length === 1 ? "track" : "tracks"}
        </span>
      </div>

      {isSearching ? (
        <p className="loading-message">
          Searching Spotify...
        </p>
      ) : tracks.length > 0 ? (
        <TrackList
          tracks={tracks}
          playlistTracks={playlistTracks}
          onAdd={onAdd}
        />
      ) : (
        <p className="empty-message">
          {hasSearched
            ? "No tracks found. Try another song, artist, or album."
            : "Search for music to see matching tracks."}
        </p>
      )}
    </section>
  );
}

export default SearchResults;