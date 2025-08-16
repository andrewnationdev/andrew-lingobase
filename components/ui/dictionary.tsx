"use client"

import { useEffect, useState } from "react";
import DictionaryForm from "./dictionary-form"
import { supabase } from "@/lib/supabase/database";
import { InfoIcon, PencilIcon, TrashIcon } from "lucide-react";
import WordImport from "./wordimport";

export interface IWord {
    id?: string | number;
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
    const [editing, setEditing] = useState<boolean>(false);
    const [word, setWord] = useState<IWord>({
        lexical_item: '',
        definition: '',
        pos: '',
        notes: '',
        transliteration: '',
        conlang_code: '',
        owner: ''
    })

    const onFinishEditing = async () => {
        setEditing(false);
        setWord({
            lexical_item: '',
            definition: '',
            pos: '',
            notes: '',
            transliteration: '',
            conlang_code: '',
            owner: ''
        });

        const lex = await supabase.from('conlang-dictionary').select('*').eq('conlang_code', data.langCode);

        setLexicon(lex?.data);
        window.location.reload();
    }

    useEffect(() => {
        const fetchDictionary = async () => {
            const lex = await supabase.from('conlang-dictionary').select('*').eq('conlang_code', data.langCode);

            setLexicon(lex?.data);
        }


        fetchDictionary();
    }, [])

    const handleEditWordMode = (word: IWord) => {
        setEditing(true);
        setWord(word);
    }

    const handleDeleteWord = async (item: IWord) => {
        const confirmDelete = confirm(
            `Are you sure you want to delete the word "${item.lexical_item}"? 
            This action cannot be undone.`
        );

        if (!confirmDelete) return;

        await supabase
            .from('conlang-dictionary')
            .delete()
            .eq('id', item.id)
            .eq('lexical_item', item.lexical_item)
            .eq('conlang_code', data.langCode)
            .eq('owner', data.owner);

        const lex = await supabase
            .from('conlang-dictionary')
            .select('*')
            .eq('conlang_code', data.langCode);

        setLexicon(lex?.data || []);
    }

    return <div>
        <h1 className="text-3xl font-bold">Your Lexicon:</h1>
        <div className="mt-4 flex gap-4 w-full flex-wrap">
            {lexicon.length == 0 && <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                <InfoIcon size="16" strokeWidth={2} />
                The vocabulary of this conlang is empty.
                {data.loggedUser == data.owner && <span>
                    Remember that languages need words to describe the world.
                </span>}
            </div>}
            {!editing && lexicon.map((item, index) => (
                <div
                    key={index}
                    className="p-6 bg-white dark:bg-gray-800 rounded-xl my-2 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200 w-full sm:w-[calc(50%-0.5rem)]"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className={`font-bold text-gray-900 dark:text-white ${item.conlang_code == "AR" ? "semlek text-2xl" : "text-xl"}`}>
                                {item.lexical_item}
                            </h3>
                            {item.transliteration && (
                                <span className="ml-2 text-gray-500 dark:text-gray-400 font-normal text-sm">
                                    {item.transliteration}
                                </span>
                            )}
                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                {item.definition} - ({item.pos})
                            </p>
                        </div>

                        {data.loggedUser == data.owner && <><button
                            className="ml-4 px-4 py-2 bg-emerald-500 text-white font-medium text-sm rounded-full shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
                            onClick={() => handleEditWordMode(item)}
                        >
                            <PencilIcon />
                        </button>
                            <button
                                className="ml-4 px-4 py-2 bg-red-500 text-white font-medium text-sm rounded-full shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
                                onClick={() => handleDeleteWord(item)}
                            >
                                <TrashIcon />
                            </button></>}
                    </div>
                </div>
            ))}
        </div>
        <hr className="my-4"/>
        {data.owner == data.loggedUser && <WordImport langCode={data.langCode} owner={data.owner} />}
        <hr className="my-4" />
        {data.owner == data.loggedUser && <DictionaryForm editing={editing} word={word} onFinishEditing={onFinishEditing} conlang_code={data.langCode} owner={data.owner} />}
    </div>
}