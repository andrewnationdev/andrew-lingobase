import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;
  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  const username = user.email.split("@")[0];
  let displayName = username;

  try {
    const { data: profile } = await supabase
      .from("user-profiles")
      .select("user_alias")
      .eq("username", username)
      .single();

    if (profile?.user_alias && String(profile.user_alias).trim().length > 0) {
      displayName = String(profile.user_alias).trim();
    }
  } catch (err) {
    // fail silently and fall back to username
    console.debug("AuthButton: could not load user alias", err);
  }

  return (
    <div className="flex items-center gap-4">
      Hey, {displayName}!
      <LogoutButton />
    </div>
  );
}
