import React from 'react';
import './ProfileResultsPage.css';

const ProfileResultsPage = ({ profileData, onRestart }) => {
  if (!profileData) {
    return <div>Loading profile results...</div>;
  }

  const { profile_name, profile_description, female_image_url, male_image_url, all_profiles } = profileData;

    // Calculate total score for percentage calculation
    const totalScore = Object.values(all_profiles).reduce((sum, value) => sum + value, 0);

    // Sort profiles by score and calculate percentages
    const sortedProfiles = Object.entries(all_profiles)
    .sort(([,a], [,b]) => b - a)
    .map(([key, value]) => ({ 
        key, 
        rawValue: value,
        percentage: (value / totalScore) * 100 
    }));

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

        {/* Profile Image Section */}
        <div className="profile-image-section">
          <img 
            src={female_image_url} 
            alt={profile_name}
            className="profile-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x400/DC143C/FFFFFF?text=Profile+Image';
            }}
          />
        </div>        

        {/* Profile Scores Section */}
        <div className="profile-scores">
          <h3>Profil Analizi</h3>
          <div className="scores-grid">
            {sortedProfiles.map(({ key, rawValue, percentage }) => (
              <div key={key} className="score-item">
                <div className="score-bar">
                    <div 
                    className="score-fill"
                    style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                    <div className="score-info">
                        <span className="score-label">{key.replace('_', ' ').toUpperCase()}</span>
                        <span className="score-value">{Math.round(percentage)}%</span>
                    </div>
              </div>
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