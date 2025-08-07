import ViewConlang from "@/components/ui/conlang-view";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ViewConlangPage({ params }) {
  const conlangCode = params.id;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  let uname = '';

  if (data?.claims?.email) {
    uname = data?.claims?.email?.split('@')[0];
  }

  return <><ViewConlang id={conlangCode} loggedUser={uname} /></>
}