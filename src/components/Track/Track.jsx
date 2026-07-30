import "./Track.css";

function Track({ name, artist, album }) {
  return (
    <article className="track">
      <div className="track-info">
        <h3>{name}</h3>
        <p>{artist} | {album}</p>
      </div>

      <button
        className="track-action"
        type="button"
        aria-label={`Add ${name} to playlist`}
      >
        +
      </button>
    </article>
  );
}

export default Track;