import React, { useState } from 'react';
import './App.css';

// Import components (we'll create these in later phases)
import LandingPage from './components/LandingPage';
import TournamentPage from './components/TournamentPage';
import TierlistPage from './components/TierlistPage'
import ProfileResultsPage from './components/ProfileResultsPage';


import { 
  createInitialBracket, 
  advanceWinner, 
  getCurrentMatch, 
  isTournamentComplete,
  generateTierList,
  getProgressPercentage,
  getRoundInfo
} from './utils/tournamentLogic';

function App() {
  // Page navigation state
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'tournament', 'tierlist', 'profile-results'
  
  // Tournament state
  const [tournamentBracket, setTournamentBracket] = useState(null);
  const [tierList, setTierList] = useState(null);
  const [originalTierList, setOriginalTierList] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Add loading state
  const [isLoading, setIsLoading] = useState(false);

  // Start tournament - called from Landing page
  const startTournament = async () => {
    setIsLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${API_URL}/get-tournament-courses`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const courses = data.courses;
      
      const initialBracket = createInitialBracket(courses);
      setTournamentBracket(initialBracket);
      setCurrentPage('tournament');
    } catch (error) {
      console.error('Error fetching tournament courses:', error);
      alert(`Failed to load courses: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle course selection in tournament
  const selectCourse = (matchId, winnerId) => {
    if (!tournamentBracket) return;

    const updatedBracket = advanceWinner(tournamentBracket, matchId, winnerId);
    setTournamentBracket(updatedBracket);

    // Check if tournament is complete
    if (isTournamentComplete(updatedBracket)) {
      // Generate tier list and move to tierlist page
      const finalTierList = generateTierList(updatedBracket.finalRanking);
      setTierList(finalTierList);
      setOriginalTierList(finalTierList); // Store original for reset
      setCurrentPage('tierlist');
    }
  };

  // Update tier list when user drags/drops courses
  const updateTierList = (newTierList) => {
    setTierList(newTierList);
  };

  // Get current match for tournament page
  const currentMatch = tournamentBracket ? getCurrentMatch(tournamentBracket) : null;

  // Get progress information
  const progressPercentage = tournamentBracket ? getProgressPercentage(tournamentBracket) : 0;
  const roundInfo = tournamentBracket ? getRoundInfo(tournamentBracket.currentRound) : null;


  // Reset app to landing page
  const resetApp = () => {
    setCurrentPage('landing');
    setTournamentBracket(null);
    setTierList(null);
    setOriginalTierList(null);
    setProfileData(null);
    setIsLoading(false); // Reset loading state
  };

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage 
            onStartTournament={startTournament}
            isLoading={isLoading}
          />
        );
      
      case 'tournament':
        if (isLoading) {
          return (
            <div className="tournament-loading">
              <h2>Turnuva kursları yükleniyor...</h2>
            </div>
          );
        }
        return (
          <TournamentPage 
            bracket={tournamentBracket}
            currentMatch={currentMatch}
            onSelectCourse={selectCourse}
            progressPercentage={progressPercentage}
            roundInfo={roundInfo}
          />
        );

      case 'tierlist':
        return (
          <TierlistPage 
            tierList={tierList}
            onUpdateTierList={updateTierList}
            onFindProfile={(profileResult) => {
              setProfileData(profileResult);
              setCurrentPage('profile-results');
            }}
            onRestart={resetApp}
          />
        );

      case 'profile-results':
        return (
          <ProfileResultsPage 
            profileData={profileData}
            onRestart={resetApp}
          />
        );        
      
      default:
        return <LandingPage onStartTournament={startTournament} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;