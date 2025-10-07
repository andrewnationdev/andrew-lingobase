import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

import React from "react";
import { createClient } from "@/lib/supabase/server";

const Card = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
    <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">{children}</p>
  </div>
);

export default async function Home() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full sticky top-0 z-10 flex justify-center border-b border-b-foreground/10 h-16 bg-white dark:bg-gray-900 shadow-md">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold text-gray-800 dark:text-white">
              <img src="/img/LINGOBASE_4.webp" width="32px" height="32px" />
              <Link href={"/dashboard"}>Andrew Lingobase (Early Access)</Link>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>

        <main>
          <section className="bg-white dark:bg-gray-800 py-20 px-8 text-center border-b border-gray-200 dark:border-gray-700 rounded-3xl">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-4">
                Construct Your Language. Build Your World.
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Explore, create, and share your own constructed languages with a
                community of fellow world-builders.
              </p>
              {!user ? (
                <Link
                  href="/auth/sign-up"
                  className="inline-block px-8 py-4 bg-teal-600 text-white rounded-lg text-lg font-bold hover:bg-teal-700 transition-colors duration-200 shadow-lg"
                >
                  Create Your Account For Free
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="inline-block px-8 py-4 bg-teal-600 text-white rounded-lg text-lg font-bold hover:bg-teal-700 transition-colors duration-200 shadow-lg"
                >
                  Visit Your Dashboard
                </Link>
              )}
            </div>
          </section>

          <section id="what-is-conlanging" className="py-16 px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
                What is a Conlang?
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Card title="The Art of Language Creation">
                    A constructed language, or conlang, is a language whose
                    phonology, grammar, and vocabulary were consciously designed
                    by an individual or group. Unlike natural languages that
                    evolve over time, conlangs are crafted for a specific
                    purpose, whether for art, communication, or research.
                  </Card>
                </div>
                <div>
                  <Card title="A Home for Your Imagination">
                    Conlanging is the perfect blend of creativity and logic. It
                    allows you to build entire linguistic systems from the
                    ground up, giving life to fictional cultures, deepening your
                    storytelling, or simply exploring the fascinating mechanics
                    of language itself.
                  </Card>
                </div>
              </div>
            </div>
          </section>

          <section
            id="showcase"
            className="bg-gray-50 dark:bg-gray-900 py-16 px-8"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">{`Explore Our Community's Creations`}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card title="Funōsho">
                  Japanese-inspired isolate language spoken in a North Pacific
                  nation with mixed kana/kanji writing
                </Card>
                <Card title="Platdaitch">
                  The Low German language (known as Ieperisch or
                  Portolobisch/Platdait(s)ch in Porto Lobos) is a widely spoken
                  language in the Andrician Empire with millions of speakers and
                  is studied in Arussia as a second language. It has a Germanic
                  origin, probably from Frankish or Low German dialects in
                  northern Germany.
                </Card>
                <Card title="Arusian">
                  Arusian is a personal language used in art, poetry, and
                  encryption. It is used to escape your environment and find
                  inner peace within yourself.
                </Card>
              </div>
            </div>
          </section>

          <section className="py-16 px-8 text-center bg-gray-100 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Contribute to Lingobase and Help it Grow
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                {`Our project thrives on community collaboration. As an
                open-source project, we invite developers to contribute their
                skills. Whether it's adding new features, fixing bugs, or
                suggesting improvements, your pull requests are what make this
                project better for everyone. Join us and help shape the future
                of our project!`}
              </p>
              <a
                href={"https://github.com/andrewnationdev/andrew-lingobase"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-teal-600 text-white rounded-lg text-lg font-bold hover:bg-teal-700 transition-colors duration-200 shadow-lg"
              >
                Contribute on GitHub
              </a>
            </div>
          </section>

          <section className="py-16 px-8 text-center bg-gray-100 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Join our community and gain access to many tools and resources
                you need to bring your language to life.
              </p>
              <a
                href="/register"
                className="inline-block px-8 py-4 bg-teal-600 text-white rounded-lg text-lg font-bold hover:bg-teal-700 transition-colors duration-200 shadow-lg"
              >
                Sign Up Now
              </a>
            </div>
          </section>
        </main>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
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
