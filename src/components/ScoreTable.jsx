import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trophy } from 'lucide-react';

const ScoreTable = ({ scores, userName }) => {
  const [showScores, setShowScores] = useState(false);

  const sortedScores = [...scores, { name: userName, score: 0 }]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="mb-6">
      <Button
        onClick={() => setShowScores(!showScores)}
        className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center"
      >
        <Trophy className="mr-2" />
        {showScores ? 'Hide Scores' : 'Show Scores'}
      </Button>
      {showScores && (
        <div className="mt-4 bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-bold mb-2 text-gray-800">Top Scores</h3>
          <ul>
            {sortedScores.map((score, index) => (
              <li key={index} className="text-gray-700 flex items-center">
                {index === 0 && <Trophy className="mr-2 text-yellow-500" />}
                <span className={score.name === userName ? 'font-bold' : ''}>
                  {score.name}: {score.score}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScoreTable;