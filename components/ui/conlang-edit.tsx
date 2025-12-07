"use client"

import { supabase } from "@/lib/supabase/database";
import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/lib/toast";

type CustomLinks = {
  link1: { title: string; url: string };
  link2: { title: string; url: string };
};

const defaultLinks: CustomLinks = {
  link1: { title: "", url: "" },
  link2: { title: "", url: "" },
};

export default function EditConlang({ conlangCode, userName }: { conlangCode?: string; userName?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!conlangCode;

  const [conlang, setConlang] = useState<{
    english_name: string;
    code: string;
    summary: string;
    native_name: string;
    custom_links: CustomLinks;
  }>({
    english_name: "",
    code: "",
    summary: "",
    native_name: "",
    custom_links: defaultLinks,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConlang((prev) => ({
      ...prev,
      [name]: name === "code" ? value.toUpperCase() : value,
    }));
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [linkKey, field] = name.split(".") as ["link1" | "link2", "title" | "url"];
    setConlang((prev) => ({
      ...prev,
      custom_links: {
        ...prev.custom_links,
        [linkKey]: {
          ...prev.custom_links[linkKey],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const conlang_with_user = {
      ...conlang,
      code: conlang.code.toUpperCase().trim(),
      created_by: userName || "anonymous",
      custom_links: conlang.custom_links ?? defaultLinks,
    };

    try {
      let error = null;

      if (isEditing) {
        const { error: updateError } = await supabase
          .from("conlang")
          .update(conlang_with_user)
          .eq("code", conlangCode);
        error = updateError;
      } else {
        const { data: existing, error: fetchError } = await supabase
          .from("conlang")
          .select("code")
          .eq("code", conlang_with_user.code)
          .single();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- legacy fetchError shape, narrow later if needed
        if (fetchError && (fetchError as any).code !== "PGRST116") {
          console.error("Error checking conlang code existence:", fetchError);
          showErrorToast("Failed to check conlang code existence");
          throw fetchError;
        }

        if (existing && existing.code) {
          showErrorToast(`A conlang with the code "${conlang_with_user.code}" already exists. Please choose a different code.`);
          throw new Error("This code already exists! Choose another");
        }

        const { error: insertError } = await supabase.from("conlang").insert([conlang_with_user]);
        error = insertError;
      }

      if (error) throw error;

      const targetCode = isEditing ? (conlangCode as string) : conlang_with_user.code;
      const redirectToPath = `/dashboard/view/${targetCode}`;
      router.push(redirectToPath);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchConlang = async () => {
      if (!isEditing) return;
      setIsLoading(true);
      const { data, error } = await supabase.from("conlang").select("*").eq("code", conlangCode).single();
      if (error) {
        console.error("Error fetching conlang:", error);
      } else if (data) {
        setConlang({
          english_name: data.english_name ?? "",
          code: data.code ?? "",
          summary: data.summary ?? "",
          native_name: data.native_name ?? "",
          custom_links: {
            link1: {
              title: data.custom_links?.link1?.title ?? "",
              url: data.custom_links?.link1?.url ?? "",
            },
            link2: {
              title: data.custom_links?.link2?.title ?? "",
              url: data.custom_links?.link2?.url ?? "",
            },
          },
        });
      }
      setIsLoading(false);
    };
    fetchConlang();
  }, [isEditing, conlangCode]);

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-teal-600 text-sm p-3 px-5 rounded-md text-foreground flex gap-8 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          {isEditing
            ? "You are currently editing this conlang. Changes will be saved to your entry."
            : "On this page you can add your conlang to the website. Feel free to add all your other conlangs if you have more than one."}
        </div>

        <div className="flex w-full flex-col gap-2 mt-8">
          <span className="text-2xl">
            <strong>{isEditing ? "Edit Conlang" : "Create a Conlang"}</strong>
          </span>
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="space-y-6">
            {/* Basic fields */}
            <div>
              <label htmlFor="english_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                English Name
              </label>
              <input
                type="text"
                name="english_name"
                id="english_name"
                value={conlang.english_name}
                onChange={handleChange}
                required
                placeholder="E.g., Na'vi"
                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
              />
            </div>

            <div>
              <label htmlFor="native_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Native Name
              </label>
              <input
                type="text"
                name="native_name"
                id="native_name"
                required
                value={conlang.native_name}
                onChange={handleChange}
                placeholder="E.g., Lì'fya leNa'vi"
                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
              />
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Code
              </label>
              <input
                type="text"
                name="code"
                required
                id="code"
                value={conlang.code}
                onChange={handleChange}
                maxLength={6}
                disabled={isEditing}
                placeholder="E.g., NAV"
                className={`block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200 ${
                  isEditing ? "cursor-not-allowed bg-gray-200 dark:bg-gray-600" : ""
                }`}
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                A short, unique code for the language (e.g., ISO 639-3 style).
              </p>
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Summary
              </label>
              <textarea
                name="summary"
                required
                id="summary"
                rows={4}
                value={conlang.summary}
                onChange={handleChange}
                maxLength={2000}
                placeholder="Briefly describe the conlang, its purpose, and key features."
                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
              ></textarea>
            </div>

            <hr className="my-4" />

            <h3 className="text-1xl font-bold">Set Custom Links</h3>
            <span>These links will appear on your conlang page.</span>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="link1_title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Link 1 Title
                </label>
                <input
                  type="text"
                  id="link1_title"
                  name="link1.title"
                  value={conlang.custom_links.link1.title}
                  onChange={handleLinkChange}
                  placeholder="E.g., Official Site"
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                />
              </div>

              <div>
                <label htmlFor="link1_url" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Link 1 URL
                </label>
                <input
                  type="url"
                  id="link1_url"
                  name="link1.url"
                  value={conlang.custom_links.link1.url}
                  onChange={handleLinkChange}
                  placeholder="https://example.com"
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                />
              </div>

              <div>
                <label htmlFor="link2_title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Link 2 Title
                </label>
                <input
                  type="text"
                  id="link2_title"
                  name="link2.title"
                  value={conlang.custom_links.link2.title}
                  onChange={handleLinkChange}
                  placeholder="E.g., Grammar Guide"
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                />
              </div>

              <div>
                <label htmlFor="link2_url" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Link 2 URL
                </label>
                <input
                  type="url"
                  id="link2_url"
                  name="link2.url"
                  value={conlang.custom_links.link2.url}
                  onChange={handleLinkChange}
                  placeholder="https://example.com/grammar"
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            </div>

            <hr className="my-4" />

            <div>
                <label htmlFor="" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  YouTube Video URL (optional, coming soon!)
                </label>
                <input
                  type="url"
                  id=""
                  name=""
                  disabled
                  value={""}
                  placeholder="https://example.com"
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                />
              </div>

            <hr className="my-4" />

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : isEditing ? "Save Changes" : "Add Conlang"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}