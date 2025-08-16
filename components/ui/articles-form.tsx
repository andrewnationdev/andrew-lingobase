"use client";
import { supabase } from "@/lib/supabase/database";
import { useState, useEffect } from "react";

const ArticleFieldTitles = {
  title: "Title",
  content: "Content",
  written_by: "Written by",
};

export default function ArticleForm({
  id,
  loggedUser,
  currArticle,
  isEditing,
}: {
  id: string;
  loggedUser: string;
  currArticle: {
    title: string;
    content: string;
    written_by: string;
    id: string;
  };
  isEditing: boolean;
}) {
  const conlangCode = id;

  const [article, setArticle] = useState({
    title: "",
    content: "",
    written_by: loggedUser,
  });
  const [loading, setLoading] = useState(true);
  const [conlangName, setConlangName] = useState("Unnamed");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchConlangName = async () => {
      if (!conlangCode) {
        setLoading(false);
        return;
      }
      const response = await supabase
        .from("conlang")
        .select("english_name")
        .eq("code", conlangCode)
        .single();

      if (response?.error) {
        console.error("Error fetching conlang name:", response?.error);
      } else if (response?.data) {
        setConlangName(response?.data?.english_name || "Unnamed");
      }
      setLoading(false);
    };
    fetchConlangName();
  }, [conlangCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle((prevArticle) => ({
      ...prevArticle,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      let error;
      if (isEditing && currArticle && currArticle.id) {
        const { error: updateError } = await supabase
          .from("conlang-articles")
          .update({
            ...article,
            conlang_code: conlangCode,
            updated_at: new Date().toISOString(),
            written_by: loggedUser,
          })
          .eq("id", currArticle.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from("conlang-articles").insert([
          {
            ...article,
            conlang_code: conlangCode,
            updated_at: new Date().toISOString(),
            written_by: loggedUser,
          },
        ]);
        error = insertError;
      }
      if (error) {
        throw error;
      }
      setMessage({ type: "success", text: isEditing ? "Article updated successfully!" : "Article added successfully!" });
      if (!isEditing) {
        setArticle({ title: "", content: "", written_by: loggedUser });
      }
      window.location.reload();
    } catch (error) {
      setMessage({
        type: "error",
        text: `An error occurred while ${isEditing ? "updating" : "adding"} the article: ` + error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      setArticle({
        content: currArticle.content,
        title: currArticle.title,
        written_by: currArticle.written_by,
      });
    }
  }, [isEditing, currArticle]);

  if (loading) {
    return (
      <div className="text-gray-700 dark:text-gray-300">Loading data...</div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="flex w-full flex-col gap-2 mt-8">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Article for' : 'Add New Article for'} {conlangName}
          </span>
        </div>
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg"
        >
          {message && (
            <div
              className={`p-4 rounded-lg mb-4 ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
              >
                {ArticleFieldTitles.title}
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={article.title}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
              />
            </div>

            <div>
              <label
                htmlFor="written_by"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
              >
                {ArticleFieldTitles.written_by}
              </label>
              <input
                type="text"
                name="written_by"
                id="written_by"
                required
                disabled
                value={article.written_by}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
              >
                {ArticleFieldTitles.content}
              </label>

              <textarea
                name="content"
                id="content"
                required
                rows={10}
                value={article.content}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Article"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
