"use client";
import { supabase } from "@/lib/supabase/database";
import { InfoIcon } from "lucide-react";
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

      console.log(data);
    };

    retrieveConlangs();
  }, []);

  return (
    <div className="flex flex-col w-full space-y-4 font-sans">
      {conlangs.length > 0 &&
        conlangs.map((conlang) => (
          <div
            key={conlang.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
          >
            <div className="flex-1">
              <div className="font-bold text-gray-800">
                {conlang.english_name}
              </div>
              <div className="text-sm text-gray-500">{conlang.native_name}</div>
            </div>
            <div className="flex-none ml-4">
              <Link
                className="inline-flex items-center justify-center py-2 px-4 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                href={`dashboard/view/${conlang.code}`}
              >
                View
              </Link>
            </div>
          </div>
        ))}
      {conlangs.length == 0 && (
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Once you create your first conlang, it will appear here!
        </div>
      )}
    </div>
  );
}
