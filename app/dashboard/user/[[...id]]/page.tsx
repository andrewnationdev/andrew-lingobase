import UserPageComponent from "@/components/ui/user-ui";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function UserPage({params}){
      const userName = params.id[0];

      const supabase = await createClient();
    
      const { data, error } = await supabase.auth.getClaims();
      if (error || !data?.claims) {
        redirect("/auth/login");
      }

      // Extract logged user name from email (same logic as dashboard layout)
      let loggedUser = "";
      if (data?.claims?.email) {
        loggedUser = data?.claims?.email?.split("@")[0];
      }
    
    return <><UserPageComponent user={userName} loggedUser={loggedUser}/></>
}