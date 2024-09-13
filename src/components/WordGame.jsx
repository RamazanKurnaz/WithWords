import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Trophy, Trash2 } from 'lucide-react';
import GameOver from './GameOver';
import Login from './Login';
import ScoreTable from './ScoreTable';
import WordManager from './WordManager';
import LetterBox from './LetterBox';
import { Button } from "@/components/ui/button";
import { fetchWords, saveWords } from '../utils/wordUtils';

const WordGame = () => {
  const [gameState, setGameState] = useState({
    currentWord: '',
    letters: [],
    score: 0,
    timeLeft: 60,
    gameStatus: 'login',
    celebration: false,
    userName: '',
    scores: [],
    words: [],
    niceTry: false,
    showWordManager: false
  });

  useEffect(() => {
    document.body.style.userSelect = 'none';
    const savedScores = JSON.parse(localStorage.getItem('wordGameScores')) || [
      { name: 'Alice', score: 5 },
      { name: 'Bob', score: 4 },
      { name: 'Charlie', score: 2 }
    ];
    fetchWords().then(words => setGameState(prevState => ({ ...prevState, words, scores: savedScores })));
    return () => { document.body.style.userSelect = ''; };
  }, []);

  const generateNewWord = useCallback(() => {
    const { words } = gameState;
    if (words.length === 0) return;
    const newWord = words[Math.floor(Math.random() * words.length)];
    setGameState(prevState => ({
      ...prevState,
      currentWord: newWord,
      letters: newWord.split('').sort(() => Math.random() - 0.5)
    }));
  }, [gameState.words]);

  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      generateNewWord();
      const timer = setInterval(() => {
        setGameState(prevState => {
          if (prevState.timeLeft <= 1) {
            clearInterval(timer);
            return { ...prevState, timeLeft: 0, gameStatus: 'gameOver' };
          }
          return { ...prevState, timeLeft: prevState.timeLeft - 1 };
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [generateNewWord, gameState.gameStatus]);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;
    setGameState(prevState => {
      const newLetters = Array.from(prevState.letters);
      const [reorderedItem] = newLetters.splice(result.source.index, 1);
      newLetters.splice(result.destination.index, 0, reorderedItem);
      if (newLetters.join('') === prevState.currentWord) {
        setTimeout(() => {
          setGameState(prevState => ({
            ...prevState,
            score: prevState.score + 1,
            celebration: false,
            niceTry: false
          }));
          generateNewWord();
        }, 1000);
        toast.success('Correct!', { duration: 1000 });
        return { ...prevState, letters: newLetters, celebration: true, niceTry: false };
      }
      return { ...prevState, letters: newLetters, niceTry: true };
    });
  }, [generateNewWord]);

  const handleLogin = useCallback((name) => {
    setGameState(prevState => ({ ...prevState, userName: name, gameStatus: 'playing' }));
  }, []);

  const handleGameOver = useCallback(() => {
    setGameState(prevState => {
      const newScores = [...prevState.scores, { name: prevState.userName, score: prevState.score }]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      localStorage.setItem('wordGameScores', JSON.stringify(newScores));
      return { ...prevState, scores: newScores, gameStatus: 'gameOver' };
    });
  }, []);

  const handleDeleteScores = () => {
    localStorage.removeItem('wordGameScores');
    setGameState(prevState => ({ ...prevState, scores: [] }));
  };

  const handleAddWord = (newWord) => {
    setGameState(prevState => {
      const updatedWords = [newWord.toUpperCase(), ...prevState.words];
      saveWords(updatedWords);
      return { ...prevState, words: updatedWords };
    });
  };

  const handleDeleteWords = () => {
    setGameState(prevState => {
      saveWords([]);
      return { ...prevState, words: [] };
    });
  };

  const toggleWordManager = () => {
    setGameState(prevState => ({ ...prevState, showWordManager: !prevState.showWordManager }));
  };

  const { currentWord, letters, score, timeLeft, gameStatus, celebration, userName, scores, niceTry, showWordManager } = gameState;

  if (gameStatus === 'login') return <Login onLogin={handleLogin} />;
  if (gameStatus === 'gameOver') return <GameOver score={score} onRestart={() => setGameState(prevState => ({ ...prevState, score: 0, timeLeft: 60, gameStatus: 'playing' }))} />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-200 to-gray-300 p-4">
      <h1 className="text-5xl font-bold mb-8 text-gray-800 tracking-wide">Word Puzzle</h1>
      <ScoreTable scores={scores} userName={userName} />
      <Button onClick={handleDeleteScores} className="mb-4 bg-red-500 hover:bg-red-600 text-white">
        <Trash2 className="mr-2" />
        Delete Scores
      </Button>
      
      <div className="mb-6 flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
        <Timer className="mr-2 text-yellow-500" />
        <span className="text-2xl font-semibold text-gray-700">{timeLeft}s</span>
        <Trophy className="ml-6 mr-2 text-yellow-500" />
        <span className="text-2xl font-semibold text-gray-700">{score}</span>
      </div>
      <AnimatePresence>
        {celebration && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-6xl mb-6"
          >
            🎉
          </motion.div>
        )}
        {niceTry && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="text-lg text-yellow-600 mb-4"
          >
            Nice try!
          </motion.div>
        )}
      </AnimatePresence>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="letters" direction="horizontal">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="flex space-x-3 mb-5">
              {letters.map((letter, index) => (
                <Draggable key={letter + index} draggableId={letter + index} index={index}>
                  {(provided, snapshot) => (
                    <LetterBox letter={letter} provided={provided} snapshot={snapshot} />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button onClick={toggleWordManager} className="mb-4 bg-blue-500 hover:bg-blue-600 text-white">
        {showWordManager ? 'Hide Word Manager' : 'Show Word Manager'}
      </Button>
      {showWordManager && <WordManager onAddWord={handleAddWord} onDeleteWords={handleDeleteWords} />}
    </div>
    
  );
};

export default React.memo(WordGame);