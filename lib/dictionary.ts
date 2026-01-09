import { IWord } from "@/components/ui/dictionary";

export interface IHomonynsResult {
    number: number;
    homonyms: IWord[] | undefined;
}

export function calculateHomonyns(words: IWord[]): IHomonynsResult {
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
    } else return {number: 0, homonyms: undefined};

    return {number: counter, homonyms: homonyms}
}