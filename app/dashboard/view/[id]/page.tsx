'use client'
import { supabase } from "@/lib/supabase/database";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ViewConlangPage({ params }: { params: { id: string } }) {
  const [conlang, setConlang] = useState({
    english_name: "",
    id: "",
    code: "",
    created_at: "",
    created_by: "",
    summary: "",
    native_name: ""
  });

  const { id } = params;

  useEffect(() => {
    const getConlangFromId = async () => {
      const conlangs = await supabase.from('conlang').select('*').eq('code', id);

      let data = await conlangs?.data;

      if (data?.length! > 0) {
        console.log(data![0])
        setConlang(data![0]);
      }
    }

    getConlangFromId();

  }, [])

  return <div className="flex-1 w-full flex flex-col gap-12">
    <div className="w-full">
      <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-8 items-center">
        <InfoIcon size="16" strokeWidth={2} />
        Here you can find details about this language. Feel free to explore and create your own conlangs!
      </div>
      <div className="flex w-full flex-col gap-2 mt-8">
        <span className="text-2xl"><strong>{conlang?.english_name ? conlang?.english_name : 'Unnamed'}</strong></span>
        <span className="text-m">({conlang?.native_name})</span>
        <span className="text-sm">This language has been created by <Link href="/">{conlang?.created_by}</Link> on {conlang?.created_at}</span>
      </div>
      <button className="bg-white my-2 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Edit Information</button>
      <hr />
      <p className="mt-8">
        {conlang?.summary}
      </p>
      <hr className="my-8"/>
      <span className="text-xl">Stats</span>
      <div className="flex flex-col mt-2 w-full gap-4">
        <span>This language has 0 words in its lexicon, 0 vowels, 0 consonants and 0 phrases.</span>
        <span>It belongs to the Indo-European Family</span>
      </div>
      <hr className="my-8"/>
      <span className="text-xl">Access Information</span>
      <div className="flex w-full mt-2 flex-col">
        <button className="bg-white my-2 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Typology</button>
        <button className="bg-white my-2 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Sample Texts</button>
        <button className="bg-white my-2 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Articles</button>
        <button className="bg-white my-2 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Phonology</button>
        <button className="bg-white my-2 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Morphology</button>
        <button className="bg-white my-2 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Syntax</button>
        <button className="bg-white my-2 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Semantics and Pragmatics</button>
        <button className="bg-white my-2 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Dictionary</button>
      </div>
    </div>
  </div>
}