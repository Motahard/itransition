import {User} from "./user.class";

export interface Company {
  _id?: string;
  owner: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  amount: number;
  dateStart: number;
  dateEnd: number;
  currentAmount: number;
  youtubeLink?: string;
  bonuses?: Bonuse[];
  comments?: CompanyMessage[];
  news?: CompanyNews[];
  rates?: Rate;
}

interface Rate {
  _id?: string;
  count: number;
  rate: number;
}

interface Bonuse {
  name: string;
  price: number;
  description: string;
}

export interface CompanyMessage {
  _id?: string;
  username: string;
  userId: string;
  message: string;
  date: number;
  likes: number;
}

export interface CompanyNews {
  _id?: string;
  title: string;
  description: string;
  date: number;
  img?: Image;
}

interface Image {
  URL: string;
  path: string;
}
