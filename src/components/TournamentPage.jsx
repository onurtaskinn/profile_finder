import React from 'react';
import './TournamentPage.css';

const TournamentPage = ({ 
  bracket, 
  currentMatch, 
  onSelectCourse, 
  progressPercentage, 
  roundInfo 
}) => {

    // Helper function to count completed matches
    const getCompletedMatches = (bracket) => {
    if (!bracket) return 0;
    let completed = 0;
    for (let round = 1; round <= 4; round++) {
        const matches = bracket.rounds[round]?.matches || [];
        completed += matches.filter(match => match.completed).length;
    }
    return completed;
    };    
  
  // Handle course selection
  const handleCourseSelect = (courseId) => {
    if (currentMatch && onSelectCourse) {
      onSelectCourse(currentMatch.id, courseId);
    }
  };

  // If no current match, show loading or completion message
  if (!currentMatch) {
    return (
      <div className="tournament-page">
        <div className="tournament-container">
          <div className="tournament-loading">
            <h2>Turnuva hazırlanıyor...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tournament-page">
      {/* Header Section */}

      {/* Main Tournament Container */}
      <div className="tournament-container">
        {/* Left Panel - Tournament Bracket */}
        <div className="bracket-panel">
          <div className="bracket-content">
            <h3 className="bracket-title">Tournament Bracket</h3>
            <div className="bracket-placeholder">
              {/* Bracket visualization will be implemented in Phase 4 */}
              <p>Bracket visualization coming soon...</p>
              <div className="bracket-info">
                <p>Current Round: {bracket?.currentRound || 1}</p>
                <p>Total Rounds: {bracket?.totalRounds || 4}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Voting Area */}
        <div className="voting-panel">
          <div className="tournament-header">
              <h1 className="round-title">{roundInfo?.name || 'Round'}</h1>
              <p className="round-subtitle">{roundInfo?.subtitle || 'Pick your favorite'}</p>
          </div>            
          <div className="voting-content">
            <div className="match-container">
              {/* Course Cards */}
              <div className="course-cards">
                {/* Course 1 */}
                <div 
                  className="course-card"
                  onClick={() => handleCourseSelect(currentMatch.course1.id)}
                >
                  <div className="course-image">
                    <img 
                      src={currentMatch.course1.image} 
                      alt={currentMatch.course1.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/280x200/FF8C00/FFFFFF?text=' + 
                                      encodeURIComponent(currentMatch.course1.name);
                      }}
                    />
                  </div>
                  <div className="course-label">
                    <span>{currentMatch.course1.name}</span>
                  </div>
                </div>

                {/* VS Separator */}
                <div className="vs-separator">
                  <span>VS</span>
                </div>

                {/* Course 2 */}
                <div 
                  className="course-card"
                  onClick={() => handleCourseSelect(currentMatch.course2.id)}
                >
                  <div className="course-image">
                    <img 
                      src={currentMatch.course2.image} 
                      alt={currentMatch.course2.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/280x200/FF8C00/FFFFFF?text=' + 
                                      encodeURIComponent(currentMatch.course2.name);
                      }}
                    />
                  </div>
                  <div className="course-label">
                    <span>{currentMatch.course2.name}</span>
                  </div>
                </div>
              </div>

              {/* Match Info */}
              <div className="match-info">
                <p>Hangi kursu tercih edersiniz?</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
        <div className="progress-container">
            <div className="progress-bar">
                <div 
                className="progress-fill"
                style={{ width: `${(getCompletedMatches(bracket) / 15) * 100}%` }}
                ></div>
            </div>
            <div className="progress-text">
                <span>{getCompletedMatches(bracket)}/15 seçim tamamlandı</span>
            </div>
        </div>
    </div>
  );
};

export default TournamentPage;