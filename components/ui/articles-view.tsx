"use client"
import { supabase } from '@/lib/supabase/database';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Article {
    id: number;
    title: string;
    content: string;
    written_by: string;
    updated_at: string;
}

export default function ArticleView({ id, loggedUser }: { id: string, loggedUser: string | undefined }) {
    const conlangCode = id;
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [conlangName, setConlangName] = useState('Unnamed');
    const [expandedArticleId, setExpandedArticleId] = useState<number | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            if (!conlangCode) {
                setLoading(false);
                return;
            }

            const conlangResponse = await supabase.from('conlang')
                .select('english_name')
                .eq('code', conlangCode)
                .single();

            if (conlangResponse?.error) {
                console.error("Error fetching conlang name:", conlangResponse?.error);
            } else if (conlangResponse?.data) {
                setConlangName(conlangResponse?.data?.english_name || 'Unnamed');
            }

            const articlesResponse = await supabase
                .from('conlang-articles')
                .select('*')
                .eq('conlang_code', conlangCode)
                .order('updated_at', { ascending: false });

            if (articlesResponse.error) {
                console.error("Error fetching articles:", articlesResponse.error);
            } else if (articlesResponse.data) {
                setArticles(articlesResponse.data as Article[]);
            }

            setLoading(false);
        };
        fetchAllData();
    }, [conlangCode]);

    const toggleExpand = (articleId: number) => {
        setExpandedArticleId(expandedArticleId === articleId ? null : articleId);
    };

    if (loading) {
        return <div className="text-gray-700 dark:text-gray-300">Loading articles...</div>;
    }

    return (
        <div className="w-full mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Articles for {conlangName}
            </h2>
            {articles.length === 0 ? (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg">
                    No articles found for this conlang.
                </div>
            ) : (
                <div className="space-y-4 mt-4">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200"
                            onClick={() => toggleExpand(article.id)}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{article.title}</h3>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">
                                    {expandedArticleId === article.id ? 'Collapse ▲' : 'Expand ▼'}
                                </span>
                            </div>
                            {expandedArticleId === article.id && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Written by: {article.written_by}, Last updated: {new Date(article.updated_at).toLocaleDateString()}
                                    </p>
                                    {loggedUser == article.written_by &&
                                        <>
                                            <button
                                                className="ml-4 px-4 py-2 bg-emerald-500 text-white font-medium text-sm rounded-full shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
                                                onClick={() => { }}
                                            >
                                                <PencilIcon />
                                            </button>
                                            <button
                                                className="ml-4 px-4 py-2 bg-red-500 text-white font-medium text-sm rounded-full shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
                                                onClick={() => { }}
                                            >
                                                <TrashIcon />
                                            </button>
                                        </>
                                    }
                                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                                        <ReactMarkdown>{article.content}</ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
