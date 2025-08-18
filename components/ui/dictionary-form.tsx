'use client';

import { supabase } from '@/lib/supabase/database';
import { partsOfSpeech } from '@/schema/data';
import { useEffect, useState } from 'react';
import { IWord } from './dictionary';

export default function DictionaryForm({ conlang_code, owner, word, editing, onFinishEditing }: {
    conlang_code: string,
    owner: string,
    word?: IWord,
    editing?: boolean,
    onFinishEditing?: () => void
}) {
    const [formData, setFormData] = useState({
        lexical_item: '',
        definition: '',
        pos: '',
        notes: '',
        transliteration: '',
        conlang_code: conlang_code,
        owner: owner,
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (editing && word) {
            setFormData(word);
        }
    }, [editing, word]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let error;
            if (editing && word) {
                ({ error } = await supabase
                    .from('conlang-dictionary')
                    .update({
                        lexical_item: formData.lexical_item,
                        definition: formData.definition,
                        pos: formData.pos,
                        notes: formData.notes,
                        transliteration: formData.transliteration,
                        owner: formData.owner,
                        conlang_code: formData.conlang_code,
                    })
                    .match({
                        lexical_item: word.lexical_item,
                        conlang_code: word.conlang_code,
                        owner: word.owner,
                    })
                );

                window.location.reload();
            } else {
                ({ error } = await supabase
                    .from('conlang-dictionary')
                    .insert([
                        {
                            lexical_item: formData.lexical_item,
                            definition: formData.definition,
                            pos: formData.pos,
                            notes: formData.notes,
                            transliteration: formData.transliteration,
                            owner: formData.owner,
                            conlang_code: formData.conlang_code,
                        }
                    ])
                );
            }

            if (error) {
                throw error;
            }

            setFormData({
                lexical_item: '',
                definition: '',
                pos: '',
                notes: '',
                transliteration: '',
                owner: formData.owner,
                conlang_code: formData.conlang_code,
            });

        } catch (error) {
            console.error('Error saving data:', error);
        } finally {
            setIsLoading(false);
            if(editing){
                onFinishEditing();
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full mx-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {editing ? 'Edit Lexical Entry' : 'Add a New Word to Your Vocabulary'}
                </h2>

                {/* Lexical Item */}
                <div>
                    <label htmlFor="lexical_item" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Word (In Your Conlang)</label>
                    <input
                        type="text"
                        name="lexical_item"
                        id="lexical_item"
                        value={formData.lexical_item}
                        onChange={handleChange}
                        required
                        placeholder="e.g., hello"
                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                    />
                </div>

                {/* Part of Speech (POS) */}
                <div>
                    <label htmlFor="pos" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Part of Speech (POS)</label>
                    <select
                        id="pos"
                        name="pos"
                        value={formData.pos}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                    >
                        {partsOfSpeech.map((pos) => (
                            <option key={pos.value} value={pos.value}>
                                {pos.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Definition */}
                <div>
                    <label htmlFor="definition" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Definition</label>
                    <textarea
                        name="definition"
                        id="definition"
                        rows={4}
                        value={formData.definition}
                        onChange={handleChange}
                        required
                        placeholder="e.g., A greeting used when meeting someone."
                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                    ></textarea>
                </div>

                {/* Transliteration */}
                <div>
                    <label htmlFor="transliteration" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{`Transliteration or Transcription (IPA, X-SAMPA or whatever you'd like to use)`}</label>
                    <input
                        type="text"
                        name="transliteration"
                        id="transliteration"
                        value={formData.transliteration}
                        onChange={handleChange}
                        placeholder="e.g., hɛˈloʊ"
                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                    />
                </div>

                {/* Notes */}
                <div>
                    <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                    <textarea
                        name="notes"
                        id="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Optional notes about usage, etymology, etc."
                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : (editing ? 'Update' : 'Add Word')}
                    </button>
                </div>
            </div>
        </form>
    );
}