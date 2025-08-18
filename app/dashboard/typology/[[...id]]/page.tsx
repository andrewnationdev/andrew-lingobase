import TypologyForm from "@/components/ui/typology-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function TypologyPage({ params }) {
  const conlangCode = params.id[0];

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  let uname = "";

  if (data?.claims?.email) {
    uname = data?.claims?.email?.split("@")[0];
  }

  return <TypologyForm id={conlangCode} loggedUser={uname} />;
}
