import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ConlangsList from "@/components/ui/conlangs-list";
import Notepad from "@/components/ui/texteditor";
import QuickNavigationComponent from "@/components/ui/quicknavigation";
import LingobaseStats from "@/components/ui/stats";

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
      <LingobaseStats/>
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
          }
        ]}
      />
      <div className="flex flex-col gap-2 items-start" id="your-conlangs">
        <h2 className="font-bold text-2xl mb-4">Your Conlangs:</h2>
        <ConlangsList authOnly user={uname} />
        <Link
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
          href="/dashboard/create_conlang"
        >
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

      <div
        id="floating-patreon"
        className="fixed top-4 right-4 z-50 w-80 sm:w-96 p-4 bg-white dark:bg-gray-800 shadow rounded-lg text-sm text-gray-800 dark:text-gray-100"
        role="region"
        aria-label="Patreon support"
      >
        <button
          id="floating-patreon-dismiss"
          aria-label="Dismiss"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          style={{ background: "transparent", border: "none", fontSize: "1rem", cursor: "pointer" }}
        >
          ×
        </button>

        <p className="mb-3">
          Do you like this website? Support it and help it stay alive by joining my Patreon
        </p>

        <div className="flex items-center gap-2">
          <a
            href="https://www.patreon.com/cw/andrewnationdev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium shadow"
          >
            Support it on Patreon
          </a>

          <button
            id="floating-patreon-later"
            className="ml-auto text-xs text-gray-600 dark:text-gray-300 hover:underline"
            style={{ background: "transparent", border: "none", cursor: "pointer" }}
            onClick={undefined}
          >
            Maybe later
          </button>
        </div>
      </div>

  
      <script
        dangerouslySetInnerHTML={{
          __html: `
        (function(){
          function init(){
            var container = document.getElementById('floating-patreon');
            if(!container) return;
            try {
              if(localStorage.getItem('hideFloatingPatreon') === '1'){
                container.style.display = 'none';
                return;
              }
            } catch(e){ /* ignore */ }

            var dismiss = document.getElementById('floating-patreon-dismiss');
            if(dismiss){
              dismiss.addEventListener('click', function(){
                container.style.display = 'none';
                try { localStorage.setItem('hideFloatingPatreon','1'); } catch(e){};
              });
            }

            var later = document.getElementById('floating-patreon-later');
            if(later){
              later.addEventListener('click', function(){
                container.style.display = 'none';
                // don't persist so it will show again next visit
              });
            }
          }

          if (document.readyState === 'loading'){
            document.addEventListener('DOMContentLoaded', init);
          } else {
            init();
          }
        })();
        `,
        }}
      />
    </div>
  );
}
