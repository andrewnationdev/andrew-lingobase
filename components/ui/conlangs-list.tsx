"use client";
import { supabase } from "@/lib/supabase/database";
import { EyeIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ConlangsList({
  authOnly = false,
  user,
}: {
  authOnly?: boolean;
  user?: string;
}) {
  const [conlangs, setConlangs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const retrieveConlangs = async () => {
      const response = await supabase
        .from("conlang")
        .select("*")
        .order("english_name", { ascending: true });
      const data = await response.data;

      if (authOnly && user && user !== "") {
        const filtered = data.filter((c) => c.created_by == user);
        setConlangs(filtered);
        return;
      }

      setConlangs(data);
    };

    retrieveConlangs();
  }, []);

  // Filter conlangs if search bar is visible and search is not empty
  const filteredConlangs =
    !user && !authOnly && search
      ? conlangs.filter(
          (c) =>
            (c.english_name || "")
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            (c.native_name || "")
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            (c.code || "")
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            (c.id || "")
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase())
        )
      : conlangs;

return (
    <div className="flex flex-col w-full space-y-4 font-sans">
      {/* Show search bar only if not authOnly and no user */}
      {!authOnly && !user && (
        <div className="mb-2">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Search by name, code, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}
      {filteredConlangs.length > 0 &&
        filteredConlangs.map((conlang) => (
          <div
            key={conlang.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm light:bg-white"
          >
            <div className="flex-1">
              <div className="font-bold light:text-gray-800">
                {conlang.english_name}
              </div>
              <div className="text-sm light:text-gray-500">{conlang.native_name}</div>
            </div>
            <div className="flex-none ml-4">
              <Link
                className="inline-flex items-center justify-center py-2 px-4 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                href={`dashboard/view/${conlang.code}`}
              >
                <EyeIcon ></EyeIcon>
              </Link>
            </div>
          </div>
        ))}
      {filteredConlangs.length == 0 && (
        <div className="bg-teal-500 fg-white text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Once you create your first conlang, it will appear here!
        </div>
      )}
    </div>
  );
}