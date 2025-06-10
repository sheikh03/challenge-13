import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import type Candidate from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [candidatePool, setCandidatePool] = useState<Candidate[]>([]);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [poolIndex, setPoolIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize candidate pool
  useEffect(() => {
    fetchCandidatePool();
  }, []);

  // Load detailed candidate info when pool index changes
  useEffect(() => {
    if (candidatePool.length > 0 && poolIndex < candidatePool.length) {
      fetchCandidateDetails(candidatePool[poolIndex].login);
    } else if (poolIndex >= candidatePool.length && candidatePool.length > 0) {
      // Fetch new batch when we run out
      fetchCandidatePool();
    }
  }, [candidatePool, poolIndex]);

  const fetchCandidatePool = async () => {
    setIsLoading(true);
    setErrorMessage('');

    const candidates = await searchGithub();

    if (candidates.length === 0) {
      setErrorMessage('Unable to load candidates. Please check your connection.');
      setIsLoading(false);
      return;
    }

    setCandidatePool(candidates);
    setPoolIndex(0);
    setIsLoading(false);
  };

  const fetchCandidateDetails = async (username: string) => {
    const detailedInfo = await searchGithubUser(username);
    if (detailedInfo) {
      setActiveCandidate(detailedInfo);
    }
  };

  const acceptCandidate = () => {
    if (!activeCandidate) return;

    // Get existing saved candidates
    const existingSaved = localStorage.getItem('savedCandidates');
    const savedList = existingSaved ? JSON.parse(existingSaved) : [];

    // Check for duplicates
    const alreadySaved = savedList.some((saved: Candidate) => saved.id === activeCandidate.id);

    if (!alreadySaved) {
      const candidateWithDate = {
        ...activeCandidate,
        savedDate: new Date().toISOString()
      };
      savedList.push(candidateWithDate);
      localStorage.setItem('savedCandidates', JSON.stringify(savedList));
    }

    moveToNext();
  };

  const rejectCandidate = () => {
    moveToNext();
  };

  const moveToNext = () => {
    setPoolIndex(prevIndex => prevIndex + 1);
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="candidate-section">
        <h1>Candidate Search</h1>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading candidates...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (errorMessage) {
    return (
      <section className="candidate-section">
        <h1>Candidate Search</h1>
        <div className="error-state">
          <p>{errorMessage}</p>
          <button onClick={fetchCandidatePool} className="retry-btn">
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // No more candidates state
  if (!activeCandidate || candidatePool.length === 0) {
    return (
      <section className="candidate-section">
        <h1>Candidate Search</h1>
        <div className="empty-state">
          <h2>No more candidates available</h2>
          <p>We've run out of candidates to show.</p>
          <button onClick={fetchCandidatePool} className="retry-btn">
            Load More Candidates
          </button>
        </div>
      </section>
    );
  }

  // Main render
  return (
    <section className="candidate-section">
      <h1>Candidate Search</h1>

      <div className="candidate-profile">
        <div className="profile-image-container">
          <img
            src={activeCandidate.avatar_url}
            alt={`${activeCandidate.login}'s profile`}
            className="profile-image"
          />
        </div>

        <div className="profile-info">
          <h2 className="profile-name">
            {activeCandidate.name || activeCandidate.login}
          </h2>

          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">@{activeCandidate.login}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Location:</span>
              <span className="info-value">
                {activeCandidate.location || 'Not specified'}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">
                {activeCandidate.email || 'Not specified'}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Company:</span>
              <span className="info-value">
                {activeCandidate.company || 'Not specified'}
              </span>
            </div>

            <div className="info-item full-width">
              <span className="info-label">GitHub Profile:</span>
              <a
                href={activeCandidate.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </div>

        <div className="decision-buttons">
          <button
            onClick={rejectCandidate}
            className="decision-btn reject-btn"
            aria-label="Skip this candidate"
          >
            <span className="btn-icon">−</span>
          </button>
          <button
            onClick={acceptCandidate}
            className="decision-btn accept-btn"
            aria-label="Save this candidate"
          >
            <span className="btn-icon">+</span>
          </button>
        </div>
      </div>

      <div className="progress-indicator">
        Viewing candidate {poolIndex + 1} of {candidatePool.length}
      </div>
    </section>
  );
};

export default CandidateSearch;