import UserPageComponent from "@/components/ui/user-ui";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function UserPage(){
      const supabase = await createClient();
    
      const { data, error } = await supabase.auth.getClaims();
      if (error || !data?.claims) {
        redirect("/auth/login");
      }
    
    return <><UserPageComponent user={data?.claims}/></>
}