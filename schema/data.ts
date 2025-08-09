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

export const TypologyFieldTitles = {
    word_order: 'Word Order',
    morphosyntactic_alignment: 'Morphosyntactic Alignment',
    language_family: 'Language Family',
    verbal_tenses: 'Verbal Tenses',
    type_morphology: 'Type of Morphology'
}

export const TypologySchema = {
    word_order: ['SVO', 'SOV', 'VSO', 'VOS', 'OVS', 'OSV', 'No Default Word Order', 'Pragmatic Word Order'],
    morphosyntactic_alignment: ['Nominative-Accusative',
        'Ergative-Absolutive',
        'Tripartite',
        'Austronesian/Arusian-like',
        'Other'],
    language_family: ['Indo-European',
        'Sino-Tibetan', 'Afro-Asiatic', 'Niger-Congo', 'Austronesian',
        'Dravidian', 'Turkic', 'Uralic',
        'Other'],
    verbal_tenses: ['Present, Past, Future',
        'Past, Non-Past', 'Present, Non-Present',
        'No Tenses', 'Other'],
    type_morphology: ['Analytic', 'Synthetic', 'Agglutinative', 'Isolating', 'Mixed']
}