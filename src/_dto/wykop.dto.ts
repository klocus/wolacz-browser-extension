export interface Author {
  avatar: string;
  blacklist: boolean;
  color: string;
  company: boolean;
  follow: boolean;
  gender: string;
  note: boolean;
  online: boolean;
  rank: { position: number, trend: number };
  status: string;
  username: string;
  verified: boolean;
}

export interface NewEntry {
  adult: boolean;
  content: string;
  embed: null;
  photo: null;
}
