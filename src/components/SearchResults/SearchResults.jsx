import "./SearchResults.css";

function SearchResults() {
  return (
    <section className="results-panel" aria-labelledby="results-heading">
      <div className="panel-header">
        <h2 id="results-heading">Search Results</h2>
        <span>0 tracks</span>
      </div>

      <p className="empty-message">
        Search for music to see matching tracks.
      </p>
    </section>
  );
}

export default SearchResults;