import TrackList from "../TrackList/TrackList";
import SearchSkeleton from "../SearchSkeleton/SearchSkeleton";
import "./SearchResults.css";

function SearchResults({ tracks, onAdd, hasSearched, playlistTracks, isSearching, sortOption, onSortChange }) {
  return (
    <section className="search-results-panel" aria-labelledby="search-results-heading">
      <div className="panel-header">
        <h2 id="search-results-heading">Search Results</h2>

        <div className="search-results-controls">
          <label htmlFor="sort-results">Sort by</label>

          <select
            id="sort-results"
            value={sortOption}
            onChange={(event) => onSortChange(event.target.value)}
          >
            <option value="default">Default</option>
            <option value="track">Track name</option>
            <option value="artist">Artist</option>
            <option value="album">Album</option>
            <option value="duration">Duration</option>
          </select>

          <span>
            {tracks.length} {tracks.length === 1 ? "track" : "tracks"}
          </span>
        </div> 
      </div>

      {isSearching ? (
        <SearchSkeleton />
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