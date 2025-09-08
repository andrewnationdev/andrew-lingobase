"use client"
import React, { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Notepad(){
  const localStorageKey = 'editorContent';

  const [content, setContent] = useState('');

  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    try {
      const savedContent = localStorage.getItem(localStorageKey);
      if (savedContent) {
        setContent(savedContent);
      }
    } catch (error) {
      console.error("Failed to load content from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (debouncedContent !== null) {
      try {
        localStorage.setItem(localStorageKey, debouncedContent);
        console.log("Content saved to localStorage.");
      } catch (error) {
        console.error("Failed to save content to localStorage", error);
      }
    }
  }, [debouncedContent]);

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-inter">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Notes and Ideas</h2>
        <p className="text-gray-500 mb-4">Write down your notes and ideas for later. They will be saved automatically as you type.</p>
        <textarea
          className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 resize-none"
          placeholder="Start typing here..."
          value={content}
          onChange={handleChange}
        ></textarea>
      </div>
    </div>
  );
};