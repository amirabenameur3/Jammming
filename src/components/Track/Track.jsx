import "./Track.css";

function Track({ name, artist, album, isRemoval }) {
  return (
    <article className="track">
      <div className="track-info">
        <h3>{name}</h3>
        <p>{artist} | {album}</p>
      </div>

      <button
        className="track-action"
        type="button"
        aria-label={
          isRemoval
            ? `Remove ${name} from playlist`
            : `Add ${name} to playlist`
        }
      >
        {isRemoval ? "-" : "+"}
      </button>
    </article>
  );
}

export default Track;