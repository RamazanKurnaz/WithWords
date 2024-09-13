const WORDS_KEY = 'wordGameWords';

export const fetchWords = async () => {
  try {
    const response = await fetch('/words.json');
    if (!response.ok) {
      throw new Error('Failed to fetch words');
    }
    const defaultWords = await response.json();
    const savedWords = JSON.parse(localStorage.getItem(WORDS_KEY)) || [];
    return [...savedWords, ...defaultWords];
  } catch (error) {
    console.error('Error fetching words:', error);
    return [];
  }
};

export const saveWords = (words) => {
  localStorage.setItem(WORDS_KEY, JSON.stringify(words));
};