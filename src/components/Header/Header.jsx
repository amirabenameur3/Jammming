import "./Header.css";
import { FaSpotify } from "react-icons/fa";

function Header({ isSpotifyConnected, onSpotifyConnection }) {
  return (
    <header className="site-header">
      <a 
        className="site-logo" 
        href="/" 
        aria-label="Jammming home"
        >
          <span aria-hidden="true">♫</span>
          <span className="logo-text">
            Ja<span className="logo-accent">mmm</span>ing
          </span>
      </a>

      <button
        className={`spotify-pill ${
          isSpotifyConnected ? "connected" : ""
        }`}  
        type="button"
        onClick={onSpotifyConnection}
        aria-label={
          isSpotifyConnected
            ? "Disconnect from Spotify"
            : "Connect to Spotify"
        }
        title={
          isSpotifyConnected
            ? "Click to disconnect from Spotify"
            : "Connect your Spotify account"
        }
      >
        <FaSpotify
          className="spotify-logo"
          aria-hidden="true"
        />

        <span 
          className="spotify-status"
          aria-hidden="true"
        />

        <span className="spotify-label">
          {isSpotifyConnected
            ? "Spotify Connected"
            : "Connect Spotify"}
        </span>
      </button>
    </header>
  );
}

export default Header;