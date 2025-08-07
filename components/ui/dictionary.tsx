"use client"

import { useEffect, useState } from "react";
import DictionaryForm from "./dictionary-form"
import { supabase } from "@/lib/supabase/database";

interface IWord {
    lexical_item: string;
    definition: string;
    pos: string;
    notes: string;
    transliteration: string;
    conlang_code: string;
    owner: string;
}

export default function Dictionary({ data }: {
    data: {
        langCode: string,
        owner: string,
        loggedUser: string
    }
}) {
    const [lexicon, setLexicon] = useState<IWord[]>([]);

    useEffect(() => {
        const fetchDictionary = async () => {
            const lex = await supabase.from('conlang-dictionary').select('*').eq('conlang_code', `[\"${data.langCode}\"]`);

            setLexicon(lex?.data);

            console.log(lex?.data)
        }


        fetchDictionary();
    }, [])

    console.log(data.owner, data.loggedUser)
    return <div>
        <h1 className="mt-4 text-3xl font-bold">Your Lexicon:</h1>
        <div className="mt-8">
            {lexicon.map((item, index) => (
                <div
                    key={index}
                    className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                                {item.lexical_item}
                                {item.transliteration && (
                                    <span className="ml-2 text-gray-500 dark:text-gray-400 font-normal text-sm">
                                        {item.transliteration}
                                    </span>
                                )}
                            </h3>
                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                {item.definition} - ({item.pos})
                            </p>
                        </div>
                        
                        <button
                            className="ml-4 px-4 py-2 bg-emerald-500 text-white font-medium text-sm rounded-full shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
                            onClick={() => console.log('View button clicked for', item.lexical_item)}
                        >
                            Edit
                        </button>
                    </div>
                </div>
            ))}
        </div>
        <hr className="my-4" />
        {data.owner == data.loggedUser && <DictionaryForm conlang_code={data.langCode} owner={data.owner} />}
    </div>
}