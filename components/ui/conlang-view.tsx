"use client";
import { supabase } from "@/lib/supabase/database";
import { InfoIcon, MessageSquareIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import GreenButton from "./green-button";
import ReactMarkdown from "react-markdown";
import QuickNavigationComponent from "./quicknavigation";
import { showErrorToast } from "@/lib/toast";

export default function ViewConlang({ id, loggedUser }) {
  const router = useRouter();
  const [conlang, setConlang] = useState({
    english_name: "",
    id: "",
    code: "",
    created_at: "",
    created_by: "",
    summary: "",
    native_name: "",
    custom_links: {
      link1: { title: "", url: "" },
      link2: { title: "", url: "" },
    },
    ratings: { likes: [], dislikes: [], comments: [] },
  });
  const [lexiconSize, setLexiconSize] = useState<number>(0);
  const [phonemesCount, setPhonemesCount] = useState<number>(0);
  const [articlesCount, setArticlesCount] = useState<number>(0);
  const [numberOfLikes, setNumberOfLikes] = useState<number>(103);
  const [numberOfDislikes, setNumberOfDisLikes] = useState<number>(13);
  const [ratingChosen, setRatingChosen] = useState<boolean>(false);

  const handleDeleteConlang = async () => {
    const _prompt = confirm(
      "Are you sure you want to delete this conlang? This cannot be undone!"
    );

    if (_prompt) {
      try {
        const req = await supabase.from("conlang").delete().eq("code", id);
        const deleteAllInfo = async () => {
          await supabase
            .from("conlang-dictionary")
            .delete()
            .eq("conlang_code", id);
          await supabase
            .from("conlang-phonology")
            .delete()
            .eq("conlang_id", id);
          await supabase
            .from("conlang-typology")
            .delete()
            .eq("conlang_code", id);
          await supabase
            .from("conlang-articles")
            .delete()
            .eq("conlang_code", id);
        };

        await deleteAllInfo();

        if (req?.status === 204) {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const getConlangFromId = async () => {
      const conlangs = await supabase
        .from("conlang")
        .select("*")
        .eq("code", id);

      const data = await conlangs?.data;

      if (data?.length > 0) {
        console.log(data![0]);
        setConlang(data![0]);
      }
    };

    getConlangFromId();
  }, []);

  useEffect(() => {
    const countNumberOfWords = async () => {
      const lexicon = await supabase
        .from("conlang-dictionary")
        .select("*")
        .eq("conlang_code", id);
      const phonemes = await supabase
        .from("conlang-phonology")
        .select("*")
        .eq("conlang_id", id)
        .single();
      const articles = await supabase
        .from("conlang-articles")
        .select("*")
        .eq("conlang_code", id);

      const data = await lexicon?.data;

      const len = data?.length;

      setLexiconSize(len ? len : 0);

      const phonemes_data = await phonemes?.data?.phonemes;

      setPhonemesCount(phonemes_data?.length ? phonemes_data.length : 0);

      const articles_data = await articles?.data;
      setArticlesCount(articles_data?.length ? articles_data.length : 0);
    };

    countNumberOfWords();
  }, [conlang]);

  const fetchRatings = async () => {
      const ratings = await supabase
        .from("conlang")
        .select("*")
        .eq("code", conlang.code).single();

      const data = await ratings?.data;

      setNumberOfLikes(data?.ratings.likes.length);
      setNumberOfDisLikes(data?.ratings.dislikes.length);

      if(data?.ratings?.likes.includes(loggedUser) || data?.ratings?.dislikes.includes(loggedUser)){
        setRatingChosen(true);
      }
    }

  useEffect(() => {
    const fetchAllRatings = async () => {
      await fetchRatings()
    }

    fetchAllRatings();
  }, [conlang, ratingChosen]);

  const handleLikes = async (arg: number) => {
    if (arg === 1) {
      const data = [...conlang.ratings.likes, loggedUser];

      const res = await supabase
        .from("conlang")
        .update({ ratings: { ...conlang.ratings, likes: data } })
        .eq("code", conlang.code);

      if (res.error) {
        showErrorToast("There was an error processing your like. Try again.");
        return;
      }
    }

    if (arg === -1) {
      const data = [...conlang.ratings.dislikes, loggedUser];

      const res = await supabase
        .from("conlang")
        .update({ ratings: { ...conlang.ratings, dislikes: data } })
        .eq("code", conlang.code);

      if (res.error) {
        showErrorToast("There was an error processing your dislike. Try again.");
        return;
      }
    }

    await fetchRatings()
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-teal-500 text-sm p-3 px-5 rounded-md text-black flex gap-8 my-4 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Here you can find details about this language. Feel free to explore
          and create your own conlangs!
        </div>
        <QuickNavigationComponent
          data={[
            {
              href: "#intro",
              text: "Introduction",
            },
            {
              href: "#lang-stats",
              text: "Stats",
            },
            {
              href: "#lang-info",
              text: "Information",
            },
          ]}
        />
        <div className="flex w-full flex-col gap-2 mt-8">
          <span className="text-2xl">
            <strong>
              {conlang?.english_name
                ? `${conlang?.english_name} [${conlang?.code}]`
                : "Unnamed"}
            </strong>
          </span>
          <span className="text-m">({conlang?.native_name})</span>
          <span className="text-sm">
            This language has been created by{" "}
            <Link
              className="text-teal-600 font-bold"
              href={`/dashboard/user/${conlang?.created_by}`}
            >
              {conlang?.created_by}
            </Link>{" "}
            {conlang?.created_at
              ? new Date(conlang.created_at).toLocaleString()
              : ""}
          </span>
        </div>
          <div className="flex gap-8 my-4">
            <div className="flex w-[280px] mt-8">
              <button
                onClick={async () => {
                  await handleLikes(1);
                }}
                disabled={ratingChosen || Boolean(conlang?.created_by === loggedUser)}
                className="flex-1 flex justify-center py-2 px-4 border rounded-l-lg border-r-0 shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
              >
                <ThumbsUpIcon className="mr-2" size={16} strokeWidth={2} />
                {`(${numberOfLikes})`}
              </button>

              <button
                onClick={async () => {
                  await handleLikes(-1);
                }}
                disabled={ratingChosen || Boolean(conlang?.created_by === loggedUser)}
                className="flex-1 flex justify-center py-2 px-4 border rounded-none border-r-0 shadow-md text-sm font-semibold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
              >
                <ThumbsDownIcon className="mr-2" size={16} strokeWidth={2} />
                {`(${numberOfDislikes})`}
              </button>

              <button
                onClick={() =>
                  showErrorToast("You don't have permission to comment yet!")
                }
                className="flex-1 flex justify-center py-2 px-4 border rounded-r-lg shadow-md text-sm font-semibold text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
              >
                <MessageSquareIcon className="mr-2" size={16} strokeWidth={2} />
                Comment
              </button>
            </div>
          </div>
        {conlang?.created_by === loggedUser && (
          <div className="flex w-full gap-8 my-4">
            <Link
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm mt-8 font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
              href={`/dashboard/create_conlang/${conlang?.code}`}
            >
              Edit
            </Link>
            <button
              onClick={handleDeleteConlang}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm mt-8 font-semibold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        )}
        <hr className="my-4" />
        <div id="intro">
          <ReactMarkdown>{conlang?.summary}</ReactMarkdown>
        </div>
        {(conlang.custom_links.link1.title != "" ||
          conlang.custom_links.link2.title != "") && (
          <h3 className="text-xl mt-4">Useful Links:</h3>
        )}
        <div className="flex my-4 w-full gap-2">
          {conlang.custom_links.link1 &&
            conlang.custom_links.link1.title != "" && (
              <GreenButton
                props={{
                  link: conlang.custom_links.link1.url,
                  title: conlang.custom_links.link1.title,
                  isCustom: true,
                }}
              />
            )}
          {conlang.custom_links.link2 &&
            conlang.custom_links.link2.title != "" && (
              <GreenButton
                props={{
                  link: conlang.custom_links.link2.url,
                  title: conlang.custom_links.link2.title,
                  isCustom: true,
                }}
              />
            )}
        </div>
        <hr className="my-8" />
        <span className="text-xl">Stats</span>
        <div className="flex flex-col mt-2 w-full gap-4" id="lang-stats">
          <span>
            This language has {lexiconSize} words in its lexicon,{" "}
            {phonemesCount} phonemes, and {articlesCount} articles.
          </span>
        </div>
        <hr className="my-8" />
        <span className="text-xl">Access Information</span>
        <div className="flex mt-2 w-full gap-2" id="lang-info">
          <GreenButton
            props={{
              link: `/dashboard/dictionary/${conlang.code}`,
              title: "Dictionary",
            }}
          />
          <GreenButton
            props={{
              link: `/dashboard/typology/${conlang.code}`,
              title: "Typology",
            }}
          />
        </div>
        <div className="flex mt-2 w-full gap-2">
          <GreenButton
            props={{
              link: `/dashboard/phonology/${conlang.code}`,
              title: "Phonology",
            }}
          />
          <GreenButton
            props={{
              link: `/dashboard/articles/${conlang.code}`,
              title: "Articles and Literature",
            }}
          />
        </div>
        {/*<div className="flex w-full mt-2 flex-col gap-2">
          <button className="bg-white my-2 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
            Morphology
          </button>
          <button className="bg-white my-2 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
            Syntax
          </button>
          <button className="bg-white my-2 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
            Semantics and Pragmatics
          </button>
        </div>*/}
      </div>
    </div>
  );
}
