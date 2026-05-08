import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ConlangsList from "@/components/ui/conlangs-list";
import Notepad from "@/components/ui/texteditor";
import QuickNavigationComponent from "@/components/ui/quicknavigation";
import LingobaseStats from "@/components/ui/stats";
import PatreonFloatingCard from "@/components/ui/patreon";
import { PlusCircleIcon } from "lucide-react";

export default async function DashboardPage() {
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
    <div className="flex-1 w-full flex flex-col gap-4">
    <LingobaseStats />
      <QuickNavigationComponent
        data={[
          {
            href: "#your-conlangs",
            text: "Your Conlangs",
          },
          {
            href: "#notepad",
            text: "Notes and Ideas",
          },
          {
            href: "#conlangs-in-website",
            text: "Conlangs in the Website",
          },
        ]}
      />
      <div className="light:bg-orange-100 dark:bg-orange-800 shadow-lg p-4 flex justify-center space-x-6 rounded-lg">
        <span className="font-bold text-lg">
          Did you know we are on Discord too?
        </span>
        <Link
          className="max-w-[150px] transition duration-150 ease-in-out hover:scale-110 w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
          href="https://discord.gg/6BEpySdDdv"
        >
          Join Now
        </Link>
      </div>
      <div className="flex flex-col gap-2 items-start" id="your-conlangs">
        <h2 className="font-bold text-2xl mb-4">Your Conlangs:</h2>
        <ConlangsList authOnly user={uname} />
        <Link
          className="transition duration-150 ease-in-out hover:scale-125 w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
          href="/dashboard/create_conlang"
        >
          <PlusCircleIcon className="mr-2" />
          Create a New Conlang
        </Link>
        <hr className="my-2 border-t border-teal-600" />
        <div className="w-full" id="notepad">
          <Notepad />
        </div>
        <hr className="my-2 border-t border-teal-600" />
        <h2
          className="font-bold text-2xl mb-4"
          id="conlangs-in-website"
        >{`Everyone Else's Conlangs`}</h2>
        <ConlangsList />
      </div>

      <PatreonFloatingCard />
    </div>
  );
}
