import { useState, useEffect } from "react";
import { redirectToSpotifyLogin, exchangeCodeForToken, searchSpotify, createPlaylist, addTracksToPlaylist, } from "./services/spotify.js";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResults from "./components/SearchResults/SearchResults";
import Playlist from "./components/Playlist/Playlist";
import Toast from "./components/Toast/Toast";
import Footer from "./components/Footer/Footer";
import "./App.css";

function App() {
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(() => {
    return Boolean(localStorage.getItem("spotify_access_token"));
  });

  const [searchResults, setSearchResults] = useState([]);

  const [playlistTracks, setPlaylistTracks] = useState([]);

  const [playlistName, setPlaylistName] = useState("My Awesome Playlist");

  const [searchTerm, setSearchTerm] = useState("");

  const [hasSearched, setHasSearched] = useState(false);

  const [isSearching, setIsSearching] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  
  const [toast, setToast] = useState({message: "", type: "success",});

  useEffect(() => {
    async function authenticateSpotify() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      
      try {
        if (code) {
          await exchangeCodeForToken(code);
          
          setIsSpotifyConnected(true);
          
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          
          setToast({
            message: "Spotify connected successfully.",
            type: "success",
          });
          
          return;
        }
        
        const accessToken = localStorage.getItem("spotify_access_token");
        const refreshToken = localStorage.getItem("spotify_refresh_token");
        
        if (accessToken || refreshToken) {
          setIsSpotifyConnected(true);
        }
      } catch (error) {
        console.error("Spotify authentication failed:", error);
        
        setIsSpotifyConnected(false);
        
        setToast({
          message: "Could not connect to Spotify. Please try again.",
          type: "error",
        });
      }
    }
    
    authenticateSpotify();
  }, []);

  function disconnectSpotify() {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    localStorage.removeItem("spotify_token_expires_at");
    localStorage.removeItem("spotify_code_verifier");

    setIsSpotifyConnected(false);
    setSearchResults([]);
    setPlaylistTracks([]);
    setHasSearched(false);

    setToast({
      message: "Disconnected from Spotify.",
      type: "success",
    });
  }

  function handleSpotifyConnection() {
    if (isSpotifyConnected) {
      disconnectSpotify();
      return;
    }
    
    redirectToSpotifyLogin();
  }

  function addTrack(track) {
    setPlaylistTracks((prevTracks) => {
      const isAlreadyAdded = prevTracks.some(
        (playlistTracks) => playlistTracks.id === track.id
      );

      if(isAlreadyAdded) {
        return prevTracks;
      }

      return [...prevTracks, track];
    });
  }

  function removeTrack(track) {
    setPlaylistTracks((prevTracks) => 
      prevTracks.filter(
        (playlistTrack) => playlistTrack.id !== track.id
      )
    );
  }

  async function savePlaylist() {
  const cleanPlaylistName = playlistName.trim();

  if (!cleanPlaylistName || playlistTracks.length === 0 || isSaving) {
    return;
  }

  setIsSaving(true);

  try {
    const playlist = await createPlaylist(cleanPlaylistName);

    const trackUris = playlistTracks
      .map((track) => track.uri)
      .filter(Boolean);

    if (trackUris.length === 0) {
      throw new Error("No valid Spotify tracks were found.");
    }

    await addTracksToPlaylist(playlist.id, trackUris);

    showToast(
      "Your playlist has been saved to Spotify.",
      "success"
    );

    setPlaylistName("My Awesome Playlist");
    setPlaylistTracks([]);
    setSearchResults([]);
    setSearchTerm("");
    setHasSearched(false);

  } catch (error) {
    console.error("Could not save playlist:", error);

    showToast(
      error.message ||
        "The playlist could not be saved. Please try again.",
      "error"
    );
  } finally {
    setIsSaving(false);
  }
}

  async function performSearch() {
    const query = searchTerm.trim();
    
    if (!query || isSearching) {
      return;
    }

    setIsSearching(true);
    
    try {
      const tracks = await searchSpotify(query);
      setSearchResults(tracks);
      setHasSearched(true);
    } catch (error) {
      console.error("Spotify search failed:", error);
      setSearchResults([]);
      setHasSearched(true);
      showToast(
        error.message || "Could not search Spotify.",
        "error"
      );
    } finally {
      setIsSearching(false);
    }
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    
    setTimeout(() => {
      setToast({
        message: "",
        type: "success",
      });
    }, 4000);
  }

  return (
    <div className="app">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />

      <Header 
        isSpotifyConnected={isSpotifyConnected}
        onSpotifyConnection={handleSpotifyConnection}
      />

      <main>
        <SearchBar 
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={performSearch}
          isSearching={isSearching}
        />

        <div className="workspace">
          <SearchResults 
            tracks={searchResults} 
            onAdd={addTrack}
            hasSearched={hasSearched}
            playlistTracks={playlistTracks}
            isSearching={isSearching}
          />
          <Playlist 
            tracks={playlistTracks} 
            playlistName={playlistName}
            onNameChange={setPlaylistName}
            onRemove={removeTrack}
            onSave={savePlaylist}
            isSaving={isSaving}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;