import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ConlangsList from "@/components/ui/conlangs-list";
import Notepad from "@/components/ui/texteditor";
import QuickNavigationComponent from "@/components/ui/quicknavigation";
import LingobaseStats from "@/components/ui/stats";
import PatreonFloatingCard from "@/components/ui/patreon";
import { PlusCircleIcon } from "lucide-react";
import { LINKS_TO_TOOLS } from "@/schema/data";
import { ctaActionClass } from "@/components/ui/cta-link";

const isSafeExternalUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

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

  const safeTools = LINKS_TO_TOOLS.filter((link) => isSafeExternalUrl(link.url));

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
      <div className="light:bg-orange-100 dark:bg-orange-800 shadow-lg p-4 flex flex-col items-center justify-center space-x-6 rounded-lg">
        <span className="font-bold text-lg">
          Useful Tools and Resources (External)
        </span>
        <details>
          <summary>Click Here to Show the Tools</summary>
          {safeTools.map((link, index) => (
            <div key={index} className="mb-4">
              <Link href={link.url} className="text-orange-500 hover:underline hover:text-white-700" target="_blank" rel="noopener noreferrer">
                + {link.title}
              </Link>
            </div>
          ))}
        </details>
      </div>
      <div className="light:bg-orange-100 dark:bg-orange-800 shadow-lg p-4 flex justify-center space-x-6 rounded-lg">
        <span className="font-bold text-lg">
          Did you know we are on Discord too?
        </span>
        <Link
          className={`${ctaActionClass} max-w-[150px]`}
          href="https://discord.gg/6BEpySdDdv"
        >
          Join Now
        </Link>
      </div>
      <div className="flex flex-col gap-2 items-start" id="your-conlangs">
        <h2 className="font-bold text-2xl mb-4">Your Conlangs:</h2>
        <ConlangsList authOnly user={uname} />
        <Link
          className={ctaActionClass}
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
