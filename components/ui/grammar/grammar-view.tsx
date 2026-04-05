"use client";
import { supabase } from "@/lib/supabase/database";
import { fetchUserProfileDisplay } from "@/lib/user-utils";
import { useEffect, useState } from "react";
import ReturnComponent from "../return";
import { InfoIcon } from "lucide-react";
import QuickNavigationComponent from "../quicknavigation";
import MarkdownViewerComponent from "../markdown/markdown-viewer";

export default function GrammarView(props: { id: string; loggedUser: string }) {
  const [conlang, setConlang] = useState(null);
  const [ownerDisplayName, setOwnerDisplayName] = useState("");
  const [grammarText, setGrammarText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [message, setMessage] = useState(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      let error;
      if (grammarText !== "" && conlang?.code) {
        const { error: updateError } = await supabase
          .from("conlang")
          .update({
            grammar_doc: grammarText,
          })
          .eq("id", conlang?.id);
        error = updateError;
      }

      if (error) {
        throw error;
      }
      setMessage({ type: "success", text: "Grammar updated successfully!" });
      window.location.reload();
    } catch (error) {
      setMessage({
        type: "error",
        text: `An error occurred while updating grammar: ` + error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setGrammarText(e.target.value);
  };

  //Next steps:

  /**
   * Improve styling
   */

  useEffect(() => {
    const getConlangFromId = async () => {
      const conlangs = await supabase
        .from("conlang")
        .select("*")
        .eq("code", props.id);

      const data = await conlangs?.data;

      if (data?.length > 0) {
        console.log(data![0]);
        const row = data![0];
        setConlang(row);

        // fetch owner's display name (alias) if any
        try {
          const owner = row.created_by;
          if (owner) {
            const res = await fetchUserProfileDisplay(owner);
            setOwnerDisplayName(res.displayName || owner);
          }

          setGrammarText(row.grammar_doc || "");
        } catch (err) {
          console.debug("Error fetching owner display name", err);
        }

        console.log(ownerDisplayName);
      }
    };

    getConlangFromId();
  }, []);

  return (
    <>
      <div className="flex-1 w-full flex flex-col gap-12">
        <div className="w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-2">
            <div className="w-full md:w-auto">
              <ReturnComponent id={conlang?.code} />
            </div>
            <h1 className="text-xl md:text-3xl font-bold text-center md:text-left w-full">
              {conlang?.english_name + "'s Grammar"}
            </h1>
          </div>
          {conlang?.created_by == props.loggedUser && <div className="bg-teal-500 text-sm p-3 px-5 rounded-md text-black flex gap-8 my-4 items-center">
            <InfoIcon size="16" strokeWidth={2} />
            {`Here you will be able to showcase your conlang's amazing grammar!`}
          </div>}
          <QuickNavigationComponent
            data={[
              {
                href: "#guide",
                text: "Grammar",
              },
              {
                href: "https://www.markdownguide.org/basic-syntax/",
                text: "Mardkdown Guide",
              },
              {
                href: "https://www.youtube.com/@Trevtutor",
                text: "Linguistics",
              },
            ]}
          />
          {conlang?.created_by == props.loggedUser && (
            <>
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
                      htmlFor="conlang_name"
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Conlang Name
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="conlang_name"
                      required
                      disabled
                      value={conlang?.english_name || ""}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="grammar_doc"
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Grammar Text (in HTML or Markdown)
                    </label>
                    <textarea
                      name="grammar_doc"
                      id="grammar_doc"
                      required
                      rows={10}
                      value={grammarText}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                    />
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
              <hr className="mt-8" />
            </>
          )}
          <div id="guide" className="mt-8 w-full overflow-hidden">
          <MarkdownViewerComponent
            content={
              grammarText.replace(/\\n/g, "\n") ||
              "No grammar documentation available."
            }
          />
          </div>
        </div>
      </div>
    </>
  );
}
