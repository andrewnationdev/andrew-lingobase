"use client";
import React, { useState } from "react";
import { InfoIcon } from "lucide-react";

const conlangs = ["Esperanto", "Quenya", "Klingon"];
const genres = ["Fantasy", "Science Fiction", "Romance"];

const initialStories = [
  {
    id: 1,
    title: "The Lost City",
    author: "Alice",
    conlang: "Esperanto",
    genre: "Fantasy",
    synopsis: "A mysterious city hidden in the jungle awaits discovery.",
    content: "In the heart of the jungle, legends spoke of a city lost to time...",
    date: "2025-10-14 10:00",
  },
  {
    id: 2,
    title: "Stars Beyond",
    author: "Bob",
    conlang: "Klingon",
    genre: "Science Fiction",
    synopsis: "A crew journeys into the unknown, searching the stars.",
    content: "The crew gazed at the endless stars, wondering what lay beyond.",
    date: "2025-10-14 11:00",
  },
  {
    id: 3,
    title: "Whispering Winds",
    author: "Carol",
    conlang: "Quenya",
    genre: "Romance",
    synopsis: "Secrets and love travel on the wind through the valley.",
    content: "The wind carried their secrets across the valley.",
    date: "2025-10-14 12:00",
  },
  {
    id: 4,
    title: "Echoes of Tomorrow",
    author: "Dave",
    conlang: "Esperanto",
    genre: "Science Fiction",
    synopsis: "Machines hum with the dreams of a forgotten era.",
    content: "Machines hummed, echoing the dreams of a forgotten era.",
    date: "2025-10-14 13:00",
  },
  {
    id: 5,
    title: "Moonlit Path",
    author: "Eve",
    conlang: "Quenya",
    genre: "Fantasy",
    synopsis: "A wanderer finds their way under the moon's gentle light.",
    content: "Under the moonlight, the path revealed itself to the wanderer.",
    date: "2025-10-14 14:00",
  },
  {
    id: 6,
    title: "Silent Promise",
    author: "Frank",
    conlang: "Klingon",
    genre: "Romance",
    synopsis: "A silent vow binds two souls stronger than words.",
    content: "A promise made in silence, stronger than any spoken word.",
    date: "2025-10-14 15:00",
  },
  {
    id: 7,
    title: "Fire and Ice",
    author: "Grace",
    conlang: "Esperanto",
    genre: "Fantasy",
    synopsis: "Elements clash, shaping the destiny of a magical realm.",
    content: "The clash of fire and ice shaped the destiny of the realm.",
    date: "2025-10-14 16:00",
  },
  {
    id: 8,
    title: "Journey's End",
    author: "Henry",
    conlang: "Quenya",
    genre: "Science Fiction",
    synopsis: "At the universe's edge, a journey finds its conclusion.",
    content: "At the edge of the universe, their journey finally ended.",
    date: "2025-10-14 17:00",
  },
  {
    id: 9,
    title: "Hidden Truths",
    author: "Ivy",
    conlang: "Klingon",
    genre: "Fantasy",
    synopsis: "Myths and legends conceal the truth beneath their layers.",
    content: "Truths hidden beneath layers of myth and legend.",
    date: "2025-10-14 18:00",
  },
  {
    id: 10,
    title: "Dawn of Hope",
    author: "Jack",
    conlang: "Esperanto",
    genre: "Romance",
    synopsis: "A new beginning rises with the dawn, bringing hope.",
    content: "With the dawn came hope, and a new beginning.",
    date: "2025-10-14 19:00",
  },
];

