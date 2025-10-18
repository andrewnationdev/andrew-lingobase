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
        const { count: wordsCount } = await supabase
          .from("conlang-dictionary")
          .select("*", { count: "exact", head: true });

        setWords(wordsCount || 0);

        const { count: conlangsCount } = await supabase
          .from("conlang")
          .select("*", { count: "exact", head: true });

        setConlangs(conlangsCount || 0);
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
