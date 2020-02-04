export interface Company {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  tags: string[];
  amount: number;
  dateStart: number;
  dateEnd: number;
  currentAmount: number;
}
