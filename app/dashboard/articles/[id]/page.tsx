import ArticleForm from "@/components/ui/articles-form";
import ArticleView from "@/components/ui/articles-view";
import ReturnComponent from "@/components/ui/return";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ArticlePage({ params }) {
  const conlangCode = params.id;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  let uname = '';

  if (data?.claims?.email) {
    uname = data?.claims?.email?.split('@')[0];
  }

  return <div className="flex-1 w-full flex flex-col gap-12">
    <div className="flex gap-4 items-center">
      <div className="max-w-sm">
        <ReturnComponent id={conlangCode} />
      </div>
      <h1 className="mt-4 text-3xl font-bold">{`Articles and Literature`}</h1>
    </div>
    <p>In this page you can add articles about your conlang and showcase texts and literature written in it. You can provide translations, glossing, and anything you want. Also, remember that you can use Markdown Syntax to format your articles.</p>
    {uname !== '' && uname !== undefined && <ArticleForm loggedUser={uname} id={conlangCode} />}
    <hr className="my-2"/>
    <ArticleView id={conlangCode}/>
  </div >
}