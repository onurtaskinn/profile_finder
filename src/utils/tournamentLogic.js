// Tournament logic for course selection

// Shuffle array helper function
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Create initial tournament bracket with random pairings
export const createInitialBracket = (courses) => {
  const shuffledCourses = shuffleArray(courses);
  
  // Create Round 1 matches (8 matches with 2 courses each)
  const round1Matches = [];
  for (let i = 0; i < shuffledCourses.length; i += 2) {
    round1Matches.push({
      id: `r1-m${Math.floor(i/2) + 1}`,
      round: 1,
      matchIndex: Math.floor(i/2),
      course1: shuffledCourses[i],
      course2: shuffledCourses[i + 1],
      winner: null,
      completed: false
    });
  }

  return {
    currentRound: 1,
    totalRounds: 4,
    rounds: {
      1: { matches: round1Matches, completed: false },
      2: { matches: [], completed: false },
      3: { matches: [], completed: false },
      4: { matches: [], completed: false }
    },
    currentMatchIndex: 0,
    winners: [],
    finalRanking: []
  };
};

// Get all matches for a specific round
export const getMatchesForRound = (bracket, roundNumber) => {
  return bracket.rounds[roundNumber]?.matches || [];
};

// Get current match that needs to be voted on
export const getCurrentMatch = (bracket) => {
  const currentRoundMatches = getMatchesForRound(bracket, bracket.currentRound);
  return currentRoundMatches.find(match => !match.completed);
};

// Advance winner to next round
export const advanceWinner = (bracket, matchId, winnerId) => {
  const newBracket = { ...bracket };
  const currentRound = newBracket.currentRound;
  const match = newBracket.rounds[currentRound].matches.find(m => m.id === matchId);
  
  if (!match || match.completed) return bracket;
  
  // Set winner
  match.winner = winnerId;
  match.completed = true;
  
  // Check if round is complete
  const roundMatches = newBracket.rounds[currentRound].matches;
  const allMatchesComplete = roundMatches.every(m => m.completed);
  
  if (allMatchesComplete) {
    newBracket.rounds[currentRound].completed = true;
    
    // If not final round, create next round matches
    if (currentRound < 4) {
      const winners = roundMatches.map(m => {
        return m.course1.id === m.winner ? m.course1 : m.course2;
      });
      
      newBracket.rounds[currentRound + 1].matches = createNextRoundMatches(winners, currentRound + 1);
      newBracket.currentRound = currentRound + 1;
      newBracket.currentMatchIndex = 0;
    } else {
      // Tournament completed
      newBracket.finalRanking = generateFinalRanking(newBracket);
    }
  }
  
  return newBracket;
};

// Create matches for next round
const createNextRoundMatches = (winners, roundNumber) => {
  const matches = [];
  const matchesCount = winners.length / 2;
  
  for (let i = 0; i < winners.length; i += 2) {
    matches.push({
      id: `r${roundNumber}-m${Math.floor(i/2) + 1}`,
      round: roundNumber,
      matchIndex: Math.floor(i/2),
      course1: winners[i],
      course2: winners[i + 1],
      winner: null,
      completed: false
    });
  }
  
  return matches;
};

// Check if tournament is complete
export const isTournamentComplete = (bracket) => {
  return bracket.currentRound === 4 && bracket.rounds[4].completed;
};

// Get round information
export const getRoundInfo = (roundNumber) => {
  const roundInfo = {
    1: { name: "Round 1", subtitle: "Pick your favorites", matchCount: 8 },
    2: { name: "Round 2", subtitle: "Quarter Finals", matchCount: 4 },
    3: { name: "Round 3", subtitle: "Semi Finals", matchCount: 2 },
    4: { name: "Final", subtitle: "The ultimate choice", matchCount: 1 }
  };
  
  return roundInfo[roundNumber] || { name: "Round", subtitle: "", matchCount: 0 };
};

// Generate final ranking based on tournament results
const generateFinalRanking = (bracket) => {
  const ranking = [];
  
  // Get winner (1st place)
  const finalMatch = bracket.rounds[4].matches[0];
  const winner = finalMatch.course1.id === finalMatch.winner ? finalMatch.course1 : finalMatch.course2;
  const runnerUp = finalMatch.course1.id === finalMatch.winner ? finalMatch.course2 : finalMatch.course1;
  
  ranking.push(winner); // 1st place
  ranking.push(runnerUp); // 2nd place
  
  // Get semi-final losers (3rd and 4th place)
  const semiMatches = bracket.rounds[3].matches;
  const semiLosers = semiMatches.map(match => {
    return match.course1.id === match.winner ? match.course2 : match.course1;
  });
  ranking.push(...semiLosers); // 3rd and 4th place
  
  // Get quarter-final losers (5th-8th place)
  const quarterMatches = bracket.rounds[2].matches;
  const quarterLosers = quarterMatches.map(match => {
    return match.course1.id === match.winner ? match.course2 : match.course1;
  });
  ranking.push(...quarterLosers); // 5th-8th place
  
  // Get first round losers (9th-16th place)
  const firstMatches = bracket.rounds[1].matches;
  const firstLosers = firstMatches.map(match => {
    return match.course1.id === match.winner ? match.course2 : match.course1;
  });
  ranking.push(...firstLosers); // 9th-16th place
  
  return ranking;
};

// Generate tier list from final ranking
export const generateTierList = (finalRanking) => {
  return {
    S: [finalRanking[0]], // 1st place
    A: [finalRanking[1]], // 2nd place  
    B: [finalRanking[2], finalRanking[3]], // 3rd and 4th place
    C: finalRanking.slice(4, 8) // 5th-8th place
  };
};

// Get progress percentage
export const getProgressPercentage = (bracket) => {
  let totalMatches = 0;
  let completedMatches = 0;
  
  for (let round = 1; round <= 4; round++) {
    const matches = bracket.rounds[round].matches;
    totalMatches += matches.length;
    completedMatches += matches.filter(m => m.completed).length;
  }
  
  return totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;
};