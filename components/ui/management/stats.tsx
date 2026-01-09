"use client";
import { useEffect, useState } from "react";
import { IWord } from "../dictionary";
import { supabase } from "@/lib/supabase/database";
import { calculateHomonyns, IHomonynsResult } from "@/lib/dictionary";

interface IManagementStatsCard {
  langCode: string;
}

export default function ManagementStatsCard(props: IManagementStatsCard) {
  //Homonyms, duplicate entries, number of words
  const [homonyms, setHomonyms] = useState<IHomonynsResult>({
    number: 0,
    homonyms: [] as IWord[] | undefined,
  });

  const [lexicon, setLexicon] = useState<IWord[]>([]);

  useEffect(() => {
    const fetchDictionary = async () => {
      const lex = await supabase
        .from("conlang-dictionary")
        .select("*")
        .eq("conlang_code", props.langCode)
        .order("created_at", { ascending: false });
      setLexicon(lex?.data || []);
    };
    fetchDictionary();
  }, []);

  useEffect(()=>{
    setHomonyms(calculateHomonyns(lexicon));
  }, [lexicon])

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl my-2 min-w-[80%] mx-auto shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200 w-full sm:w-[calc(50%-0.5rem)]">
        <div className="flex flex-col gap-4">
            <span><strong>Number of Words: </strong> {lexicon.length}</span>
            <span><strong>Homonyms/Polyssemic words: </strong>{homonyms.number}</span>
            <span><strong>Duplicate Entries: </strong> {lexicon.length}</span>
            <span><strong>Synonyms: </strong> {lexicon.length}</span>
        </div>
        <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />
        <h2 className="mt-4 text-3xl font-bold">List of Homonyms</h2>
        <div className="flex flex-col gap-4 mt-4">
            {homonyms.homonyms && homonyms.homonyms.length > 0 ? homonyms.homonyms.map((item, index) => 
            <span key={index}>
                <strong>{item.lexical_item}</strong> - <em>{item.pos}</em> : {item.definition}</span>) : <span>No homonyms found.</span>}
        </div>
        <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />
        <button className="transition duration-150 ease-in-out hover:scale-125 w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">Purge Dictionary (SOON!)</button>
    </div>
  );
}
