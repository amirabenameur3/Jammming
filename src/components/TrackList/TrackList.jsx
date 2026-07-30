import Track from "../Track/Track";
import "./TrackList.css";

function TrackList({ tracks }) {
  return (
    <div className="track-list">
      {tracks.map((track) => (
        <Track 
          key={track.id}
          name={track.name}
          artist={track.artist}
          album={track.album}
        />
      ))}      
    </div>
  );
}

export default TrackList;