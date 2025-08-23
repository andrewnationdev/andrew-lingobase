import Dictionary from "@/components/ui/dictionary";
import QuickNavigationComponent from "@/components/ui/quicknavigation";
import ReturnComponent from "@/components/ui/return";
import { supabase } from "@/lib/supabase/database";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DictionaryPage({ params }) {
  const langCode = await params.id ? params.id[0] : "SHOW_ALL";

  const conlang = await supabase
    .from("conlang")
    .select("*")
    .eq("code", langCode);

  const c_owner = conlang?.data[0]?.created_by;

  const sup = await createClient();

  const { data, error } = await sup.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  let uname = "";

  if (data?.claims?.email) {
    uname = data?.claims?.email?.split("@")[0];
  }

  return (
    <>
      {c_owner == uname && <QuickNavigationComponent
        data={[
          {
            href: "#lexicon",
            text: "Lexicon",
          },
          {
            href: "#import-words",
            text: "Import Words",
          },
          {
            href: "#add-words",
            text: "Add Words",
          },
        ]}
      />}
      <div className="flex gap-4 items-center">
        {langCode !== "SHOW_ALL" && <div className="max-w-sm">
          <ReturnComponent id={langCode} />
        </div>}
        <h1 className="mt-4 text-3xl font-bold">{langCode !== "SHOW_ALL" ? `Dictionary for ${conlang?.data[0]?.english_name} (${langCode})` : `Recently Added Words`}</h1>
      </div>
      <Dictionary
        data={{
          owner: c_owner,
          loggedUser: uname,
          langCode: langCode,
        }}
      />
    </>
  );
}
