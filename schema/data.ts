export const partsOfSpeech = [
  { value: "", label: "Select part of speech" },
  { value: "noun", label: "Noun" },
  { value: "pronoun", label: "Pronoun" },
  { value: "verb", label: "Verb" },
  { value: "adjective", label: "Adjective" },
  { value: "adverb", label: "Adverb" },
  { value: "preposition", label: "Preposition" },
  { value: "conjunction", label: "Conjunction" },
  { value: "interjection", label: "Interjection" },
  { value: "determiner", label: "Determiner" },
  { value: "morpheme", label: "Morpheme, Affix" },
  { value: "particle", label: "Particle" },
  { value: "adposition", label: "Adposition" },
  { value: "postposition", label: "Postposition" },
  { value: "prefix", label: "Prefix" },
  { value: "suffix", label: "Suffix" },
  { value: "infix", label: "Infix" },
  { value: "circumfix", label: "Circumfix" },
  { value: "phrases", label: "Phrases, Slang, Expressions, etc." },
  { value: "numeral", label: "Numeral" },
  { value: "discourse", label: "Discourse Marker" },
  { value: "other", label: "Other" },
];

export const TypologyFieldTitles = {
  word_order: "Word Order",
  morphosyntactic_alignment: "Morphosyntactic Alignment",
  language_family: "Language Family",
  verbal_tenses: "Verbal Tenses",
  type_morphology: "Type of Morphology",
  pro_drop: "Pro-drop",
  formality_system: "Formality System",
  vowel_inventory: "Vowel Inventory",
  tonal: "Tonal",
  syllable_structure: "Syllable Structure",
  morphological_number: "Morphological Number",
  inclusivity: "Does it feature inclusivity in 1.PL?",
  gender_system: "Gender System"
};

export const TypologySchema = {
  word_order: [
    "SVO",
    "SOV",
    "VSO",
    "VOS",
    "OVS",
    "OSV",
    "German/Dutch-like V2",
    "No Default Word Order",
    "Pragmatic Word Order",
  ],
  morphosyntactic_alignment: [
    "Nominative-Accusative",
    "Ergative-Absolutive",
    "Tripartite",
    "Austronesian/Arusian-like",
    "Other",
  ],
  language_family: [
    "Indo-European",
    "Sino-Tibetan",
    "Afro-Asiatic",
    "Niger-Congo",
    "Austronesian",
    "Dravidian",
    "Turkic",
    "Uralic",
    "Nostratic",
    "Boreal",
    "Austral",
    "Austronesian",
    "Bantu",
    "Other",
  ],
  verbal_tenses: [
    "Present, Past, Future",
    "Past, Non-Past",
    "Present, Non-Present",
    "No Tenses",
    "Other",
  ],
  type_morphology: [
    "Analytic",
    "Synthetic",
    "Agglutinative",
    "Isolating",
    "Non-Concatenative",
    "Mixed",
  ],
  pro_drop: [
    "No",
    "Partial",
    "Yes (Only the Subject)",
    "Yes (Both Subject and Object)",
    "Yes (Only the Object)",
  ],
  formality_system: [
    "No Formality Distinctions",
    "T-V Distinction",
    "Honorifics",
    "Mixed"
  ],
  vowel_inventory: [
    "No Length and Nasality",
    "Long and Short Vowels",
    "Presence of Nasalization",
    "Long, Short and Nasal Vowels",
    "Complex",
  ],
  tonal: ["Non-Tonal", "Tonal", "Pitch Accent"],
  syllable_structure: ["CV", "CVC", "CCV", "CCVC", "Complex"],
  inclusivity: ["No", "Inclusive and Exclusive WE"],
  morphological_number: ["No distinction", "Singular and Plural", "Singular, Dual, and Plural", "Other System"],
  gender_system: [
    "No Grammatical Gender",
    "Masculine and Feminine",
    "Masculine, Feminine, and Neuter",
    "Common and Neuter",
    "Animate and Inanimate",
    "Virile and Non-Virile",
    "Noun Classes (Bantu Type)",
    "Other"
  ]
};

export const LiteratureGenres = [
  "Fantasy",
  "Science Fiction",
  "Romance",
  "Horror",
  "Mystery",
  "Non-Fiction",
  "Historical Fiction",
  "Thriller",
  "Young Adult",
  "Dystopian",
  "Adventure",
  "Drama",
  "Comedy",
  "Poetry",
  "Other"
]

export const MOD_EMAIL = "mailto:andrewnationdev@gmail.com"

export const BANNED_WORDS = ["banned"]