/* eslint-disable @typescript-eslint/ban-ts-comment */

'use client';
import { supabase } from "@/lib/supabase/database";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditConlangPage({ params }) {
    const conlangCode = params.id;
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null);

    const [conlang, setConlang] = useState({
        english_name: "",
        code: "",
        summary: "",
        native_name: ""
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!conlangCode;

    useEffect(() => {
        const fetchConlang = async () => {
            if (isEditing) {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('conlang')
                    .select('*')
                    .eq('code', conlangCode)
                    .single();

                if (error) {
                    console.error('Error fetching conlang:', error);
                } else if (data) {
                    setConlang(data);
                }
                setIsLoading(false);
            }
        };

        fetchConlang();
    }, [isEditing, conlangCode]);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Evento de autenticação:', event);
            console.log('Sessão de autenticação:', session);
            
            if (session?.user?.email) {
                const usernamePart = session.user.email.split('@')[0];
                setUserName(usernamePart);
                console.log('Nome de usuário definido a partir da sessão:', usernamePart);
            } else {
                setUserName(null);
                console.log('Nenhum usuário logado ou email não encontrado na sessão.');
            }
        });
        return () => subscription.unsubscribe();
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
        setIsLoading(true);

        const conlang_with_user = {
            ...conlang,
            created_by: userName || 'anonymous',
        };

        try {
            let error = null;

            if (isEditing) {
                const { error: updateError } = await supabase
                    .from('conlang')
                    .update(conlang_with_user)
                    .eq('code', conlangCode);

                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('conlang')
                    .insert([conlang_with_user]);

                error = insertError;
            }

            if (error) {
                throw error;
            }

            const redirectToPath = `/dashboard/view/${conlang.code}`;
            console.log('Redirecting to:', redirectToPath);
            router.push(redirectToPath);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return <div className="flex-1 w-full flex flex-col gap-12">
        <div className="w-full">
            <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-8 items-center">
                <InfoIcon size="16" strokeWidth={2} />
                {isEditing
                    ? "You are currently editing this conlang. Changes will be saved to your entry."
                    : "In this page you can add your conlang to the website. Feel free to add all your other conlangs if you have more than one."
                }
            </div>
            <div className="flex w-full flex-col gap-2 mt-8">
                <span className="text-2xl">
                    <strong>{isEditing ? "Edit Conlang" : "Create a Conlang"}</strong>
                </span>
            </div>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="space-y-6">

                    <div>
                        <label htmlFor="english_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">English Name</label>
                        <input
                            type="text"
                            name="english_name"
                            id="english_name"
                            value={conlang.english_name}
                            onChange={handleChange}
                            required
                            placeholder="E.g., Na'vi"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="native_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Native Name</label>
                        <input
                            type="text"
                            name="native_name"
                            id="native_name"
                            required
                            value={conlang.native_name}
                            onChange={handleChange}
                            placeholder="E.g., Lì'fya leNa'vi"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="code" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Code</label>
                        <input
                            type="text"
                            name="code"
                            required
                            id="code"
                            value={conlang.code}
                            onChange={handleChange}
                            maxLength={6}
                            disabled={isEditing}
                            placeholder="E.g., nav"
                            className={`block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200 ${isEditing ? 'cursor-not-allowed bg-gray-200 dark:bg-gray-600' : ''}`}
                        />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">A short, unique code for the language (e.g., ISO 639-3 style).</p>
                    </div>

                    <div>
                        <label htmlFor="summary" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Summary</label>
                        <textarea
                            name="summary"
                            required
                            id="summary"
                            rows={4}
                            value={conlang.summary}
                            onChange={handleChange}
                            maxLength={2000}
                            placeholder="Briefly describe the conlang, its purpose, and key features."
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                        ></textarea>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Conlang')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
}
