"use client"
import { supabase } from '@/lib/supabase/database';
import { TypologyFieldTitles, TypologySchema } from '../../schema/data';
import { useState, useEffect } from 'react';

export default function TypologyForm({ id }) {
    const conlangCode = id;
    
    const [typology, setTypology] = useState({
        word_order: '',
        morphosyntactic_alignment: '',
        language_family: '',
        verbal_tenses: '',
        type_morphology: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTypology = async () => {
            if (!conlangCode) {
                setLoading(false);
                return;
            }
            const { data, error } = await supabase
                .from('conlang-typology')
                .select('*')
                .eq('conlang_code', conlangCode)
                .single();
            if (error) {
                console.error("Error fetching data:", error);
            } else if (data) {
                setTypology(data);
            }
            setLoading(false);
        };
        fetchTypology();
    }, [conlangCode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTypology(prevTypology => ({
            ...prevTypology,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase
                .from('conlang-typology')
                .upsert([{ ...typology, conlang_code: conlangCode }]);
            if (error) {
                throw error;
            }
            console.log('Data saved successfully:', data);
            window.alert('Data saved successfully!');
        } catch (error) {
            console.error('Error saving data:', error?.message!);
            window.alert('An error occurred while saving data: ' + error?.message!);
        }
    };

    if (loading) {
        return <div>Loading typological data...</div>;
    }
    
    const formatLabel = (key) => {
        return key.split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
    };

    return (
        <div className="flex-1 w-full flex flex-col gap-12">
            <div className="w-full">
                <div className="flex w-full flex-col gap-2 mt-8">
                    <span className="text-2xl">
                        <strong>Typology of [Conlang Name]</strong>
                    </span>
                </div>
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
                    <div className="space-y-6">
                        {Object.entries(TypologySchema).map(([key, options]) => (
                            <div key={key}>
                                <label htmlFor={key} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    {formatLabel(TypologyFieldTitles[key])}
                                </label>
                                <select
                                    name={key}
                                    id={key}
                                    required
                                    value={typology[key]}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                                >
                                    <option value="" disabled>Select an option</option>
                                    {options.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                            >
                                Save All
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

