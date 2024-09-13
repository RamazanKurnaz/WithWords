import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const WordManager = ({ onAddWord, onDeleteWords }) => {
  const [newWord, setNewWord] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newWord.trim()) {
      onAddWord(newWord.trim());
      setNewWord('');
    }
  };
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <Input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="Enter new word"
          className="w-full"
        />
        <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold">
          Add Word
        </Button>
      </form>
      <Button onClick={onDeleteWords} className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white font-bold">
        Delete All Words
      </Button>
    </div>
  );
};

export default WordManager;