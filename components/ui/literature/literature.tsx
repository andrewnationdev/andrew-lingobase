"use client";
import React, { useEffect, useState } from "react";
import { InfoIcon } from "lucide-react";
import { supabase } from "@/lib/supabase/database";
const genres = ["Fantasy", "Science Fiction", "Romance"];

export default function LiteratureSection({ loggedUser }: { loggedUser: string }) {
  type StoryRow = {
    id: number;
    title: string;
    author: string | null;
    conlang: string | null;
    genre: string | null;
    synopsis: string | null;
    content: string | null;
    created_at?: string | null;
    date?: string | null;
  };

  type ConlangRow = {
    english_name?: string | null;
    code?: string | null;
    created_by?: string | null;
  };

  const [stories, setStories] = useState<StoryRow[]>([]);
  const [selectedStory, setSelectedStory] = useState<StoryRow | null>(null);
  const [search, setSearch] = useState("");
  const [filterConlang, setFilterConlang] = useState("");
  const [allConlangs, setAllConlangs] = useState<ConlangRow[]>([]);
  const [userConlangs, setUserConlangs] = useState<string[]>([]);
  const [filterGenre, setFilterGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    author: loggedUser || "None",
    conlang: "",
    genre: genres[0],
    synopsis: "",
    content: "",
  });

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase.from("literature").select("*").order("created_at", { ascending: false });

        if (filterConlang) {
          query = query.eq("conlang", filterConlang);
        }
        if (filterGenre) {
          query = query.eq("genre", filterGenre);
        }

        const { data, error: fetchError } = await query;
        if (fetchError) throw fetchError;

        const rows = (data || []) as StoryRow[];

        const mapped = rows.map((row) => ({
          id: row.id,
          title: row.title,
          author: row.author || "",
          conlang: row.conlang || "",
          genre: row.genre || "",
          synopsis: row.synopsis || "",
          content: row.content || "",
          date: row.created_at || row.date || "",
        }));

        setStories(mapped);
      } catch (err: unknown) {
        console.error("Error fetching stories:", err);
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Erro ao buscar histórias");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [filterConlang, filterGenre]);

  // load real conlang names for selects
  useEffect(() => {
    const loadConlangs = async () => {
      try {
        const { data, error } = await supabase
          .from("conlang")
          .select("english_name, code, created_by")
          .order("english_name", { ascending: true });
        if (error) throw error;
        const rows = (data || []) as ConlangRow[];
        setAllConlangs(rows);

        const names = rows.map((c) => c.english_name).filter(Boolean) as string[];

        // only conlangs created by loggedUser for the add-story form
        const userNames = rows
          .filter((c) => !!loggedUser && c.created_by === loggedUser)
          .map((c) => c.english_name)
          .filter(Boolean) as string[];

        setUserConlangs(userNames);

        // set default conlang in form: prefer user's first conlang, else first overall
        const defaultConlang = userNames[0] || names[0] || "";
        setForm((f) => ({ ...f, conlang: f.conlang || defaultConlang }));
      } catch (err) {
        console.debug("Error loading conlangs", err);
      }
    };

    loadConlangs();
  }, [loggedUser]);

  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(search.toLowerCase()) &&
    (filterConlang ? story.conlang === filterConlang : true) &&
    (filterGenre ? story.genre === filterGenre : true)
  );

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    if (name === "synopsis" && value.length > 180) return;
    setForm({ ...form, [name]: value });
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        title: form.title,
        author: form.author,
        conlang: form.conlang,
        genre: form.genre,
        synopsis: form.synopsis,
        content: form.content,
      };

  const { data, error: insertError } = await supabase.from("literature").insert([payload]).select();
      if (insertError) throw insertError;

      setForm({
        title: "",
        author: "Current User",
        conlang: userConlangs[0] || (allConlangs[0]?.english_name ?? ""),
        genre: genres[0],
        synopsis: "",
        content: "",
      });

      // If insert returned the created row(s), prepend to stories
      if (data && data.length > 0) {
        const newRow = data[0] as StoryRow;
        setStories((prev) => [
          {
            id: newRow.id,
            title: newRow.title,
            author: newRow.author,
            conlang: newRow.conlang,
            genre: newRow.genre,
            synopsis: newRow.synopsis,
            content: newRow.content,
            date: newRow.created_at || newRow.date,
          },
          ...prev,
        ]);
      } else {
        // fallback: refetch
        const { data: refetchData } = await supabase.from("literature").select("*").order("created_at", { ascending: false });
        const refRows = (refetchData || []) as StoryRow[];
        setStories(
          refRows.map((row) => ({
            id: row.id,
            title: row.title,
            author: row.author || "",
            conlang: row.conlang || "",
            genre: row.genre || "",
            synopsis: row.synopsis || "",
            content: row.content || "",
            date: row.created_at || row.date || "",
          }))
        );
      }
    } catch (err: unknown) {
      console.error("Error inserting story:", err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Erro ao submeter história");
    } finally {
      setLoading(false);
    }
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
          {allConlangs.map((c: ConlangRow) => (
            <option key={c.english_name} value={c.english_name}>
              {c.english_name}
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
            {loading ? (
              <div className="text-center text-gray-500">Loading stories...</div>
            ) : (
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
                  <div className="col-span-full text-gray-500 text-center">No stories found.</div>
                )}
              </div>
            )}
            {error && <div className="text-red-500 mt-3">{error}</div>}
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
              {userConlangs.length > 0 ? (
                userConlangs.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))
              ) : (
                // fallback to all conlangs if user has none
                allConlangs.map((c: ConlangRow) => (
                  <option key={c.english_name} value={c.english_name}>
                    {c.english_name}
                  </option>
                ))
              )}
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
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
            } transition-colors duration-200`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}