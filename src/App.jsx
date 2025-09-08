import React, { useState } from 'react';
import './App.css';

// Import components (we'll create these in later phases)
import LandingPage from './components/LandingPage';
import TournamentPage from './components/TournamentPage';
import TierlistPage from './components/TierlistPage'

// Import data and logic
import { courses } from './data/courses';
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
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'tournament', 'results'
  
  // Tournament state
  const [tournamentBracket, setTournamentBracket] = useState(null);
  const [tierList, setTierList] = useState(null);
  const [originalTierList, setOriginalTierList] = useState(null);

  // Start tournament - called from Landing page
  const startTournament = () => {
    const initialBracket = createInitialBracket(courses);
    setTournamentBracket(initialBracket);
    setCurrentPage('tournament');
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

  // Handle find profile action (dummy for now)
  const findProfile = () => {
    alert('Finding your learning profile... (This will be implemented later)');
  };

  // Reset app to landing page
  const resetApp = () => {
    setCurrentPage('landing');
    setTournamentBracket(null);
    setTierList(null);
    setOriginalTierList(null);
  };

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage 
            onStartTournament={startTournament}
          />
        );
      
      case 'tournament':
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
            onFindProfile={findProfile}
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