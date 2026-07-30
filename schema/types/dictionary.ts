export interface IWord {
  id?: string | number;
  lexical_item: string;
  definition: string;
  pos: string;
  notes: string;
  transliteration: string;
  conlang_code: string;
  owner: string;
}

export interface IResult {
  number: number;
  data: IWord[];
}