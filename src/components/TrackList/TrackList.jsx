import Track from "../Track/Track";
import "./TrackList.css";

function TrackList({ tracks, playlistTracks = [], isRemoval = false, onAdd, onRemove }) {
  return (
    <div className="track-list">
      {tracks.map((track) => {
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
            isRemoval={isRemoval}
            isAdded={isAdded}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        );
      })}      
    </div>
  );
}

export default TrackList;