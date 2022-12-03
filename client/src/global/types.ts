export interface TabObject {
  _id: string;
  name: string;
  clause: string;
  thesaurus: string[];
  similar: string[];
  antonymous: string[];
}

export interface WordObject {
  tabs: string[];
  whoCreated?: string;
  word: string;
  __v?: number;
  _id: string;
}
