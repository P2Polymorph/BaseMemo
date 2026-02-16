'use client';

import { useCallback, useEffect, useState } from 'react';
import * as Tone from 'tone';
import styles from './MemoryGame.module.css';

// Debug Tone.js loading
console.log('Tone.js loaded:', typeof Tone !== 'undefined');
console.log('Tone.context:', Tone?.context);

type Color = 'red' | 'yellow' | 'green' | 'blue';
type GameMode = 'sound' | 'silent';

const COLORS: { id: number; color: Color; className: string }[] = [
  { id: 0, color: 'red', className: styles.redButton },
  { id: 1, color: 'yellow', className: styles.yellowButton },
  { id: 2, color: 'green', className: styles.greenButton },
  { id: 3, color: 'blue', className: styles.blueButton },
];

// Нотные частоты (До, Ми, Соль, Си) — C, E, G, B
const NOTES: Record<Color, string> = {
  red: 'C4',    // До
  yellow: 'E4', // Ми
  green: 'G4',  // Соль
  blue: 'B4',   // Си
};

interface LeaderboardEntry {
  player: string;
  score: number;
}

export default function MemoryGame() {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [userInput, setUserInput] = useState<Color[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [score, setScore] = useState(0);
  const [gameMode, setGameMode] = useState<GameMode>('sound');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [synth, setSynth] = useState<Tone.Synth | null>(null);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [audioStatus, setAudioStatus] = useState<string>('initializing');

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize Tone.js audio context
        await Tone.start();
        console.log('Tone.js started successfully');
        setAudioStatus('ready');
        
        // Create and configure the synthesizer
        const newSynth = new Tone.Synth({
          oscillator: {
            type: 'sine'
          },
          envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.1,
            release: 0.1
          }
        }).toDestination();
        
        setSynth(newSynth);
        console.log('Synthesizer created successfully');
      } catch (error) {
        console.error('Error initializing audio:', error);
        setAudioStatus('error');
      }
    };

    init();

    return () => {
      synth?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playSound = useCallback(
    async (color: Color) => {
      if (gameMode === 'silent' || !synth) return;
      
      try {
        // Ensure audio context is running
        if (Tone.context.state !== 'running') {
          await Tone.start();
        }
        
        // Play the note
        synth.triggerAttackRelease(NOTES[color], '0.15');
        console.log(`Playing note: ${NOTES[color]}`);
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    },
    [gameMode, synth]
  );

  const flashButton = useCallback(
    async (color: Color, highlightMs: number) => {
      const button = document.getElementById(`button-${color}`);
      if (button) {
        button.classList.add(styles.active);
      }

      // Ensure audio context is started on user interaction
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }
      
      await playSound(color);

      if ('vibrate' in navigator) {
        navigator.vibrate(60);
      }

      await new Promise((resolve) => setTimeout(resolve, highlightMs));

      if (button) {
        button.classList.remove(styles.active);
      }
    },
    [playSound]
  );

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setSequence([]);
    setUserInput([]);
    setTimeout(() => nextRound([]), 400);
  };

  const nextRound = async (currentSequence: Color[]) => {
    setIsPlaying(true);
    setIsPlayerTurn(false);
    setUserInput([]);

    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)].color;
    const newSequence = [...currentSequence, newColor];
    setSequence(newSequence);

    const level = Math.floor(currentSequence.length / 5);
    const onMs = Math.max(180, 500 - level * 60);
    const gapMs = Math.max(140, 350 - level * 40);

    for (const color of newSequence) {
      await new Promise((resolve) => setTimeout(resolve, gapMs));
      await flashButton(color, onMs);
    }

    setIsPlaying(false);
    setIsPlayerTurn(true);
  };

  const handleButtonClick = async (color: Color) => {
    if (!isPlayerTurn || isPlaying || !gameStarted) return;

    await flashButton(color, 150);

    const newUserInput = [...userInput, color];
    setUserInput(newUserInput);

    const idx = newUserInput.length - 1;
    if (sequence[idx] !== color) {
      setGameOver(true);
      setIsPlayerTurn(false);
      setGameStarted(false);
      // TODO: интегрировать submitScore в контракт Base
      return;
    }

    if (newUserInput.length === sequence.length) {
      const newScore = sequence.length;
      setScore(newScore);
      setTimeout(() => nextRound(sequence), 900);
    }
  };

  const toggleMode = () => {
    setGameMode((prev) => (prev === 'sound' ? 'silent' : 'sound'));
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameBoard}>
        <div className={styles.gameHeader}>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreLabel}>SCORE</span>
            <span className={styles.scoreValue}>{score}</span>
          </div>
          <div className={styles.modeDisplay}>
            <span className={styles.modeLabel}>MODE</span>
            <span className={styles.scoreValue}>
              {gameMode === 'sound' ? '🔊' : '🔇'}
              {audioStatus === 'error' && ' ⚠️'}
            </span>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          {COLORS.map(({ id, color, className }) => (
            <button
              key={id}
              id={`button-${color}`}
              className={`${styles.gameButton} ${className}`}
              onClick={() => handleButtonClick(color)}
              disabled={!isPlayerTurn || isPlaying || !gameStarted}
            />
          ))}

          <div className={styles.centralDisplay}>
            <div className={styles.memoryLogo}>
              <div className={styles.brainIcon}>🧠</div>
              <div className={styles.logoText}>BASE MEMORY</div>
              <button 
                onClick={async () => {
                  try {
                    await Tone.start();
                    if (synth) {
                      synth.triggerAttackRelease('C4', '0.2');
                      console.log('Test sound played');
                    }
                  } catch (error) {
                    console.error('Test sound error:', error);
                  }
                }}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '2px 6px',
                  fontSize: '0.7rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '4px'
                }}
              >
                🔊
              </button>
            </div>

            {!gameStarted && !gameOver && (
              <div className={styles.startScreen}>
                <button className={styles.startButton} onClick={startGame}>
                  START GAME
                </button>
                <div className={styles.modeSelector}>
                  <button
                    className={`${styles.modeButton} ${
                      gameMode === 'sound' ? styles.activeMode : ''
                    }`}
                    onClick={() => setGameMode('sound')}
                  >
                    🔊 Classic
                  </button>
                  <button
                    className={`${styles.modeButton} ${
                      gameMode === 'silent' ? styles.activeMode : ''
                    }`}
                    onClick={() => setGameMode('silent')}
                  >
                    🔇 Silent
                  </button>
                </div>
              </div>
            )}

            {gameOver && (
              <div className={styles.gameOverScreen}>
                <div className={styles.gameOverText}>GAME OVER</div>
                <div className={styles.finalScore}>Final Score: {score}</div>
                <div className={styles.gameOverActions}>
                  <button className={styles.playAgainButton} onClick={startGame}>
                    PLAY AGAIN
                  </button>
                  <button className={styles.saveScoreButton} disabled>
                    SAVE TO BASE
                  </button>
                </div>
              </div>
            )}

            {(isPlaying || isPlayerTurn) && (
              <div className={styles.gameStatus}>
                {isPlaying && 'Watch the sequence...'}
                {isPlayerTurn && 'Your turn! Repeat the sequence.'}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.leaderboardSection}>
        <button
          className={styles.leaderboardToggle}
          onClick={() => setLeaderboardOpen((v) => !v)}
        >
          🏆 Global Leaderboard
        </button>

        {leaderboardOpen && (
          <div className={styles.leaderboard}>
            <div className={styles.leaderboardTitle}>TOP 10 PLAYERS</div>
            <div className={styles.leaderboardList}>
              {leaderboard.length === 0 && (
                <div className={styles.leaderboardItem}>
                  <span className={styles.player}>No scores on-chain yet. Be the first!</span>
                </div>
              )}
              {leaderboard.map((entry, index) => (
                <div key={`${entry.player}-${index}`} className={styles.leaderboardItem}>
                  <span className={styles.rank}>#{index + 1}</span>
                  <span className={styles.player}>
                    {entry.player.slice(0, 6)}…{entry.player.slice(-4)}
                  </span>
                  <span className={styles.score}>{entry.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
