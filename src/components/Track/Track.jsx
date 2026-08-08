import "./Track.css";

function Track({ track, name, artist, album, image, duration, spotifyUrl, isRemoval, isAdded, onAdd, onRemove, draggable, onDragStart, onDragOver, onDrop }) {

  function handleClick() {
    if (isRemoval) {
      onRemove(track);
      return;
    } 
    
    if (!isAdded) {
      onAdd(track);
    }
  }

  function formatDuration(milliseconds) {
    if (typeof milliseconds !== "number") {
      return "--:--";
    
    }
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
  
  return (
    <article 
      className="track"
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <a
        className="track-image-link"
        href={spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${name} by ${artist} on Spotify`}
      >
        <img 
          className="track-image"
          src={image}
          alt={`${album} album cover`}
        />
      </a>
      
      <div className="track-info">
        <h3>{name}</h3>
        <p>{artist} | {album}</p>
      </div>

      <span className="track-duration">
        {formatDuration(duration)}
      </span>

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