export default function LiteratureSection() {
  const [stories, setStories] = useState(initialStories);
  const [selectedStory, setSelectedStory] = useState(null);
  const [search, setSearch] = useState("");
  const [filterConlang, setFilterConlang] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [form, setForm] = useState({
    title: "",
    author: "Current User", // Replace with logged-in user
    conlang: conlangs[0],
    genre: genres[0],
    synopsis: "",
    content: "",
  });

  const filteredStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterConlang ? story.conlang === filterConlang : true) &&
      (filterGenre ? story.genre === filterGenre : true)
  );

  function handleFormChange(e) {
    const { name, value } = e.target;
    if (name === "synopsis" && value.length > 180) return;
    setForm({ ...form, [name]: value });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setStories([
      ...stories,
      {
        ...form,
        id: stories.length + 1,
        date: new Date().toLocaleString(),
      },
    ]);
    setForm({
      title: "",
      author: "Current User",
      conlang: conlangs[0],
      genre: genres[0],
      synopsis: "",
      content: "",
    });
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      {/* Info banner */}
      <div className="bg-teal-500 text-sm p-3 px-5 rounded-md text-black flex gap-3 items-center my-4">
        <InfoIcon size={16} strokeWidth={2} />
        Here you can read, search, and submit stories written in conlangs!
      </div>

      {/* Searchbar and filters */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
        />
        <select
          value={filterConlang}
          onChange={(e) => setFilterConlang(e.target.value)}
          className="block rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
        >
          <option value="">All conlangs</option>
          {conlangs.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filterGenre}
          onChange={(e) => setFilterGenre(e.target.value)}
          className="block rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Stories area */}
      <div className="w-full">
        {selectedStory ? (
          <div className="max-w-3xl mx-auto p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedStory.title}</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
              <b>Author:</b> {selectedStory.author} | <b>Conlang:</b> {selectedStory.conlang} | <b>Genre:</b> {selectedStory.genre}
            </p>
            <p className="text-xs text-gray-500 mb-2">{selectedStory.date}</p>
            <div className="mb-2 text-gray-800 dark:text-gray-200"><b>Synopsis:</b> {selectedStory.synopsis}</div>
            <div className="mb-4 text-gray-800 dark:text-gray-200">{selectedStory.content}</div>
            <button
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
              onClick={() => setSelectedStory(null)}
            >
              GO BACK
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredStories.map((story) => (
                <div
                  key={story.id}
                  className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{story.title}</h3>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                      <b>Author:</b> {story.author} | <b>Conlang:</b> {story.conlang} | <b>Genre:</b> {story.genre}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 mb-2">
                      <b>Synopsis:</b> {story.synopsis}
                    </p>
                  </div>
                  <button
                    className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
                    onClick={() => setSelectedStory(story)}
                  >
                    READ
                  </button>
                </div>
              ))}
              {filteredStories.length === 0 && (
                <div className="col-span-full text-gray-500 text-center">
                  No stories found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submission form */}
      <div className="max-w-3xl mx-auto w-full">
        <form
          onSubmit={handleFormSubmit}
          className="p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg flex flex-col gap-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Submit a new story</h2>
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Title"
              value={form.title}
              onChange={handleFormChange}
              required
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Author
            </label>
            <input
              type="text"
              name="author"
              id="author"
              value={form.author}
              disabled
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm sm:text-sm p-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-400"
            />
          </div>
          <div>
            <label htmlFor="conlang" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Conlang
            </label>
            <select
              name="conlang"
              id="conlang"
              value={form.conlang}
              onChange={handleFormChange}
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
            >
              {conlangs.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="genre" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Genre
            </label>
            <select
              name="genre"
              id="genre"
              value={form.genre}
              onChange={handleFormChange}
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="synopsis" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Synopsis <span className="text-xs text-gray-500">(max 180 characters)</span>
            </label>
            <textarea
              name="synopsis"
              id="synopsis"
              placeholder="Short synopsis (max 180 characters)"
              value={form.synopsis}
              onChange={handleFormChange}
              required
              maxLength={180}
              rows={2}
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
            />
            <div className="text-xs text-gray-500 text-right">{form.synopsis.length}/180</div>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Story content
            </label>
            <textarea
              name="content"
              id="content"
              placeholder="Story content"
              value={form.content}
              onChange={handleFormChange}
              required
              rows={6}
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}