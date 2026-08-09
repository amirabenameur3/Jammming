import Track from "../Track/Track";
import "./TrackList.css";

function TrackList({ 
  tracks, 
  playlistTracks = [], 
  isRemoval = false, 
  onAdd, 
  onRemove, 
  onReorder 
}) {
  
  function handleDragStart(event, index) {
    event.dataTransfer.setData("text/plain", index);
    event.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(event, toIndex) {
    event.preventDefault();
    event.stopPropagation();

    const fromIndex = Number(
      event.dataTransfer.getData("text/plain")
    );

    if (fromIndex === toIndex) {
      return;
    }

    onReorder(fromIndex, toIndex);
  }
  
  return (
    <div className="track-list">
      {tracks.map((track, index) => {
        const isAdded = playlistTracks.some(
          (playlistTrack) => playlistTrack.id === track.id
        );

        return (
          <Track
            key={track.id}
            track={track}
            name={track.name}
            artist={track.artist}
            album={track.album}
            image={track.image}
            duration={track.duration}
            spotifyUrl={track.spotifyUrl}
            isRemoval={isRemoval}
            isAdded={isAdded}
            onAdd={onAdd}
            onRemove={onRemove}
            draggable={isRemoval}
            onDragStart={(event) =>
              handleDragStart(event, index)
            }
            onDragOver={handleDragOver}
            onDrop={(event) =>
              handleDrop(event, index)
            }
          />
        );
      })}      
    </div>
  );
}

export default TrackList;