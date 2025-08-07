"use client"

import { supabase } from "@/lib/supabase/database";
import { useEffect, useState } from "react"

export default function UserPageComponent({ user }) {
    const [userName, setUserName] = useState('');
    const [userLangs, setUserLangs] = useState([]);
    const [conlangCount, setConlangCount] = useState(0);

    useEffect(()=>{
        const fetchUserLangs = async () => {
            const langs = await supabase.from('conlang').select('*').eq('created_by', userName);

            const num = langs.data.length;

            setConlangCount(num);
            setUserLangs(langs.data);
        }

        fetchUserLangs();
    }, [userName])

    useEffect(() => {
        if (user?.email) {
            const uname = user.email?.split('@')[0];

            setUserName(uname);
        }
    }, [])

    return <div className="flex-1 w-full flex flex-col gap-12">
        <h1 className="text-3xl bold">Hello, {userName}!</h1>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
            {JSON.stringify(user, null, 2)}
        </pre>
        <span>You have {conlangCount} conlangs on the website!</span>
        <h2>Your conlangs:</h2>
        <ol>
            {userLangs.length > 0 && userLangs.map((c) => <li key={c.id}>{c.english_name}</li>)}
        </ol>
    </div>
}