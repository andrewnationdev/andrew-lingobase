import Articles from "@/components/ui/articles";
import QuickNavigationComponent from "@/components/ui/quicknavigation";
import ReturnComponent from "@/components/ui/return";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ArticlePage({ params }) {
  const conlangCode = params.id;
  const supabase = await createClient();

  const conlang = await supabase
    .from("conlang")
    .select("*")
    .eq("code", conlangCode);

  const c_owner = conlang?.data[0]?.created_by;

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  let uname = "";

  if (data?.claims?.email) {
    uname = data?.claims?.email?.split("@")[0];
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <QuickNavigationComponent
        data={[
          {
            href: "#form",
            text: "Add New Article",
          },
          {
            href: "#view",
            text: "View All Articles",
          },
        ]}
      />
      <div className="flex gap-4 items-center">
        <div className="max-w-sm">
          <ReturnComponent id={conlangCode} />
        </div>
        <h1 className="mt-4 text-3xl font-bold">{`Articles`}</h1>
      </div>
      <p>
        In this page you can add articles about your conlang. You can provide translations, 
        glossing, grammar rules,
        and anything you want. Also, remember that you can use Markdown Syntax
        to format your articles.
      </p>
      <Articles id={conlangCode} loggedUser={uname ? uname : "anonymous"} conlangOwner={c_owner}/>
    </div>
  );
}
