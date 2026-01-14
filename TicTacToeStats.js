import React, { useState, useEffect } from 'react';
import './TicTacToeStats.css';

const TicTacToeStats = ({ games = [], onClearHistory }) => {
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    xWins: 0,
    oWins: 0,
    ties: 0
  });

  // Calculate statistics whenever games change
  useEffect(() => {
    const xWins = games.filter(game => game.winner === 'X').length;
    const oWins = games.filter(game => game.winner === 'O').length;
    const ties = games.filter(game => game.winner === 'tie').length;
    
    setStats({ xWins, oWins, ties });
  }, [games]);

  // Filter games based on selected filter
  const filteredGames = games.filter(game => {
    if (filter === 'all') return true;
    if (filter === 'wins') return game.winner !== 'tie';
    if (filter === 'ties') return game.winner === 'tie';
    return true;
  });

  // Format timestamp to display
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const time = date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      const dateStr = date.toISOString().split('T')[0];
      return { time, date: dateStr };
    } catch (error) {
      return { time: '--:--', date: '----' };
    }
  };

  // Get mode display text with difficulty
  const getModeText = (game) => {
    if (!game.mode) return 'Unknown';
    return game.difficulty ? `${game.mode} (${game.difficulty})` : game.mode;
  };

  // Get emoji for winner
  const getWinnerEmoji = (winner) => {
    switch(winner) {
      case 'X': return '❌';
      case 'O': return '⭕';
      case 'tie': return '🤝';
      default: return '❓';
    }
  };

  // Format the result text
  const getResultText = (game) => {
    if (game.resultText) return game.resultText;
    
    switch(game.winner) {
      case 'X': return "Player X (X) wins!";
      case 'O': return "Player O (O) wins!";
      case 'tie': return "It's a tie!";
      default: return "Game ended";
    }
  };

  // Clear history handler
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all game history?')) {
      if (onClearHistory) {
        onClearHistory();
      }
    }
  };

  return (
    <div className="tic-tac-toe-stats">
      <h1>Game History</h1>
      
      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'wins' ? 'active' : ''}`}
          onClick={() => setFilter('wins')}
        >
          Wins
        </button>
        <button 
          className={`filter-btn ${filter === 'ties' ? 'active' : ''}`}
          onClick={() => setFilter('ties')}
        >
          Ties
        </button>
      </div>
      
      {/* Statistics Summary */}
      <div className="stats-summary">
        <div className="stat-item x-wins">
          <div className="stat-count">{stats.xWins}</div>
          <div className="stat-label">X Wins</div>
        </div>
        
        <div className="stat-item ties">
          <div className="stat-count">{stats.ties}</div>
          <div className="stat-label">Ties</div>
        </div>
        
        <div className="stat-item o-wins">
          <div className="stat-count">{stats.oWins}</div>
          <div className="stat-label">O Wins</div>
        </div>
      </div>
      
      {/* Divider */}
      <hr className="divider" />
      
      {/* Game History List */}
      <div className="history-list">
        {filteredGames.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p>No games found</p>
            <p className="empty-subtext">Play some games to see history here!</p>
          </div>
        ) : (
          filteredGames.map((game) => {
            const { time, date } = formatTimestamp(game.timestamp);
            const modeText = getModeText(game);
            const winnerEmoji = getWinnerEmoji(game.winner);
            const resultText = getResultText(game);
            
            return (
              <div 
                key={game.id} 
                className={`history-item ${game.winner === 'tie' ? 'tie' : 'win'}`}
              >
                <div className="game-result">
                  <span className="winner-emoji">{winnerEmoji}</span>
                  {resultText}
                </div>
                
                <div className="game-meta">
                  <div className="meta-row">
                    <span className="time">{time}</span>
                    <span className="mode">{modeText}</span>
                  </div>
                  <div className="date">{date}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Clear History Button */}
      {games.length > 0 && (
        <button className="clear-history-btn" onClick={handleClearHistory}>
          Clear History
        </button>
      )}
    </div>
  );
};

export default TicTacToeStats;
