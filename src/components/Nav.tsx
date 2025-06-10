import { Link, useLocation } from 'react-router-dom';

const Nav = () => {
  // TODO: Add necessary code to display the navigation bar and link between the pages
  const currentPath = useLocation().pathname;

  return (
    <nav className="nav">
      <div className="nav-container">
        <h1 className="nav-brand">GitHub Talent Finder</h1>
        <ul className="nav-list">
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
            >
              Search Candidates
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/SavedCandidates"
              className={`nav-link ${currentPath === '/SavedCandidates' ? 'active' : ''}`}
            >
              Saved Candidates
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;