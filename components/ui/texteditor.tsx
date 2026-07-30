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

  const [content, setContent] = useState<string>('');

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

  const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setContent(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
          Notes and Ideas
        </h2>
        <p className="mb-4 text-gray-500 dark:text-gray-300">
          Write down your notes and ideas for later. They will be saved automatically as you type.
        </p>
        <textarea
          className="h-80 w-full resize-none rounded-lg border border-gray-300 bg-white p-4 text-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          placeholder="Start typing here..."
          value={content}
          onChange={handleChange}
        ></textarea>
      </div>
    </div>
  );
};