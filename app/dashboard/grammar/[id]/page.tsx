import GrammarView from "@/components/ui/grammar/grammar-view";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function GrammarPage({ params }) {
  const conlangCode = params.id;
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
      <GrammarView id={conlangCode} user={uname}/>
    </>
  );
}
