import TrackList from "../TrackList/TrackList";
import "./SearchResults.css";

function SearchResults() {
   const tracks = [
    {
      id: 1,
      name: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
    },
    {
      id: 2,
      name: "Flowers",
      artist: "Miley Cyrus",
      album: "Endless Summer Vacation",
    },
    {
      id: 3,
      name: "As It Was",
      artist: "Harry Styles",
      album: "Harry's House",
    },
  ];

  return (
    <section className="results-panel" aria-labelledby="results-heading">
      <div className="panel-header">
        <h2 id="results-heading">Search Results</h2>
        <span>{tracks.length} tracks</span>
      </div>

      <TrackList tracks={tracks} />
    </section>
  );
}

export default SearchResults;