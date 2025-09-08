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

  // Helper function to render a course node
  const renderCourseNode = (course, isWinner = false, isCurrentMatch = false) => {
    if (!course) {
      return <div className="course-node empty"></div>;
    }
    
    return (
      <div className={`course-node ${isWinner ? 'winner' : ''} ${isCurrentMatch ? 'current-match' : ''}`}>
        <img 
          src={course.image} 
          alt={course.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/60x40/FF8C00/FFFFFF?text=C';
          }}
        />
      </div>
    );
  };

  // Helper function to check if a course is in current match (only direct match, not ancestors)
  const isInCurrentMatch = (course) => {
    if (!currentMatch || !course) return false;
    // Only highlight if this course is directly in the current active match
    return (currentMatch.course1?.id === course.id || currentMatch.course2?.id === course.id) && 
          !currentMatch.completed;
  };

  // Helper function to get winner for a match
  // Fixed helper function to get winner for a match
  const getMatchWinner = (round, matchIndex) => {
    const matches = bracket?.rounds[round]?.matches || [];
    const match = matches[matchIndex];
    if (!match || !match.winner) return null;
    return match.course1.id === match.winner ? match.course1 : match.course2;
  };

  // Helper function to get winners from previous round for pairing
  const getRoundWinners = (round) => {
    const matches = bracket?.rounds[round]?.matches || [];
    return matches.map(match => {
      if (!match.winner) return null;
      return match.course1.id === match.winner ? match.course1 : match.course2;
    }).filter(Boolean);
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
            <div className="tournament-bracket">
              {/* Round 1 Left Side */}
              <div className="bracket-column round-1-left">
                {bracket?.rounds[1]?.matches.slice(0, 4).map((match, index) => (
                  <div key={`r1-left-${index}`} className="bracket-match">
                    <div className="match-pair">
                      {renderCourseNode(match.course1, match.winner === match.course1.id, isInCurrentMatch(match.course1))}
                      {renderCourseNode(match.course2, match.winner === match.course2.id, isInCurrentMatch(match.course2))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Round 2 Left Side */}
              <div className="bracket-column round-2-left">
                {[0, 1].map(index => {
                  const match = bracket?.rounds[2]?.matches[index];
                  return (
                    <div key={`r2-left-${index}`} className="bracket-match">
                      <div className="match-pair">
                        {match ? (
                          <>
                            {renderCourseNode(match.course1, match.winner === match.course1?.id, isInCurrentMatch(match.course1))}
                            {renderCourseNode(match.course2, match.winner === match.course2?.id, isInCurrentMatch(match.course2))}
                          </>
                        ) : (
                          <>
                            {renderCourseNode(null)}
                            {renderCourseNode(null)}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Round 3 Left Side */}
              <div className="bracket-column round-3-left">
                <div className="bracket-match">
                  <div className="match-pair">
                    {bracket?.rounds[3]?.matches[0] ? (
                      <>
                        {renderCourseNode(bracket.rounds[3].matches[0].course1, bracket.rounds[3].matches[0].winner === bracket.rounds[3].matches[0].course1?.id, isInCurrentMatch(bracket.rounds[3].matches[0].course1))}
                        {renderCourseNode(bracket.rounds[3].matches[0].course2, bracket.rounds[3].matches[0].winner === bracket.rounds[3].matches[0].course2?.id, isInCurrentMatch(bracket.rounds[3].matches[0].course2))}
                      </>
                    ) : (
                      <>
                        {renderCourseNode(null)}
                        {renderCourseNode(null)}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Final */}
              <div className="bracket-column final">
                <div className="bracket-match final-match">
                  <div className="match-pair">
                    {bracket?.rounds[4]?.matches[0] ? (
                      <>
                        {renderCourseNode(bracket.rounds[4].matches[0].course1, bracket.rounds[4].matches[0].winner === bracket.rounds[4].matches[0].course1?.id, isInCurrentMatch(bracket.rounds[4].matches[0].course1))}
                        {renderCourseNode(bracket.rounds[4].matches[0].course2, bracket.rounds[4].matches[0].winner === bracket.rounds[4].matches[0].course2?.id, isInCurrentMatch(bracket.rounds[4].matches[0].course2))}
                      </>
                    ) : (
                      <>
                        {renderCourseNode(null)}
                        {renderCourseNode(null)}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Round 3 Right Side */}
              <div className="bracket-column round-3-right">
                <div className="bracket-match">
                  <div className="match-pair">
                    {bracket?.rounds[3]?.matches[1] ? (
                      <>
                        {renderCourseNode(bracket.rounds[3].matches[1].course1, bracket.rounds[3].matches[1].winner === bracket.rounds[3].matches[1].course1?.id, isInCurrentMatch(bracket.rounds[3].matches[1].course1))}
                        {renderCourseNode(bracket.rounds[3].matches[1].course2, bracket.rounds[3].matches[1].winner === bracket.rounds[3].matches[1].course2?.id, isInCurrentMatch(bracket.rounds[3].matches[1].course2))}
                      </>
                    ) : (
                      <>
                        {renderCourseNode(null)}
                        {renderCourseNode(null)}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Round 2 Right Side */}
              <div className="bracket-column round-2-right">
                {[2, 3].map(index => {
                  const match = bracket?.rounds[2]?.matches[index];
                  return (
                    <div key={`r2-right-${index}`} className="bracket-match">
                      <div className="match-pair">
                        {match ? (
                          <>
                            {renderCourseNode(match.course1, match.winner === match.course1?.id, isInCurrentMatch(match.course1))}
                            {renderCourseNode(match.course2, match.winner === match.course2?.id, isInCurrentMatch(match.course2))}
                          </>
                        ) : (
                          <>
                            {renderCourseNode(null)}
                            {renderCourseNode(null)}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>    

              {/* Round 1 Right Side */}
              <div className="bracket-column round-1-right">
                {bracket?.rounds[1]?.matches.slice(4, 8).map((match, index) => (
                  <div key={`r1-right-${index}`} className="bracket-match">
                    <div className="match-pair">
                      {renderCourseNode(match.course1, match.winner === match.course1.id, isInCurrentMatch(match.course1))}
                      {renderCourseNode(match.course2, match.winner === match.course2.id, isInCurrentMatch(match.course2))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Connecting Lines */}
              <svg className="bracket-lines" viewBox="0 0 800 400">
                {/* Round 1 to Round 2 - Left Side */}
                <path d="M 120 60 L 160 60 L 160 90 L 200 90" stroke="#B8860B" strokeWidth="2" fill="none"/>
                <path d="M 120 140 L 160 140 L 160 110 L 200 110" stroke="#B8860B" strokeWidth="2" fill="none"/>
                <path d="M 120 220 L 160 220 L 160 190 L 200 190" stroke="#B8860B" strokeWidth="2" fill="none"/>
                <path d="M 120 300 L 160 300 L 160 270 L 200 270" stroke="#B8860B" strokeWidth="2" fill="none"/>
                
                {/* Round 2 to Round 3 - Left Side */}
                <path d="M 280 100 L 320 100 L 320 140 L 360 140" stroke="#B8860B" strokeWidth="2" fill="none"/>
                <path d="M 280 240 L 320 240 L 320 200 L 360 200" stroke="#B8860B" strokeWidth="2" fill="none"/>
                
                {/* Round 3 to Final - Left Side */}
                <path d="M 440 170 L 480 170 L 480 200 L 520 200" stroke="#B8860B" strokeWidth="2" fill="none"/>
                
                {/* Round 3 to Final - Right Side */}
                <path d="M 600 170 L 640 170 L 640 200 L 680 200" stroke="#B8860B" strokeWidth="2" fill="none"/>
                
                {/* Round 2 to Round 3 - Right Side */}
                <path d="M 520 100 L 560 100 L 560 140 L 600 140" stroke="#B8860B" strokeWidth="2" fill="none"/>
                <path d="M 520 240 L 560 240 L 560 200 L 600 200" stroke="#B8860B" strokeWidth="2" fill="none"/>
                
                {/* Round 1 to Round 2 - Right Side */}
                <path d="M 680 60 L 720 60 L 720 90 L 760 90" stroke="#B8860B" strokeWidth="2" fill="none"/>
                <path d="M 680 140 L 720 140 L 720 110 L 760 110" stroke="#B8860B" strokeWidth="2" fill="none"/>
                <path d="M 680 220 L 720 220 L 720 190 L 760 190" stroke="#B8860B" strokeWidth="2" fill="none"/>
                <path d="M 680 300 L 720 300 L 720 270 L 760 270" stroke="#B8860B" strokeWidth="2" fill="none"/>
              </svg>
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
