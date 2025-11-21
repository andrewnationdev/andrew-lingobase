import { BANNED_WORDS } from "@/schema/data";
import { showErrorToast } from "./toast";

//This is the module for moderating comments in the platform
const banned_words = BANNED_WORDS;

let bannedCount = 0;

interface IResult {
    accepted: boolean;
    reason?: string;
}

export function moderate(comment:string):boolean {
    let text = comment
    let result: IResult = acceptOrReject(text, banned_words)

    if(result.accepted){
        return true;
    }

    showErrorToast(result.reason)
    return false;
}

function acceptOrReject(text:string, banned:string[]):IResult {
    let lowerText = text.toLowerCase();
    for (let i = 0; i < banned.length; i++) {
        let word = banned[i].toLowerCase();
        if (lowerText.includes(word)) {
            bannedCount++;
        }
    }
    
    return {
        accepted: bannedCount === 0,
        reason: bannedCount > 0 ? `Comment contains ${bannedCount} banned words.` : undefined
    }
}