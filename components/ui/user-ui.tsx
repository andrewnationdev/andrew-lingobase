"use client";

import { supabase } from "@/lib/supabase/database";
import { useEffect, useState } from "react";
import GreenButton from "./green-button";

export default function UserPageComponent({ user }) {
  const [userName, setUserName] = useState("");
  const [userLangs, setUserLangs] = useState([]);
  const [conlangCount, setConlangCount] = useState(0);

  useEffect(() => {
    const fetchUserLangs = async () => {
      const langs = await supabase
        .from("conlang")
        .select("*")
        .eq("created_by", userName);

      const num = langs.data.length;

      setConlangCount(num);
      setUserLangs(langs.data);
    };

    fetchUserLangs();
  }, [userName, user]);

  useEffect(() => {
      setUserName(user);
  }, [user]);

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <h1 className="text-3xl bold">{`${userName}'s Profile`}</h1>
      {/*<pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
            {JSON.stringify(user, null, 2)}
        </pre>*/}
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab dolores
        dicta eum dolor vitae quae perferendis explicabo voluptatibus, qui,
        molestias similique, maiores nesciunt! Inventore, qui impedit quas eum
        laudantium expedita.
      </p>
      <hr className="my-4" />
      <h2 className="text-3xl font-semibold">{`This user's conlangs`}</h2>
      <span>This user has {conlangCount} conlangs on the website!</span>
      <ol className="flex flex-col gap-2 max-w-[250px] text-center mx-auto">
        {userLangs.length > 0 &&
          userLangs.map((c) => (
            <GreenButton
              key={c.id}
              props={{
                title: c.english_name,
                link: `/dashboard/conlang/${c.conlang_code}`,
              }}
            />
          ))}
      </ol>
    </div>
  );
}
