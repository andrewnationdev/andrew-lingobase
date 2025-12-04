import { supabase } from "@/lib/supabase/database";

export type FetchProfileResult = {
  username: string;
  user_alias?: string | null;
  displayName: string;
};

export async function fetchUserProfileDisplay(username: string): Promise<FetchProfileResult> {
  const result: FetchProfileResult = {
    username,
    user_alias: null,
    displayName: username,
  };

  if (!username) return result;

  try {
    const { data, error } = await supabase
      .from("user-profiles")
      .select("user_alias")
      .eq("username", username)
      .single();

    if (error) {
      return result;
    }

    const alias = data?.user_alias ?? null;
    result.user_alias = alias;
    if (alias && String(alias).trim().length > 0) {
      result.displayName = String(alias).trim();
    }

    return result;
  } catch (err) {
    console.error("fetchUserProfileDisplay error:", err);
    return result;
  }
}
