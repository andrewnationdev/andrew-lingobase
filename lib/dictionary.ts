import { IWord } from "@/components/ui/dictionary";

export interface IResult {
    number: number;
    data: IWord[] | undefined;
}

export function calculateDuplicateEntries(words: IWord[]): IResult {
    let counter = 0;
    let duplicates = []

    if(words.length > 0){
        for(let w = 0; w < words.length; w++){
            const currWord = words[w];
            
            for(let c = 0; c < words.length; c++){
                const compareWord = words[c];

                if(currWord.lexical_item.toLowerCase() == compareWord.lexical_item.toLowerCase() &&
                    currWord.definition.toLowerCase() == compareWord.definition.toLowerCase() &&
                    currWord.id != compareWord.id){
                        counter++;
                        duplicates.push(currWord);
                }
            }
        }
    } else return {number: 0, data: undefined};

    if(duplicates.length > 0){
        duplicates = duplicates.sort((a, b) => a.lexical_item.localeCompare(b.lexical_item));
    }

    return {number: counter, data: duplicates}
}

export function calculateHomonyns(words: IWord[]): IResult {
    let counter = 0;
    let homonyms = []

    if(words.length > 0){
        for(let w = 0; w < words.length; w++){
            const currWord = words[w];

            for(let c = 0; c < words.length; c++){
                const compareWord = words[c];

                if(currWord.lexical_item.toLowerCase() == compareWord.lexical_item.toLowerCase() &&
                    currWord.definition.toLowerCase() != compareWord.definition.toLowerCase() &&
                    currWord.id != compareWord.id){
                        counter++;
                        homonyms.push(currWord);
                }
            }
        }
    } else return {number: 0, data: undefined};

    if(homonyms.length > 0){
        homonyms = homonyms.sort((a, b) => a.lexical_item.localeCompare(b.lexical_item));
    }

    return {number: counter, data: homonyms}
}

export function calculateWordsWithEmptyPOS(words: IWord[]): IResult {
    const data = words.filter(word => word.pos.trim() === "");
    return {number: data.length, data: data}
}