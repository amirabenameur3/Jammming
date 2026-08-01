import "./Track.css";

function Track({ track, name, artist, album, isRemoval, isAdded, onAdd, onRemove }) {
  function handleClick() {
    if (isRemoval) {
      onRemove(track);
      return;
    } 
    
    if (!isAdded) {
      onAdd(track);
    }
  }
  
  return (
    <article className="track">
      <div className="track-info">
        <h3>{name}</h3>
        <p>{artist} | {album}</p>
      </div>

      <button
        className="track-action"
        type="button"
        onClick={handleClick}
        disabled={!isRemoval && isAdded}
        aria-label={
          isRemoval
            ? `Remove ${name} from playlist`
            : isAdded
              ? `${name} is already in the playlist`
              : `Add ${name} to playlist`
        }
      >
        {isRemoval ? "-" : isAdded ? "✓" : "+"}
      </button>
    </article>
  );
}

export default Track;