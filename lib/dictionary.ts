import { IWord, IResult } from "@/schema/types/dictionary";

export function calculateDuplicateEntries(words: IWord[]): IResult {
    const normalizeText = (value: unknown) => String(value ?? "").trim().toLowerCase();

    const sortByLexicalItem = (items: IWord[]) =>
        [...items].sort((a, b) => normalizeText(a.lexical_item).localeCompare(normalizeText(b.lexical_item)));

    const groups = new Map<string, IWord[]>();

    for (const word of words) {
        const key = `${normalizeText(word.lexical_item)}::${normalizeText(word.definition)}`;
        const group = groups.get(key);

        if (group) {
            group.push(word);
        } else {
            groups.set(key, [word]);
        }
    }

    const duplicates = sortByLexicalItem(
        Array.from(groups.values())
            .filter((group) => group.length > 1)
            .flat(),
    );

    return { number: duplicates.length, data: duplicates };
}

export function calculateHomonyns(words: IWord[]): IResult {
    const normalizeText = (value: unknown) => String(value ?? "").trim().toLowerCase();

    const sortByLexicalItem = (items: IWord[]) =>
        [...items].sort((a, b) => normalizeText(a.lexical_item).localeCompare(normalizeText(b.lexical_item)));

    const groups = new Map<string, IWord[]>();

    for (const word of words) {
        const key = normalizeText(word.lexical_item);
        const group = groups.get(key);

        if (group) {
            group.push(word);
        } else {
            groups.set(key, [word]);
        }
    }

    const homonyms = sortByLexicalItem(
        Array.from(groups.values())
            .filter((group) => {
                const uniqueDefinitions = new Set(
                    group.map((word) => normalizeText(word.definition)),
                );

                return uniqueDefinitions.size > 1;
            })
            .flat(),
    );

    return { number: homonyms.length, data: homonyms };
}

export function calculateWordsWithEmptyPOS(words: IWord[]): IResult {
    const normalizeText = (value: unknown) => String(value ?? "").trim().toLowerCase();

    const data = words.filter((word) => normalizeText(word.pos) === "");

    return { number: data.length, data };
}