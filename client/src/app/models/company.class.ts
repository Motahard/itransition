export interface Company {
  _id?: string;
  owner: string;
  title: string;
  description: string;
  category: string;
  tags?: string;
  amount: number;
  dateStart: number;
  dateEnd: number;
  currentAmount: number;
  youtubeLink?: string;
  bonuses?: Bonuse[];
}

interface Bonuse {
  name: string;
  price: number;
  description: string;
}
