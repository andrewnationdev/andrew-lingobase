import { supabase } from "@/lib/supabase/database";

export type FetchProfileResult = {
  username: string;
  user_alias?: string | null;
  displayName: string;
  status: "ok" | "not_found" | "error";
  errorMessage?: string;
};

export async function fetchUserProfileDisplay(username: string): Promise<FetchProfileResult> {
  const result: FetchProfileResult = {
    username,
    user_alias: null,
    displayName: username,
    status: "ok",
  };

  if (!username) return result;

  try {
    const { data, error } = await supabase
      .from("user-profiles")
      .select("user_alias")
      .eq("username", username)
      .single();

    if (error) {
      result.status = "error";
      result.errorMessage = error.message;
      console.error("Failed to fetch user profile display:", error);
      return result;
    }

    if (!data) {
      result.status = "not_found";
      return result;
    }

    const alias = data?.user_alias ?? null;
    result.user_alias = alias;
    if (alias && String(alias).trim().length > 0) {
      result.displayName = String(alias).trim();
    }

    return result;
  } catch (err) {
    result.status = "error";
    result.errorMessage = err instanceof Error ? err.message : String(err);
    console.error("fetchUserProfileDisplay error:", err);
    return result;
  }
}
