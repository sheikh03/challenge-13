import { useState, useEffect } from 'react';
import type { SavedCandidate } from '../interfaces/Candidate.interface';

const SavedCandidates = () => {
  const [savedList, setSavedList] = useState<SavedCandidate[]>([]);

  useEffect(() => {
    loadSavedCandidates();
  }, []);

  const loadSavedCandidates = () => {
    const stored = localStorage.getItem('savedCandidates');
    if (stored) {
      setSavedList(JSON.parse(stored));
    }
  };

  const removeSavedCandidate = (candidateId: number) => {
    const updatedList = savedList.filter(candidate => candidate.id !== candidateId);
    setSavedList(updatedList);
    localStorage.setItem('savedCandidates', JSON.stringify(updatedList));
  };

  // Empty state
  if (savedList.length === 0) {
    return (
      <section className="saved-section">
        <h1>Potential Candidates</h1>
        <div className="empty-saved">
          <h2>No candidates have been accepted</h2>
          <p>Start searching and save candidates you're interested in!</p>
        </div>
      </section>
    );
  }

  // Main render with saved candidates
  return (
    <section className="saved-section">
      <h1>Potential Candidates</h1>
      <p className="saved-count">You have {savedList.length} saved candidate{savedList.length !== 1 ? 's' : ''}</p>

      <div className="candidates-table-wrapper">
        <table className="candidates-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Username</th>
              <th>Location</th>
              <th>Email</th>
              <th>Company</th>
              <th>GitHub</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {savedList.map((candidate) => (
              <tr key={candidate.id} className="candidate-row">
                <td>
                  <img
                    src={candidate.avatar_url}
                    alt={`${candidate.login}'s avatar`}
                    className="table-avatar"
                  />
                </td>
                <td className="name-cell">
                  {candidate.name || 'N/A'}
                </td>
                <td>
                  <span className="username">@{candidate.login}</span>
                </td>
                <td>{candidate.location || 'Not specified'}</td>
                <td className="email-cell">
                  {candidate.email || 'Not specified'}
                </td>
                <td>{candidate.company || 'Not specified'}</td>
                <td>
                  <a
                    href={candidate.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link"
                  >
                    View Profile
                  </a>
                </td>
                <td>
                  <button
                    onClick={() => removeSavedCandidate(candidate.id)}
                    className="remove-btn"
                    aria-label={`Remove ${candidate.login}`}
                  >
                    −
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SavedCandidates;