import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResults from "./components/SearchResults/SearchResults";
import Playlist from "./components/Playlist/Playlist";
import Footer from "./components/Footer/Footer";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />

      <main>
        <SearchBar />

        <div className="workspace">
          <SearchResults />
          <Playlist />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;