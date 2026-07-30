import "./SearchBar.css";

function SearchBar() {
  return (
    <section className="search-section" aria-labelledby="search-heading">
      <h1 id="search-heading">Find your next favorite track</h1>

      <div className="search-controls">
        <label htmlFor="track-search">Search Spotify</label>

        <div className="search-input-group">
          <input
            id="track-search"
            type="search"
            placeholder="Search by song, artist, or album"
          />

          <button type="button">Search</button>
        </div>
      </div>
    </section>
  );
}

export default SearchBar;