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
      <div className="bg-accent-light text-gray-800 dark:bg-accent-dark dark:text-gray-300 text-sm p-3 px-5 rounded-md flex gap-3 items-center">
        In the future, you will be able to add fanfics and short stories written
        in your conlangs here and showcase them :)
      </div>
      <LiteratureSection loggedUser={uname} />
    </>
  );
}
