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
  likes: number;
}
