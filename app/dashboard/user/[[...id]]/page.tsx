import UserPageComponent from "@/components/ui/user-ui";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function UserPage({ params }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  let loggedUser = "";
  if (data?.claims?.email) {
    loggedUser = data?.claims?.email?.split("@")[0];
  }

  let userName = "";
  if (Array.isArray(params.id) && params.id.length > 0) {
    userName = params.id[0];
  } else {
    userName = loggedUser;
  }

  return (
    <>
      <UserPageComponent user={userName} loggedUser={loggedUser} />
    </>
  );
}