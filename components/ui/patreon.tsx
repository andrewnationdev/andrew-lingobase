// components/ui/PatreonFloatingCard.tsx
"use client";

import React, { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'hideFloatingPatreon';

export default function PatreonFloatingCard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const hidePermanently = localStorage.getItem(LOCAL_STORAGE_KEY) === '1';
      setIsVisible(!hidePermanently);
    } catch (e) {
      setIsVisible(true);
      console.error("Could not access localStorage:", e);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, '1');
    } catch (e) { /* ignore */ }
  };

  const handleLater = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="floating-patreon"
      className="fixed top-4 right-4 z-50 w-80 sm:w-96 p-4 bg-white dark:bg-gray-800 shadow rounded-lg text-sm text-gray-800 dark:text-gray-100"
      role="region"
      aria-label="Patreon support"
    >
      <button
        aria-label="Dismiss"
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
        style={{ background: "transparent", border: "none", fontSize: "1rem", cursor: "pointer" }}
        onClick={handleDismiss}
      >
        ×
      </button>

      <p className="mb-3">
        Do you like this website? Support it and help it stay alive by joining my Patreon
        Also, there is free and paid material there to help you with conlanging.
      </p>

      <div className="flex items-center gap-2">
        <a
          href="https://www.patreon.com/cw/andrewnationdev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium shadow"
        >
          Support it on Patreon
        </a>

        <button
          className="ml-auto text-xs text-gray-600 dark:text-gray-300 hover:underline"
          style={{ background: "transparent", border: "none", cursor: "pointer" }}
          onClick={handleLater}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}