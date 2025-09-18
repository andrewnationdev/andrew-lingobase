"use client";
import { supabase } from "@/lib/supabase/database";
import { showErrorToast } from "@/lib/toast";
import { useEffect, useState } from "react";

export default function LingobaseStats() {
  const [words, setWords] = useState(0);
  const [conlangs, setConlangs] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lex = await supabase.from("conlang-dictionary").select("*");

        setWords(lex?.data?.length || 0);

        const langs = await supabase.from("conlang").select("*");

        setConlangs(langs?.data?.length || 0);
      } catch (err) {
        console.error(err);
        showErrorToast("Error fetching stats");
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg w-full">
        <p>
          {`There are ${words} words belonging to ${conlangs} conlangs! Why don't you add more?`}
        </p>
      </div>
    </>
  );
}
