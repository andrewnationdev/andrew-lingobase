import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import SidebarNav from "@/components/ui/navsidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <main className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full sticky top-0 z-10 flex justify-center border-b border-b-foreground/10 h-16 bg-white dark:bg-gray-900 shadow-md">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <img src="/img/LINGOBASE_4.webp" width="32px" height="32px" />
              <Link href={"/dashboard"}>Andrew Lingobase (Early Access)</Link>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          {children}
        </div>
        <SidebarNav loggedUser={uname} />

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
