"use client"
import { TypologySchema } from '../../schema/data';
import { useState } from 'react';

export default function TypologyForm() {
    const [typology, setTypology] = useState({
        wordOrder: '',
        morphosyntacticAlignment: '',
        languageFamily: '',
        verbalTenses: '',
        typeOfMorphology: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTypology(prevTypology => ({
            ...prevTypology,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        window.alert("Error saving typology data. Endpoint not found!")
        console.log('Submitted Typology Data:', typology);
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
                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
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
                                Save Typology
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}