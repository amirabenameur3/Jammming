import Track from "../Track/Track";
import "./TrackList.css";

function TrackList({ tracks, isRemoval = false }) {
  return (
    <div className="track-list">
      {tracks.map((track) => (
        <Track 
          key={track.id}
          name={track.name}
          artist={track.artist}
          album={track.album}
          isRemoval={isRemoval}
        />
      ))}      
    </div>
  );
}

export default TrackList;