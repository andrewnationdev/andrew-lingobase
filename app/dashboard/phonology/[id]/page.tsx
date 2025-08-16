import PhonologyComponent from "@/components/ui/phonology";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PhonologyPage(){
	 const supabase = await createClient();
		
		  const { data, error } = await supabase.auth.getClaims();
		  if (error || !data?.claims) {
			redirect("/auth/login");
		  }
		
		  let uname = '';
		
		  if (data?.claims?.email) {
			uname = data?.claims?.email?.split('@')[0];
		  }
	return <PhonologyComponent loggedUser={uname} />
}