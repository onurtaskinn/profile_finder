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

  // Helper function to render a course node with name instead of image
  const renderCourseNode = (course, isWinner = false, isCurrentMatch = false) => {
    if (!course) {
      return <div className="course-node empty"></div>;
    }
    
    return (
      <div className={`course-node ${isWinner ? 'winner' : ''} ${isCurrentMatch ? 'current-match' : ''}`}>
        <span className="course-name">{course.name}</span>
      </div>
    );
  };

  // Helper function to check if a course is in current match (only current round match)
  const isInCurrentMatch = (course, roundNumber, matchIndex) => {
    if (!currentMatch || !course) return false;
    
    // Only highlight if this is the exact current match being voted on
    const isCurrentRound = bracket?.currentRound === roundNumber;
    const isCurrentMatchIndex = currentMatch.matchIndex === matchIndex;
    const isCourseInMatch = (currentMatch.course1?.id === course.id || currentMatch.course2?.id === course.id);
    
    return isCurrentRound && isCurrentMatchIndex && isCourseInMatch && !currentMatch.completed;
  };

  // Helper function to get immediate winner for next round (before round completion)
  const getImmediateWinner = (fromRound, matchIndex1, matchIndex2 = null) => {
    const matches = bracket?.rounds[fromRound]?.matches || [];
    
    if (matchIndex2 === null) {
      // Single match winner
      const match = matches[matchIndex1];
      if (match?.winner) {
        return match.course1.id === match.winner ? match.course1 : match.course2;
      }
    } else {
      // Two matches - return both winners if available
      const match1 = matches[matchIndex1];
      const match2 = matches[matchIndex2];
      
      const winner1 = match1?.winner ? (match1.course1.id === match1.winner ? match1.course1 : match1.course2) : null;
      const winner2 = match2?.winner ? (match2.course1.id === match2.winner ? match2.course1 : match2.course2) : null;
      
      return { winner1, winner2 };
    }
    
    return null;
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
            {/* <h3 className="bracket-title">Tournament Bracket</h3> */}
            <div className="tournament-bracket">
              {/* Round 1 Left Side */}
              <div className="bracket-column round-1-left">
                {bracket?.rounds[1]?.matches.slice(0, 4).map((match, index) => (
                  <div key={`r1-left-${index}`} className="bracket-match">
                    <div className="match-pair">
                      {renderCourseNode(match.course1, match.winner === match.course1.id, isInCurrentMatch(match.course1, 1, index))}
                      {renderCourseNode(match.course2, match.winner === match.course2.id, isInCurrentMatch(match.course2, 1, index))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Round 2 Left Side */}
              <div className="bracket-column round-2-left">
                {[0, 1].map(index => {
                  const match = bracket?.rounds[2]?.matches[index];
                  const immediateWinners = getImmediateWinner(1, index * 2, index * 2 + 1);
                  
                  return (
                    <div key={`r2-left-${index}`} className="bracket-match">
                      <div className="match-pair">
                        {match ? (
                          <>
                            {renderCourseNode(match.course1, match.winner === match.course1?.id, isInCurrentMatch(match.course1, 2, index))}
                            {renderCourseNode(match.course2, match.winner === match.course2?.id, isInCurrentMatch(match.course2, 2, index))}
                          </>
                        ) : (
                          <>
                            {renderCourseNode(immediateWinners?.winner1)}
                            {renderCourseNode(immediateWinners?.winner2)}
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
                        {renderCourseNode(bracket.rounds[3].matches[0].course1, bracket.rounds[3].matches[0].winner === bracket.rounds[3].matches[0].course1?.id, isInCurrentMatch(bracket.rounds[3].matches[0].course1, 3, 0))}
                        {renderCourseNode(bracket.rounds[3].matches[0].course2, bracket.rounds[3].matches[0].winner === bracket.rounds[3].matches[0].course2?.id, isInCurrentMatch(bracket.rounds[3].matches[0].course2, 3, 0))}
                      </>
                    ) : (
                      <>
                        {renderCourseNode(getImmediateWinner(2, 0))}
                        {renderCourseNode(getImmediateWinner(2, 1))}
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
                        {renderCourseNode(bracket.rounds[4].matches[0].course1, bracket.rounds[4].matches[0].winner === bracket.rounds[4].matches[0].course1?.id, isInCurrentMatch(bracket.rounds[4].matches[0].course1, 4, 0))}
                        {renderCourseNode(bracket.rounds[4].matches[0].course2, bracket.rounds[4].matches[0].winner === bracket.rounds[4].matches[0].course2?.id, isInCurrentMatch(bracket.rounds[4].matches[0].course2, 4, 0))}
                      </>
                    ) : (
                      <>
                        {renderCourseNode(getImmediateWinner(3, 0))}
                        {renderCourseNode(getImmediateWinner(3, 1))}
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
                        {renderCourseNode(bracket.rounds[3].matches[1].course1, bracket.rounds[3].matches[1].winner === bracket.rounds[3].matches[1].course1?.id, isInCurrentMatch(bracket.rounds[3].matches[1].course1, 3, 1))}
                        {renderCourseNode(bracket.rounds[3].matches[1].course2, bracket.rounds[3].matches[1].winner === bracket.rounds[3].matches[1].course2?.id, isInCurrentMatch(bracket.rounds[3].matches[1].course2, 3, 1))}
                      </>
                    ) : (
                      <>
                        {renderCourseNode(getImmediateWinner(2, 2))}
                        {renderCourseNode(getImmediateWinner(2, 3))}
                      </>
                    )}
                  </div>
                </div>
              </div>                 
              
              {/* Round 2 Right Side */}
              <div className="bracket-column round-2-right">
                {[2, 3].map(index => {
                  const match = bracket?.rounds[2]?.matches[index];
                  const immediateWinners = getImmediateWinner(1, index * 2, index * 2 + 1);
                  
                  return (
                    <div key={`r2-right-${index}`} className="bracket-match">
                      <div className="match-pair">
                        {match ? (
                          <>
                            {renderCourseNode(match.course1, match.winner === match.course1?.id, isInCurrentMatch(match.course1, 2, index))}
                            {renderCourseNode(match.course2, match.winner === match.course2?.id, isInCurrentMatch(match.course2, 2, index))}
                          </>
                        ) : (
                          <>
                            {renderCourseNode(immediateWinners?.winner1)}
                            {renderCourseNode(immediateWinners?.winner2)}
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
                      {renderCourseNode(match.course1, match.winner === match.course1.id, isInCurrentMatch(match.course1, 1, index+4))}
                      {renderCourseNode(match.course2, match.winner === match.course2.id, isInCurrentMatch(match.course2, 1, index+4))}
                    </div>
                  </div>
                ))}
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
