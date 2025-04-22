import React from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';

const SearchBar = ({ onSearch }) => {
  const { transcript, resetTranscript } = useSpeechRecognition();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (transcript) {
      onSearch(transcript);
      resetTranscript();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={transcript} readOnly />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
