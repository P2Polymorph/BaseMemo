// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title BaseMemoryLeaderboard
 * @dev A simple leaderboard contract for storing memory game high scores on Base L2
 */
contract BaseMemoryLeaderboard {
    struct ScoreEntry {
        address player;
        uint256 score;
        uint256 timestamp;
    }
    
    // Mapping from player address to their best score
    mapping(address => uint256) private playerBestScores;
    
    // Array to store top scores for easy retrieval
    ScoreEntry[] private topScores;
    
    // Maximum number of top scores to track
    uint256 private constant MAX_TOP_SCORES = 10;
    
    // Events
    event ScoreSubmitted(address indexed player, uint256 score, uint256 timestamp);
    event TopScoreUpdated(address indexed player, uint256 score, uint256 rank);
    
    /**
     * @dev Submit a new score to the leaderboard
     * @param score The score to submit
     */
    function submitScore(uint256 score) external {
        require(score > 0, "Score must be greater than zero");
        
        address player = msg.sender;
        uint256 currentBest = playerBestScores[player];
        
        // Only update if this is a new personal best
        if (score > currentBest) {
            playerBestScores[player] = score;
            _updateTopScores(player, score);
            emit ScoreSubmitted(player, score, block.timestamp);
        }
    }
    
    /**
     * @dev Update the top scores array
     * @param player The player's address
     * @param score The new score
     */
    function _updateTopScores(address player, uint256 score) private {
        // Check if player already exists in top scores
        bool playerFound = false;
        uint256 playerIndex = 0;
        
        for (uint256 i = 0; i < topScores.length; i++) {
            if (topScores[i].player == player) {
                playerFound = true;
                playerIndex = i;
                break;
            }
        }
        
        if (playerFound) {
            // Update existing score
            topScores[playerIndex].score = score;
            topScores[playerIndex].timestamp = block.timestamp;
        } else if (topScores.length < MAX_TOP_SCORES) {
            // Add new score if we haven't reached max
            topScores.push(ScoreEntry({
                player: player,
                score: score,
                timestamp: block.timestamp
            }));
        } else {
            // Find the lowest score in top scores
            uint256 minScore = topScores[0].score;
            uint256 minIndex = 0;
            
            for (uint256 i = 1; i < topScores.length; i++) {
                if (topScores[i].score < minScore) {
                    minScore = topScores[i].score;
                    minIndex = i;
                }
            }
            
            // Replace the lowest score if new score is higher
            if (score > minScore) {
                topScores[minIndex] = ScoreEntry({
                    player: player,
                    score: score,
                    timestamp: block.timestamp
                });
            }
        }
        
        // Sort top scores in descending order
        _sortTopScores();
    }
    
    /**
     * @dev Sort top scores in descending order
     */
    function _sortTopScores() private {
        for (uint256 i = 0; i < topScores.length - 1; i++) {
            for (uint256 j = 0; j < topScores.length - i - 1; j++) {
                if (topScores[j].score < topScores[j + 1].score) {
                    ScoreEntry memory temp = topScores[j];
                    topScores[j] = topScores[j + 1];
                    topScores[j + 1] = temp;
                }
            }
        }
    }
    
    /**
     * @dev Get the top scores (max 10)
     * @return Array of top score entries
     */
    function getTopScores() external view returns (ScoreEntry[] memory) {
        return topScores;
    }
    
    /**
     * @dev Get a player's best score
     * @param player The player's address
     * @return The player's best score
     */
    function getPlayerBestScore(address player) external view returns (uint256) {
        return playerBestScores[player];
    }
    
    /**
     * @dev Get the total number of unique players
     * @return The number of unique players
     */
    function getTotalPlayers() external view returns (uint256) {
        // This is an approximation based on top scores
        // In a production environment, you might want to track this separately
        return topScores.length;
    }
    
    /**
     * @dev Get leaderboard statistics
     * @return highestScore The highest score on the leaderboard
     * @return totalPlayers The number of players in top scores
     * @return lastUpdated The timestamp of the most recent update
     */
    function getLeaderboardStats() external view returns (uint256 highestScore, uint256 totalPlayers, uint256 lastUpdated) {
        if (topScores.length == 0) {
            return (0, 0, 0);
        }
        
        highestScore = topScores[0].score;
        totalPlayers = topScores.length;
        
        // Find the most recent timestamp
        uint256 latestTimestamp = topScores[0].timestamp;
        for (uint256 i = 1; i < topScores.length; i++) {
            if (topScores[i].timestamp > latestTimestamp) {
                latestTimestamp = topScores[i].timestamp;
            }
        }
        lastUpdated = latestTimestamp;
    }
}