"use client";
import React, { useState, useEffect } from "react";
import { showErrorToast } from "@/lib/toast";

type StoredNote = {
  version: 2;
  content: string;
  savedAt: string;
};

const STORAGE_KEY = "editorContent:v2";
const LEGACY_STORAGE_KEY = "editorContent";
const MAX_CONTENT_LENGTH = 50_000;

function useDebounce<T>(value: T, delay: number) {
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
  const [content, setContent] = useState<string>('');

  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    try {
      const savedContent = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!savedContent) {
        return;
      }

      try {
        const parsed = JSON.parse(savedContent) as Partial<StoredNote> | string;
        if (typeof parsed === "string") {
          setContent(parsed);
          return;
        }

        if (parsed?.version === 2 && typeof parsed.content === "string") {
          setContent(parsed.content);
          return;
        }

        if (typeof parsed === "object" && typeof parsed?.content === "string") {
          setContent(parsed.content);
          return;
        }

        setContent(savedContent);
      } catch {
        setContent(savedContent);
      }
    } catch (error) {
      showErrorToast("Unable to load saved notes. Starting with a blank editor.");
    }
  }, []);

  useEffect(() => {
    if (debouncedContent.length > MAX_CONTENT_LENGTH) {
      showErrorToast("Your note is too large to save locally.");
      return;
    }

    try {
      const payload: StoredNote = {
        version: 2,
        content: debouncedContent,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      showErrorToast("Failed to save notes locally.");
    }
  }, [debouncedContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
}