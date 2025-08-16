import Dictionary from "@/components/ui/dictionary";
import ReturnComponent from "@/components/ui/return";
import { supabase } from "@/lib/supabase/database";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DictionaryPage({ params }) {
    const langCode = await params.id[0];

    const conlang = await supabase.from('conlang').select("*").eq('code', langCode);

    const c_owner = conlang?.data[0]?.created_by;

    const sup = await createClient();

    const { data, error } = await sup.auth.getClaims();
    if (error || !data?.claims) {
        redirect("/auth/login");
    }

    let uname = '';

    if (data?.claims?.email) {
        uname = data?.claims?.email?.split('@')[0];
    }

    return <>
        <div className="flex gap-4 items-center">
        <div className="max-w-sm">
            <ReturnComponent id={langCode} />
        </div><h1 className="mt-4 text-3xl font-bold">{`Dictionary for ${conlang?.data[0]?.english_name} (${langCode})`}</h1>
        </div>
        <Dictionary data={{
            owner: c_owner,
            loggedUser: uname,
            langCode: langCode
        }} />
    </>
}