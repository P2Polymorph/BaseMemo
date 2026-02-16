// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Base Memory Leaderboard
/// @notice Simple onchain leaderboard for the Base Memory game.
contract MemoryLeaderboard {
    struct Score {
        address player;
        uint256 score;
        uint256 timestamp;
    }
    
    Score[] public scores;
    mapping(address => uint256) public bestScores;
    
    event NewScore(address indexed player, uint256 score, uint256 timestamp);
    
    /// @notice Submit a new score for the sender.
    /// @dev Only stores the result if it is strictly better than the previous best.
    function submitScore(uint256 _score) external {
        require(_score > 0, "Score must be positive");
        
        if (_score > bestScores[msg.sender]) {
            bestScores[msg.sender] = _score;
            
            scores.push(Score({
                player: msg.sender,
                score: _score,
                timestamp: block.timestamp
            }));
            
            emit NewScore(msg.sender, _score, block.timestamp);
        }
    }
    
    /// @notice Returns the most recent scores up to the provided limit.
    /// @dev For production consider using off-chain indexing for complex sorting.
    function getTopScores(uint256 _limit) external view returns (Score[] memory) {
        uint256 length = scores.length < _limit ? scores.length : _limit;
        Score[] memory topScores = new Score[](length);
        
        // Simple reverse-order listing (most recent first).
        for (uint256 i = 0; i < length; i++) {
            topScores[i] = scores[scores.length - 1 - i];
        }
        
        return topScores;
    }
}

