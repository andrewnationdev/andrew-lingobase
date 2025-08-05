'use client'

import { supabase } from "@/lib/supabase/database";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CreateConlangPage() {
    const router = useRouter();
    const [conlang, setConlang] = useState({
        english_name: "",
        code: "",
        summary: "",
        native_name: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setCurrentUser(session?.user ?? null);
            setIsAuthLoaded(true);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setConlang(prevConlang => ({
            ...prevConlang,
            [name]: name === 'code' ? value.toUpperCase() : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (!currentUser || !currentUser.id) {
                setError("Você precisa estar logado para criar uma conlang.");
                return;
            }

            const conlang_with_user = {
                ...conlang,
                created_by: currentUser.id
            };

            const { error: dbError } = await supabase.from('conlang').insert([conlang_with_user]);

            if (dbError) {
                throw dbError;
            }

            router.push(`/dashboard/view/${conlang.code}`);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || "Ocorreu um erro inesperado. Por favor, tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthLoaded) {
        return <div className="flex justify-center items-center h-full">Carregando...</div>;
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-12">
            <div className="w-full">
                <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-8 items-center">
                    <InfoIcon size="16" strokeWidth={2} />
                    Nesta página, você pode adicionar sua conlang ao site. Sinta-se à vontade para adicionar todas as suas outras conlangs, se tiver mais de uma.
                </div>
                <div className="flex w-full flex-col gap-2 mt-8">
                    <span className="text-2xl"><strong>Criar uma Conlang</strong></span>
                </div>
                {error && (
                    <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 mt-4 rounded-md">
                        <p className="font-bold">Erro</p>
                        <p>{error}</p>
                    </div>
                )}
                {currentUser ? (
                    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg mt-8">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="english_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nome em inglês</label>
                                <input
                                    type="text"
                                    name="english_name"
                                    id="english_name"
                                    value={conlang.english_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: Na'vi"
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                                />
                            </div>

                            <div>
                                <label htmlFor="native_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nome nativo</label>
                                <input
                                    type="text"
                                    name="native_name"
                                    id="native_name"
                                    required
                                    value={conlang.native_name}
                                    onChange={handleChange}
                                    placeholder="Ex: Lì'fya leNa'vi"
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                                />
                            </div>

                            <div>
                                <label htmlFor="code" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Código</label>
                                <input
                                    type="text"
                                    name="code"
                                    required
                                    id="code"
                                    value={conlang.code}
                                    onChange={handleChange}
                                    maxLength={6}
                                    placeholder="Ex: nav"
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                                />
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Um código curto e único para o idioma (ex: estilo ISO 639-3).</p>
                            </div>

                            <div>
                                <label htmlFor="summary" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Resumo</label>
                                <textarea
                                    name="summary"
                                    required
                                    id="summary"
                                    rows={4}
                                    value={conlang.summary}
                                    onChange={handleChange}
                                    maxLength={2000}
                                    placeholder="Descreva brevemente a conlang, seu propósito e características principais."
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                                ></textarea>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Adicionando..." : "Adicionar Conlang"}
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="flex-1 text-center p-8 text-gray-500">
                        <p>Você precisa estar logado para criar uma conlang.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
