import ManagementStatsCard from "@/components/ui/management/stats";
import QuickNavigationComponent from "@/components/ui/quicknavigation";
import ReturnComponent from "@/components/ui/return";
import { supabase } from "@/lib/supabase/database";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ManagementPage({ params }) {
  const langCode = (await params.id) ? params.id[0] : "SHOW_ALL";

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

  if (c_owner != uname) {
    redirect("/dashboard")
  }

  return (
    <>
      {c_owner == uname && (
        <QuickNavigationComponent
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
        />
      )}
      <div className="flex gap-4 items-center">
        {langCode !== "SHOW_ALL" && (
          <div className="max-w-sm">
            <ReturnComponent id={langCode} />
          </div>
        )}
        <h1 className="text-3xl font-bold">{`Manage ${conlang?.data[0]?.english_name} (${langCode})`}</h1>
      </div>
        <ManagementStatsCard langCode={langCode}/>
    </>
  );
}
