/* eslint-disable @typescript-eslint/ban-ts-comment */

'use client'
import { supabase } from "@/lib/supabase/database";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateConlangPage() {
    const router = useRouter();

    const [conlang, setConlang] = useState({
        english_name: "",
        code: "",
        summary: "",
        native_name: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setConlang(prevConlang => ({
            ...prevConlang,
            [name]: name === 'code' ? value.toUpperCase() : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { error } = await supabase.from('conlang').insert([conlang]);

            if (error) {
                throw error;
            }

            router.push(`/dashboard/view/${conlang.code}`);
        } catch (err) {
            console.error('Error:', err);
        }

    };

    return <div className="flex-1 w-full flex flex-col gap-12">
        <div className="w-full">
            <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-8 items-center">
                <InfoIcon size="16" strokeWidth={2} />
                In this page you can add your conlang to the website. Fell free to add all other of your conlangs if you have more than one.
            </div>
            <div className="flex w-full flex-col gap-2 mt-8">
                <span className="text-2xl"><strong>Create a Conlang</strong></span>
            </div>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="space-y-6">

                    {/* English Name */}
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

                    {/* Native Name */}
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

                    {/* Conlang Code */}
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
                            placeholder="E.g., nav"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                        />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">A short, unique code for the language (e.g., ISO 639-3 style).</p>
                    </div>

                    {/* Summary */}
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

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                        >
                            Add Conlang
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
}