import { useState } from "react";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResults from "./components/SearchResults/SearchResults";
import Playlist from "./components/Playlist/Playlist";
import Footer from "./components/Footer/Footer";
import "./App.css";

const allTracks = [
  {
    id: 1,
    name: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
  },
  {
    id: 2,
    name: "Flowers",
    artist: "Miley Cyrus",
    album: "Endless Summer Vacation",
  },
  {
    id: 3,
    name: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
  },
];

function App() {
  const [searchResults, setSearchResults] = useState(allTracks);

  const [playlistTracks, setPlaylistTracks] = useState([
    {
      id: 4,
      name: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
    },
    {
      id: 5,
      name: "Watermelon Sugar",
      artist: "Harry Styles",
      album: "Fine Line",
    },
  ]);

  const [playlistName, setPlaylistName] = useState("My Awesome Playlist");

  const [searchTerm, setSearchTerm] = useState("");

  const [hasSearched, setHasSearched] = useState(false);

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

    setSearchTerm("");
    setSearchResults(allTracks);
  }

  function removeTrack(track) {
    setPlaylistTracks((prevTracks) => 
      prevTracks.filter(
        (playlistTrack) => playlistTrack.id !== track.id
      )
    );
  }

  function savePlaylist() {
    console.log("Playlist name:", playlistName);
    console.log("Playlist tracks:", playlistTracks);
  }

  function performSearch() {
    const query = searchTerm.trim().toLowerCase();

    setHasSearched(true);

    if (!query) {
      setSearchResults(allTracks);
      return;
    }

    const filteredTracks = allTracks.filter((track) => {
      return (
        track.name.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query) ||
        track.album.toLowerCase().includes(query)
      );
    });

    setSearchResults(filteredTracks);
  }

  return (
    <div className="app">
      <Header />

      <main>
        <SearchBar 
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={performSearch}
        />

        <div className="workspace">
          <SearchResults 
            tracks={searchResults} 
            onAdd={addTrack}
            hasSearched={hasSearched}
            playlistTracks={playlistTracks}
          />
          <Playlist 
            tracks={playlistTracks} 
            playlistName={playlistName}
            onNameChange={setPlaylistName}
            onRemove={removeTrack}
            onSave={savePlaylist}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;