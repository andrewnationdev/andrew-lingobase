export const partsOfSpeech = [
    { value: '', label: 'Select part of speech' },
    { value: 'noun', label: 'Noun' },
    { value: 'pronoun', label: 'Pronoun' },
    { value: 'verb', label: 'Verb' },
    { value: 'adjective', label: 'Adjective' },
    { value: 'adverb', label: 'Adverb' },
    { value: 'preposition', label: 'Preposition' },
    { value: 'conjunction', label: 'Conjunction' },
    { value: 'interjection', label: 'Interjection' },
    { value: 'determiner', label: 'Determiner' },
];

export const TypologySchema = {
    wordOrder: ['SVO', 'SOV', 'VSO', 'VOS', 'OVS', 'OSV'],
    morphosyntacticAlignment: ['Nominative-Accusative',
        'Ergative-Absolutive',
        'Tripartite',
        'Austronesian/Arusian-like',
        'Other'],
    languageFamily: ['Indo-European',
        'Sino-Tibetan', 'Afro-Asiatic', 'Niger-Congo', 'Austronesian',
        'Dravidian', 'Turkic', 'Uralic',
        'Other'],
    verbalTenses: ['Present, Past, Future',
        'Past, Non-Past', 'Present, Non-Present',
        'No Tenses', 'Other'],
    typeOfMorphology: ['Analytic', 'Synthetic', 'Agglutinative', 'Isolating', 'Mixed']
}