import React from 'react';
import './ProfileResultsPage.css';

const ProfileResultsPage = ({ profileData, onRestart }) => {
  if (!profileData) {
    return <div>Loading profile results...</div>;
  }

  const { profile_name, profile_description, all_profiles, personalized_message } = profileData;

  // Sort profiles by score for display
  const sortedProfiles = Object.entries(all_profiles)
    .sort(([,a], [,b]) => b - a)
    .map(([key, value]) => ({ key, value }));

  return (
    <div className="profile-results-page">
      <div className="results-container">
        {/* Header Section */}
        <div className="results-header">
          <h1>Öğrenme Profiliniz</h1>
          <div className="main-profile">
            <h2 className="profile-name">{profile_name}</h2>
            <p className="profile-description">{profile_description}</p>
          </div>
        </div>

        {/* Profile Scores Section */}
        <div className="profile-scores">
          <h3>Profil Analizi</h3>
          <div className="scores-grid">
            {sortedProfiles.map(({ key, value }) => (
              <div key={key} className="score-item">
                <div className="score-bar">
                  <div 
                    className="score-fill"
                    style={{ width: `${(value / 100) * 100}%` }}
                  ></div>
                </div>
                <div className="score-info">
                  <span className="score-label">{key.replace('_', ' ').toUpperCase()}</span>
                  <span className="score-value">{Math.round(value)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Message Section */}
        <div className="personalized-message">
          <h3>Kişiselleştirilmiş Analiz</h3>
          <div className="message-content">
            {personalized_message.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="results-actions">
          <button className="restart-button" onClick={onRestart}>
            Yeni Analiz Başlat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileResultsPage;