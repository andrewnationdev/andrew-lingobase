import LiteratureSection from "@/components/ui/literature/literature";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LiteraturePage() {
    const supabase = await createClient();
  
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
      redirect("/auth/login");
    }
  
    let uname = "";
  
    if (data?.claims?.email) {
      uname = data?.claims?.email?.split("@")[0];
    }

  return (
    <>
      <h1 className="text-3xl font-bold">Literature in Conlangs</h1>
      <LiteratureSection loggedUser={uname} />
    </>
  );
}
