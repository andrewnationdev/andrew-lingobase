/* eslint-disable @typescript-eslint/ban-ts-comment */

import EditConlang from "@/components/ui/conlang-edit";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function EditConlangPage({ params }) {
    const conlangCode = params.id;
      const supabase = await createClient();
    
      const { data, error } = await supabase.auth.getClaims();
      if (error || !data?.claims) {
        redirect("/auth/login");
      }

      let uname = '';

      if(data?.claims?.email){
        uname = data?.claims?.email?.split('@')[0];
      }

    return <>
        <EditConlang conlangCode={conlangCode} userName={uname}/>
    </>
}
