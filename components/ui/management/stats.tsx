"use client";
import { useEffect, useState } from "react";
import { IWord } from "../dictionary";
import { supabase } from "@/lib/supabase/database";
import {
  calculateDuplicateEntries,
  calculateHomonyns,
  calculateWordsWithEmptyPOS,
  IResult,
} from "@/lib/dictionary";
import StatsListComponent from "./stats-list";
import PurgeDictionarySectionComponent from "./purge";

interface IManagementStatsCard {
  langCode: string;
}

export default function ManagementStatsCard(props: IManagementStatsCard) {
  //Homonyms, duplicate entries, number of words
  const [homonyms, setHomonyms] = useState<IResult>({
    number: 0,
    data: [] as IWord[] | undefined,
  });
  const [duplicateEntries, setDuplicateEntries] = useState<IResult>({
    number: 0,
    data: [] as IWord[] | undefined,
  });
  const [withoutPOS, setWithoutPOS] = useState<IResult>({
    data: [] as IWord[] | undefined,
    number: 0,
  })

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

  useEffect(() => {
    setHomonyms(calculateHomonyns(lexicon));
    setDuplicateEntries(calculateDuplicateEntries(lexicon));
    setWithoutPOS(calculateWordsWithEmptyPOS(lexicon));
  }, [lexicon]);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl my-2 min-w-[80%] mx-auto shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200 w-full sm:w-[calc(50%-0.5rem)]">
      <div className="flex flex-col gap-4" id="overview">
        <span>
          <strong>Number of Words: </strong> {lexicon.length}
        </span>
        <span>
          <strong>Words without POS: </strong> {withoutPOS.number}
        </span>
        <span>
          <strong>Homonyms/Polyssemic words: </strong>
          {homonyms.number}
        </span>
        <span>
          <strong>Duplicate Entries: </strong> {duplicateEntries.number}
        </span>
      </div>
      <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />
      <StatsListComponent title="List of Homonyms" data={homonyms} />
      <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />
      <div id="duplicates">
        <StatsListComponent
          title="List of Duplicate Entries"
          data={duplicateEntries}
        />
      </div>
      <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />
      <div>
        <StatsListComponent
          title="List of Words without POS"
          data={withoutPOS}
        />
      </div>
      <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />
      <div id="purge-dictionary">
        {lexicon?.length > 0 && (
          <PurgeDictionarySectionComponent langCode={props.langCode} />
        )}
      </div>
    </div>
  );
}
