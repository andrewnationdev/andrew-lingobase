import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
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

    console.log(conlangCode, uname)

  return (
    <>
      {" "}
      <div className="flex-1 w-full flex flex-col gap-12">
        <div className="w-full">
          <div className="bg-teal-500 text-sm p-3 px-5 rounded-md text-black flex gap-8 my-4 items-center">
            <InfoIcon size="16" strokeWidth={2} />
            {`Here you will be able to showcase your conlang's amazing grammar!`}
          </div>
          <span className="text-lg font-bold">Coming soon!</span>
        </div>
      </div>
    </>
  );
}
