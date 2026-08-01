import "./SearchBar.css";

function SearchBar({ searchTerm, onSearchTermChange, onSearch }) {

  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <section className="search-section" aria-labelledby="search-heading">
      <h1 id="search-heading">Find your next favorite track</h1>

      <form className="search-controls" onSubmit={handleSubmit}>
        <label htmlFor="track-search">Search Spotify</label>

        <div className="search-input-group">
          <input
            id="track-search"
            type="search"
            placeholder="Search by song, artist, or album"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
          />

          <button type="submit">Search</button>
        </div>
      </form>
    </section>
  );
}

export default SearchBar;