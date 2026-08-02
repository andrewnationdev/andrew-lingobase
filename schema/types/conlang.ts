export type ConlangLink = {
  title: string;
  url: string;
};

export type ConlangCustomLinks = {
  link1: ConlangLink;
  link2: ConlangLink;
};

export type ConlangComment = {
  id: string;
  text: string;
  author: string;
  createdAt: string;
};

export type ConlangRatings = {
  likes: string[];
  dislikes: string[];
  comments: ConlangComment[];
};

export type ConlangRecord = {
  english_name: string;
  id: string;
  code: string;
  created_at: string;
  created_by: string;
  summary: string;
  native_name: string;
  custom_links: ConlangCustomLinks;
  ratings: ConlangRatings;
  grammar_doc?: string | null;
};