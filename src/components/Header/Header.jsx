import "./Header.css";

function Header() {
  return (
    <header className="site-header">
      <a className="site-logo" href="/" aria-label="Jammming home">
        <span aria-hidden="true">♫</span>
        <span>Jammming</span>
      </a>
    </header>
  );
}

export default Header;