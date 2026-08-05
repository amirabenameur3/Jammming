import { useState, useEffect } from "react";
import { redirectToSpotifyLogin, exchangeCodeForToken, searchSpotify, createPlaylist, addTracksToPlaylist, } from "./services/spotify.js";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResults from "./components/SearchResults/SearchResults";
import Playlist from "./components/Playlist/Playlist";
import Footer from "./components/Footer/Footer";
import "./App.css";

function App() {
  const [searchResults, setSearchResults] = useState([]);

  const [playlistTracks, setPlaylistTracks] = useState([]);

  const [playlistName, setPlaylistName] = useState("My Awesome Playlist");

  const [searchTerm, setSearchTerm] = useState("");

  const [hasSearched, setHasSearched] = useState(false);

  const [isSearching, setIsSearching] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  
  const [saveMessage, setSaveMessage] = useState("");
  
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    async function authenticate() {
      try {
        await exchangeCodeForToken();
      } catch (error) {
        console.error(error);
      }
    }
    
    authenticate();
  }, []);

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
  setSaveMessage("");
  setSaveError("");

  try {
    const playlist = await createPlaylist(cleanPlaylistName);

    const trackUris = playlistTracks
      .map((track) => track.uri)
      .filter(Boolean);

    if (trackUris.length === 0) {
      throw new Error("No valid Spotify tracks were found.");
    }

    await addTracksToPlaylist(playlist.id, trackUris);

    setSaveMessage(
      "🎉 Your playlist has been saved to Spotify."
    );

    setTimeout(() => {
      setSaveMessage("");
    }, 4000);

    setPlaylistName("My Awesome Playlist");
    setPlaylistTracks([]);
    setSearchResults([]);
    setSearchTerm("");

  } catch (error) {
    console.error("Could not save playlist:", error);

    setSaveError(
      error.message || "The playlist could not be saved. Please try again."
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
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="app">
      <Header />

      <button
        type="button"
        onClick={redirectToSpotifyLogin}
      >
        Connect Spotify
      </button>

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
            saveMessage={saveMessage}
            saveError={saveError}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;